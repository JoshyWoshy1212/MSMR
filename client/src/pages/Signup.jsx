import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

const Signup = ({ onShowLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            // 백엔드 서버(5000번 포트)의 회원가입 API 호출
            const res = await axios.post('http://localhost:5000/auth/signup', { 
                email, 
                password,
                name
            });
            alert(res.data.message);
            navigate('/'); // 가입 후 로그인 페이지로 이동
        } catch (err) {
            alert(err.response?.data?.error || "회원가입 실패");
        }
    };

    return (
        <div className='signup-page'>
            <div className='signup-container'>
                <h2>회원가입</h2>
                <form className='signup-form' onSubmit={handleSignup}>
                    <div>
                        <input 
                            name='name'
                            type="text" 
                            placeholder="이름 (Full Name)" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            required 
                        />
                    </div>
                    <div>
                        <input 
                            name='email'
                            className='signup-input'
                            type="email" 
                            placeholder="이메일 입력" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div>
                        <input 
                            name='password'
                            className='signup-input'
                            type="password" 
                            placeholder="비밀번호 입력" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <button 
                        className='signup-button'
                        type="submit" 
                    >가입하기</button>
                </form>
                <div className="login-link-container">
                이미 계정이 있나요? 
                <a onClick={onShowLogin} className="login-link-text">로그인하러 가기</a>
                </div>
            </div>
        </div>
    );
};

export default Signup;