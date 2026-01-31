import { useState, useRef, useEffect } from "react"
import './ComposeModal.css'
import axios from "axios";

export default function ComposeModal({ user, onClose, onSend, editData }) {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [to, setTo] = useState(editData?.recipient_email || '');
    const [subject, setSubject] = useState(editData ? `[재전송] ${editData.subject}` : '');
    const [content, setContent] = useState(editData?.content || '');

    const modalRef = useRef(null);

    //마우스를 눌렀을 때(드래그 시작)
    const handleMouseDown = (e) => {
        setIsDragging(true); 
        //현재 마우스와 모달 위치의 차이 저장
        setOffset({
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        });
    }

    //움직일 때(드래그 중)
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isDragging) return;

            //새 위치 계산
            setPosition({
                x: e.clientX - offset.x,
                y: e.clientY - offset.y,
            });
        };

        //마우스는 뗐을 때
        const handleMouseUp = () => {
            setIsDragging(false);
        }

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, offset]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user || !user.id) {
            alert("로그인 정보가 없습니다.");
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/emails', {
                sender_email: user.email,
                sender_name: user.name || user.full_name, // 서버 응답에 따라 대응
                recipient_email: to,
                subject: subject,
                content: content, // 서버에서 body로 변환할 것이므로 그대로 전송
                user_id: user.id
            });

            onSend(response.data);
            alert("메일을 보냈습니다.");
            onClose();
        } catch (error) {
            console.error(error);
            alert("메일 전송에 실패했습니다.");
        }
    }

    return (
        <div className="compose-modal"
            ref={modalRef}
            style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
            // 드래그 중에는 애니메이션 효과를 잠시 꺼서 부드럽게 함
            transition: isDragging ? 'none' : 'transform 0.1s' 
            }}
        >
            <div 
                className="modal-header"
                onMouseDown={handleMouseDown}
            >
                <span>새 매세지</span>
                <span className="material-icons" onClick={onClose}>close</span>
            </div>
            <div className="modal-body">
                <input 
                    type="text" 
                    placeholder="받는사람" 
                    value={to}
                    onChange={(e)=>setTo(e.target.value)}
                />
                <input 
                    value={subject}
                    type="text" 
                    placeholder="제목" 
                    onChange={(e)=>setSubject(e.target.value)}
                />
                <textarea 
                    value={content}
                    placeholder="내용을 입력하세요"
                    onChange={(e)=>setContent(e.target.value)}
                ></textarea>
            </div>
            <div className="modal-footer">
                <button className="send-btn" onClick={handleSubmit}>보내기</button>
            </div>
        </div>
    )
}