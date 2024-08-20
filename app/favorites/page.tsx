import { Suspense } from 'react';
import getCurrentUser from '@/app/actions/getCurrentUser';
import getFavoriteListings from '@/app/actions/getFavoriteListings';
import FavoritesClient from './FavoritesClient';
import EmptyState from '@/app/components/EmptyState';

const ListingPage = async () => {
    const listings = await getFavoriteListings();
    const currentUser = await getCurrentUser();

    if (listings.length === 0) {
        return (
            <EmptyState 
                title="No favorites found"
                subtitle="Looks like you have no favorite listings"
            />
        );
    }

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <FavoritesClient 
                listings={listings}
                currentUser={currentUser}
            />
        </Suspense>
    );
};

export default ListingPage;
