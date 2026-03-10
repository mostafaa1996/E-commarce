import { create } from "zustand";
export const usePaginationStore = create((set) => ({
  PaginationSet: [1, 2, 3, 4],
  setPaginationSet: (currentPage, totalPages, rangeToShow) =>
    set(() => {
      let array = [];
      if (currentPage === 1)
        array = Array.from({ length: rangeToShow }).map((_, i) => i + 1);
      if (currentPage === totalPages)
        array = Array.from({ length: rangeToShow }).map(
          (_, i) => totalPages - rangeToShow + i + 1,
        );
      if (currentPage > 1 && currentPage < totalPages)
        array = Array.from({ length: rangeToShow }).map(
          (_, i) => currentPage - 1 + i,
        );
      return { PaginationSet: array };
    }),
}));
