"use client";

import { useState } from "react";
import "./signin.css";
import Navbar from "../navbar/page";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [form, setForm] = useState({ userId: "", password: "" });
  const [msg, setMsg] = useState("");
  const router = useRouter();

  const goSignup = () => {
    router.push("./signup");
  };

  const Login = async (e) => {
    e.preventDefault();
    setMsg("로그인 중...");

    try {
      const res = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMsg("로그인 성공!");
        window.location.href = "/board";
      } else {
        setMsg(data.message || "로그인 실패");
      }
    } catch {
      setMsg("서버 연결 실패");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="login_box">
        <h2 className="login_container">로그인</h2>
        <input
          type="text"
          className="id_text"
          value={form.userId}
          onChange={(e) => setForm({ ...form, userId: e.target.value })}
          required
          placeholder="아이디"
        ></input>
        <input
          type="password"
          className="pw_text"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          placeholder="비밀번호"
        ></input>
        <div className="sign_bt">
          <button type="button" className="login_bt" onClick={Login}>
            로그인
          </button>
          <button onClick={goSignup} className="signup_bt">
            회원가입
          </button>
          <p className="message">{msg}</p>
        </div>
      </div>
    </div>
  );
}
