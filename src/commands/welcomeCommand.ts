import * as vscode from "vscode";

let welcome = vscode.commands.registerCommand("codedocsgen.welcome", () => {
  vscode.window.showInformationMessage("Welcome to CodeDocsGen!");
});

const welcomeCommand = {
  welcome,
};

export default welcomeCommand;
