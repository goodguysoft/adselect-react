
# VektorOne React SDK

**Full documentation is available on our wiki:**
http://wiki.vektorone.goodguysoft.com/

---

The React SDK by **vektorone.co** provides a set of custom React components for easy integration of contextual ads into React applications. It builds on top of the JavaScript SDK and offers a declarative, JSX-based interface tailored to React workflows.

---

## Installation

```bash
npm install git+https://github.com/goodguysoft/adselect-react.git
```

Import in your component:

```js
import {
  SendChatHistory,
  ChatAd,
  PageAd
} from 'vektorone-sdk';
```

---

## Authentication

All components require:

- `apiId` — Your VektorOne API ID
- `apiKey` — Your secret API key (provided by VektorOne support)

These are mandatory for all SDK operations.

---

## Components

### &lt;SendChatHistory&gt;

Submits a full chat history for context analysis.

**Props:**

- `userId` — Unique identifier for the user
- `conversationId` — Conversation/session ID
- `apiId`, `apiKey` — Your VektorOne API credentials

**Usage:**

```jsx
<SendChatHistory
  userId="user-123"
  conversationId="chat-456"
  apiId="YOUR_API_ID"
  apiKey="YOUR_API_KEY"
>
  <MyCustomChatComponent />
</SendChatHistory>
```

🧠 **Note:** You can use any internal chat component. The SDK automatically extracts message content using AI on the backend — no need to wrap each message manually.

---

### &lt;ChatAd&gt;

Displays an ad based on previously submitted chat history.

**Props:**

- `userId`, `conversationId` — Same as above
- `type` — `"Json"`, `"HtmlTextAd"`, `"HtmlImageAd"`, or `"JavaScript"`
- `callback` — (Optional) JavaScript callback function (only for `JavaScript` type)
- `apiId`, `apiKey` — Required

**Example:**

```jsx
<ChatAd
  userId="user-123"
  conversationId="chat-456"
  type="HtmlImageAd"
  apiId="YOUR_API_ID"
  apiKey="YOUR_API_KEY"
/>
```

---

### &lt;PageAd&gt;

Renders an ad based on the current HTML content of the page.

**Props:**

- `type` — Same as above
- `callback` — (Optional) for `"JavaScript"` type
- `apiId`, `apiKey` — Required

**Usage:**

```jsx
<PageAd
  type="HtmlTextAd"
  apiId="YOUR_API_ID"
  apiKey="YOUR_API_KEY"
/>
```

The SDK will use the full `document.documentElement.outerHTML` as input.

---

## CSS and HTML Markup

The SDK renders HTML with predictable CSS classes that you can override.

**Sample Output:**

```html
<div class="ad-box ad-text">
  <span class="ad-label">Sponsored</span>
  <div class="ad-body">Find the best deals on hiking gear →</div>
</div>
```

**Available CSS Classes:**

| Class        | Description                  |
|--------------|------------------------------|
| `.ad-box`    | Container for ad             |
| `.ad-text`   | Applied to text-only ads     |
| `.ad-image`  | For image-based ads          |
| `.ad-label`  | "Sponsored" label            |
| `.ad-body`   | Main ad message              |
| `.ad-icon`   | For image or icon placement  |

You can override these styles in your own stylesheet or using CSS Modules.

**Example Custom Style:**

```css
.ad-box {
  background: #fdfdfd;
  border-left: 3px solid #00aaff;
  padding: 10px;
}
.ad-label {
  font-size: 0.75rem;
  color: #888;
}
```

---

## Summary of Components

| Component             | Description                            |
|-----------------------|----------------------------------------|
| `<SendChatHistory>`   | Wraps your chat and sends it to backend |
| `<ChatAd>`            | Renders ad for the chat conversation    |
| `<PageAd>`            | Renders ad for the entire page content  |

---

## See Also

- [JavaScript SDK](http://wiki.vektorone.goodguysoft.com/sdks:javascript)
- [GoLang SDK](http://wiki.vektorone.goodguysoft.com/sdks:go)
- [Ad Formats](http://wiki.vektorone.goodguysoft.com/ad_formats)
- [Getting Started](http://wiki.vektorone.goodguysoft.com/getting_started)

---

## License

MIT
