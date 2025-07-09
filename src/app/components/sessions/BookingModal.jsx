export default function BookingModal({ isOpen, closeModal, selectedCounselor, timeSlots, selectTimeSlot, selectedTimeSlot, bookSession }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000] transition-opacity duration-300"
      onClick={closeModal}
    >
      <div
        className="bg-white rounded-[20px] p-10 max-w-[500px] w-[90%] max-h-[80vh] overflow-y-auto transform scale-100 transition-transform duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-7">
          <h2 className="text-2xl font-bold text-[#0f172a]">Available Time Slots</h2>
          <button
            className="bg-transparent border-none text-2xl cursor-pointer text-[#64748b] p-2 rounded-full hover:bg-[#f1f5f9] hover:text-[#0369a1] transition-all"
            onClick={closeModal}
          >
            ×
          </button>
        </div>
        <div className="flex items-center gap-4 mb-7 p-5 bg-[#f8fafc] rounded-[12px]">
          <img src={selectedCounselor?.avatar} alt={selectedCounselor?.name} className="w-16 h-16 rounded-full object-cover" />
          <div>
            <h3 className="text-lg font-bold text-[#0f172a]">{selectedCounselor?.name}</h3>
            <p className="text-[#64748b] text-sm">Select your preferred time slot</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-7">
          {timeSlots.map((slot) => (
            <div
              key={slot}
              className={`p-3 border-2 border-[#e2e8f0] rounded-[12px] text-center cursor-pointer font-semibold transition-all ${
                selectedTimeSlot === slot ? 'border-[#0369a1] bg-[#0369a1] text-white' : 'hover:border-[#0369a1] hover:bg-[#f0f9ff]'
              }`}
              onClick={() => selectTimeSlot(slot)}
            >
              {slot}
            </div>
          ))}
        </div>
        <button
          className={`w-full py-4 px-6 bg-gradient-to-r from-[#10b981] to-[#059669] text-white border-none rounded-[12px] font-semibold cursor-pointer transition-all ${
            selectedTimeSlot ? 'opacity-100 hover:-translate-y-[2px] hover:shadow-[0_4px_15px_rgba(16,185,129,0.3)]' : 'opacity-50 pointer-events-none'
          }`}
          onClick={bookSession}
        >
          Book Session
        </button>
      </div>
    </div>
  );
}