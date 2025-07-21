import React, { useState } from 'react';
import { signUp } from "../../api/signupApi.js";

export default function SignUp() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    nickname: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      await signUp(form);
      alert('회원가입이 완료되었습니다!');
      // 페이지 이동 로직 추가 (예: 로그인 페이지로)
    } catch (err) {
      console.error('[회원가입 에러]', err.response || err);
      setError(err.response?.data?.message || '회원가입 실패');
    }
  };

  return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded-2xl">
        <h2 className="text-xl font-bold mb-4">회원가입</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
              type="email"
              name="email"
              placeholder="이메일"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border px-4 py-2 rounded"
          />
          <input
              type="password"
              name="password"
              placeholder="비밀번호"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full border px-4 py-2 rounded"
          />
          <input
              type="password"
              name="passwordConfirm"
              placeholder="비밀번호 확인"
              value={form.passwordConfirm}
              onChange={handleChange}
              required
              className="w-full border px-4 py-2 rounded"
          />
          <input
              type="text"
              name="nickname"
              placeholder="닉네임"
              value={form.nickname}
              onChange={handleChange}
              required
              className="w-full border px-4 py-2 rounded"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
          >
            가입하기
          </button>
        </form>
      </div>
  );
}
