// src/api/postApi.js
import axios from "./axiosInstance";

/**
 * 게시글 생성
 * POST /api/posts
 * @param {{ title: string, content: string, onlyExpert: boolean, tagNames: String[] }} postData
 */
export const createPost = (postData) => axios.post("/posts", postData);

/**
 * 게시글 목록 조회 (페이징 및 검색)
 * GET /api/posts?userId={userId}&page={page}&size={size}&sort={field,DIR}
 * @param {{ userId?: number, page?: number, size?: number, sort?: string }} params
 */
export const fetchPosts = (params = {}) => axios.get("/posts", { params });

/**
 * 게시글 상세 조회
 * GET /api/posts/{postId}
 * @param {number} postId
 */
export const fetchPostById = (postId) => axios.get(`/posts/${postId}`);

/**
 * 게시글 수정
 * PUT /api/posts/{postId}
 * @param {number} postId
 * @param {{ title: string, content: string, onlyExpert: boolean, tagNames: String[] }} postData
 */
export const updatePost = (postId, postData) =>
  axios.put(`/posts/${postId}`, postData);

/**
 * 게시글 삭제
 * DELETE /api/posts/{postId}
 * @param {number} postId
 */
export const deletePost = (postId) => axios.delete(`/posts/${postId}`);
