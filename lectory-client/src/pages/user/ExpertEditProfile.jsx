import React, { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';
import { getExpertMyPage, updateExpertInfo } from '../../api/mypageApi';
import '../../assets/css/signup.css';

export default function ExpertEditProfile({ onClose }) {
    const [form, setForm] = useState({
        nickname: '',
        password: '',
        passwordConfirm: ''
    });

    const [portfolioFile, setPortfolioFile] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [prevPortfolio, setPrevPortfolio] = useState('');
    const [prevProfileImage, setPrevProfileImage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getExpertMyPage()
            .then(data => {
                setForm({
                    nickname: data.nickname || '',
                    password: '',
                    passwordConfirm: ''
                });
                setPrevPortfolio(data.portfolioFileUrl || '');
                setPrevProfileImage(data.profileImageUrl || '');
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

    const handleFileChange = (e, setter) => {
        if (e.target.files.length) {
            setter(e.target.files[0]);
        }
    };

    const uploadFile = async file => {
        const fd = new FormData();
        fd.append('file', file);
        const res = await api.post('/files/upload', fd, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return res.data.url;
    };

    const handleSubmit = async e => {
        e.preventDefault();

        if (form.password !== form.passwordConfirm) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            let payload = { nickname: form.nickname };

            if (form.password.trim() !== '') {
                payload.password = form.password;
                payload.passwordConfirm = form.passwordConfirm;
            }

            if (portfolioFile) {
                const url = await uploadFile(portfolioFile);
                payload.portfolioFileUrl = url;
            }

            if (profileImage) {
                const url = await uploadFile(profileImage);
                payload.profileImageUrl = url;
            }

            await updateExpertInfo(payload);
            alert('회원 정보가 수정되었습니다.');
            onClose();
        } catch (err) {
            console.error('[전문가 수정 오류]', err.response || err);
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
                    className="loginPage-input"
                    required
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

                <div className="file-input-wrapper">
                    <input
                        type="text"
                        readOnly
                        value={portfolioFile?.name || (prevPortfolio ? '기존 포트폴리오 있음' : '')}
                        placeholder="포트폴리오 업로드 (.pdf, .doc)"
                        className="loginPage-input file-input-display"
                        onClick={() => document.getElementById('portfolioInput').click()}
                    />
                    <input
                        type="file"
                        id="portfolioInput"
                        accept=".pdf,.doc,.docx"
                        style={{ display: 'none' }}
                        onChange={e => handleFileChange(e, setPortfolioFile)}
                    />
                </div>

                <div className="file-input-wrapper">
                    <input
                        type="text"
                        readOnly
                        value={profileImage?.name || (prevProfileImage ? '기존 프로필 이미지 있음' : '')}
                        placeholder="프로필 이미지 업로드 (jpg, png 등)"
                        className="loginPage-input file-input-display"
                        onClick={() => document.getElementById('profileInput').click()}
                    />
                    <input
                        type="file"
                        id="profileInput"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={e => handleFileChange(e, setProfileImage)}
                    />
                </div>


                {error && <p className="loginPage-error">{error}</p>}

                <button type="submit" className="loginPage-button">수정하기</button>
            </form>
        </div>
    );
}
