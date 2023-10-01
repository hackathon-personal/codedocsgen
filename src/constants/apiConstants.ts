enum Headers {
  contentType = "Content-Type",
}

const METHOD = {
  post: "post",
};

const HEADERS = {
  [Headers.contentType]: "application/json",
};

const CONFIG = {
  method: METHOD.post,
};

const baseUrl: string =
  "https://10nozi0l51.execute-api.us-east-1.amazonaws.com/dev/";

export { HEADERS, baseUrl, METHOD, CONFIG };
