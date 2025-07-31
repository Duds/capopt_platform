# Debugging Guide for CapOpt Platform

This guide explains how to debug your Next.js application using Chrome DevTools on Ubuntu.

## Prerequisites

- Ubuntu 20.04 or later
- Chrome browser installed
- VS Code (recommended)
- Node.js 18+ installed

## Setup Options

### Option 1: VS Code Debugging (Recommended)

1. **Open VS Code** in your project directory
2. **Go to Debug panel**: Press `Ctrl+Shift+D`
3. **Select a configuration** from the dropdown:
   - `Next.js: debug server-side` - Debug backend code
   - `Next.js: debug client-side` - Debug frontend code
   - `Next.js: debug full stack` - Debug both simultaneously
4. **Press F5** or click the green play button

### Option 2: Chrome DevTools Only

#### For Client-side Debugging

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Open Chrome** and navigate to `http://localhost:3000`

3. **Open DevTools**:
   - Press `F12` or `Ctrl+Shift+I`
   - Or right-click and select "Inspect"

4. **Go to Sources tab** in DevTools

5. **Set breakpoints**:
   - Press `Ctrl+P` to search for files
   - Look for files starting with `webpack://_N_E/./`
   - Click on line numbers to set breakpoints

#### For Server-side Debugging

1. **Start the server with debugging enabled**:
   ```bash
   npm run dev:debug
   ```

2. **Look for the debugger message**:
   ```
   Debugger listening on ws://127.0.0.1:9229/...
   ```

3. **Open Chrome** and navigate to `chrome://inspect`

4. **Configure debugging ports**:
   - Click "Configure..."
   - Add `localhost:9229` if not present

5. **Find your app** in the "Remote Target" section

6. **Click "inspect"** to open DevTools for server-side debugging

## Debugging Techniques

### Setting Breakpoints

1. **In VS Code**:
   - Click on line numbers in your code
   - Red dots will appear indicating breakpoints

2. **In Chrome DevTools**:
   - Go to Sources tab
   - Navigate to your source files
   - Click on line numbers to set breakpoints

### Using Debugger Statements

Add `debugger;` statements in your code:

```javascript
function handleSubmit() {
  debugger; // Execution will pause here
  console.log('Form submitted');
  // ... rest of your code
}
```

### Debugging React Components

1. **Install React DevTools** extension in Chrome
2. **Use React DevTools** to inspect component state
3. **Set breakpoints** in component functions

### Debugging API Routes

1. **Set breakpoints** in your API route files
2. **Use the Network tab** in DevTools to inspect requests
3. **Check the Console** for server-side logs

## Common Debugging Scenarios

### Debugging Form Submissions

```javascript
// In your form component
const handleSubmit = async (data) => {
  debugger; // Pause here to inspect form data
  console.log('Form data:', data);
  
  try {
    const response = await fetch('/api/business-canvas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    debugger; // Pause here to inspect response
    const result = await response.json();
    console.log('API response:', result);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Debugging Database Operations

```javascript
// In your API route
export async function POST(request) {
  debugger; // Pause here to inspect request
  const data = await request.json();
  console.log('Received data:', data);
  
  try {
    const result = await prisma.businessCanvas.create({
      data: data
    });
    
    debugger; // Pause here to inspect database result
    console.log('Database result:', result);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

### Debugging State Management

```javascript
// In your React component
const [formData, setFormData] = useState({});

const handleInputChange = (field, value) => {
  debugger; // Pause here to inspect state changes
  console.log('Previous state:', formData);
  console.log('Updating field:', field, 'with value:', value);
  
  setFormData(prev => {
    const newState = { ...prev, [field]: value };
    console.log('New state:', newState);
    return newState;
  });
};
```

## Troubleshooting

### Breakpoints Not Hitting

1. **Check source maps**: Ensure source maps are enabled
2. **Clear browser cache**: Hard refresh with `Ctrl+Shift+R`
3. **Restart dev server**: Stop and restart `npm run dev`

### Can't Find Source Files

1. **Use file search**: Press `Ctrl+P` in DevTools
2. **Look for webpack paths**: Files start with `webpack://_N_E/./`
3. **Check file structure**: Ensure files are in the correct locations

### Server Debugging Not Working

1. **Check port**: Ensure port 9229 is not blocked
2. **Verify NODE_OPTIONS**: Check that `--inspect` flag is set
3. **Restart server**: Stop and restart with debugging enabled

## Advanced Debugging

### Conditional Breakpoints

1. **Right-click** on a breakpoint in DevTools
2. **Select "Edit breakpoint"**
3. **Add a condition**: `data.name === 'test'`

### Logpoints

1. **Right-click** on a breakpoint in DevTools
2. **Select "Add logpoint"**
3. **Enter expression**: `console.log('Form data:', data)`

### Performance Debugging

1. **Use Performance tab** in DevTools
2. **Record performance** during user interactions
3. **Analyze bottlenecks** in the flame chart

## Useful Chrome DevTools Features

### Console Methods

```javascript
// Log with different levels
console.log('Info message');
console.warn('Warning message');
console.error('Error message');

// Group related logs
console.group('Form Submission');
console.log('Step 1: Validation');
console.log('Step 2: API call');
console.groupEnd();

// Table format for objects
console.table(formData);

// Time operations
console.time('API call');
await fetch('/api/data');
console.timeEnd('API call');
```

### Network Tab

- **Filter requests** by type (XHR, JS, CSS, etc.)
- **Inspect request/response** headers and body
- **Throttle network** to test slow connections
- **Block requests** to test error handling

### Application Tab

- **Inspect localStorage/sessionStorage**
- **View cookies**
- **Check service workers**
- **Monitor cache storage**

## Best Practices

1. **Use descriptive console messages**
2. **Remove debugger statements** before production
3. **Use source maps** for better debugging experience
4. **Set up conditional breakpoints** for complex scenarios
5. **Use React DevTools** for component debugging
6. **Monitor performance** during debugging sessions

## Environment-Specific Notes

### Ubuntu Specific

- **Chrome installation**: `sudo apt install google-chrome-stable`
- **File permissions**: Ensure proper read permissions for source files
- **Firewall**: Check if port 9229 is blocked by firewall

### Production Debugging

- **Use source maps** in production builds
- **Enable error tracking** (Sentry, LogRocket, etc.)
- **Monitor performance** with real user data
- **Use feature flags** for debugging in production

## Additional Resources

- [Chrome DevTools Documentation](https://developers.google.com/web/tools/chrome-devtools)
- [Next.js Debugging Guide](https://nextjs.org/docs/advanced-features/debugging)
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Node.js Debugging](https://nodejs.org/en/docs/guides/debugging-getting-started/) 