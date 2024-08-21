'use client';

import { useEffect, useMemo } from 'react';
import useSearchModal from '@/app/hooks/useSearchModal';
import useReset from '@/app/hooks/useReset'; 
import { BiSearch } from 'react-icons/bi';
import useCountries from "@/app/hooks/useCountries";
import { differenceInDays } from 'date-fns';

const Search: React.FC = () => {
    const { searchData, onOpen } = useSearchModal();
    const { getByValue } = useCountries();

    useReset();

    const locationLabel = useMemo(() => {
        if (searchData.locationValue) {
            const country = getByValue(searchData.locationValue);
            return country ? country.label : 'Anywhere';
        }
        return 'Anywhere';
    }, [getByValue, searchData.locationValue]);

    const durationLabel = useMemo(() => {
        if (searchData.startDate && searchData.endDate) {
            const start = new Date(searchData.startDate);
            const end = new Date(searchData.endDate);
            let diff = differenceInDays(end, start);

            if (diff === 0) {
                diff = 1;
            }

            return `${diff} ${diff === 1 ? 'Day' : 'Days'}`;
        }
        return 'Any Week';
    }, [searchData.startDate, searchData.endDate]);

    const guestLabel = useMemo(() => {
        if (searchData.guestCount !== undefined && searchData.guestCount !== 0) {
            return `${searchData.guestCount} ${searchData.guestCount === 1 ? 'Guest' : 'Guests'}`;
        }
        return 'Add Guests';
    }, [searchData.guestCount]);

    return (
        <div
            onClick={onOpen}
            className="
                border-[1px]
                w-full
                md:w-auto
                py-2
                rounded-full
                shadow-sm
                hover:shadow-md
                transition
                cursor-pointer
            "
        >
            <div
                className="
                    flex
                    flex-row
                    items-center
                    justify-between
                "
            >
                <div
                    className="
                        text-sm
                        font-semibold
                        px-6
                    "
                >
                    {locationLabel}
                </div>
                <div
                    className="
                        hidden
                        sm:block
                        text-sm
                        font-semibold
                        px-6
                        border-x-[1px]
                        flex-1
                        text-center
                    "
                >
                    {durationLabel}
                </div>
                <div
                    className="
                        text-sm
                        pl-6
                        pr-2
                        text-gray-600
                        flex
                        flex-row
                        items-center
                        gap-3
                    "
                >
                    <div className="hidden sm:block">{guestLabel}</div>
                    <div
                        className="
                            p-2
                            bg-rose-500
                            rounded-full
                            text-white
                        "
                    >
                        <BiSearch size={18} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Search;
