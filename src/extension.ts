// The module 'vscode' contains the VS Code extensibility API
import * as vscode from "vscode";
import generateDocsCommand from "./commands/generateDocsCommand";
import welcomeCommand from "./commands/welcomeCommand";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  let generateDocsDisposable = generateDocsCommand.generateDocs;
  let welcomeDisposable = welcomeCommand.welcome;

  context.subscriptions.push(generateDocsDisposable, welcomeDisposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
