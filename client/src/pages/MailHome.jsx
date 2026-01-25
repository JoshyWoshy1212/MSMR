import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import MailList from '../components/MailList';
import ComposeModal from '../components/ComposeModal';
import MailDetail from '../components/MailDetail';
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

  useEffect(() => {
      const fetchMails = async () => {
          try {
              // 1. 우선 로컬스토리지에 저장된 옛날 데이터가 있다면 먼저 보여줌 (속도 향상)
              const savedMails = localStorage.getItem(`mails_${user.email}`);
              if (savedMails) {
                  setMails(JSON.parse(savedMails));
              }

              // 2. 서버에서 최신 데이터 가져오기
              const res = await axios.get(`http://localhost:5000/api/emails/${user.email}`);
              const latestMails = res.data;

              // 3. 상태 업데이트 및 로컬스토리지 최신화
              setMails(latestMails);
              localStorage.setItem(`mails_${user.email}`, JSON.stringify(latestMails));
              
          } catch (err) {
              console.error("메일 목록 로딩 실패:", err);
          }
      };

      if (user?.email) fetchMails();
  }, [user.email]);

  const toggleStar = async (mailId, currentStatus) => {
    try {
        await axios.patch(`http://localhost:5000/api/emails/${mailId}/star`, {
            is_starred: !currentStatus
        });
        
        // 화면 업데이트 (새로고침 없이 반영)
        setMails(prev => prev.map(m => 
            m.id === mailId ? { ...m, is_starred: !currentStatus } : m
        ));
    } catch (err) {
        console.error("별표 업데이트 실패:", err);
    }
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

    if (!window.confirm(`${idsToDelete.length}개의 메일을 정말 삭제하시겠습니까?`)) return;

    try {
      // 1. 서버(DB)에 삭제 요청
      await Promise.all(idsToDelete.map(id => 
        axios.delete(`http://localhost:5000/api/emails/${id}`)
      ));

      // 2. 서버 삭제 성공 시, 화면(State) 업데이트
      const updatedMails = mails.filter(mail => !idsToDelete.includes(mail.id));
      setMails(updatedMails);

      // 3. 로컬스토리지 최신화
      localStorage.setItem(`mails_${user.email}`, JSON.stringify(updatedMails));

      // 4. 상세 보기 닫기
      setSelectedMail(null);
      
      alert("삭제되었습니다.");
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("메일을 삭제하지 못했습니다.");
    }
  };

  return (
    <div className={`app ${isSidebarClosed ? 'sidebar-closed' : ''}`}>
      <Header 
        user={user} // 유저 정보 전달
        onLogout={handleLogout} // 로그아웃 함수 전달
        onSearchChange={setSearchQuery} 
        onMenuClick={() => setIsSidebarClosed(!isSidebarClosed)}
      />
      <div className="container">
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
            mails={mails}
            setMails={setMails}
            onDelete={deleteMailFromServer}
          />
        )}
      </div>

      {isComposeOpen && 
        <ComposeModal 
          user={user}
          onClose={() => {
            setIsComposeOpen(false)
            setEditData(null);
          }} 
          onSend={addMail}
          editData={editData}
        />}
    </div>
  );
};

export default MailHome;