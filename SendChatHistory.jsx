import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { SDK_CONFIG } from './constants.js';

/**
 * SendChatHistory wraps a child component, observes its outer HTML, and notifies on changes.
 * Automatically ensures the adselect.js library is loaded before proceeding.
 *
 * Props:
 * - userId: string
 * - conversationId: string
 * - apiId: string
 * - apiKey: string
 * - onHtmlChange?: function(outerHTML: string)
 * - waitForAdSelect?: boolean (default: true) - whether to wait for adselect.js to load
 * - children: React.ReactNode (single element)
 */
export function SendChatHistory({
  userId,
  conversationId,
  apiId,
  apiKey,
  onHtmlChange,
  waitForAdSelect = SDK_CONFIG.DEFAULT_WAIT_FOR_ADSELECT,
  children,
}) {
  const wrapperRef = useRef(null);
  const [outerHtml, setOuterHtml] = useState("");
  const [isAdSelectReady, setIsAdSelectReady] = useState(false);

  // Load adselect.js if needed
  useEffect(() => {
    if (!waitForAdSelect) {
      setIsAdSelectReady(true);
      return;
    }

    // Dynamic import to avoid circular dependency
    import('./index.js').then(({ loadAdSelectScript }) => {
      loadAdSelectScript()
        .then(() => {
          setIsAdSelectReady(true);
        })
        .catch((error) => {
          console.error('SendChatHistory: Failed to load adselect.js', error);
          // Continue anyway to avoid blocking the component
          setIsAdSelectReady(true);
        });
    });
  }, [waitForAdSelect]);

  useEffect(() => {
    if (!wrapperRef.current || !isAdSelectReady) return;
    
    // Initial outerHTML
    const html = wrapperRef.current.firstElementChild?.outerHTML || "";
    setOuterHtml(html);
    if (onHtmlChange) onHtmlChange(html);

    // Observe changes
    const observer = new MutationObserver(() => {
      const updatedHtml = wrapperRef.current.firstElementChild?.outerHTML || "";
      setOuterHtml(updatedHtml);
      if (onHtmlChange) onHtmlChange(updatedHtml);
    });
    observer.observe(wrapperRef.current, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    });
    return () => observer.disconnect();
  }, [children, onHtmlChange, isAdSelectReady]);

  // You can use outerHtml, userId, conversationId, apiId, apiKey as needed here
  // For now, just render the child
  return (
    <div 
      ref={wrapperRef}
      data-send-chat-history={JSON.stringify({ userId, conversationId, apiId, apiKey })}
    >
      {children}
    </div>
  );
}

SendChatHistory.propTypes = {
  userId: PropTypes.string.isRequired,
  conversationId: PropTypes.string.isRequired,
  apiId: PropTypes.string.isRequired,
  apiKey: PropTypes.string.isRequired,
  onHtmlChange: PropTypes.func,
  waitForAdSelect: PropTypes.bool,
  children: PropTypes.element.isRequired,
};
