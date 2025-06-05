// generateLargeDataset.js - 대규모 테스트 데이터 생성기
const fs = require('fs');

function generateLargeDataset() {
    console.log('🚀 대규모 테스트 데이터 생성 시작...');
    
    // 대규모 데이터 설정
    const numBlocks = 50;      // 50개 블록
    const numTasks = 10;       // task1~task10
    const numCores = 8;        // core1~core8
    
    let content = '';
    let totalDataPoints = 0;
    
    for (let block = 1; block <= numBlocks; block++) {
        // 헤더 라인
        content += '\t';
        for (let t = 1; t <= numTasks; t++) {
            content += `task${t}\t`;
        }
        content += '\n';
        
        // 데이터 라인들
        for (let c = 1; c <= numCores; c++) {
            content += `core${c}\t`;
            
            for (let t = 1; t <= numTasks; t++) {
                // 현실적인 성능 데이터 생성 (300~2000 범위)
                let value;
                
                // 일부 이상치 생성 (5% 확률)
                if (Math.random() < 0.05) {
                    value = Math.floor(Math.random() * 3000) + 2000; // 2000~5000 (이상치)
                } else {
                    // 정상 범위
                    const baseValue = 800 + (c * 50) + (t * 30); // core와 task에 따른 기본값
                    const variance = Math.floor(Math.random() * 400) - 200; // ±200 변동
                    value = Math.max(300, baseValue + variance); // 최소 300
                }
                
                content += `${value}\t`;
                totalDataPoints++;
            }
            content += '\n';
        }
        
        // 블록 간 빈 줄
        if (block < numBlocks) {
            content += '\n';
        }
        
        // 진행률 표시
        if (block % 10 === 0) {
            console.log(`📊 진행률: ${block}/${numBlocks} 블록 완료`);
        }
    }
    
    // 파일 저장
    const filename = 'largeDataset.txt';
    fs.writeFileSync(filename, content);
    
    console.log(`✅ 대규모 데이터셋 생성 완료!`);
    console.log(`📁 파일명: ${filename}`);
    console.log(`📊 총 데이터 포인트: ${totalDataPoints.toLocaleString()}개`);
    console.log(`📋 구성: ${numBlocks}개 블록 × ${numCores}개 Core × ${numTasks}개 Task`);
    console.log(`📈 예상 이상치: 약 ${Math.floor(totalDataPoints * 0.05)}개`);
    console.log(`💾 파일 크기: ${Math.round(fs.statSync(filename).size / 1024)}KB`);
}

function generateMultipleFiles() {
    console.log('🔄 다양한 크기의 테스트 파일 생성...');
    
    // 1. 소규모 (5×5×5 = 125개)
    generateDataFile('smallDataset.txt', 5, 5, 5);
    
    // 2. 중규모 (20×6×8 = 960개) 
    generateDataFile('mediumDataset.txt', 20, 6, 8);
    
    // 3. 대규모 (100×10×12 = 12,000개)
    generateDataFile('hugeDataset.txt', 100, 10, 12);
    
    console.log('✅ 모든 테스트 파일 생성 완료!');
}

function generateDataFile(filename, blocks, cores, tasks) {
    let content = '';
    let totalPoints = 0;
    
    for (let block = 1; block <= blocks; block++) {
        // 헤더
        content += '\t';
        for (let t = 1; t <= tasks; t++) {
            content += `task${t}\t`;
        }
        content += '\n';
        
        // 데이터
        for (let c = 1; c <= cores; c++) {
            content += `core${c}\t`;
            for (let t = 1; t <= tasks; t++) {
                const value = Math.floor(Math.random() * 1500) + 300;
                content += `${value}\t`;
                totalPoints++;
            }
            content += '\n';
        }
        
        if (block < blocks) content += '\n';
    }
    
    fs.writeFileSync(filename, content);
    console.log(`📁 ${filename}: ${totalPoints.toLocaleString()}개 데이터 포인트`);
}

// 실행
if (require.main === module) {
    console.log('🎯 대규모 프로파일링 데이터 생성기');
    console.log('================================');
    
    // 기본 대규모 데이터셋
    generateLargeDataset();
    
    console.log('\n🔄 추가 테스트 파일들 생성 중...');
    generateMultipleFiles();
    
    console.log('\n🎉 모든 테스트 데이터 생성 완료!');
    console.log('\n📋 생성된 파일들:');
    console.log('• smallDataset.txt   - 소규모 (125개 데이터)');
    console.log('• mediumDataset.txt  - 중규모 (960개 데이터)'); 
    console.log('• largeDataset.txt   - 대규모 (4,000개 데이터)');
    console.log('• hugeDataset.txt    - 초대규모 (12,000개 데이터)');
    console.log('\n🚀 이제 Enhanced Profiler로 성능 테스트를 진행하세요!');
}

module.exports = { generateLargeDataset, generateMultipleFiles };
