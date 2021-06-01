import Fuse from 'fuse.js';

export type FuseKey = Fuse.FuseOptionKeyObject | string;

const defaultOptions: Fuse.IFuseOptions<any> = {
  isCaseSensitive: false,
  shouldSort: true,
  threshold: 0.4,
  location: 0,
  ignoreLocation: true,
  distance: 200,
  minMatchCharLength: 1,
  useExtendedSearch: true,
};

export const filterWithFuse = <T>(
  array: T[],
  keys: FuseKey[],
  searchInput: string,
  displayAllIfEmpty: boolean = true,
  options: Fuse.IFuseOptions<T> = {},
): T[] => {
  if (displayAllIfEmpty && (!searchInput || !searchInput.length)) {
    return array;
  }

  const config = {
    ...defaultOptions,
    ...options,
    keys: keys as Fuse.FuseOptionKeyObject[],
  };
  const fuse = new Fuse<T>(array, config);
  return fuse.search(searchInput).map(item => item.item);
};
