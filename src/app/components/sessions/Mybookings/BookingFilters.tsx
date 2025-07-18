"use client";

interface BookingFiltersProps {
  counselorFilter: string;
  setCounselorFilter: (filter: string) => void;
  dateRange: string;
  setDateRange: (range: string) => void;
}

export default function BookingFilters({ 
  counselorFilter, 
  setCounselorFilter, 
  dateRange, 
  setDateRange 
}: BookingFiltersProps) {
  return (
    <div className="bg-[#f8fafc] p-4 rounded-[12px] mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="counselor-filter" className="text-sm font-semibold text-[#0f172a]">
            Filter by Counselor
          </label>
          <input
            type="text"
            id="counselor-filter"
            className="p-3 border-2 border-[#e2e8f0] rounded-[12px] text-sm bg-white focus:outline-none focus:border-[#0369a1] focus:shadow-[0_0_0_3px_rgba(3,105,161,0.1)]"
            placeholder="Enter counselor name"
            value={counselorFilter}
            onChange={(e) => setCounselorFilter(e.target.value)}
            aria-label="Filter by counselor name"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="date-range" className="text-sm font-semibold text-[#0f172a]">
            Filter by Date Range
          </label>
          <input
            type="month"
            id="date-range"
            className="p-3 border-2 border-[#e2e8f0] rounded-[12px] text-sm bg-white focus:outline-none focus:border-[#0369a1] focus:shadow-[0_0_0_3px_rgba(3,105,161,0.1)]"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            aria-label="Filter by month"
          />
        </div>
      </div>
    </div>
  );
}