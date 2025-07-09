"use client";
export default function Tabs({ activeTab, setActiveTab }) {
  return (
    <div className="flex mb-6 border-b border-[#e2e8f0]">
      <button
        className={`flex-1 py-3 px-4 text-center font-semibold text-sm transition-all ${
          activeTab === 'upcoming'
            ? 'text-[#0369a1] border-b-2 border-[#0369a1]'
            : 'text-[#64748b] hover:text-[#0369a1]'
        }`}
        onClick={() => setActiveTab('upcoming')}
        aria-label="View upcoming sessions"
      >
        Upcoming Sessions
      </button>
      <button
        className={`flex-1 py-3 px-4 text-center font-semibold text-sm transition-all ${
          activeTab === 'past'
            ? 'text-[#0369a1] border-b-2 border-[#0369a1]'
            : 'text-[#64748b] hover:text-[#0369a1]'
        }`}
        onClick={() => setActiveTab('past')}
        aria-label="View past sessions"
      >
        Past Sessions
      </button>
    </div>
  );
}