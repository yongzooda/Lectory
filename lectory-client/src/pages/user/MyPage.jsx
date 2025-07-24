import { useEffect, useState } from "react";
import { getMyPage, deleteUser } from "../../api/mypageApi.js";
import { cancelPay } from "../../api/payApi.js";
import userImage from '../../assets/images/userImage.png';
import EditProfile from './UserEditProfile';
import '../../assets/css/mypage.css';


const MyPage = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [editOpen, setEditOpen] = useState(false);

    const fetchUser = () => {
        getMyPage()
            .then((data) => {
                setUser(data);
                setError(null);
            })
            .catch((err) => {
                console.error("유저 정보 가져오기 실패", err);
                setError("유저 정보를 불러오는 데 실패했습니다.");
            });
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm("정말로 회원 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.");
        if (!confirmDelete) return;

        try {
            await deleteUser();
            alert("회원 탈퇴가 완료되었습니다.");
            window.location.href = "/"; // 탈퇴 후 메인 페이지로 이동
        } catch (error) {
            console.error("회원 탈퇴 실패", error);
            alert("회원 탈퇴에 실패했습니다.");
        }
    };

    const handleCancelSubscription = async () => {
        try {
            const response = await cancelPay();
            if (response.data === 0) {
                alert("구독이 취소되었습니다.");
                fetchUser(); // 구독 정보 최신화
            }
        } catch (error) {
            console.error("구독 취소 실패", error);
            alert("구독 취소에 실패했습니다.");
        }
    };

    if (error) return <div className="mypage-error">{error}</div>;
    if (!user) return <div className="mypage-loading">로딩 중...</div>;

    return (
        <div>
            <h1 className="mypage-title">마이페이지</h1>
            <div className="mypage-wrapper">
                {/* 왼쪽 영역 */}
                <div className="mypage-left">
                    <div className="user-image-wrapper">
                        <img src={userImage} alt="User" className="user-image" />
                    </div>
                    <div className="user-nickname">{user.nickname} 님</div>
                    <button onClick={handleDeleteAccount} className="delete-account-btn">
                        회원 탈퇴
                    </button>
                </div>

                {/* 가운데 영역 */}
                <div className="mypage-center">
                    <h2 className="subscription-title">회원 정보</h2>
                    <div className="info-row">
                        <span className="label">이메일</span>
                        <span className="value">{user.email}</span>
                    </div>
                    <div className="info-row">
                        <span className="label">회원 타입</span>
                        <span className="value">
              {user.userType === 'PAID' ? '유료 회원' : '무료 회원'}
            </span>
                    </div>
                    <button onClick={() => setEditOpen(true)} className="edit-profile-btn">
                        회원 정보 수정
                    </button>
                </div>

                {/* 오른쪽 영역 */}
                <div className="mypage-right">
                    <h2 className="subscription-title">구독 정보</h2>
                    <div className="subscription-info">
                        <div>
                            <span className="label">구독 시작일</span>
                            <span className="value">{user.subscriptionStartDate || "없음"}</span>
                        </div>
                        <div>
                            <span className="label">구독 종료일</span>
                            <span className="value">{user.subscriptionEndDate || "없음"}</span>
                        </div>
                    </div>
                    {user.userType === "PAID" && (
                        <button onClick={handleCancelSubscription} className="cancel-subscription-btn">
                            구독 취소
                        </button>
                    )}
                </div>
            </div>

            {/* 수정 폼 모달 */}
            {editOpen && (
                <EditProfile
                    onClose={() => {
                        setEditOpen(false);
                        fetchUser(); // 수정 후 최신화
                    }}
                />
            )}
        </div>
    );
};

export default MyPage;
