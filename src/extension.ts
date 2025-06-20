import * as vscode from 'vscode';
import * as path from 'path';

interface LanguageConfig {
  outputPatterns: RegExp[];
  commentStyle: string;
  fileExtensions: string[];
}

const languageConfigs: { [key: string]: LanguageConfig } = {
  javascript: {
    outputPatterns: [
      /console\.(log|error|warn|info|debug)\s*\(/,
      /process\.stdout\.write\s*\(/
    ],
    commentStyle: '//',
    fileExtensions: ['.js', '.jsx', '.mjs']
  },
  typescript: {
    outputPatterns: [
      /console\.(log|error|warn|info|debug)\s*\(/,
      /process\.stdout\.write\s*\(/
    ],
    commentStyle: '//',
    fileExtensions: ['.ts', '.tsx']
  },
  python: {
    outputPatterns: [
      /print\s*\(/g,
      /logging\.(debug|info|warning|error|critical)\s*\(/
    ],
    commentStyle: '#',
    fileExtensions: ['.py', '.pyw']
  },
  java: {
    outputPatterns: [
      /System\.out\.(print|println)\s*\(/,
      /System\.err\.(print|println)\s*\(/
    ],
    commentStyle: '//',
    fileExtensions: ['.java']
  },
  csharp: {
    outputPatterns: [
      /Console\.(Write|WriteLine)\s*\(/,
      /Debug\.(Write|WriteLine)\s*\(/
    ],
    commentStyle: '//',
    fileExtensions: ['.cs']
  },
  php: {
    outputPatterns: [
      /echo\s+/,
      /print\s+/,
      /var_dump\s*\(/,
      /print_r\s*\(/
    ],
    commentStyle: '//',
    fileExtensions: ['.php']
  },
  go: {
    outputPatterns: [
      /fmt\.(Print|Println|Printf)\s*\(/,
      /log\.(Print|Println|Printf)\s*\(/
    ],
    commentStyle: '//',
    fileExtensions: ['.go']
  },
  rust: {
    outputPatterns: [
      /println!\s*\(/,
      /print!\s*\(/,
      /dbg!\s*\(/
    ],
    commentStyle: '//',
    fileExtensions: ['.rs']
  }
};

export function activate(context: vscode.ExtensionContext) {
  let isAutoUpdateEnabled = true;
  let documentChangeListener: vscode.Disposable | undefined;

  // Register commands
  const addTrackingCommand = vscode.commands.registerCommand('smartOutputTracker.addTracking', () => {
    addLineTracking();
  });

  const updateAllTrackingCommand = vscode.commands.registerCommand('smartOutputTracker.updateAllTracking', () => {
    updateAllLineTracking();
  });

  const removeTrackingCommand = vscode.commands.registerCommand('smartOutputTracker.removeTracking', () => {
    removeLineTracking();
  });

  const toggleAutoUpdateCommand = vscode.commands.registerCommand('smartOutputTracker.toggleAutoUpdate', () => {
    toggleAutoUpdate();
  });

  // Set up auto-update listener
  setupAutoUpdate();

  context.subscriptions.push(
    addTrackingCommand,
    updateAllTrackingCommand,
    removeTrackingCommand,
    toggleAutoUpdateCommand,
    vscode.workspace.onDidRenameFiles(handleFileRename)
  );

  function setupAutoUpdate() {
    if (documentChangeListener) {
      documentChangeListener.dispose();
    }

    if (isAutoUpdateEnabled) {
      documentChangeListener = vscode.workspace.onDidChangeTextDocument((event) => {
        if (event.document === vscode.window.activeTextEditor?.document) {
          // Debounce updates to avoid excessive processing
          setTimeout(() => {
            updateAllLineTracking(false); // Silent update
          }, 500);
        }
      });
    }
  }

  function addLineTracking() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active editor found');
      return;
    }

    const document = editor.document;
    const languageId = document.languageId;
    const config = languageConfigs[languageId];

    if (isFileMarkedNoTrack(document)) {
      vscode.window.showErrorMessage('This file is marked as "no track". No tracking will be applied.');
      return;
    }

    if (!config) {
      const issueUrl = `https://github.com/Git21221/vscode-extension/issues/new?title=Support%20request%20for%20language:%20${languageId}&body=Please%20add%20support%20for%20the%20language%20"${languageId}".%20Thanks!`;

      vscode.window.showWarningMessage(
        `Language "${languageId}" is not supported yet.`,
        'Report Issue'
      ).then(selection => {
        if (selection === 'Report Issue') {
          vscode.env.openExternal(vscode.Uri.parse(issueUrl));
        }
      });

      return;
    }


    const selection = editor.selection;
    const selectedText = document.getText(selection);
    const lineNumber = selection.start.line + 1;
    const fileName = path.basename(document.fileName);

    // Check if it's an output statement
    const isOutputStatement = config.outputPatterns.some(pattern =>
      pattern.test(selectedText) || pattern.test(document.lineAt(selection.start.line).text)
    );

    if (!isOutputStatement) {
      vscode.window.showWarningMessage('Selected text does not appear to be an output statement');
      return;
    }

    const lineText = document.lineAt(selection.start.line).text;
    const updatedLine = addTrackingToLine(lineText, fileName, lineNumber, config);



    if (updatedLine !== lineText) {
      const lineRange = document.lineAt(selection.start.line).range;
      editor.edit(editBuilder => {
        editBuilder.replace(lineRange, updatedLine);
      });
    }
  }

  function updateAllLineTracking(showMessage: boolean = true) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

    const document = editor.document;
    const languageId = document.languageId;
    const config = languageConfigs[languageId];
    if (isFileMarkedNoTrack(document)) {
      vscode.window.showErrorMessage('This file is marked as "no track". No tracking will be applied.');
      return;
    }

    if (!config) {
      return;
    }

    const fileName = path.basename(document.fileName);
    let updatedLines = 0;

    insideBlockComment = false; // Reset block comment state
    editor.edit(editBuilder => {
      for (let i = 0; i < document.lineCount; i++) {
        const line = document.lineAt(i);
        const lineText = line.text;
        const lineNumber = i + 1;

        // Skip empty lines or lines that are just comments
        if (!lineText.trim() || lineText.trim().startsWith(config.commentStyle) || shouldSkipLine(lineText)) {
          continue;
        }

        // Check if line contains output statement with existing tracking
        if (hasExistingTracking(lineText, fileName) ||
          config.outputPatterns.some(pattern => pattern.test(lineText))) {

          const updatedLine = addTrackingToLine(lineText, fileName, lineNumber, config);

          if (updatedLine !== lineText) {
            editBuilder.replace(line.range, updatedLine);
            updatedLines++;
          }
        }
      }
    });
  }

  function removeLineTracking() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

    const document = editor.document;
    const fileName = path.basename(document.fileName);
    let removedLines = 0;

    const originalAutoUpdateEnabled = isAutoUpdateEnabled;
    isAutoUpdateEnabled = false; // Disable auto-update temporarily during removal

    editor.edit(editBuilder => {
      for (let i = 0; i < document.lineCount; i++) {
        const line = document.lineAt(i);
        const lineText = line.text;

        if (hasExistingTracking(lineText, fileName)) {
          const cleanedLine = removeTrackingFromLine(lineText, fileName);
          if (cleanedLine !== lineText) {
            editBuilder.replace(line.range, cleanedLine);
            removedLines++;
          }
        }
      }
    }).then(() => {
      isAutoUpdateEnabled = originalAutoUpdateEnabled; //restore auto-update setting
    })

  }

  function toggleAutoUpdate() {
    isAutoUpdateEnabled = !isAutoUpdateEnabled;
    setupAutoUpdate();

    const status = isAutoUpdateEnabled ? 'enabled' : 'disabled';
    vscode.window.showInformationMessage(`Auto-update ${status}`);
  }

  function addTrackingToLine(lineText: string, fileName: string, lineNumber: number, config: LanguageConfig): string {
    let cleanLine = hasExistingTracking(lineText, fileName)
      ? removeTrackingFromLine(lineText, fileName).trim()
      : lineText.trim();

    for (const pattern of config.outputPatterns) {
      if (!pattern.test(cleanLine)) continue;

      const settings = vscode.workspace.getConfiguration('smartOutputTracker');
      const includeFileName = settings.get('includeFileName', true);
      const includeLineNumber = settings.get('includeLineNumber', true);
      const separator = settings.get('separator', ' - ');

      let trackingInfo = '';
      if (includeFileName && includeLineNumber) {
        trackingInfo = `${fileName}:${lineNumber}`;
      } else if (includeFileName) {
        trackingInfo = fileName;
      } else if (includeLineNumber) {
        trackingInfo = lineNumber.toString();
      }

      if (trackingInfo) {
        const stringPattern = /(['"`])((?:\\.|[^\\])*?)\1/;
        const stringMatch = stringPattern.exec(cleanLine);

        if (stringMatch) {
          const quote = stringMatch[1];
          const originalString = stringMatch[2];

          if (/\w/.test(originalString)) {
            const newString = `${originalString}${separator}${trackingInfo}`;
            cleanLine = cleanLine.replace(stringPattern, `${quote}${newString}${quote}`);
          } else {
            return cleanLine;
          }

        } else {
          const openParenIndex = cleanLine.indexOf('(');
          const closeParenIndex = cleanLine.lastIndexOf(')');

          if (openParenIndex === -1 || closeParenIndex === -1 || closeParenIndex <= openParenIndex) {
            return lineText;
          }

          const insideParens = cleanLine.slice(openParenIndex + 1, closeParenIndex).trim();
          if (!insideParens) {
            return lineText;
          }

          const beforeParen = cleanLine.substring(0, openParenIndex + 1);
          const afterParen = cleanLine.substring(openParenIndex + 1);
          cleanLine = `${beforeParen}"${trackingInfo}"${afterParen ? ', ' + afterParen : ')'}`;
        }
      }

      break;
    }

    return cleanLine;
  }


  function removeTrackingFromLine(lineText: string, fileName: string): string {
    // Remove patterns like "filename:123" or "filename 123" from strings
    const trackingPattern = new RegExp(`(\\s*-+\\s*)*${fileName}[:\\s]\\d+`, 'g');
    return lineText.replace(trackingPattern, '').replace(/\s*-+\s*$/, "");
  }

  function hasExistingTracking(lineText: string, fileName: string): boolean {
    const trackingPattern = new RegExp(`${fileName}[:\\s]\\d+`);
    return trackingPattern.test(lineText);
  }

  async function handleFileRename(event: vscode.FileRenameEvent) {
    for (const file of event.files) {
      const oldFileName = path.basename(file.oldUri.fsPath);
      const newFileName = path.basename(file.newUri.fsPath);

      try {
        const document = await vscode.workspace.openTextDocument(file.newUri);
        const editor = await vscode.window.showTextDocument(document);

        const config = languageConfigs[document.languageId];
        if (!config) {
          return;
        }

        await editor.edit(editBuilder => {
          for (let i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i);
            const lineText = line.text;

            //replace old file name with new file name in tracking info
            if (hasExistingTracking(lineText, oldFileName)) {
              const updatedLine = lineText.replace(new RegExp(`${oldFileName}[:\\s]\\d+`, 'g'), `${newFileName}:${i + 1}`);
              editBuilder.replace(line.range, updatedLine);
            }
          }
        });
      } catch (error) {

      }
    }
  }

  let insideBlockComment = false;

  function shouldSkipLine(lineText: string): boolean {
    const text = lineText.trim();

    // Skip empty lines
    if (!text) return true;

    // Skip full one-liner block comments
    if (
      (text.startsWith('/*') && text.endsWith('*/')) ||
      (text.startsWith("'''") && text.endsWith("'''")) ||
      (text.startsWith('"""') && text.endsWith('"""')) ||
      (text.startsWith('<!--') && text.endsWith('-->'))
    ) {
      return true;
    }

    // Start of block comment
    if (
      text.startsWith('/*') ||
      text.startsWith("'''") ||
      text.startsWith('"""') ||
      text.startsWith('<!--')
    ) {
      insideBlockComment = true;
      return true;
    }

    // End of block comment
    if (
      insideBlockComment &&
      (text.endsWith('*/') || text.endsWith("'''") || text.endsWith('"""') || text.endsWith('-->'))
    ) {
      insideBlockComment = false;
      return true;
    }

    // Skip if currently inside block comment
    if (insideBlockComment) {
      return true;
    }

    // 6. Single-line comment
    if (
      text.startsWith('//') ||
      text.startsWith('#') ||
      text.startsWith('--') || // SQL-style
      text.startsWith(';')     // Lisp, config, etc.
    ) {
      return true;
    }

    // 7. "no-track" comment anywhere
    const noTrackRegex = /(\/\/|#|\/\*|<!--)\s*no\s*[- ]\s*track/i;
    if (noTrackRegex.test(text)) {
      return true;
    }

    return false;
  }

  function isFileMarkedNoTrack(document: vscode.TextDocument): boolean {
    const maxLinesToCheck = 10;

    for (let i = 0; i < Math.min(document.lineCount, maxLinesToCheck); i++) {
      const lineText = document.lineAt(i).text.trim();
      if (!lineText) continue;

      const isCommentLine = lineText.startsWith('//') ||
        lineText.startsWith('#') ||
        lineText.startsWith('/*') ||
        lineText.startsWith('<!--');

      if (isCommentLine && /no\s*[- ]\s*track/i.test(lineText)) {
        return true;
      }

      if (!isCommentLine) {
        break;
      }
    }

    return false;
  }

}

export function deactivate() { }