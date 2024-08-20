import { Listing, Reservation } from "@prisma/client";

export type SafeReservation = Omit<Reservation, "listing" > & {
    listing: Listing
}
