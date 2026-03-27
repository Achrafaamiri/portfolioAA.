/* ============================================================
   VOICE WIDGET JS — Tema dinamico + auto-start chiamata
   Inietta variabili CSS --el-* direttamente sull'host element
   per penetrare il Shadow DOM del widget ElevenLabs
   ============================================================ */

(function () {
  'use strict';

  // Tema SCURO del widget (usato su sfondo chiaro)
  const THEME_DARK = {
    '--el-base': '#0a0a0a',
    '--el-base-hover': '#141414',
    '--el-base-active': '#1a1a1a',
    '--el-base-border': '#2a2a2a',
    '--el-base-subtle': '#666666',
    '--el-base-primary': '#f7f5f0',
    '--el-accent': '#1c5c44',
    '--el-accent-hover': '#2d7a5e',
    '--el-accent-active': '#145040',
    '--el-accent-border': '#2d7a5e',
    '--el-accent-subtle': '#4aad87',
    '--el-accent-primary': '#ffffff',
    '--el-base-error': '#ef4444',
  };

  // Tema CHIARO del widget (usato su sfondo scuro)
  const THEME_LIGHT = {
    '--el-base': '#1c5c44',
    '--el-base-hover': '#ede9e0',
    '--el-base-active': '#e5e2d9',
    '--el-base-border': '#d0cdc4',
    '--el-base-subtle': '#7a7570',
    '--el-base-primary': '#0a0a0a',
    '--el-accent': '#0a0a0a',
    '--el-accent-hover': '#2d7a5e',
    '--el-accent-active': '#145040',
    '--el-accent-border': '#2d7a5e',
    '--el-accent-subtle': '#4aad87',
    '--el-accent-primary': '#ffffff',
    '--el-base-error': '#ef4444',
  };

  // Sezioni con sfondo scuro
  const DARK_SELECTORS = [
    '.hero',
    '.ai-hero',
    '.ai-demo',
    '.marquee-strip',
    'footer',
  ];

  const WIDGET_Y_FROM_BOTTOM = 80;
  let currentTheme = null;
  let autoStartListenerAttached = false;

  // ── Tema ──────────────────────────────────────────────────

  function applyTheme(widget, theme) {
    const vars = Object.entries(theme)
      .map(([k, v]) => `${k}: ${v}`)
      .join('; ');
    widget.style.cssText = vars;
    currentTheme = theme;
  }

  function isDarkAtWidgetPosition() {
    const widgetY = window.innerHeight - WIDGET_Y_FROM_BOTTOM;
    for (const sel of DARK_SELECTORS) {
      for (const el of document.querySelectorAll(sel)) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= widgetY && rect.bottom >= widgetY) {
          return true;
        }
      }
    }
    return false;
  }

  function updateTheme() {
    const widget = document.querySelector('elevenlabs-convai');
    if (!widget) return;
    const newTheme = isDarkAtWidgetPosition() ? THEME_LIGHT : THEME_DARK;
    if (newTheme !== currentTheme) {
      applyTheme(widget, newTheme);
    }
  }

  // ── Auto-start chiamata al click ──────────────────────────

  function tryClickCallButton(shadow) {
    // Prova diversi selettori possibili per il pulsante di chiamata
    const selectors = [
      'button[aria-label*="call"]',
      'button[aria-label*="Call"]',
      'button[aria-label*="chiamata"]',
      'button[data-testid="call-button"]',
      'button[data-testid="start-call"]',
      // Fallback: cerca il pulsante col telefono dentro il shadow DOM
      'button svg[data-testid="phone-icon"]',
    ];

    for (const sel of selectors) {
      const el = shadow.querySelector(sel);
      if (el) {
        // Se abbiamo trovato l'SVG, clicca il suo pulsante padre
        const btn = el.closest ? el.closest('button') || el : el;
        btn.click();
        return true;
      }
    }

    // Fallback finale: cerca tutti i pulsanti nel shadow DOM
    // e clicca il primo che sembra un pulsante di avvio chiamata
    const allBtns = shadow.querySelectorAll('button');
    for (const btn of allBtns) {
      const label = (btn.getAttribute('aria-label') || '').toLowerCase();
      const text = (btn.textContent || '').toLowerCase();
      if (
        label.includes('call') || label.includes('start') ||
        label.includes('parla') || label.includes('chiama') ||
        text.includes('parla') || text.includes('chiama') ||
        text.includes('start') || text.includes('call')
      ) {
        btn.click();
        return true;
      }
    }

    return false;
  }

  function attachAutoStart(widget) {
    if (autoStartListenerAttached) return;
    autoStartListenerAttached = true;

    widget.addEventListener('click', function onWidgetClick() {
      // Attendi che il widget si espanda e il shadow DOM si aggiorni
      const tryStart = (attempt) => {
        if (attempt > 10) return; // max 10 tentativi

        const shadow = widget.shadowRoot;
        if (!shadow) {
          setTimeout(() => tryStart(attempt + 1), 150);
          return;
        }

        const clicked = tryClickCallButton(shadow);
        if (!clicked) {
          // Riprova tra un po' — il DOM potrebbe non essere ancora pronto
          setTimeout(() => tryStart(attempt + 1), 150);
        }
      };

      // Piccolo delay iniziale per lasciare che il widget si apra
      setTimeout(() => tryStart(0), 200);

      // Rimuovi il listener dopo il primo click utile
      widget.removeEventListener('click', onWidgetClick);
    }, { once: false });
  }

  // ── Init ──────────────────────────────────────────────────

  function init() {
    const widget = document.querySelector('elevenlabs-convai');
    if (!widget) return;

    updateTheme();
    attachAutoStart(widget);

    window.addEventListener('scroll', updateTheme, { passive: true });
    window.addEventListener('resize', updateTheme, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
