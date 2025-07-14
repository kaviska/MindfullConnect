import SessionStats from "@/components/counsellor/sessions/SessionStats";
import SessionTable from "@/components/counsellor/sessions/SessionTable";
import Pagination from "@/components/counsellor/sessions/Pagination";
import AvailabilitySelector from "@/components/counsellor/sessions/AvailabilitySelector";
import AvailabilityViewer from "@/components/counsellor/sessions/AvailabilityViewer";


export default function SessionsPage() {
  return (
    <div className=" flex flex-col bg-blue-50">
  {/* Scrollable content */}
  <div className="flex-grow overflow-y-auto px-6 space-y-16">
    <SessionStats />

    {/* Availability Selector */}
    <AvailabilityViewer />

    {/* Session Table */}
    <SessionTable />
  </div>

  {/* Sticky pagination at bottom */}
  <div className="px-6 py-4 min-h-full sticky bottom-0 z-10">
    <Pagination />
  </div>
</div>

  );
}