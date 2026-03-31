/* ============================================================
   FORM.JS — Contact form handler (Formspree)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form[data-formspree]');
  if (!form) return;

  const btn = form.querySelector('#submitBtn');
  const success = form.querySelector('#form-success');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    btn.textContent = 'Invio in corso...';
    btn.disabled = true;

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        form.reset();
        if (success) {
          success.style.display = 'block';
        }
        btn.textContent = '✓ Inviato!';
        // Google Ads — conversione "Richiesta preventivo"
        if (typeof gtag === 'function') {
          gtag('event', 'conversion', {
            'send_to': 'AW-18041760624/itZGCIfU1o8cEPDW_ZpD',
            'value': 1.0,
            'currency': 'EUR'
          });
        }
      } else {
        btn.textContent = 'Riprova';
        btn.disabled = false;
      }
    } catch {
      btn.textContent = 'Errore — riprova';
      btn.disabled = false;
    }
  });
});
