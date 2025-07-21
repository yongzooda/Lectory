import api from './axiosInstance';

// adminApi.js

export const getAllCommnets = async () => {
  try {
    const response = await api.get('/admin/manage-comments');
    // ✅ 응답 구조가 { data: [...] } 혹은 { data: { data: [...] } } 인지 확인
    return response.data.data ?? response.data; // 유연하게 처리
  } catch (error) {
    console.error('getAllCommnets axios 실패:', error);
    throw error;
  }
};

  
export const getAllPosts = async () => {
    try {
        const response = await api.get('/admin/manage-posts');
        return response.data;
    } catch (error) {
        console.error('모든 게시판 조회 실패:', error.response?.data || error.message);
        throw error;
    }
};