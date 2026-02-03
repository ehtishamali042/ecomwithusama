import { authStorage } from "@/service/authStorage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface UploadResponse {
  path: string;
  publicUrl: string;
}

export async function uploadStockImage(file: File): Promise<UploadResponse> {
  // Backend exposes POST /stocks/upload-image (see backend stock-image.controller)
  const url = `${API_BASE_URL}/stocks/upload-image`;
  const token = authStorage.getToken();
  const fd = new FormData();
  fd.append("file", file);

  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url, { method: "POST", body: fd, headers });
  if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
  return res.json();
}

export default { uploadStockImage };
