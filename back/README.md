# 커리어그램 - 백엔드

## 패키지 매니저
- yarn을 사용하고 있습니다.
- 다음 명령어로 yarn을 설치할 수 있습니다.
    - `$ npm install --global yarn`

## 실행 방법
- 다음 명령어로 백엔드 서비스를 시작할 수 있습니다.
    - `$ yarn start`

## 환경 변수
- Express 서버
    - `SERVER_PORT=5001`
- MongoDB Atlas
    - `MONGODB_URL=***`
- JWT Secret Key
    - `JWT_SECRET_KEY=***`
- Gmail API OAuth 2.0
    ```
    EMAIL="***@gmail.com"
    REFRESH_TOKEN="***"
    CLIENT_SECRET="GOCSPX-***"
    CLIENT_ID="***.apps.googleusercontent.com"
    ```

## 디렉토리 구조
- db
    - 데이터베이스 관련 CRUD 로직을 처리하는 persistence layer 디렉토리
        - index.js
            - Mongoose가 MongoDB Atlas에 접속할 수 있도록 하는 코드
        - schemas
            - MongoDB 스키마가 저장되어 있는 디렉토리
        - models
            - Mongoose 모델이 저장되어 있는 디렉토리
- middlewares
    - express에서 사용되는 미들웨어들이 저장되어 있는 디렉토리
        - login_required.js
            - jwt토큰을 다루는 미들웨어
        - errorMiddleware.js
            - 편의를 위해 일괄적으로 HTTP 400 에러를 반환하는 에러 핸들러
- routers
    - HTTP 요청과 응답을 비즈니스 계층으로 전송하는 라우터들이 저장되어 있는 presentation layer 디렉토리
- services
    - 각 기능별 비즈니스 로직을 수행하는 서비스들이 저장되어 있는 persistence layer 디렉토리