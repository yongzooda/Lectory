import React, { useState } from 'react';
import '../../assets/css/loginPage.css';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/loginApi.js';
import logo from '../../assets/images/Lectorylogo.png';

export default function LoginForm() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await login({ email, password });
            alert('로그인 성공!');
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || '로그인 실패');
        }
    };

    return (
        <div className="loginPage-body">
            <div className="loginPage-container">
                <div className="loginPage-welcome">
                    {/* 왼쪽 로그인 박스 */}
                    <div className="loginPage-left">
                        <div className="loginPage-pinkbox">
                            <h1 className="loginPage-title">sign in</h1>
                            <form onSubmit={handleSubmit} autoComplete="off" className="loginPage-form">
                                <input
                                    type="email"
                                    placeholder="이메일"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="loginPage-input"
                                    required
                                />
                                <input
                                    type="password"
                                    placeholder="비밀번호"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="loginPage-input"
                                    required
                                />
                                <button type="submit" className="loginPage-button">
                                    Login
                                </button>
                                {error && <p className="loginPage-error">{error}</p>}
                            </form>
                        </div>
                    </div>

                    {/* 오른쪽 회원가입 영역 */}
                    <div className="loginPage-right">
                        <img src={logo} alt="Lectory logo" className="signup-image" />
                        <p className="signup-account">don't have an account?</p>
                        <button className="signup-button" onClick={() => navigate('/signup')}>
                            Sign Up
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
