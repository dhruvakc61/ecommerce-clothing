export default function StatsCard({ title, value, tone = "blue" }) {
  const tones = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
    yellow: "bg-yellow-50 text-yellow-700",
    red: "bg-red-50 text-red-700",
  };

  return (
    <div className={`rounded p-4 ${tones[tone] || tones.blue}`}>
      <p className="text-sm font-semibold uppercase tracking-wide">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}
