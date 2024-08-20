import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import toast from "react-hot-toast";

import { User } from "@prisma/client";

import useLoginModal from "./useLoginModal";
import { log } from "console";

interface IUseFavorite {
    listingId: string
    currentUser?: User | null
}

const useFavorite = ({
    listingId,
    currentUser
}: IUseFavorite) => {
    const router = useRouter()
    const loginModal = useLoginModal()

    const hasFavorited = useMemo(() => {
        const list = currentUser?.favoriteIds || []

        return list.includes(listingId)
    }, [currentUser, listingId])

    const toggleFavorite = useCallback(async (
        e: React.MouseEvent<HTMLDivElement>
    ) => {
        e.stopPropagation()

        if (!currentUser) {
            return loginModal.onOpen()
        }

        try {
            let request

            if (!hasFavorited) {
                request = () => axios.post(`/api/favorites/${listingId}`)
                toast.success('Added to favorites')
            } else {
                request = () => axios.delete(`/api/favorites/${listingId}`)
                toast.success('Removed from favorites')
            }

            await request()
            router.refresh()
        } catch (error) {
            toast.error('Something went wrong')
        }
    }, [currentUser, hasFavorited, listingId, loginModal, router])

    return {
        hasFavorited,
        toggleFavorite
    }
}

export default useFavorite