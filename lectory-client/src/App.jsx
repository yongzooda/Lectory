import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";

/* ─── 게시글 ─── */
import PostListPage from "./pages/post/PostListPage.jsx";
import PostWritePage from "./pages/post/PostWritePage";
import PostDetailPage from "./pages/post/PostDetailPage";
import PostEditPage from "./pages/post/PostEditPage";

/* ─── 로그인 및 회원가입 ─── */
import LoginPage from "./pages/user/LoginForm";
import SignUpPage from "./pages/user/SignUpOverlay";

/* ─── 마이페이지 ─── */
import UserMyPage from "./pages/user/MyPage.jsx";
import ExpertMyPage from "./pages/user/ExpertMyPage.jsx";

/* ─── 결제 ─── */
import PayPage from "./pages/pay/PayPage";
import PaySuccessPage from "./pages/sections/PaySuccess";

/* ─── 콘텐츠 라이브러리 · 수강생 ─── */
import StudentLibraryHome from "./pages/contentlibrary/student/LibraryHome";
import StudentLectureDetail from "./pages/contentlibrary/student/LectureDetail";
import EnrollResultPage from "./pages/contentlibrary/student/EnrollResult";

/* ─── 콘텐츠 라이브러리 · 전문가 ─── */
import ExpertLibraryHome from "./pages/contentlibrary/expert/LibraryHome";
import ExpertLectureDetail from "./pages/contentlibrary/expert/LectureDetail";
import NewLecturePage from "./pages/contentlibrary/expert/LectureNew";
import EditLecturePage from "./pages/contentlibrary/expert/LectureEdit";

/* ─── 관리자 전용 페이지 (다른 개발자 추가) ─── */
import MembershipManagementPage from "./pages/admin/MembershipManagementPage";
import ExpertApprovalPage from "./pages/admin/ExpertApprovalPage";
import ContentsManagementPage from "./pages/admin/ContentsManagementPage";
import Unauthorized from "./pages/admin/Unauthorized";

/* ─── 메인 레이아웃 ─── */
import MainLayout from "./components/MainLayout";

function isLoggedIn() {
    return !!localStorage.getItem('token');
}

function RootRedirect() {
    if (isLoggedIn()) {
        return <Navigate to="/library" replace/>;
    } else {
        return <Navigate to="/login" replace/>;
    }
}

export default function App() {
    return (
        <BrowserRouter future={{v7_startTransition: true, v7_relativeSplatPath: true}}>
            <Routes>
                {/* 루트 경로 접속 시 로그인 여부에 따라 이동 */}
                <Route path="/" element={<RootRedirect/>}/>

                {/* ─── 로그인 및 회원가입 ─── */}
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/signup" element={<SignUpPage/>}/>

                <Route element={<MainLayout/>}>
                    {/* ─── 마이페이지 ─── */}
                    <Route path="/users/mypage" element={<UserMyPage/>}/>
                    <Route path="/experts/mypage" element={<ExpertMyPage/>}/>

                    {/* ─── 게시글 영역 ─── */}
                    <Route path="/posts" element={<PostListPage/>}/>
                    <Route path="/posts/write" element={<PostWritePage/>}/>
                    <Route path="/posts/:postId" element={<PostDetailPage/>}/>
                    <Route path="/posts/rewrite/:postId" element={<PostEditPage/>}/>

                    {/* ─── 콘텐츠 라이브러리 · 수강생 ─── */}
                    <Route path="/library" element={<StudentLibraryHome/>}/>
                    <Route path="/library/search" element={<Navigate to="/library" replace/>}/>
                    <Route path="/library/:lectureRoomId" element={<StudentLectureDetail/>}/>
                    <Route path="/library/:lectureRoomId/enroll-result" element={<EnrollResultPage/>}/>

                    {/* ─── 콘텐츠 라이브러리 · 전문가 ─── */}
                    <Route path="/library/expert" element={<ExpertLibraryHome/>}/>
                    <Route path="/library/expert/search" element={<Navigate to="/library/expert" replace/>}/>
                    <Route path="/library/expert/new" element={<NewLecturePage/>}/>
                    <Route path="/library/expert/:lectureRoomId" element={<ExpertLectureDetail/>}/>
                    <Route path="/library/expert/:lectureRoomId/edit" element={<EditLecturePage/>}/>

                    {/* ─── 관리자 페이지 ─── */}
                    <Route path="/admin/students" element={<MembershipManagementPage/>}/>
                    <Route path="/admin/expert-approval" element={<ExpertApprovalPage/>}/>
                    <Route path="/admin/contents" element={<ContentsManagementPage/>}/>
                    <Route path="/unauthorized" element={<Unauthorized/>}/>

                    {/* ─── 결제 ─── */}
                    <Route path="/pay" element={<PayPage/>}/>
                    <Route path="/pay/success" element={<PaySuccessPage/>}/>
                </Route>

                {/* ─── 그 외 모든 경로 → 루트 ─── */}
                <Route path="*" element={<Navigate to="/" replace/>}/>
            </Routes>
        </BrowserRouter>
    );
}
