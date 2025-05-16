import { fetchUsers } from "../../lib/data";
import PatientClient from "./patientClient";

interface PatientPageProps {
    searchParams?: { [key: string]: string | undefined };
}

const PatientPage = async ({ searchParams }: PatientPageProps) => {
    const q = searchParams?.q ?? "";
    const page = Number(searchParams?.page) || 1;

    const { users, totalPages } = await fetchUsers(q, page);

    return <PatientClient users={users} totalPages={totalPages} />;
};

export default PatientPage;