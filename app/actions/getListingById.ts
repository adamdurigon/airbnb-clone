import prisma from "@/app/libs/prismadb"

interface IParams {
    listingId?: string
}

export default async function getListingById(
    params: IParams
) {
    try {
        const { listingId } = params

        const listing = await prisma.listing.findUnique({
            where: {
                id: listingId
            },
            include: {
                user: true
            }
        })

        if (!listing) {
            return null
        }

        return {
            ...listing,
            createdAt: listing.createdAt,
            user: {
                ...listing.user,
                createdAt: listing.user.createdAt,
                updatedAt: listing.user.updatedAt,
                emailVerified: 
                listing.user.emailVerified || null,
            }
        }
    } catch (error: any) {
        throw new Error(error)
    }
}