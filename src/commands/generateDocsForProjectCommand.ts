import * as vscode from "vscode";
import { ACTIONS, COMMANDS } from "../constants/applicationConstants";

const generateDocsForProject = vscode.commands.registerCommand(
  COMMANDS.GENERATE_DOCS_FOR_PROJECT,
  async () => {
    const searchPattern = "*/**/*.ts";
    const filePaths: string[] = [];
    const tsFiles = await vscode.workspace.findFiles(
      searchPattern,
      "node_modules/**"
    );
    for (let tsFileUri of tsFiles) {
      const filePath = tsFileUri.path;
      filePaths.push(filePath);
    }
    console.log("filePaths", filePaths);
    for (let filePath of filePaths) {
      await processFile(filePath);
    }
    vscode.window.showInformationMessage(
      "Comment generation success for entire project",
      ACTIONS.dismiss
    );
  }
);

async function processFile(filePath: string) {
  const editorStateMap = new Map();
  await vscode.workspace.openTextDocument(filePath).then(async (doc) => {
    const editor = await vscode.window.showTextDocument(doc);

    editorStateMap.set(editor.document.uri.toString(), { isProcessing: false });
    await vscode.commands.executeCommand(COMMANDS.GENERATE_DOCS_FOR_FILE);
  });
}

const generateDocsForProjectCommand = {
  generateDocsForProject,
};

export default generateDocsForProjectCommand;
