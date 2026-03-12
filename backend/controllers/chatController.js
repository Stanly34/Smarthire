const db = require('../db');

// POST /api/chat/send
const sendMessage = async (req, res) => {
  const { receiver_id, content } = req.body;
  if (!receiver_id || !content) return res.status(400).json({ message: 'receiver_id and content are required' });
  try {
    const result = await db.query(
      'INSERT INTO messages (sender_id, receiver_id, content) VALUES ($1,$2,$3) RETURNING *',
      [req.user.id, receiver_id, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('sendMessage error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/chat/messages/:userId
const getMessages = async (req, res) => {
  const otherId = parseInt(req.params.userId);
  const myId = req.user.id;
  try {
    const result = await db.query(
      `SELECT m.*,
        su.email AS sender_email,
        ru.email AS receiver_email
       FROM messages m
       JOIN users su ON su.id=m.sender_id
       JOIN users ru ON ru.id=m.receiver_id
       WHERE (m.sender_id=$1 AND m.receiver_id=$2) OR (m.sender_id=$2 AND m.receiver_id=$1)
       ORDER BY m.sent_at ASC`,
      [myId, otherId]
    );
    // Mark received messages as read
    await db.query(
      'UPDATE messages SET is_read=true WHERE sender_id=$1 AND receiver_id=$2 AND is_read=false',
      [otherId, myId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('getMessages error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/chat/contacts
const getContacts = async (req, res) => {
  const myId = req.user.id;
  try {
    const result = await db.query(
      `SELECT DISTINCT ON (other_id)
        CASE WHEN m.sender_id=$1 THEN m.receiver_id ELSE m.sender_id END AS other_id,
        u.email AS other_email,
        u.role AS other_role,
        CASE
          WHEN u.role='student' THEN (SELECT full_name FROM students WHERE user_id=u.id)
          WHEN u.role='company' THEN (SELECT company_name FROM companies WHERE user_id=u.id)
          ELSE 'Admin'
        END AS display_name,
        m.content AS last_message,
        m.sent_at AS last_message_at
       FROM messages m
       JOIN users u ON u.id = CASE WHEN m.sender_id=$1 THEN m.receiver_id ELSE m.sender_id END
       WHERE m.sender_id=$1 OR m.receiver_id=$1
       ORDER BY other_id, m.sent_at DESC`,
      [myId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('getContacts error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { sendMessage, getMessages, getContacts };
