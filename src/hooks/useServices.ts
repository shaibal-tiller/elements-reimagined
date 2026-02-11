import { useQuery } from "@tanstack/react-query";
import { getServices } from "../services/servicesService";
import { Service } from "../types/firebase";

export function useServices() {
  return useQuery<Service[], Error>({
    queryKey: ["services"],
    queryFn: getServices,
  });
}

export default useServices;
