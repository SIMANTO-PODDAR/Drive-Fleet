'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaSearch } from 'react-icons/fa';

const SearchFilter = ({ initialSearch, initialType }) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [searchInput, setSearchInput] = useState(initialSearch || '');

    const updateURL = (newSearch, newType) => {
        const params = new URLSearchParams(searchParams.toString());

        if (newSearch) params.set('search', newSearch);
        else params.delete('search');

        if (newType) params.set('type', newType);
        else params.delete('type');

        router.push(`?${params.toString()}`, { scroll: false });
    };

    const handleSearchClick = () => {
        const currentType = searchParams.get('type') || '';
        updateURL(searchInput, currentType);
    };

    const handleTypeChange = (e) => {
        const selectedType = e.target.value;
        updateURL(searchInput, selectedType);
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center my-8">

            <div className="flex w-full md:w-112.5 items-center">
                <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search by car name..."
                    className="border border-r-0 border-gray-300 px-4 py-1.75 rounded-l-xl w-full focus:outline-none focus:border-[#0D0D33]"
                />
                <button
                    onClick={handleSearchClick}
                    className="btn btn-ghost font-bold rounded-r-xl rounded-l-none text-white bg-linear-to-r from-[#0D0D33] to-[#0033FF]"
                >
                    <FaSearch />   Search
                </button>
            </div>

            <div className="w-full md:w-55">
                <select
                    value={initialType}
                    onChange={handleTypeChange}
                    className="w-full px-4 py-2 border-none rounded-xl font-bold text-white bg-linear-to-r from-[#0D0D33] to-[#0033FF] shadow-md focus:outline-none focus:ring-2 focus:ring-[#0033FF] cursor-pointer text-center"
                >
                    <option className="bg-base-100 text-neutral font-semibold" value="">All Types</option>
                    <option className="bg-base-100 text-neutral font-semibold" value="SUV">SUV</option>
                    <option className="bg-base-100 text-neutral font-semibold" value="Sedan">Sedan</option>
                    <option className="bg-base-100 text-neutral font-semibold" value="Hatchback">Hatchback</option>
                    <option className="bg-base-100 text-neutral font-semibold" value="Luxury">Luxury</option>
                    <option className="bg-base-100 text-neutral font-semibold" value="Sports">Sports</option>
                </select>
            </div>
        </div>
    );
};

export default SearchFilter;