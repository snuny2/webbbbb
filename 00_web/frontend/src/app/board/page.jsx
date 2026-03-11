"use client";

import { useEffect, useState } from "react";
import Navbar from "../navbar/page";
import "./board.css";

export default function index() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPosts = (nextPage = page, nextLimit = limit) => {
    setLoading(true);

    fetch(`http://localhost:4000/posts?page=${nextPage}&limit=${nextLimit}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setPosts(Array.isArray(data.items) ? data.items : []);
        setPage(data.currentPage || 1);
        setTotalPages(data.totalPages || 1);
        setLoading(false);
      })
      .catch((err) => {
        console.error("게시글 불러오기 실패:", err);
        setPosts([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPosts(1, limit);
  }, []);

  const handleLimitChange = (e) => {
    const selectedLimit = Number(e.target.value);
    setLimit(selectedLimit);
    fetchPosts(1, selectedLimit);
  };

  const handlePrevPage = () => {
    if (page <= 1) return;
    fetchPosts(page - 1, limit);
  };

  const handleNextPage = () => {
    if (page >= totalPages) return;
    fetchPosts(page + 1, limit);
  };

  return (
    <div>
      <Navbar />

      <div className="board_con">
        <a href="board/write">
          <button className="write">글쓰기</button>
        </a>
        <div className="board_controls">
          <label htmlFor="limit_select">개수</label>
          <select id="limit_select" value={limit} onChange={handleLimitChange}>
            <option value={10}>10개</option>
            <option value={30}>30개</option>
            <option value={50}>50개</option>
          </select>
        </div>
        {loading ? (
          <p>불러오는 중...</p>
        ) : (
          <>
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
                    <td colSpan={5}>게시글이 없습니다.</td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="board_bottom">
              <div className="pagination">
                <button onClick={handlePrevPage} disabled={page <= 1}>
                  이전
                </button>

                <span>
                  {page} / {totalPages}
                </span>

                <button onClick={handleNextPage} disabled={page >= totalPages}>
                  다음
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
