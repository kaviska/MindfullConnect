import Image from "next/image";

interface PatientCardProps {
  patient: {
    _id: string;
    name: string;
    age: number;
    status: string;
  };
}

export default function PatientCard({ patient }: PatientCardProps) {
  return (
    <div className="bg-white w-[300px] flex flex-col gap-1 shadow-md rounded-lg p-4 mb-4">
      <div className="flex justify-center">
        <Image
          alt="patient-image"
          src="/patient-001.jpg" // ✅ Use path string instead of import
          width={150}
          height={150}
          className="w-32 h-32 rounded-full object-cover mb-3 text-center"
        />
      </div>

      <h2 className="text-xl font-bold">{patient.name}</h2>
      <p className="text-gray-600">Age: {patient.age}</p>
      <p className="text-gray-500">
        Status:{" "}
        <span
          className={`${
            patient.status === "danger" ? "text-red-500" : "text-green-500"
          } font-semibold`}
        >
          {patient.status}
        </span>
      </p>
    </div>
  );
}
