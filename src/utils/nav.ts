import { router, type Href } from 'expo-router';

/** Typed-routes lag behind new files until Expo regenerates `.expo/types`. */
export const href = (path: string) => path as Href;

export const push = (path: string, params?: Record<string, string>) => {
  if (!params) {
    router.push(href(path));
    return;
  }
  router.push({ pathname: path, params } as Href);
};

export const replace = (path: string, params?: Record<string, string>) => {
  if (!params) {
    router.replace(href(path));
    return;
  }
  router.replace({ pathname: path, params } as Href);
};
