import fetcher from "./fetcher";

export interface UpdateProfileData {
  firstName: string;
  lastName: string;
}

export function updateProfile(data: UpdateProfileData) {
  return fetcher.patch("/profile", data);
}
