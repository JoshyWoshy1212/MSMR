// src/App.jsx
import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MailHome from './pages/MailHome';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  // 1. 현재 화면이 로그인인지 회원가입인지 결정하는 상태 추가
  const [isSignup, setIsSignup] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // 2. 로그인 여부에 따른 처리
  if (user) {
    return <MailHome user={user} setUser={setUser} />;
  }

  // 3. 로그인이 안 된 상태에서 '회원가입'과 '로그인' 화면 전환
  return (
    <>
      {isSignup ? (
        // 회원가입 페이지로 이동하는 함수(onShowLogin)를 전달
        <Signup onShowLogin={() => setIsSignup(false)} />
      ) : (
        // 회원가입 페이지를 보여주는 함수(onShowSignup)를 전달
        <Login setUser={setUser} onShowSignup={() => setIsSignup(true)} />
      )}
    </>
  );
}

export default App;