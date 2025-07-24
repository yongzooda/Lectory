import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyPage } from "../api/mypageApi";
import LectoryLogo from "../assets/images/LectoryLogo.png";
import "../assets/css/navbar.css";

export default function Navbar() {
    const navigate = useNavigate();
    const [userType, setUserType] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");

        if (!token) {
            setUserType(null);
            setLoading(false);
            return;
        }

        async function fetchUserType() {
            try {
                const userInfo = await getMyPage();
                setUserType(userInfo.userType);
            } catch (error) {
                console.error("유저 정보 조회 실패", error);
                localStorage.removeItem("token");
                setUserType(null);
                navigate("/login");
            } finally {
                setLoading(false);
            }
        }

        fetchUserType();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setUserType(null);
        navigate("/login");
    };

    if (loading) {
        return <nav className="loadingNav">로딩 중...</nav>;
    }
    console.log("현재 userType:", userType);

    return (
        <nav className="navbar">
            {/* 로고 */}
            <div className="logoContainer">
                <Link to="/" className="logoLink">
                    <img src={LectoryLogo} alt="Lectory Logo" className="logoImage" />
                </Link>
            </div>

            {/* 우측에 메뉴 */}
            <div className="menu">
                <Link
                    to={userType === "EXPERT" ? "/library/expert" : "/library"}
                    className="menuLink"
                >
                    콘텐츠 라이브러리
                </Link>

                <Link to="/posts" className="menuLink">
                    Q&A 게시판
                </Link>

                <Link to="/pay" className="menuLink">
                    구독 페이지
                </Link>

                <Link
                    to={
                        userType === "EXPERT"
                            ? "/experts/mypage"
                            : (userType === "FREE" || userType === "PAID")
                                ? "/users/mypage"
                                : "/login"
                    }
                    className="menuLink"
                >
                    마이페이지
                </Link>

                <button onClick={handleLogout} className="logoutBtn" type="button">
                    로그아웃
                </button>
            </div>
        </nav>
    );
}
