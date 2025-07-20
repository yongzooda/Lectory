import React, { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLectureDetail, deleteLecture } from "../../../api/expertApi";

import LectureHeader  from "../../../components/detail/LectureHeader";
import ChapterList    from "../../../components/detail/ChapterList";
import CommentSection from "../../../components/detail/CommentSection";
import DeleteConfirm  from "../../../components/expert/DeleteConfirm";

const ExpertLectureDetail = () => {
  const { lectureRoomId } = useParams();
  const navigate          = useNavigate();

  const [detail,  setDetail]  = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDel, setShowDel] = useState(false);

  /* ── 데이터 로드 ── */
  const fetchDetail = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getLectureDetail(lectureRoomId);
      setDetail(data);
    } catch (e) {
      console.error(e);
      alert("강의 정보를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, [lectureRoomId]);

  useEffect(() => { fetchDetail(); }, [fetchDetail]);

  /* ── 삭제 ── */
  const handleDeleteLecture = async () => {
    await deleteLecture(lectureRoomId);
    alert("삭제되었습니다.");
    navigate("/library/expert");
  };

  /* ── 렌더 ── */
  if (loading) return <div className="p-8 text-center">Loading…</div>;
  if (!detail)  return <div className="p-8 text-center">강의실을 찾을 수 없습니다.</div>;

  return (
    <div className="container mx-auto p-6 space-y-10">
      {/* 헤더 */}
      <LectureHeader
        title            ={detail.title}
        coverImageUrl    ={detail.coverImageUrl}
        description      ={detail.description}
        expertName       ={detail.expertName}
        enrollmentCount  ={detail.enrollmentCount}
        isPaid           ={detail.isPaid}
        createdAt        ={detail.createdAt}
        updatedAt        ={detail.updatedAt}
      />

      <span className="inline-block bg-green-500 text-white px-3 py-1 rounded">
        수강 중
      </span>

      {/* 태그 */}
      {detail.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 my-4">
          {detail.tags.map((t) => (
            <span key={t} className="text-xs bg-gray-200 px-2 py-1 rounded">
              {t}
            </span>
          ))}
        </div>
      )}

      {/* 액션 버튼 */}
      <div className="flex space-x-3">
        <button
          onClick={() => navigate(`/library/expert/${lectureRoomId}/edit`)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
        >
          강의실 수정
        </button>
        <button
          onClick={() => setShowDel(true)}
          className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2 rounded"
        >
          강의실 삭제
        </button>
      </div>

      {/* 자료 ZIP */}
      {detail.fileUrl && (
        <section className="mt-6">
          <h2 className="text-xl font-bold mb-2">강의 자료</h2>
          <a
            href={detail.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            전체 강의 자료 다운로드
          </a>
        </section>
      )}

      {/* 챕터 목록 (읽기 전용) */}
      <section className="space-y-6 mt-6">
        <h2 className="text-xl font-bold">챕터 목록</h2>
        <ChapterList chapters={detail.chapters} isEnrolled={true} />
      </section>

      {/* 수강평 */}
      <section>
        <h2 className="text-xl font-bold mb-2">수강평</h2>
        <CommentSection comments={detail.lectureComments} />
      </section>

      {/* 삭제 확인 모달 */}
      <DeleteConfirm
        open={showDel}
        message="강의실을 삭제하면 복구할 수 없습니다. 정말 삭제하시겠습니까?"
        confirmText="삭제"
        onConfirm={handleDeleteLecture}
        onCancel={() => setShowDel(false)}
      />
    </div>
  );
};

export default ExpertLectureDetail;
