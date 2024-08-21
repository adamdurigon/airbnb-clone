import { create } from "zustand";

interface SearchModalStore {
    isOpen: boolean;
    searchData: {
        locationValue?: string;
        startDate?: string;
        endDate?: string;
        guestCount?: number;
        roomCount?: number;
        bathroomCount?: number;
    };
    onOpen: () => void;
    onClose: () => void;
    setSearchData: (data: Partial<SearchModalStore['searchData']>) => void;
    resetSearchData: () => void; 
}

const useSearchModal = create<SearchModalStore>((set) => ({
    isOpen: false,
    searchData: {
        locationValue: '',
        startDate: '',
        endDate: '',
        guestCount: 0,
        roomCount: 0,
        bathroomCount: 0
    },
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
    setSearchData: (data) => set((state) => ({
        searchData: { ...state.searchData, ...data }
    })),
    resetSearchData: () => set({
        searchData: {
            locationValue: '',
            startDate: '',
            endDate: '',
            guestCount: 0,
            roomCount: 0,
            bathroomCount: 0
        }
    })
}));

export default useSearchModal;
