import { useQuery } from "@tanstack/react-query";
import { getResume } from "../services/resumeService";
import { FirestoreResume } from "../types/firebase";

export function useResume() {
  return useQuery<FirestoreResume, Error>({
    queryKey: ["resume"],
    queryFn: getResume,
  });
}

export default useResume;
