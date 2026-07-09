import { create } from "zustand";

const useProfileRoutingStates = create(
    (set) => ({
        currentRouteState: {
           previousAction : "",
        },
        setCurrentRouteState: (currentRouteState) => set({ currentRouteState }),
        resetCurrentRouteState: () => set({ currentRouteState: { currentRoute : "", previousAction : "" } }),
    }),
);

export default useProfileRoutingStates;