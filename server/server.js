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

//3. 할 일 추가 API
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

// 특정 사용자의 할 일 목록 가져오기
app.get('/api/todos/:userId', async (req, res) => {
    const { userId } = req.params; // 주소창의 :userId 값을 읽어옴

    const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', userId) // DB의 user_id가 요청받은 userId와 일치하는 데이터만 필터링
        .order('created_at', { ascending: false }); // 최신순 정렬

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json(data);
});

// 할 일 삭제 API
app.delete('/api/todos/:id', async (req, res) => {
    const { id } = req.params; // URL 파라미터에서 할 일의 id를 가져옴

    const { data, error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id); // DB의 id가 요청받은 id와 일치하는 것만 삭제

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json({ message: "삭제 성공", data });
});

// 할 일 상태 수정 API (PATCH)
app.patch('/api/todos/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, is_completed } = req.body; // 프론트에서 보낸 새로운 완료 상태

    const { data, error } = await supabase
        .from('todos')
        .update({ 
            title: title, 
            description: description,
            is_completed: is_completed 
        })
        .eq('id', id)
        .select();

    if (error) {
        return res.status(400).json({ error: error.message });
    }
    res.status(200).json(data);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});