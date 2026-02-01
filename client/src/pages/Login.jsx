import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

// 부모(App.jsx)로부터 setUser, onShowSignup, onShowForgotPassword를 받아옵니다.
const Login = ({ setUser, onShowSignup, onShowForgotPassword }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/login', { email, password });
            const { user } = res.data;

            // 1. 브라우저 저장소에 유저 정보 보관 (새로고침 대비)
            localStorage.setItem('user', JSON.stringify(user));

            // 2. 부모의 상태를 업데이트 -> App.jsx가 이 값을 보고 화면을 전환함
            setUser(user);
            alert("로그인 성공");

        } catch (err) {
            console.error(err);
            // 서버에서 보낸 에러 메시지가 있다면 그걸 띄워줍니다.
            alert(err.response?.data?.error || "로그인 정보가 올바르지 않습니다.");
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
                    <button className="login-button" type="submit">로그인</button>
                </form>

                {/* 하단 링크 영역: App.jsx의 view 상태를 바꿔주는 함수들 연결 */}
                <div className="login-helper" style={{ marginTop: '20px', fontSize: '0.9rem' }}>
                    <span onClick={onShowSignup} className="link-text" style={{ cursor: 'pointer', color: '#666' }}>회원가입</span>
                    <span className="divider" style={{ margin: '0 10px', color: '#ccc' }}>|</span>
                    <span onClick={onShowForgotPassword} className="link-text" style={{ cursor: 'pointer', color: '#666' }}>비밀번호 찾기</span>
                </div>
            </div>
        </div>
    );
};

export default Login;