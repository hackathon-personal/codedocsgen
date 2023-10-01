import { baseUrl } from "./constants/apiConstants";

function getUrl(param: string) {
  return `${baseUrl}${param}`;
}

const utils = {
  getUrl,
};

export default utils;
