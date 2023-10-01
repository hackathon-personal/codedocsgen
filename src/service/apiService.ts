import axios from "axios";
import utils from "../utils";
import { HEADERS, METHOD } from "../constants/apiConstants";

async function getGenerateComment(code: string) {
  const data = {
    language: "TypeScript",
    functionCodes: [code],
  };

  const config = {
    method: METHOD.post,
    url: utils.getUrl("generate-comment"),
    headers: HEADERS,
    data: data,
  };

  try {
    const response = await axios.request(config);
    return response.data.response.completion;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

const apiService = {
  getGenerateComment,
};

export default apiService;
