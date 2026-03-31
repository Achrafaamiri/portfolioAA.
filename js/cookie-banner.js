(function() {
  const MEASUREMENT_ID = 'G-0N05TCEE4F';
  const ADS_ID = 'AW-18041760624';

  // Inizializza dataLayer
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  window.gtag = gtag;

  // Imposta il consenso di default a "denied"
  gtag('consent', 'default', {
    'ad_storage': 'denied',
    'ad_user_data': 'denied',
    'ad_personalization': 'denied',
    'analytics_storage': 'denied'
  });

  // Caricamento asincrono dello script di GTM (rispetta il consenso impostato)
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);

  gtag('js', new Date());
  gtag('config', MEASUREMENT_ID);
  gtag('config', ADS_ID);

  // Controlla lo stato del consenso salvato
  document.addEventListener('DOMContentLoaded', () => {
    const consent = localStorage.getItem('aa_cookie_consent');
    if (consent === 'granted') {
      updateConsent('granted');
    } else if (consent === 'denied') {
      updateConsent('denied');
    } else {
      showBanner();
    }
  });

  function updateConsent(status) {
    gtag('consent', 'update', {
      'ad_storage': status,
      'ad_user_data': status,
      'ad_personalization': status,
      'analytics_storage': status
    });
  }

  function showBanner() {
    // Inject CSS
    const style = document.createElement('style');
    style.textContent = `
      #aa-cookie-banner {
        position: fixed;
        bottom: 24px;
        left: 24px;
        max-width: 380px;
        background: var(--ink, #0a0a0a);
        color: var(--paper, #f7f5f0);
        padding: 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        z-index: 99999;
        font-family: 'DM Sans', sans-serif;
        transform: translateY(150%);
        transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        border: 1px solid rgba(255,255,255,0.08);
      }
      @media (max-width: 600px) {
        #aa-cookie-banner {
          left: 16px;
          right: 16px;
          bottom: 16px;
          max-width: none;
        }
      }
      #aa-cookie-banner.visible {
        transform: translateY(0);
      }
      #aa-cookie-banner h3 {
        font-family: 'Syne', sans-serif;
        font-size: 1.05rem;
        margin-bottom: 0.5rem;
        font-weight: 700;
        color: white;
        letter-spacing: -0.01em;
      }
      #aa-cookie-banner p {
        font-size: 0.85rem;
        line-height: 1.6;
        margin-bottom: 1.25rem;
        color: rgba(255, 255, 255, 0.65);
      }
      .aa-cookie-buttons {
        display: flex;
        gap: 0.6rem;
      }
      .aa-cookie-btn {
        flex: 1;
        padding: 0.75rem 1rem;
        border-radius: 100px;
        font-family: 'Syne', sans-serif;
        font-size: 0.8rem;
        font-weight: 600;
        cursor: pointer;
        border: none;
        transition: all 0.2s;
        text-align: center;
      }
      .aa-cookie-accetta {
        background: var(--green, #1c5c44);
        color: white;
      }
      .aa-cookie-accetta:hover {
        background: var(--green-mid, #2d7a5e);
      }
      .aa-cookie-rifiuta {
        background: transparent;
        color: white;
        border: 1px solid rgba(255,255,255,0.2);
      }
      .aa-cookie-rifiuta:hover {
        border-color: white;
        background: rgba(255,255,255,0.05);
      }
    `;
    document.head.appendChild(style);

    // Inject HTML Banner
    const banner = document.createElement('div');
    banner.id = 'aa-cookie-banner';
    banner.innerHTML = `
      <h3>Privacy & Cookie</h3>
      <p>Utilizziamo i cookie per analizzare il traffico e migliorare il sito. Puoi scegliere le tue preferenze qui sotto.</p>
      <div class="aa-cookie-buttons">
        <button class="aa-cookie-btn aa-cookie-rifiuta" id="aa-cookie-reject">Rifiuta essenziali</button>
        <button class="aa-cookie-btn aa-cookie-accetta" id="aa-cookie-accept">Accetta tutti</button>
      </div>
    `;
    document.body.appendChild(banner);

    // Animazione di comparsa
    setTimeout(() => {
      banner.classList.add('visible');
    }, 100);

    // Event Listeners
    document.getElementById('aa-cookie-accept').addEventListener('click', () => {
      localStorage.setItem('aa_cookie_consent', 'granted');
      updateConsent('granted');
      closeBanner();
    });

    document.getElementById('aa-cookie-reject').addEventListener('click', () => {
      localStorage.setItem('aa_cookie_consent', 'denied');
      updateConsent('denied');
      closeBanner();
    });

    function closeBanner() {
      banner.classList.remove('visible');
      setTimeout(() => banner.remove(), 400); // Wait for transition
    }
  }
})();
