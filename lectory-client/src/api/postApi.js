import axios from "axios";

const BASE = "/api/posts";

/**
 * 1) 게시글 목록 조회 (페이징 + 정렬 + userId)
 */
export function listPosts({
  userId,
  page = 0,
  size = 10,
  sort = "createdAt,desc",
}) {
  return axios.get(BASE, {
    params: { userId, page, size, sort },
  });
}

/**
 * 2) 게시글 상세 조회
 */
export function getPostDetail({ postId, userId }) {
  return axios.get(`${BASE}/${postId}`, {
    params: { userId },
  });
}

/**
 * 3) 게시글 등록
 */
export function createPost({ userId, title, content, ...rest }) {
  return axios.post(
    `${BASE}`,
    { title, content, ...rest },
    {
      params: { userId },
    }
  );
}

// postApi.js
export async function getTags() {
  return axios.get(`/api/tags`);
}

/**
 * 4) 게시글 수정
 */
export function updatePost({ postId, userId, title, content, ...rest }) {
  return axios.put(
    `${BASE}/${postId}`,
    { title, content, ...rest },
    {
      params: { userId },
    }
  );
}

/**
 * 5) 게시글 삭제
 */
export function deletePost({ postId, userId }) {
  return axios.delete(`${BASE}/${postId}`, {
    params: { userId },
  });
}
