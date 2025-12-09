# React Native WebView Message Setup

## Problem
React Native WebView's `postMessage()` doesn't directly trigger `window.postMessage()` in the web page. We need to use `injectedJavaScript` to bridge the messages.

## Solution
Update your React Native `WaiverSign` component's WebView to use `injectedJavaScript`:

```typescript
<WebView
  ref={webViewRef}
  originWhitelist={["*"]}
  source={{ uri: "http://192.168.145.45:3000/sign" }}
  allowFileAccess
  javaScriptEnabled={true}
  domStorageEnabled={true}
  onMessage={handleWebViewMessage}
  injectedJavaScript={`
    (function() {
      // Create a message queue
      window.__RN_MESSAGE_QUEUE = window.__RN_MESSAGE_QUEUE || [];
      
      // Override or create a bridge for React Native messages
      // When React Native sends a message, it will be queued here
      window.addEventListener('message', function(event) {
        console.log('Web page received message:', event.data);
      });
      
      // Listen for messages from React Native and dispatch to web page
      window.ReactNativeWebViewReceiveMessage = function(message) {
        const data = typeof message === 'string' ? JSON.parse(message) : message;
        window.__RN_MESSAGE_QUEUE.push(data);
        
        // Also dispatch as a standard message event
        window.dispatchEvent(new MessageEvent('message', {
          data: message
        }));
      };
      
      console.log('React Native WebView bridge initialized');
    })();
    true; // Required for injectedJavaScript
  `}
  onError={(syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.error('WebView error: ', nativeEvent);
  }}
  onHttpError={(syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.error('WebView HTTP error: ', nativeEvent);
  }}
  onLoadEnd={() => {
    console.log('WebView loaded');
  }}
  mixedContentMode="always"
/>
```

## Alternative: Use injectedJavaScriptBeforeContentLoaded

If the above doesn't work, try using `injectedJavaScriptBeforeContentLoaded` instead:

```typescript
injectedJavaScriptBeforeContentLoaded={`
  window.__RN_MESSAGE_QUEUE = [];
  window.ReactNativeWebViewReceiveMessage = function(message) {
    window.__RN_MESSAGE_QUEUE.push(message);
    window.dispatchEvent(new MessageEvent('message', { data: message }));
  };
  true;
`}
```

## Update handleConfirmAndSign

Instead of using `postMessage`, inject JavaScript directly:

```typescript
const handleConfirmAndSign = () => {
  setIsSigning(true);
  // Inject JavaScript to trigger the message in the web page
  webViewRef.current?.injectJavaScript(`
    (function() {
      const message = JSON.stringify({ type: 'TRIGGER_SIGN' });
      window.__RN_MESSAGE_QUEUE.push(message);
      window.dispatchEvent(new MessageEvent('message', { data: message }));
    })();
    true;
  `);
};
```

## Or use the simpler approach with postMessage + injectedJavaScript

Keep your current `postMessage` call, but make sure the injected JavaScript sets up the listener:

```typescript
const handleConfirmAndSign = () => {
  setIsSigning(true);
  webViewRef.current?.postMessage(
    JSON.stringify({
      type: 'TRIGGER_SIGN',
    })
  );
};
```

And in the WebView, use `injectedJavaScript` to forward messages:

```typescript
injectedJavaScript={`
  (function() {
    // This will be called when React Native sends a message
    // The message will be available in onMessage handler
    // We need to forward it to the web page
    window.addEventListener('message', function(e) {
      console.log('Message in web page:', e.data);
    });
  })();
  true;
`}
```

**Note**: The `onMessage` handler in React Native receives messages FROM the web page, not TO it. To send messages TO the web page, you need to use `injectJavaScript` or `injectedJavaScript`.

