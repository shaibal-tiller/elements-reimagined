import { createUploadthing, createRouteHandler, UTFiles } from "uploadthing/server";
import { z } from "zod";

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

export type UploadRouter = typeof uploadRouter;

const handler = createRouteHandler({ router: uploadRouter });

export const config = { runtime: "edge" };

export default async function edgeHandler(request: Request) {
  return handler(request);
}
