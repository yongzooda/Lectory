import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PostListPage from './pages/PostListPage';

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
      </Routes>
    </BrowserRouter>
  )
}

export default App;