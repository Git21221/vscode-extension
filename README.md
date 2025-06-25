# Smart Output Tracker Pro

A premium VSCode extension that automatically adds and maintains line numbers and file names in your output statements across multiple programming languages.

## 🎬 Demo
[![Watch the demo on YouTube](https://img.shields.io/badge/Watch-Demo-red?logo=youtube)](test.webm)
---

## Features

### 🔢 Automatic Line Tracking
- Automatically adds file name and line number to your output statements
- Example: `console.log("hello")` becomes `console.log("hello - test.js:89")`
- Supports JavaScript, TypeScript, Python, Java, C#, PHP, Go, and Rust

### 🔁 Auto-Update
- Automatically updates line numbers when your code changes
- Real-time tracking keeps your debug info accurate
- Toggle auto-update on/off via **status bar**

### 🚫 Ignore Tracking
- Add `// no tracking` to specific lines to skip tracking
- Add `// no tracking` at the top of a file to skip tracking for the entire file

### 🌐 Multi-Language Support
- **JavaScript/TypeScript**: `console.log`, `console.error`, `process.stdout.write`
- **Python**: `print`, `logging` methods
- **Java**: `System.out.print/println`, `System.err.print/println`
- **C#**: `Console.Write/WriteLine`, `Debug.Write/WriteLine`
- **PHP**: `echo`, `print`, `var_dump`, `print_r`
- **Go**: `fmt.Print/Println/Printf`, `log.Print/Println/Printf`
- **Rust**: `println!`, `print!`, `dbg!`

### ⚙️ Customizable Settings
- Configure whether to include file names and/or line numbers
- Customize the separator between the original message and tracking info
- Enable/disable auto-update functionality

---

## 🖱 Status Bar Integration

A custom logo is now shown in the status bar. Clicking it opens a quick menu with:

- **Update All Line Tracking**
- **Toggle Auto-Update**

This makes it easier to manage your debug tracking from anywhere in your project.

---

## 🧩 Commands

| Command | Description |
|--------|-------------|
| `Ctrl+Alt+t` (Cmd+Alt+t on Mac) | Add Line Tracking |
| `Ctrl+Alt+u` (Cmd+Alt+u on Mac) | Update All Tracking |
| Context Menu | Add Line Tracking / Remove Line Tracking |
| Status Bar Logo | Update All Tracking / Toggle Auto-Update |

---

## 🚀 Installation

1. Install from VSCode Marketplace: [Smart Output Tracker Pro](https://marketplace.visualstudio.com/items?itemName=SaikatDas.output-formatter)
2. Restart VSCode
3. Open any supported file and start using the extension

---

## 💡 Usage

### 🔹 Basic Usage
1. Place cursor on any output statement (`console.log`, `print`, etc.)
2. Right-click and select "Add Line Tracking to Output"
3. Tracking info is added automatically with file and line number

### 🔄 Auto-Update
- Line numbers are kept up-to-date in real time
- You can toggle this feature from the **status bar**

### 🔃 Bulk Operations
- Use "Update All Line Tracking" to refresh all debug lines
- Use "Remove Line Tracking" to clean up tracking data

---

## 🔧 Configuration

You can configure Smart Output Tracker Pro in your VSCode settings:

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