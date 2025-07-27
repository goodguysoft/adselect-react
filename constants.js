/**
 * VektorOne SDK Constants
 * Centralized configuration for the SDK
 */

// External script URLs
export const ADSELECT_SCRIPT_URL = 'http://147.93.43.199/js/adselect.js';

// SDK configuration
export const SDK_CONFIG = {
  // Default settings for components
  DEFAULT_WAIT_FOR_ADSELECT: true,
  
  // Console logging prefixes
  LOG_PREFIX: 'VektorOne SDK:',
  
  // Script loading configuration
  SCRIPT_LOAD_TIMEOUT: 10000, // 10 seconds timeout for script loading
  SCRIPT_ASYNC: true,
};

// Error messages
export const ERROR_MESSAGES = {
  SCRIPT_LOAD_FAILED: 'Failed to load adselect.js',
  BROWSER_ONLY: 'adselect.js can only be loaded in browser environment',
  SCRIPT_TIMEOUT: 'Script loading timed out',
};



// Ad type constants (HTML formats only, 'Html' removed from constant names)
export const AdTypeText = "HtmlTextAd";
export const AdTypeImage = "HtmlImageAd";
export const AdTypeBannerMediumRect = "AdTypeBannerMediumRectHtml";
export const AdTypeBannerLeaderboard = "AdTypeBannerLeaderboardHtml";
export const AdTypeBannerWideSky = "AdTypeBannerWideSkyHtml";
