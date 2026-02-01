import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import MailList from '../components/MailList';
import ComposeModal from '../components/ComposeModal';
import MailDetail from '../components/MailDetail';
import ChangePassword from './ChangePassword';
import axios from 'axios';

const MailHome = ({ user, setUser, initialMails }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mails, setMails] = useState(initialMails || []);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(
    localStorage.getItem('currentCategory') || 'inbox'
  );
  const [selectedMail, setSelectedMail] = useState(null);
  const [isSidebarClosed, setIsSidebarClosed] = useState(false);
  const [editData, setEditData] = useState(null);
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  useEffect(() => {
    const fetchMails = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/emails/${user.email}`);

            const mappedMails = res.data.map(mail => ({
              ...mail,
              content: mail.body,          // body -> content
              date: mail.received_at,      // received_at -> date
              to: mail.recipient_email,    // recipient_email -> to
              from: mail.sender_email,     // sender_email -> from
              fromName: mail.sender_name   // sender_name -> fromName
            }));

            setMails(mappedMails);
            localStorage.setItem(`mails_${user.email}`, JSON.stringify(mappedMails));
            
        } catch (err) {
            console.error("메일 목록 로딩 실패:", err);
        }
    };

    if (user?.email) fetchMails();
  }, [user.email]);

  const getFilteredMails = () => {
    let filtered = mails.filter(mail => !mail.deleted_at); // 공통: 삭제 안 된 것만

    if (currentCategory === 'inbox') {
        return filtered.filter(m => m.recipient_email === user.email);
    }
    if (currentCategory === 'sent') {
        return filtered.filter(m => m.sender_email === user.email);
    }
    if (currentCategory === 'starred') {
        return filtered.filter(m => m.is_starred === 1);
    }
    return filtered;
};

  const handleEditCompose = (mail) => {
    setEditData(mail); //기존 메일 정보 그대로 사용
    setIsComposeOpen(true); //모달 열기
  }

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    alert("로그아웃 되었습니다.");
  };

  const addMail = () => {
    window.location.reload();
  };

  const handleCategoryChange = (category) => {
    setCurrentCategory(category);
    localStorage.setItem('currentCategory', category);
    setSelectedMail(null);
  };

  const deleteMailFromServer = async (ids) => {
    const idsToDelete = Array.isArray(ids) ? ids : [ids];
    if (!window.confirm("삭제하시겠습니까?")) return;

    try {
        await Promise.all(idsToDelete.map(id => 
            axios.delete(`http://localhost:5000/api/emails/${id}`)
        ));

        // 상태 업데이트: 실제 배열에서 지우거나, deleted_at 값을 넣어줌
        const updatedMails = mails.filter(mail => !idsToDelete.includes(mail.id));
        setMails(updatedMails);
        
        setSelectedMail(null);
    } catch (err) {
        alert("삭제 실패");
    }
  };

  return (
    <div className={`app ${isSidebarClosed ? 'sidebar-closed' : ''}`}>
      {showPasswordChange ? (
        <ChangePassword 
          isForced={false} 
          onComplete={() => setShowPasswordChange(false)} 
          onCancel={() => setShowPasswordChange(false)} 
        />
      ) : (
        <>
          <Header 
            user={user} // 유저 정보 전달
            onLogout={handleLogout} // 로그아웃 함수 전달
            onSearchChange={setSearchQuery} 
            onMenuClick={() => setIsSidebarClosed(!isSidebarClosed)}
            onChangePasswordClick={() => setShowPasswordChange(true)}
          />

          <div className='container'>
            <Sidebar 
              isSidebarClosed={isSidebarClosed}
              activeMenu={currentCategory}
              onMenuClick={handleCategoryChange}
              onComposeClick={() => setIsComposeOpen(true)} 
            />

            {selectedMail ? (
              <MailDetail
                mail={selectedMail}
                onBack={() => setSelectedMail(null)}
                onDelete={deleteMailFromServer}
                handleEditCompose={handleEditCompose}
              />
            ) : (
              <MailList 
                searchQuery={searchQuery}
                onMailClick={setSelectedMail}
                category={currentCategory} 
                mails={getFilteredMails()}
                setMails={setMails}
                onDelete={deleteMailFromServer}
              />
            )}
          </div>
        </>
      )}

      {isComposeOpen && !showPasswordChange && (
        <ComposeModal 
          user={user}
          onClose={() => {
            setIsComposeOpen(false)
            setEditData(null);
          }} 
          onSend={addMail}
          editData={editData}
        />)}
    </div>
  );
};

export default MailHome;