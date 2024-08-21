import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import useSearchModal from '../hooks/useSearchModal';

const useReset = () => {
    const pathname = usePathname();
    const resetSearchData = useSearchModal((state) => state.setSearchData);
    const searchData = useSearchModal()

    useEffect(() => {
        if (pathname === '/') {
            resetSearchData({
                locationValue: '',
                startDate: '',
                endDate: '',
                guestCount: 0,
                roomCount: 0,
                bathroomCount: 0
            });
        }
    }, [pathname, resetSearchData]); 

};

export default useReset;
