// src/components/MailList.jsx
import { useState } from 'react'
import './MailList.css'

export default function MailList({onDelete, onMailClick, category, mails, setMails, searchQuery}) {

  
  const [selectedIds, setSelectedIds] = useState([]);

  const toggleCheck = (e, id) => {
    e.stopPropagation();
    if(selectedIds.includes(id)){
      setSelectedIds(selectedIds.filter(itemId => itemId !== id))
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  }

  const toggleAll = () => {
    if(selectedIds.length == filteredMails.length){
      setSelectedIds([]);
      //이미 모두 선택되어 있으면 선택 해제
    } else {
      setSelectedIds(filteredMails.map(mail => mail.id));
      //현재 보이는 메일 전체 선택
    }
  }

  const deleteSelected = () => {
    setMails(mails.filter(mail => !selectedIds.includes(mail.id)));
    setSelectedIds([]);
  }

  const filteredMails = (mails || []).filter((mail) => {
    // 1. mail 객체가 존재하는지 확인 (없으면 통과)
    if (!mail) return false;

    // 2. 카테고리 조건 (안전하게 처리)
    const matchesCategory = category === 'starred' 
      ? !!mail.isStarred 
      : mail.category === category;
    
    // 3. 검색어 조건 (toLowerCase 에러 방지용 기본값 처리)
    const search = (searchQuery || "").toLowerCase();
    const subject = (mail.subject || "").toLowerCase();
    const sender = (mail.sender||mail.sender_email || "").toLowerCase();

    const matchesSearch = subject.includes(search) || sender.includes(search);

    return matchesCategory && matchesSearch;
  });


  const toggleStar = (e, id) => {
      e.stopPropagation();
      const newMails = mails.map(mail =>
          mail.id === id ? { ...mail, isStarred: !mail.isStarred } : mail
      );
      setMails(newMails);
  }

  return (
    <main className="mail-list">

      <div className="mail-toolbar">
        <div className="toolbar-left">
          <input 
            type="checkbox" 
            data-tooltip='선택'
            onChange={toggleAll}
            checked={filteredMails.length > 0 && selectedIds.length === filteredMails.length}
          />
          <span className="material-icons" data-tooltip='선택 설정'>arrow_drop_down</span>
          <span className="material-icons" data-tooltip="새로고침" onClick={() => window.location.reload()}>refresh</span>
          <span className="material-icons" data-tooltip="더보기">more_vert</span>
          
          {/* 선택된 메일이 있을 때만 삭제 버튼 노출 */}
          {selectedIds.length > 0 && (
            <span className="material-icons delete-btn"
            onClick={() => {
              onDelete(selectedIds); // 선택된 ID 배열을 통째로 전달
              setSelectedIds([]);    // 선택 해제
            }}>
              delete_outline
            </span>
          )}
        </div>
        
        <div className="toolbar-right">
          <span className="page-info">1-{filteredMails.length} / {filteredMails.length}</span>
          <span className="material-icons">chevron_left</span>
          <span className="material-icons">chevron_right</span>
        </div>
      </div>

      <div className='mail-items-container'>
        {filteredMails.length > 0 ? (
          filteredMails.map((mail) => (
            <div 
              key={mail.id} 
              className={`mail-item ${selectedIds.includes(mail.id) ? 'selected' : ''}`}
              onClick={() => onMailClick(mail)}
            >
              <input 
                type="checkbox" 
                checked={selectedIds.includes(mail.id)}
                onChange={(e) => toggleCheck(e, mail.id)}
                onClick={(e) => e.stopPropagation()}
              />

              <span 
                  className={`material-icons star-icon ${mail.isStarred ? 'starred' : ''}`}
                  onClick={(e) => toggleStar(e, mail.id)}
              >
                  {mail.isStarred ? 'star' : 'star_border'}
              </span>

              <span className="sender">{mail.sender_email||mail.sender}</span>
              <div className="mail-content">
                <span className="subject">{mail.subject}</span>
              </div>
              <span className="time">
                {mail.created_at ? new Date(mail.created_at).toLocaleDateString() : mail.time}
              </span>

              <span
                className="material-icons delete-icon"
                onClick={(e)=>{
                  e.stopPropagation();
                  onDelete(mail.id);
                }}>
                delete_outline
              </span>
            </div>
          ))
        ):(
          <div className='noEmail'>
            {searchQuery ? `"${searchQuery}"에 대한 결과가 없습니다.`:"메일이 없습니다."}
          </div>
        )}
      </div>

    </main>
  );
}