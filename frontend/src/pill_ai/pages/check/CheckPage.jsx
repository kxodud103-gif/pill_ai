import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://20.81.233.125:8000";

/* ── 커스텀 커서 ── */
function useCursor() {
  const [cursor, setCursor] = useState({ x: -200, y: -200 });
  const [ring,   setRing  ] = useState({ x: -200, y: -200 });
  const ringPos = useRef({ x: -200, y: -200 });
  const raf     = useRef(null);
  useEffect(() => {
    const fn = e => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);
  useEffect(() => {
    const tick = () => {
      ringPos.current.x += (cursor.x - ringPos.current.x) * 0.14;
      ringPos.current.y += (cursor.y - ringPos.current.y) * 0.14;
      setRing({ x: ringPos.current.x, y: ringPos.current.y });
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [cursor]);
  return { cursor, ring };
}

/* ── 사이드바 데이터 ── */
const NAV_MAIN = [
  { icon: "🏠", label: "홈",        path: "/app/home"   },
  { icon: "🔍", label: "약 검색",   path: "/app/search" },
  { icon: "🤍", label: "내 약함",   path: "/app/cabinet"},
  { icon: "⏱",  label: "병용 확인", path: "/app/check"  },
];
const NAV_MANAGE = [
  { icon: "🔔", label: "알림",        path: "/app/notifications", badge: 2    },
  { icon: "🔗", label: "의료진 공유", path: null,                 badge: null },
  { icon: "⚙️", label: "설정",        path: "/app/setting",       badge: null },
];

/* ════════════════
   사이드바
════════════════ */
function Sidebar({ activePath }) {
  const navigate = useNavigate();
  return (
    <aside style={{
      width: 210, flexShrink: 0,
      background: "#fff", borderRight: "1px solid #e9e7f5",
      display: "flex", flexDirection: "column",
      padding: "24px 14px 20px",
      height: "100vh", position: "sticky", top: 0,
    }}>
      {/* 로고 → 홈 */}
      <div
        onClick={() => navigate("/app/home")}
        onMouseEnter={e => e.currentTarget.style.opacity = ".75"}
        onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 28, cursor: "none", transition: "opacity .2s" }}
      >
        <div style={{
          width: 34, height: 34,
          background: "linear-gradient(135deg,#a78bfa,#f9a8d4)",
          borderRadius: 10, display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 17,
          boxShadow: "0 4px 12px rgba(167,139,250,.4)",
        }}>💊</div>
        <span style={{ fontSize: 16, fontWeight: 800, color: "#1a1433", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          MediPocket
        </span>
      </div>

      <div style={{ fontSize: 11, fontWeight: 600, color: "#b0a8c8", letterSpacing: "0.06em", textTransform: "uppercase", padding: "0 8px", marginBottom: 6 }}>메인</div>
      <nav style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
        {NAV_MAIN.map(item => {
          const isActive = activePath === item.path;
          return (
            <button key={item.path} onClick={() => navigate(item.path)} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "9px 10px", borderRadius: 10, border: "none",
              background: isActive ? "#ede9fe" : "transparent",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 13, fontWeight: isActive ? 700 : 500,
              color: isActive ? "#7c3aed" : "#6b7280",
              cursor: "none", textAlign: "left", width: "100%", transition: "all .15s",
            }}>
              <span style={{ fontSize: 15, width: 20, textAlign: "center" }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div style={{ fontSize: 11, fontWeight: 600, color: "#b0a8c8", letterSpacing: "0.06em", textTransform: "uppercase", padding: "0 8px", marginBottom: 6 }}>관리</div>
      <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {NAV_MANAGE.map(item => {
          const isActive = activePath === item.path;
          return (
            <button key={item.label} onClick={() => item.path && navigate(item.path)} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "9px 10px", borderRadius: 10, border: "none",
              background: isActive ? "#ede9fe" : "transparent",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 13, fontWeight: isActive ? 700 : 500,
              color: isActive ? "#7c3aed" : "#6b7280",
              cursor: "none", textAlign: "left", width: "100%", transition: "all .15s",
            }}>
              <span style={{ fontSize: 15, width: 20, textAlign: "center" }}>{item.icon}</span>
              <span>{item.label}</span>
              {item.badge && (
                <span style={{
                  marginLeft: "auto", background: "#ef4444", color: "#fff",
                  fontSize: 10, fontWeight: 700, borderRadius: 50, padding: "1px 7px",
                }}>{item.badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      <div style={{ flex: 1 }} />

      {/* 하단 프로필 → 설정 */}
      <div
        onClick={() => navigate("/app/setting")}
        onMouseEnter={e => e.currentTarget.style.opacity = ".75"}
        onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "10px 8px", borderTop: "1px solid #e9e7f5",
          marginTop: 12, cursor: "none", transition: "opacity .2s",
        }}
      >
        <div style={{
          width: 34, height: 34, borderRadius: "50%",
          background: "linear-gradient(135deg,#a78bfa,#7c3aed)",
          color: "#fff", fontSize: 11, fontWeight: 700,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>메디</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1433", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>메디포</div>
          <div style={{ fontSize: 11, color: "#9ca3af" }}>개발자</div>
        </div>
      </div>
    </aside>
  );
}

/* ════════════════
   비커 SVG
════════════════ */
function Beaker({ color1, color2, animate }) {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <svg width="100%" height="100%" viewBox="0 0 160 200" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id={`bg-${color1}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color1} stopOpacity="0.7" />
            <stop offset="100%" stopColor={color2} stopOpacity="0.9" />
          </linearGradient>
        </defs>
        <path d="M28 56 L28 152 Q28 172 48 172 L112 172 Q132 172 132 152 L132 56 Z" fill={`url(#bg-${color1})`} />
        <path d="M40 130 Q80 118 120 130 L120 172 Q100 172 80 172 Q60 172 40 172 Z" fill={color2} opacity="0.35" />
        <path d="M28 56 L28 152 Q28 172 48 172 L112 172 Q132 172 132 152 L132 56" stroke="white" strokeWidth="2.5" strokeOpacity="0.6" fill="none" strokeLinecap="round" />
        <rect x="20" y="44" width="120" height="16" rx="8" fill="white" fillOpacity="0.4" />
        <rect x="20" y="44" width="120" height="16" rx="8" stroke="white" strokeWidth="1.5" strokeOpacity="0.5" fill="none" />
        <rect x="40" y="28" width="80" height="20" rx="4" fill="white" fillOpacity="0.25" />
        <ellipse cx="52" cy="95" rx="6" ry="18" fill="white" opacity="0.18" transform="rotate(-15 52 95)" />
      </svg>
      {/* 💊 이모지 — position:absolute 로 비커 몸통 정중앙 */}
      <div className="ck-pill-emoji" style={{
        marginLeft:-20,
        position: "absolute",
        top: "52%", left: "50%",
        transform: "translate(-50%, -50%)",
        fontSize: "clamp(22px, 5vw, 30px)",
        lineHeight: 1,
        userSelect: "none",
        animation: animate ? "ck-pill-float 2.8s ease-in-out infinite" : "none",
        pointerEvents: "none",
      }}>💊</div>
    </div>
  );
}

/* ════════════════
   경고 비커
════════════════ */
function WarningBeaker() {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <svg width="100%" height="100%" viewBox="0 0 160 200" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="warn-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fcd34d" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.85" />
          </linearGradient>
        </defs>
        <path d="M28 56 L28 152 Q28 172 48 172 L112 172 Q132 172 132 152 L132 56 Z" fill="url(#warn-bg)" />
        <circle cx="55" cy="130" r="7" fill="#fbbf24" opacity="0.35" style={{ animation: "ck-bubble 2s ease-in-out infinite" }} />
        <circle cx="95" cy="140" r="5" fill="#fbbf24" opacity="0.3" style={{ animation: "ck-bubble 2.4s ease-in-out infinite 0.6s" }} />
        <path d="M40 145 Q80 132 120 145 L120 172 Q80 172 40 172 Z" fill="#f59e0b" opacity="0.3" />
        <path d="M28 56 L28 152 Q28 172 48 172 L112 172 Q132 172 132 152 L132 56" stroke="white" strokeWidth="2.5" strokeOpacity="0.55" fill="none" strokeLinecap="round" />
        <rect x="20" y="44" width="120" height="16" rx="8" fill="white" fillOpacity="0.35" />
        <rect x="20" y="44" width="120" height="16" rx="8" stroke="white" strokeWidth="1.5" strokeOpacity="0.4" fill="none" />
        <rect x="40" y="28" width="80" height="20" rx="4" fill="white" fillOpacity="0.2" />
      </svg>
      {/* ⚠️ 이모지 — position:absolute 로 비커 몸통 정중앙 */}
      <div style={{
        position: "absolute",
        top: "52%", left: "50%",
        transform: "translate(-50%, -50%)",
        fontSize: "clamp(24px, 5vw, 36px)",
        lineHeight: 1,
        userSelect: "none",
        animation: "ck-warn-pulse 1.6s ease-in-out infinite",
        pointerEvents: "none",
      }}>⚠️</div>
    </div>
  );
}

/* ════════════════
   결과 카드
════════════════ */
function ResultCard({ result }) {
  if (!result) return null;
  const cfg = {
    warning: { bg: "#fffbeb", border: "rgba(251,191,36,0.4)", icon: "⚠️", iconBg: "rgba(251,191,36,0.2)", titleColor: "#92400e" },
    danger:  { bg: "#fef2f2", border: "rgba(239,68,68,0.3)",  icon: "🚫", iconBg: "rgba(239,68,68,0.15)", titleColor: "#991b1b" },
    safe:    { bg: "#f0fdf4", border: "rgba(16,185,129,0.3)", icon: "✅", iconBg: "rgba(16,185,129,0.15)", titleColor: "#065f46" },
  }[result.type];

  return (
    <div style={{
      background: cfg.bg, border: `0.8px solid ${cfg.border}`,
      borderRadius: 16, padding: "28px 32px",
      display: "flex", gap: 20,
      animation: "ck-fadeup 0.4s ease both",
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 12, background: cfg.iconBg,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 20, flexShrink: 0, marginTop: 4,
      }}>{cfg.icon}</div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, color: cfg.titleColor, marginBottom: 6 }}>{result.title}</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#1a1433", marginBottom: 8 }}>{result.pair}</div>
        <div style={{ fontSize: 15, color: "#6b5f8a", lineHeight: 1.7, marginBottom: 10 }}>{result.desc}</div>
        <div style={{ fontSize: 13, color: "#9ca3af" }}>📋 {result.source}</div>
      </div>
    </div>
  );
}

/* ════════════════
   메인
════════════════ */
export default function CheckPage() {
  const navigate = useNavigate();
  const { cursor, ring } = useCursor();
  const [drugA,   setDrugA  ] = useState("");
  const [drugB,   setDrugB  ] = useState("");
  const [result,  setResult ] = useState(null);
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError  ] = useState("");
  const [isMobile,  setIsMobile ] = useState(window.innerWidth < 768);
  const [isTablet,  setIsTablet ] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);

  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const showSidebar   = !isMobile && !isTablet;
  const showBottomNav = isMobile  || isTablet;


  /* ── 약 이름 → item_seq 조회 ── */
  const getItemSeq = async (name) => {
    const res  = await fetch(`${API_BASE}/drug/search?name=${encodeURIComponent(name)}&limit=1`);
    const data = await res.json();
    if (data.results?.length > 0) return data.results[0].ITEM_SEQ;
    return null;
  };

  /* ── 병용 확인 ── */
  const handleCheck = async () => {
    if (!drugA.trim() || !drugB.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    setChecked(false);

    try {
      /* 두 약의 item_seq 조회 */
      const [seqA, seqB] = await Promise.all([
        getItemSeq(drugA.trim()),
        getItemSeq(drugB.trim()),
      ]);

      if (!seqA) { setError(`"${drugA}" 를 찾을 수 없어요. 약 이름을 다시 확인해주세요.`); setLoading(false); return; }
      if (!seqB) { setError(`"${drugB}" 를 찾을 수 없어요. 약 이름을 다시 확인해주세요.`); setLoading(false); return; }

      /* 병용금기 체크 */
      const res  = await fetch(`${API_BASE}/drug/check?item_seq_a=${seqA}&item_seq_b=${seqB}`);
      const data = await res.json();

      if (data.is_prohibited && data.warnings?.length > 0) {
        const w = data.warnings[0];
        const grade = w.GRADE === "1" ? "danger" : "warning";
        setResult({
          type:   grade,
          title:  grade === "danger" ? "병용 금기" : "병용 주의",
          pair:   `${drugA} + ${drugB}`,
          desc:   w.PROHBT_CONTENT || "병용 시 주의가 필요합니다. 의사 또는 약사에게 문의하세요.",
          source: `DUR 품목정보 · ${w.TYPE_NAME || "병용금기"} · 확신도 High`,
        });
      } else {
        setResult({
          type:   "safe",
          title:  "병용 가능",
          pair:   `${drugA} + ${drugB}`,
          desc:   "현재 DUR 데이터에서 두 약물 간 주요 상호작용이 발견되지 않았습니다. 단, 개인차가 있으므로 필요시 약사 또는 의사에게 문의하세요.",
          source: "DUR 품목정보 · 확신도 Medium",
        });
      }
      setChecked(true);
    } catch (e) {
      setError("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="ck-cursor"      style={{ left: cursor.x, top: cursor.y }} />
      <div className="ck-cursor-ring" style={{ left: ring.x,   top: ring.y   }} />

      <div className="ck-root">
        {showSidebar && <Sidebar activePath="/app/check" />}

        <main className="ck-main">
          {/* 헤더 */}
          <div className="ck-header">
            <span style={{ fontSize: 26 }}>🧪</span>
            <div>
              <div className="ck-title">병용 확인</div>
              <div className="ck-subtitle">두 가지 약을 입력하면 병용 가능 여부를 확인합니다.</div>
            </div>
          </div>

          {/* 인포바 */}
          <div className="ck-infobar">
            <div className="ck-info-icon">💡</div>
            <div style={{ flex: 1 }}>
              <div className="ck-info-title">식약처 DUR 공공데이터 기반 실시간 병용 확인</div>
              <div className="ck-info-desc">130,000건 이상의 DUR 경고 데이터로 즉시 확인합니다.</div>
            </div>
          </div>

          {/* 비커 씬 카드 */}
          <div className="ck-scene-card">
            <div className="ck-beaker-scene">

              {/* 비커 A */}
              <div className="ck-beaker-col">
                <div className="ck-beaker-wrap">
                  <Beaker color1="#c4b5fd" color2="#7c3aed" animate={true} />
                </div>
                <div className="ck-input-wrap">
                  <input
                    className="ck-drug-input"
                    value={drugA}
                    onChange={e => { setDrugA(e.target.value); setChecked(false); setResult(null); setError(""); }}
                    onKeyDown={e => e.key === "Enter" && handleCheck()}
                    placeholder="첫 번째 약 이름"
                  />
                </div>
              </div>

              <div className="ck-op-symbol">+</div>

              {/* 비커 B */}
              <div className="ck-beaker-col">
                <div className="ck-beaker-wrap">
                  <Beaker color1="#fda4af" color2="#f43f5e" animate={true} />
                </div>
                <div className="ck-input-wrap">
                  <input
                    className="ck-drug-input"
                    value={drugB}
                    onChange={e => { setDrugB(e.target.value); setChecked(false); setResult(null); setError(""); }}
                    onKeyDown={e => e.key === "Enter" && handleCheck()}
                    placeholder="두 번째 약 이름"
                  />
                </div>
              </div>

              <div className="ck-op-symbol">→</div>

              {/* 결과 비커 */}
              <div className="ck-beaker-col">
                <div className="ck-beaker-wrap">
                  <WarningBeaker />
                </div>
                <button
                  onClick={handleCheck}
                  disabled={loading}
                  className={"ck-check-btn" + ((drugA && drugB && !loading) ? " active" : "")}
                >
                  {loading ? "확인 중..." : "🧪 병용 확인"}
                </button>
              </div>

            </div>
          </div>

          {/* 에러 */}
          {error && (
            <div className="ck-error">⚠️ {error}</div>
          )}

          {/* 결과 카드 */}
          {checked && result && <ResultCard result={result} />}
        </main>

        {/* 하단 탭바 */}
        {showBottomNav && (
          <nav className="ck-bottom-nav">
            {NAV_MAIN.map(item => (
              <button
                key={item.path}
                className={"ck-bottom-btn" + (item.path === "/app/check" ? " active" : "")}
                onClick={() => navigate(item.path)}
              >
                <span className="ck-bottom-icon">{item.icon}</span>
                <span className="ck-bottom-label">{item.label}</span>
              </button>
            ))}
          </nav>
        )}
      </div>
    </>
  );
}

/* ════════════════
   CSS
════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
html,body{width:100%;height:100%;cursor:none;font-family:'Plus Jakarta Sans',sans-serif;}
@media(max-width:1023px){html,body{cursor:auto;}}

:root{
  --p:#7c3aed;--pl:#ede9fe;--a1:#a78bfa;
  --txt:#1a1433;--sub:#6b5f8a;--gray:#9ca3af;--bd:#e9e7f5;
  --bg:#f0eeff;
}

.ck-cursor{width:10px;height:10px;border-radius:50%;background:var(--a1);position:fixed;z-index:9999;pointer-events:none;transform:translate(-50%,-50%);mix-blend-mode:multiply;}
.ck-cursor-ring{width:32px;height:32px;border-radius:50%;border:1px solid var(--a1);position:fixed;z-index:9998;pointer-events:none;transform:translate(-50%,-50%);opacity:.4;}

@keyframes ck-pill-float{0%,100%{transform:translateY(0) rotate(-4deg)}50%{transform:translateY(-8px) rotate(4deg)}}
@keyframes ck-bubble{0%{transform:translateY(0);opacity:.4}100%{transform:translateY(-40px);opacity:0}}
@keyframes ck-warn-pulse{0%,100%{opacity:.9}50%{opacity:.55}}
@keyframes ck-fadeup{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}

::-webkit-scrollbar{width:4px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:rgba(167,139,250,.3);border-radius:2px;}
::-webkit-scrollbar-thumb:hover{background:rgba(124,58,237,.4);}

/* ── 레이아웃 ── */
.ck-root{display:flex;flex-direction:column;height:100dvh;background:var(--bg);overflow:hidden;}
.ck-main{flex:1;padding:32px 36px;display:flex;flex-direction:column;gap:20px;overflow-y:auto;min-width:0;}

/* 헤더 */
.ck-header{display:flex;align-items:center;gap:14px;margin-bottom:4px;}
.ck-title{font-size:24px;font-weight:800;color:var(--txt);}
.ck-subtitle{font-size:14px;color:var(--sub);margin-top:3px;}

/* 인포바 */
.ck-infobar{background:#fdfbff;border:0.8px solid rgba(167,139,250,.2);border-radius:14px;padding:20px 28px;display:flex;align-items:center;gap:16px;}
.ck-info-icon{width:44px;height:44px;border-radius:10px;background:rgba(167,139,250,.2);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;}
.ck-info-title{font-size:17px;font-weight:700;color:var(--txt);margin-bottom:4px;}
.ck-info-desc{font-size:13px;color:var(--gray);}

/* 씬 카드 */
.ck-scene-card{background:#fdfbff;border:0.8px solid rgba(167,139,250,.15);border-radius:14px;padding:40px 24px 32px;display:flex;justify-content:center;align-items:center;flex:1;min-height:320px;}

/* 비커 씬 — 가로 배열 */
.ck-beaker-scene{display:flex;align-items:flex-end;justify-content:center;gap:0;flex-wrap:nowrap;}
.ck-beaker-col{display:flex;flex-direction:column;align-items:center;gap:14px;}
.ck-beaker-wrap{position:relative;display:flex;align-items:center;justify-content:center;width:160px;aspect-ratio:4/5;overflow:visible;}
.ck-beaker-wrap svg{width:100%;height:100%;display:block;}
.ck-op-symbol{font-size:36px;font-weight:300;color:var(--sub);padding-bottom:56px;margin:0 20px;flex-shrink:0;}

/* 입력 */
.ck-input-wrap{background:#f5f3ff;border:0.8px solid var(--a1);border-radius:24px;height:42px;width:160px;display:flex;align-items:center;justify-content:center;}
.ck-drug-input{border:none;background:transparent;text-align:center;font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;font-weight:600;color:var(--sub);outline:none;width:100%;padding:0 12px;cursor:text;}

/* 확인 버튼 */
.ck-check-btn{height:42px;width:160px;border-radius:30px;background:#e5e7eb;border:none;color:var(--gray);font-size:14px;font-weight:700;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all .25s;display:flex;align-items:center;justify-content:center;gap:6px;}
.ck-check-btn.active{background:linear-gradient(135deg,#7c3aed,#a78bfa);color:#fff;box-shadow:0 6px 22px rgba(124,58,237,.4);cursor:pointer;}

/* 에러 */
.ck-error{background:#fef2f2;border:1px solid #fee2e2;border-radius:12px;padding:14px 20px;font-size:14px;color:#ef4444;font-weight:500;}

/* 하단 탭바 */
.ck-bottom-nav{display:flex;align-items:center;justify-content:space-around;background:#fff;border-top:1px solid var(--bd);padding:8px 0 max(8px,env(safe-area-inset-bottom));flex-shrink:0;z-index:100;}
.ck-bottom-btn{display:flex;flex-direction:column;align-items:center;gap:3px;padding:4px 12px;background:transparent;border:none;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all .15s;flex:1;}
.ck-bottom-icon{font-size:20px;line-height:1;}
.ck-bottom-label{font-size:10px;font-weight:600;color:var(--gray);}
.ck-bottom-btn.active .ck-bottom-label{color:var(--p);}
.ck-bottom-btn.active .ck-bottom-icon{filter:drop-shadow(0 0 4px rgba(124,58,237,.4));}

/* ── 데스크탑: 사이드바 + 메인 가로 배열 ── */
@media(min-width:1024px){
  .ck-root{flex-direction:row;}
  .ck-main{overflow-y:auto;}
}

/* ── 태블릿 (768~1023px) ── */
@media(max-width:1023px){
  .ck-main{padding:16px 16px 20px;}
  .ck-cursor,.ck-cursor-ring{display:none;}
  .ck-beaker-wrap{width:120px;}
  
  .ck-input-wrap{width:120px;}
  .ck-check-btn{width:120px;font-size:12px;}
  .ck-op-symbol{font-size:28px;margin:0 12px;padding-bottom:42px;}
  .ck-info-title{font-size:15px;}
}

/* ── 모바일 (~767px) ── */
@media(max-width:767px){
  .ck-main{padding:12px 12px 16px;gap:12px;}
  .ck-title{font-size:20px;}
  .ck-subtitle{font-size:12px;}
  .ck-infobar{padding:14px 16px;gap:12px;}
  .ck-info-icon{width:36px;height:36px;font-size:18px;}
  .ck-info-title{font-size:14px;}
  .ck-scene-card{padding:24px 16px 20px;min-height:unset;flex:unset;}

  /* 모바일: 세로 스택 */
  .ck-beaker-scene{flex-direction:column;align-items:center;gap:8px;}
  .ck-beaker-col{flex-direction:row;gap:16px;width:100%;justify-content:center;}
  .ck-beaker-wrap{width:80px;flex-shrink:0;}
  
  .ck-op-symbol{font-size:28px;padding-bottom:0;margin:4px 0;}
  .ck-input-wrap{width:200px;flex:1;max-width:240px;}
  .ck-drug-input{font-size:13px;}
  .ck-check-btn{width:100%;max-width:260px;height:46px;font-size:15px;}
  .ck-cursor,.ck-cursor-ring{display:none;}
}
  @media(max-width:375px){
  .ck-header{
  padding:10px;}
  .ck-infobar{
  margin-top:10px;}
  .ck-scene-card{
  margin-top:40px;}
   .ck-pill-emoji{font-size:clamp(20px, 5vw, 26px) !important;
   padding-left:6px;}
   .ck-input-wrap{
   margin-top:10px;}
   .ck-check-btn{
   margin-top:15px;}
  .ck-op-symbol {
    text-align: center;
    width: 100%;
  }
`;