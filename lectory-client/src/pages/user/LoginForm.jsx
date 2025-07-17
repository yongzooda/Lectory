import React, { useState } from 'react';
import axios from 'axios';

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                email,
                password,
            }, {
                headers: { 'Content-Type': 'application/json' }
            });

            const token = response.data.accessToken;
            localStorage.setItem('accessToken', token);
            alert('로그인 성공!');

            // 로그인 후 리다이렉트 등 처리

        } catch (err) {
            setError('로그인 실패: ' + (err.response?.data || err.message));
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="email" placeholder="이메일"
                value={email} onChange={e => setEmail(e.target.value)} required />
            <input
                type="password" placeholder="비밀번호"
                value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="submit">로그인</button>
            {error && <p style={{color:'red'}}>{error}</p>}
        </form>
    );
}

export default LoginForm;