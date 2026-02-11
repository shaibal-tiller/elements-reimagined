import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export const config = { runtime: "edge" };

export default async function handler(request: Request) {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" },
    });
  }

  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { keys } = await request.json() as { keys: string[] };
    if (!keys || !Array.isArray(keys) || keys.length === 0) {
      return new Response(JSON.stringify({ error: "No keys provided" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    await utapi.deleteFiles(keys);
    return new Response(JSON.stringify({ success: true, deleted: keys.length }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  } catch (e) {
    console.error("Delete error:", e);
    return new Response(JSON.stringify({ error: "Failed to delete files" }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
}
