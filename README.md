# Smart Output Tracker Pro

A premium VSCode extension that automatically adds and maintains line numbers and file names in your output statements across multiple programming languages.

## Features

### 🎯 Automatic Line Tracking
- Automatically adds file name and line number to your output statements
- Example: `console.log("hello")` becomes `console.log("hello - test.js:89")`
- Supports JavaScript, TypeScript, Python, Java, C#, PHP, Go, and Rust

### 🔄 Auto-Update
- Automatically updates line numbers when your code changes
- Real-time tracking keeps your debug info accurate
- Toggle auto-update on/off as needed

### 🌍 Multi-Language Support
- **JavaScript/TypeScript**: `console.log`, `console.error`, `process.stdout.write`
- **Python**: `print`, `logging` methods
- **Java**: `System.out.print/println`, `System.err.print/println`
- **C#**: `Console.Write/WriteLine`, `Debug.Write/WriteLine`
- **PHP**: `echo`, `print`, `var_dump`, `print_r`
- **Go**: `fmt.Print/Println/Printf`, `log.Print/Println/Printf`
- **Rust**: `println!`, `print!`, `dbg!`

### ⚙️ Customizable Settings
- Configure whether to include file names and/or line numbers
- Customize the separator between original message and tracking info
- Enable/disable auto-update functionality

## Commands

- **Add Line Tracking**: `Ctrl+Alt+t` (Cmd+Alt+t on Mac)
- **Update All Tracking**: `Ctrl+Alt+u` (Cmd+Alt+u on Mac)
- **Remove Line Tracking**: Available in context menu
- **Toggle Auto-Update**: Available in command palette

## Installation

1. Install from VSCode Marketplace [Smart Output Tracker Pro](https://marketplace.visualstudio.com/items?itemName=SaikatDas.output-formatter)
2. Restart VSCode
3. Open any supported file and start using the extension

## Usage

### Basic Usage
1. Place cursor on any output statement (console.log, print, etc.)
2. Right-click and select "Add Line Tracking to Output"
3. The extension will automatically add the current file name and line number

### Auto-Update
- The extension automatically updates line numbers when you modify your code
- Lines are re-numbered in real-time to maintain accuracy

### Bulk Operations
- Use "Update All Line Tracking" to refresh all tracking info in the current file
- Use "Remove Line Tracking" to clean up all tracking information

## Configuration

Access settings via `File > Preferences > Settings` and search for "Smart Output Tracker":

```json
{
  "smartOutputTracker.autoUpdate": true,
  "smartOutputTracker.includeFileName": true,
  "smartOutputTracker.includeLineNumber": true,
  "smartOutputTracker.separator": " - "
}
```

## Examples

### Before
```javascript
console.log("User logged in");
console.error("Connection failed");
```

### After
```javascript
console.log("User logged in - auth.js:45");
console.error("Connection failed - database.js:12");
```

### Python Example
```python
print("Processing data -  data_processor.py:78")
logging.info("Task completed - task_manager.py:156")
```

## Premium Features

This is a premium extension with advanced features:
- Multi-language support
- Real-time auto-update
- Bulk operations
- Customizable formatting
- Professional support

## Support

For support, feature requests, or bug reports, please contact our support team.

## License

This extension is licensed under a commercial license. Please see the license agreement for full terms.

---

**Smart Output Tracker Pro** - Never lose track of your debug statements again!