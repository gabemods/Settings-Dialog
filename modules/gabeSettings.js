// gabeSettings.js

/* 2025 Gabe Mods (https://gabemods.github.io/about), All Rights Reserved.
*/

/**
 * GabeSettings Class
 *
 * This class handles global dependencies (Material Web Components),
 * global styles, and injects the main header and footer.
 * It also registers the custom element for the settings dialog.
 */
class GabeSettings {
  constructor() {
    this.init();
  }

  init() {
    // Inject Material Web Components imports and fonts first, as they are global dependencies
    this.injectMaterialDependencies();
    this.injectGlobalStyles(); // Inject global styles like body, header, footer
    this.injectGlobalHTML(); // Inject header, footer
    this.registerSettingsDialog(); // Register the custom element
    this.setupGlobalEventListeners(); // Setup listeners for header/footer and opening the dialog

    // Apply saved settings after all HTML and custom elements are registered/injected
    // Give a slight delay to ensure custom elements are fully upgraded by the browser
    // This is especially important for things like font application that depend on DOM readiness
    setTimeout(() => {
      this.applySavedSettings();
    }, 100);
  }

  /**
   * Injects Material Icons, Symbols font links, and Material Web Components script
   * with an import map into the document head if they are not already present.
   */
  injectMaterialDependencies() {
    // Material Icons Round (for older 'settings' icon)
    if (!document.querySelector('link[href*="Material+Icons+Round"]')) {
      const materialIconsLink = document.createElement('link');
      materialIconsLink.href = "https://fonts.googleapis.com/icon?family=Material+Icons+Round";
      materialIconsLink.rel = "stylesheet";
      document.head.appendChild(materialIconsLink);
    }

    // Material Symbols Rounded (as specified in your :root variable)
    if (!document.querySelector('link[href*="Material+Symbols+Rounded"]')) {
      const materialSymbolsLink = document.createElement('link');
      materialSymbolsLink.href = "https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap";
      materialSymbolsLink.rel = "stylesheet";
      document.head.appendChild(materialSymbolsLink);
    }

    // Import Map for Material Web Components
    if (!document.querySelector('script[type="importmap"]')) {
      const importMapScript = document.createElement('script');
      importMapScript.type = "importmap";
      importMapScript.textContent = `{ "imports": { "@material/web/": "https://esm.run/@material/web/" } }`;
      document.head.appendChild(importMapScript);
    }

    // Material Web Components script itself
    if (!document.querySelector('script[data-material-injected]')) {
      const materialScript = document.createElement('script');
      materialScript.type = "module";
      materialScript.setAttribute('data-material-injected', 'true');
      materialScript.textContent = `
        import '@material/web/all.js';
        import { styles as typescaleStyles } from '@material/web/typography/md-typescale-styles.js';

        if (document.adoptedStyleSheets) {
          try {
            document.adoptedStyleSheets.push(typescaleStyles.styleSheet);
          } catch (e) {
            console.warn("Could not use adoptedStyleSheets, falling back to traditional style tag:", e);
            const styleEl = document.createElement('style');
            styleEl.textContent = typescaleStyles.cssText;
            document.head.appendChild(styleEl);
          }
        } else {
          const styleEl = document.createElement('style');
          styleEl.textContent = typescaleStyles.cssText;
          document.head.appendChild(styleEl);
        }
      `;
      document.head.appendChild(materialScript);
    }
  }

