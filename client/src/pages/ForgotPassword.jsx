import React, { useState } from 'react';
import './Login.css';

const ForgotPassword = ({ onShowLogin }) => {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false); // 전송 성공 여부 상태

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // 실제로는 여기서 axios.post를 하겠지만, 
        // 지금은 버튼만 누르면 바로 성공 화면으로 넘어가게 설정합니다.
        console.log(`${email}로 임시 비번 발송 요청 시뮬레이션`);
        
        setIsSubmitted(true); // 성공 상태로 변경
    };

    return (
        <div className='login-page'>
            <div className='login-container'>
                <h2>비밀번호 찾기</h2>

                {/* isSubmitted 상태에 따라 화면을 다르게 보여줍니다 (조건부 렌더링) */}
                {!isSubmitted ? (
                    // 1. 이메일 입력 화면
                    <>
                        <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '20px' }}>
                            가입하신 이메일 주소를 입력하시면<br/>임시 비밀번호를 보내드립니다.
                        </p>
                        <form className="login-form" onSubmit={handleSubmit}>
                            <input 
                                className='login-input'
                                type="email" 
                                placeholder="이메일 주소 입력" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                            />
                            <button className="login-button" type="submit">
                                임시 비밀번호 발송
                            </button>
                        </form>
                    </>
                ) : (
                    // 2. 발송 성공 안내 화면
                    <div className="success-message" style={{ textAlign: 'center' }}>
                        <p style={{ color: '#1a73e8', fontWeight: 'bold', marginBottom: '20px' }}>
                            임시 비밀번호가 메일로 발송되었습니다.<br/>
                            메일함을 확인해 주세요!
                        </p>
                    </div>
                )}

                <div className="login-helper" style={{ marginTop: '20px' }}>
                    <span onClick={onShowLogin} className="link-text" style={{ cursor: 'pointer' }}>
                        로그인하러 가기
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;