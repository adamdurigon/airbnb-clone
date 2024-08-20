'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import getListings, { IListingParams } from '../actions/getListings';
import getCurrentUser from '../actions/getCurrentUser';
import EmptyState from './EmptyState';
import Container from './Container';
import ListingCard from './listings/ListingCard';


// Définir le type pour un objet de liste
interface Listing {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  createdAt: Date;
  category: string;
  roomCount: number;
  bathroomCount: number;
  guestCount: number;
  locationValue: string;
  userId: string;
  price: number;
}

// Convertir les paramètres de recherche en IListingParams
const convertSearchParams = (searchParams: URLSearchParams | null): IListingParams => {
  if (!searchParams) {
    return {}; // Valeur par défaut pour les paramètres manquants
  }

  return {
    userId: searchParams.get('userId') || undefined,
  };
};

const ClientComponent = () => {
  const searchParams = useSearchParams();
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    name: string | null;
    email: string | null;
    emailVerified: Date | null;
    image: string | null;
    hashedPassword: string | null;
    createdAt: Date;
    updatedAt: Date;
    favoriteIds: string[];
  } | null>(null);

  // Initialiser l'état avec un tableau vide du type Listing[]
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const formattedParams = convertSearchParams(searchParams);
      const [user, fetchedListings] = await Promise.all([
        getCurrentUser(),
        getListings(formattedParams),
      ]);
      setCurrentUser(user); // Définir l'état avec l'objet utilisateur
      setListings(fetchedListings); // Définir l'état avec les listes
    };

    fetchData();
  }, [searchParams]);

  if (!currentUser) {
    return <EmptyState title="Unauthorized" subtitle="Please login" />;
  }

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
        {listings.map((listing) => (
          <ListingCard key={listing.id} currentUser={currentUser} data={listing} />
        ))}
      </div>
    </Container>
  );
};

export default ClientComponent;
