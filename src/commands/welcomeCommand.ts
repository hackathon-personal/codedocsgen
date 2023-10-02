import * as vscode from "vscode";
import { COMMANDS } from "../constants/applicationConstants";

let welcome = vscode.commands.registerCommand(COMMANDS.WELCOME, () => {
  vscode.window.showInformationMessage("Welcome to CodeDocsGen!");
});

const welcomeCommand = {
  welcome,
};

export default welcomeCommand;
