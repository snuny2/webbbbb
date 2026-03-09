"use client";

import { useState } from "react";
import "./signup.css";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [form, setForm] = useState({ name: "", userId: "", password: "" });
  const [msg, setMsg] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setMsg("회원가입 중");
    try {
      const res = await fetch("http://localhost:4000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMsg("회원가입 성공!");
        router.push("../signin");
      } else {
        const msg = Array.isArray(data.message)
          ? data.message.join("\n")
          : data.message || "회원가입 실패";
        setMsg(msg);
      }
    } catch {
      setMsg("서버 연결 실패");
    }
  };

  return (
    <div className="signup_box">
      <form onSubmit={handleSubmit} className="signup_form">
        <h1>회원가입</h1>
        <input
          type="text"
          placeholder="이름"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="아이디"
          value={form.userId}
          onChange={(e) => setForm({ ...form, userId: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button type="submit">가입하기</button>
        <p className="message">{msg}</p>
      </form>
    </div>
  );
}
