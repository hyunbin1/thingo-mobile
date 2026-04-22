# Migration Inventory

## Source scan
- `web-reference/src/constants`
- `web-reference/src/hooks`
- `web-reference/src/store`
- `web-reference/src/styles`
- `web-reference/src/types`
- `web-reference/src/error`
- `web-reference/src/utils`

## File status
### 그대로 이식
- `constants/auth.ts`
  - source: `web-reference/src/constants/auth.ts`
  - reason: 플랫폼 의존성 없는 상수
  - changes: 변경사항 없음
- `constants/common.ts`
  - source: `web-reference/src/constants/common.ts`
  - reason: 플랫폼 의존성 없는 공통 상수
  - changes: 변경사항 없음
- `constants/max-file-size.ts`
  - source: `web-reference/src/constants/maxFileSize.ts`
  - reason: 플랫폼 의존성 없는 파일 크기 상수
  - changes:
    - 파일명 규칙 수정
- `types/auth.ts`
  - source: `web-reference/src/types/auth/index.ts`
  - reason: 순수 타입 선언
  - changes:
    - 파일 경로 평탄화
- `utils/code.ts`
  - source: `web-reference/src/utils/code.ts`
  - reason: 순수 문자열 유틸
  - changes: 변경사항 없음

### 주석만 보정 후 이식
- `types/api.ts`
  - source: `web-reference/src/types/api/index.ts`
  - reason: 순수 타입 선언
  - changes:
    - 파일 경로 평탄화
    - 주석 복원
- `types/nav.ts`
  - source: `web-reference/src/types/nav/item.ts`
  - reason: 순수 타입 선언
  - changes:
    - 파일 경로 평탄화
    - 주석 복원
- `utils/email.ts`
  - source: `web-reference/src/utils/email.ts`
  - reason: 순수 문자열 유틸
  - changes:
    - import 경로 수정
    - 주석 복원
- `utils/filter-list.ts`
  - source: `web-reference/src/utils/filterList.ts`
  - reason: 순수 리스트 필터 유틸
  - changes:
    - 파일명 규칙 수정
    - 주석 복원
- `utils/validation.ts`
  - source: `web-reference/src/utils/validation.ts`
  - reason: 순수 검증 유틸
  - changes:
    - import 경로 수정
    - 주석 복원

### 경로/포맷만 수정 후 이식
- `constants/colors.ts`
  - source: `web-reference/src/styles/color.ts`
  - reason: 색상 토큰은 RN에서도 재사용 가능
  - changes:
    - 파일 위치 이동 (`styles` -> `constants`)
    - camelCase 키로 정리
    - 기존 주석 유지
- `types/error.ts`
  - source: `web-reference/src/types/error.ts`
  - reason: 에러 식별 로직은 공통으로 사용 가능
  - changes:
    - import 경로 수정
    - `axios` 타입 의존 제거
    - 주석 복원
  - function change: 없음
- `utils/date.ts`
  - source: `web-reference/src/utils/date.ts`
  - reason: 날짜 포맷 로직은 RN에서도 동일
  - changes:
    - 깨진 한글 문자열 복원
    - 주석 복원
  - function change: 없음
- `utils/index.ts`
  - source: `web-reference/src/utils/index.ts`
  - reason: barrel export
  - changes:
    - 현재 이식한 유틸 기준으로 export 범위 조정

### 웹 의존성 때문에 보류
- `utils/cookie.ts`
  - reason: 브라우저 쿠키 API 전제
- `utils/initAuth.ts`
  - reason: 웹 인증 부트스트랩 전제
- `utils/recentSearch.ts`
  - reason: 브라우저 저장소 전제 가능성 높음
- `utils/agentation.tsx`
  - reason: 웹 UI/브라우저 동작 전제
- `hooks/useResponse.ts`
  - reason: 웹 앱 API 계층과 결합
- `hooks/useRegister.ts`
  - reason: 웹 폼 흐름과 결합
- `hooks/useFindPw.ts`
  - reason: 웹 인증 흐름과 결합
- `hooks/queries/*`
  - reason: 웹 API/라우팅/뷰 흐름과 결합
- `hooks/gtm/*`
  - reason: 브라우저 GTM 전제
- `hooks/menu/useMenuData.ts`
  - reason: 웹 메뉴 데이터 흐름과 결합

### 데이터/인코딩 문제 때문에 보류
- `constants/departments.ts`
  - reason: 현재 워크스페이스 출력 기준 한글 데이터 깨짐 확인 필요
- `constants/map.ts`
  - reason: 데이터는 유용하지만 한글 문자열 정리 먼저 필요
- `constants/map-pins.ts`
  - reason: 관련 map 데이터와 함께 검증 필요
- `constants/news.ts`
  - reason: 현재 한글 키/값 인코딩 확인 필요
- `constants/nav.ts`
  - reason: 웹 경로 기준이라 앱 라우트 체계와 같이 재정의 필요
- `utils/department.ts`
  - reason: `departments.ts` 선행 정리 필요

### RN 방식으로 재작성 필요
- `store/useAuthStore.ts`
  - reason: `sessionStorage`를 RN 저장소로 교체해야 함
- `store/useHeaderStore.ts`
  - reason: Zustand 도입 여부와 슬라이드 상태 구조를 앱 기준으로 다시 결정해야 함
- `utils/imageCompression.ts`
  - reason: 웹 이미지 처리 방식과 RN 이미지 처리 방식이 다름

## Remaining work
1. `store/useHeaderStore.ts`, `store/useAuthStore.ts`
   - RN 저장소/상태관리 기준 확정 후 이식
2. `constants/departments.ts`, `utils/department.ts`
   - 한글 데이터 검증 후 이식
3. `constants/map.ts`, `constants/map-pins.ts`
   - 지도 기능 실제 사용 범위 기준으로 정리
4. `constants/nav.ts`, `constants/news.ts`
   - 앱 라우트 체계와 카테고리 체계에 맞게 재정의
5. `hooks/*`
   - 화면 단위로 필요한 것부터 선별 이식

## Notes
- 여러 웹 파일이 현재 콘솔 출력에서 한글이 깨져 보여 원본 의미 검증이 필요합니다.
- 이번 턴에서는 기능 동작 변경 없이 주석 복원, 경로 보정, 문자열 복원을 우선했습니다.
- 다음 턴부터는 저장소 계층과 데이터 상수 계층을 나눠서 이식하는 것이 안전합니다.
