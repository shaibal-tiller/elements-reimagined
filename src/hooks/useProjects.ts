import { useQuery } from "@tanstack/react-query";
import { getProjects } from "../services/projectService";
import { Project } from "../types/firebase";

export function useProjects() {
  return useQuery<Project[], Error>({
    queryKey: ["projects"],
    queryFn: getProjects,
  });
}

export default useProjects;
