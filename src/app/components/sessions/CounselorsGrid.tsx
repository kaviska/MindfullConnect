// CounselorsGrid Component
 import { Counselor } from '../types';
interface CounselorsGridProps {
  counselors: Counselor[];
  openModal: (counselor: Counselor) => void;
}

export default function CounselorsGrid({ counselors, openModal }: CounselorsGridProps) {
  const handleViewAvailability = (counselor: Counselor): void => {
    openModal(counselor);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 mb-10">
      {counselors.map((counselor) => (
        <div
          key={counselor.name}
          className="bg-white rounded-[20px] p-7 shadow-[0_4px_25px_rgba(0,0,0,0.05)] border border-[#f1f5f9] hover:-translate-y-[5px] hover:shadow-[0_8px_35px_rgba(0,0,0,0.1)] hover:border-[#e0f2fe] transition-all"
        >
          <div className="flex items-center gap-5 mb-5">
            <img src={counselor.avatar} alt={counselor.name} className="w-20 h-20 rounded-full object-cover border-4 border-[#e0f2fe]" />
            <div>
              <h3 className="text-xl font-bold text-[#0f172a] mb-1">{counselor.name}</h3>
              <div className="text-[#0369a1] font-semibold text-sm mb-2">{counselor.specialty}</div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1 text-[#fbbf24] text-sm">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <span className="text-[#64748b] text-sm">{counselor.rating} ({counselor.reviews} reviews)</span>
              </div>
            </div>
          </div>
          <p className="text-[#64748b] text-sm leading-relaxed mb-6">{counselor.description}</p>
          <button
            className="w-full py-3 px-6 bg-gradient-to-r from-[#0369a1] to-[#0284c7] text-white border-none rounded-[12px] font-semibold cursor-pointer hover:bg-gradient-to-r hover:from-[#0284c7] hover:to-[#0369a1] hover:-translate-y-[2px] hover:shadow-[0_4px_15px_rgba(3,105,161,0.3)] transition-all"
            onClick={() => handleViewAvailability(counselor)}
          >
            View Availability
          </button>
        </div>
      ))}
    </div>
  );
}