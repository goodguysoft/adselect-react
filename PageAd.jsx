import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { SDK_CONFIG } from './constants.js';

// Utility to wait for AdSelect SDK to be loaded
function waitForAdSelectSdk(timeout = 10000, pollInterval = 100) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    function check() {
      if (window.AdSelect && typeof window.AdSelect.renderPageAdIntoElement === 'function') {
        resolve();
      } else if (Date.now() - start > timeout) {
        reject(new Error('AdSelect SDK did not load in time'));
      } else {
        setTimeout(check, pollInterval);
      }
    }
    check();
  });
}

export function PageAd({ type, apiId, apiKey, onError }) {
  const adContainerRef = useRef(null);
  const [adRendered, setAdRendered] = useState(false);

  useEffect(() => {
    // Wait for DOMContentLoaded (website fully loaded)
    function onReady() {
      renderAd();
    }
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      onReady();
    } else {
      window.addEventListener('DOMContentLoaded', onReady, { once: true });
      return () => window.removeEventListener('DOMContentLoaded', onReady);
    }
    // eslint-disable-next-line
  }, [type, apiId, apiKey]);

  async function renderAd() {
    try {
      await waitForAdSelectSdk();
      if (!adContainerRef.current) return;
      // Use the entire document's innerText as the ad context
      const contextText = document.body ? document.body.innerText : '';
      // Optionally, you could pass contextText to AdSelect if supported
      await window.AdSelect.renderPageAdIntoElement(
        apiId,
        apiKey,
        type,
        adContainerRef.current.id
        // contextText // If AdSelect supports a context param, add here
      );
      setAdRendered(true);
    } catch (error) {
      console.error(`${SDK_CONFIG.LOG_PREFIX} PageAd failed:`, error);
      if (onError) onError(error);
    }
  }

  return (
    <div
      ref={adContainerRef}
      id={`page-ad-${type}`}
      style={!adRendered ? { display: 'none' } : undefined}
    >
      {}
    </div>
  );
}

PageAd.propTypes = {
  type: PropTypes.string.isRequired,
  apiId: PropTypes.string.isRequired,
  apiKey: PropTypes.string.isRequired,
  onError: PropTypes.func,
};
