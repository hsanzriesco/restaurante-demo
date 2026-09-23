import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, phone, date, time, guests, notes } = req.body || {};
    if (!name || !phone || !date || !time || !guests) {
      res.status(400).json({ error: 'Faltan datos obligatorios' });
      return;
    }
    try {
      const rows = await sql`
        INSERT INTO reservations (customer_name, phone, reservation_date, reservation_time, guests, notes)
        VALUES (${name}, ${phone}, ${date}, ${time}, ${Number(guests)}, ${notes || null})
        RETURNING id
      `;
      res.status(201).json({ ok: true, id: rows[0].id });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'No se pudo guardar la reserva' });
    }
    return;
  }

  if (req.method === 'GET') {
    try {
      const rows = await sql`
        SELECT id, customer_name AS name, phone,
               reservation_date AS date, reservation_time AS time,
               guests, notes, status
        FROM reservations
        ORDER BY reservation_date, reservation_time
      `;
      res.status(200).json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'No se pudieron cargar las reservas' });
    }
    return;
  }

  res.status(405).json({ error: 'Método no permitido' });
}
