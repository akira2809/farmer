'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';

const imgFrame2 = "https://www.figma.com/api/mcp/asset/2781859a-9304-4399-9002-5e1b53c31c3c";

export default function SearchInput() {
    const searchParams = useSearchParams();
    const { replace } = useRouter();

    // Initialize state from URL params, but strip time if present for date inputs
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search')?.toString() || '');
    const [startDate, setStartDate] = useState(() => {
        const date = searchParams.get('start_date')?.toString();
        return date ? date.split('T')[0] : '';
    });
    const [endDate, setEndDate] = useState(() => {
        const date = searchParams.get('end_date')?.toString();
        return date ? date.split('T')[0] : '';
    });

    const handleSearch = () => {
        const params = new URLSearchParams(searchParams);

        if (searchTerm) {
            params.set('search', searchTerm);
        } else {
            params.delete('search');
        }

        if (startDate) {
            // Append time to make it a valid ISO datetime for backend
            params.set('start_date', `${startDate}T00:00:00`);
        } else {
            params.delete('start_date');
        }

        if (endDate) {
            // Append time to make it a valid ISO datetime for backend
            params.set('end_date', `${endDate}T23:59:59`);
        } else {
            params.delete('end_date');
        }

        replace(`?${params.toString()}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 w-full max-w-[900px] items-center justify-center">
            <div className="bg-[#ebf5ed] border border-[#2e8623] border-solid box-border flex gap-[10px] h-[50px] md:h-[60px] items-center justify-end px-[11px] py-[8px] relative rounded-[18px] shrink-0 w-full md:flex-1">
                <input
                    type="text"
                    className="flex-1 bg-transparent outline-none px-4 text-[15px] md:text-[16px]"
                    placeholder="Tìm kiếm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </div>

            <div className="flex gap-2 items-center w-full md:w-auto">
                <div className="bg-[#ebf5ed] border border-[#2e8623] border-solid box-border flex gap-[10px] h-[50px] md:h-[60px] items-center px-[11px] py-[8px] relative rounded-[18px] shrink-0 flex-1 md:w-[160px]">
                    <input
                        type="date"
                        className="flex-1 bg-transparent outline-none text-[14px] md:text-[15px]"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        placeholder="Từ ngày"
                    />
                </div>
                <span className="text-[#2e8623] font-bold">-</span>
                <div className="bg-[#ebf5ed] border border-[#2e8623] border-solid box-border flex gap-[10px] h-[50px] md:h-[60px] items-center px-[11px] py-[8px] relative rounded-[18px] shrink-0 flex-1 md:w-[160px]">
                    <input
                        type="date"
                        className="flex-1 bg-transparent outline-none text-[14px] md:text-[15px]"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        placeholder="Đến ngày"
                    />
                </div>
            </div>

            <button
                onClick={handleSearch}
                className="relative shrink-0 size-[40px] md:size-[50px] bg-[#2e8623] rounded-full flex items-center justify-center hover:bg-[#267019] transition-colors text-white"
            >
                <Image alt="" className="block max-w-none w-[25px] md:w-[30px] h-[25px] md:h-[30px]" src={imgFrame2} width={40} height={40} />
            </button>
        </div>
    );
}
