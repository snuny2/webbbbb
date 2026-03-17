"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "../../navbar/page";
import "./view.css";

export default function ViewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [post, setPost] = useState(null);
  const [me, setMe] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentMsg, setCommentMsg] = useState("");
  const [commentPage, setCommentPage] = useState(1);
  const [commentTotalPages, setCommentTotalPages] = useState(1);

  const API = "http://localhost:4000";

  const fetchComments = (page = 1) => {
    if (!id) return;

    fetch(`${API}/posts/${id}/comments?page=${page}&limit=5`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setComments(Array.isArray(data.items) ? data.items : []);
        setCommentPage(data.currentPage || 1);
        setCommentTotalPages(data.totalPages || 1);
      })
      .catch((err) => {
        console.error("댓글 조회 실패:", err);
        setComments([]);
      });
  };

  useEffect(() => {
    if (!id) return;

    fetch(`${API}/posts/${id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("post data:", data);
        console.log("files:", data?.files);
        setPost(data);
      });

    fetch(`${API}/me`, {
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
      })
      .catch(() => {});

    fetchComments(1);
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    const res = await fetch(`${API}/posts/${id}`, {
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

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setCommentMsg("등록 중...");

    try {
      const res = await fetch(`${API}/posts/${id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ content: commentText }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setCommentText("");
        setCommentMsg("");
        fetchComments(1);
      } else {
        const errorMsg = Array.isArray(data.message)
          ? data.message.join("\n")
          : data.message || "댓글 등록 실패";
        setCommentMsg(errorMsg);
      }
    } catch {
      setCommentMsg("서버 연결 실패");
    }
  };

  const handleCommentDelete = async (commentId) => {
    if (!confirm("댓글을 삭제하시겠습니까?")) return;

    try {
      const res = await fetch(`${API}/comments/${commentId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        fetchComments(commentPage);
      } else {
        alert(data.message || "댓글 삭제 실패");
      }
    } catch {
      alert("서버 연결 실패");
    }
  };

  if (!post) return <div>로딩 중...</div>;

  const isAuthor = me?.id === post.authorId;

  return (
    <div>
      <Navbar />

      <div className="post_detail">
        <div className="post_comment">
          <div className="view_con">
            <h1>{post.title}</h1>

            <div className="view_info">
              <span>작성자: {post.author?.name}</span>
              <span>조회수: {post.viewCount}</span>
              <span>
                작성일: {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="view_content">
              <div className="post_text">{post.content}</div>

              {post.files &&
                post.files.some(
                  (file) => file.isPreviewable && file.storedName,
                ) && (
                  <div className="view_area">
                    {post.files.map((file) => (
                      <div key={file.id}>
                        {file.isImage && file.storedName && (
                          <img
                            src={`${API}/uploads/${file.storedName}`}
                            alt={file.originalName}
                            className="view_image"
                          />
                        )}

                        {file.isVideo && file.storedName && (
                          <video controls className="view_video">
                            <source
                              src={`${API}/uploads/${file.storedName}`}
                              type={file.mimeType}
                            />
                          </video>
                        )}
                      </div>
                    ))}
                  </div>
                )}
            </div>

            {post.files && post.files.length > 0 && (
              <div className="file_download">
                <h3>첨부파일</h3>

                <div className="file_list">
                  {post.files.map((file) => (
                    <div className="download_item" key={file.id}>
                      <span className="file_name">{file.originalName}</span>
                      <a
                        href={`${API}/files/${file.id}/download`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        다운로드
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="view_buttons">
              <a href="/board">
                <button className="back_btn">목록</button>
              </a>

              {isAuthor && (
                <>
                  <a href={`/board/${post.id}/edit`}>
                    <button className="edit_btn">수정</button>
                  </a>
                  <button className="delete_btn" onClick={handleDelete}>
                    삭제
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="comment_section">
            <h2>댓글</h2>

            <form className="comment_form" onSubmit={handleCommentSubmit}>
              <textarea
                placeholder="댓글을 입력하세요"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button type="submit">댓글 등록</button>
            </form>

            {commentMsg && <p className="comments">{commentMsg}</p>}

            <div className="comment_list">
              {comments.length > 0 ? (
                comments.map((comment) => {
                  const isCommentAuthor = me?.id === comment.authorId;

                  return (
                    <div className="comment_item" key={comment.id}>
                      <div className="comment_header">
                        <span className="comment_author">
                          {comment.author?.name || "-"}
                        </span>
                      </div>

                      <div className="comment_content">
                        {comment.content}

                        {isCommentAuthor && (
                          <div className="comment_actions">
                            <button
                              type="button"
                              className="comment_delete"
                              onClick={() => handleCommentDelete(comment.id)}
                            >
                              삭제
                            </button>
                          </div>
                        )}
                      </div>

                      <div>
                        <span className="comment_date">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="comment_empty">댓글이 없습니다.</p>
              )}
            </div>

            <div className="comment_pagination">
              <button
                type="button"
                onClick={() => fetchComments(commentPage - 1)}
                disabled={commentPage <= 1}
              >
                이전
              </button>

              <span>
                {commentPage} / {commentTotalPages}
              </span>

              <button
                type="button"
                onClick={() => fetchComments(commentPage + 1)}
                disabled={commentPage >= commentTotalPages}
              >
                다음
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
