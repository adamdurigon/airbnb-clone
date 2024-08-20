import EmptyState from "@/app/components/EmptyState";
import getCurrentUser from "@/app/actions/getCurrentUser";
import PropertiesClient from "./PropertiesClient";
import getListings from "@/app/actions/getListings";
import { Suspense } from "react";

const PropertiesPage = async () => {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return (
            <EmptyState 
                title="Unauthorized"
                subtitle="Please login"
            />
        );
    }

    const listings = await getListings({ userId: currentUser.id });

    if (listings.length === 0) {
        return (
            <EmptyState 
                title="No properties found"
                subtitle="Looks like you have no properties."
            />
        );
    }

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PropertiesClient 
                listings={listings}
                currentUser={currentUser}
            />
        </Suspense>
    );
};

export default PropertiesPage;
