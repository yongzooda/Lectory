// src/api/studentApi.js
import api from './axiosInstance';

/**
 * @typedef {Object} Chapter
 * @property {number} chapterId
 * @property {string} chapterName
 * @property {string} expectedTime
 * @property {number} orderNum
 * @property {string|null} videoUrl
 * @property {string[]} tags
 *
 * @typedef {Object} Comment
 * @property {number} commentId
 * @property {string} author
 * @property {string} content
 * @property {string} createdAt
 *
 * @typedef {Object} LectureDetail
 * @property {number} lectureRoomId
 * @property {string} title
 * @property {string} coverImageUrl
 * @property {string} fileUrl
 * @property {string} description
 * @property {string} expertName
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {number} enrollmentCount
 * @property {string[]} tags
 * @property {Chapter[]} chapters
 * @property {Comment[]} lectureComments
 * @property {boolean} isEnrolled
 * @property {boolean} isPaid
 * @property {boolean} canEnroll
 */

/**
 * 1) 전체 / 인기·최신순 목록 조회
 * @param {{ memberId: number, page: number, size: number, sort: string }} args
 * @returns {Promise<import('axios').AxiosResponse<{ content: LectureDetail[] }>>}
 */
export const listLectureRooms = ({ memberId, page, size, sort }) =>
  api.get('/library', { params: { memberId, page, size, sort } });

/**
 * 2) 제목·태그 검색
 * @param {{ memberId: number, search?: string, tags?: string[], page: number, size: number, sort: string }} args
 * @returns {Promise<import('axios').AxiosResponse<{ content: LectureDetail[] }>>}
 */
export const searchLectureRooms = ({
  memberId, search, tags, page, size, sort,
}) => {
  const params = { memberId, page, size, sort };
  if (search)       params.search = search;
  if (tags?.length) params.tags   = tags;
  return api.get('/library/search', { params });
};

/**
 * 3) 강의실 상세 조회
 * @param {{ lectureRoomId: number, memberId: number }} args
 * @returns {Promise<import('axios').AxiosResponse<LectureDetail>>}
 */
export const getLectureDetail = ({ lectureRoomId, memberId }) =>
  api.get(`/library/${lectureRoomId}`, { params: { memberId } });

/**
 * 4) 수강 신청 (무료·유료 구분은 백엔드에서)
 * @param {{ lectureRoomId: number, memberId: number }} args
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export const enroll = ({ lectureRoomId, memberId }) =>
  api.post(`/library/${lectureRoomId}/enroll`, { memberId });

/**
 * 5) 수강평(댓글) 작성
 * @param {{ lectureRoomId: number, memberId: number, content: string }} args
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export const postComment = ({ lectureRoomId, memberId, content }) =>
  api.post(`/library/${lectureRoomId}/comments`, { memberId, content });

/**
 * 6) 태그 풀 (필터 바)
 * @param {string} [q]
 * @returns {Promise<import('axios').AxiosResponse<string[]>>}
 */
export const fetchAllTags = (q = "") =>
  api.get("/tags", { params: q ? { q } : {} });
