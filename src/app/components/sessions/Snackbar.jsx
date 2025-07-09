export default function Snackbar({ show, counselorName, timeSlot }) {
  return (
    <div
      className={`fixed bottom-7 right-7 bg-gradient-to-r from-[#10b981] to-[#059669] text-white p-4 rounded-[12px] shadow-[0_4px_25px_rgba(0,0,0,0.15)] max-w-[400px] transition-all duration-300 z-[1100] ${
        show ? 'translate-y-0 opacity-100' : 'translate-y-[100px] opacity-0'
      }`}
    >
      <div className="flex items-center gap-3">
        <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
        </svg>
        <div>
          <strong>Session Booked Successfully!</strong><br />
          <span>{counselorName} - {timeSlot}</span>
        </div>
      </div>
    </div>
  );
}