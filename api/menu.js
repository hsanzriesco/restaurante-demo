import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

function formatPrice(cents) {
  return (cents / 100).toFixed(2).replace('.', ',') + ' €';
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Método no permitido' });
    return;
  }

  try {
    const rows = await sql`
      SELECT c.name AS category, c.display_order AS cat_order,
             d.name, d.price_cents, d.description, d.ingredients, d.allergens
      FROM categories c
      JOIN dishes d ON d.category_id = c.id
      ORDER BY c.display_order, d.display_order
    `;

    const menu = [];
    const byCategory = new Map();
    for (const row of rows) {
      if (!byCategory.has(row.category)) {
        const section = { category: row.category, items: [] };
        byCategory.set(row.category, section);
        menu.push(section);
      }
      byCategory.get(row.category).items.push({
        name: row.name,
        price: formatPrice(row.price_cents),
        desc: row.description,
        ingredients: row.ingredients,
        allergens: row.allergens
      });
    }

    res.status(200).json(menu);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'No se pudo cargar la carta' });
  }
}
