/**
 * Local dev server for UploadThing API route
 * Run alongside Vite via: npm run dev
 */
import { readFileSync } from "fs";
import { resolve } from "path";
import http from "http";

// Load .env.local
const envPath = resolve(process.cwd(), ".env.local");
const envContent = readFileSync(envPath, "utf-8");
for (const line of envContent.split("\n")) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim();
}

import { createUploadthing, createRouteHandler, UTFiles, UTApi } from "uploadthing/server";
import { z } from "zod";

const utapi = new UTApi();

const f = createUploadthing();

const uploadRouter = {
  projectImage: f({
    image: { maxFileSize: "8MB", maxFileCount: 20 },
  })
    .input(z.object({ projectId: z.string() }))
    .middleware(({ input, files }) => {
      return {
        projectId: input.projectId,
        [UTFiles]: files.map((file) => ({
          ...file,
          customId: `${input.projectId}/${Date.now()}-${file.name}`,
        })),
      };
    })
    .onUploadComplete(({ file, metadata }) => {
      console.log(`Upload complete for project ${metadata.projectId}:`, file.ufsUrl);
      return { url: file.ufsUrl };
    }),
  projectVideo: f({
    video: { maxFileSize: "64MB", maxFileCount: 5 },
  })
    .input(z.object({ projectId: z.string() }))
    .middleware(({ input, files }) => {
      return {
        projectId: input.projectId,
        [UTFiles]: files.map((file) => ({
          ...file,
          customId: `${input.projectId}/${Date.now()}-${file.name}`,
        })),
      };
    })
    .onUploadComplete(({ file, metadata }) => {
      console.log(`Video upload complete for project ${metadata.projectId}:`, file.ufsUrl);
      return { url: file.ufsUrl };
    }),
};

const handler = createRouteHandler({ router: uploadRouter });

const server = http.createServer(async (req, res) => {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-uploadthing-package, x-uploadthing-version, x-uploadthing-be-adapter");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // Read body
  let body = "";
  for await (const chunk of req) body += chunk;

  // Handle delete-files endpoint
  if (req.url?.startsWith("/api/delete-files")) {
    if (req.method !== "POST") {
      res.writeHead(405);
      res.end("Method not allowed");
      return;
    }
    try {
      const { keys } = JSON.parse(body) as { keys: string[] };
      if (!keys || !Array.isArray(keys) || keys.length === 0) {
        res.writeHead(400, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
        res.end(JSON.stringify({ error: "No keys provided" }));
        return;
      }
      await utapi.deleteFiles(keys);
      res.writeHead(200, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
      res.end(JSON.stringify({ success: true, deleted: keys.length }));
    } catch (e) {
      console.error("Delete error:", e);
      res.writeHead(500, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
      res.end(JSON.stringify({ error: "Failed to delete files" }));
    }
    return;
  }

  const protocol = "http";
  const url = new URL(req.url!, `${protocol}://${req.headers.host}`);

  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (typeof value === "string") headers.set(key, value);
  }

  const request = new Request(url.toString(), {
    method: req.method,
    headers,
    ...(req.method !== "GET" && req.method !== "HEAD" ? { body } : {}),
  });

  try {
    const response = await handler(request);
    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => { responseHeaders[key] = value; });
    // Ensure CORS on response too
    responseHeaders["Access-Control-Allow-Origin"] = "*";
    res.writeHead(response.status, responseHeaders);
    const responseBody = await response.text();
    res.end(responseBody);
  } catch (e) {
    console.error("Handler error:", e);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: String(e) }));
  }
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`UploadThing dev server running on http://localhost:${PORT}`);
});
