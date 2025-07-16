import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PostListPage from "./pages/PostListPage";
import PostWritePage from "./pages/PostWritePage";
import PostDetailPage from "./pages/PostDetailPage";
import PayPage from "./pages/PayPage";
import PaySuccess from "./pages/sections/PaySuccess";

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route path="/" element={<PostListPage />} />
        <Route path="/post-write" element={<PostWritePage />} />
        <Route path="/post-detail" element={<PostDetailPage />} />
        <Route path="/pay" element={<PayPage />} />
        <Route path="/pay/success" element={<PaySuccess />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
