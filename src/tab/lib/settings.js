export const SETTINGS_STORAGE_KEY = 'settings';

export const DEFAULT_SETTINGS = {
  isShowContent: true,
  backgroundCarousel: {
    interval: 15 * 1000,
    photosNumber: 3,
    cacheTimeout: 1 * 60 * 1000,
  },
  notes: {
    cardOpacity: 0.85,
  },
  bookmark: {
    cardOpacity: 0.85,
    cardMaxHeight: '400px',
  },
  topSites: {
    limit: 10,
    cardOpacity: 0.85,
  },
  reminder: {
    cardOpacity: 0.85,
  },
  goodreads: {
    carouselInterval: 10 * 1000,
    cardOpacity: 0.9,
    cacheTimeout: 60 * 60 * 1000,
  },
  news: {
    cardOpacity: 0.9,
    cacheTimeout: 60 * 60 * 1000,
  },
  customNews: {
    cardOpacity: 0.9,
  },
  scriptExecutor: {
    cardOpacity: 0.9,
  },
  coin: {
    cardOpacity: 0.9,
    cacheTimeout: 60 * 60 * 1000,
  },
};
