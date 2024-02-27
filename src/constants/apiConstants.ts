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

enum Language {
  TS = "TypeScript",
}

const baseUrl: string =
  "https://vevwtutfsf.execute-api.us-east-1.amazonaws.com/dev/";

export { CONFIG, HEADERS, Language, METHOD, baseUrl };
