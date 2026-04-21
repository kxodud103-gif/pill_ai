import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function useCursor() {
  const [cursor, setCursor] = useState({ x: -200, y: -200 });
  const [ring,   setRing  ] = useState({ x: -200, y: -200 });
  const ringPos = useRef({ x: -200, y: -200 });
  const raf = useRef(null);
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

function useBreakpoint() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1280);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return { isMobile: w < 768, isTablet: w >= 768 && w < 1024, isDesktop: w >= 1024 };
}

const NAV_MAIN = [
  { icon: "🏠", label: "홈",      path: "/app/home"    },
  { icon: "🔍", label: "약 검색", path: "/app/search"  },
  { icon: "🤍", label: "내 약함", path: "/app/cabinet" },
  { icon: "⏱",  label: "병용 확인", path: "/app/check" },
];
const NAV_MANAGE = [
  { icon: "🔔", label: "알림",       path: "/app/notifications", badge: 2    },
  { icon: "🔗", label: "의료진 공유", path: null,                badge: null },
  { icon: "⚙️", label: "설정",        path: "/app/setting",      badge: null },
];

// ✅ Sidebar — 파일 최상단 독립 컴포넌트
function Sidebar({ activePath }) {
  const navigate = useNavigate();
  return (
    <aside style={{
      width: 210, flexShrink: 0,
      background: "#fff", borderRight: "1px solid #e9e7f5",
      display: "flex", flexDirection: "column",
      padding: "24px 14px 20px",
      height: "100vh", position: "sticky", top: 0, zIndex: 10,
    }}>
      <div
        onClick={() => navigate("/")}
        onMouseEnter={e => e.currentTarget.style.opacity = ".75"}
        onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 28, cursor: "pointer", transition: "opacity .2s" }}
      >
        <div style={{ width: 34, height: 34, background: "linear-gradient(135deg,#a78bfa,#f9a8d4)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, boxShadow: "0 4px 12px rgba(167,139,250,.4)" }}>💊</div>
        <span style={{ fontSize: 16, fontWeight: 800, color: "#1a1433", fontFamily: "var(--fn)" }}>MediPocket</span>
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
              fontFamily: "var(--fn)", fontSize: 13,
              fontWeight: isActive ? 700 : 500,
              color: isActive ? "#7c3aed" : "#6b7280",
              cursor: "pointer", textAlign: "left", width: "100%", transition: "all .15s",
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
              fontFamily: "var(--fn)", fontSize: 13,
              fontWeight: isActive ? 700 : 500,
              color: isActive ? "#7c3aed" : "#6b7280",
              cursor: "pointer", textAlign: "left", width: "100%", transition: "all .15s",
            }}>
              <span style={{ fontSize: 15, width: 20, textAlign: "center" }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span style={{ marginLeft: "auto", background: "#ef4444", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 50, padding: "1px 7px" }}>{item.badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      <div style={{ flex: 1 }} />
      <div
        onClick={() => navigate("/app/setting")}
        onMouseEnter={e => e.currentTarget.style.opacity = ".75"}
        onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 8px", borderTop: "1px solid #e9e7f5", marginTop: 12, cursor: "pointer", transition: "opacity .2s" }}
      >
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#a78bfa,#7c3aed)", color: "#fff", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>민지</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1433", fontFamily: "var(--fn)" }}>김민지</div>
          <div style={{ fontSize: 11, color: "#9ca3af" }}>일반 사용자</div>
        </div>
      </div>
    </aside>
  );
}

