# SYNC-INSIGHT-CLIENT

### 개발환경

- node version: 20.12.0

- yarn version: 1.22.22

- react version: ^18.3

- Tailwind CSS verions: ^4

### 구조

페이지 컴포넌트의 경우 `src/routes/` 내부에 디렉토리를 구성하고 해당 디렉토리 내부에 파일을 위치시킨다.

`routes/` 디렉토리 내부 구조는 아래와 같다.

```
routes
 ├── DefaultLayout.tsx
 ├── index.tsx
 ├── main
 │   └── index.tsx
 └── test1
     └── index.tsx
```

- `routes/index.tsx` 에서 전체적인 라우팅을 처리한다.
- `DefaultLayout.tsx` 에서 모든 페이지들의 공통 레이아웃을 정의하고 Outlet을 통해 children 컴포넌트들을 렌더링 한다.
  - 해당 코드 파일에서 `Navigation`, `Footer` 같은 UI를 렌더링 한다.

pr test
