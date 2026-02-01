// src/App.jsx
import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MailHome from './pages/MailHome';
import './App.css';
import ForgotPassword from './pages/ForgotPassword';

// src/App.jsx
function App() {
  const [user, setUser] = useState(null);
  // 'login', 'signup', 'forgotPassword', 'changePassword' 상태 관리
  const [view, setView] = useState('login'); 

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      
      // 만약 저장된 유저 정보에 '비밀번호 변경 필요' 플래그가 있다면 해당 화면으로 보냄
      if (parsedUser.mustChangePassword) setView('changePassword');
    }
  }, []);

  // 로그인 완료 시
  if (user && !user.mustChangePassword) {
    return <MailHome user={user} setUser={setUser} />;
  }

  return (
    <div className="auth-wrapper">
      {view === 'login' && (
        <Login 
          setUser={(u) => {
            setUser(u);
            if (u.mustChangePassword) setView('changePassword');
          }} 
          onShowSignup={() => setView('signup')}
          onShowForgotPassword={() => setView('forgotPassword')}
        />
      )}

      {view === 'signup' && (
        <Signup onShowLogin={() => setView('login')} />
      )}

      {view === 'forgotPassword' && (
        <ForgotPassword onShowLogin={() => setView('login')} />
      )}

      {view === 'changePassword' && (
        <ChangePassword 
          user={user} 
          onComplete={() => {
            // 비번 변경 완료 시 플래그 제거 후 메인으로
            const updatedUser = { ...user, mustChangePassword: false };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
          }} 
        />
      )}
    </div>
  );
}

export default App;