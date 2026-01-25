const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const {createClient} = require('@supabase/supabase-js');

const PORT = process.env.PORT || 5000;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(cors());
app.use(express.json());

app.get('/test', async (req, res) => {
    res.send('서버가 작동 중입니다!');
});
//
//1. 회원가입 API
app.post('/auth/signup', async (req, res) => {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json({ message: "회원가입 성공! 이메일을 확인해주세요.", data });
});

//2. 로그인 API
app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) return res.status(400).json({ error: error.message });
    
    // 세션 정보와 토큰을 보냅니다.
    res.status(200).json({ 
        message: "로그인 성공!", 
        token: data.session.access_token,
        user: data.user 
    });
});

//3. 메일 보내기
app.post('/api/emails', async (req, res) => {
    const { sender_email, receiver_email, subject, content, user_id } = req.body;

    const { data, error } = await supabase
        .from('emails')
        .insert([
            { 
                sender_email, 
                receiver_email, 
                subject, 
                content, 
                user_id,
                category: 'sent'
            }
        ])
        .select();

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json({ message: "메일이 성공적으로 전송되었습니다.", data });
});

// email 목록 가져오기
app.get('/api/emails/:userEmail', async (req, res) => {
    const { userEmail } = req.params; // 주소창의 :userId 값을 읽어옴
    
    try {
        const { data, error } = await supabase
            .from('emails')
            .select('*')
            // 내가 보냈거나, 나에게 온 메일을 모두 가져옴
            .or(`sender_email.eq.${userEmail},receiver_email.eq.${userEmail}`)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
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

//is_starred 항목 수정
app.patch('/api/todos/:id/star', async (req, res) => {
    const { id } = req.params;
    const { is_starred } = req.body; // 프론트에서 보낸 새로운 완료 상태

    try {
        const { data, error } = await supabase
            .from('emails')
            .update({ is_starred }) // DB 컬럼명이 is_starred 인지 확인하세요!
            .eq('id', id)
            .select();

        if (error) throw error;
        res.status(200).json(data[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});