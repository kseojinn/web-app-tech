# Enhanced Node.js Profiler
고성능 데이터 분석 및 프로파일링 도구
🚀 실행 방법
1. 환경 설정
bash# 프로젝트 클론
git clone https://github.com/kseojinn/web-app-tech.git
cd web-app-tech/enhanced-nodejs-profiler

# 의존성 설치
npm install
2. 데이터베이스 설정
bash# MySQL 접속
mysql -u root -p

# 데이터베이스 생성
CREATE DATABASE javaweb_profiler;
EXIT;
3. 환경 변수 설정
.env 파일을 생성하고 다음 내용을 입력:
envDB_HOST=localhost
DB_USER=root
DB_PASSWORD=mysql_password #수정해야함.
DB_NAME=javaweb_profiler
PORT=3000
NODE_ENV=development
4. 서버 실행
bashnode server.js
5. 브라우저 접속
http://localhost:3000
📊 테스트 데이터
프로젝트에 포함된 테스트 파일들:

inputFile.txt - 기본 테스트 데이터 (250개 데이터 포인트)
smallDataset.txt - 소규모 데이터셋
mediumDataset.txt - 중간 규모 데이터셋
largeDataset.txt - 대규모 데이터셋

🛠️ 기술 스택

Backend: Node.js, Express.js
Database: MySQL
Frontend: HTML5, CSS3, Chart.js
Processing: Worker Threads

📋 주요 기능

실시간 데이터 분석
5가지 인터랙티브 차트
이상치 탐지
고급 통계 분석
분석 이력 관리

📄 라이선스
MIT License
