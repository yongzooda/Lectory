import api from './axiosInstance';

export const signUp = async (data) => {
    const response = await api.post('/users/signup', data, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.data;
};