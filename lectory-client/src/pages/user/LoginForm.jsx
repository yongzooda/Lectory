import React, { useState } from 'react';
import '../../assets/css/loginPage.css';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/loginApi.js';
import logo from '../../assets/images/Lectorylogo.png';
import SignUpOverlay from './SignUpOverlay';
import { getMyPage, getExpertMyPage } from '../../api/mypageApi';

export default function LoginForm() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showSignup, setShowSignup] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await login({ email, password }); // 로그인 시도

            const userInfo = await getMyPage(); // 로그인된 유저 정보 가져오기

            if (userInfo.userType === 'EXPERT') {
                const expertInfo = await getExpertMyPage();
                console.log('expertInfo:', expertInfo);
                const approvalStatus = expertInfo.approval_status;

                if (approvalStatus === 'APPROVED') {
                    // 로그인 성공 처리
                    // alert 대신 UI 알림으로 변경 가능
                    alert('로그인 성공!');
                    navigate('/library/expert');
                } else if (approvalStatus === 'PENDING') {
                    setError('승인 대기 중 입니다.');
                } else {
                    setError('승인 거부된 계정입니다.');
                }
            } else {
                // 일반 유저 로그인 성공 처리
                alert('로그인 성공!');
                navigate('/library');
            }

        } catch (err) {
            // 백엔드에서 { message: "..." } 형태로 에러 메시지를 내려줬다고 가정
            setError(err.response?.data?.message || '');
        }
    };

    return (
        <div className="loginPage-body">
            <div className="loginPage-container">
                <div className="loginPage-welcome">
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

                    <div className="loginPage-right">
                        <img src={logo} alt="Lectory logo" className="signup-image" />
                        <p className="signup-account">don't have an account?</p>
                        <button className="signup-button" onClick={() => setShowSignup(true)}>
                            Sign Up
                        </button>
                    </div>

                    {showSignup && <SignUpOverlay onClose={() => setShowSignup(false)} />}
                </div>
            </div>
        </div>
    );
}
