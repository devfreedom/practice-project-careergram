# 커리어그램 - 프론트엔드

## 패키지 매니저
- yarn을 사용하고 있습니다.
- 다음 명령어로 yarn을 설치할 수 있습니다.
    - `$ npm install --global yarn`

## 실행 방법
- 다음 명령어로 프론트엔드 서비스를 시작할 수 있습니다.
    - `$ yarn start`

## 디렉토리 구조
- components
    - common
        - 공통적으로 사용되는 컴포넌트들이 포함되어 있는 디렉토리
    - porfolio
        - 사용자의 포트폴리오를 구성하는 컴포넌트들이 포함되어 있는 디렉토리
    - login
        - 로그인 양식 관련 컴포넌트들이 포함되어 있는 디렉토리
    - network
        - 다른 사용자들의 포트폴리오를 열람하고 네트워킹 하는 기능에 사용되는 컴포넌트들이 포함되어 있는 디렉토리
    - register
        - 회원 가입 관련 컴포넌트들이 포함되어 있는 디렉토리
- context
    - EditContext.js 
        - 편집 상태 관리 코드
    - EducationContext.js 
        - modelContext 변환 예정
- pages 
    - 각 기능별 페이지들이 포함되어 있는 디렉토리
- services
    - api.js
        - CRUD DB 연결 함수 코드
- api.js
    - axios를 사용하는 boilerplate 코드
- App.js
    - SPA 라우팅 코드
- reducer.js
    - 로그인, 로그아웃은 useReducer 훅으로 구현되는데, 이 때 사용되는 reducer 함수 코드

## 로직 설명
1. 로그인 성공시 /portfolio에서 userId를 받아옴
2. /portfolio/user/UserContainer에서 UserCard.js와 PortfolioList로 userId 전달
3. userId를 통해 각 필드별 ContextProvider 생성
4. /portfolio/education/Education에서 userId를 통해 educationDocuments 받아오기
5. /portfolio/education/EducationItem에서 EducationItem으로 educationDocuments를 FieldDocumentBlock으로 map
6. map 한 결과를 FieldDocumentBlock으로 묶음
7. UserCard의 편집버튼 클릭시 전체 UserContainer의 EditContext의 상태 변환
8. UserCard는 UserEditForm을 렌더링
9. PortfolioList는 isEditing Context를 통해 FieldDocumentBlock의 수정/ 삭제 버튼 생성
10. 각 필드의 documents는 삭제 버튼 클릭시 해당 버튼 context를 변경
11. 각 필드의 documents는 수정 버튼 클릭시 isDocumentEditing State 통해 form 및 EducationEditAdd 렌더링
12. form의 확인 버튼 클릭시 업데이트 요청 후 해당 필드 context를 변경
13. EducationEditAdd의 + 버튼 클릭시 isAdding State를 통해 form 렌더링

## 기타
- 로그인 없이 네트워크 페이지 이동시 전체 유저보기만 가능
    - 포트폴리오 보기 클릭시 경고와 함께 회원가입 페이지 이동
