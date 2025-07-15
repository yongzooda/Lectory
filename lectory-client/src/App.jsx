import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PostListPage from './pages/PostListPage';
import PostWritePage from './pages/PostWritePage';
import PostDetailPage from './pages/PostDetailPage';

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route path="/" element={<PostListPage/>}/>
        <Route path="/post-write" element={<PostWritePage/>}/>
        <Route path="/post-detail" element={<PostDetailPage/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;