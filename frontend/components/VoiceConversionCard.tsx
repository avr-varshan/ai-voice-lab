"use client";

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { 
  MicrophoneIcon, 
  ArrowDownTrayIcon, 
  DocumentArrowUpIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { seedvcClient, VoicesResponse, SeedVCResponse, UploadResponse } from '@/lib/api';
import FrostedCard from './FrostedCard';

interface ConversionFormData {
  target_voice: string;
}

interface ConvertedAudio {
  audio_url: string;
  s3_key: string;
  source_filename: string;
  target_voice: string;
  timestamp: number;
}

export default function VoiceConversionCard({ onToast }: { onToast: (type: 'success' | 'error', message: string) => void }) {
  const [voices, setVoices] = useState<string[]>([]);
  const [isLoadingVoices, setIsLoadingVoices] = useState(true);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedS3Key, setUploadedS3Key] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [recentConversions, setRecentConversions] = useState<ConvertedAudio[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConversionFormData>();

  // Load voices on mount
  useEffect(() => {
    const loadVoices = async () => {
      try {
        const { data } = await seedvcClient.get<VoicesResponse>('/voices');
        setVoices(data.voices);
      } catch (error) {
        console.error('Failed to load voices:', error);
        onToast('error', 'Failed to load voices');
      } finally {
        setIsLoadingVoices(false);
      }
    };

    loadVoices();
  }, [onToast]);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('audio/')) {
      onToast('error', 'Please select an audio file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      onToast('error', 'File size must be less than 10MB');
      return;
    }

    setUploadedFile(file);
    setUploadedS3Key('');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const uploadFile = async () => {
    if (!uploadedFile) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const data: UploadResponse = await response.json();
      setUploadedS3Key(data.s3_key);
      onToast('success', 'File uploaded successfully!');
    } catch (error: any) {
      console.error('Upload failed:', error);
      onToast('error', error.message || 'Upload failed');
      setUploadedFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: ConversionFormData) => {
    if (!uploadedS3Key) {
      onToast('error', 'Please upload a file first');
      return;
    }

    setIsConverting(true);

    try {
      // Small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 300));

      const response = await seedvcClient.post<SeedVCResponse>('/convert', {
        source_audio_key: uploadedS3Key,
        target_voice: data.target_voice,
      });

      const newConversion: ConvertedAudio = {
        ...response.data,
        source_filename: uploadedFile?.name || 'Unknown',
        target_voice: data.target_voice,
        timestamp: Date.now(),
      };

      // Keep only last 3 conversions
      setRecentConversions(prev => [newConversion, ...prev.slice(0, 2)]);
      
      onToast('success', 'Voice conversion completed!');
    } catch (error: any) {
      console.error('Conversion failed:', error);
      onToast('error', error.response?.data?.detail || 'Voice conversion failed');
    } finally {
      setIsConverting(false);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setUploadedS3Key('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadAudio = (audioUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = filename;
    link.click();
  };

  return (
    <FrostedCard className={`transition-opacity duration-200 ${(isUploading || isConverting) ? 'opacity-70' : ''}`}>
      <div className="flex items-center space-x-3 mb-6">
        <MicrophoneIcon className="h-6 w-6 text-purple-500" />
        <h2 className="text-xl font-semibold text-gray-800">Voice Conversion</h2>
      </div>

      {/* File Upload */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload audio file
        </label>
        
        {!uploadedFile ? (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <DocumentArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Drop your audio file here or click to browse</p>
            <p className="text-sm text-gray-500">Supports: MP3, WAV, M4A (max 10MB)</p>
          </div>
        ) : (
          <div className="border border-gray-300 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <DocumentArrowUpIcon className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="font-medium text-gray-800">{uploadedFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={removeFile}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                title="Remove file"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {!uploadedS3Key && (
              <button
                onClick={uploadFile}
                disabled={isUploading}
                className="w-full mt-4 bg-purple-100 text-purple-700 font-medium py-2 px-4 rounded-lg hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isUploading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    <span>Uploading...</span>
                  </div>
                ) : (
                  'Upload File'
                )}
              </button>
            )}

            {uploadedS3Key && (
              <div className="mt-4 p-2 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700">✓ File uploaded successfully!</p>
              </div>
            )}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileSelect(file);
          }}
          className="hidden"
        />
      </div>

      {/* Conversion Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="target_voice" className="block text-sm font-medium text-gray-700 mb-2">
            Target voice
          </label>
          {isLoadingVoices ? (
            <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
              Loading voices...
            </div>
          ) : (
            <select
              id="target_voice"
              {...register('target_voice', { required: 'Please select a target voice' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
            >
              <option value="">Choose a voice...</option>
              {voices.map((voice) => (
                <option key={voice} value={voice}>
                  {voice}
                </option>
              ))}
            </select>
          )}
          {errors.target_voice && (
            <p className="mt-1 text-sm text-red-600">{errors.target_voice.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={!uploadedS3Key || isConverting || isLoadingVoices}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-4 rounded-lg hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
        >
          {isConverting ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Converting...</span>
            </div>
          ) : (
            'Convert Voice'
          )}
        </button>
      </form>

      {/* Recent Conversions */}
      {recentConversions.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Recent Conversions</h3>
          <div className="space-y-4">
            {recentConversions.map((conversion, index) => (
              <div key={conversion.timestamp} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">
                      {conversion.source_filename} → {conversion.target_voice}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(conversion.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => downloadAudio(
                      conversion.audio_url, 
                      `converted-${conversion.target_voice}-${conversion.timestamp}.wav`
                    )}
                    className="ml-2 p-1 text-purple-500 hover:text-purple-700 transition-colors"
                    title="Download"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4" />
                  </button>
                </div>
                <audio controls className="w-full" preload="none">
                  <source src={conversion.audio_url} type="audio/wav" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            ))}
          </div>
        </div>
      )}
    </FrostedCard>
  );
}