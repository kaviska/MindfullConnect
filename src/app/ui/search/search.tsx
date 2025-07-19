"use client";

import SearchIcon from '@mui/icons-material/Search';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { Suspense } from 'react'


interface SearchProps {
    placeholder: string;
}

const Search: React.FC<SearchProps> = ({ placeholder }) => {
    const searchParams = useSearchParams();
    const { replace } = useRouter();
    const pathname = usePathname();

    const handleSearch = useDebouncedCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const params = new URLSearchParams(searchParams);

        params.set("page", String(1)); // Convert the number to a string

        if (e.target.value) {
            e.target.value.length > 2 && params.set("q", e.target.value);
        }
        else {
            params.delete("q");
        }

        replace(`${pathname}?${params.toString()}`)
    }, 300
    );

    return (
         <Suspense fallback={<div>Loading...</div>}>
        <div>
            <div className="relative">
                <input
                    type="text"
                    placeholder={placeholder}
                    className="w-[200px] h-[30px] pl-11 pr-4 rounded-[10px] bg-[#F5F7FA] outline-none text-sm placeholder:text-sm"
                    onChange={handleSearch}
                />
                <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 !w-5 !h-5" />
            </div>
        </div>
        </Suspense>
    );
};

export default Search;