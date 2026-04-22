# 리팩토링 작업 문서

이 문서는 프로젝트의 주요 리팩토링 작업 내역을 기록합니다.

## 목차

1. [React.FC 및 명시적 반환 타입 제거](#1-reactfc-및-명시적-반환-타입-제거)
2. [불필요한 코드 정리](#2-불필요한-코드-정리)
3. [매직 스트링/넘버 상수화](#3-매직-스트링넘버-상수화)
4. [에러 처리 로직 통합](#4-에러-처리-로직-통합)
5. [타입 안정성 개선](#5-타입-안정성-개선)
6. [검증 로직 통합](#6-검증-로직-통합)
7. [API 및 페이지 파일의 console.error 정리](#7-api-및-페이지-파일의-consoleerror-정리)
8. [인라인 스타일 하드코딩 값 정리](#8-인라인-스타일-하드코딩-값-정리)

---

## 1. React.FC 및 명시적 반환 타입 제거

### 목적

TypeScript의 타입 추론을 활용하여 코드를 간결하게 만들고, React.FC의 제한사항을 피하기 위함

### 변경 사항

- 모든 컴포넌트에서 `React.FC` 제거
- 명시적 `JSX.Element` 반환 타입 제거
- TypeScript의 암시적 타입 추론 활용

### 예시

**이전:**

```typescript
const MyComponent: React.FC<Props> = ({ name }): JSX.Element => {
  return <div>{name}</div>;
};
```

**이후:**

```typescript
const MyComponent = ({ name }: Props) => {
  return <div>{name}</div>;
};
```

### 영향 범위

- 모든 컴포넌트 파일 (atoms, molecules, organisms, pages)

---

## 2. 불필요한 코드 정리

### 2.1 불필요한 주석 제거

- JSDoc 주석 중 중복되거나 불필요한 내용 제거
- TODO 주석 정리
- 자명한 코드에 대한 주석 제거

### 2.2 React import 정리

- 새로운 JSX Transform으로 인해 불필요한 `import React from 'react'` 제거
- React 17+ 버전의 자동 JSX 변환 활용

### 2.3 테스트 페이지 삭제

- `src/components/atoms/Input/InputTestPage.tsx` 삭제
- `src/components/atoms/Button/ButtonTestPage.tsx` 삭제

---

## 3. 매직 스트링/넘버 상수화

### 목적

하드코딩된 값들을 상수로 분리하여 유지보수성과 일관성 향상

### 생성된 파일

`src/constants/common.ts`

### 정의된 상수

#### 이메일 도메인

```typescript
export const EMAIL_DOMAIN = '@mju.ac.kr';
export const EMAIL_DOMAIN_FULL = 'mju.ac.kr';
```

#### 페이지네이션

```typescript
export const DEFAULT_PAGE_SIZE = 10;
export const BOARD_PAGE_SIZE = 10;
export const BROADCAST_PAGE_SIZE = 9;
export const NOTICE_PAGE_SIZE = 10;
export const NEWS_MOBILE_PAGE_SIZE = 5;
export const NEWS_DESKTOP_PAGE_SIZE = 8;
export const COMMON_LIST_ITEMS_PER_PAGE = 8;
export const NOTICE_API_DEFAULT_SIZE = 8;
export const CALENDAR_API_DEFAULT_SIZE = 100;
export const SEARCH_API_DEFAULT_SIZE = 10;
```

#### 시간 관련 (밀리초)

```typescript
export const MENU_STALE_TIME_MS = 5 * 60 * 1000; // 5분
export const REALTIME_RANK_INTERVAL_MS = 10000; // 10초
export const AD_CAROUSEL_INTERVAL_MS = 4000; // 4초
```

#### 아이콘 사이즈

```typescript
export const ICON_SIZE_SM = 12;
export const ICON_SIZE_MD = 16;
export const ICON_SIZE_LG = 20;
export const ICON_SIZE_XL = 22;
```

#### 이미지 관련

```typescript
export const IMAGE_MAX_WIDTH_OR_HEIGHT = 1920;
export const IMAGE_COMPRESSION_QUALITY = 0.9;
```

### 적용된 파일

- `utils/email.ts`: 이메일 도메인 상수 적용
- `pages/board/*`, `pages/broadcast/*`, `pages/notice/*`, `pages/news/*`: 페이지 사이즈 상수 적용
- `api/*`: API 기본값 상수 적용
- `components/molecules/sections/*`: 아이콘 사이즈 상수 적용
- `hooks/useRegister.ts`: 이미지 관련 상수 적용

---

## 4. 에러 처리 로직 통합

### 목적

분산된 에러 처리 로직을 통합하여 일관성 있는 에러 처리 제공

### 생성된 파일

- `src/utils/error.ts`: 공통 에러 처리 유틸리티
- `src/types/error.ts`: 에러 타입 정의

### 주요 함수

#### `extractErrorMessage(error, fallback)`

에러 객체에서 메시지를 추출합니다.

- 우선순위: `response.data.message` → `response.data.status` → `error.message` → `fallback`

#### `handleError(error, fallback, options)`

에러를 처리하고 사용자에게 알림을 표시합니다.

- 개발 환경에서만 콘솔 로깅
- Toast 알림 표시 (옵션)

#### `getErrorMessage(error, fallback)`

에러 메시지만 추출합니다 (상태 관리용).

#### `handleErrorWithStatus(error, statusMessages, fallback)`

HTTP 상태 코드별로 다른 메시지를 표시합니다.

### 타입 가드 함수

#### `isAxiosErrorResponse(error)`

AxiosError인지 확인합니다.

#### `isDuplicateNicknameError(error)`

닉네임 중복 에러인지 확인합니다.

### 적용된 파일

- `hooks/useRegister.ts`: 로컬 `handleError` 제거, 공통 함수 사용
- `hooks/useFindPw.ts`: `toErrMsg` 제거, `getErrorMessage` 사용
- `components/organisms/LoginForm/index.tsx`: `handleErrorWithStatus` 사용
- 모든 페이지 및 컴포넌트: `console.error` → `handleError`로 통합

### 예시

**이전:**

```typescript
try {
  await someApiCall();
} catch (error) {
  const axiosError = error as AxiosError<{ message: string }>;
  console.error(axiosError?.response?.data?.message || '에러 발생');
  toast.error(axiosError?.response?.data?.message || '에러 발생');
}
```

**이후:**

```typescript
try {
  await someApiCall();
} catch (error) {
  handleError(error, '요청에 실패했습니다.');
}
```

---

## 5. 타입 안정성 개선

### 목적

`any` 타입을 제거하고 구체적인 타입을 사용하여 타입 안정성 향상

### 생성된 타입

#### `AxiosErrorResponseData`

```typescript
interface AxiosErrorResponseData {
  message?: string;
  status?: string | number;
  error?: string;
}
```

#### `DuplicateNicknameErrorResponse`

```typescript
interface DuplicateNicknameErrorResponse {
  status?: number;
  error?: string;
  message?: string;
}
```

### 개선 사항

#### `useRegister.ts`

**이전:**

```typescript
const ax = err as AxiosError<{ status?: number; error?: string; message?: string }>;
if (ax.response?.status === 400 && ax.response?.data?.error === 'DUPLICATE_NICKNAME') {
  // ...
}
```

**이후:**

```typescript
if (isDuplicateNicknameError(err)) {
  // 타입 안전하게 처리
}
```

### console.log/error 정리

- 불필요한 디버깅용 `console.log` 제거
- `console.error`를 `handleError`로 통합
- 개발 환경에서만 필요한 로깅은 `handleError` 내부에서 처리

---

## 6. 검증 로직 통합

### 목적

분산된 검증 로직을 통합하여 코드 일관성과 유지보수성 향상

### 생성된 파일

`src/utils/validation.ts`

### 주요 함수

#### `validatePassword(password)`

비밀번호 유효성 검사를 수행합니다.

- 8~16자
- 영문, 숫자, 특수문자 각각 1개 이상 포함

#### `validateStudentCode(code)`

학번 유효성 검사를 수행합니다.

- 60으로 시작하는 8자리 숫자

#### `validateMjuEmail(email)`

명지대 이메일 유효성 검사를 수행합니다 (완전 일치).

- @mju.ac.kr 도메인 포함
- 전체 이메일 형식 검증

#### `isMjuEmailDomain(email)`

이메일 도메인 검사를 수행합니다 (부분 일치).

- 대소문자 구분 없음
- 도메인 부분만 확인

### 적용된 파일

- `src/components/organisms/Register/index.tsx`: 비밀번호 및 학번 검증 적용
- `src/components/organisms/LoginForm/index.tsx`: 이메일 검증 적용
- `src/components/organisms/FindForm/FindIdForm.tsx`: 이메일 도메인 검증 적용

### 예시

**이전:**

```typescript
const isPwValid = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]).{8,16}$/.test(pw);
const isStudentCodeValid = /^60\d{6}$/.test(studentCode.trim());
const emailRegex = new RegExp(`^[\\w.-]+${EMAIL_DOMAIN.replace('.', '\\.')}$`);
```

**이후:**

```typescript
import { validatePassword, validateStudentCode, validateMjuEmail } from '../../../utils/validation';

const isPwValid = validatePassword(pw);
const isStudentCodeValid = validateStudentCode(studentCode);
const isValidEmail = validateMjuEmail(email);
```

### 효과

- 검증 로직 일관성 향상
- 유지보수 용이성 증가
- 테스트 용이성 향상
- 코드 중복 제거

---

## 7. API 및 페이지 파일의 console.error 정리

### 목적

프로덕션 환경에서 불필요한 콘솔 로그를 제거하고 에러 처리를 통합

### 변경 사항

#### API 파일 정리

- `src/api/news.ts`: 불필요한 try-catch 및 console.error 제거
- `src/api/main/meal-api.ts`: 불필요한 try-catch 및 console.error 제거

#### 페이지 파일 정리

- `src/pages/search/index.tsx`: console.error 제거
- `src/pages/mypage/index.tsx`: console.error를 handleError로 대체

#### 컴포넌트 파일 정리

- `src/components/atoms/SearchBar/index.tsx`: console.error 및 console.log 제거

### 예시

**이전:**

```typescript
export const fetchNewsInfo = async (...): Promise<NewsListRes> => {
  try {
    const res = await apiClient.get('/news', { params });
    return res.data;
  } catch (e) {
    console.error('news fetching error', e);
    throw e;
  }
};
```

**이후:**

```typescript
export const fetchNewsInfo = async (...): Promise<NewsListRes> => {
  const params: Record<string, unknown> = { category };
  if (page !== undefined) params.page = page;
  if (size !== undefined) params.size = size;

  const res = await apiClient.get('/news', { params });
  return res.data;
};
```

### 효과

- 프로덕션 로그 정리
- 에러 처리 통일
- 코드 간결성 향상

---

## 8. 인라인 스타일 하드코딩 값 정리

### 목적

하드코딩된 색상 값을 상수로 분리하여 일관성과 유지보수성 향상

### 변경 사항

#### 색상 상수 추가

`src/styles/color.ts`에 다음 상수 추가:

```typescript
export const colors = {
  // ... 기존 색상
  errorBackground: '#fee2e2', // 에러 배경색
  yellow: '#FFD700', // sub 버튼용 노란색
};
```

#### 적용된 파일

- `src/components/atoms/Input/Input.tsx`
  - `'#ffffff'` → `colors.white`
  - `'#fee2e2'` → `colors.errorBackground`
- `src/components/atoms/Button/ButtonActiveStyleMap.ts`
  - `'#FFD700'` → `colors.yellow`
  - `'#E3E6E6'` → `colors.grey10`
  - `'#999999'` → `colors.grey40`
  - `'#17171B'` → `colors.black`

### 예시

**이전:**

```typescript
labelfield: {
  backgroundColor: '#ffffff',
  borderBottom: `1px solid ${colors.grey20}`,
},
```

**이후:**

```typescript
labelfield: {
  backgroundColor: colors.white,
  borderBottom: `1px solid ${colors.grey20}`,
},
```

### 효과

- 색상 일관성 향상
- 중앙화된 색상 관리
- 유지보수 용이성 증가

---

## 통계

### 변경된 파일 수

- React.FC 제거: 50+ 파일
- 상수 분리: 25+ 파일
- 에러 처리 통합: 20+ 파일
- 타입 안정성 개선: 15+ 파일
- 검증 로직 통합: 4개 파일
- API 및 페이지 console.error 정리: 5개 파일
- 인라인 스타일 하드코딩 값 정리: 3개 파일

### 코드 변경량

- 총 추가: 약 600+ 줄
- 총 삭제: 약 350+ 줄
- 순 증가: 약 250+ 줄

---

## 개선 효과

### 코드 품질

- 타입 안정성 향상
- 코드 일관성 향상
- 유지보수성 향상
- 가독성 향상

### 개발 경험

- 자동완성 개선
- 타입 체크 강화
- 에러 처리 통일
- 상수 관리 중앙화
- 검증 로직 통합

### 성능

- 불필요한 코드 제거
- 번들 크기 최적화 (미미한 수준)

---

## 참고 사항

### 커밋 내역

- `2a7d3e1`: React.FC 및 명시적 반환 타입 제거
- `9d28d7f`: 테스트 페이지 파일 삭제
- `3f69c01`: 불필요한 주석 및 React import 제거
- `6626b01`: 매직 스트링 및 매직 넘버를 상수로 분리
- `3fd70a3`: 에러 처리 로직 통합 및 문서화
- `283e98b`: console.log/error 정리 및 타입 안정성 개선
- `90e7143`: 검증 로직 통합
- `d6196bd`: API 및 페이지 파일의 console.error 정리
- `466adae`: 인라인 스타일 하드코딩 값 정리

### 다음 단계 권장 사항

추가 리팩토링 제안 사항은 `REFACTORING_PROPOSALS.md` 파일을 참고하세요.

---

## 관련 파일

- `src/constants/common.ts`: 공통 상수 정의
- `src/utils/error.ts`: 에러 처리 유틸리티
- `src/types/error.ts`: 에러 타입 정의
- `src/utils/validation.ts`: 검증 로직 유틸리티
- `src/styles/color.ts`: 색상 상수 정의

---

**작성일**: 2024년  
**최종 업데이트**: 2026년 1월 2일
