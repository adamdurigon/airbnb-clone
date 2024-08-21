'use client';

import { formatISO } from "date-fns";
import { useCallback, useMemo, useState, useEffect } from "react";
import { Range } from "react-date-range";
import Modal from "./Modal";
import useSearchModal from "@/app/hooks/useSearchModal";
import dynamic from "next/dynamic";
import CountrySelect, { CountrySelectValue } from "../inputs/CountrySelect";
import Heading from "../Heading";
import Calendar from "../inputs/Calendar";
import Counter from "../inputs/Counter";
import useCountries from "@/app/hooks/useCountries";
import { useRouter } from 'next/navigation';

enum STEPS {
    LOCATION = 0,
    DATE = 1,
    INFO = 2,
}

const SearchModal: React.FC = () => {
    const searchModal = useSearchModal();
    const { getByValue } = useCountries();
    const router = useRouter();

    const [locationValue, setLocationValue] = useState<string | null>(null);
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);
    const [guestCount, setGuestCount] = useState<number>(1);
    const [roomCount, setRoomCount] = useState<number>(1);
    const [bathroomCount, setBathroomCount] = useState<number>(1);
    const [location, setLocation] = useState<CountrySelectValue | undefined>(undefined);
    const [step, setStep] = useState(STEPS.LOCATION);
    const [dateRange, setDateRange] = useState<Range>({
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : new Date(),
        key: 'selection'
    });
    const [searchClicked, setSearchClicked] = useState(false);

    const Map = useMemo(() => dynamic(() => import('../Map'), { ssr: false }), []);

    const onBack = useCallback(() => {
        setStep((value) => value - 1);
    }, []);

    const onNext = useCallback(() => {
        setStep((value) => value + 1);
    }, []);

    const onSubmit = useCallback(() => {
        if (step !== STEPS.INFO) {
            return onNext();
        }

        const updatedQuery: Record<string, string> = {
            locationValue: location?.value || '',
            guestCount: guestCount.toString(),
            roomCount: roomCount.toString(),
            bathroomCount: bathroomCount.toString(),
            startDate: dateRange.startDate ? formatISO(dateRange.startDate) : '',
            endDate: dateRange.endDate ? formatISO(dateRange.endDate) : ''
        };

        const queryString = new URLSearchParams(
            Object.entries(updatedQuery).filter(([_, value]) => value !== '')
        ).toString();

        router.push(`/?${queryString}`);

        // Mettre à jour les données de recherche dans le store Zustand
        searchModal.setSearchData({
            locationValue: location?.value,
            startDate: dateRange.startDate ? formatISO(dateRange.startDate) : '',
            endDate: dateRange.endDate ? formatISO(dateRange.endDate) : '',
            guestCount,
            roomCount,
            bathroomCount
        });

        searchModal.onClose();
        setSearchClicked(true);
    }, [step, searchModal, location, guestCount, roomCount, bathroomCount, dateRange, onNext, router]);

    useEffect(() => {
 
        if (searchClicked && typeof window !== 'undefined') {
            const urlSearchParams = new URLSearchParams(window.location.search);
            const locationValueParam = urlSearchParams.get('locationValue');
            const startDateParam = urlSearchParams.get('startDate');
            const endDateParam = urlSearchParams.get('endDate');
            const guestCountParam = Number(urlSearchParams.get('guestCount')) || 1;
            const roomCountParam = Number(urlSearchParams.get('roomCount')) || 1;
            const bathroomCountParam = Number(urlSearchParams.get('bathroomCount')) || 1;

            setLocationValue(locationValueParam);
            setStartDate(startDateParam);
            setEndDate(endDateParam);
            setGuestCount(guestCountParam);
            setRoomCount(roomCountParam);
            setBathroomCount(bathroomCountParam);

            setLocation(getByValue(locationValueParam || ''));

            setDateRange({
                startDate: startDateParam ? new Date(startDateParam) : new Date(),
                endDate: endDateParam ? new Date(endDateParam) : new Date(),
                key: 'selection'
            });

            setSearchClicked(false);
        }
    }, [searchClicked, getByValue, searchModal.isOpen]);

    const actionLabel = useMemo(() => (step === STEPS.INFO ? 'Search' : 'Next'), [step]);
    const secondaryActionLabel = useMemo(() => (step === STEPS.LOCATION ? undefined : 'Back'), [step]);

    let bodyContent = (
        <div className="flex flex-col gap-8">
            <Heading title="Where do you wanna go?" subtitle="Find the perfect location!" />
            <CountrySelect value={location} onChange={(value) => setLocation(value as CountrySelectValue)} />
            <hr />
            <Map center={location?.latlng} />
        </div>
    );

    if (step === STEPS.DATE) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading title="When do you plan to go?" subtitle="Make sure everyone is free!" />
                <Calendar value={dateRange} onChange={(value) => setDateRange(value.selection)} />
            </div>
        );
    }

    if (step === STEPS.INFO) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading title="More information" subtitle="Find your perfect place!" />
                <Counter title="Guests" subtitle="How many guests are coming?" value={guestCount} onChange={setGuestCount} />
                <Counter title="Rooms" subtitle="How many rooms do you need?" value={roomCount} onChange={setRoomCount} />
                <Counter title="Bathrooms" subtitle="How many bathrooms do you need?" value={bathroomCount} onChange={setBathroomCount} />
            </div>
        );
    }

    return (
        <Modal
            isOpen={searchModal.isOpen}
            onClose={searchModal.onClose}
            onSubmit={onSubmit}
            title="Filters"
            actionLabel={actionLabel}
            secondaryActionLabel={secondaryActionLabel}
            secondaryAction={step === STEPS.LOCATION ? undefined : onBack}
            body={bodyContent}
        />
    );
}

export default SearchModal;
