// src/pages/ChangePassword.jsx
import React, { useState } from 'react';
import './Login.css';

const ChangePassword = ({ onComplete, onCancel, isForced = false }) => {
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

    const handleChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            return alert("새 비밀번호가 일치하지 않습니다.");
        }
        alert("비밀번호가 성공적으로 변경되었습니다.");
        onComplete(); // 성공 후 처리 (메인으로 이동 등)
    };

    return (
        <div className='login-page'>
            <div className='login-container'>
                <h2>비밀번호 변경</h2>
                <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '20px' }}>
                    {isForced ? "임시 비밀번호로 로그인하셨습니다. 안전을 위해 비밀번호를 변경해주세요." 
                              : "개인정보 보호를 위해 주기적인 비밀번호 변경을 권장합니다."}
                </p>
                <form className="login-form" onSubmit={handleSubmit}>
                    <input 
                        name="current"
                        className='login-input'
                        type="password" 
                        placeholder="현재(또는 임시) 비밀번호" 
                        onChange={handleChange}
                        required 
                    />
                    <input 
                        name="new"
                        className='login-input'
                        type="password" 
                        placeholder="새 비밀번호" 
                        onChange={handleChange}
                        required 
                    />
                    <input 
                        name="confirm"
                        className='login-input'
                        type="password" 
                        placeholder="새 비밀번호 확인" 
                        onChange={handleChange}
                        required 
                    />
                    <button className="login-button" type="submit">변경 완료</button>
                    
                    {/* 강제 변경이 아닐 때만 취소 버튼을 보여줍니다 */}
                    {!isForced && (
                        <button 
                            type="button" 
                            className="login-button" 
                            style={{ backgroundColor: '#ccc', marginTop: '10px' }}
                            onClick={onCancel}
                        >
                            취소
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;