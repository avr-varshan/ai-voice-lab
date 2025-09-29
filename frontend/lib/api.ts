import axios from "axios";

export const ttsClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_TTS_API_BASE,
  headers: {
    Authorization: process.env.NEXT_PUBLIC_TTS_AUTH,
    "Content-Type": "application/json",
  },
});

export const seedvcClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SEEDVC_API_BASE,
  headers: {
    Authorization: process.env.NEXT_PUBLIC_SEEDVC_AUTH,
    "Content-Type": "application/json",
  },
});

// Response types
export interface TTSResponse {
  audio_url: string;
  s3_key: string;
}

export interface SeedVCResponse {
  audio_url: string;
  s3_key: string;
}

export interface VoicesResponse {
  voices: string[];
}

export interface UploadResponse {
  s3_key: string;
  url: string;
}