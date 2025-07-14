// SearchFilters Component
// IMPORT: No types needed for this component
import { ChangeEvent } from 'react';

interface SearchFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  category: string;
  setCategory: (category: string) => void;
  date: string;
  setDate: (date: string) => void;
}

export default function SearchFilters({ 
  searchTerm, 
  setSearchTerm, 
  category, 
  setCategory, 
  date, 
  setDate 
}: SearchFiltersProps) {
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setCategory(e.target.value);
  };

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setDate(e.target.value);
  };

  return (
    <div className="bg-white p-7 rounded-[20px] shadow-[0_4px_25px_rgba(0,0,0,0.05)] mb-10">
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-5 items-end">
        <div className="flex flex-col gap-2">
          <label htmlFor="search" className="font-semibold text-[#374151] text-sm">Search Counselor</label>
          <div className="relative">
            <input
              type="text"
              id="search"
              className="w-full p-3 border-2 border-[#e2e8f0] rounded-[12px] text-base bg-[#fafbfc] focus:outline-none focus:border-[#0369a1] focus:bg-white focus:shadow-[0_0_0_3px_rgba(3,105,161,0.1)]"
              placeholder="Search by name or specialty"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94a3b8] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="category" className="font-semibold text-sm text-[#374151]">Category</label>
          <select
            id="category"
            className="p-3 border-2 border-[#e2e8f0] rounded-lg text-base bg-[#fafbfc] cursor-pointer focus:outline-none focus:border-[#0369a1] focus:bg-white focus:shadow-[0_0_0_3px_rgba(3,105,161,0.1)]"
            value={category}
            onChange={handleCategoryChange}
          >
            <option value="">All Categories</option>
            <option value="anxiety">Anxiety</option>
            <option value="stress">Stress</option>
            <option value="relationships">Relationships</option>
            <option value="depression">Depression</option>
            <option value="trauma">Trauma</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="date" className="font-semibold text-sm text-[#374151]">Preferred Date</label>
          <input
            type="date"
            id="date"
            className="p-3 border-2 border-[#e2e8f0] rounded-lg text-base bg-[#fafbfc] focus:outline-none focus:border-[#0369a1] focus:bg-white focus:shadow-[0_0_0_3px_rgba(3,105,161,0.1)]"
            value={date}
            onChange={handleDateChange}
          />
        </div>
      </div>
    </div>
  );
}