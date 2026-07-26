"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

const PARTICLE_COUNT = 40;
const ORBIT_PARTICLE_COUNT = 12;

type Particle = {
  left: number;
  bottom: number;
  size: number;
  dx: number;
  dy: number;
  delay: number;
  duration: number;
  color: string;
};

type Orbital = {
  angleOffset: number;
  radius: number;
  duration: number;
  size: number;
  color: string;
  direction: 1 | -1;
};

const COLORS = [
  { c: "var(--red)", g: "var(--red-glow)" },
  { c: "var(--cyan)", g: "var(--cyan-glow)" },
  { c: "var(--violet)", g: "var(--violet-glow)" },
  { c: "var(--magenta)", g: "var(--magenta-glow)" },
  { c: "var(--amber)", g: "var(--amber-glow)" },
];

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function VyloftHero() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hasMouse, setHasMouse] = useState(false);
  const spotlightRef = useRef<HTMLDivElement>(null);

  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: PARTICLE_COUNT }, () => {
      const palette = pick(COLORS);
      return {
        left: rand(0, 100),
        bottom: rand(-10, 10),
        size: rand(1.5, 4),
        dx: rand(-60, 60),
        dy: -rand(110, 170),
        delay: rand(0, 16),
        duration: rand(12, 24),
        color: palette.c,
      };
    });
  }, []);

  const orbitals = useMemo<Orbital[]>(() => {
    return Array.from({ length: ORBIT_PARTICLE_COUNT }, (_, i) => {
      const palette = pick(COLORS);
      return {
        angleOffset: (i / ORBIT_PARTICLE_COUNT) * 360,
        radius: rand(280, 380),
        duration: rand(20, 36),
        size: rand(3, 6),
        color: palette.c,
        direction: i % 2 === 0 ? 1 : -1,
      };
    });
  }, []);

  // Mouse parallax + spotlight tracking
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!mq.matches) return;
    setHasMouse(true);

    let raf = 0;
    let target = { x: 0, y: 0 };
    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const onMove = (e: PointerEvent) => {
      mouse = { x: e.clientX, y: e.clientY };
      target = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };

    const tick = () => {
      setTilt((prev) => ({
        x: prev.x + (target.x - prev.x) * 0.08,
        y: prev.y + (target.y - prev.y) * 0.08,
      }));
      if (spotlightRef.current) {
        spotlightRef.current.style.left = `${mouse.x}px`;
        spotlightRef.current.style.top = `${mouse.y}px`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const logoTransform = hasMouse
    ? `perspective(1200px) rotateX(${-tilt.y * 8}deg) rotateY(${tilt.x * 8}deg) translateZ(0)`
    : "translateZ(0)";

  return (
    <main
      className="relative w-screen h-screen overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      {/* Aurora mesh — slowly morphing colored blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="aurora-blob"
          style={{
            top: "20%",
            left: "10%",
            width: "55vmax",
            height: "55vmax",
            background: "var(--red)",
            opacity: 0.32,
            animation: "aurora-1 22s ease-in-out infinite",
          }}
        />
        <div
          className="aurora-blob"
          style={{
            top: "30%",
            right: "5%",
            width: "50vmax",
            height: "50vmax",
            background: "var(--cyan)",
            opacity: 0.22,
            animation: "aurora-2 28s ease-in-out infinite",
          }}
        />
        <div
          className="aurora-blob"
          style={{
            bottom: "5%",
            left: "20%",
            width: "45vmax",
            height: "45vmax",
            background: "var(--violet)",
            opacity: 0.28,
            animation: "aurora-3 25s ease-in-out infinite",
          }}
        />
        <div
          className="aurora-blob"
          style={{
            top: "5%",
            left: "40%",
            width: "40vmax",
            height: "40vmax",
            background: "var(--magenta)",
            opacity: 0.22,
            animation: "aurora-4 30s ease-in-out infinite",
          }}
        />
      </div>

      {/* Drifting embers — multi-color */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        {particles.map((p, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${p.left}%`,
              bottom: `${p.bottom}vh`,
              width: p.size,
              height: p.size,
              background: p.color,
              boxShadow: `0 0 ${p.size * 4}px ${p.color}`,
              opacity: 0,
              animation: `drift ${p.duration}s linear ${p.delay}s infinite`,
              ["--dx" as never]: `${p.dx}px`,
              ["--dy" as never]: `${p.dy}vh`,
            }}
          />
        ))}
      </div>

      {/* Concentric expanding rings — 5 staggered */}
      <div className="absolute inset-0 z-[2] pointer-events-none">
        {[0, 1, 2, 3, 4].map((i) => {
          const palette = COLORS[i % COLORS.length];
          return (
            <div
              key={i}
              className="ring"
              style={{
                borderColor: palette.c,
                boxShadow: `0 0 24px ${palette.g}`,
                animationDelay: `${i * 1.2}s`,
                animationDuration: "6s",
              }}
            />
          );
        })}
      </div>

      {/* Center scene */}
      <div
        className="relative w-full h-full flex items-center justify-center z-[3]"
        style={{ perspective: "1200px" }}
      >
        {/* Orbital particles ring — circles around the logo */}
        <div className="orbit-ring">
          {orbitals.map((o, i) => (
            <span
              key={i}
              className="absolute rounded-full"
              style={{
                left: 0,
                top: 0,
                width: o.size,
                height: o.size,
                marginLeft: -o.size / 2,
                marginTop: -o.size / 2,
                background: o.color,
                boxShadow: `0 0 ${o.size * 4}px ${o.color}`,
                ["--orbit-r" as never]: `${o.radius}px`,
                animation: `orbit ${o.duration}s linear infinite`,
                animationDelay: `${-(o.angleOffset / 360) * o.duration}s`,
                animationDirection: o.direction === 1 ? "normal" : "reverse",
              }}
            />
          ))}
        </div>

        {/* The mark */}
        <div
          className="relative"
          style={{
            width: "min(56vmin, 620px)",
            height: "min(56vmin, 620px)",
            transform: logoTransform,
            transition: hasMouse
              ? "none"
              : "transform 0.4s cubic-bezier(0.2, 0.9, 0.3, 1)",
            transformStyle: "preserve-3d",
            willChange: "transform",
          }}
        >
          {/* Halo glow behind logo */}
          <div
            className="absolute pointer-events-none rounded-[28%]"
            style={{
              inset: "-8%",
              background:
                "radial-gradient(circle, transparent 50%, var(--red-faint) 65%, transparent 82%)",
              filter: "blur(12px)",
              animation: "pulse-glow 6s ease-in-out infinite",
            }}
          />

          {/* Logo with breathe + slow rotation */}
          <div
            className="relative w-full h-full"
            style={{ animation: "breathe 6s ease-in-out infinite" }}
          >
            <div
              className="absolute inset-0"
              style={{
                animation: "rotate-slow 60s linear infinite",
              }}
            >
              <Image
                src="/vyloft.png"
                alt="vyloft"
                fill
                priority
                sizes="(max-width: 768px) 80vmin, 56vmin"
                style={{
                  objectFit: "contain",
                  filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.8))",
                }}
              />
            </div>

            {/* Scan shimmer */}
            <div
              className="absolute inset-0 overflow-hidden rounded-[24%] pointer-events-none"
              style={{ mixBlendMode: "screen" }}
            >
              <div
                className="absolute inset-x-0 h-[40%]"
                style={{
                  background:
                    "linear-gradient(180deg, transparent 0%, rgba(34, 211, 238, 0.18) 30%, rgba(255, 42, 42, 0.22) 50%, rgba(168, 85, 247, 0.18) 70%, transparent 100%)",
                  animation: "shimmer 7s ease-in-out infinite",
                  animationDelay: "1s",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mouse-following spotlight (desktop only) */}
      {hasMouse && <div ref={spotlightRef} className="spotlight" />}

      {/* Corner accents — multi-color */}
      <span className="corner-accent tl" aria-hidden />
      <span className="corner-accent tr" aria-hidden />
      <span className="corner-accent bl" aria-hidden />
      <span className="corner-accent br" aria-hidden />

      {/* Grain + vignette */}
      <div className="grain" aria-hidden />
      <div className="vignette" aria-hidden />

      {/* Contract address — discreet, very bottom */}
      <div
        className="absolute left-1/2 -translate-x-1/2 z-[8] text-center px-4 w-full"
        style={{ bottom: "18px" }}
      >
        <span
          className="text-[9px] uppercase tracking-[0.18em] mr-2"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          CA
        </span>
        <span
          className="text-[11px] md:text-xs text-white break-all select-all"
          style={{ fontFamily: "var(--font-geist-mono), ui-monospace, monospace" }}
        >
          8Z2rSJ7zmmmufiPdwF8km1eMrE9cqGQWDvXcwsajpump
        </span>
      </div>
    </main>
  );
}
