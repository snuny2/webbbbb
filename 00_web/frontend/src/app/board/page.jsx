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
  const [totalCount, setTotalCount] = useState(0);

  const [keyword, setKeyword] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchType, setSearchType] = useState("all");

  const fetchPosts = (
    nextPage = 1,
    nextLimit = limit,
    nextKeyword = keyword,
    nextSearchType = searchType,
  ) => {
    setLoading(true);

    const encodedKeyword = encodeURIComponent(nextKeyword || "");
    const encodedSearchType = encodeURIComponent(nextSearchType || "all");

    fetch(
      `http://localhost:4000/posts?page=${nextPage}&limit=${nextLimit}&keyword=${encodedKeyword}&searchType=${encodedSearchType}`,
      {
        credentials: "include",
      },
    )
      .then((res) => res.json())
      .then((data) => {
        setPosts(Array.isArray(data.items) ? data.items : []);
        setPage(data.currentPage || 1);
        setTotalPages(data.totalPages || 1);
        setTotalCount(data.total || 0);
        setKeyword(data.keyword || "");
        setSearchType(data.searchType || "all");
        setLoading(false);
      })
      .catch((err) => {
        console.error("게시글 불러오기 실패:", err);
        setPosts([]);
        setTotalCount(0);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPosts(1, 10, "", "all");
  }, []);

  const handleLimitChange = (e) => {
    const selectedLimit = Number(e.target.value);
    setLimit(selectedLimit);
    fetchPosts(1, selectedLimit, keyword, searchType);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPosts(1, limit, searchInput, searchType);
  };

  const handleResetSearch = () => {
    setSearchInput("");
    setSearchType("all");
    fetchPosts(1, limit, "", "all");
  };

  const handleMovePage = (targetPage) => {
    if (targetPage < 1 || targetPage > totalPages) return;
    fetchPosts(targetPage, limit, keyword, searchType);
  };

  const getPageNumbers = () => {
    const pageGroupSize = 5;
    const currentGroup = Math.floor((page - 1) / pageGroupSize);
    const startPage = currentGroup * pageGroupSize + 1;
    const endPage = Math.min(startPage + pageGroupSize - 1, totalPages);

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  const escapeRegExp = (text) => {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  const highlightText = (text) => {
    if (!keyword || !text) return text;

    const safeKeyword = escapeRegExp(keyword);
    const regex = new RegExp(`(${safeKeyword})`, "gi");
    const parts = String(text).split(regex);

    return parts.map((part, index) => {
      if (part.toLowerCase() === keyword.toLowerCase()) {
        return (
          <mark key={index} className="search_highlight">
            {part}
          </mark>
        );
      }
      return part;
    });
  };

  return (
    <div>
      <Navbar />

      <div className="board_con">
        <a href="board/write">
          <button className="write">글쓰기</button>
        </a>
        <form className="search_form" onSubmit={handleSearch}>
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option value="all">전체</option>
            <option value="title">제목</option>
            <option value="content">내용</option>
            <option value="author">작성자</option>
          </select>
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button type="submit">검색</button>
          <button type="button" onClick={handleResetSearch}>
            초기화
          </button>
        </form>
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
                          {highlightText(post.title)}
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
              <div className="board_bottom_left">
                <label htmlFor="limit_select">개수</label>
                <select
                  id="limit_select"
                  value={limit}
                  onChange={handleLimitChange}
                >
                  <option value={10}>10개</option>
                  <option value={30}>30개</option>
                  <option value={50}>50개</option>
                </select>
              </div>
              <div className="board_bottom_center">
                <div className="search_result_count">
                  {keyword && keyword.trim() !== ""
                    ? `검색 결과 ${totalCount}건`
                    : `전체 ${totalCount}건`}
                </div>
                <div className="pagination">
                  <button
                    onClick={() => handleMovePage(1)}
                    disabled={page === 1}
                  >
                    {"<<"}
                  </button>

                  <button
                    onClick={() => handleMovePage(page - 1)}
                    disabled={page === 1}
                  >
                    {"<"}
                  </button>
                  {pageNumbers.map((pageNumber) => (
                    <button
                      key={pageNumber}
                      onClick={() => handleMovePage(pageNumber)}
                      className={page === pageNumber ? "active_page" : ""}
                    >
                      {pageNumber}
                    </button>
                  ))}

                  <button
                    onClick={() => handleMovePage(page + 1)}
                    disabled={page === totalPages}
                  >
                    {">"}
                  </button>

                  <button
                    onClick={() => handleMovePage(totalPages)}
                    disabled={page === totalPages}
                  >
                    {">>"}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
