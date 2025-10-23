import Ably from "ably";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const clientId = url.searchParams.get("clientId") ?? "anonymous";

  const rest = new Ably.Rest(process.env.ABLY_API_KEY!);
  const tokenRequest = await rest.auth.createTokenRequest({ clientId });

  return Response.json(tokenRequest);
}
