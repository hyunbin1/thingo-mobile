# 네이버 지도 PoC 설정 메모

## 목적

- 전체 마이그레이션 전에 Expo Development Build 환경에서 네이버 지도 네이티브 모듈이 올라오는지 먼저 검증한다.
- 현재 단계에서는 지도 1개 화면만 검증하고, 위치 권한이나 도메인 로직은 붙이지 않는다.

## 코드에서 API 키가 들어가는 위치

### 1. 환경 변수

프로젝트 루트의 `.env` 파일에 아래 값을 넣는다.

```bash
NAVER_MAP_CLIENT_ID=YOUR_NAVER_MAP_CLIENT_ID
```

샘플은 [.env.example](/abs/path/c:/PROJECT/MJU/NOVA/Thingo_Mobile/thingo-mobile/.env.example) 에 두었다.

### 2. Expo 앱 설정

[app.config.ts](/abs/path/c:/PROJECT/MJU/NOVA/Thingo_Mobile/thingo-mobile/app.config.ts) 에서 `process.env.NAVER_MAP_CLIENT_ID` 를 읽어 네이버 지도 config plugin으로 주입한다.

- iOS: `Info.plist` 의 `NMFNcpKeyId`, `NMFClientId`
- Android: `AndroidManifest.xml` 의 `com.naver.maps.map.NCP_KEY_ID`, `com.naver.maps.map.CLIENT_ID`

직접 네이티브 파일을 수정하지 않고 Expo prebuild 시점에 주입되도록 구성했다.

## 필요한 설정 단계

### 1. 네이버 클라우드에서 Maps Client ID 발급

- 네이버 클라우드 플랫폼에서 Maps 상품용 Client ID를 발급한다.
- 서비스 유형은 Mobile App 기준으로 등록한다.
- iOS Bundle Identifier 와 Android Package Name 은 실제 앱 값과 일치해야 한다.

## 2. Expo Development Build 사용

Expo Go는 네이버 지도 네이티브 모듈을 포함하지 않으므로 사용할 수 없다.

```bash
npx expo prebuild
npx expo run:android
npx expo run:ios
```

또는 EAS development profile을 사용해도 된다.

## 3. Android 네이티브 반영 사항

[app.config.ts](/abs/path/c:/PROJECT/MJU/NOVA/Thingo_Mobile/thingo-mobile/app.config.ts) 에서 아래가 자동 반영된다.

- `expo-build-properties` 로 Naver Maps Maven 저장소 추가
- 네이버 지도 Client ID 메타데이터 추가

수동으로 볼 경우 확인 포인트는 아래다.

- `android/build.gradle` 또는 prebuild 결과물에 `https://repository.map.naver.com/archive/maven`
- `AndroidManifest.xml` 안의 네이버 지도 meta-data

## 4. iOS 네이티브 반영 사항

[app.config.ts](/abs/path/c:/PROJECT/MJU/NOVA/Thingo_Mobile/thingo-mobile/app.config.ts) 에서 아래가 자동 반영된다.

- `Info.plist` 에 `NMFNcpKeyId`
- 레거시 호환용 `NMFClientId`

수동으로 볼 경우 확인 포인트는 prebuild 이후 `ios/*/Info.plist` 이다.

## 5. 이번 PoC에서 일부러 제외한 것

- 현재 위치 표시
- 위치 권한 문구와 권한 요청 플로우
- 사용자 위치 기반 카메라 이동
- 클러스터링, 커스텀 마커, 경로 오버레이
- 실제 앱 라우팅 구조 개편
- web 프로젝트와의 본격적인 기능 마이그레이션

## 6. 주의 사항

- `NAVER_MAP_CLIENT_ID` 를 바꾼 뒤에는 JS 새로고침만으로 충분하지 않을 수 있다.
- config plugin 값이 바뀌면 prebuild 또는 새 development build가 다시 필요하다.
- 실제 키 발급 전에는 PoC 화면이 안내 상태로 보이는 것이 정상이다.
