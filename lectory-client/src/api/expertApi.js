// src/api/expertApi.js
import api from "./axiosInstance";

/* ── 1) 내 강의실 목록 ───────────────────────────────────── */
export const listMyLectures = ({ page, size, sort }) =>
  api.get("/library/expert", { params: { page, size, sort } });

/* ── 2) 내 강의실 검색 ───────────────────────────────────── */
export const searchMyLectures = ({ keyword, tags, page, size, sort }) =>
  api.get("/library/expert/search", {
    params: { keyword, tags, page, size, sort },
  });

/* ── 3) 강의실 상세 ──────────────────────────────────────── */
export const getLectureDetail = (lectureRoomId) =>
  api.get(`/library/expert/${lectureRoomId}`);

/* ── 4) 강의실 신규 등록 ────────────────────────────────── */
export const createLecture = (payload) =>
  api.post("/library/expert", payload);

/* ── 5) 강의실 수정  ⚠️ 오버로드 지원 ───────────────────── */
export function updateLecture(arg1, arg2) {
  /* 사용처 ①: updateLecture(lectureRoomId, payload)  */
  /* 사용처 ②: updateLecture({ lectureRoomId, ...payload }) */
  let lectureRoomId, body;
  if (typeof arg1 === "object" && arg1.lectureRoomId) {
    ({ lectureRoomId, ...body } = arg1);
  } else {
    lectureRoomId = arg1;
    body = arg2;
  }
  return api.put(`/library/expert/${lectureRoomId}`, body);
}

/* ── 6) 강의실 삭제 ─────────────────────────────────────── */
export const deleteLecture = (lectureRoomId) =>
  api.delete(`/library/expert/${lectureRoomId}`);

/* ── 7) 챕터 생성 ───────────────────────────────────────── */
export const createChapter = (payload) =>
  api.post("/library/expert/chapters", payload);

/* ── 8) 챕터 수정 ───────────────────────────────────────── */
export const updateChapter = ({ chapterId, ...rest }) =>
  api.put(`/library/expert/chapters/${chapterId}`, rest);

/* ── 9) 챕터 삭제 ───────────────────────────────────────── */
export const deleteChapter = (chapterId) =>
  api.delete(`/library/expert/chapters/${chapterId}`);

/* ── 10) 태그 풀 조회 (/api/tags) ───────────────────────── */
export const fetchAllTags = () => api.get("/tags");

/* ── 11) S3 Pre-Signed URL 발급 ─────────────────────────── */
/*  (백엔드: GET /api/uploads/presign?filename=foo.mp4)     */
export const getPresignedUploadUrl = (filename) =>
  api.get("/uploads/presign", { params: { filename } });
