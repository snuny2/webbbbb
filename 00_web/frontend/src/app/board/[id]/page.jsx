"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "../../navbar/page";
import "./view.css";

export default function view() {
  const params = useParams();
  const router = useRouter();

  const id = params?.id;

  const [post, setPost] = useState(null);
  const [me, setMe] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:4000/posts/${id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setPost(data));

    fetch("http://localhost:4000/me", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (data?.user) {
          setMe({
            id: data.user.sub,
            name: data.user.name,
          });
        }
      });
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    const res = await fetch(`http://localhost:4000/posts/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (res.ok) {
      alert("삭제되었습니다.");
      router.push("/board");
    } else {
      const data = await res.json();
      alert(data.message || "삭제 실패");
    }
  };

  if (!post) return <div>로딩 중...</div>;

  const isAuthor = me?.id === post.authorId;

  return (
    <div>
      <Navbar />

      <div className="view_con">
        <h1>{post.title}</h1>
        <div className="view_info">
          <span>작성자: {post.author?.name}</span>
          <span>조회수: {post.viewCount}</span>
          <span>작성일: {new Date(post.createdAt).toLocaleDateString()}</span>
        </div>

        <div className="view_content">{post.content}</div>

        <a href="/board">
          <button className="back_btn">목록</button>
        </a>
        <a href={`/board/${post.id}/edit`}>
          <button className="back_btn">수정</button>
        </a>
        <button className="back_btn" onClick={handleDelete}>
          삭제
        </button>
      </div>
    </div>
  );
}
