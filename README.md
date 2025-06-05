🚀 Enhanced Node.js Profiler
Node.js를 활용한 고성능 데이터 프로파일링 및 분석 시스템
✨ 주요 기능

🔄 멀티스레딩 처리: Worker Threads를 활용한 비동기 파일 분석
📊 고급 통계 분석: 25+ 통계 지표 (백분위수, 이상치 탐지, 추세 분석)
📈 인터랙티브 시각화: 5가지 Chart.js 기반 실시간 차트
🗄️ 효율적 데이터 관리: 단일 테이블 + JSON 컬럼 구조
⚡ 실시간 모니터링: 서버 상태 및 분석 이력 관리

🛠️ 기술 스택

Backend: Node.js, Express.js, Worker Threads
Database: MySQL 8.0+
Frontend: HTML5, CSS3, Chart.js
Tools: Multer, dotenv, mysql2

📋 시작하기
1️⃣ 사전 요구사항

Node.js 18+ 설치
MySQL 8.0+ 설치 및 실행

2️⃣ 설치
bash# 프로젝트 클론
git clone https://github.com/kseojinn/web-app-tech.git
cd web-app-tech/enhanced-nodejs-profiler

# 의존성 설치
npm install
3️⃣ 데이터베이스 설정
sql-- MySQL 접속 후 실행
mysql -u root -p

-- 데이터베이스 생성
CREATE DATABASE javaweb_profiler CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
4️⃣ 환경 변수 설정
.env 파일을 생성하고 다음 내용을 입력:
envDB_HOST=localhost
DB_USER=root
DB_PASSWORD=******
DB_NAME=javaweb_profiler
PORT=3000
NODE_ENV=development
5️⃣ 서버 실행
bashnode server.js
서버가 성공적으로 시작되면 다음 메시지가 표시됩니다:
✅ 데이터베이스 연결 성공!
🚀 Enhanced Profiler Server 실행 중!
📍 URL: http://localhost:3000
6️⃣ 웹 브라우저 접속
http://localhost:3000 에 접속하여 시스템을 사용할 수 있습니다.
