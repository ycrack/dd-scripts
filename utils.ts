export const gettingDataFailedResponse = new Response(
  JSON.stringify({ status: 500, message: "Getting data failed." }),
  { status: 500, headers: { "content-type": "application/json; charset=UTF-8" } }
);
