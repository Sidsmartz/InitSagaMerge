import { Scroll, useScroll } from "@react-three/drei";
import { useFrame }          from "@react-three/fiber";
import { useState }          from "react";
import { useNavigate }       from "react-router-dom";

/* ---------- glass helper ----------------------------------------- */
const Glass = ({ children, className = "" }) => (
  <div
    className={
      `backdrop-blur-md bg-white/10 border border-white/25
       rounded-xl shadow-lg ${className}`
    }
  >
    {children}
  </div>
);

const Section = ({ right, opacity, children }) => (
  <section
    className={`h-screen flex flex-col justify-center p-8
                ${right ? "items-end" : "items-start"}`}
    style={{ opacity }}
  >
    <div className="w-full max-w-md">
      <Glass className="p-10">{children}</Glass>
    </div>
  </section>
);

// Sticky scroll indicator arrow for call to action
const ScrollIndicator = () => (
  <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none">
    <div className="animate-bounce opacity-60 transition-opacity">
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-emerald-300 drop-shadow"
      >
        <path d="M12 5v14M19 12l-7 7-7-7" />
      </svg>
    </div>
  </div>
);

export const Overlay = () => {
  const scroll   = useScroll();
  const navigate = useNavigate();
  const [op, setOp] = useState([1, 1, 1]);

  useFrame(() => {
    setOp([
      1 - scroll.range(0,   1 / 3),
          scroll.curve(1 / 3, 1 / 3),
          scroll.range(2 / 3, 1 / 3),
    ]);
  });

  return (
    <Scroll html>
      {/* full-screen blur behind everything */}
      <div className="fixed inset-0 pointer-events-none" />

      <div className="w-screen font-sans text-green-300 relative">
        {/* ---------- first section ---------------------------------- */}
        <Section opacity={op[0]}>
          <h1 className="text-3xl font-extralight mb-6">🌿 From Tiles to Paradise!</h1>
          <h2 className="text-xl font-extralight mb-4 text-emerald-200">Small space, BIG dreams!</h2>
          <p className="text-gray-200/90 font-extralight text-lg leading-relaxed">
            Let's turn your balcony or terrace into a mini farm packed with colors, flavors, and life.
          </p>
        </Section>

        {/* ---------- middle section -------------------------------- */}
        <Section right opacity={op[1]}>
          <h2 className="text-xl font-extralight mb-2 text-emerald-200/80">Easy Steps</h2>
          <h1 className="text-2xl mb-6">🎯 How It's Done</h1>
          <ul className="space-y-4 text-sm tracking-wide font-extralight">
            <li className="flex items-start gap-3">
              <span className="text-emerald-300">➔</span>
              <span>Map your space with custom tile layouts.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-300">➔</span>
              <span>Choose from 40+ amazing plants!</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-300">➔</span>
              <span>Get smart advice based on your region.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-300">➔</span>
              <span>Track your garden's journey — from sprout to bloom!</span>
            </li>
          </ul>
        </Section>

        {/* ---------- last section ---------------------------------- */}
        <Section opacity={op[2]}>
          <h1 className="text-2xl mb-6 font-sans">🌱 Build Your Dream Garden</h1>
          <button
            onClick={() => navigate("/tile")}
            className="px-6 py-2 rounded-full border border-emerald-300
                       text-emerald-300 bg-transparent
                       hover:bg-emerald-300/20 transition"
          >
            Go to Tile Grid
          </button>
          <button
            onClick={() => navigate("/plants")}
            className="px-6 py-2 ml-4 rounded-full border border-emerald-300
                       text-emerald-300 bg-transparent
                       hover:bg-emerald-300/20 transition"
          >
            Go to Plant Database
          </button>
        </Section>

        {/* Sticky Scroll Indicator (call to action) */}
        <ScrollIndicator />
      </div>
    </Scroll>
  );
};
