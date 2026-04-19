import app from '../../server.js';

export default function handler(req, res) {
  const id = req.query?.id;

  if (!id) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'User id is required' }));
    return;
  }

  req.url = `/api/admin/approve-user/${encodeURIComponent(id)}`;
  return app(req, res);
}
