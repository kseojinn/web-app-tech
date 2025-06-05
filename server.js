// server.js - 매트릭스 파싱 수정 버전
require('dotenv').config();

const express = require('express');
const multer = require('multer');
const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
const { Worker } = require('worker_threads');

const app = express();
const PORT = process.env.PORT || 3000;

// 데이터베이스 설정
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'javaweb_profiler'
};

// 미들웨어 설정
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static('public'));

// 파일 업로드 설정
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      await fs.mkdir('./uploads', { recursive: true });
      cb(null, './uploads');
    } catch (err) {
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    cb(null, `${timestamp}_${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (['.txt', '.csv', '.log'].includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('지원하지 않는 파일 형식입니다.'));
    }
  }
});

// 데이터베이스 연결
let dbConnection;

async function initializeDatabase(connection) {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS analysis_results (
      id INT AUTO_INCREMENT PRIMARY KEY,
      filename VARCHAR(255) NOT NULL,
      filepath VARCHAR(500) NOT NULL,
      total_records INT NOT NULL,
      processing_time DECIMAL(10,3) NOT NULL,
      detailed_results JSON NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_filename (filename),
      INDEX idx_created_at (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;
  
  await connection.execute(createTableQuery);
}

// 메인 페이지
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 파일 업로드 및 분석 - 수정된 파싱 로직
app.post('/upload', upload.single('dataFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log(`📁 파일 업로드: ${req.file.originalname}`);
    
    // 수정된 매트릭스 파싱 로직 사용
    const analysisResult = await analyzeMatrixFile(req.file.path);
    
    // 데이터베이스에 결과 저장
    const savedResults = await saveAnalysisResults(dbConnection, {
      filename: req.file.originalname,
      filepath: req.file.path,
      ...analysisResult
    });

    res.json({
      success: true,
      filename: req.file.originalname,
      analysisId: savedResults.insertId,
      results: analysisResult,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ 분석 오류:', error);
    res.status(500).json({ 
      error: '분석 실패', 
      details: error.message 
    });
  }
});

// 수정된 매트릭스 파일 분석 함수
async function analyzeMatrixFile(filePath) {
  const startTime = Date.now();
  
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const lines = content.split('\n').map(line => line.trimEnd());
    
    console.log(`📊 총 ${lines.length}개 라인 처리 시작`);
    
    const data = {
      tasks: {},
      cores: {},
      rawValues: [],
      timeline: []
    };

    let currentTasks = [];
    let dataIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // 빈 라인 건너뛰기
      if (!line.trim()) continue;
      
      // 탭으로 분리
      const parts = line.split('\t').map(part => part.trim());
      
      // Task 헤더 라인 감지 (첫 번째 컬럼이 비어있고 task1, task2... 포함)
      if (parts[0] === '' && parts.length > 1 && parts.some(part => part.includes('task'))) {
        currentTasks = parts.slice(1).filter(task => task); // 빈 문자열 제거
        console.log(`📋 Task 헤더 발견: ${currentTasks.join(', ')}`);
        continue;
      }
      
      // 데이터 라인 처리 (core로 시작하는 라인)
      if (parts[0] && parts[0].includes('core') && currentTasks.length > 0) {
        const coreId = parts[0];
        const values = parts.slice(1, currentTasks.length + 1).map(val => parseFloat(val));
        
        console.log(`🔍 ${coreId}: ${values.length}개 값 처리`);
        
        // 각 Task-Core 조합에 대해 데이터 저장
        for (let j = 0; j < Math.min(values.length, currentTasks.length); j++) {
          const taskId = currentTasks[j];
          const value = values[j];
          
          if (!isNaN(value)) {
            // Task별 데이터 그룹화
            if (!data.tasks[taskId]) data.tasks[taskId] = [];
            data.tasks[taskId].push(value);
            
            // Core별 데이터 그룹화
            if (!data.cores[coreId]) data.cores[coreId] = [];
            data.cores[coreId].push(value);
            
            // 전체 데이터
            data.rawValues.push(value);
            
            // 타임라인 데이터
            data.timeline.push({
              index: dataIndex++,
              taskId,
              coreId,
              value,
              timestamp: Date.now() + dataIndex
            });
          }
        }
      }
    }

    console.log(`✅ 파싱 완료: 총 ${data.rawValues.length}개 데이터 포인트`);
    console.log(`📊 Task별 데이터: ${Object.keys(data.tasks).length}개 Task`);
    console.log(`🖥️ Core별 데이터: ${Object.keys(data.cores).length}개 Core`);

    // 통계 계산
    const summary = calculateStats(data.rawValues);
    const taskAnalysis = {};
    const coreAnalysis = {};

    Object.entries(data.tasks).forEach(([taskId, values]) => {
      taskAnalysis[taskId] = calculateDetailedStats(values);
    });

    Object.entries(data.cores).forEach(([coreId, values]) => {
      coreAnalysis[coreId] = calculateDetailedStats(values);
    });

    // 간단한 추세 계산
    const trends = data.timeline.length > 1 ? {
      movingAverage: data.timeline.slice(-10).map((item, index) => ({
        index,
        value: item.value
      })),
      direction: 'stable'
    } : null;

    // 간단한 분포 계산
    const distribution = {
      bins: [
        { start: summary.min, end: summary.max, count: data.rawValues.length }
      ]
    };

    return {
      summary,
      taskAnalysis,
      coreAnalysis,
      trends,
      distribution,
      totalRecords: data.rawValues.length,
      processingTime: (Date.now() - startTime) / 1000
    };

  } catch (error) {
    throw new Error(`파일 분석 실패: ${error.message}`);
  }
}

// 기본 통계 계산 함수
function calculateStats(values) {
  if (!values || values.length === 0) return null;

  const sorted = [...values].sort((a, b) => a - b);
  const sum = values.reduce((a, b) => a + b, 0);
  const avg = sum / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length;

  return {
    count: values.length,
    min: Math.min(...values),
    max: Math.max(...values),
    avg: avg,
    sum: sum,
    median: sorted[Math.floor(sorted.length / 2)],
    stdDev: Math.sqrt(variance),
    variance: variance,
    range: Math.max(...values) - Math.min(...values)
  };
}

// 상세 통계 계산
function calculateDetailedStats(values) {
  const basicStats = calculateStats(values);
  const sorted = [...values].sort((a, b) => a - b);
  
  return {
    ...basicStats,
    percentiles: {
      p25: calculatePercentile(sorted, 25),
      p50: calculatePercentile(sorted, 50),
      p75: calculatePercentile(sorted, 75),
      p90: calculatePercentile(sorted, 90),
      p95: calculatePercentile(sorted, 95),
      p99: calculatePercentile(sorted, 99)
    },
    outliers: detectOutliers(values)
  };
}

function calculatePercentile(sortedValues, percentile) {
  const index = (percentile / 100) * (sortedValues.length - 1);
  if (Math.floor(index) === index) {
    return sortedValues[index];
  } else {
    const lower = sortedValues[Math.floor(index)];
    const upper = sortedValues[Math.ceil(index)];
    return lower + (upper - lower) * (index - Math.floor(index));
  }
}

function detectOutliers(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const q1 = calculatePercentile(sorted, 25);
  const q3 = calculatePercentile(sorted, 75);
  const iqr = q3 - q1;
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;
  
  return values.filter(value => value < lowerBound || value > upperBound);
}

// 분석 결과 저장 - 개선된 버전
async function saveAnalysisResults(connection, analysisData) {
  try {
    console.log(`💾 분석 결과 저장 시작: ${analysisData.filename}`);
    
    const query = `
      INSERT INTO analysis_results 
      (filename, filepath, total_records, processing_time, detailed_results)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    const detailedResultsJson = JSON.stringify({
      summary: analysisData.summary,
      taskAnalysis: analysisData.taskAnalysis,
      coreAnalysis: analysisData.coreAnalysis,
      trends: analysisData.trends,
      distribution: analysisData.distribution
    });
    
    const [result] = await connection.execute(query, [
      analysisData.filename,
      analysisData.filepath,
      parseInt(analysisData.totalRecords),
      parseFloat(analysisData.processingTime),
      detailedResultsJson
    ]);
    
    console.log(`✅ 분석 결과 저장 완료: ID ${result.insertId}`);
    return result;
    
  } catch (error) {
    console.error('❌ 데이터 저장 오류:', error);
    throw error;
  }
}

