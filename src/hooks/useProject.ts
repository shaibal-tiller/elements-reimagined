import { useQuery } from "@tanstack/react-query";
import { getProject } from "../services/projectService";
import { Project } from "../types/firebase";

export function useProject(id: string | undefined) {
  return useQuery<Project | null, Error>({
    queryKey: ["project", id],
    queryFn: () => (id ? getProject(id) : Promise.resolve(null)),
    enabled: !!id,
  });
}

export default useProject;
