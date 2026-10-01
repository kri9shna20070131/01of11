import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Leaf,
  MapPin,
  Menu,
  MousePointer2,
  X,
} from "lucide-react";
import "./styles.css";

const VIDEO =
  "https://zxdefgavgwfxastwmmjm.supabase.co/storage/v1/object/public/assets/morpho.mp4";

function App() {
  const heroRef = useRef(null);
  const videoWrapRef = useRef(null);
  const rafRef = useRef(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const [menuOpen, setMenuOpen] = useState(false);
  const [letterOpen, setLetterOpen] = useState(false);

  useEffect(() => {
    const hero = heroRef.current;
    const wrap = videoWrapRef.current;
    if (!hero || !wrap) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const touch = window.matchMedia("(pointer: coarse)");

    const animate = () => {
      current.current.x += (target.current.x - current.current.x) * 0.05;
      current.current.y += (target.current.y - current.current.y) * 0.05;

      const { x, y } = current.current;
      wrap.style.setProperty("--mx", x.toFixed(4));
      wrap.style.setProperty("--my", y.toFixed(4));

      if (!reduced.matches && !touch.matches) {
        wrap.style.transform =
          `scale(1.08) rotateX(${(-y * 6).toFixed(3)}deg) ` +
          `rotateY(${(x * 8).toFixed(3)}deg) translate(${(x * 12).toFixed(2)}px, ${(y * 12).toFixed(2)}px)`;
      } else {
        wrap.style.transform = "scale(1.03)";
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    const onMove = (e) => {
      if (reduced.matches || touch.matches) return;
      target.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };

    const onLeave = () => {
      target.current.x = 0;
      target.current.y = 0;
    };

    hero.addEventListener("pointermove", onMove);
    hero.addEventListener("pointerleave", onLeave);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <main ref={heroRef} className="relative min-h-screen h-screen overflow-hidden bg-[#f2efe6] text-neutral-900">
      <div className="fixed inset-0 z-0 overflow-hidden [perspective:1600px]">
        <div ref={videoWrapRef} className="video-wrap absolute inset-[-4%] will-change-transform">
          <video
            className="h-full w-full object-cover"
            src={VIDEO}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          />
        </div>
      </div>

      <div className="pointer-events-none fixed inset-0 z-[1] morpho-sheen" />
      <div className="pointer-events-none fixed inset-0 z-[2] soft-scrim" />

      <nav className="relative z-50 flex items-center justify-between px-4 py-4 sm:px-6 md:px-12 md:py-6">
        <div className="animate-blur-fade-up flex items-baseline gap-3">
          <span className="font-fraunces text-xl font-medium tracking-[-0.01em]">Morpho</span>
          <span className="hidden font-inter text-[11px] tracking-[0.28em] text-neutral-500 sm:inline">
            FIELD JOURNAL
          </span>
        </div>

        <div className="hidden items-center gap-8 lg:flex">
          {["Species", "Notes", "Plates", "About"].map((item, i) => (
            <a
              key={item}
              href="#"
              className="animate-blur-fade-up font-inter text-sm text-neutral-600 transition-colors hover:text-neutral-900"
              style={{ animationDelay: `${100 + i * 50}ms` }}
            >
              {item}
            </a>
          ))}
        </div>

        <button
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((v) => !v)}
          className={`liquid-glass animate-blur-fade-up flex h-10 w-10 items-center justify-center rounded-full lg:hidden ${menuOpen ? "menu-open" : ""}`}
          style={{ animationDelay: "350ms" }}
        >
          <span className="relative h-5 w-5">
            <Menu className={`absolute inset-0 transition-all duration-500 ${menuOpen ? "scale-50 opacity-0" : "scale-100 opacity-100"}`} size={20} />
            <X className={`absolute inset-0 transition-all duration-500 ${menuOpen ? "scale-100 opacity-100" : "scale-50 opacity-0"}`} size={20} />
          </span>
        </button>
      </nav>

      <div
        className={`absolute left-0 right-0 top-[72px] z-40 border-y border-neutral-200 bg-[#f7f4ec]/90 px-4 py-4 shadow-xl backdrop-blur-lg transition-all duration-500 lg:hidden ${
          menuOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-4 opacity-0"
        }`}
      >
        {["Species", "Notes", "Plates", "About"].map((item, i) => (
          <a
            key={item}
            href="#"
            className="block rounded-lg px-3 py-3 font-inter text-neutral-800 transition hover:bg-neutral-100"
            style={{ transitionDelay: `${i * 50}ms` }}
          >
            {item}
          </a>
        ))}
        <div className="mt-2 border-t border-neutral-200 pt-3">
          <span className="font-inter text-[11px] font-medium tracking-[0.14em] text-[#2e6bff]">FREE OPEN JOURNAL</span>
        </div>
      </div>

      <section className="relative z-10 flex h-[calc(100vh-76px)] items-center justify-center px-4 pb-8 pt-10 text-center sm:px-6 md:px-12">
        <div className="mx-auto flex max-w-5xl flex-col items-center">
          <div
            className="animate-blur-fade-up mb-5 font-inter text-[11px] uppercase tracking-[0.28em] text-neutral-500"
            style={{ animationDelay: "300ms" }}
          >
            OPEN JOURNAL · NO PAYWALL · ENTRY 041
          </div>

          <div
            className="animate-blur-fade-up mb-6 flex max-w-3xl flex-wrap justify-center gap-x-6 gap-y-2 font-inter text-[11px] uppercase tracking-[0.22em] text-neutral-500 md:mb-8"
            style={{ animationDelay: "380ms" }}
          >
            <span className="flex items-center gap-2"><Leaf size={14} /> MORPHO DIDIUS</span>
            <span className="flex items-center gap-2"><MousePointer2 size={14} /> MOVE TO OBSERVE</span>
            <span className="flex items-center gap-2"><MapPin size={14} /> CANOPY, DAWN</span>
          </div>

          <h1
            className="animate-blur-fade-up mb-6 font-fraunces text-5xl font-medium leading-[0.94] tracking-[-0.02em] text-neutral-900 sm:text-6xl md:text-7xl lg:text-8xl"
            style={{ animationDelay: "450ms" }}
          >
            <span className="block">1 step</span>
            <span className="block"><span className="morpho-text italic">toward ur day.</span></span>
          </h1>

          <p
            className="animate-blur-fade-up mb-8 max-w-2xl font-inter text-base leading-relaxed text-neutral-600 sm:text-lg md:text-xl"
            style={{ animationDelay: "560ms" }}
          >
            Ten more little steps after this one. Each day, something made
            especially for u — until ur birthday arrives.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={() => setLetterOpen(true)}
              className="animate-blur-fade-up group flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-2.5 font-inter text-sm font-medium text-white transition-colors hover:bg-[#2e6bff] sm:px-8 sm:py-3"
              style={{ animationDelay: "660ms" }}
            >
              Open today's letter
              <ArrowRight className="transition-transform group-hover:translate-x-1" size={16} />
            </button>
            <button
              onClick={() => setLetterOpen(true)}
              className="liquid-glass animate-blur-fade-up flex items-center gap-2 rounded-full px-6 py-2.5 font-inter text-sm font-medium text-neutral-900 sm:px-8 sm:py-3"
              style={{ animationDelay: "760ms" }}
            >
              <BookOpen size={16} /> Field notes
            </button>
          </div>

          <div
            className="animate-blur-fade-up mt-6 flex items-center gap-2 font-inter text-[10px] uppercase tracking-[0.26em] text-neutral-400"
            style={{ animationDelay: "860ms" }}
          >
            <MousePointer2 size={12} /> MOVE TO SHIFT THE WINGS
          </div>
        </div>
      </section>

      {letterOpen && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#1b1712]/35 p-4 backdrop-blur-md">

    {/* ================= FLOATING FLOWERS & HEARTS ================= */}
    <div className="pointer-events-none absolute inset-0 overflow-hidden">

      {[
        { emoji: "🌸", left: "6%", delay: "0s", duration: "9s", size: "22px" },
        { emoji: "💗", left: "14%", delay: "2s", duration: "11s", size: "18px" },
        { emoji: "🌷", left: "24%", delay: "5s", duration: "10s", size: "20px" },
        { emoji: "💋", left: "35%", delay: "1s", duration: "12s", size: "18px" },
        { emoji: "🌸", left: "47%", delay: "4s", duration: "9s", size: "21px" },
        { emoji: "💕", left: "58%", delay: "2s", duration: "12s", size: "20px" },
        { emoji: "🌷", left: "68%", delay: "6s", duration: "10s", size: "18px" },
        { emoji: "💗", left: "78%", delay: "3s", duration: "11s", size: "19px" },
        { emoji: "🌸", left: "88%", delay: "1s", duration: "9s", size: "22px" },
        { emoji: "🦋", left: "94%", delay: "5s", duration: "13s", size: "20px" },
        { emoji: "🍓", left: "42%", delay: "7s", duration: "12s", size: "18px" },
        { emoji: "💞", left: "82%", delay: "8s", duration: "10s", size: "18px" },
      ].map((item, i) => (
        <span
          key={i}
          className="absolute top-[-40px] select-none opacity-0"
          style={{
            left: item.left,
            fontSize: item.size,
            animation: `fallingRomance ${item.duration} linear ${item.delay} infinite`,
            filter: "drop-shadow(0 2px 4px rgba(80,40,20,.15))",
          }}
        >
          {item.emoji}
        </span>
      ))}

      {/* soft glowing hearts */}
      <div
        className="absolute left-[18%] top-[30%] h-32 w-32 rounded-full bg-pink-300/10 blur-3xl"
        style={{ animation: "softGlow 5s ease-in-out infinite" }}
      />

      <div
        className="absolute right-[15%] top-[55%] h-40 w-40 rounded-full bg-rose-300/10 blur-3xl"
        style={{ animation: "softGlow 7s ease-in-out 1s infinite" }}
      />
    </div>


    {/* ================= LETTER ================= */}
    <article
      className="paper-letter relative z-10 max-h-[92vh] w-full max-w-2xl overflow-y-auto px-7 py-9 shadow-2xl sm:px-12 sm:py-12 md:px-16"
      style={{
        animation:
          "letterAppear 900ms cubic-bezier(.16,1,.3,1) forwards",
      }}
    >

      {/* Decorative corner ornaments */}
      <div className="pointer-events-none absolute left-4 top-4 font-fraunces text-2xl text-[#9b8060]/45">
        ❦
      </div>

      <div className="pointer-events-none absolute right-4 top-4 rotate-90 font-fraunces text-2xl text-[#9b8060]/45">
        ❦
      </div>

      <div className="pointer-events-none absolute bottom-4 left-4 -rotate-90 font-fraunces text-2xl text-[#9b8060]/45">
        ❦
      </div>

      <div className="pointer-events-none absolute bottom-4 right-4 font-fraunces text-2xl text-[#9b8060]/45">
        ❦
      </div>


      {/* CLOSE BUTTON */}
      <button
        aria-label="Close letter"
        onClick={() => setLetterOpen(false)}
        className="group absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-[#fffaf0]/70 text-[#746653] shadow-sm transition-all duration-300 hover:rotate-90 hover:bg-[#fffaf0] hover:text-[#2f2923]"
      >
        <X size={18} />
      </button>


      {/* ================= LETTER HEADER ================= */}
      <div className="letter-top mb-8 flex items-start justify-between border-b border-[#806f55]/25 pb-5">

        <div>
          <div className="font-inter text-[10px] uppercase tracking-[0.3em] text-[#7d6d55]">
            ENTRY 001 / 11
          </div>

          <div className="mt-2 font-fraunces text-xl text-[#3f382f]">
            A little beginning ♡
          </div>
        </div>

        <div className="text-right">
          <div className="font-inter text-[10px] uppercase tracking-[0.2em] text-[#9a8b72]">
            01 OCT
          </div>

          <div className="mt-2 font-fraunces text-xs italic text-[#9a8b72]">
            for my strawberry 🍓
          </div>
        </div>

      </div>


      {/* ================= GREETING ================= */}
      <div className="mb-7">

        <div className="font-fraunces text-3xl leading-tight text-[#2f2923] sm:text-4xl">
          Dear Jahanvi,
        </div>

        <div
          className="mt-2 font-fraunces text-lg italic text-[#8b6a50]"
          style={{ animation: "gentleFloat 4s ease-in-out infinite" }}
        >
          my Strawberry Baby Doll 🍓🎀
        </div>

      </div>


      {/* ================= LETTER BODY ================= */}
      <div className="space-y-6 font-fraunces text-lg leading-[1.8] text-[#51483d] sm:text-xl">

        <p>
          Today is only <span className="italic text-[#315fb8]">step one</span>,
          but somehow I already feel like I am counting the days with the
          biggest smile.💗
        </p>

        <p>
          ur birthday is still a little away, but I didn't want to wait
          until <span className="italic">October 11</span> to start making
          u feel special.
        </p>

        <p>
          So, my <span className="text-[#a33a45]">cutiee piee</span>💕,
          from today until ur birthday, there will be one little surprise
          waiting for u every day.
        </p>

        <p>
          Eleven days.
          <br />
          Eleven little moments.
          <br />
          And one very special girl who deserves all of them. 🌸
        </p>

        {/* Decorative quote */}
        <div className="relative my-8 border-y border-[#806f55]/20 py-7 text-center">

          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#f4ecd8] px-4 text-lg">
            💗
          </div>

          <p className="font-fraunces text-2xl italic leading-relaxed text-[#383027] sm:text-3xl">
            "I didn't want ur birthday
            <br />
            to be just one day."
          </p>

          <div className="mt-3 font-inter text-[9px] uppercase tracking-[0.28em] text-[#9a8b72]">
            because u deserve more than one day
          </div>

        </div>


        <p>
          Consider this the first page of our tiny countdown.
          There are still ten little steps left...
          and I have a feeling u're going to like them. 👀💋
        </p>

        <p>
          Maybe some will make u laugh.
          <br />
          Maybe some will make u blush. 🙈
          <br />
          Maybe one or two might even make u say,
          <span className="italic"> "awww..."</span>
        </p>

        <p>
          But every single one of them will have one thing in common —
          <span className="italic text-[#315fb8]">
            they were made thinking about u.
          </span>
        </p>


        {/* ================= MAIN ROMANTIC MESSAGE ================= */}
        <div className="py-3 text-center">

          <div
            className="mb-4 text-2xl"
            style={{ animation: "heartBeatSoft 2.2s ease-in-out infinite" }}
          >
            💋 ❤️ 💋
          </div>

          <p className="font-fraunces text-2xl italic leading-relaxed text-[#2f2923] sm:text-3xl">
            And when October 11 finally arrives,
            I hope u look back at these little moments
            and realize just how loved u are.
          </p>

        </div>


        <p>
          Because, Jahanvi...
        </p>

        <p className="text-center font-fraunces text-2xl italic text-[#315fb8] sm:text-3xl">
          u are worth celebrating
          <br />
          long before ur birthday arrives. 🦋
        </p>

        <p>
          So here's to <span className="text-[#a33a45]">Day 1</span>.
          🌸
        </p>

        <p>
          One step toward ur day.
          <br />
          Ten more to go. 💕
        </p>

      </div>


      {/* ================= SIGNATURE ================= */}
      <div className="mt-10 border-t border-[#806f55]/25 pt-6">

        <div className="flex items-end justify-between gap-4">

          <div>

            <div className="font-inter text-[10px] uppercase tracking-[0.24em] text-[#8e806a]">
              ONE STEP DOWN · TEN TO GO
            </div>

            <div className="mt-3 font-fraunces text-xl italic text-[#315fb8]">
              Until ur day, with love. 💗
            </div>

            <div className="mt-2 font-fraunces text-lg italic text-[#51483d]">
              — from someone who calls u
              <br />
              his Strawberry Baby Doll 🍓🎀
            </div>

          </div>


          {/* Wax seal */}
          <div
            className="wax-seal"
            aria-hidden="true"
            style={{
              animation: "sealPulse 3s ease-in-out infinite",
            }}
          >
            ♥
          </div>

        </div>

      </div>


      {/* ================= FINAL LITTLE MESSAGE ================= */}
      <div className="mt-8 text-center">

        <div className="font-inter text-[9px] uppercase tracking-[0.3em] text-[#9a8b72]">
          END OF ENTRY 001
        </div>

        <div
          className="mt-3 font-fraunces text-lg italic text-[#806f55]"
          style={{ animation: "gentleFloat 4s ease-in-out infinite" }}
        >
          see u tomorrow, cutiee piee 🌷💋
        </div>

      </div>


      {/* ================= ANIMATION STYLES ================= */}
      <style>{`
        @keyframes fallingRomance {
          0% {
            transform:
              translateY(-60px)
              translateX(0)
              rotate(0deg);
            opacity: 0;
          }

          8% {
            opacity: .85;
          }

          45% {
            transform:
              translateY(48vh)
              translateX(35px)
              rotate(140deg);
          }

          75% {
            transform:
              translateY(82vh)
              translateX(-35px)
              rotate(250deg);
          }

          100% {
            transform:
              translateY(115vh)
              translateX(20px)
              rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes letterAppear {
          0% {
            opacity: 0;
            transform:
              translateY(35px)
              scale(.96)
              rotate(-1deg);
            filter: blur(8px);
          }

          60% {
            opacity: 1;
            transform:
              translateY(-4px)
              scale(1.005)
              rotate(.2deg);
            filter: blur(0);
          }

          100% {
            opacity: 1;
            transform:
              translateY(0)
              scale(1)
              rotate(0deg);
            filter: blur(0);
          }
        }

        @keyframes gentleFloat {
          0%, 100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-4px);
          }
        }

        @keyframes heartBeatSoft {
          0%, 100% {
            transform: scale(1);
          }

          15% {
            transform: scale(1.12);
          }

          30% {
            transform: scale(1);
          }

          45% {
            transform: scale(1.07);
          }

          60% {
            transform: scale(1);
          }
        }

        @keyframes sealPulse {
          0%, 100% {
            transform: rotate(-7deg) scale(1);
          }

          50% {
            transform: rotate(-3deg) scale(1.05);
          }
        }

        @keyframes softGlow {
          0%, 100% {
            opacity: .25;
            transform: scale(1);
          }

          50% {
            opacity: .6;
            transform: scale(1.25);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>

    </article>
  </div>
)}
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
