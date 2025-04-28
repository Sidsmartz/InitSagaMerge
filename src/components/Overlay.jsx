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
      <div className="fixed inset-0 pointer-events-none " />

      <div className="w-screen font-sans text-green-300 relative">
        {/* ---------- first section ---------------------------------- */}
        <Section opacity={op[0]}>
          <h1 className="text-3xl font-sans mb-4">Welcome to Plantify!</h1>
          <p className="text-gray-200/80 font-sans mb-4">
            Your one-stop solution to all environmental needs
          </p>
          <ul className="space-y-1 text-sm font-sans tracking-wide">
          <li>Learn to Plant</li>
          <li>Seek to absorb</li>
          <li>and to Grow!</li>
          </ul>
        </Section>

        {/* ---------- middle section -------------------------------- */}
        <Section right opacity={op[1]}>
          <h1 className="text-2xl mb-4">Skill set 🔥</h1>
          <div className="flex gap-8 text-sm tracking-wide">
            <div>
              <p className="font-sans mb-1">Frontend 🚀</p>
              <ul className="space-y-1">
                <li>React</li><li>Vue</li><li>Tailwind</li>
              </ul>
            </div>
            <div>
              <p className="font-sans mb-1">Backend 🔬</p>
              <ul className="space-y-1">
                <li>Node</li><li>tRPC</li><li>PostgreSQL</li>
              </ul>
            </div>
          </div>
        </Section>

        {/* ---------- last section ---------------------------------- */}
        <Section opacity={op[2]}>
          <h1 className="text-2xl mb-6 font-sans">Plant a tree 🌳</h1>
          <button
            onClick={() => navigate("/tile")}
            className="px-6 py-2 rounded-full border border-emerald-300
                       text-emerald-300 bg-transparent
                       hover:bg-emerald-300/20 transition"
          >
            Go to Tile Grid
          </button>
        </Section>
      </div>
    </Scroll>
  );
};
