'use client';

import GroupsIcon from '@mui/icons-material/Groups';


const Card = () => {
    return (
        <div className="bg-[#1C3172] w-full max-w-[315px] h-24 p-6 rounded-xl text-white flex items-center gap-8 cursor-pointer">
            <GroupsIcon fontSize="medium" />
            <div>
                <p className="text-xl font-semibold">Total Patients</p>
                <h2 className="text-lg ">125</h2>
            </div>
        </div>
    );
};

export default Card;