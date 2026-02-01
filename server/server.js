const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 5000;
const pool = require('./db');

app.use(cors());
app.use(express.json());

app.get('/test', async (req, res) => {
    res.send('서버가 작동 중입니다!');
});

//1. 회원가입 API
app.post('/auth/signup', async (req, res) => {
    const { email, password, name } = req.body;
    
    try{
        //이메일 중복 체크
        const [existing] = await pool.query(`SELECT * FROM User WHERE email = ?`, [email]);
        if (existing.length > 0) {
            return res.status(400).json({ error: "이미 존재하는 이메일입니다." });
        }

        //유저 생성
        const sql = `INSERT INTO User (full_name, email, password) VALUES (?, ?, ?)`;
        await pool.query(sql, [name, email, password]);

        res.status(201).json({ message: "회원가입이 성공" });
    } catch (error) {
        console.error("회원가입 오류:", error.message);
        res.status(500).json({ error: "회원가입에 실패" });
    }
});

//2. 로그인 API
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try{
        const sql = `SELECT * FROM User WHERE email = ?`;
        const [rows] = await pool.query(sql, [email]);

        if (rows.length === 0) {
            return res.status(401).json({ error: "사용자를 찾을 수 없습니다." });
        }

        const user = rows[0];

        //비밀번호 확인(실제 서비스는 bcrpyt등으로 암호화 필요)
        if (user.password !== password) {
            return res.status(401).json({ error: "비밀번호가 올바르지 않습니다." });
        }

        // 로그인 시 'last_login_at'을 현재 시간으로 업데이트해주면 더 좋습니다 (옵션)
        await pool.query('UPDATE User SET last_login_at = NOW() WHERE id = ?', [user.id]);

        //로그인 성공시 유저 정보 반환(비번 제외)
        const { password: _, two_factor_secret: __, ...userWithoutPassword } = user;

        res.status(200).json({ 
            token: "your_jwt_token",
            user: {
                id: user.id,
                email: user.email,
                name: user.full_name, // DB의 full_name을 name으로 매핑해서 전송
            },
            message: "로그인 성공!"
        });
    } catch (error) {
        console.error("로그인 오류:", error.message);
        res.status(500).json({ error: "로그인에 실패했습니다." });
    }
});

// 로그아웃 API (세션/쿠키 사용 시 필요)**
app.post('/api/logout', (req, res) => {
    // 세션이나 쿠키를 사용한다면 여기서 제거 로직을 넣습니다.
    res.status(200).json({ message: "로그아웃 되었습니다." });
});

// 3. 메일 보내기 (보완 버전)
app.post('/api/emails', async (req, res) => {
    const { sender_email, recipient_email, subject, content, user_id, sender_name, recipient_name } = req.body;
    
    try {
        const sql = `
            INSERT INTO Email 
            (user_id, sender_email, sender_name, recipient_email, recipient_name, subject, body, folder)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'sent')
        `;
        const [result] = await pool.query(sql, [
            user_id, sender_email, sender_name || '', 
            recipient_email, recipient_name || '', 
            subject, content
        ]);

        // 💡 중요: 방금 넣은 데이터를 다시 조회해서 프론트엔드에 전달 (body AS content 매핑 포함)
        const [newMail] = await pool.query(
            `SELECT *, body AS content, received_at AS created_at FROM Email WHERE id = ?`, 
            [result.insertId]
        );

        res.status(201).json(newMail[0]); // 전체 객체 반환
    } catch (error) {
        console.error("전송 오류:", error);
        res.status(500).json({ error: error.message });
    }
});

// email 목록 가져오기
app.get('/api/emails/:userEmail', async (req, res) => {
    const { userEmail } = req.params;
    try {
        // SQL: 내가 보냈거나(sender_email) 내가 받은(recipient_email) 메일을 최신순 조회
        const sql = `
            SELECT *, body AS content, received_at AS created_at
            FROM Email 
            WHERE (recipient_email = ? OR sender_email = ?) 
                AND deleted_at IS NULL
            ORDER BY received_at DESC
        `;
        const [rows] = await pool.query(sql, [userEmail, userEmail]);
        res.status(200).json(rows);
    } catch (error) {
        console.error("메일 로딩 오류:", error);
        res.status(500).json({ error: error.message });
    }
});

// email 삭제 (복구가 가능하도록 실제 데이터는 남겨둠)
app.delete('/api/emails/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // 현재 시간을 deleted_at에 기록
        const sql = 'UPDATE Email SET deleted_at = NOW() WHERE id = ?';
        await pool.query(sql, [id]);

        res.status(200).json({ success: true, message: "메일이 휴지통으로 이동되었습니다." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// server.js의 PATCH 부분 수정 제안
app.patch('/api/emails/:id/star', async (req, res) => {
    const { id } = req.params;
    const { is_starred } = req.body; 

    // 데이터가 잘 넘어오는지 디버깅용 로그
    console.log(`메일 ID: ${id}, 별표 상태: ${is_starred}`);

    try {
        // 명확하게 1 또는 0으로 변환 (숫자형이나 불리언 모두 대응 가능)
        const starredValue = (is_starred === true || is_starred === 1) ? 1 : 0;
        
        const sql = 'UPDATE Email SET is_starred = ? WHERE id = ?';
        await pool.query(sql, [starredValue, id]);

        res.status(200).json({ success: true, is_starred: starredValue });
    } catch (error) {
        console.error("별표 토글 에러:", error.message);
        res.status(500).json({ error: error.message });
    }
});
// 읽음 상태 업데이트
app.patch('/api/emails/:id/read', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('UPDATE Email SET is_read = 1 WHERE id = ?', [id]);
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 4. 비밀번호 재설정 API
const crypto = require('crypto');
const sendResetMail = require('./utils/mailSender');

app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    // 1. 유저 확인
    const [users] = await pool.query('SELECT * FROM User WHERE email = ?', [email]);
    if (users.length === 0) return res.status(404).json({ error: "등록되지 않은 이메일입니다." });

    // 2. 임시 비밀번호 생성 (8자리 무작위)
    const tempPassword = crypto.randomBytes(4).toString('hex'); 
    
    // 3. DB 업데이트 (임시 비밀번호로 교체 및 변경 필요 플래그 설정)
    // password_needs_change 같은 컬럼을 User 테이블에 추가하면 더 좋습니다.
    await pool.query('UPDATE User SET password = ? WHERE email = ?', [tempPassword, email]);

    // 4. 메일 발송
    await sendResetMail(email, tempPassword);

    res.status(200).json({ message: "메일로 임시 비밀번호가 발송되었습니다." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "메일 발송 중 오류 발생" });
  }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});