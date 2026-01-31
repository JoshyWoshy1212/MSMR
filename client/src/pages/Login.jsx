import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ setUser, onShowSignup }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // 백엔드 서버의 로그인 API 호출
            const res = await axios.post('http://localhost:5000/api/login', { 
                email, 
                password
            });

            // 1. 서버가 보내준 토큰과 유저 정보를 구조 분해 할당
            const { token, user, message } = res.data;

            // 2. 브라우저 저장소(localStorage)에 토큰 저장 (나중에 인증용으로 사용)
            localStorage.setItem('token', token);

            localStorage.setItem('user', JSON.stringify(user)); // 객체를 문자열로 저장
            
            // 3. App.js의 유저 상태 업데이트 (현재 로그인한 사람 기억하기)
            setUser(user);

            alert(message); // "로그인 성공!"
            navigate('/todos'); // 로그인 성공 후 할 일 목록 페이지로 이동 (곧 만들 예정)
        } catch (err) {
            alert("로그인 실패");
        }
    };

    return (
        <div className='login-page'>
            <div className='login-container'>
                <h2>로그인</h2>
                <form className="login-form" onSubmit={handleLogin}>
                    <div>
                        <input 
                            name="email"
                            className='login-input'
                            type="email" 
                            placeholder="이메일" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div>
                        <input 
                            name="password"
                            className='login-input'
                            type="password" 
                            placeholder="비밀번호" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <button 
                        className="login-button"
                        type="submit" 
                    >로그인</button>
                </form>
                <div className="signup-link-container">
                계정이 없으신가요? 
                <a onClick={onShowSignup} className="signup-link-text">회원가입하러 가기</a>
                </div>
            </div>
        </div>
    );
};

export default Login;