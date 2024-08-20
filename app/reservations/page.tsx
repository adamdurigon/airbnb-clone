import EmptyState from "@/app/components/EmptyState";
import getCurrentUser from "@/app/actions/getCurrentUser";
import getReservations from "@/app/actions/getReservations";
import { Suspense } from "react";
import ReservationsClient from "./ReservationsClient";

const ReservationPage = async () => {
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
        authorId: currentUser.id
    });

    if (reservations.length === 0) {
        return (
            <EmptyState 
                title="No reservations found"
                subtitle="Looks like you have no reservations on your properties"
            />
        );
    }

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ReservationsClient 
                reservations={reservations}
                currentUser={currentUser}
            />
        </Suspense>
    );
};

export default ReservationPage;
