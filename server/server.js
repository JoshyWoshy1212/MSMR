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
app.post('/auth/login', async (req, res) => {
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

//3. 메일 보내기
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

        res.status(201).json({ success: true, insertId: result.insertId });
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
            SELECT 
                id, user_id, sender_name, sender_email, 
                recipient_name, recipient_email, folder, 
                subject, body AS content, -- 프론트엔드와 호환을 위해 별칭 사용
                received_at AS created_at, -- 프론트엔드와 호환
                is_read, is_starred 
            FROM Email 
            WHERE recipient_email = ? OR sender_email = ? 
            ORDER BY received_at DESC
        `;
        const [rows] = await pool.query(sql, [userEmail, userEmail]);
        res.status(200).json(rows);
    } catch (error) {
        console.error("메일 로딩 오류:", error);
        res.status(500).json({ error: error.message });
    }
});

// email 삭제
app.delete('/api/emails/:id', async (req, res) => {
    const { id } = req.params; // URL 파라미터에서 할 일의 id를 가져옴

    try {
        const { data, error } = await supabase
            .from('emails')
            .delete()
            .eq('id', id); // 해당 id를 가진 행만 삭제

        if (error) throw error;
        res.status(200).json({ message: "성공적으로 삭제되었습니다." });
    } catch (error) {
        console.error("삭제 에러:", error.message);
        res.status(400).json({ error: error.message });
    }
});

//별표 토글
app.patch('/api/emails/:id/star', async (req, res) => {
    const { id } = req.params;
    const { is_starred } = req.body;
    try {
        await pool.query('UPDATE Email SET is_starred = ? WHERE id = ?', [is_starred ? 1 : 0, id]);
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});