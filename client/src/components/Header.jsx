// src/components/Header.jsx
import { useState, useRef, useEffect } from 'react';
import './Header.css'
import ChangePassword from '../pages/ChangePassword';

export default function Header({ user, onLogout, onMenuClick, onSearchChange, onChangePasswordClick }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if(menuRef.current && !menuRef.current.contains(e.target)){
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

  return (
    <header className="header">
      <div className="header-left">
        <span 
          className="material-icons" 
          onClick={onMenuClick}
        >menu</span>
        <img src="https://ssl.gstatic.com/ui/v1/icons/mail/rfr/logo_gmail_lockup_default_1x_r5.png" 
          alt="logo"
          data-tooltip='메일'
        />
      </div>
      <div className="header-middle">
        <span className="material-icons">search</span>
        <input 
          type="text" 
          placeholder="메일 검색" 
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="header-right" ref={menuRef}>

        <span 
          className="material-icons icons-btn"
          data-tooltip='설정'
          >settings
        </span>

        <span
          className='material-icons icons-btn'
          data-tooltip='앱'
        >
          apps
        </span>

        <div className='profile-wrapper' onClick={() => setShowProfileMenu(!showProfileMenu)}>
          <div className='profile-circle active' data-tooltip='프로필'>
            G
          </div>

          {showProfileMenu && (
            <div className='profile-dropdown'>
              <div className='user-info'>
                <div className='large-profile'>G</div>
                <div className='text-info'>
                  <span className='user-name'>{user?.name || '사용자'}</span>
                  <span className='user-email'>{user?.email || 'user@mail.com'}</span>
                </div>
              </div>
              <hr />
              <button 
                className='menu-item' 
                onClick={() => {
                  onChangePasswordClick();
                  setShowProfileMenu(false);
                }}
              >
                <span className='material-icons'>lock</span>
                <span>비밀번호 변경</span>
              </button>
              <button className='menu-item' onClick={onLogout}><span className='material-icons'>logout</span><span> 로그아웃</span></button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}