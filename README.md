# 커리어그램(Careergram) 🤝
코딩 부트캠프에서 진행했던 팀 프로젝트 작품입니다.
- 2023년 7월 10일부터 2023년 7월 22일까지 약 2주간 진행했습니다.
- 프론트엔드 개발 팀원 2명, 백엔드 개발 팀원 3명으로 구성된 팀이 풀스택 웹앱의 기본적인 구조 설계 및 CRUD, 인증, API 시스템 구축을 실습했습니다.
- 부트캠프에서 자체적으로 호스팅하는 사설 GitLab 인스턴스에 있던 repo의 최종 브랜치를 클론해왔으며, 이후 리팩토링/개선/버그픽스는 개인적으로 진행하고 있습니다.

## 프로덕트 설명
나만의 커리어 포트폴리오를 만들고 다른 사람들과 공유하자! 다양한 분야의 사람들과 친목을 쌓고 취업/이직 정보와 업계 소식 등을 공유할 수 있는 소셜 커리어 서비스입니다.

## 역할 및 담당
백엔드 개발으로 참여했으며 프론트엔드 개발에 협업했습니다.
- 백엔드 개발
	- 피처 개발
		- 사용자 계정을 다루는 user 피쳐
			- Nodemailer를 활용한 비밀번호 초기화 기능
				- SMTP credential의 보안을 위해 Gmail App Password 대신 OAuth 2.0 기반의 토큰을 사용했습니다.
		- 사용자의 이력 중 학력 정보를 다루는 education 피쳐와 게시판 역할의 textboard 피쳐
			- MongoDB의 ODM인 Mongoose를 사용해 presentation-business-persistence 레이어를 구현했습니다.
			- indexing을 사용해 탐색 성능을 향상시키고자 했습니다.
			- multer 미들웨어를 사용해 증빙서류 파일 업로드 기능을 구현했습니다.
	- 보안
		- express-validator를 미들웨어로 사용해 기초적인 URL 파라미터 sanitization을 도입했습니다.
	- 데이터베이스
		- 기초적인 ERD와 스키마를 설계했습니다.
	- REST API
		- 백엔드 API 구조를 RESTful 규격에 부합하도록 구성했습니다.
- 프론트엔드 협업
	- React
		- 프론트엔드에서 사용자에게 표시되는 목록형 정보를 백엔드에서 server-side pagination으로 구현하는 부분에서 협업했습니다.
		- axios를 사용해 백엔드와 REST API를 연동하는 부분에서 협업했습니다.

## 기술 스택
- 프론트엔드
    - HTML5 + CSS + JavaScript
    - React
        - react-bootstrap
        - bootstrap-icons
        - styled-components
- 백엔드
    - Node.js + Express
        - express-validator
        - multer
        - nodemailer
            - Gmail API with OAuth2
    - MongoDB
        - Mongoose ODM

## 주요 기능
- 사용자 계정 관리
    - 회원 가입
    - 비밀번호 초기화
    - 회원 탈퇴
- 개인 포트폴리오 관리
    - 프로필 관리
        - 프로필 사진 업로드
        - 이름 및 연락처 (소셜 미디어 계정)
    - 이력 관리
        - 학력사항 추가/수정/삭제
        - 자격사항 추가/수정/삭제
        - 수상사항 추가/수정/삭제
        - 프로젝트 이력 추가/수정/삭제
- 커리어 네트워킹
    - 로그인시 회원 목록 및 포트폴리오 열람
- 게시판
    - 자유게시판
    - 취업 및 이직 정보 게시판
    - 커리어 조언 게시판
    - 업계 소식 게시판