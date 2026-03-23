"use client";

import { useEffect, useState } from "react";
import Navbar from "../navbar/page";
import Link from "next/link";
import "./mypage.css";

export default function MyPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [postPage, setPostPage] = useState(1);
  const [commentPage, setCommentPage] = useState(1);

  const [editForm, setEditForm] = useState({
    name: "",
    currentPassword: "",
    newPassword: "",
  });
  const [editMsg, setEditMsg] = useState("");
  const [withdrawPassword, setWithdrawPassword] = useState("");
  const [withdrawMsg, setWithdrawMsg] = useState("");

  const [showEditForm, setShowEditForm] = useState(false);
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);

  const API = "http://localhost:4000";

  const fetchMyPage = (
    nextPostPage = postPage,
    nextCommentPage = commentPage,
  ) => {
    setLoading(true);

    fetch(
      `${API}/mypage?postPage=${nextPostPage}&commentPage=${nextCommentPage}&limit=5`,
      {
        credentials: "include",
      },
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("마이페이지 조회 실패");
        }
        return res.json();
      })
      .then((result) => {
        setData(result);
        setPostPage(result.posts?.currentPage || 1);
        setCommentPage(result.comments?.currentPage || 1);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetch(`${API}/mypage`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("마이페이지 조회 실패");
        }
        return res.json();
      })
      .then((result) => {
        setData(result);
        setEditForm((prev) => ({
          ...prev,
          name: result.user?.name || "",
        }));
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setEditMsg("수정 중...");

    const requestBody = {
      name: editForm.name,
      currentPassword: editForm.currentPassword,
    };

    if (editForm.newPassword.trim() !== "") {
      requestBody.newPassword = editForm.newPassword;
    }

    try {
      const res = await fetch(`${API}/users/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(editForm),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("서버 응답이 JSON이 아님");
      }

      if (res.ok) {
        setEditMsg("회원정보가 수정되었습니다.");
        location.href = "/";
      } else {
        const msg = Array.isArray(data.message)
          ? data.message.join("\n")
          : data.message || "수정 실패";
        setEditMsg(msg);
      }
    } catch (err) {
      console.error("에러:", err);
      setEditMsg(err.message || "서버 연결 실패");
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();

    if (!confirm("정말 회원 탈퇴하시겠습니까? 탈퇴 후 복구할 수 없습니다.")) {
      return;
    }

    setWithdrawMsg("처리 중...");

    try {
      const res = await fetch(`${API}/users/withdraw`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          currentPassword: withdrawPassword,
        }),
      });

      const result = await res.json().catch(() => ({}));

      if (res.ok) {
        alert("회원 탈퇴가 완료되었습니다.");
        location.href = "/";
      } else {
        const msg = Array.isArray(result.message)
          ? result.message.join("\n")
          : result.message || "회원 탈퇴 실패";
        setWithdrawMsg(msg);
      }
    } catch {
      setWithdrawMsg("서버 연결 실패");
    }
  };

  const movePostPage = (page) => {
    if (!data?.posts) return;
    if (page < 1 || page > data.posts.totalPages) return;
    fetchMyPage(page, commentPage);
  };

  const moveCommentPage = (page) => {
    if (!data?.comments) return;
    if (page < 1 || page > data.comments.totalPages) return;
    fetchMyPage(postPage, page);
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="mypage_container">불러오는 중...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div>
        <Navbar />
        <div className="mypage_container">
          마이페이지 정보를 불러오지 못했습니다.
        </div>
      </div>
    );
  }
  return (
    <div>
      <Navbar />

      <div className="mypage_con">
        <h1 className="mypage_title">마이페이지</h1>

        <div className="mypage_top">
          <div className="profile">
            <h2>내 정보</h2>
            <div className="profile_info">
              <p>
                <strong>이름:</strong> {data.user?.name}
              </p>
              <p>
                <strong>아이디:</strong> {data.user?.userId}
              </p>
            </div>
            <div className="profile_action_buttons">
              <button
                type="button"
                className="profile_toggle_btn"
                onClick={() => {
                  setShowEditForm((prev) => !prev);
                  if (showWithdrawForm) setShowWithdrawForm(false);
                }}
              >
                {showEditForm ? "회원정보 수정 닫기" : "회원정보 수정"}
              </button>

              <button
                type="button"
                className="profile_toggle_btn withdraw_toggle_btn"
                onClick={() => {
                  setShowWithdrawForm((prev) => !prev);
                  if (showEditForm) setShowEditForm(false);
                }}
              >
                {showWithdrawForm ? "회원 탈퇴 닫기" : "회원 탈퇴"}
              </button>
            </div>

            {showEditForm && (
              <div className="profile_toggle_section">
                <h3>회원정보 수정</h3>

                <form className="account_form" onSubmit={handleProfileUpdate}>
                  <div className="form_row">
                    <label>이름</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      placeholder="이름"
                    />
                  </div>

                  <div className="form_row">
                    <label>현재 비밀번호</label>
                    <input
                      type="password"
                      value={editForm.currentPassword}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          currentPassword: e.target.value,
                        })
                      }
                      placeholder="현재 비밀번호"
                    />
                  </div>

                  <div className="form_row">
                    <label>새 비밀번호</label>
                    <input
                      type="password"
                      value={editForm.newPassword}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          newPassword: e.target.value,
                        })
                      }
                      placeholder="새 비밀번호 (선택)"
                    />
                  </div>

                  <button type="submit" className="account_btn">
                    회원정보 수정
                  </button>

                  {editMsg && <p className="account_msg">{editMsg}</p>}
                </form>
              </div>
            )}

            {showWithdrawForm && (
              <div className="profile_toggle_section withdraw_box">
                <h3>회원 탈퇴</h3>
                <p className="withdraw_desc">
                  탈퇴 시 기존 게시글과 댓글은 유지됩니다.
                </p>

                <form className="withdraw_form" onSubmit={handleWithdraw}>
                  <input
                    type="password"
                    value={withdrawPassword}
                    onChange={(e) => setWithdrawPassword(e.target.value)}
                    placeholder="현재 비밀번호 입력"
                  />

                  <button type="submit" className="withdraw_btn">
                    회원 탈퇴
                  </button>

                  {withdrawMsg && <p className="withdraw_msg">{withdrawMsg}</p>}
                </form>
              </div>
            )}
          </div>

          <div className="stats">
            <h2>활동 정보</h2>
            <div className="stats_grid">
              <div className="stat_box">
                <span className="stat_label">작성 게시글</span>
                <span className="stat_value">{data.stats?.postCount}</span>
              </div>

              <div className="stat_box">
                <span className="stat_label">작성 댓글</span>
                <span className="stat_value">{data.stats?.commentCount}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mypage_bottom">
          <div className="mypage_section">
            <div className="section_header">
              <h2>내가 쓴 게시글</h2>
            </div>

            {data.posts?.items?.length > 0 ? (
              <>
                <ul className="mypage_list">
                  {data.posts.items.map((post) => {
                    const hasImage = post.files?.some((file) => file.isImage);
                    const hasVideo = post.files?.some((file) => file.isVideo);
                    const hasMedia = post.files?.some(
                      (file) => file.isPreviewable,
                    );

                    return (
                      <li key={post.id} className="mypage_item">
                        <Link
                          href={`/board/${post.id}`}
                          className="mypage_link"
                        >
                          {post.files?.some((file) => file.isImage) && (
                            <span className="image_badge" title="이미지&gif">
                              🖼️
                            </span>
                          )}

                          {post.files?.some((file) => file.isVideo) && (
                            <span className="video_badge" title="영상">
                              🎬
                            </span>
                          )}
                          {post.title}
                        </Link>
                        <span className="mypage_date">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                <div className="mypage_pagination">
                  <button
                    onClick={() => movePostPage(postPage - 1)}
                    disabled={postPage <= 1}
                  >
                    이전
                  </button>
                  <span>
                    {postPage} / {data.posts.totalPages}
                  </span>
                  <button
                    onClick={() => movePostPage(postPage + 1)}
                    disabled={postPage >= data.posts.totalPages}
                  >
                    다음
                  </button>
                </div>
              </>
            ) : (
              <p className="empty_text">작성한 게시글이 없습니다.</p>
            )}
          </div>

          <div className="mypage_section">
            <div className="section_header">
              <h2>내가 쓴 댓글</h2>
            </div>

            {data.comments?.items?.length > 0 ? (
              <>
                <ul className="mypage_list">
                  {data.comments.items.map((comment) => (
                    <li key={comment.id} className="mypage_item comment_item">
                      <div className="comment_text">
                        <Link
                          href={`/board/${comment.post?.id}`}
                          className="mypage_link"
                        >
                          {comment.post?.title || "삭제된 게시글"}
                        </Link>
                        <p>{comment.content}</p>
                      </div>
                      <span className="mypage_date">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mypage_pagination">
                  <button
                    onClick={() => moveCommentPage(commentPage - 1)}
                    disabled={commentPage <= 1}
                  >
                    이전
                  </button>
                  <span>
                    {commentPage} / {data.comments.totalPages}
                  </span>
                  <button
                    onClick={() => moveCommentPage(commentPage + 1)}
                    disabled={commentPage >= data.comments.totalPages}
                  >
                    다음
                  </button>
                </div>
              </>
            ) : (
              <p className="empty_text">작성한 댓글이 없습니다.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
