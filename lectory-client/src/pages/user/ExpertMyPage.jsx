import React, { useState, useEffect } from 'react';
import { getExpertMyPage, deleteUser } from '../../api/mypageApi.js';
import '../../assets/css/mypage.css';
import ExpertEditProfile from "./ExpertEditProfile.jsx";

const defaultProfile = '/path/to/defaultProfileImage.png'; // 기본 프로필 이미지 경로

function ExpertMyPage() {
    const [expert, setExpert] = useState(null);
    const [error, setError] = useState('');
    const [editOpen, setEditOpen] = useState(false);

    const fetchExpert = () => {
        getExpertMyPage()
            .then(data => {
                setExpert(data);
                setError('');
            })
            .catch(err => {
                console.error('전문가 정보 가져오기 실패', err);
                setError('전문가 정보를 불러오는 데 실패했습니다.');
            });
    };

    useEffect(() => {
        fetchExpert();
    }, []);


    const baseUrl = "http://localhost:8080";

    const profileImageUrl = expert?.profileImageUrl
        ? baseUrl + "/api/files/" + expert.profileImageUrl.split('/').pop()
        : defaultProfile;

    const portfolioUrl = expert?.portfolioFileUrl
        ? baseUrl + "/api/files/" + expert.portfolioFileUrl.split('/').pop()
        : null;


    const handleDownloadPortfolio = () => {
        if (portfolioUrl) {
            window.open(portfolioUrl, "_blank");
        } else {
            alert('포트폴리오 파일이 없습니다.');
        }
    };

    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm('정말로 회원 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.');
        if (!confirmDelete) return;

        try {
            await deleteUser();
            alert('회원 탈퇴가 완료되었습니다.');
            window.location.href = '/';
        } catch (error) {
            console.error('회원 탈퇴 실패', error);
            alert('회원 탈퇴에 실패했습니다.');
        }
    };

    if (error) return <div className="mypage-error">{error}</div>;
    if (!expert) return <div className="mypage-loading">로딩 중...</div>;

    return (
        <div>
            <h1 className="mypage-title">마이페이지</h1>
            <div className="mypage-wrapper">
                {/* 왼쪽 영역 */}
                <div className="mypage-left">
                    <div className="user-image-wrapper">
                        <img
                            src={profileImageUrl}
                            alt="프로필 사진"
                            className="user-image"
                        />
                    </div>
                    <div className="user-nickname">{expert.nickname} 님</div>
                    <button onClick={handleDeleteAccount} className="delete-account-btn">
                        회원 탈퇴
                    </button>
                </div>

                {/* 가운데 영역 */}
                <div className="mypage-center">
                    <h2 className="subscription-title">회원 정보</h2>
                    <div className="info-row">
                        <span className="label">이메일</span>
                        <span className="value">{expert.email}</span>
                    </div>
                    <div className="info-row">
                        <span className="label">회원 유형</span>
                        <span className="value">전문가</span>
                    </div>
                    <button onClick={() => setEditOpen(true)} className="edit-profile-btn">
                        회원 정보 수정
                    </button>
                </div>

                {/* 오른쪽 영역 */}
                <div className="mypage-right">
                    <h2 className="subscription-title">포트폴리오</h2>
                    <button
                        className="expert-portfolio-btn"
                        onClick={handleDownloadPortfolio}
                        disabled={!portfolioUrl}
                    >
                        포트폴리오 보기
                    </button>
                </div>
            </div>

            {editOpen && (
                <ExpertEditProfile
                    onClose={() => {
                        setEditOpen(false);
                        fetchExpert();
                    }}
                />
            )}
        </div>
    );
}

export default ExpertMyPage;
