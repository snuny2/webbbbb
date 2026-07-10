# 웹 펜테스팅 포트폴리오

웹 애플리케이션 보안 학습 및 실습 기록 저장소입니다.

---

## 학습 기간

2026년 5월 ~ 2026년 8월

---

## 기술 스택 / 도구

- **Burp Suite** — 웹 트래픽 분석 및 조작
- **SQLMap** — SQL Injection 자동화
- **Nmap** — 포트 스캔 및 서비스 탐지
- **Kali Linux** — 공격 환경
- **DVWA** — 취약 웹 애플리케이션 실습
- **PortSwigger Web Security Academy** — 기법별 실습
- **HackTheBox** — 실전 머신 공격

---

## 폴더 구조

```
├── 00_web          # 기초 웹 개념 정리
├── 01_dvwa         # DVWA 취약점 실습 (Low/Med/High)
├── 02_portswigger  # PortSwigger Labs 풀이
├── 03_Vuln Site    # 직접 제작한 취약 사이트 실습
├── 04_HackTheBox   # HTB Starting Point + Easy 머신 풀이
├── 05_TryHackMe    # TryHackMe OWASP Top 10 2025
└── 06_CyLab        # CyLab Academy CTF 풀이
```

---

## 실습한 취약점

| 취약점 | DVWA | PortSwigger | 취약 사이트 |
|--------|------|-------------|------------|
| SQL Injection | ✅ | ✅ | ✅ |
| XSS | ✅ | ✅ | ✅ |
| CSRF | ✅ | ✅ | ✅ |
| File Upload | ✅ | ✅ | ✅ |
| Command Injection | ✅ | ✅ | ✅ |
| SQLMap | - | - | ✅ |
| JWT 공격 | - | ✅ | ✅ |
| SSRF | - | ✅ | - |

---

## HackTheBox 실습

### Starting Point

| 티어 | 머신 | 주요 기법 |
|------|------|---------|
| Tier 0 | Meow | Telnet 기본 자격증명 |
| Tier 0 | Fawn | FTP 익명 로그인 |
| Tier 0 | Dancing | SMB 익명 접근 |
| Tier 0 | Redeemer | Redis 인증 없는 접근 |
| Tier 1 | Appointment | SQL Injection 로그인 우회 |
| Tier 1 | Sequel | MySQL 직접 접속 |
| Tier 1 | Crocodile | FTP → 웹 자격증명 재사용 |
| Tier 1 | Responder | NTLM 해시 크래킹 |
| Tier 1 | Three | AWS S3 버킷 웹쉘 업로드 |
| Tier 2 | Archetype | SMB + MSSQL + xp_cmdshell |
| Tier 2 | Oopsie | 쿠키 조작 + SUID 권한 상승 |
| Tier 2 | Vaccine | zip 크랙 + SQLi + sudo vi |
| Tier 2 | Unified | Log4Shell + MongoDB |

### Easy Machines

| 머신 | 주요 기법 |
|------|---------|
| Cap | IDOR + PCAP 분석 + Python capability |
| TwoMillion | API 취약점 + Command Injection + CVE-2023-0386 |

---

## CTF

### CyLab Academy

| 문제 | 난이도 | 기법 |
|------|--------|------|
| WebDecode | Easy | Base64 디코딩 |
| Web Gauntlet | Medium | SQLi 필터 우회 (주석, 세미콜론, 문자 연결) |
| Web Gauntlet 2 | Medium | SQLi 필터 우회 (not glob) |
| Web Gauntlet 3 | Medium | SQLi 필터 우회 (not glob) |
| WebSockFish | Medium | WebSocket 점수 조작 |

---

## 학습 기록 (Notion)

상세 풀이 및 정리 내용은 노션 포트폴리오에서 확인할 수 있습니다.

👉 [웹 펜테스팅 포트폴리오 노션](https://www.notion.so/3583db1a3bf181e6870affd1154f7be6)

---

## 참고 자료

- [PortSwigger Web Security Academy](https://portswigger.net/web-security)
- [HackTheBox](https://www.hackthebox.com)
- [TryHackMe](https://tryhackme.com)
- [OWASP Top 10](https://owasp.org/Top10)
