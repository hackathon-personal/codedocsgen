import * as vscode from "vscode";
import tsParser from "../tsParser";
import apiService from "../service/apiService";
import { FunctionDocsResponse } from "../interface/IFunctionDocsResponse";
import {
  ACTIONS,
  COMMANDS,
  ERROR_MESSAGES,
} from "../constants/applicationConstants";

async function insertComments(
  generatedComments: any,
  editor: any,
  cursorPosition: any
) {
  let lineCount = 0;

  for (let line of Object.keys(generatedComments)) {
    const [startPos, endPos] = line.split("#");
    const selectedFuncStartPos = parseInt(startPos);
    const selectedFuncEndPos = parseInt(endPos);
    const document = editor.document;

    let jSDocComment = generatedComments[line];

    await editor.edit((editBuilder: any) => {
      let startPosition = cursorPosition.with(
        selectedFuncStartPos +
          (lineCount === 0 && selectedFuncStartPos > 0 ? -1 : lineCount),
        0
      );

      const currentLineText = document.lineAt(startPosition).text;
      if (currentLineText) {
        jSDocComment = `${"\n"}${jSDocComment}`;
      }
      jSDocComment = `${jSDocComment}${"\n"}`;

      console.log(startPosition);
      editBuilder.insert(startPosition, jSDocComment);
    });
    lineCount = lineCount + jSDocComment.split("\n").length - 1;
  }
}

const generateDocsForFile = vscode.commands.registerCommand(
  COMMANDS.GENERATE_DOCS_FOR_FILE,
  async () => {
    const editor = vscode.window.activeTextEditor;

    if (editor) {
      const document = editor.document;
      const documentText = document.getText();
      const cursorPosition = editor.selection.active;

      if (documentText) {
        const parsedFunctions = tsParser.getFunction(documentText);
        console.log("parsedFunctions", parsedFunctions);
        if (parsedFunctions.length > 0) {
          try {
            const generatedComments: FunctionDocsResponse =
              await apiService.getGenerateComment(parsedFunctions);
            console.log(generatedComments);

            if (
              generatedComments &&
              Object.keys(generatedComments).length > 0
            ) {
              await insertComments(generatedComments, editor, cursorPosition);
            }
          } catch (error) {
            console.log("Error", error);
            vscode.window.showErrorMessage(
              ERROR_MESSAGES.somethingWentWrong,
              ACTIONS.dismiss
            );
          }
        } else {
          vscode.window.showInformationMessage(
            ERROR_MESSAGES.functionNotFound,
            ACTIONS.dismiss
          );
        }
      }
    }
  }
);

const generateDocsForFileCommand = {
  generateDocsForFile,
};

export default generateDocsForFileCommand;
