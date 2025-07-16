# Klaro Care Chat Web Application

A simple, modern web application that provides the chat functionality from the Klaro Care Flutter app. This standalone web version allows users to interact with the care assistant through a clean, responsive interface.

## Features

- **Real-time Chat Interface**: Clean, modern chat UI with message bubbles
- **Quick Reply Buttons**: Pre-defined response options for faster interaction
- **Loading Indicators**: Visual feedback during message processing
- **Error Handling**: User-friendly error messages and recovery
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Auto-scroll**: Automatically scrolls to the latest message
- **Enter Key Support**: Send messages using the Enter key

## File Structure

```
chat-web-app/
├── index.html          # Main HTML file
├── styles.css          # CSS styling and responsive design
├── script.js           # JavaScript functionality and API communication
└── README.md          # This file
```

## Setup Instructions

### Option 1: Simple Local Server (Recommended)

1. **Navigate to the chat-web-app directory**:
   ```bash
   cd chat-web-app
   ```

2. **Start a local server** (choose one):
   
   **Using Python 3**:
   ```bash
   python -m http.server 8080
   ```
   
   **Using Python 2**:
   ```bash
   python -m SimpleHTTPServer 8080
   ```
   
   **Using Node.js** (if you have `npx`):
   ```bash
   npx serve .
   ```
   
   **Using npm**:
   ```bash
   npm start
   ```

3. **Open your browser** and go to:
   ```
   http://localhost:8080
   ```

### Option 2: Direct File Opening

You can also open the `index.html` file directly in your browser, but some features might be limited due to CORS restrictions when making API calls.

## Configuration

### API Configuration

The application is configured to connect to your backend API. To modify the API settings:

1. **Open `script.js`**
2. **Update the API configuration** in the `ChatApp` constructor:
   ```javascript
   this.baseUrl = 'http://localhost:8000';  // Your API base URL
   this.chatEndpoint = '/api/chat/query';   // Your chat endpoint
   ```

**Note**: Make sure your backend has CORS middleware configured to allow requests from your web app's origin.

### Authentication

If your API requires authentication, uncomment and modify the authorization header in `script.js`:

```javascript
headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token  // Add your auth token
}
```

### Demo Mode

For testing without a backend API, you can enable demo mode:

1. **Open `script.js`**
2. **Uncomment the mock API section** (around line 180):
   ```javascript
   chatApp.sendToAPI = async function(message) {
       try {
           const response = await MockChatAPI.sendMessage(message);
           return response;
       } catch (error) {
           return { error: 'Failed to get response' };
       }
   };
   ```

## Usage

1. **Type your message** in the input field at the bottom
2. **Press Enter** or click the send button to send your message
3. **Click quick reply buttons** for faster responses
4. **Wait for the assistant's response** (loading indicator will show)
5. **Continue the conversation** as needed

## API Requirements

The web app expects your backend API to:

- **Endpoint**: `POST /api/chat/query`
- **Request Body**:
  ```json
  {
    "message": "User's message"
  }
  ```
- **Response Body**:
  ```json
  {
    "answer": "Assistant's response message",
    "quick_reply_options": ["Option 1", "Option 2", "Option 3"]
  }
  ```

## Customization

### Styling

Modify `styles.css` to customize:
- Colors and themes
- Fonts and typography
- Layout and spacing
- Animations and transitions

### Functionality

Modify `script.js` to add:
- Additional message types
- Custom quick reply handling
- Enhanced error handling
- Analytics or logging

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Troubleshooting

### CORS Issues
If you encounter CORS errors when connecting to your API:
1. Ensure your backend allows requests from your web app's origin
2. Configure CORS headers on your backend
3. Use a proxy server if needed

### API Connection Issues
1. Verify your API is running and accessible
2. Check the API URL configuration in `script.js`
3. Ensure your API endpoint matches the expected format

### Styling Issues
1. Clear your browser cache
2. Check browser console for CSS errors
3. Verify all CSS files are loading correctly

## Development

To modify the application:

1. **Edit HTML structure** in `index.html`
2. **Update styles** in `styles.css`
3. **Modify functionality** in `script.js`
4. **Test changes** by refreshing your browser

## Deployment

To deploy this web application:

1. **Upload all files** to your web server
2. **Configure your API** to be accessible from the web server's domain
3. **Update API URLs** in `script.js` to point to your production API
4. **Test thoroughly** in your production environment

## License

This project is part of the Klaro Care application suite. 