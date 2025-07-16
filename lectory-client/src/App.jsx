// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// 기존 포스트 페이지
import PostListPage from "./pages/PostListPage";
import PostWritePage from "./pages/PostWritePage";
import PostDetailPage from "./pages/PostDetailPage";

// 학생용 콘텐츠 라이브러리 페이지
import StudentListPage from "./pages/contentlibrary/student/ListPage";
import StudentSearchPage from "./pages/contentlibrary/student/SearchPage";
import StudentDetailPage from "./pages/contentlibrary/student/DetailPage";
import EnrollResultPage from "./pages/contentlibrary/student/EnrollResult";

// 전문가용 콘텐츠 라이브러리 페이지
import ExpertListPage from "./pages/contentlibrary/expert/ListPage";
import ExpertSearchPage from "./pages/contentlibrary/expert/SearchPage";
import NewLecturePage from "./pages/contentlibrary/expert/NewLecturePage";
import ExpertDetailPage from "./pages/contentlibrary/expert/DetailPage";
import EditLecturePage from "./pages/contentlibrary/expert/EditLecturePage";
import ManageChaptersPage from "./pages/contentlibrary/expert/ManageChaptersPage";

// 결제 페이지
import PayPage from "./pages/pay/PayPage";
import PaySuccessPage from "./pages/sections/PaySuccess";
function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        {/** ─── 기존 포스트 ─── */}
        <Route path="/" element={<PostListPage />} />
        <Route path="/post-write" element={<PostWritePage />} />
        <Route path="/post-detail/:postId" element={<PostDetailPage />} />

        {/** ─── 학생용 콘텐츠 라이브러리 ─── */}
        <Route path="/library" element={<StudentListPage />} />
        <Route path="/library/search" element={<StudentSearchPage />} />
        <Route path="/library/:lectureRoomId" element={<StudentDetailPage />} />
        <Route
          path="/library/:lectureRoomId/enroll-result"
          element={<EnrollResultPage />}
        />

        {/** ─── 전문가용 콘텐츠 라이브러리 ─── */}
        <Route path="/library/expert" element={<ExpertListPage />} />
        <Route path="/library/expert/search" element={<ExpertSearchPage />} />
        <Route path="/library/expert/new" element={<NewLecturePage />} />
        <Route
          path="/library/expert/:lectureRoomId"
          element={<ExpertDetailPage />}
        />
        <Route
          path="/library/expert/:lectureRoomId/edit"
          element={<EditLecturePage />}
        />
        <Route
          path="/library/expert/:lectureRoomId/chapters"
          element={<ManageChaptersPage />}
        />

        {/** ─── 결제 페이지 ─── */}
        <Route path="/pay" element={<PayPage />} />
        <Route path="/pay/success" element={<PaySuccessPage />} />

        {/** ─── 그 외 경로는 루트로 리다이렉트 ─── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
