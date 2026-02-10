import { useQuery } from "@tanstack/react-query";
import { getProject } from "../services/projectService";
import { Project } from "../types/firebase";

/**
 * React Query hook for fetching a single project by ID
 */
export function useProject(id: string | undefined) {
  return useQuery<Project | null, Error>({
    queryKey: ["project", id],
    queryFn: () => (id ? getProject(id) : Promise.resolve(null)),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    enabled: !!id, // Only run query if id is provided
    retry: 2,
  });
}

export default useProject;
