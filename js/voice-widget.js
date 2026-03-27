/* ============================================================
   VOICE WIDGET JS — Tema dinamico + solo orb collassato
   Inietta variabili CSS --el-* direttamente sull'host element
   per penetrare il Shadow DOM del widget ElevenLabs
   ============================================================ */

(function () {
  'use strict';

  // Tema SCURO del widget (usato su sfondo chiaro)
  const THEME_DARK = {
    '--el-base':          '#0a0a0a',
    '--el-base-hover':    '#141414',
    '--el-base-active':   '#1a1a1a',
    '--el-base-border':   '#2a2a2a',
    '--el-base-subtle':   '#666666',
    '--el-base-primary':  '#f7f5f0',
    '--el-accent':        '#1c5c44',
    '--el-accent-hover':  '#2d7a5e',
    '--el-accent-active': '#145040',
    '--el-accent-border': '#2d7a5e',
    '--el-accent-subtle': '#4aad87',
    '--el-accent-primary':'#ffffff',
    '--el-base-error':    '#ef4444',
  };

  // Tema CHIARO del widget (usato su sfondo scuro)
  const THEME_LIGHT = {
    '--el-base':          '#f7f5f0',
    '--el-base-hover':    '#ede9e0',
    '--el-base-active':   '#e5e2d9',
    '--el-base-border':   '#d0cdc4',
    '--el-base-subtle':   '#7a7570',
    '--el-base-primary':  '#0a0a0a',
    '--el-accent':        '#1c5c44',
    '--el-accent-hover':  '#2d7a5e',
    '--el-accent-active': '#145040',
    '--el-accent-border': '#2d7a5e',
    '--el-accent-subtle': '#4aad87',
    '--el-accent-primary':'#ffffff',
    '--el-base-error':    '#ef4444',
  };

  // Sezioni con sfondo scuro
  const DARK_SELECTORS = [
    '.hero',
    '.ai-hero',
    '.ai-demo',
    '.marquee-strip',
    'footer',
  ];

  // Posizione verticale del widget dal basso (px)
  const WIDGET_Y_FROM_BOTTOM = 80;

  let currentTheme = null;

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

    const shouldBeDark = isDarkAtWidgetPosition();
    const newTheme = shouldBeDark ? THEME_LIGHT : THEME_DARK;

    // Aggiorna solo se il tema è cambiato
    if (newTheme !== currentTheme) {
      applyTheme(widget, newTheme);
    }
  }

  function init() {
    updateTheme();
    window.addEventListener('scroll', updateTheme, { passive: true });
    window.addEventListener('resize', updateTheme, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
