"use client";

import { useRouter } from "next/navigation";
import "./index.css";

export default function MainPage() {
  const router = useRouter();

  const goLogin = () => {
    router.push("./signin");
  };

  const goSignup = () => {
    router.push("./signup");
  };

  return (
    <main className="main">
      <div className="content">
        <h1 className="title">안녕하시오</h1>
        <button onClick={goLogin} className="login_btn">
          로그인하기
        </button>
        <button onClick={goSignup} className="signup_btn">
          회원가입하기
        </button>
      </div>
    </main>
  );
}
