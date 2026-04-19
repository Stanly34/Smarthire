import { forwardGroup } from '../vercel/forwardGroup.mjs';

export default function handler(req, res) {
  return forwardGroup('/api/auth', req, res);
}
