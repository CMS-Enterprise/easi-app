// Logic for showing visible page buttons based on input of current page and total page
// Based on USWDS guidelines - https://designsystem.digital.gov/components/pagination/

// Creates an array of page numbers starting a 1, from an input of a number
const fillMinPages = (totalPages: number) => {
  return Array.from({ length: totalPages }, (_, i) => i + 1);
};

const getVisiblePages = (currentPage: number, totalPages: number) => {
  // If total pages are less than 7 (minimum for elipsis), create an array of available page based on total
  if (totalPages < 7) {
    return fillMinPages(totalPages);
  }
  // If total is more than the minimum for elipsis (7) and IS adjacent to the end page within 4 pages
  // Returns an array with the start page, and the last four pages
  if (
    currentPage % 4 >= 0 &&
    currentPage > 3 &&
    currentPage + 3 >= totalPages
  ) {
    return [
      1,
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages
    ];
  }
  // If total is more than the minimum for elipsis (7) and IS NOT adjacent to the start or end of pages
  // Returns an array with the start page, current pages, two adjacent pages, and end page
  if (currentPage % 4 >= 0 && currentPage > 4 && currentPage + 2 < totalPages) {
    return [1, currentPage - 1, currentPage, currentPage + 1, totalPages];
  }
  // If total is more than the minimum for elipsis (7) and IS adjacent to the start page within 4 pages
  // Returns an array with the first five pages and end page
  return [1, 2, 3, 4, 5, totalPages];
};

export default getVisiblePages;
