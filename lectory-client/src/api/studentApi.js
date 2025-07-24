// src/api/studentApi.js
import api from './axiosInstance';


/**
 * 1) 전체 / 인기·최신순 목록 조회
 * @param {{ page: number, size: number, sort: string }} args
 * @returns {Promise<import('axios').AxiosResponse<{ content: LectureDetail[] }>>}
 */
export const listLectureRooms = ({ page, size, sort }) =>
  api.get('/library', { params: { page, size, sort } });

/**
 * 2) 제목·태그 검색
 * @param {{ search?: string, tags?: string[], page: number, size: number, sort: string }} args
 * @returns {Promise<import('axios').AxiosResponse<{ content: LectureDetail[] }>>}
 */
export const searchLectureRooms = ({
  search, tags, page, size, sort,
}) => {
  const params = { page, size, sort };
  if (search)       params.search = search;
  if (tags?.length) params.tags   = tags;
  return api.get('/library/search', { params });
};

/**
 * 3) 강의실 상세 조회
 * @param {number} lectureRoomId
 * @returns {Promise<import('axios').AxiosResponse<LectureDetail>>}
 */
export const getLectureDetail = (lectureRoomId) =>
  api.get(`/library/${lectureRoomId}`);

/**
 * 4) 수강 신청 (무료·유료 구분은 백엔드에서)
 * @param {number} lectureRoomId
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export const enroll = (lectureRoomId) =>
  api.post(`/library/${lectureRoomId}/enroll`);

/**
 * 5) 수강평(댓글) 작성
 * @param {{ lectureRoomId: number, content: string }} args
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export const postComment = ({ lectureRoomId, content }) =>
  api.post(`/library/${lectureRoomId}/comments`, { content });

/**
 * 6) 태그 풀 (필터 바)
 * @returns {Promise<import('axios').AxiosResponse<string[]>>}
 */
export const fetchAllTags = () =>
  api.get('/tags');
