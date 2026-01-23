import { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import MailList from '../components/MailList';
import ComposeModal from '../components/ComposeModal';
import MailDetail from '../components/MailDetail';

const MailHome = ({ user, setUser, initialMails }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mails, setMails] = useState(initialMails || []);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState('inbox');
  const [selectedMail, setSelectedMail] = useState(null);
  const [isSidebarClosed, setIsSidebarClosed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    alert("로그아웃 되었습니다.");
  };

  const addMail = (newMail) => {
    setMails([newMail, ...mails]);
  };

  const handleCategoryChange = (category) => {
    setCurrentCategory(category);
    setSelectedMail(null);
  };

  const deleteMailAndClose = (id) => {
    setMails(prevMails => prevMails.filter(mail => mail.id != id));
    setSelectedMail(null);
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
            onDelete={() => deleteMailAndClose(selectedMail.id)}
          />
        ) : (
          <MailList 
            searchQuery={searchQuery}
            onMailClick={setSelectedMail}
            category={currentCategory} 
            mails={mails}
            setMails={setMails}
          />
        )}
      </div>

      {isComposeOpen && 
        <ComposeModal 
          user={user}
          onClose={() => setIsComposeOpen(false)} 
          onSend={addMail}
        />}
    </div>
  );
};

export default MailHome;