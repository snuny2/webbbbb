"use client";

import { useState } from "react";
import Navbar from "../../navbar/page";
import "./write.css";

export default function WritePage() {
  const [form, setForm] = useState({
    title: "",
    content: "",
  });
  const [files, setFiles] = useState([]);
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("등록 중...");

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("content", form.content);

      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }

      const res = await fetch("http://localhost:4000/posts", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        alert("게시글이 등록되었습니다.");
        location.href = "../../board";
      } else {
        const errorMsg = Array.isArray(data.message)
          ? data.message.join("\n")
          : data.message || "등록 실패";
        setMsg(errorMsg);
      }
    } catch {
      setMsg("서버 연결 실패");
    }
  };

  return (
    <div>
      <Navbar />

      <div className="write_con">
        <h1>글쓰는 중</h1>

        <form className="write_form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="제목을 입력하세요"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <textarea
            placeholder="내용을 입력하세요"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />

          <input
            type="file"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files || []))}
          />

          <button type="submit">등록하기</button>
          <p className="message">{msg}</p>
        </form>
      </div>
    </div>
  );
}
