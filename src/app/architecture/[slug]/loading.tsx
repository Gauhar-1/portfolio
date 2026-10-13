export default function ArchitectureLoading() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0c] text-slate-200 selection:bg-white/10 overflow-hidden">
      {/* ── Custom Shimmer Keyframes & Animations ────────────────────── */}
      <style>{`
        @keyframes silverSweep {
          0% {
            transform: translateX(-150%) rotate(15deg);
          }
          100% {
            transform: translateX(250%) rotate(15deg);
          }
        }
        .shimmer-light-beam {
          animation: silverSweep 2.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        @keyframes terminalBlink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        .cursor-terminal-blink {
          animation: terminalBlink 0.9s infinite;
        }
      `}</style>

      {/* ── Subtle Physical Noise Grain Overlay ───────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-30 opacity-15 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ── 1. The Terminal Header ────────────────────────────────────── */}
      <header className="relative z-20 border-b border-white/[0.07] bg-[#0a0a0c]/90 px-4 py-3.5 sm:px-6 md:px-12 lg:px-24 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-xs sm:text-sm text-slate-300">
            <span className="text-slate-500 font-bold">&gt;</span>
            <span className="tracking-widest">
              [ SYSTEM INITIATING... FETCHING ARCHITECTURE PAYLOAD ]
            </span>
            <span className="inline-block h-3.5 w-2 bg-slate-300 cursor-terminal-blink ml-1 align-middle" />
          </div>

          <div className="hidden sm:flex items-center gap-4 font-mono text-[10px] text-slate-500 tracking-widest uppercase">
            <span>MEM // 128MB</span>
            <span>STATUS // PRE-FLIGHT_OK</span>
          </div>
        </div>
      </header>

      {/* ── Main Loading Canvas ───────────────────────────────────────── */}
      <main className="relative z-10 px-4 pt-12 pb-20 sm:px-6 md:px-12 lg:px-24">
        {/* ── 2. Hero Section Wireframe ───────────────────────────────── */}
        <section className="max-w-4xl">
          {/* Status Badge Wireframe */}
          <div className="relative mb-6 h-7 w-52 overflow-hidden rounded-full border border-white/[0.08] bg-[#111113] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <div
              className="pointer-events-none absolute -inset-full w-[300%] h-[300%] shimmer-light-beam"
              style={{
                backgroundImage:
                  "linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.09) 50%, transparent 80%)",
              }}
            />
          </div>

          {/* Breadcrumb Wireframe */}
          <div className="relative mb-5 h-3.5 w-60 overflow-hidden rounded border border-white/[0.04] bg-[#111113]">
            <div
              className="pointer-events-none absolute -inset-full w-[300%] h-[300%] shimmer-light-beam"
              style={{
                backgroundImage:
                  "linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.09) 50%, transparent 80%)",
              }}
            />
          </div>

          {/* Headline 2 Lines Wireframe */}
          <div className="space-y-3">
            <div className="relative h-10 sm:h-12 w-4/5 overflow-hidden rounded-xl border border-white/[0.06] bg-[#111113] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
              <div
                className="pointer-events-none absolute -inset-full w-[300%] h-[300%] shimmer-light-beam"
                style={{
                  backgroundImage:
                    "linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.09) 50%, transparent 80%)",
                }}
              />
            </div>
            <div className="relative h-10 sm:h-12 w-3/5 overflow-hidden rounded-xl border border-white/[0.06] bg-[#111113] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
              <div
                className="pointer-events-none absolute -inset-full w-[300%] h-[300%] shimmer-light-beam"
                style={{
                  backgroundImage:
                    "linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.09) 50%, transparent 80%)",
                }}
              />
            </div>
          </div>

          {/* Subtitle Wireframe */}
          <div className="relative mt-6 h-5 sm:h-6 w-2/3 overflow-hidden rounded-lg border border-white/[0.04] bg-[#111113]">
            <div
              className="pointer-events-none absolute -inset-full w-[300%] h-[300%] shimmer-light-beam"
              style={{
                backgroundImage:
                  "linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.09) 50%, transparent 80%)",
              }}
            />
          </div>
        </section>

        {/* ── 3. Four Hero Metric Cards Wireframe (Horizontal Row) ───── */}
        <section className="relative mt-12 sm:mt-14">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:gap-5">
            {[0, 1, 2, 3].map((idx) => (
              <div
                key={idx}
                className="relative h-28 overflow-hidden rounded-2xl border border-white/[0.06] bg-[#111113] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] flex flex-col justify-between"
              >
                <div
                  className="pointer-events-none absolute -inset-full w-[300%] h-[300%] shimmer-light-beam"
                  style={{
                    backgroundImage:
                      "linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.09) 50%, transparent 80%)",
                  }}
                />
                <div className="h-3 w-20 rounded bg-white/[0.06]" />
                <div className="h-7 w-28 rounded-md bg-white/[0.09]" />
              </div>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="my-16 border-t border-white/[0.06]" />

        {/* ── 4. Bento Grid Wireframe (1 massive block + 2 stacked blocks) ── */}
        <section>
          {/* Section Heading Wireframe */}
          <div className="mb-10 max-w-sm space-y-2">
            <div className="relative h-3 w-36 overflow-hidden rounded border border-white/[0.04] bg-[#111113]">
              <div
                className="pointer-events-none absolute -inset-full w-[300%] h-[300%] shimmer-light-beam"
                style={{
                  backgroundImage:
                    "linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.09) 50%, transparent 80%)",
                }}
              />
            </div>
            <div className="relative h-8 w-72 overflow-hidden rounded-xl border border-white/[0.06] bg-[#111113]">
              <div
                className="pointer-events-none absolute -inset-full w-[300%] h-[300%] shimmer-light-beam"
                style={{
                  backgroundImage:
                    "linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.09) 50%, transparent 80%)",
                }}
              />
            </div>
          </div>

          {/* Asymmetrical Bento Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-5 lg:gap-6">
            {/* Card 1: Massive Feature Block on the left (2 col, 2 row) */}
            <div className="relative md:col-span-2 md:row-span-2 min-h-[380px] overflow-hidden rounded-2xl border border-white/[0.06] bg-[#111113] p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] flex flex-col justify-between">
              <div
                className="pointer-events-none absolute -inset-full w-[300%] h-[300%] shimmer-light-beam"
                style={{
                  backgroundImage:
                    "linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.09) 50%, transparent 80%)",
                }}
              />
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="h-5 w-32 rounded-full bg-white/[0.06]" />
                  <div className="h-4 w-20 rounded bg-white/[0.04]" />
                </div>
                <div className="h-7 w-2/3 rounded-lg bg-white/[0.08] mb-3" />
                <div className="h-4 w-1/2 rounded bg-white/[0.04]" />
              </div>

              {/* Inner Chart Visualization Wireframe */}
              <div className="h-32 w-full rounded-xl border border-white/[0.04] bg-black/40 p-3 flex items-end">
                <div className="h-16 w-full rounded bg-white/[0.03]" />
              </div>

              <div className="flex items-center justify-between border-t border-white/[0.04] pt-4">
                <div className="h-3.5 w-36 rounded bg-white/[0.05]" />
                <div className="h-7 w-7 rounded-full bg-white/[0.06]" />
              </div>
            </div>

            {/* Card 2: Top Stacked Block on the right (1 col, 1 row) */}
            <div className="relative md:col-span-1 md:row-span-1 min-h-[180px] overflow-hidden rounded-2xl border border-white/[0.06] bg-[#111113] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] flex flex-col justify-between">
              <div
                className="pointer-events-none absolute -inset-full w-[300%] h-[300%] shimmer-light-beam"
                style={{
                  backgroundImage:
                    "linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.09) 50%, transparent 80%)",
                }}
              />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="h-5 w-28 rounded-full bg-white/[0.06]" />
                  <div className="h-4 w-16 rounded bg-white/[0.04]" />
                </div>
                <div className="h-5 w-4/5 rounded-lg bg-white/[0.08] mb-2" />
                <div className="h-3.5 w-3/5 rounded bg-white/[0.04]" />
              </div>
              <div className="h-12 w-full rounded-lg border border-white/[0.04] bg-black/40" />
            </div>

            {/* Card 3: Bottom Stacked Block on the right (1 col, 1 row) */}
            <div className="relative md:col-span-1 md:row-span-1 min-h-[180px] overflow-hidden rounded-2xl border border-white/[0.06] bg-[#111113] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] flex flex-col justify-between">
              <div
                className="pointer-events-none absolute -inset-full w-[300%] h-[300%] shimmer-light-beam"
                style={{
                  backgroundImage:
                    "linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.09) 50%, transparent 80%)",
                }}
              />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="h-5 w-28 rounded-full bg-white/[0.06]" />
                  <div className="h-4 w-16 rounded bg-white/[0.04]" />
                </div>
                <div className="h-5 w-4/5 rounded-lg bg-white/[0.08] mb-2" />
                <div className="h-3.5 w-3/5 rounded bg-white/[0.04]" />
              </div>
              <div className="h-12 w-full rounded-lg border border-white/[0.04] bg-black/40" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
