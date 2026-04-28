'use client';

import { useState, useEffect } from "react";

const TARGET = new Date("2026-05-01T18:00:00");

function getTimeLeft() {
  const now = new Date();
  const diff = TARGET.getTime() - now.getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds, done: false };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function Ring({ value, max, label, color, size = 120 }: { value: number, max: number, label: string, color: string, size?: number }) {
  const cx = size / 2;
  const r = cx - 10;
  const circ = 2 * Math.PI * r;
  const progress = max > 0 ? value / max : 0;
  const offset = circ * (1 - progress);
  const fontSize = size < 100 ? "1.7rem" : size < 110 ? "2rem" : "2.6rem";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={cx} cy={cx} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="7" />
          <circle
            cx={cx} cy={cx} r={r}
            fill="none"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.75s cubic-bezier(0.4,0,0.2,1)" }}
          />
        </svg>
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          background: `radial-gradient(circle, ${color}18 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{
            fontFamily: "'Bebas Neue', cursive",
            fontSize,
            letterSpacing: "0.04em",
            color: "#fff",
            lineHeight: 1,
            textShadow: `0 0 18px ${color}cc`,
          }}>
            {pad(value)}
          </span>
        </div>
      </div>
      <span style={{
        fontFamily: "'Outfit', sans-serif",
        fontSize: "0.6rem",
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.4)",
        fontWeight: 500,
      }}>
        {label}
      </span>
    </div>
  );
}

export default function Counter() {
  const [time, setTime] = useState(getTimeLeft());
  const [mounted, setMounted] = useState(false);
  const [ringSize, setRingSize] = useState(120);

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setTime(getTimeLeft()), 1000);

    function handleResize() {
      const w = window.innerWidth;
      if (w < 360) setRingSize(70);
      else if (w < 420) setRingSize(82);
      else if (w < 520) setRingSize(96);
      else setRingSize(120);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => { clearInterval(id); window.removeEventListener("resize", handleResize); };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html { height: 100%; }
        body {
          background: #06070d;
          min-height: 100%;
          min-height: 100dvh;
          display: flex;
          align-items: start;
          justify-content: center;
          padding: 16px;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-blob {
          0%, 100% { opacity: 0.12; transform: scale(1); }
          50%       { opacity: 0.28; transform: scale(1.08); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .card { animation: fadeUp 0.8s cubic-bezier(0.2,0,0,1) both; }
        .shimmer-text {
          background: linear-gradient(90deg, #ff6b6b, #ffd93d, #6bcb77, #4d96ff, #ff6b6b);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
        .rings-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: clamp(10px, 3vw, 36px);
          align-items: center;
          justify-items: center;
          width: 100%;
        }
        @media (max-width: 479px) {
          .rings-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px 12px;
          }
        }
        .card-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 28px;
          padding: clamp(24px, 6vw, 52px) clamp(20px, 6vw, 52px);
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          backdrop-filter: blur(20px);
          box-shadow: 0 30px 100px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.07);
          width: 100%;
          max-width: 760px;
        }
        .divider {
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.11), transparent);
        }
      `}</style>

      {/* Background blobs */}
      <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
        {[
          { w: 480, h: 480, top: "-8%", left: "-6%", color: "rgba(255,107,107,0.13)", delay: "0s", dur: "8s" },
          { w: 560, h: 560, bottom: "-12%", right: "-8%", color: "rgba(77,150,255,0.1)", delay: "2s", dur: "10s" },
          { w: 380, h: 380, top: "42%", left: "55%", color: "rgba(255,217,61,0.08)", delay: "4s", dur: "12s" },
        ].map((b, i) => (
          <div key={i} style={{
            position: "absolute",
            width: b.w, height: b.h,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${b.color} 0%, transparent 70%)`,
            top: b.top, left: b.left, bottom: b.bottom, right: b.right,
            animation: `pulse-blob ${b.dur} ease-in-out infinite ${b.delay}`,
          }} />
        ))}
      </div>

      <div className="card" style={{ position: "relative", zIndex: 1, width: "100%", display: "flex", justifyContent: "center" }}>
        <div className="card-inner">

          {/* Header */}
          <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 8 }}>
            <span className="shimmer-text" style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "0.65rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              fontWeight: 500,
            }}>
              Can't wait to
            </span>
            <h1 style={{
              fontFamily: "'Bebas Neue', cursive",
              fontSize: "clamp(1.9rem, 8vw, 3.6rem)",
              letterSpacing: "0.08em",
              color: "#fff",
              lineHeight: 0.95,
            }}>
              See you in
            </h1>
          </div>

          <div className="divider" />

          {time.done ? (
            <div style={{
              fontFamily: "'Bebas Neue', cursive",
              fontSize: "clamp(2rem, 8vw, 3rem)",
              letterSpacing: "0.1em",
              color: "#6bcb77",
              textShadow: "0 0 30px rgba(107,203,119,0.6)",
              textAlign: "center",
            }}>
              🎉 It's D-Day!
            </div>
          ) : (
            <div className="rings-grid">
              <Ring value={time.days} max={365} label="Days" color="#ff6b6b" size={ringSize} />
              <Ring value={time.hours} max={24} label="Hours" color="#ffd93d" size={ringSize} />
              <Ring value={time.minutes} max={60} label="Minutes" color="#4d96ff" size={ringSize} />
              <Ring value={time.seconds} max={60} label="Seconds" color="#6bcb77" size={ringSize} />
            </div>
          )}

          <div className="divider" />

          <p style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: "0.68rem",
            color: "rgba(255,255,255,0.22)",
            letterSpacing: "0.08em",
            textAlign: "center",
          }}>
            {mounted ? new Date().toLocaleDateString("en-US", {
              weekday: "long", month: "long", day: "numeric", year: "numeric"
            }) : ""}
          </p>

        </div>
      </div>
    </>
  );
}