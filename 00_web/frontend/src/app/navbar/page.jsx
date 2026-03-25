import { useEffect, useState } from "react";
import Link from "next/link";
import "./navbar.css";

const API = "http://localhost:4000";

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`${API}/me`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          setUser(null);
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => {
        setUser(null);
      });
  }, []);

  const handleLogout = async () => {
    await fetch(`${API}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    window.location.href = "/login";
  };

  return (
    <nav className="navbar">
      <div className="nav">네비게이션바에요</div>

      <ul className="navbar_menu">
        <li>
          <a href="/board">게시판</a>
        </li>
        <li>
          <a href="/mypage">마이페이지</a>
        </li>
      </ul>

      <div className="navbar_user">
        {user ? (
          <>
            <button onClick={handleLogout} className="logout_btn">
              로그아웃
            </button>
          </>
        ) : (
          <Link href="/login" className="login_btn">
            로그인
          </Link>
        )}
      </div>
    </nav>
  );
}
