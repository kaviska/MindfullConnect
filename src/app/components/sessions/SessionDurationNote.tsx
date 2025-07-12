// SessionDurationNote Component
// IMPORT: No types needed for this component
export default function SessionDurationNote() {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <svg className="w-5 h-5 text-[#0369a1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-semibold text-[#0f172a]">Session Duration</h3>
      </div>
      <p className="text-sm text-[#64748b]">
        Each session with this counselor lasts approximately 55 minutes.
      </p>
    </div>
  );
}