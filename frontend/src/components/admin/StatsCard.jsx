export default function StatsCard({ title, value, subtitle, tone = "blue" }) {
  const tones = {
    blue: "border-[#d9e9ff] bg-[linear-gradient(180deg,#f5f9ff,#edf5ff)] text-[#214a78]",
    green: "border-[#dcefe4] bg-[linear-gradient(180deg,#f5fbf7,#edf7f1)] text-[#24543c]",
    yellow: "border-[#f4e7ca] bg-[linear-gradient(180deg,#fffaf0,#fff4df)] text-[#7a5a20]",
    red: "border-[#f1d9d7] bg-[linear-gradient(180deg,#fff6f5,#ffefed)] text-[#7a2e2e]",
  };

  return (
    <div className={`rounded-[24px] border p-5 shadow-[0_14px_32px_rgba(36,28,23,0.05)] ${tones[tone] || tones.blue}`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] opacity-80">{title}</p>
      <p className="mt-3 text-3xl font-semibold sm:text-4xl">{value}</p>
      {subtitle ? <p className="mt-3 text-sm leading-6 opacity-75">{subtitle}</p> : null}
    </div>
  );
}
