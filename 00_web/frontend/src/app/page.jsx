"use client";

import "./index.css";
import Navbar from "./navbar/page";

export default function HomePage() {
  return (
    <div>
      <Navbar />
      <main className="index_con">
        <section className="section">
          <div className="overlay" />

          <div className="content">
            <h1 className="title">오우가 제6수</h1>

            <div className="sijo">
              <p>작은 것이 높이 떠서 만물을 다 비추니</p>
              <p>밤중의 광명이 너만한 이 또 있느냐</p>
              <p>보고도 말 아니하니 내 벗인가 하노라</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
