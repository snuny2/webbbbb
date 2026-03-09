"use client";

import { useEffect, useState } from "react";
import Navbar from "../navbar/page";
import "./board.css";

export default function index() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/posts", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setPosts(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <Navbar />

      <div className="board_con">
        <a href="board/write">
          <button className="write">글쓰기</button>
        </a>
        <table className="board_table">
          <thead>
            <tr>
              <th>ID</th>
              <th>제목</th>
              <th>작성자</th>
              <th>조회수</th>
              <th>작성일</th>
            </tr>
          </thead>
          <tbody>
            {posts.length > 0 ? (
              posts.map((post) => (
                <tr key={post.id}>
                  <td>{post.id}</td>
                  <td>
                    <a href={`/board/${post.id}`} className="post_link">
                      {post.title}
                    </a>
                  </td>
                  <td>{post.author?.name || "-"}</td>
                  <td>{post.viewCount}</td>
                  <td>
                    {post.createdAt
                      ? new Date(post.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">게시글이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
