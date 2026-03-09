import "./navbar.css";

export default function Navbar() {
  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:4000/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        window.location.href = "/signin";
      } else {
        alert(data.message || "로그아웃 실패");
      }
    } catch (error) {
      console.error("로그아웃 에러:", error);
      alert("서버 연결 실패");
    }
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
        <button type="button" className="logout_btn" onClick={handleLogout}>
          로그아웃
        </button>
      </div>
    </nav>
  );
}
