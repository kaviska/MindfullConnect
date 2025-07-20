interface TopCounsellorProps {
    counselor?: {
        _id: string;
        firstname: string;
        lastname: string;
        email: string;
        sessionCount?: number;
    };
}

const Topcounsellor = ({ counselor }: TopCounsellorProps) => {
    if (!counselor) {
        return (
            <div className="bg-[#F5F7FA] w-48 h-20 p-4 rounded-xl shadow-md flex items-center gap-3 cursor-pointer transition-shadow duration-300">
                <div className="w-12 h-12 bg-gray-300 rounded-full animate-pulse"></div>
                <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded animate-pulse mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#F5F7FA] w-48 h-20 p-4 rounded-xl shadow-md flex items-center gap-3 cursor-pointer transition-shadow duration-300 hover:shadow-lg">
            <img 
                src="/rsessions.png" 
                alt="counselor" 
                className="w-12 h-12 rounded-full object-cover" 
            />
            <div className="flex-1 min-w-0">
                <h2 className="text-sm font-semibold text-gray-800 truncate">
                    {counselor.firstname} {counselor.lastname}
                </h2>
                <p className="text-xs text-gray-500 truncate">
                    {counselor.sessionCount !== undefined 
                        ? `${counselor.sessionCount} sessions`
                        : 'Active counselor'
                    }
                </p>
            </div>
        </div>
    );
};

export default Topcounsellor;