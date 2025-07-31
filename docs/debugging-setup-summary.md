# Debugging Setup Summary

## ✅ Setup Complete

Your CapOpt Platform project is now configured for debugging with Chrome on Ubuntu.

## Quick Start

### 1. VS Code Debugging (Recommended)

```bash
# Open VS Code in project directory
code .

# Press Ctrl+Shift+D to open Debug panel
# Select one of the configurations:
# - "Next.js: debug server-side"
# - "Next.js: debug client-side" 
# - "Next.js: debug full stack"
# Press F5 to start debugging
```

### 2. Chrome DevTools Only

#### Client-side Debugging
```bash
# Start development server
npm run dev

# Open Chrome and navigate to http://localhost:3000
# Press F12 to open DevTools
# Go to Sources tab
# Press Ctrl+P to search for files
# Look for files starting with webpack://_N_E/./
```

#### Server-side Debugging
```bash
# Start server with debugging enabled
npm run dev:debug

# Look for: "Debugger listening on ws://127.0.0.1:9229/..."
# Open Chrome and navigate to chrome://inspect
# Click "inspect" on your Next.js app
```

## Configuration Files Created

### 1. `.vscode/launch.json`
- VS Code debugging configurations
- Supports server-side, client-side, and full-stack debugging
- Configured for Chrome on Ubuntu

### 2. `package.json` Scripts
- Added `"dev:debug": "NODE_OPTIONS='--inspect' next dev"`
- Original `dev` script preserved

### 3. `docs/debugging-guide.md`
- Comprehensive debugging guide
- Step-by-step instructions
- Troubleshooting tips

## Debugging Features Available

### ✅ Breakpoints
- Set breakpoints in VS Code or Chrome DevTools
- Conditional breakpoints supported
- Logpoints for non-intrusive logging

### ✅ Source Maps
- Full source map support
- Original TypeScript/React code visible
- Webpack paths properly mapped

### ✅ React DevTools
- Component state inspection
- Props and state debugging
- Performance profiling

### ✅ Network Debugging
- API request/response inspection
- Network throttling
- Request blocking

### ✅ Console Debugging
- Enhanced console methods
- Object inspection
- Performance timing

## Test Your Setup

1. **Start debugging server**:
   ```bash
   npm run dev:debug
   ```

2. **Verify debugger is listening**:
   ```bash
   ss -tlnp | grep 9229
   # Should show: LISTEN 0 511 127.0.0.1:9229
   ```

3. **Open Chrome DevTools**:
   - Navigate to `chrome://inspect`
   - Look for your Next.js app
   - Click "inspect"

4. **Test breakpoints**:
   - Add `debugger;` statements in your code
   - Or set breakpoints in DevTools Sources tab

## Common Debugging Scenarios

### Debugging Form Submissions
```javascript
const handleSubmit = async (data) => {
  debugger; // Pause here
  console.log('Form data:', data);
  // ... rest of code
};
```

### Debugging API Routes
```javascript
export async function POST(request) {
  debugger; // Pause here
  const data = await request.json();
  console.log('API data:', data);
  // ... rest of code
}
```

### Debugging React State
```javascript
const [state, setState] = useState({});

const updateState = (newData) => {
  debugger; // Pause here
  console.log('Previous state:', state);
  setState(newData);
};
```

## Troubleshooting

### Breakpoints Not Working
- Clear browser cache: `Ctrl+Shift+R`
- Restart dev server
- Check source maps are enabled

### Can't Find Source Files
- Use `Ctrl+P` in DevTools
- Look for `webpack://_N_E/./` paths
- Check file permissions

### Server Debugging Issues
- Verify port 9229 is not blocked
- Check `NODE_OPTIONS='--inspect'` is set
- Restart server with debugging enabled

## Next Steps

1. **Practice debugging** with the test scenarios above
2. **Install React DevTools** Chrome extension
3. **Set up conditional breakpoints** for complex logic
4. **Use performance profiling** for optimization
5. **Configure error tracking** for production debugging

## Resources

- [Chrome DevTools Documentation](https://developers.google.com/web/tools/chrome-devtools)
- [Next.js Debugging Guide](https://nextjs.org/docs/advanced-features/debugging)
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [VS Code Debugging](https://code.visualstudio.com/docs/editor/debugging)

---

**Status**: ✅ Ready for debugging
**Last Updated**: $(date)
**Tested On**: Ubuntu with Chrome 