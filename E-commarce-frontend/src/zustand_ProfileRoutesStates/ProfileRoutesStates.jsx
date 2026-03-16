import { create } from "zustand";
import { persist } from "zustand/middleware";

const useProfileRoutingStates = create(persist(
    (set) => ({
        currentRouteState: {
           currentRoute : "profile",
           previousAction : "",
        },
        setCurrentRouteState: (currentRouteState) => set({ currentRouteState }),
        resetCurrentRouteState: () => set({ currentRouteState: { currentRoute : "", previousAction : "" } }),
    }),
    {
        name: "profileRoutingStates",
    },
));

export default useProfileRoutingStates;