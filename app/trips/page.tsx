import EmptyState from "@/app/components/EmptyState";
import getCurrentUser from "@/app/actions/getCurrentUser";
import getReservations from "@/app/actions/getReservations";
import { Suspense } from "react";
import TripsClient from "./TripsClient";

const TripsPage = async () => {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return (
            <EmptyState 
                title="Unauthorized"
                subtitle="Please login"
            />
        );
    }

    const reservations = await getReservations({
        userId: currentUser.id
    });

    if (reservations.length === 0) {
        return (
            <EmptyState 
                title="No trips found"
                subtitle="Looks like you haven't reserved any trips."
            />
        );
    }

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <TripsClient 
                reservations={reservations}
                currentUser={currentUser}
            />
        </Suspense>
    );
};

export default TripsPage;
