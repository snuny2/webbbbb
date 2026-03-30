"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../../navbar/page";
import "./edit.css";

export default function EditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [form, setForm] = useState({
    title: "",
    content: "",
  });

  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch(`http://localhost:4000/posts/${id}/edit`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setForm({
          title: data.title || "",
          content: data.content || "",
        });
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("수정 중...");

    const res = await fetch(`http://localhost:4000/posts/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(form),
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      alert("수정되었습니다.");
      router.push(`/board/${id}`);
    } else {
      const errorMsg = Array.isArray(data.message)
        ? data.message.join("\n")
        : data.message || "수정 실패";

      setMsg(errorMsg);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="edit_con">
        <h1>게시글 수정</h1>

        <form className="edit_form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={form.title}
            placeholder="제목"
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <textarea
            value={form.content}
            placeholder="내용"
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />

          <button type="submit">수정하기</button>

          <p className="message">{msg}</p>
        </form>
      </div>
    </div>
  );
}
