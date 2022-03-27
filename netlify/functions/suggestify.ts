import { Handler } from "@netlify/functions";
import { suggestify } from "../../src/main";

const handler: Handler = async (event, context) => {
  let response = {};

  // Validate query
  if (event.queryStringParameters.text == undefined || event.queryStringParameters.text.length == 0) {
    response["status"] = "error";
    response["reason"] = 'You need to pass a URL-encoded "text" query parameter';
  } else {
    // Suggestify
    try {
      const sourceText = event.queryStringParameters.text;
      const youMeant = await suggestify(sourceText);
      response["status"] = "success";
      response["youSaid"] = sourceText;
      response["youMeant"] = youMeant;
    } catch (error) {
      response["status"] = "error";
      response["reason"] = error.message;
    }
  }

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "access-control-allow-origin": "https://frontiernerds.com",
      // "access-control-allow-origin": "*",
    },
    body: JSON.stringify(response),
  };
};

export { handler };
