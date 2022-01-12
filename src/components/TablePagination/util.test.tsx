import getVisiblePages from './util';

describe('TablePagination Util', () => {
  it('returns an empty array', () => {
    const currentPage: number = 0;
    const totalPages: number = 0;
    const expectedPages: number[] = [];
    expect(getVisiblePages(currentPage, totalPages)).toEqual(expectedPages);
  });

  it('returns an array of only 3 pages', () => {
    const currentPage: number = 1;
    const totalPages: number = 3;
    const expectedPages: number[] = [1, 2, 3];
    expect(getVisiblePages(currentPage, totalPages)).toEqual(expectedPages);
  });

  it('returns an array of only first 4 pages and max page', () => {
    const currentPage: number = 0;
    const totalPages: number = 60;
    const expectedPages: number[] = [1, 2, 3, 4, 60];
    expect(getVisiblePages(currentPage, totalPages)).toEqual(expectedPages);
  });

  it('returns an array with starting page, max page, current page, and two surrounding current', () => {
    const currentPage: number = 25;
    const totalPages: number = 80;
    const expectedPages: number[] = [1, 24, 25, 26, 80];
    expect(getVisiblePages(currentPage, totalPages)).toEqual(expectedPages);
  });

  it('returns an array with starting page, current page-1, and current page through max page', () => {
    const currentPage: number = 48;
    const totalPages: number = 50;
    const expectedPages: number[] = [1, 47, 48, 49, 50];
    expect(getVisiblePages(currentPage, totalPages)).toEqual(expectedPages);
  });

  it('returns an array with starting page and current page with 3 preceding pages', () => {
    const currentPage: number = 50;
    const totalPages: number = 50;
    const expectedPages: number[] = [1, 47, 48, 49, 50];
    expect(getVisiblePages(currentPage, totalPages)).toEqual(expectedPages);
  });
});
