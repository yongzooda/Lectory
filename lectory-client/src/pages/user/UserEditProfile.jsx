import React, { useState, useEffect } from 'react';
import { getMyPage, updateMyInfo } from '../../api/mypageApi.js';
import '../../assets/css/signup.css';

export default function EditProfile({ onClose }) {
    const [form, setForm] = useState({
        nickname: '',
        password: '',
        passwordConfirm: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMyPage()
            .then(data => {
                setForm({
                    nickname: data.nickname || '',
                    password: '',
                    passwordConfirm: '',
                });
                setLoading(false);
            })
            .catch(() => {
                setError('회원 정보를 불러오는 데 실패했습니다.');
                setLoading(false);
            });
    }, []);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async e => {
        e.preventDefault();

        if (form.password !== form.passwordConfirm) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }

        // payload 만들기 (빈 문자열인 경우 password 필드를 안 넣음)
        const payload = { nickname: form.nickname };

        if (form.password.trim() !== "") {
            payload.password = form.password;
            payload.passwordConfirm = form.passwordConfirm;
        }

        try {
            await updateMyInfo(payload);
            alert('회원 정보가 수정되었습니다.');
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || '수정 실패');
        }
    };

    if (loading) return <div>로딩 중...</div>;

    return (
        <div className="signup-form-overlay">
            <button className="signup-close-button" onClick={onClose} type="button">×</button>
            <h1 className="loginPage-title">회원 정보 수정</h1>
            <form onSubmit={handleSubmit} className="loginPage-form" noValidate>
                <input
                    type="text"
                    name="nickname"
                    placeholder="닉네임"
                    value={form.nickname}
                    onChange={handleChange}
                    required
                    className="loginPage-input"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="비밀번호 변경 (선택)"
                    value={form.password}
                    onChange={handleChange}
                    className="loginPage-input"
                />
                <input
                    type="password"
                    name="passwordConfirm"
                    placeholder="비밀번호 확인"
                    value={form.passwordConfirm}
                    onChange={handleChange}
                    className="loginPage-input"
                />

                {error && <p className="loginPage-error">{error}</p>}

                <button type="submit" className="loginPage-button">수정하기</button>
            </form>
        </div>
    );
}
