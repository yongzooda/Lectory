import { useEffect, useState } from 'react';
import { getMyPage } from '../../api/mypageApi.js' // ✅ 이 함수 사용

const MyPage = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        getMyPage()
            .then(data => {
                setUser(data);
                setError(null);
            })
            .catch(err => {
                console.error('유저 정보 가져오기 실패', err);
                setError('유저 정보를 불러오는 데 실패했습니다.');
            });
    }, []);

    if (error) return <div>{error}</div>;
    if (!user) return <div>Loading...</div>;

    return (
        <div className="mypage">
            <h2>내 정보</h2>
            <p>닉네임: {user.nickname}</p>
            <p>이메일: {user.email}</p>
            <p>회원 유형: {user.userType}</p>
            <p>구독 시작일: {user.subscriptionStartDate || '없음'}</p>
            <p>구독 종료일: {user.subscriptionEndDate || '없음'}</p>
        </div>
    );
};

export default MyPage;
