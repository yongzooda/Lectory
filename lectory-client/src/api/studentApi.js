import axios from 'axios';

// 1) 강의실 목록 조회 (인기순/최신순)
export function listLectureRooms({ memberId, page, size, sort }) {
  return axios.get('/library', {
    params: { memberId, page, size, sort }
  });
}

// 2) 제목·태그 검색
export function searchLectureRooms({ memberId, search, tags, page, size, sort }) {
  return axios.get('/library/search', {
    params: { memberId, search, tags, page, size, sort }
  });
}

// 3) 강의실 상세 조회
export function getLectureDetail({ lectureRoomId, memberId }) {
  return axios.get(`/library/${lectureRoomId}`, {
    params: { memberId }
  });
}

// 4) 수강신청
export function enroll({ lectureRoomId, memberId }) {
  return axios.post(`/library/${lectureRoomId}/enroll`, { memberId });
}

// 5) 댓글 작성
export function postComment({ lectureRoomId, memberId, content }) {
  return axios.post(`/library/${lectureRoomId}/comments`, {
    memberId,
    content
  });
}
