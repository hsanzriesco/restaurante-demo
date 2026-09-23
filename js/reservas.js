const form = document.getElementById('form');
const dateInput = form.querySelector('input[name="date"]');
if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];

form.onsubmit = async e => {
  e.preventDefault();
  const submitBtn = form.querySelector('button[type="submit"]');
  const d = Object.fromEntries(new FormData(form));
  submitBtn.disabled = true;
  message.innerHTML = '<p class="loading">Enviando reserva…</p>';

  try {
    const res = await fetch('/api/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(d)
    });
    if (!res.ok) throw new Error('request-failed');
    message.innerHTML = `<div class="success"><b>¡Reserva recibida!</b><br>${d.date} a las ${d.time} · ${d.guests} comensales. Te esperamos en Calle Mayor 14.</div>`;
  } catch (err) {
    // Sin conexión al backend (por ejemplo en local sin desplegar): se guarda solo en este navegador
    const r = JSON.parse(sessionStorage.getItem('reservas') || '[]');
    r.push({ ...d, id: Date.now() });
    sessionStorage.setItem('reservas', JSON.stringify(r));
    message.innerHTML = `<div class="success"><b>¡Reserva recibida!</b><br>${d.date} a las ${d.time} · ${d.guests} comensales. <small>(Guardada solo en este navegador: no se pudo contactar con el servidor.)</small></div>`;
  }

  form.reset();
  dateInput.min = new Date().toISOString().split('T')[0];
  setTimeout(() => { submitBtn.disabled = false; }, 600);
};
