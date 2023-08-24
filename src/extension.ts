import { commands, ExtensionContext } from "vscode";
import * as vscode from "vscode";
import { CodingWaifuPanel } from "./panels/CodingWaifuPanel";
import { MemFS } from "./utilities/fileSystem";
import { exec } from "child_process";

export function activate(context: ExtensionContext) {
  vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => {
    if (document.uri.scheme === "file") {
      CodingWaifuPanel.currentPanel._panel.webview.postMessage({
        command: "save",
        path: document.fileName,
      });
    }
  });
  const showCodingWaifuCommand = commands.registerCommand("coding-waifu.showWebview", () => {
    CodingWaifuPanel.render(context.extensionUri);
  });

  // Add command to the extension context
  context.subscriptions.push(showCodingWaifuCommand);
}
