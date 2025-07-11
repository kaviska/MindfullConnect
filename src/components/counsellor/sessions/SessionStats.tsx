export default function SessionStats() {
  const stats = [
    { label: "Total Sessions", value: 87, bg: "bg-orange-300", text: "text-black" },
    { label: "Upcoming Sessions", value: 67, bg: "bg-slate-800", text: "text-white" },
    { label: "Today's sessions", value: 20, bg: "bg-slate-800", text: "text-white" },
  ];

  return (
    <div className="flex gap-28 justify-center my-6">
      {stats.map((stat, idx) => (
        <div key={idx} className={`rounded-lg px-6 py-6 w-56 ${stat.bg} ${stat.text}`}>
          <h3 className="text-lg font-semibold">{stat.label}</h3>
          <p className="text-3xl font-bold">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
