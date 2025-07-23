# Lectory
### 멋사 2차 웹 프로젝트- 스프링부트를 활용한 유료구독 SNS 솔루션
<hr>

# Git 협업 규칙
# 1. 🚦 전체 흐름 요약
```scss
(feature/기능)
      ↓ PR
  [ develop ] ← staging 및 QA용
      ↓
  [ main ] ← 실서비스 배포
```
- 각자 기능 단위로 feature 브랜치 생성

- 기능 완료 후 develop 브랜치에 Pull Request(PR)

- QA 완료 후 main 브랜치로 병합 및 배포


# 2. 🌿 브랜치 전략
|브랜치명|설명|
|---|---|
|main|실제 서비스에 배포되는 브랜치|
|develop|통합 개발 브랜치 (모든 기능 병합)|
|feature/*|	개인 개발 브랜치 (기능 단위로 분기)|
|hotfix/*|긴급 수정용 브랜치 (배포 버그 등 대응)|


### 🔧 예시: feature/lecture_studuent, feature/posts

# 3. 🔁 PR (Pull Request) 규칙
### PR 대상: develop 브랜치

### PR 제목 규칙:

```css

[기능] 로그인 API 구현
[수정] 게시글 목록 페이징 오류 수정
[리팩토링] useEffect 정리
```
- ### PR 설명 필수 포함 항목:
    - ### 작업 내용 요약
    - ### 테스트 여부 및 결과
    - ### 관련 이슈/기능명 (있으면)

# 4. 🧱 커밋 컨벤션
### 기본 구조: 타입: 간결한 설명 (한글/영문)<br>
예시: feat: 로그인 기능 구현, fix: 댓글 API 오류 수정

|타입|	설명|
|---|---|
|feat|	새로운 기능 추가|
|fix|	버그 수정|
|refactor|	리팩토링 (기능 변화 X)|
|style|	코드 포맷팅 (세미콜론 등)|
|docs|	문서 추가/수정|
|chore|	빌드 설정 등 기타 변경|

# 5. 🧪 코드 리뷰 규칙
팀원 1명 이상 리뷰 승인 후 병합

리뷰어는 다음 항목에 중점:

코드 가독성

불필요한 반복 제거

공통 스타일 규칙 준수

API 요청/응답 명세 일치 여부

병합은 가능하면 본인 X, 팀장이 담당

# 6. 📌 기타 규칙
- 커밋 푸시는 가능한 작게, 의미 단위로 자주

- 작업 전 항상 develop 기준 최신 상태로 브랜치 생성

- 충돌 발생 시 직접 해결 후 다시 PR 요청

- .env, node_modules, build 디렉토리 등은 .gitignore에 추가해 공유 금지

# ✅ 예시 흐름
```shell
git checkout develop

git pull

git checkout -b feature/posts
```
1. ### 개발 완료 후 push

2. ### GitHub에서 develop 브랜치로 PR 생성

3. ### 리뷰 & 승인 → 병합

4. ### QA 후 main에 머지 및 배포

# 🔒 권한 관리 제안
- ### main, develop 브랜치는 보호 설정 (직접 푸시 금지)

- ### `PR` 승인 없이 병합 불가