// ✅ BottomNav — 파일 최상단 독립 컴포넌트
function BottomNav({ activePath }) {
  const navigate = useNavigate();
  return (
    <nav style={{
      display: "flex", alignItems: "center", justifyContent: "space-around",
      background: "#fff", borderTop: "1px solid #e9e7f5",
      padding: "8px 0 max(8px, env(safe-area-inset-bottom))",
      flexShrink: 0, zIndex: 1000,
      position: "fixed", bottom: 0, left: 0, right: 0,
    }}>
      {NAV_MAIN.map(item => {
        const isActive = activePath === item.path;
        return (
          <button key={item.path} onClick={() => navigate(item.path)} style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            padding: "4px 12px", background: "transparent", border: "none",
            cursor: "pointer", fontFamily: "var(--fn)", transition: "all .15s", flex: 1,
          }}>
            <span style={{ fontSize: 20, lineHeight: 1, filter: isActive ? "drop-shadow(0 0 4px rgba(124,58,237,.4))" : "none" }}>{item.icon}</span>
            <span style={{ fontSize: 10, fontWeight: 600, color: isActive ? "#7c3aed" : "#9ca3af" }}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

const DRUGS = [
  { id: 1, icon: "🟠", name: "타이레놀정 500mg", company: "한국존슨앤드존슨", tags: [{ l: "일반의약품", c: "purple" }, { l: "진통제", c: "red" }], dose: "1회 1정, 1일 3~4회", detail: { effect: "해열·진통 (두통, 치통, 생리통, 발열 등)", dose: "성인 1회 1정, 1일 3~4회 (필요시)", cautions: ["과민증 환자 금기", "간장질환 환자 주의", "정해진 용법·용량 준수"], storage: "실온(1~30°C) 보관, 직사광선 피하기" } },
  { id: 2, icon: "💙", name: "아스피린프로텍트정 100mg", company: "바이엘코리아(주)", tags: [{ l: "일반의약품", c: "purple" }, { l: "혈관 건강", c: "blue" }], dose: "1회 1정, 1일 1회 (식후)", detail: { effect: "혈전 예방, 혈액 순환 개선", dose: "성인 1회 1정, 1일 1회 (식후)", cautions: ["출혈 경향 환자 주의", "위궤양 환자 금기", "장기 복용 시 의사 상담"], storage: "실온(1~30°C) 보관, 습기 피하기" } },
  { id: 3, icon: "🟠", name: "타이레놀 8시간이알 650mg", company: "한국존슨앤드존슨", tags: [{ l: "일반의약품", c: "purple" }, { l: "해열진통제", c: "orange" }], dose: "1회 1정, 1일 2회 (필요시)", detail: { effect: "해열·진통 (두통, 치통, 근육통, 발열 등)", dose: "성인 1회 1정, 1일 2회 (필요시)", cautions: ["통째로 삼키세요 (쪼개지 말 것)", "간장질환 환자 주의", "알코올 섭취 시 주의"], storage: "실온(1~30°C) 보관, 직사광선 피하기" } },
  { id: 4, icon: "🖤", name: "오메가3파워업 TG서큐온 1g", company: "종근당건강(주)", tags: [{ l: "건강기능식품", c: "green" }, { l: "혈행 개선", c: "blue" }], dose: "1일 1캡슐 (식후)", detail: { effect: "혈행 개선, 중성지방 감소", dose: "성인 1일 1캡슐 (식후)", cautions: ["항응고제 복용 시 의사 상담", "어류 알레르기 주의", "어린이 손이 닿지 않는 곳 보관"], storage: "실온(1~30°C) 보관, 개봉 후 냉장 권장" } },
  { id: 5, icon: "💜", name: "달슘한판코네슘정", company: "동아제약(주)", tags: [{ l: "일반의약품", c: "purple" }, { l: "근육·관절", c: "teal" }], dose: "1회 1정, 1일 2회 (식후)", detail: { effect: "칼슘·마그네슘 보충, 근육 경련 완화", dose: "1회 1정, 1일 2회 (식후)", cautions: ["신장 질환 환자 주의", "다른 칼슘제 병용 주의", "변비가 생길 수 있음"], storage: "실온(1~30°C) 보관, 습기 피하기" } },
  { id: 6, icon: "🔴", name: "이부프로펜정 400mg", company: "삼진제약(주)", tags: [{ l: "일반의약품", c: "purple" }, { l: "해열·진통", c: "red" }], dose: "1회 1정, 1일 3회 (필요시)", detail: { effect: "소염·진통·해열 (관절염, 두통, 생리통 등)", dose: "1회 1정, 1일 3회 (필요시)", cautions: ["위장 장애 환자 주의", "임산부 복용 금지", "식후 복용 권장"], storage: "실온(1~30°C) 보관, 직사광선 피하기" } },
];

const TAG = {
  purple: { background: "#ede9fe", color: "#7c3aed" },
  blue:   { background: "#E6F1FB", color: "#0C447C" },
  red:    { background: "#FCEBEB", color: "#791F1F" },
  green:  { background: "#EAF3DE", color: "#27500A" },
  orange: { background: "#FAEEDA", color: "#633806" },
  teal:   { background: "#E1F5EE", color: "#085041" },
};

const Icon = {
  Close:      () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Shield:     () => <svg width="18" height="18" fill="none" stroke="#1d4ed8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  SearchSm:   () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="21" y2="21"/></svg>,
  Calendar:   () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  ArrowRight: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
};

function DrugDetailContent({ drug }) {
  const sec = { marginBottom: 16, paddingBottom: 16, borderBottom: "0.8px solid #e9e7f5" };
  const lbl = { fontSize: 11, fontWeight: 700, color: "#7c3aed", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 };
  const txt = { fontSize: 13, color: "#1a1433", lineHeight: 1.75 };
  return (
    <>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 20 }}>
        <div style={{ width: 52, height: 52, borderRadius: 16, background: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{drug.icon}</div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1433", marginBottom: 3, lineHeight: 1.3 }}>{drug.name}</div>
          <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 8 }}>{drug.company}</div>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {drug.tags.map(t => <span key={t.l} style={{ ...TAG[t.c], fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20 }}>{t.l}</span>)}
          </div>
        </div>
      </div>
      {[{ title: "효능·효과", content: drug.detail.effect }, { title: "복용법", content: drug.detail.dose }].map(s => (
        <div key={s.title} style={sec}><div style={lbl}>{s.title}</div><div style={txt}>{s.content}</div></div>
      ))}
      <div style={sec}>
        <div style={lbl}>주의사항</div>
        <div style={txt}>{drug.detail.cautions.map((c, i) => <div key={i} style={{ marginBottom: 4 }}>• {c}</div>)}</div>
      </div>
      <div style={{ ...sec, borderBottom: "none", marginBottom: 0 }}>
        <div style={lbl}>저장 방법</div>
        <div style={txt}>{drug.detail.storage}</div>
      </div>
    </>
  );
}

function DrugCard({ drug, selected, onSelect, onDelete, compact }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={() => onSelect(drug)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: selected ? "#faf9ff" : "#fff",
        border: selected ? "1.5px solid #7c3aed" : hov ? "0.8px solid #a78bfa" : "0.8px solid #e9e7f5",
        borderRadius: 16, padding: compact ? "12px 14px" : "14px 16px",
        marginBottom: 10, display: "flex", alignItems: "flex-start", gap: 12,
        cursor: "pointer", transition: "all 0.15s",
        boxShadow: selected ? "0 0 0 3px rgba(124,58,237,0.12)" : hov ? "0 2px 12px rgba(120,80,200,.1)" : "none",
      }}
    >
      <div style={{ width: compact ? 40 : 46, height: compact ? 40 : 46, borderRadius: 12, background: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: compact ? 18 : 20, flexShrink: 0 }}>{drug.icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: compact ? 13 : 14, fontWeight: 700, color: "#1a1433", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{drug.name}</div>
        <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 6 }}>{drug.company}</div>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          {drug.tags.map(t => <span key={t.l} style={{ ...TAG[t.c], fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20 }}>{t.l}</span>)}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
        <button
          onClick={e => { e.stopPropagation(); onDelete(drug.id); }}
          style={{ width: 26, height: 26, borderRadius: 8, background: hov ? "#fee2e2" : "#f3f4f6", border: "0.8px solid #e9e7f5", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: hov ? "#ef4444" : "#9ca3af", transition: "all 0.15s" }}
        ><Icon.Close /></button>
        {!compact && (
          <div style={{ background: "#f5f3ff", borderRadius: 8, padding: "4px 9px", fontSize: 10, color: "#6b5f8a", fontWeight: 500, textAlign: "right", maxWidth: 100, lineHeight: 1.4 }}>{drug.dose}</div>
        )}
      </div>
    </div>
  );
}

