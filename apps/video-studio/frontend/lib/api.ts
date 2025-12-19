import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for auth
api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Video generation
export interface GenerateVideoRequest {
  prompt: string;
  mode: "text-to-video" | "image-to-video";
  imageUrl?: string;
  duration: number;
  aspectRatio: "16:9" | "9:16" | "1:1";
  model?: string;
}

export interface GenerateVideoResponse {
  taskId: string;
  estimatedTime: number;
  credits: number;
}

export interface VideoStatus {
  taskId: string;
  status: "pending" | "processing" | "completed" | "failed";
  progress: number;
  videoUrl?: string;
  error?: string;
}

export const videoApi = {
  generate: (data: GenerateVideoRequest) =>
    api.post<GenerateVideoResponse>("/api/v1/video/generate", data),

  getStatus: (taskId: string) =>
    api.get<VideoStatus>(`/api/v1/video/status/${taskId}`),

  list: () =>
    api.get("/api/v1/video/projects"),
};

// Audio/Voice
export interface GenerateVoiceRequest {
  text: string;
  voiceId: string;
  language: "darija" | "arabic" | "french";
}

export const audioApi = {
  generateVoice: (data: GenerateVoiceRequest) =>
    api.post("/api/v1/audio/tts", data),

  listVoices: () =>
    api.get("/api/v1/audio/voices"),
};

// Templates
export const templateApi = {
  list: (category?: string) =>
    api.get("/api/v1/templates", { params: { category } }),

  get: (id: string) =>
    api.get(`/api/v1/templates/${id}`),
};

// Credits
export const creditsApi = {
  getBalance: () =>
    api.get("/api/v1/credits/balance"),

  getHistory: () =>
    api.get("/api/v1/credits/history"),

  purchase: (packId: string) =>
    api.post("/api/v1/credits/purchase", { packId }),
};
