export default function SetPaginationStart(
  currentPage,
  totalPages,
  rangeToShow,
) {
  if (!totalPages || totalPages <= rangeToShow) {
    return 1;
  }

  if (currentPage <= 1) {
    return 1;
  }

  if (currentPage >= totalPages) {
    return Math.max(1, totalPages - rangeToShow + 1);
  }

  return Math.max(1, currentPage - 1);
}
