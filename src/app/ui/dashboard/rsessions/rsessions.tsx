const sessions = [
    {
        title: "Single Counselling",
        date: "28 January 2021",
        duration: "2 hr",
        img: "/rsessions.png",
    },
    {
        title: "Single Counselling",
        date: "28 January 2021",
        duration: "2 hr",
        img: "/rsessions.png",
    },
    {
        title: "Single Counselling",
        date: "28 January 2021",
        duration: "2 hr",
        img: "/rsessions.png",
    },
    {
        title: "Single Counselling",
        date: "28 January 2021",
        duration: "2 hr",
        img: "/rsessions.png",
    },
];

const RecentSessions = () => {
    return (
        <div className="bg-white p-5 rounded-xl space-y-3">
            {sessions.map((session, index) => (
                <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <img src={session.img} alt="session" className="w-9 h-9 rounded-md" />
                        <div className="text-sm text-gray-800">
                            <div className="font-semibold">{session.title}</div>
                            <div className="text-xs text-gray-500">{session.date}</div>
                        </div>
                    </div>
                    <div className="text-sm text-gray-600">{session.duration}</div>
                </div>
            ))}
        </div>
    );
};

export default RecentSessions;

