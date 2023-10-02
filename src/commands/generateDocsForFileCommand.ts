import * as vscode from "vscode";
import tsParser from "../tsParser";
import apiService from "../service/apiService";
import { FunctionDocsResponse } from "../interface/IFunctionDocsResponse";
import {
  ACTIONS,
  COMMANDS,
  ERROR_MESSAGES,
} from "../constants/applicationConstants";

const generateDocsForFile = vscode.commands.registerCommand(
  COMMANDS.GENERATE_DOCS_FOR_FILE,
  async () => {
    const editor = vscode.window.activeTextEditor;

    if (editor) {
      const document = editor.document;
      // entire ts file text till end of the file
      const documentText = document.getText();
      const cursorPosition = editor.selection.active;

      if (documentText) {
        // parse the text to get the functions
        const parsedFunctions = tsParser.getFunction(documentText);
        console.log("parsedFunctions", parsedFunctions);
        // check if the parsed functions are not empty
        if (parsedFunctions.length > 0) {
          try {
            // generates JS doc comments for the functions passed
            const generatedComments: FunctionDocsResponse =
              await apiService.getGenerateComment(parsedFunctions);
            console.log(generatedComments);

            // check if the generated comments are not empty
            if (
              generatedComments &&
              Object.keys(generatedComments).length > 0
            ) {
              // insert the comments in the file
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
          // if empty then show the info message
          vscode.window.showInformationMessage(
            ERROR_MESSAGES.functionNotFound,
            ACTIONS.dismiss
          );
        }
      }
    }
  }
);

async function insertComments(
  generatedComments: any,
  editor: any,
  cursorPosition: any
) {
  let lineCount = 0;

  // loop through the generated comments
  for (let line of Object.keys(generatedComments)) {
    // get the start and end position of the function
    const [startPos, endPos] = line.split("#");
    const selectedFuncStartPos = parseInt(startPos);
    const selectedFuncEndPos = parseInt(endPos);
    const document = editor.document;

    // get the generatedComment of the function
    let jSDocComment = generatedComments[line];

    await editor.edit((editBuilder: any) => {
      // get the start position of the selected function
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
    // increase the line count by the number of lines in the generated comment
    lineCount = lineCount + jSDocComment.split("\n").length - 1;
  }
}

const generateDocsForFileCommand = {
  generateDocsForFile,
};

export default generateDocsForFileCommand;
