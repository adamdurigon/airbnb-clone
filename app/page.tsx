import { notFound } from 'next/navigation';
import getCurrentUser from './actions/getCurrentUser';
import getListings, { IListingParams } from './actions/getListings';
import Container from './components/Container';
import EmptyState from './components/EmptyState';
import ListingCard from './components/listings/ListingCard';

export async function generateMetadata() {
  return {
    title: 'Home',
    description: 'List of available listings',
  };
}

export default async function Home({ searchParams }: { searchParams: IListingParams }) {
  try {
    const listings = await getListings(searchParams);
    const currentUser = await getCurrentUser();

    if (listings.length === 0) {
      return <EmptyState showReset />;
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
          {listings.map((listing: any) => (
            <ListingCard
              key={listing.id}
              currentUser={currentUser}
              data={listing}
            />
          ))}
        </div>
      </Container>
    );
  } catch (error) {
    notFound(); 
  }
}
