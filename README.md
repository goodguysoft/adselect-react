# VektorOne SDK

> A React SDK for seamless ad integration and chat history tracking, with automatic loading of the AdSelect external library.

---

## Features

- **Automatic AdSelect Script Loading**: Loads the AdSelect SDK (`adselect.js`) automatically when you import the SDK—no manual script tags needed.
- **Chat History Tracking**: Easily wrap chat UIs to monitor and extract chat content for ad targeting.
- **Dynamic Ad Rendering**: Render context-aware ads next to chat or anywhere on the page.
- **SSR/Browser Safety**: Works in modern browsers and handles server-side rendering gracefully.

---

## Installation

```bash
npm install vektorone-sdk
```

---

## Usage

### 1. Basic Chat Integration

```jsx
import React from 'react';
import { SendChatHistory, ChatAd } from 'vektorone-sdk';

function App() {
  return (
    <div>
      <SendChatHistory
        userId="user-123"
        conversationId="conversation-456"
        apiId="your-api-id"
        apiKey="your-api-key"
      >
        <YourChatComponent />
      </SendChatHistory>

      {/* Render an ad based on the chat above */}
      <ChatAd
        userId="user-123"
        conversationId="conversation-456"
        type="HtmlImageAd"
        apiId="your-api-id"
        apiKey="your-api-key"
      />
    </div>
  );
}
```

### 2. Render All Ad Types

```jsx
import {
  AdTypeText,
  AdTypeImage,
  AdTypeBannerMediumRect,
  AdTypeBannerLeaderboard,
  AdTypeBannerWideSky
} from 'vektorone-sdk/constants';

<ChatAd type={AdTypeText} ... />
<ChatAd type={AdTypeImage} ... />
<ChatAd type={AdTypeBannerMediumRect} ... />
<ChatAd type={AdTypeBannerLeaderboard} ... />
<ChatAd type={AdTypeBannerWideSky} ... />
```

### 3. Page-Level Ad Example

```jsx
import { PageAd } from 'vektorone-sdk';

<PageAd
  type="HtmlTextAd"
  apiId="your-api-id"
  apiKey="your-api-key"
/>  // Renders an ad after the page is fully loaded, using the whole page's text as context
```

---

## API Reference

### Components

#### SendChatHistory
- **userId** (string, required)
- **conversationId** (string, required)
- **apiId** (string, required)
- **apiKey** (string, required)
- **onHtmlChange** (function, optional): Called when chat HTML changes
- **waitForAdSelect** (boolean, optional, default: true): Wait for AdSelect before tracking
- **children** (React element, required): The chat UI to wrap

#### ChatAd
- **userId, conversationId, apiId, apiKey**: Must match a `SendChatHistory` instance
- **type** (string, required): One of the exported ad type constants
- **onError** (function, optional): Called on ad generation error

#### PageAd
- **type** (string, required): Ad type (e.g., "HtmlTextAd")
- **apiId, apiKey** (string, required)
- **onError** (function, optional)
- Renders an ad after the page is fully loaded, using the entire document's text as context

### Constants

- `AdTypeText`, `AdTypeImage`, `AdTypeBannerMediumRect`, `AdTypeBannerLeaderboard`, `AdTypeBannerWideSky`
- `ADSELECT_SCRIPT_URL`: The AdSelect script URL
- `SDK_CONFIG`: SDK configuration object

### Utility Functions

- `loadAdSelectScript()`: Promise that resolves when AdSelect is loaded
- `isAdSelectScriptLoaded()`: Boolean, true if AdSelect is loaded
- `getAdSelectInfo()`: Returns `{ available, version, initializedAt, object }`

---

## How It Works

1. When you import the SDK, it injects the AdSelect script if not already present.
2. `SendChatHistory` wraps your chat UI and exposes its HTML for ad targeting.
3. `ChatAd` finds the matching chat, monitors it, and renders an ad using AdSelect.
4. `PageAd` renders an ad using the entire page's text as context, after the page is loaded.

---

## Development & Testing

Clone the repo and run the demo app:

```bash
git clone https://github.com/your-username/vektorone-sdk.git
cd vektorone-sdk
npm install
cd ../demo-app
npm install
npm run dev
```

---

## License

MIT