// 분석 결과 조회
app.get('/analysis/:id', async (req, res) => {
  try {
    const [rows] = await dbConnection.execute(
      'SELECT * FROM analysis_results WHERE id = ?',
      [req.params.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Analysis not found' });
    }
    
    const result = rows[0];
    const detailedResults = JSON.parse(result.detailed_results);
    
    res.json({
      id: result.id,
      filename: result.filename,
      summary: {
        totalRecords: result.total_records,
        processingTime: result.processing_time,
        createdAt: result.created_at
      },
      statistics: detailedResults
    });
    
  } catch (error) {
    console.error('분석 조회 오류:', error);
    res.status(500).json({ error: 'Failed to retrieve analysis' });
  }
});

// 분석 이력 조회 - 수정된 버전
app.get('/analysis', async (req, res) => {
  try {
    // 파라미터 안전하게 처리
    let limit = parseInt(req.query.limit);
    let offset = parseInt(req.query.offset);
    
    // NaN 체크 및 기본값 설정
    if (isNaN(limit) || limit <= 0) limit = 10;
    if (isNaN(offset) || offset < 0) offset = 0;
    
    console.log(`📋 분석 이력 조회: LIMIT ${limit}, OFFSET ${offset}`);
    
    const [rows] = await dbConnection.execute(
      `SELECT id, filename, total_records, processing_time, created_at 
       FROM analysis_results 
       ORDER BY created_at DESC 
       LIMIT ${limit} OFFSET ${offset}`
    );
    
    console.log(`✅ ${rows.length}개 이력 조회 완료`);
    
    res.json({
      analyses: rows,
      pagination: { limit, offset, total: rows.length }
    });
    
  } catch (error) {
    console.error('❌ 분석 목록 오류:', error);
    res.status(500).json({ error: 'Failed to retrieve analysis list', details: error.message });
  }
});

// 시스템 상태
app.get('/status', (req, res) => {
  const memUsage = process.memoryUsage();
  
  res.json({
    server: {
      pid: process.pid,
      uptime: Math.floor(process.uptime()),
      version: process.version
    },
    memory: {
      rss: Math.round(memUsage.rss / 1024 / 1024) + 'MB',
      heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024) + 'MB',
      heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024) + 'MB'
    }
  });
});

// 에러 핸들링
app.use((error, req, res, next) => {
  console.error('서버 오류:', error);
  res.status(500).json({ 
    error: '서버 내부 오류',
    message: error.message
  });
});

// 서버 시작
async function startServer() {
  try {
    // 데이터베이스 연결
    dbConnection = await mysql.createConnection(dbConfig);
    await initializeDatabase(dbConnection);
    console.log('✅ 데이터베이스 연결 성공!');
    
    // 서버 시작
    app.listen(PORT, () => {
      console.log(`🚀 Enhanced Profiler Server 실행 중!`);
      console.log(`📍 URL: http://localhost:${PORT}`);
      console.log(`📊 매트릭스 파싱 로직 적용됨`);
      console.log(`✅ 모든 준비 완료! 브라우저에서 접속하세요.`);
    });
    
  } catch (error) {
    console.error('❌ 서버 시작 실패:', error);
    process.exit(1);
  }
}

// 우아한 종료
process.on('SIGINT', async () => {
  console.log('서버를 종료합니다...');
  if (dbConnection) {
    await dbConnection.end();
  }
  process.exit(0);
});

startServer();
