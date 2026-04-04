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

  const [existingFiles, setExistingFiles] = useState([]);
  const [deleteFileIds, setDeleteFileIds] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
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
        setExistingFiles(Array.isArray(data.files) ? data.files : []);
      })
      .catch((err) => console.error(err));
  }, [id]);

  const toggleDeleteFile = (fileId) => {
    setDeleteFileIds((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId],
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("수정 중...");

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("content", form.content);

      if (deleteFileIds.length > 0) {
        formData.append("deleteFileIds", deleteFileIds.join(","));
      }

      for (let i = 0; i < newFiles.length; i++) {
        formData.append("files", newFiles[i]);
      }

      const res = await fetch(`http://localhost:4000/posts/${id}`, {
        method: "PATCH",
        credentials: "include",
        body: formData,
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
    } catch {
      setMsg("서버 연결 실패");
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

          <div className="edit_file_section">
            <h3>기존 첨부파일</h3>

            {existingFiles.length > 0 ? (
              <div className="edit_file_list">
                {existingFiles.map((file) => {
                  const checked = deleteFileIds.includes(file.id);

                  return (
                    <label key={file.id} className="edit_file_item">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleDeleteFile(file.id)}
                      />
                      <span className={checked ? "delete_marked" : ""}>
                        {file.originalName}
                      </span>
                    </label>
                  );
                })}
              </div>
            ) : (
              <p className="empty_file_text">기존 첨부파일이 없습니다.</p>
            )}
          </div>

          <div className="edit_file_section">
            <h3>파일 추가</h3>
            <input
              type="file"
              multiple
              onChange={(e) => setNewFiles(Array.from(e.target.files || []))}
            />
          </div>

          <button type="submit">수정하기</button>

          <p className="message">{msg}</p>
        </form>
      </div>
    </div>
  );
}