  /**
   * Injects the global custom CSS styles (body, header, footer specific) into the document head.
   */
  injectGlobalStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* Global CSS Variables */
      :root {
        --bg-light: #fafafa;
        --bg-dark: #121212;
        --text-light: #111;
        --text-dark: #eee;
        --header-bg-light: rgba(250, 250, 250, 0.0);
        --header-bg-dark: rgba(18, 18, 18, 0.7);
        --solid-bg: #ffffff;
        --accent: #e0a100; /* Re-added global accent */
        --red-accent: #b22222;
        --transparent-button: rgba(255, 255, 255, 0); /* Re-added global transparent button */
        --transition: 0.25s ease-in-out;
        --card-light: #ffffff;
        --card-dark: #121212;
        --search-overlay-light: rgba(255, 255, 255, 0.3);
        --search-overlay-dark: rgba(0, 0, 0, 0.3);
        --text: var(--text-light);

        --md-icon-font: 'Material Symbols Rounded';
        --md-sys-typescale-body-font: "OneUISans", sans-serif;
        --md-sys-typescale-title-font: "OneUISans", sans-serif;
        --md-sys-typescale-label-font: "OneUISans", sans-serif;
        --md-sys-typescale-headline-font: "OneUISans", sans-serif;

        --header-initial-height: 70px;
        --header-scrolled-height: 50px;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        font-weight: 400;
        background: var(--bg-light);
        color: var(--text-light);
        transition: background var(--transition), color var(--transition), font-family 0.3s ease-in-out;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center center;
        background-attachment: fixed;
      }

      body.dark {
        background: var(--bg-dark);
        color: var(--text-dark);
        --text: var(--text-dark);
        --solid-bg: #121212;
      }

      /* Font Imports (kept global for body styling) */
      @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&family=Roboto:wght@400;700&display=swap');
      @font-face {
        font-family: "OneUISans";
        src: url("https://gabemods.github.io/fonts/OneUISans-Regular.ttf") format("truetype");
        font-weight: 400;
        font-style: normal;
      }

      body {
        font-family: 'OneUISans', sans-serif; /* Default body font */
      }

      /* Font classes for body */
      body.font-system {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
      }
      body.font-OneUISans {
        font-family: 'OneUISans', sans-serif;
      }
      body.font-system-apple {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
      }
      body.font-Roboto {
        font-family: 'Roboto', sans-serif;
      }
      body.font-Open-Sans {
        font-family: 'Open Sans', sans-serif;
      }

      body {
        font-size: 30px; /* This seems quite large for default body font, confirm if intentional */
      }

      /* Header Styling */
      .main-header {
        font-weight: 900;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        padding: 16px 24px;
        z-index: 200;
        will-change: padding, background-color, backdrop-filter, box-shadow;
        transition: padding 0.25s ease, backdrop-filter 0.25s ease, background-color 0.25s ease, box-shadow 0.25s ease, height 0.25s ease;
        background: var(--header-bg-light);
        backdrop-filter: blur(15px);
        height: var(--header-initial-height);
        display: flex;
        align-items: center;
      }

      body.dark .main-header {
        background: var(--header-bg-dark);
      }

      .main-header.scrolled {
        padding: 8px 24px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(20px);
        height: var(--header-scrolled-height);
      }

      .main-header.translucent.scrolled {
        background-color: rgba(255, 255, 255, 0.8);
      }

      body.dark .main-header.translucent.scrolled {
        background-color: rgba(0, 0, 0, 0.6);
      }

      .main-header.no-translucency {
        background-color: var(--solid-bg);
        backdrop-filter: none;
      }

      body.dark .main-header.no-translucency {
        background-color: #121212 !important;
      }

      .main-header.shrink {
        padding: 6px 16px;
        height: var(--header-scrolled-height);
      }

      .header-inner {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
      }

      .header-title {
        max-width: 100px;
        height: auto;
        display: block;
        cursor: pointer;
        transition: opacity 0.4s ease, visibility 0.4s ease;
      }

      .title-container {
        opacity: 1;
        transform: scale(1);
        transition: opacity 0.3s ease, transform 0.3s ease;
        display: inline-block;
        vertical-align: middle;
      }

      .title-container.hidden {
        opacity: 0;
        transform: scale(0.95);
        pointer-events: none;
        position: absolute;
      }

      .image-title {
        height: 35px;
        width: auto;
      }

