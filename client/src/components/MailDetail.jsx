import './MailDetail.css'
// src/components/MailDetail.jsx

export default function MailDetail({mail, onBack, onDelete}){
    if (!mail) return null;
    
    return (
        <main className="mail-detail">
            <div className="detail-header">
                <span 
                    className="material-icons" 
                    onClick={onBack} 
                    data-tooltip='뒤로가기'
                >arrow_back</span>
                <div className="detail-tools">
                    <span 
                        className="material-icons" 
                        onClick={()=>onDelete(mail.id)} 
                        data-tooltip='삭제'
                    >
                        delete
                    </span>
                </div>
            </div>
            <div className="detail-body">
                <h2>{mail.subject}</h2>
                <div className="sender-info">
                    <div className="profile-circle">
                        {(mail.sender_email || mail.sender || "U")[0].toUpperCase()}
                    </div>
                    <strong>{mail.sender_email || mail.sender}</strong>
                    <span className="time">
                        {mail.created_at ? new Date(mail.created_at).toLocaleString() : mail.time}
                    </span>
                </div>
                <div className="receiver-line">
                    <span className="to-text">받는 사람: </span>
                    <span>{mail.receiver_email || "나"}</span>
                </div>
                <hr className="detail-divider" />
                <div className="mail-text">
                    <p style={{ whiteSpace: 'pre-wrap' }}>{mail.content}</p>
                </div>
            </div>
        </main>
    )
}