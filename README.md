## 브렌치 생성 및 커밋하는 방법

(repository에 초대되어서 branch를 생성하고 push&pull하고 싶을 때)

### 0. 작업할 빈 폴더 지정(앞으로 clone으로 관리할 폴더 생성)

### 1. 브렌치 만들기

```jsx
1. 코드 복사
-> git clone https://github.com/JoshyWoshy1212/MSMR.git
-> cd MSMR

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
//위 기록은 예시

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

---

## Pull Request(브렌치에 올린 코드 main과 합칠 때)

GitHub 레포지토리 페이지에 들어가면
노란색 바에 `Compare & pull request` 버튼이 뜬다.

작성한 내용을 적고 `Create pull request` 클릭.

친구들과 코드를 리뷰한 뒤, 
문제가 없으면 `Merge pull request`를 눌러 합친다.

```jsx
** 최신 코드 유지 **
-> git pull origin main              # 메인 브렌치의 최신 내용을 내 컴퓨터로
//이후에 branch로 수정하고 싶으면 위에서 말한대로
// git push origin [브렌치 이름]
```

---

## main 내용을 나의 브랜치에 합치고 싶을 때

(main 내용을 다시 나의 브랜치로 덮어씌우고 싶을 때)

```jsx
1. 일단 내 브랜치로 이동
-> git checkout [브랜치 이름]

2. 내 컴퓨터에 있는 최신 main의 내용을 나의 브랜치로 합칩
-> git merge main

3. 이제 내 브랜치가 최신화되었으니, GitHub로 올림
-> git push origin [브랜치 이름]
```

## Server 및 Client 서버 실행 방법
(처음 실행한다는 가정 하)
```jsx
0. cd /MSMR/Client/ && cd /MSMR/Server/
//터미널 2개 생성해서 각각 실행하면 편함

1. install npm (nodemudules를 다시 깔아주기 위함)
-> 안되면 npm install -g npm 로 npm을 최신 버전으로 업데이트 후 install npm 실행
//두 터미널(각 폴더)에서 실행해야 함

2. Client 켜기 (/MSMR/Client/에서)
-> npm run dev
//VITE v7.3.1  ready in 243 ms
//➜  Local:   http://localhost:5173/
//위 내용 뜨면 성공

2-1. Server 켜기 (/MSMR/Server/에서)
-> npm start
// "Server running on port 5000" 뜨면 성공

3. 끄는 방법 -> 터미널에서 ctrl+c
```

install npm을 모두 완료한 상태라면? 2번 내용만 실행하여 client, server 켜기
