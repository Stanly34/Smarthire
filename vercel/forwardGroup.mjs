import app from '../server.js';

export function forwardGroup(basePath, req, res) {
  const url = new URL(req.url, 'http://localhost');
  const path = url.searchParams.get('path');
  url.searchParams.delete('path');

  const suffix = path ? `/${path}` : '';
  const query = url.searchParams.toString();

  req.url = `${basePath}${suffix}${query ? `?${query}` : ''}`;
  return app(req, res);
}
