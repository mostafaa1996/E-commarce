export default function SetPaginationStart(currentPage, totalPages, rangeToShow) {
  let startValue = 1;
  if (currentPage === 1)
    startValue = 1;
  if (currentPage === totalPages)
    startValue = totalPages - rangeToShow  + 1;
  if (currentPage > 1 && currentPage < totalPages)
    startValue = currentPage - 1 ;

  return startValue;
}
