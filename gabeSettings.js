class GabeSettings {
  constructor() {
    this.init();
  }

  init() {
    // Inject Material Web Components imports and fonts first, as they are global dependencies
    this.injectMaterialDependencies();
    this.injectStyles(); // Inject custom styles
    this.injectHTML(); // Inject header, footer, modal
    this.setupEventListeners();
    this.applySavedSettings();
  }

  injectMaterialDependencies() {
    // Inject Material Icons and Symbols font links
    if (!document.querySelector('link[href*="Material+Icons+Round"]')) {
      const materialIconsLink = document.createElement('link');
      materialIconsLink.href = "https://fonts.googleapis.com/icon?family=Material+Icons+Round";
      materialIconsLink.rel = "stylesheet";
      document.head.appendChild(materialIconsLink);
    }

    if (!document.querySelector('link[href*="Material+Symbols+Rounded"]')) {
      const materialSymbolsLink = document.createElement('link');
      materialSymbolsLink.href = "https://fonts.googleapis.com/icon?family=Material+Symbols+Rounded";
      materialSymbolsLink.rel = "stylesheet";
      document.head.appendChild(materialSymbolsLink);
    }

    // Inject Material Web Components script
    // We only need to do this once.
    if (!document.querySelector('script[src*="@material/web/all.js"]')) {
      const materialScript = document.createElement('script');
      materialScript.type = "module";
      materialScript.textContent = `
        import '@material/web/all.js';
        import { styles as typescaleStyles } from '@material/web/typography/md-typescale-styles.js';

        // Wait for adoptedStyleSheets to be available
        if (document.adoptedStyleSheets) {
          document.adoptedStyleSheets.push(typescaleStyles.styleSheet);
        } else {
          // Fallback for browsers that don't support adoptedStyleSheets
          const styleEl = document.createElement('style');
          styleEl.textContent = typescaleStyles.cssText;
          document.head.appendChild(styleEl);
        }
      `;
      document.head.appendChild(materialScript);
    }

    // Add importmap if not present
    if (!document.querySelector('script[type="importmap"]')) {
      const importMapScript = document.createElement('script');
      importMapScript.type = "importmap";
      importMapScript.textContent = `{ "imports": { "@material/web/": "https://esm.run/@material/web/" } }`;
      document.head.appendChild(importMapScript);
    }
  }

  injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      :root {
        --bg-light: #fafafa;
        --bg-dark: #121212;
        --text-light: #111;
        --text-dark: #eee;
        --header-bg-light: rgba(250, 250, 250, 0.0);
        --header-bg-dark: rgba(18, 18, 18, 0.7);
        --solid-bg: #ffffff;
        --accent: #e0a100;
        --red-accent: #b22222;
        --transparent-button: rgba(255, 255, 255, 0);
        --transition: 0.25s ease-in-out;
        --card-light: #ffffff;
        --card-dark: #121212;
        --search-overlay-light: rgba(255, 255, 255, 0.3);
        --search-overlay-dark: rgba(0, 0, 0, 0.3);
        --text: var(--text-light);
        --md-icon-font: Material Symbols Rounded;
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

      @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&family=Roboto:wght@400;700&display=swap');

      body.font-system {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
      }

      @font-face {
        font-family: "OneUISans";
        src: url("https://gabemods.github.io/fonts/OneUISans-Regular.ttf") format("truetype");
        font-weight: 400;
        font-style: normal;
      }

      body {
        font-family: 'OneUISans', sans-serif;
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
        font-size: 30px;
      }

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

      /* Styles for the modal and backdrop */
      .backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 999;
        opacity: 1;
        visibility: visible;
        transition: opacity 0.3s ease, visibility 0.3s ease;
      }

      .backdrop.hidden {
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
      }

      .settings-dialog {
        background-color: var(--card-light);
        color: var(--text-light);
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        max-width: 400px;
        width: 90%;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(1);
        z-index: 1000;
        opacity: 1;
        visibility: visible;
        transition: transform 0.3s ease, opacity 0.3s ease, visibility 0.3s ease;
      }

      body.dark .settings-dialog {
        background-color: var(--card-dark);
        color: var(--text-dark);
      }

      .settings-dialog:not([open]) {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.95);
        visibility: hidden;
        pointer-events: none;
      }

      .settings-dialog h2 {
        margin-top: 0;
        color: var(--text);
      }

      .settings-dialog label {
        display: block;
        margin-bottom: 8px;
        color: var(--text);
      }

      .settings-dialog select,
      .settings-dialog input[type="text"] {
        width: 100%;
        padding: 10px;
        margin-bottom: 16px;
        border: 1px solid #ccc;
        border-radius: 4px;
        background-color: var(--solid-bg);
        color: var(--text);
      }

      .settings-dialog select {
        appearance: none;
        -webkit-appearance: none;
        background-image: url('data:image/svg+xml;utf8,<svg fill="%23111" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>');
        background-repeat: no-repeat;
        background-position: right 8px center;
        background-size: 24px;
      }

      body.dark .settings-dialog select {
        background-image: url('data:image/svg+xml;utf8,<svg fill="%23eee" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>');
      }

      .setting-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }

      .toggle-setting {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
      }

      .setting-label {
        color: var(--text);
      }

      .switch {
        position: relative;
        display: inline-block;
        width: 40px;
        height: 20px;
      }

      .switch input {
        opacity: 0;
        width: 0;
        height: 0;
      }

      .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: .4s;
        border-radius: 20px;
      }

      .slider:before {
        position: absolute;
        content: "";
        height: 16px;
        width: 16px;
        left: 2px;
        bottom: 2px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
      }

      input:checked + .slider {
        background-color: var(--accent);
      }

      input:checked + .slider:before {
        transform: translateX(20px);
      }

      .modal-actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        margin-top: 20px;
      }

      .modal-actions button {
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: background-color 0.2s ease;
      }

      .close-button {
        background-color: var(--accent);
        color: white;
      }

      .close-button:hover {
        background-color: #c78f00;
      }

      .reset-button {
        background-color: var(--red-accent);
        color: white;
      }

      .reset-button:hover {
        background-color: #8b0000;
      }

      .image-picker-button {
        background-color: var(--solid-bg);
        color: var(--text);
        border: 1px solid var(--text);
        padding: 8px 12px;
        border-radius: 4px;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 5px;
        transition: background-color 0.2s ease, color 0.2s ease;
      }

      .image-picker-button:hover {
        background-color: var(--text);
        color: var(--solid-bg);
      }

      .image-picker-button md-icon {
        --md-icon-size: 20px;
      }

      .background-image-controls {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 16px;
      }

      .background-status {
        font-size: 0.9em;
        color: var(--text);
      }
    `;
    document.head.appendChild(style);
  }

  injectHTML() {
    const headerAndModalHTML = `
      <header class="main-header translucent">
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
      <div id="backdrop" class="backdrop hidden"></div>
      <dialog id="settings-modal" class="settings-dialog">
        <div class="modal-content">
          <h2>Settings</h2>
          <label for="theme-select">Theme</label>
          <select id="theme-select">
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
          <div class="setting-row">
            <div class="toggle-setting">
              <span class="setting-label">Translucency</span>
              <label class="switch">
                <input type="checkbox" id="translucency-toggle">
                <span class="slider"></span>
              </label>
            </div>
          </div>
          <div class="setting-row">
            <label for="font-select">Font</label>
            <select id="font-select">
              <option value="system">System Default</option>
              <option value="OneUISans">OneUISans</option>
              <option value="Roboto">Roboto</option>
              <option value="Open Sans">Open Sans</option>
            </select>
          </div>
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
      <div id="content-fade-overlay"></div>
    `;
    // Insert the HTML at the top of the body
    document.body.insertAdjacentHTML('afterbegin', headerAndModalHTML);
  }

  setupEventListeners() {
    // It's important to get references to elements *after* they've been injected into the DOM.
    const settingsButton = document.getElementById('settings-button');
    const settingsModal = document.getElementById('settings-modal');
    const closeModalButton = document.getElementById('close-settings');
    const backdrop = document.getElementById('backdrop');
    const themeSelect = document.getElementById('theme-select');
    const translucencyToggle = document.getElementById('translucency-toggle');
    const fontSelect = document.getElementById('font-select');
    const chooseBackgroundButton = document.getElementById('choose-background-button');
    const clearBackgroundButton = document.getElementById('clear-background-button');
    const imageUploadInput = document.getElementById('image-upload-input');
    const currentBackgroundStatus = document.getElementById('current-background-status');
    const resetButton = document.getElementById('reset-settings-button');
    const mainHeader = document.querySelector('.main-header');

    // --- Modal Open/Close Logic ---
    if (settingsButton) {
      settingsButton.addEventListener('click', () => {
        if (settingsModal) {
          settingsModal.showModal();
          backdrop.classList.remove('hidden');
        }
      });
    }

    if (closeModalButton) {
      closeModalButton.addEventListener('click', () => {
        if (settingsModal) {
          settingsModal.close();
          backdrop.classList.add('hidden');
        }
      });
    }

    if (backdrop) {
      backdrop.addEventListener('click', () => {
        if (settingsModal) {
          settingsModal.close();
          backdrop.classList.add('hidden');
        }
      });
    }

    if (settingsModal) {
      settingsModal.addEventListener('cancel', (event) => {
        event.preventDefault();
        settingsModal.close();
        backdrop.classList.add('hidden');
      });
    }

    // --- Theme Selection ---
    if (themeSelect) {
      themeSelect.addEventListener('change', (event) => {
        const selectedTheme = event.target.value;
        this.applyTheme(selectedTheme);
        localStorage.setItem('theme', selectedTheme);
      });
    }

    // --- Translucency Toggle ---
    if (translucencyToggle && mainHeader) {
      translucencyToggle.addEventListener('change', (event) => {
        const isChecked = event.target.checked;
        if (isChecked) {
          mainHeader.classList.remove('no-translucency');
        } else {
          mainHeader.classList.add('no-translucency');
        }
        localStorage.setItem('translucency', isChecked);
      });
    }

    // --- Font Selection ---
    if (fontSelect) {
      fontSelect.addEventListener('change', (event) => {
        const selectedFont = event.target.value;
        this.applyFont(selectedFont);
        localStorage.setItem('font', selectedFont);
      });
    }

    // --- Background Image Selection ---
    if (chooseBackgroundButton && imageUploadInput) {
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
            if (currentBackgroundStatus) {
              currentBackgroundStatus.textContent = file.name;
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }

    if (clearBackgroundButton) {
      clearBackgroundButton.addEventListener('click', () => {
        document.body.style.backgroundImage = 'none';
        localStorage.removeItem('customBackgroundImage');
        if (currentBackgroundStatus) {
          currentBackgroundStatus.textContent = 'None selected';
        }
      });
    }

    // --- Reset Settings ---
    if (resetButton) {
      resetButton.addEventListener('click', () => {
        localStorage.clear();
        window.location.reload();
      });
    }

    // --- Header Scroll Effect ---
    if (mainHeader) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 0) {
          mainHeader.classList.add('scrolled');
        } else {
          mainHeader.classList.remove('scrolled');
        }
      });
    }

    // --- Set Current Year in Footer ---
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
      currentYearSpan.textContent = new Date().getFullYear();
    }
  }

  applyTheme(theme) {
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

  applyFont(font) {
    // Remove all font-related classes first
    document.body.className = document.body.className.split(' ').filter(c => !c.startsWith('font-')).join(' ');
    // Apply the selected font class
    if (font === 'system') {
      document.body.classList.add('font-system');
    } else if (font === 'OneUISans') {
      document.body.classList.add('font-OneUISans');
    } else if (font === 'Roboto') {
      document.body.classList.add('font-Roboto');
    } else if (font === 'Open Sans') {
      document.body.classList.add('font-Open-Sans');
    }
    // Clear any inline font-family styles if they exist
    document.body.style.fontFamily = '';
  }

  applySavedSettings() {
    // Theme
    const savedTheme = localStorage.getItem('theme');
    const themeSelect = document.getElementById('theme-select');
    if (savedTheme && themeSelect) {
      themeSelect.value = savedTheme;
      this.applyTheme(savedTheme);
    } else if (themeSelect) {
      // Default to system if no theme saved
      themeSelect.value = 'system';
      this.applyTheme('system');
    }

    // Translucency
    const savedTranslucency = localStorage.getItem('translucency');
    const translucencyToggle = document.getElementById('translucency-toggle');
    const mainHeader = document.querySelector('.main-header');
    if (translucencyToggle && mainHeader) {
      if (savedTranslucency !== null) {
        const isTranslucent = savedTranslucency === 'true';
        translucencyToggle.checked = isTranslucent;
        if (isTranslucent) {
          mainHeader.classList.remove('no-translucency');
        } else {
          mainHeader.classList.add('no-translucency');
        }
      } else {
        // Default to translucent if no setting saved
        translucencyToggle.checked = true;
        mainHeader.classList.remove('no-translucency');
      }
    }

    // Font
    const savedFont = localStorage.getItem('font');
    const fontSelect = document.getElementById('font-select');
    if (savedFont && fontSelect) {
      fontSelect.value = savedFont;
      this.applyFont(savedFont);
    } else if (fontSelect) {
      fontSelect.value = 'OneUISans'; // Default font
      this.applyFont('OneUISans');
    }

    // Custom Background Image
    const savedBackgroundImage = localStorage.getItem('customBackgroundImage');
    const currentBackgroundStatus = document.getElementById('current-background-status');
    if (savedBackgroundImage) {
      document.body.style.backgroundImage = `url('${savedBackgroundImage}')`;
      if (currentBackgroundStatus) {
        currentBackgroundStatus.textContent = 'Custom image applied';
      }
    }
  }
}

// Export the class so it can be imported by other modules
export default GabeSettings;
