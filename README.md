<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
</head>
<body>

<h1>🚀 Enhanced Node.js Profiler</h1>

<p><strong>고성능 데이터 분석 및 프로파일링 도구</strong></p>

<p>Node.js를 활용하여 Task-Core 매트릭스 데이터를 분석하고 실시간으로 시각화하는 웹 애플리케이션입니다.</p>

<h2>✨ 주요 기능</h2>
<ul>
    <li>🔧 <strong>Worker Threads</strong>를 활용한 멀티스레딩 데이터 처리</li>
    <li>📊 <strong>25+ 고급 통계</strong> 지표 (평균, 표준편차, 백분위수, 이상치 탐지)</li>
    <li>📈 <strong>5가지 인터랙티브 차트</strong> (Chart.js 기반)</li>
    <li>⚡ <strong>실시간 분석</strong> 및 결과 표시</li>
    <li>🗄️ <strong>MySQL 데이터베이스</strong> 연동 및 이력 관리</li>
    <li>📱 <strong>반응형 웹 디자인</strong> (모바일 지원)</li>
</ul>

<h2>🛠️ 기술 스택</h2>
<ul>
    <li><strong>Backend</strong>: Node.js, Express.js, Worker Threads</li>
    <li><strong>Database</strong>: MySQL</li>
    <li><strong>Frontend</strong>: HTML5, JavaScript ES6+, Chart.js</li>
    <li><strong>File Processing</strong>: Multer, Custom Matrix Parser</li>
</ul>

<h2>📦 설치 및 실행</h2>

<h3>1. 사전 요구사항</h3>
<ul>
    <li>Node.js 설치</li>
    <li>MySQL 설치 및 실행</li>
</ul>

<h3>2. 프로젝트 클론</h3>
<pre><code>git clone https://github.com/kseojinn/web-app-tech.git
cd web-app-tech</code></pre>

<h3>3. 의존성 설치</h3>
<pre><code>npm install</code></pre>

<h3>4. DB password 변경</h3>
<p>.env 파일에서 자신의 DB password로 변경하세요.</p>

<h3>5. 데이터베이스 생성</h3>
<pre><code>mysql -u root -p
CREATE DATABASE javaweb_profiler;
USE javaweb_profiler;
EXIT;</code></pre>

<h3>6. 서버 실행</h3>
<pre><code>node server.js</code></pre>

<h3>7. 브라우저 접속</h3>
<p><code>http://localhost:3000</code>에 접속하여 사용하세요.</p>

<h2>📊 사용 방법</h2>

<h3>1. 파일 업로드</h3>
<ul>
    <li>지원 형식: <code>.txt</code>, <code>.csv</code>, <code>.log</code></li>
    <li>최대 파일 크기: 100MB</li>
    <li>드래그 앤 드롭 또는 파일 선택 버튼 사용</li>
</ul>

<h3>2. 데이터 형식</h3>
<p>Task-Core 매트릭스 형태의 데이터를 지원합니다:</p>
<pre><code>	task1	task2	task3	task4	task5
core1	886	749	849	909	352	
core2	959	849	788	1053	324	
core3	942	867	930	1064	365	
core4	820	817	816	929	336	
core5	803	786	929	958	329</code></pre>

<h3>3. 분석 결과 확인</h3>
<ul>
    <li><strong>전체 요약</strong>: 도넛 차트로 데이터 분포 확인</li>
    <li><strong>Task 분석</strong>: Task별 성능 비교 막대 차트</li>
    <li><strong>Core 분석</strong>: Core별 성능 추이 라인 차트</li>
    <li><strong>추세 분석</strong>: 시간대별 변화 패턴</li>
    <li><strong>분포 분석</strong>: 데이터 분포 히스토그램</li>
</ul>

<h2>🎯 주요 통계 지표</h2>
<ul>
    <li><strong>기본 통계</strong>: 개수, 최솟값, 최댓값, 평균, 중앙값</li>
    <li><strong>분산 지표</strong>: 표준편차, 분산, 범위</li>
    <li><strong>백분위수</strong>: P25, P50, P75, P90, P95, P99</li>
    <li><strong>이상치 탐지</strong>: IQR 방식 outlier 감지</li>
    <li><strong>추세 분석</strong>: 선형 회귀 기반 트렌드</li>
</ul>

<h2>📁 프로젝트 구조</h2>
<pre><code>enhanced-nodejs-profiler/
├── .env
├── server.js              # 메인 서버 파일
├── package.json           # 프로젝트 설정
├── public/
│   └── index.html         # 클라이언트 인터페이스
├── uploads/               # 업로드된 파일 저장
├── inputFile.txt          # 샘플 데이터
├── smallDataset.txt       # 테스트 데이터 (소)
├── mediumDataset.txt      # 테스트 데이터 (중)
├── largeDataset.txt       # 테스트 데이터 (대)
└── hugeDataset.txt        # 테스트 데이터 (초대형)</code></pre>

<h2>🚀 성능 특징</h2>
<ul>
    <li><strong>멀티스레딩</strong>: Worker Threads로 CPU 집약적 작업 분리</li>
    <li><strong>메모리 효율성</strong>: 스트림 기반 파일 처리</li>
    <li><strong>확장성</strong>: 클러스터 모드 지원 (프로덕션 환경)</li>
    <li><strong>응답성</strong>: 비동기 처리로 서버 블로킹 방지</li>
</ul>

<h2>📊 테스트 데이터</h2>
<p>다양한 크기의 테스트 데이터를 제공합니다:</p>
<ul>
    <li><code>inputFile.txt</code> - 250개 데이터 포인트 (10×5×5)</li>
    <li><code>smallDataset.txt</code> - 1,250개 데이터 포인트</li>
    <li><code>mediumDataset.txt</code> - 5,000개 데이터 포인트</li>
    <li><code>largeDataset.txt</code> - 25,000개 데이터 포인트</li>
    <li><code>hugeDataset.txt</code> - 100,000개 데이터 포인트</li>
</ul>

<h2>🐛 문제 해결</h2>

<h3>MySQL 연결 오류</h3>
<pre><code># MySQL 서비스 확인
net start MySQL80

# 데이터베이스 존재 확인
mysql -u root -p
SHOW DATABASES;</code></pre>

<h3>포트 충돌</h3>
<pre><code># 포트 사용 확인
netstat -an | findstr :3000

# .env 파일에서 포트 변경
PORT=3001</code></pre>

<h2>👨‍💻 개발자</h2>
<p><strong>Seojin Kang</strong></p>
<ul>
    <li>📧 Email: kseojin0205@sungkyul.ac.kr</li>
    <li>🐙 GitHub: <a href="https://github.com/kseojinn">https://github.com/kseojinn</a></li>
</ul>

<hr>

</body>
</html>
