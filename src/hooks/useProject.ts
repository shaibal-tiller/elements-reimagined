import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProjects } from "../services/projectService";
import { Project } from "../types/firebase";

export function useProject(slug: string | undefined) {
  const queryClient = useQueryClient();

  return useQuery<Project | null, Error>({
    queryKey: ["project", slug],
    queryFn: async () => {
      if (!slug) return null;

      // Try to find in the cached projects list (already prefetched)
      let projects = queryClient.getQueryData<Project[]>(["projects"]);

      // If not cached yet, fetch all projects
      if (!projects) {
        projects = await getProjects();
        // Populate the cache for future use
        queryClient.setQueryData(["projects"], projects);
      }

      // Match by slug first, then fall back to id for backwards compatibility
      return (
        projects.find((p) => p.slug === slug) ||
        projects.find((p) => p.id === slug) ||
        null
      );
    },
    enabled: !!slug,
  });
}

export default useProject;
