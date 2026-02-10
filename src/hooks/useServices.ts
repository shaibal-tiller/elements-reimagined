import { useQuery } from "@tanstack/react-query";
import { getServices } from "../services/servicesService";
import { Service } from "../types/firebase";

/**
 * React Query hook for fetching services
 */
export function useServices() {
  return useQuery<Service[], Error>({
    queryKey: ["services"],
    queryFn: getServices,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: 2,
  });
}

export default useServices;
