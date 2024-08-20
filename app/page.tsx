import { Suspense } from 'react';
import getCurrentUser from './actions/getCurrentUser';
import getListings, { IListingParams } from './actions/getListings';
import Container from './components/Container';
import EmptyState from './components/EmptyState';
import ListingCard from './components/listings/ListingCard';

interface HomeProps {
  searchParams: IListingParams;
}

const Home = async ({ searchParams }: HomeProps) => {
  const currentUserPromise = getCurrentUser();
  const listingsPromise = getListings(searchParams);

  const [currentUser, listings] = await Promise.all([currentUserPromise, listingsPromise]);

  if (listings.length === 0) {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <EmptyState showReset />
      </Suspense>
    );
  }

  return (
    <Container>
      <div
        className="
          pt-24
          grid
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          xl:grid-cols-5
          2xl:grid-cols-6
          gap-8
        "
      >
        {listings.map((listing) => (
          <Suspense key={listing.id} fallback={<div>Loading...</div>}>
            <ListingCard 
              currentUser={currentUser}
              data={listing}
            />
          </Suspense>
        ))}
      </div>
    </Container>
  );
};

export default Home;
