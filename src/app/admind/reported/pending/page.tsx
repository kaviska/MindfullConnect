import StatsCard from "../../../ui/reported/stat/stat";
import ReportCard from "../../../ui/reported/reportcard/reportcard";


const Pending = () => {
    return (
        <div className="min-h-screen flex flex-col w-full items-center p-6 md:p-10">
            <div className="w-full mb-6">
                <StatsCard />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <ReportCard />
                <ReportCard />
                <ReportCard />
                <ReportCard />
                {/* Add more <ReportCard /> as needed */}
            </div>
        </div>
    );
};

export default Pending;
