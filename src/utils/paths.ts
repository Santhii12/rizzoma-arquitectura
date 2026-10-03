export const withBase = (path: string) => {
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;

  const base = import.meta.env.BASE_URL || '/';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  const clean = path.replace(/^\/+/, '');

  return `${normalizedBase}${clean}`.replace(/\/{2,}/g, '/');
};