      .main-header h1 {
        font-size: 1.3rem;
        margin: 0;
        transition: font-size var(--transition);
        will-change: font-size, transform;
      }

      .main-header.shrink h1 {
        font-size: 1.2rem;
      }

      .text {
        display: flex;
        margin-top: calc(var(--header-initial-height) + 20px);
        justify-content: center;
        align-items: center;
        padding: 20px;
        min-height: calc(100vh - var(--header-initial-height) - 40px);
      }

      .main-header.scrolled + .text,
      .main-header.shrink + .text {
        margin-top: calc(var(--header-scrolled-height) + 20px);
      }

      .main-header .header-icons {
        display: flex;
        align-items: center;
        gap: 1px;
      }

      body.dark md-icon {
        color: white;
      }

      body:not(.dark) md-icon {
        color: #444;
      }

      #content-fade-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: var(--fade-overlay-color, rgba(255, 255, 255, 1));
        z-index: 100000;
        opacity: 0;
        visibility: hidden;
        transition: opacity 250ms ease-in-out, visibility 250ms ease-in-out;
        pointer-events: none;
      }

      body.dark {
        --fade-overlay-color: rgba(0, 0, 0, 1);
      }

      #content-fade-overlay.fade-active {
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
      }

      .custom-divider {
        border: 0;
        height: 1px;
        background-color: rgba(0, 0, 0, 0.2);
        margin: 0 auto;
        width: 100%;
      }

      body.dark .custom-divider {
        background-color: rgba(255, 255, 255, 0.2);
      }

      footer {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        background-color: transparent;
        margin-top: 40px;
        padding: 10px 0;
        text-align: center;
        font-size: clamp(0.85rem, 1vw + 0.3rem, 0.95rem);
        color: var(--text-light);
        transition: color var(--transition);
      }

      body.dark footer {
        color: var(--text-dark);
      }

      footer .container {
        width: min(90%, 800px);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
      }

      footer a {
        color: var(--accent);
        text-decoration: none;
        transition: color var(--transition);
      }

      footer a:hover {
        text-decoration: underline;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Injects the main HTML structure for header and footer into the document body.
   */
  injectGlobalHTML() {
    const globalHTML = `
      <header class="main-header">
        <div class="header-inner">
          <div class="title-container">
            <h1 class="text-title">Settings Dialog</h1>
          </div>
          <div class="header-icons">
            <md-icon-button id="settings-button" aria-label="Settings">
              <md-icon>settings</md-icon>
            </md-icon-button>
          </div>
        </div>
      </header>
      <p class="text">Nothing to see here...</p>
      <footer>
        <div class="container">
          <hr class="custom-divider">
          <span>&copy; <span id="current-year"></span> Coded by Gabe Mods <br> If you use any of this code you must include this copyright and the copyright in the code.</span>
        </div>
      </footer>
      <div id="content-fade-overlay"></div>
    `;
    document.body.insertAdjacentHTML('afterbegin', globalHTML);
  }

  /**
   * Registers the <gabe-settings-dialog> custom element.
   * This is where the modal's HTML, CSS, and logic are encapsulated.
   */
  registerSettingsDialog() {
    if (customElements.get('gabe-settings-dialog')) {
      console.warn('gabe-settings-dialog already registered.');
      return;
    }

    class GabeSettingsDialog extends HTMLElement {
      constructor() {
        super();
        this.attachShadow({ mode: 'open' }); // Use shadow DOM for encapsulation
        this.isOpen = false;
        this.render();
        this.setupModalEventListeners();
        this.applyInitialSettings(); // Apply settings on custom element creation
      }

      // Render method to inject HTML and styles into the shadow DOM
      render() {
        this.shadowRoot.innerHTML = `
          <style>
            /* CSS Variables that need to be available INSIDE the Shadow DOM */
            /* These are duplicates/overrides of global variables to ensure they work within the shadow DOM */
            :host {
                --text-light: #111;
                --text-dark: #eee;
                --card-light: #ffffff;
                --card-dark: #121212;
                --red-accent: #b22222;
                --accent: #e0a100; /* Re-added for custom element use */
                --transparent-button: rgba(255, 255, 255, 0); /* Re-added for custom element use */
                --md-icon-font: 'Material Symbols Rounded';
            }

            /* Dark mode variables for :host-context rules, re-mapping for shadow DOM */
            :host-context(body.dark) {
                --text-light: var(--text-dark);
                --card-light: var(--card-dark);
            }

            /* Your provided modal-specific CSS */
            @keyframes scaleIn {
              from {
                opacity: 0;
                transform: scale(0.92);
              }
              to {
                opacity: 1;
                transform: scale(1);
              }
            }

            @keyframes scaleOut {
              from {
                opacity: 1;
                transform: scale(1);
              }
              to {
                opacity: 0;
                transform: scale(0.9);
              }
            }

            .settings-dialog {
              position: fixed;
              inset: 0;
              margin: auto;
              width: 90vw;
              max-width: 320px;
              padding: 24px;
              border: none;
              border-radius: 24px;
              background-color: white;
              color: black;
              font-family: 'Roboto', sans-serif;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
              z-index: 999;
              opacity: 0;
              transform: translateY(-20px) scale(0.9);
              pointer-events: none;
              transition: opacity 250ms cubic-bezier(0.4, 0, 0.2, 1), transform 250ms cubic-bezier(0.4, 0, 0.2, 1);
            }

            .settings-dialog.open {
              opacity: 1;
              transform: translateY(0) scale(1);
              pointer-events: auto;
            }

            .settings-dialog.closing {
              opacity: 0;
              transform: translateY(-20px) scale(0.9);
              pointer-events: none;
            }

            .backdrop {
              position: fixed;
              inset: 0;
              background: rgba(0, 0, 0, 0.4);
              opacity: 0;
              z-index: 998;
              transition: opacity 250ms ease;
              pointer-events: none;
            }

            .backdrop.show {
              opacity: 1;
              pointer-events: auto;
            }

            .backdrop.hidden {
              display: none;
            }

            .settings-dialog select {
              width: 100%;
              padding: 14px;
              margin-top: 10px;
              border: none;
              border-radius: 30px;
              background-color: #f5f8ff;
              color: #1a73e8;
              font-weight: bold;
              font-size: 16px;
              appearance: none;
              text-align: center;
              box-shadow: inset 0 0 0 1px #d0d0d0;
              transition: background-color 0.25s ease, color 0.25s ease, box-shadow 0.25s ease;
            }

            .settings-dialog select:active {
              background-color: #e0ecff;
              box-shadow: inset 0 0 0 1px #90caf9;
            }

            .settings-dialog select:focus {
              background-color: #e0ecff;
              box-shadow: inset 0 0 0 1px #90caf9;
            }

            /* Dark mode styles for dialog - These will be applied if body.dark is active on the host */
            :host-context(body.dark) .settings-dialog {
              background-color: #121212;
              color: white;
            }

            :host-context(body.dark) .settings-dialog select {
              background-color: #1e1e1e;
              color: #90caf9;
              box-shadow: inset 0 0 0 1px #444;
            }

            :host-context(body.dark) .settings-dialog select:active,
            :host-context(body.dark) .settings-dialog select:focus {
              background-color: #2a2a2a;
              box-shadow: inset 0 0 0 2px #90caf9;
            }

            .settings-dialog .modal-content h2 {
              margin-top: 0;
              margin-bottom: 16px;
              font-weight: 700;
              font-size: 1.5rem;
            }

            .settings-dialog label[for="theme-select"] {
              font-size: 1.1rem;
              font-weight: 510;
              display: block;
              margin-bottom: 2px;
            }

            .settings-dialog label[for="font-select"] {
              font-size: 1.1rem;
              font-weight: 510;
              display: block;
              margin-bottom: 5px;
            }

            .settings-dialog label[for="background-select"] {
              font-size: 1.1rem;
              font-weight: 510;
              display: block;
              margin-top: 15px;
              margin-bottom: 2px;
            }

            .modal-actions {
              display: flex;
              justify-content: flex-end;
              margin-top: 12px;
            }

            .close-button, .reset-button {
              background: none;
              border: none;
              color: #1a73e8;
              font-family: inherit;
              font-weight: 600;
              font-size: 16px;
              cursor: pointer;
              padding: 8px 16px;
              transition: color 0.2s ease;
              border-radius: 50px;
            }

            .close-button:hover,
            .close-button:focus,
            .reset-button:hover,
            .reset-button:focus {
              color: #174ea6;
              background-color: rgba(26, 115, 232, 0.08);
              outline: none;
            }

            .toggle-setting {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin: 16px 0;
              -webkit-tap-highlight-color: transparent;
              touch-action: none;
            }

            .setting-label {
              font-size: 1rem;
              color: var(--text-light);
            }

            /* Dark mode for setting-label within shadow DOM */
            :host-context(body.dark) .setting-label {
                color: var(--text-dark);
            }

            .switch {
              position: relative;
              display: inline-block;
              width: 52px;
              height: 28px;
              touch-action: none;
            }

            .switch input {
              opacity: 0;
              width: 0;
              height: 0;
              pointer-events: none;
            }

            .slider {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background-color: #ccc;
              transition: background-color 0.3s ease;
              border-radius: 34px;
              cursor: pointer;
            }

            .slider:before {
              content: "";
              position: absolute;
              height: 22px;
              width: 22px;
              left: 3px;
              bottom: 3px;
              background-color: white;
              border-radius: 50%;
              transition: transform 0.3s ease;
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
            }

            input:checked + .slider {
              background-color: #0278ff;
            }

            input:checked + .slider:before {
              transform: translateX(24px);
            }

            :host-context(body.dark) .slider {
              background-color: #444;
            }

            :host-context(body.dark) input:checked + .slider {
              background-color: #90caf9;
            }

            :host-context(body.dark) .slider:before {
              background-color: #e0e0e0;
            }

            .setting-item .setting-label {
                display: block;
                margin-bottom: 6px;
                font-weight: 500;
                color: var(--text-light);
                font-size: 1rem;
            }

            :host-context(body.dark) .setting-item .setting-label {
                color: var(--text-dark);
            }

            .background-image-controls {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                gap: 8px;
                margin-bottom: 12px;
            }

            .image-picker-button {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 5px;
                padding: 6px 10px;
                border: 1px solid rgba(0, 0, 0, 0.1);
                border-radius: 5px;
                background-color: var(--card-light);
                color: var(--text-light);
                font-family: inherit;
                font-size: 0.9rem;
                cursor: pointer;
                transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
                box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
                white-space: nowrap;
            }

            :host-context(body.dark) .image-picker-button {
                border-color: rgba(255, 255, 255, 0.1);
                background-color: var(--card-dark);
                color: var(--text-dark);
            }

            .image-picker-button:hover {
                background-color: rgba(0, 0, 0, 0.04);
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
            }

            :host-context(body.dark) .image-picker-button:hover {
                background-color: rgba(255, 255, 255, 0.04);
            }

            .image-picker-button:active {
                transform: translateY(0.5px);
                box-shadow: 0 0px 1px rgba(0, 0, 0, 0.05);
            }

            .image-picker-button md-icon {
                font-size: 15px;
                font-family: var(--md-icon-font);
                color: inherit;
            }

            .image-picker-button.clear-button {
                background-color: var(--red-accent);
                color: white;
                border-color: var(--red-accent);
            }

            .image-picker-button.clear-button:hover {
                background-color: #d33a3a;
                border-color: #d33a3a;
            }

            .background-status {
                margin-left: 5px;
                font-size: 1rem;
                color: #888;
                text-align: left;
                padding-left: 0;
            }

            :host-context(body.dark) .background-status {
                color: #999;
            }

            .settings-modal .setting-item {
                margin-bottom: 16px;
            }
          </style>

          <div class="backdrop"></div>
          <dialog class="settings-dialog">
            <div class="modal-content">
              <h2>Settings</h2>
              <label for="theme-select">Theme</label>
              <select id="theme-select">
                <option value="system">System</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
              <div class="toggle-setting">
                <span class="setting-label">Translucency</span>
                <label class="switch">
                  <input type="checkbox" id="translucency-toggle">
                  <span class="slider"></span>
                </label>
              </div>
              <label for="font-select">Font</label>
              <select id="font-select">
                <option value="system">System Default</option>
                <option value="OneUISans">OneUISans</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
              </select>
              <div class="setting-item">
                <label for="background-select" class="setting-label">Background Image:</label>
                <div class="background-image-controls">
                    <button id="choose-background-button" class="image-picker-button">
                        <md-icon>image</md-icon> Image picker
                    </button>
                    <button id="clear-background-button" class="image-picker-button clear-button">
                        <md-icon>close</md-icon> Clear
                    </button>
                    <input type="file" id="image-upload-input" accept="image/*" style="display: none;">
                    <span id="current-background-status" class="background-status">None selected</span>
                </div>
              </div>
              <div class="modal-actions">
                <button id="reset-settings-button" class="reset-button">Reset</button>
                <button id="close-settings" class="close-button">Close</button>
              </div>
            </div>
          </dialog>
        `;
      }

      connectedCallback() {
        this.setupModalEventListeners();
        this.applyInitialSettings();
      }

      setupModalEventListeners() {
        const dialog = this.shadowRoot.querySelector('.settings-dialog');
        const backdrop = this.shadowRoot.querySelector('.backdrop');
        const closeModalButton = this.shadowRoot.getElementById('close-settings');
        const themeSelect = this.shadowRoot.getElementById('theme-select');
        const translucencyToggle = this.shadowRoot.getElementById('translucency-toggle');
        const fontSelect = this.shadowRoot.getElementById('font-select');
        const chooseBackgroundButton = this.shadowRoot.getElementById('choose-background-button');
        const clearBackgroundButton = this.shadowRoot.getElementById('clear-background-button');
        const imageUploadInput = this.shadowRoot.getElementById('image-upload-input');
        const currentBackgroundStatus = this.shadowRoot.getElementById('current-background-status');
        const resetButton = this.shadowRoot.getElementById('reset-settings-button');

        if (closeModalButton) {
          closeModalButton.addEventListener('click', () => this.close());
        }
        if (backdrop) {
          backdrop.addEventListener('click', () => this.close());
        }
        if (dialog) {
            dialog.addEventListener('cancel', (event) => {
                event.preventDefault();
                this.close();
            });
        }

        if (themeSelect) {
          themeSelect.addEventListener('change', (event) => {
            const selectedTheme = event.target.value;
            document.dispatchEvent(new CustomEvent('gabeSettings:themeChange', { detail: selectedTheme }));
            localStorage.setItem('theme', selectedTheme);
          });
        }

        if (translucencyToggle) {
          translucencyToggle.addEventListener('change', (event) => {
            const isChecked = event.target.checked;
            document.dispatchEvent(new CustomEvent('gabeSettings:translucencyChange', { detail: isChecked }));
            localStorage.setItem('translucency', isChecked);
          });
        }

        if (fontSelect) {
          fontSelect.addEventListener('change', (event) => {
            const selectedFont = event.target.value;
            document.dispatchEvent(new CustomEvent('gabeSettings:fontChange', { detail: selectedFont }));
            localStorage.setItem('font', selectedFont);
          });
        }

        if (chooseBackgroundButton && imageUploadInput && currentBackgroundStatus) {
          chooseBackgroundButton.addEventListener('click', () => {
            imageUploadInput.click();
          });

          imageUploadInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (e) => {
                document.body.style.backgroundImage = `url('${e.target.result}')`;
                localStorage.setItem('customBackgroundImage', e.target.result);
                currentBackgroundStatus.textContent = file.name;
              };
              reader.readAsDataURL(file);
            }
          });
        }

        if (clearBackgroundButton && currentBackgroundStatus) {
          clearBackgroundButton.addEventListener('click', () => {
            document.body.style.backgroundImage = 'none';
            localStorage.removeItem('customBackgroundImage');
            currentBackgroundStatus.textContent = 'None selected';
          });
        }

        if (resetButton) {
          resetButton.addEventListener('click', () => {
            localStorage.clear();
            window.location.reload();
          });
        }
      }

      applyInitialSettings() {
        const themeSelect = this.shadowRoot.getElementById('theme-select');
        const translucencyToggle = this.shadowRoot.getElementById('translucency-toggle');
        const fontSelect = this.shadowRoot.getElementById('font-select');
        const currentBackgroundStatus = this.shadowRoot.getElementById('current-background-status');

        // Theme - Set the select box value based on saved theme
        const savedTheme = localStorage.getItem('theme');
        if (themeSelect && savedTheme) {
            themeSelect.value = savedTheme;
        } else if (themeSelect) {
            themeSelect.value = 'system'; // Default
        }

        // Translucency - Set toggle state
        const savedTranslucency = localStorage.getItem('translucency');
        if (translucencyToggle && savedTranslucency !== null) {
            translucencyToggle.checked = savedTranslucency === 'true';
        } else if (translucencyToggle) {
            translucencyToggle.checked = true; // Default
        }

        // Font - Set the select box value based on saved font
        const savedFont = localStorage.getItem('font');
        if (fontSelect && savedFont) {
            fontSelect.value = savedFont;
        } else if (fontSelect) {
            fontSelect.value = 'OneUISans'; // Default
        }

        // Custom Background Image - Update status text
        const savedBackgroundImage = localStorage.getItem('customBackgroundImage');
        if (currentBackgroundStatus) {
          currentBackgroundStatus.textContent = savedBackgroundImage ? 'Custom image applied' : 'None selected';
        }
      }

      open() {
        const dialog = this.shadowRoot.querySelector('.settings-dialog');
        const backdrop = this.shadowRoot.querySelector('.backdrop');
        if (dialog && backdrop) {
            dialog.classList.remove('closing');
            dialog.classList.add('open');
            backdrop.classList.remove('hidden');
            backdrop.classList.add('show');
            if (dialog.tagName === 'DIALOG') {
                dialog.showModal();
            }
            this.isOpen = true;
        }
      }

      close() {
        const dialog = this.shadowRoot.querySelector('.settings-dialog');
        const backdrop = this.shadowRoot.querySelector('.backdrop');
        if (dialog && backdrop) {
            dialog.classList.remove('open');
            dialog.classList.add('closing');

            const handleTransitionEnd = () => {
                dialog.removeEventListener('transitionend', handleTransitionEnd);
                backdrop.classList.remove('show');
                backdrop.classList.add('hidden');
                 if (dialog.tagName === 'DIALOG') {
                    dialog.close();
                }
                this.isOpen = false;
            };
            dialog.addEventListener('transitionend', handleTransitionEnd);
        }
      }
    }
    customElements.define('gabe-settings-dialog', GabeSettingsDialog);

    // After defining, inject the custom element into the DOM
    const dialogElement = document.createElement('gabe-settings-dialog');
    document.body.appendChild(dialogElement);
  }

  /**
   * Sets up global event listeners for the header and opening the settings dialog.
   * Also listens for custom events from the shadow DOM to apply global settings.
   */
  setupGlobalEventListeners() {
    const settingsButton = document.getElementById('settings-button');
    const mainHeader = document.querySelector('.main-header');

    if (settingsButton) {
      settingsButton.addEventListener('click', () => {
        const settingsDialogElement = document.querySelector('gabe-settings-dialog');
        if (settingsDialogElement && typeof settingsDialogElement.open === 'function') {
          settingsDialogElement.open();
        }
      });
    }

    if (mainHeader) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 0) {
          mainHeader.classList.add('scrolled');
        } else {
          mainHeader.classList.remove('scrolled');
        }
      });
    }

    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
      currentYearSpan.textContent = new Date().getFullYear().toString();
    }

    // --- Listen for custom events from the shadow DOM to update global document state ---
    document.addEventListener('gabeSettings:themeChange', (event) => {
        this.applyThemeToDocument(event.detail);
    });

    document.addEventListener('gabeSettings:translucencyChange', (event) => {
        const isChecked = event.detail;
        this.applyTranslucencyToDocument(isChecked); // Call the new helper
    });

    document.addEventListener('gabeSettings:fontChange', (event) => {
        this.applyFontToDocument(event.detail);
    });
  }

  /**
   * Applies settings saved in localStorage when the component initializes.
   * This is for body-level settings (theme, font, background image).
   * Modal settings are handled by the custom element itself's applyInitialSettings.
   */
  applySavedSettings() {
    // Theme (apply directly to body)
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.applyThemeToDocument(savedTheme);
    } else {
      this.applyThemeToDocument('system'); // Default
    }

    // Font (apply directly to body)
    const savedFont = localStorage.getItem('font');
    if (savedFont) {
      this.applyFontToDocument(savedFont);
    } else {
      this.applyFontToDocument('OneUISans'); // Default
    }

    // Custom Background Image (apply directly to body)
    const savedBackgroundImage = localStorage.getItem('customBackgroundImage');
    if (savedBackgroundImage) {
      document.body.style.backgroundImage = `url('${savedBackgroundImage}')`;
    }

    // Translucency (apply directly to header using new helper)
    const savedTranslucency = localStorage.getItem('translucency');
    if (savedTranslucency !== null) {
      this.applyTranslucencyToDocument(savedTranslucency === 'true');
    } else {
      this.applyTranslucencyToDocument(true); // Default to translucent
    }
  }

  // Helper methods now defined directly on GabeSettings class for document-level changes
  applyThemeToDocument(theme) {
    document.body.classList.remove('light', 'dark');
    if (theme === 'system') {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.add('light');
      }
    } else {
      document.body.classList.add(theme);
    }
  }

  // New helper for translucency
  applyTranslucencyToDocument(isTranslucent) {
    const mainHeader = document.querySelector('.main-header');
    if (mainHeader) {
      if (isTranslucent) {
        mainHeader.classList.add('translucent');
        mainHeader.classList.remove('no-translucency');
      } else {
        mainHeader.classList.remove('translucent');
        mainHeader.classList.add('no-translucency');
      }
    }
  }

  applyFontToDocument(font) {
    document.body.className = document.body.className.split(' ').filter(c => !c.startsWith('font-')).join(' ');
    if (font === 'system') {
      document.body.classList.add('font-system');
    } else if (font === 'OneUISans') {
      document.body.classList.add('font-OneUISans');
    } else if (font === 'Roboto') {
      document.body.classList.add('font-Roboto');
    } else if (font === 'Open Sans') {
      document.body.classList.add('font-Open-Sans');
    }
    // No direct style.fontFamily modification here, rely on CSS classes
  }
}

// Instantiate the main GabeSettings class when the DOM is ready.
// This will handle global injections and custom element registration.
document.addEventListener('DOMContentLoaded', () => {
  new GabeSettings();
});
