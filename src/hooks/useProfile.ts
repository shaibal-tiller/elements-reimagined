import { useQuery } from "@tanstack/react-query";
import { getProfile, getLinks } from "../services/profileService";
import { Profile, Links } from "../types/firebase";

/**
 * React Query hook for fetching profile data
 */
export function useProfile() {
  return useQuery<Profile, Error>({
    queryKey: ["profile"],
    queryFn: getProfile,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: 2,
  });
}

/**
 * React Query hook for fetching social links
 */
export function useLinks() {
  return useQuery<Links, Error>({
    queryKey: ["links"],
    queryFn: getLinks,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: 2,
  });
}

export default useProfile;