// ✅ CabinetPage — PageHeader/MainContent/DetailPanel/BottomSheet 를 render함수로 변경
export default function CabinetPage() {
  const navigate = useNavigate();
  const { cursor, ring } = useCursor();
  const { isMobile, isTablet, isDesktop } = useBreakpoint();

  const [drugs,     setDrugs    ] = useState(DRUGS);
  const [selected,  setSelected ] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const today = new Date();
  const dateStr = `${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,"0")}.${String(today.getDate()).padStart(2,"0")}`;

  const px = isDesktop ? 32 : isTablet ? 24 : 16;

  const handleSelect    = (drug) => { setSelected(drug); if (!isDesktop) setSheetOpen(true); };
  const handleDelete    = (id)   => {
    setDrugs(prev => {
      const next = prev.filter(d => d.id !== id);
      if (selected?.id === id) { setSelected(next[0] || null); if (!isDesktop) setSheetOpen(false); }
      return next;
    });
  };
  const handleDeleteAll = () => { setDrugs([]); setSelected(null); setSheetOpen(false); };
  const closeSheet      = () => setSheetOpen(false);

  // ✅ 컴포넌트가 아닌 render 함수로 변경
  const renderPageHeader = (showFull = false) => (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: `${isDesktop ? 32 : 20}px ${px}px 0`, marginBottom: 20, flexShrink: 0,
    }}>
      <div className="cb-greeting-wrap">
        {isDesktop && showFull ? (
          <>
            <span style={{ fontSize: 26 }}>🧡</span>
            <div>
              <div className="cb-greeting-text">내 약함</div>
              <div className="cb-greeting-sub">내가 담은 약을 한눈에 확인하고 관리해보세요.</div>
            </div>
          </>
        ) : (
          <div>
            <div className="cb-greeting-sub">안녕하세요 👋</div>
            <div className="cb-greeting-text">김민지님의 약함</div>
          </div>
        )}
      </div>
      <div className="cb-top-right">
        <div className="cb-date-chip"><Icon.Calendar /><span>{dateStr}</span></div>
        <button className="cb-bell-btn" onClick={() => navigate("/app/notifications")}>🔔<span className="cb-bell-badge">2</span></button>
        {isDesktop && showFull && (
          <>
            <span style={{ fontSize: 13, color: "#6b7280", marginLeft: 4 }}>총 {drugs.length}개</span>
            {drugs.length > 0 && (
              <button onClick={handleDeleteAll} style={{ padding: "7px 16px", background: "#7c3aed", color: "#fff", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--fn)", transition: "all .18s" }}
                onMouseEnter={e => e.currentTarget.style.background="#6d28d9"}
                onMouseLeave={e => e.currentTarget.style.background="#7c3aed"}
              >전체 삭제</button>
            )}
          </>
        )}
      </div>
    </div>
  );

  const renderMainContent = (compact = false, showFull = false) => (
    <main style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", background: "var(--bg)" }}>
      {renderPageHeader(showFull)}
      <div style={{ flexShrink: 0, padding: `16px ${px}px 0` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#f9fafb", borderRadius: 14, padding: "10px 14px", border: "0.8px solid #e9e7f5", marginBottom: 12 }}>
          <span style={{ color: "#9ca3af", display: "flex", flexShrink: 0 }}><Icon.SearchSm /></span>
          <span style={{ fontSize: 14, color: "#9ca3af", fontFamily: "var(--fn)" }}>약 이름 또는 성분명 검색...</span>
        </div>
        <div style={{ background: "#eff6ff", border: "0.8px solid #bfdbfe", borderRadius: 14, padding: "13px 16px", display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 14 }}>
          <span style={{ flexShrink: 0, marginTop: 1, display: "flex" }}><Icon.Shield /></span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1d4ed8", marginBottom: 2, fontFamily: "var(--fn)" }}>복용 전 꼭 확인하세요</div>
            <div style={{ fontSize: 12, color: "#1e40af", lineHeight: 1.6, fontFamily: "var(--fn)" }}>담은 약은 저장된 목록입니다. 복용 전 약사 또는 의사와 상담하세요.</div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#1a1433", fontFamily: "var(--fn)" }}>담은 약</span>
            <span style={{ background: "#ede9fe", color: "#7c3aed", fontSize: 12, fontWeight: 700, padding: "3px 12px", borderRadius: 20, display: "inline-flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#7c3aed", display: "inline-block" }} />
              {drugs.length}개
            </span>
          </div>
          {!isDesktop && drugs.length > 0 && (
            <button onClick={handleDeleteAll} style={{ fontSize: 12, color: "#ef4444", fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontFamily: "var(--fn)" }}>전체 삭제</button>
          )}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: `0 ${px}px`, scrollbarWidth: "thin" }}>
        {drugs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 14 }}>💊</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#1a1433", marginBottom: 8, fontFamily: "var(--fn)" }}>약함이 비어있어요</div>
            <div style={{ fontSize: 13, color: "#9ca3af", marginBottom: 20, fontFamily: "var(--fn)" }}>약 검색에서 약을 추가해보세요!</div>
            <button onClick={() => navigate("/app/search")} style={{ padding: "12px 28px", borderRadius: 50, background: "linear-gradient(135deg,#7c3aed,#a78bfa)", border: "none", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "var(--fn)", boxShadow: "0 4px 14px rgba(124,58,237,.35)" }}>
              🔍 약 검색하러 가기
            </button>
          </div>
        ) : drugs.map(drug => (
          <DrugCard key={drug.id} drug={drug} selected={selected?.id === drug.id} onSelect={handleSelect} onDelete={handleDelete} compact={compact} />
        ))}
      </div>

      <div style={{ flexShrink: 0, padding: `12px ${px}px ${(isMobile || isTablet) ? 96 : 28}px` }}>
        <button style={{ width: "100%", padding: isDesktop ? 18 : 15, background: "linear-gradient(135deg,#7c3aed,#818cf8)", color: "#fff", border: "none", borderRadius: 16, fontSize: isDesktop ? 17 : 15, fontWeight: 700, cursor: "pointer", fontFamily: "var(--fn)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 6px 22px rgba(124,58,237,0.32)", transition: "transform .2s,box-shadow .2s" }}
          onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
          onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
        >
          <Icon.Calendar /> 복용 일정 관리하기 <Icon.ArrowRight />
        </button>
      </div>
    </main>
  );

  const renderDetailPanel = () => (
    <aside style={{ width: 300, flexShrink: 0, background: "#fff", borderLeft: "0.8px solid #e9e7f5", padding: "24px 18px 28px", overflow: "auto", height: "100vh" }}>
      {selected ? (
        <>
          <div style={{ fontSize: 12, color: "#6b5f8a", marginBottom: 18, fontFamily: "var(--fn)" }}>← 약 상세 정보</div>
          <DrugDetailContent drug={selected} />
          <button onClick={() => navigate("/app/search")} style={{ width: "100%", marginTop: 20, padding: 12, background: "#ede9fe", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, color: "#7c3aed", cursor: "pointer", fontFamily: "var(--fn)" }}>
            🔍 약 검색하러 가기
          </button>
        </>
      ) : (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200, fontSize: 13, color: "#9ca3af", textAlign: "center", lineHeight: 1.8, fontFamily: "var(--fn)" }}>약을 선택하면<br />상세 정보가 표시됩니다.</div>
      )}
    </aside>
  );

  const renderBottomSheet = () => (
    <>
      <div onClick={closeSheet} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 1100, opacity: sheetOpen ? 1 : 0, pointerEvents: sheetOpen ? "auto" : "none", transition: "opacity 0.3s" }} />
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderRadius: "28px 28px 0 0", borderTop: "0.8px solid #e9e7f5", padding: "0 20px 100px", zIndex: 1101, maxHeight: "82vh", overflowY: "auto", transform: sheetOpen ? "translateY(0)" : "translateY(100%)", transition: "transform 0.32s cubic-bezier(0.32,0.72,0,1)" }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: "#d1d5db", margin: "12px auto 20px" }} />
        {selected && <DrugDetailContent drug={selected} />}
        <button onClick={closeSheet} style={{ width: "100%", marginTop: 20, padding: 14, background: "#ede9fe", border: "none", borderRadius: 14, fontSize: 14, fontWeight: 700, color: "#7c3aed", cursor: "pointer", fontFamily: "var(--fn)" }}>닫기</button>
      </div>
    </>
  );

  return (
    <>
      <style>{CSS}</style>
      {isDesktop && (
        <>
          <div className="cb-cursor"      style={{ left: cursor.x, top: cursor.y }} />
          <div className="cb-cursor-ring" style={{ left: ring.x,   top: ring.y   }} />
        </>
      )}
      <div style={{ display: "flex", height: "100dvh", overflow: "hidden", background: "var(--bg)", fontFamily: "var(--fn)" }}>
        {(isDesktop || isTablet) && <Sidebar activePath="/app/cabinet" />}
        <div style={{ flex: 1, display: "flex", flexDirection: "row", height: "100%", overflow: "hidden" }}>
          {renderMainContent(isTablet, isDesktop)}
          {isDesktop && renderDetailPanel()}
        </div>
        {!isDesktop && <BottomNav activePath="/app/cabinet" />}
        {renderBottomSheet()}
      </div>
    </>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Noto+Sans+KR:wght@400;500;700;800&display=swap');
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
:root{
  --p:#7c3aed;--pl:#ede9fe;--a1:#a78bfa;--a2:#f9a8d4;
  --txt:#1a1433;--sub:#6b5f8a;--gray:#9ca3af;--bd:#e9e7f5;
  --bg:#f0eeff;
  --fn:'Plus Jakarta Sans','Noto Sans KR',sans-serif;
}
@media(min-width:1024px){ html,body{cursor:none;} }
.cb-cursor{width:10px;height:10px;border-radius:50%;background:var(--a1);position:fixed;z-index:9999;pointer-events:none;transform:translate(-50%,-50%);mix-blend-mode:multiply;}
.cb-cursor-ring{width:32px;height:32px;border-radius:50%;border:1px solid var(--a1);position:fixed;z-index:9998;pointer-events:none;transform:translate(-50%,-50%);opacity:.4;}
.cb-greeting-wrap{display:flex;align-items:center;gap:12px;}
.cb-greeting-text{font-size:22px;font-weight:800;color:var(--txt);font-family:var(--fn);}
.cb-greeting-sub{font-size:13px;color:var(--gray);margin-bottom:2px;font-family:var(--fn);}
.cb-top-right{display:flex;align-items:center;gap:10px;flex-shrink:0;}
.cb-date-chip{display:flex;align-items:center;gap:6px;font-size:13px;font-weight:600;color:var(--sub);background:#fff;padding:7px 14px;border-radius:20px;border:0.8px solid var(--bd);white-space:nowrap;}
.cb-bell-btn{position:relative;width:38px;height:38px;border-radius:50%;background:#fff;border:0.8px solid var(--bd);cursor:pointer;font-size:17px;display:flex;align-items:center;justify-content:center;}
.cb-bell-badge{position:absolute;top:-2px;right:-2px;width:18px;height:18px;border-radius:50%;background:#ef4444;color:#fff;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;}
::-webkit-scrollbar{width:4px;}
::-webkit-scrollbar-thumb{background:rgba(167,139,250,.3);border-radius:2px;}
@media(max-width:767px){
  .cb-greeting-text{font-size:18px;}
  .cb-greeting-sub{font-size:12px;}
  .cb-date-chip{font-size:11px;padding:5px 10px;}
}
`;