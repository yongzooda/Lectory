// lectory-client/src/components/expert/DeleteConfirm.jsx
import styles from '../../assets/css/contentLibrary.module.css';

import React from 'react';

/**
 * 삭제 확인 모달
 *
 * props
 *  • open       : Boolean        ― true 일 때 표시
 *  • title      : String         ― 모달 헤더 (선택)
 *  • message    : String         ― 확인 문구 (기본: "정말 삭제하시겠습니까?")
 *  • confirmText: String         ― 확인 버튼 라벨 (기본: "삭제")
 *  • cancelText : String         ― 취소 버튼 라벨 (기본: "취소")
 *  • onConfirm(): void|Promise   ― 확인 클릭
 *  • onCancel() : void           ― 취소/닫기 클릭
 */
const DeleteConfirm = ({
  open,
  title = '삭제 확인',
  message = '정말 삭제하시겠습니까?',
  confirmText = '삭제',
  cancelText = '취소',
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  const stop = (e) => e.stopPropagation(); // 모달 내부 클릭 버블 방지

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      onClick={onCancel}
    >
      <div
        className="bg-white w-[90%] max-w-md rounded-lg shadow-lg p-6 space-y-6 animate-[fadeIn_0.2s_ease-out]"
        onClick={stop}
      >
        {/* ── 헤더 ── */}
        <h2 className="text-lg font-semibold">{title}</h2>

        {/* ── 메시지 ── */}
        <p className="text-gray-800 whitespace-pre-line">{message}</p>

        {/* ── 버튼 ── */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded text-white bg-rose-600 hover:bg-rose-700"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirm;
