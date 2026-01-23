import './MailDetail.css'
// src/components/MailDetail.jsx

export default function MailDetail({mail, onBack, onDelete}){
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
                        onClick={onDelete} 
                        data-tooltip='삭제'
                    >
                        delete
                    </span>
                </div>
            </div>
            <div className="detail-body">
                <h2>{mail.subject}</h2>
                <div className="sender-info">
                    <div className="profile-circle">{mail.sender[0]}</div>
                    <strong>{mail.sender}</strong>
                    <span className="time">{mail.time}</span>
                </div>
                <div className="mail-text">
                    <p>{mail.sender}</p>
                </div>
            </div>
        </main>
    )
}