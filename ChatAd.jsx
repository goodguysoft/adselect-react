import React, { useEffect, useState, useRef } from "react";
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
import PropTypes from "prop-types";
import { 
  SDK_CONFIG,
  AdTypeText,
  AdTypeImage,
  AdTypeBannerMediumRect,
  AdTypeBannerLeaderboard,
  AdTypeBannerWideSky
} from './constants.js';

/**
 * ChatAd component that finds a matching SendChatHistory component and generates ads based on its content.
 * 
 * Props:
 * - userId: string
 * - conversationId: string
 * - type: string (e.g., "HtmlImageAd")
 * - apiId: string
 * - apiKey: string
 * - onAdGenerated?: function(adContent: any)
 * - onError?: function(error: Error)
 */

const ALLOWED_AD_TYPES = [
  AdTypeText,
  AdTypeImage,
  AdTypeBannerMediumRect,
  AdTypeBannerLeaderboard,
  AdTypeBannerWideSky
];

export function ChatAd({
  userId,
  conversationId,
  type,
  apiId,
  apiKey,
  onError,
}) {
  const adContainerRef = useRef(null);
  // Runtime check for allowed ad types
  if (!ALLOWED_AD_TYPES.includes(type)) {
    throw new Error(
      `${SDK_CONFIG.LOG_PREFIX} Invalid ad type: '${type}'. Allowed types: ${ALLOWED_AD_TYPES.join(', ')}`
    );
  }
  const [adContent, setAdContent] = useState(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [targetSendChatHistory, setTargetSendChatHistory] = useState(null);
  const observerRef = useRef(null);
  const searchIntervalRef = useRef(null);

  /**
   * Stub function for generating ads - replace with actual implementation
   * @param {string} htmlContent - The HTML content from SendChatHistory
   * @param {string} adType - The type of ad to generate
   * @returns {Promise<any>} Generated ad content
   */
  const generateAd = async (htmlContent, adType) => {
    console.log(`${SDK_CONFIG.LOG_PREFIX} Generating ${adType} ad for content:`, htmlContent.substring(0, 100) + '...');
    await waitForAdSelectSdk();
    if (!window.AdSelect || typeof window.AdSelect.getPageAd !== 'function') {
      throw new Error('AdSelect SDK is not loaded or getPageAd is unavailable');
    }
    if (!adContainerRef.current) return;
    // Use getPageAd and render the result into the ad container
    window.AdSelect.getPageAd(
      apiId,
      apiKey,
      htmlContent,
      adType,
      function(adHtml) {
        if (adContainerRef.current) {
          adContainerRef.current.innerHTML = adHtml;
        }
      }
    );
  };

  /**
   * Finds a SendChatHistory component with matching props
   */
  const findMatchingSendChatHistory = () => {
    // Look for all SendChatHistory wrapper divs
    const allWrappers = document.querySelectorAll('[data-send-chat-history]');
    
    for (const wrapper of allWrappers) {
      const props = JSON.parse(wrapper.getAttribute('data-send-chat-history') || '{}');
      
      if (
        props.userId === userId &&
        props.conversationId === conversationId &&
        props.apiId === apiId &&
        props.apiKey === apiKey
      ) {
        return wrapper;
      }
    }
    
    return null;
  };

  /**
   * Starts monitoring the target SendChatHistory component
   */
  const startMonitoring = async (targetElement) => {
    if (!targetElement || isMonitoring) return;

    console.log(`${SDK_CONFIG.LOG_PREFIX} Waiting for AdSelect SDK before monitoring SendChatHistory for ChatAd`);
    try {
      await waitForAdSelectSdk();
    } catch (error) {
      console.error(`${SDK_CONFIG.LOG_PREFIX} AdSelect SDK did not load:`, error);
      if (onError) onError(error);
      return;
    }

    console.log(`${SDK_CONFIG.LOG_PREFIX} Starting to monitor SendChatHistory for ChatAd`);

    // Use the innerHTML of the SendChatHistory wrapper itself
    const initialHtml = targetElement.innerHTML || '';
    if (initialHtml.trim()) {
      generateAd(initialHtml, type)
        .catch((error) => {
          console.error(`${SDK_CONFIG.LOG_PREFIX} Failed to generate initial ad:`, error);
          if (onError) onError(error);
        });
    }

    // Set up MutationObserver to watch for changes
    observerRef.current = new MutationObserver((mutations) => {
      const currentHtml = targetElement.innerHTML || '';

      // Debounce rapid changes
      clearTimeout(observerRef.current.debounceTimer);
      observerRef.current.debounceTimer = setTimeout(() => {
        generateAd(currentHtml, type)
          .catch((error) => {
            console.error(`${SDK_CONFIG.LOG_PREFIX} Failed to generate ad on change:`, error);
            if (onError) onError(error);
          });
      }, 300); // 300ms debounce
    });

    observerRef.current.observe(targetElement, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    });

    setIsMonitoring(true);
  };

  /**
   * Stops monitoring
   */
  const stopMonitoring = () => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      clearTimeout(observerRef.current.debounceTimer);
      observerRef.current = null;
    }
    setIsMonitoring(false);
  };

  // Search for matching SendChatHistory component on mount and periodically
  useEffect(() => {
    const searchForTarget = () => {
      if (targetSendChatHistory) return; // Already found

      const found = findMatchingSendChatHistory();
      if (found) {
        console.log(`${SDK_CONFIG.LOG_PREFIX} Found matching SendChatHistory for ChatAd`);
        setTargetSendChatHistory(found);
        clearInterval(searchIntervalRef.current);
      }
    };

    // Initial search
    searchForTarget();

    // Keep searching every 1 second until found
    searchIntervalRef.current = setInterval(searchForTarget, 1000);

    return () => {
      if (searchIntervalRef.current) {
        clearInterval(searchIntervalRef.current);
      }
    };
  }, [userId, conversationId, apiId, apiKey, targetSendChatHistory]);

  // Start monitoring when target is found
  useEffect(() => {
    if (targetSendChatHistory && !isMonitoring) {
      startMonitoring(targetSendChatHistory);
    }

    return () => {
      stopMonitoring();
    };
  }, [targetSendChatHistory, type]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMonitoring();
      if (searchIntervalRef.current) {
        clearInterval(searchIntervalRef.current);
      }
    };
  }, []);

  // Render the ad content
  if (!targetSendChatHistory) {
    return null;
  }

  return (
    <div
      ref={adContainerRef}
      id={`chat-ad-${userId}-${conversationId}-${type}`}
    >
      {/* Ad will be rendered here by AdSelect SDK */}
    </div>
  );
}

ChatAd.propTypes = {
  userId: PropTypes.string.isRequired,
  conversationId: PropTypes.string.isRequired,
  type: PropTypes.oneOf(ALLOWED_AD_TYPES).isRequired,
  apiId: PropTypes.string.isRequired,
  apiKey: PropTypes.string.isRequired,
  onError: PropTypes.func,
};
