import { Handler } from "@netlify/functions";
import { suggestify } from "../../src/main";

const handler: Handler = async (event, context) => {
  let response = {};

  try {
    const sourceText = "bla bla bla";
    const youMeant = await suggestify(sourceText);
    response["status"] = "success";
    response["youSaid"] = sourceText;
    response["youMeant"] = youMeant;
  } catch (error) {
    response["status"] = "error";
    response["reason"] = error.message;
  }

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      // "access-control-allow-origin": "https://frontiernerds.com",
      "access-control-allow-origin": "*",
    },
    body: JSON.stringify(response),
  };
};

export { handler };
