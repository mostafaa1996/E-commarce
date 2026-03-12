import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useLoggedInEmail = create(
    persist(
        (set) => ({
            loggedInEmail : null,
            setLoggedEmail: (email) => set({ loggedInEmail: email }),
        }),
        {
            name: "loggedInEmail",
        }
    )
)