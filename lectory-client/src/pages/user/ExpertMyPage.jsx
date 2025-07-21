import React, { useState, useEffect } from 'react';
import { getExpertMyPage } from '../../api/mypageApi.js'; // API 호출 함수 분리해서 사용한다고 가정

function ExpertMyPage() {
    const [expert, setExpert] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        getExpertMyPage()
            .then(data => {
                setExpert(data);
                setError('');
            })
            .catch(err => {
                console.error('전문가 정보 가져오기 실패', err);
                setError('전문가 정보를 불러오는 데 실패했습니다.');
            });
    }, []);

    if (error) return <div style={{textAlign: 'center', color: 'red', marginTop: '20px'}}>{error}</div>;
    if (!expert) return <div style={{textAlign: 'center', marginTop: '20px'}}>Loading...</div>;

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            background: '#f0f2f5',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
        }}>
            <div style={{
                background: '#fff',
                padding: '40px',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                width: '360px',
                display: 'flex',
                flexDirection: 'column',
                gap: '18px'
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>전문가 마이페이지</h2>

                <p>닉네임: {expert.nickname}</p>
                <p>이메일: {expert.email}</p>
                <p>회원 유형: {expert.userType}</p>
                <p>포트폴리오: {expert.portfolioFileUrl}</p>
                <p>프로필사진: {expert.profileImageUrl}</p>

            </div>
        </div>
    );
}

export default ExpertMyPage;