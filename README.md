# 프론트엔드 채용 과제 — 태스크 보드 견고화

대량의 태스크를 관리하는 칸반 보드 형태의 태스크 보드 서비스입니다.

<br/>

## 🚀 배포 주소

### GitHub Pages: https://qpalkim.github.io/task-board

<br/>

## 🧪 실행 방법

```bash
git clone https://github.com/qpalkim/task-board
npm install      # 의존성 라이브러리 설치
npm test         # 유닛 테스트(Vitest)
npm run dev      # 개발 서버
npm run build    # 타입 체크 + 프로덕션 빌드
```

<br/>

## 🔑 구현 기능

### 🔴 Priority High

**태스크 조회**

- 초기 태스크 목록 조회
- 로딩 상태 UI 제공
- API 요청 실패 시, 에러 상태 및 재시도 기능 제공
- 데이터가 없는 경우 Empty State UI 제공

**태스크 CRUD 기능**

- 태스크 생성
- 태스크 수정
- 태스크 삭제
- 태스크 상태 변경(드래그 앤 드롭)

**Optimistic Update**

- 태스크 이동 및 수정 시, UI를 먼저 업데이트
- 서버 요청 실패 시, 이전 상태로 복구 처리
- 요청 순서를 관리하여 최신 요청 결과만 반영

**Conflict 처리**

- 서버 데이터와 버전 충돌 발생 시, 서버의 최신 데이터를 반영
- 사용자에게 충돌 상황 안내

<br/>

### 🟡 Priority Medium

**UI 컴포넌트 분리**

- CreateTaskDialog, EditTaskDialog, DeleteTaskDialog 컴포넌트 분리
- EmptyState, ErrorState, Skeleton UI 구성

**렌더링 최적화**

- Column, Card 컴포넌트에 React.memo 적용
- 변경되지 않은 태스크의 불필요한 리렌더링 방지

**테스트**

- rollback 로직을 순수 함수로 분리
- 실패 상황에서 이전 상태로 정상 복구되는지 유닛 테스트 작성

<br/>

## ⚠️ 미구현 기능

### 🟢 Priority Low

**검색 디바운싱, 우선순위/상태/태그 다중 필터**

- 핵심 요구사항인 태스크 상태 관리와 서버 동기화 안정성을 우선하여 진행
- 향후 태스크 조회 API 확장 및 검색 조건 관리 구조를 고려하여 추가 개선 가능

**가상 스크롤**

- 초기 데이터가 5,000개로 대량 렌더링 개선을 위한 최적화 기능 필요
- 다만 Drag & Drop 동작, Optimistic Update 상태 관리와 함께 적용하기 위해 추가적인 렌더링 구조 변경이 필요하여 현재 범위에서는 제외
- 향후 데이터 규모 증가 시, React Virtualization 기반으로 개선 가능

<br/>

## 🛠️ 사용 기술 스택

- React
- TypeScript
- Vite
- CSS
- Vitest
- Lucide-React
- GitHub Pages
