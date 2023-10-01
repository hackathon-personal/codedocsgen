import axios from "axios";
import utils from "../utils";
import { HEADERS, Language, METHOD } from "../constants/apiConstants";
import { FunctionDetails } from "../interface/IFunctionDetails";

async function getGenerateComment(code: FunctionDetails[]) {
  const data = {
    language: Language.TS,
    functionCodes: code,
  };

  const config = {
    method: METHOD.post,
    url: utils.getUrl("generate-comment"),
    headers: HEADERS,
    data: data,
  };

  try {
    const response = await axios.request(config);
    return response.data.response;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

const apiService = {
  getGenerateComment,
};

export default apiService;
