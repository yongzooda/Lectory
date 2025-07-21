import React, { useState } from 'react';
import api from '../../api/axiosInstance';
import { signUp } from "../../api/signupApi.js";
import { expertSignup } from "../../api/expertSignupApi.js";
import '../../assets/css/signup.css';

export default function SignUpOverlay({ onClose }) {
  const [form, setForm] = useState({
    email: '', password: '', passwordConfirm: '', nickname: ''
  });
  const [isExpert, setIsExpert] = useState(false);
  const [portfolioFile, setPortfolioFile] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [error, setError] = useState('');

  const handleChange = e => { setForm({ ...form, [e.target.name]: e.target.value }); setError(''); };
  const handleCheckbox = e => { setIsExpert(e.target.checked); setError(''); };
  const handleFileChange = (e, setter) => { if (e.target.files.length) setter(e.target.files[0]); };

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
      let payload = { ...form };

      if (isExpert) {
        const [portfolioFileUrl, profileImageUrl] = await Promise.all([
          uploadFile(portfolioFile),
          uploadFile(profileImage)
        ]);
        payload = { ...payload, portfolioFileUrl, profileImageUrl };
        await expertSignup(payload);
      } else {
        await signUp(payload);
      }

      alert('회원가입이 완료되었습니다!');
      onClose();
    } catch (err) {
      console.error('[회원가입 에러]', err.response || err);
      setError(err.response?.data?.message || '회원가입 실패');
    }
  };

  return (
      <div className="signup-form-overlay">
        <button className="signup-close-button" onClick={onClose} type="button">×</button>
        <h1 className="loginPage-title">Sign Up</h1>
        <form onSubmit={handleSubmit} className="loginPage-form" noValidate>
          {['email','password','passwordConfirm','nickname'].map(name => (
              <input
                  key={name}
                  type={name.includes('password') ? 'password' : name === 'email' ? 'email' : 'text'}
                  name={name}
                  placeholder={
                    name === 'passwordConfirm' ? '비밀번호 확인' : name === 'nickname' ? '닉네임' : name
                  }
                  value={form[name]}
                  onChange={handleChange}
                  required
                  className="loginPage-input"
              />
          ))}

          <label className="expert-checkbox">
            <input type="checkbox" checked={isExpert} onChange={handleCheckbox} /> 전문가로 가입하기
          </label>

          <div className={`expert-extra ${isExpert ? 'open' : ''}`}>
            <label className="file-label">
              {portfolioFile?.name || '포트폴리오 업로드'}
              <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  hidden
                  onChange={e => handleFileChange(e, setPortfolioFile)}
                  required={isExpert}
              />
            </label>
            <label className="file-label">
              {profileImage?.name || '프로필 이미지 업로드'}
              <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={e => handleFileChange(e, setProfileImage)}
                  required={isExpert}
              />
            </label>
          </div>

          {error && <p className="loginPage-error">{error}</p>}

          <button type="submit" className="loginPage-button">가입하기</button>
        </form>
      </div>
  );
}
