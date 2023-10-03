// The module 'vscode' contains the VS Code extensibility API
import * as vscode from "vscode";
import generateDocsCommand from "./commands/generateDocsCommand";
import welcomeCommand from "./commands/welcomeCommand";
import generateDocsForFileCommand from "./commands/generateDocsForFileCommand";
import generateDocsForProjectCommand from "./commands/generateDocsForProjectCommand";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  let generateDocsDisposable = generateDocsCommand.generateDocs;
  let welcomeDisposable = welcomeCommand.welcome;
  let generateDocsForFileDisposable =
    generateDocsForFileCommand.generateDocsForFile;
  let generateDocsForProjectDisposable =
    generateDocsForProjectCommand.generateDocsForProject;

  context.subscriptions.push(
    generateDocsDisposable,
    welcomeDisposable,
    generateDocsForFileDisposable,
    generateDocsForProjectDisposable
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
