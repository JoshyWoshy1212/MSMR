## 브렌치 생성 및 커밋하는 방법

(repository에 초대되어서 branch를 생성하고 push&pull하고 싶을 때)

### 1. 브렌치 만들기

```jsx
1. 코드 복사
-> git clone https://github.com/JoshyWoshy1212/MSMR.git

2. 브렌치 생성(새 기능을 만들 때마다 아래 명령어 활용)
-> git checkout -b [브렌치 이름] 
// 예: git checkout -b hyogae (또는 hyungin)
```

### 2. 변경사항 커밋 및 업로드

```jsx
0. 자신의 브랜치가 잘 있는지 확인
-> git checkout [브랜치 이름]

1. 상태 확인 및 추가
-> git add .

2. 기록 남기기
-> git commit -m "로그인 기능 구현 완료"
// 위 기록은 예시

3. 내 브렌치에 올리기
-> git push origin [브렌치 이름]
// 예: git push origin donghyun
```

### **주의 사항**

## `다른 컴퓨터에서 작업 중이라면 2번 내용의 0번 사항을 꼭 지키기`
```jsx
// 이미 만들어진 브랜치에서 pull 안하고 바로 push하면 오류 발생
// 0번과 1번 사이 아래 내용 실행
-> git pull origin [브렌치 이름]
// 이후에 2번부터 실행
```

## Pull Request(브렌치에 올린 코드 main과 합칠 때)

GitHub 레포지토리 페이지에 들어가면
노란색 바에 `Compare & pull request` 버튼이 뜬다.

작성한 내용을 적고 `Create pull request` 클릭.

친구들과 코드를 리뷰한 뒤, 
문제가 없으면 `Merge pull request`를 눌러 합친다.

** 최신 코드 유지 **
-> git pull origin main              # 메인 브렌치의 최신 내용을 내 컴퓨터로
//이후에 branch로 수정하고 싶으면 위에서 말한대로
// git push origin [브렌치 이름]
