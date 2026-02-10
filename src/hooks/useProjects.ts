import { useQuery } from "@tanstack/react-query";
import { getProjects } from "../services/projectService";
import { Project } from "../types/firebase";

/**
 * React Query hook for fetching all projects
 */
export function useProjects() {
  return useQuery<Project[], Error>({
    queryKey: ["projects"],
    queryFn: getProjects,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
  });
}

export default useProjects;
