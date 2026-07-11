import api from "./axios";

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  provider: string;
  emailVerified: boolean;
  imageUrl?: string | null;
  createdAt: string;
}

export interface UpdateProfilePayload {
  name?: string;
  imageUrl?: string;
}

export async function fetchUserProfile(): Promise<UserProfile> {
  const response = await api.get("/users/me");
  return response.data?.data as UserProfile;
}

export async function updateUserProfile(
  payload: UpdateProfilePayload,
): Promise<UserProfile> {
  const response = await api.put("/users/me", payload);
  return response.data?.data as UserProfile;
}
