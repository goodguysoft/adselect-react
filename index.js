/**
 * VektorOne SDK Entry Point
 * Automatically loads the external adselect.js library and exports React components
 */

import { 
  ADSELECT_SCRIPT_URL, 
  SDK_CONFIG, 
  ERROR_MESSAGES 
} from './constants.js';

// Track if the external script has been loaded
let isAdSelectLoaded = false;
let loadingPromise = null;

/**
 * Dynamically loads the external adselect.js library
 * @returns {Promise} Promise that resolves when the script is loaded
 */
function loadAdSelectScript() {
  // Check if AdSelect is already available
  if (typeof window !== 'undefined' && window.AdSelect) {
    isAdSelectLoaded = true;
    return Promise.resolve();
  }

  if (isAdSelectLoaded) {
    return Promise.resolve();
  }

  if (loadingPromise) {
    return loadingPromise;
  }

  loadingPromise = new Promise((resolve, reject) => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      console.warn(`${SDK_CONFIG.LOG_PREFIX} ${ERROR_MESSAGES.BROWSER_ONLY}`);
      resolve();
      return;
    }

    // Check if the script is already loaded by checking for window.AdSelect
    if (window.AdSelect) {
      isAdSelectLoaded = true;
      console.log(`${SDK_CONFIG.LOG_PREFIX} AdSelect already available:`, {
        version: window.AdSelect.version,
        initializedAt: window.AdSelect.initializedAt
      });
      resolve();
      return;
    }

    // Check if the script tag is already in the DOM
    const existingScript = document.querySelector(`script[src="${ADSELECT_SCRIPT_URL}"]`);
    if (existingScript) {
      // Script tag exists but AdSelect might not be ready yet, wait for it
      let attempts = 0;
      const maxAttempts = SDK_CONFIG.SCRIPT_LOAD_TIMEOUT / 100; // 100 attempts for 10 seconds
      
      const checkAdSelect = () => {
        if (window.AdSelect) {
          isAdSelectLoaded = true;
          console.log(`${SDK_CONFIG.LOG_PREFIX} AdSelect loaded:`, {
            version: window.AdSelect.version,
            initializedAt: window.AdSelect.initializedAt
          });
          resolve();
        } else if (attempts >= maxAttempts) {
          console.error(`${SDK_CONFIG.LOG_PREFIX} ${ERROR_MESSAGES.SCRIPT_TIMEOUT}`);
          reject(new Error(ERROR_MESSAGES.SCRIPT_TIMEOUT));
        } else {
          attempts++;
          setTimeout(checkAdSelect, 100); // Check every 100ms
        }
      };
      checkAdSelect();
      return;
    }

    // Create and load the script
    const script = document.createElement('script');
    script.src = ADSELECT_SCRIPT_URL;
    script.async = SDK_CONFIG.SCRIPT_ASYNC;
    
    script.onload = () => {
      // Wait for AdSelect to be available on window
      let attempts = 0;
      const maxAttempts = SDK_CONFIG.SCRIPT_LOAD_TIMEOUT / 50; // 200 attempts for 10 seconds
      
      const checkAdSelect = () => {
        if (window.AdSelect) {
          isAdSelectLoaded = true;
          console.log(`${SDK_CONFIG.LOG_PREFIX} AdSelect loaded successfully:`, {
            version: window.AdSelect.version,
            initializedAt: window.AdSelect.initializedAt
          });
          resolve();
        } else if (attempts >= maxAttempts) {
          console.error(`${SDK_CONFIG.LOG_PREFIX} ${ERROR_MESSAGES.SCRIPT_TIMEOUT}`);
          loadingPromise = null;
          reject(new Error(ERROR_MESSAGES.SCRIPT_TIMEOUT));
        } else {
          attempts++;
          setTimeout(checkAdSelect, 50); // Check every 50ms
        }
      };
      checkAdSelect();
    };
    
    script.onerror = (error) => {
      console.error(`${SDK_CONFIG.LOG_PREFIX} ${ERROR_MESSAGES.SCRIPT_LOAD_FAILED}`, error);
      loadingPromise = null; // Reset so it can be retried
      reject(new Error(ERROR_MESSAGES.SCRIPT_LOAD_FAILED));
    };

    document.head.appendChild(script);
  });

  return loadingPromise;
}

// Auto-load the script when the SDK is imported
if (typeof window !== 'undefined') {
  loadAdSelectScript().catch(error => {
    console.error(`${SDK_CONFIG.LOG_PREFIX} Auto-load of adselect.js failed:`, error);
  });
}

// Export React components
export { SendChatHistory } from './SendChatHistory.jsx';
export { ChatAd } from './ChatAd.jsx';

// Export utility function to manually ensure the script is loaded
export { loadAdSelectScript };


// Export a function to check if the script is loaded
export const isAdSelectScriptLoaded = () => {
  return isAdSelectLoaded && typeof window !== 'undefined' && window.AdSelect;
};

// Export a function to get the AdSelect object with version info
export const getAdSelectInfo = () => {
  if (typeof window !== 'undefined' && window.AdSelect) {
    return {
      available: true,
      version: window.AdSelect.version,
      initializedAt: window.AdSelect.initializedAt,
      object: window.AdSelect
    };
  }
  return {
    available: false,
    version: null,
    initializedAt: null,
    object: null
  };
};

// Export constants for external configuration
export { 
  ADSELECT_SCRIPT_URL, 
  SDK_CONFIG, 
  ERROR_MESSAGES 
} from './constants.js';
