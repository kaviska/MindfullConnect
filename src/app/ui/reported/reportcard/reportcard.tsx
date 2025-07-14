import Image from "next/image";

const ReportCard = () => {
    return (
        <div className="bg-white rounded-2xl shadow-md p-6 w-60 h-70 text-center">
            <div className="flex justify-center">
                <img
                    src="/natalie.jpg" // Replace with your actual image path
                    alt="Reporter"
                    className="w-28 h-28 rounded-full object-cover"
                />
            </div>
            <div className="mt-4 text-sm text-gray-800 space-y-1">
                <p><strong>Reporter:</strong> Natalie</p>
                <p><strong>Reportee:</strong> Peter</p>
                <p><strong>Title:</strong> Spam</p>
                <p><strong>Status:</strong> Pending</p>
            </div>
        </div>
    );
};

export default ReportCard;