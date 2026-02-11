import { useQuery } from "@tanstack/react-query";
import { getProfile, getLinks } from "../services/profileService";
import { Profile, Links } from "../types/firebase";

export function useProfile() {
  return useQuery<Profile, Error>({
    queryKey: ["profile"],
    queryFn: getProfile,
  });
}

export function useLinks() {
  return useQuery<Links, Error>({
    queryKey: ["links"],
    queryFn: getLinks,
  });
}

export default useProfile;
