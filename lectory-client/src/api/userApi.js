import api from './axiosInstance';

export async function getCurrent() {
  const res = await fetch("/api/users/me");
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}

export async function getUser() {
  try {
    const res = await api.get("/users/mypage");
    return res.data;
  } catch (err) {
    console.error("유저 정보를 불러오지 못했습니다.", err);
    throw new Error("Failed to fetch user");
  }
}