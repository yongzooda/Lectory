import api from './axiosInstance';

export const getMyPage = async () => {
    try {
        const response = await api.get('/users/mypage');
        return response.data;
    } catch (error) {
        console.error('마이페이지 조회 실패:', error.response?.data || error.message);
        throw error;
    }
};

export const deleteUser = async () => {
    try {
        const response = await api.delete('/users/mypage');
        return response.data;
    } catch (error) {
        console.error('회원 탈퇴 실패:', error.response?.data || error.message);
        throw error;
    }
};

export const updateMyInfo = async (payload) => {
    try {
        const response = await api.put('/users/mypage', payload);
        return response.data;
    } catch (error) {
        console.error('회원 정보 수정 실패:', error.response?.data || error.message);
        throw error;
    }
};


export const getExpertMyPage = async () => {
    try {
        const response = await api.get('/experts/mypage');
        return response.data;
    } catch (error) {
        console.error('전문가 마이페이지 조회 실패:', error.response?.data || error.message);
        throw error;
    }
};

export const updateExpertInfo = async (payload) => {
    try {
        const response = await api.put('/experts/mypage', payload);
        return response.data;
    } catch (error) {
        console.error('전문가 정보 수정 실패:', error.response?.data || error.message);
        throw error;
    }
};
