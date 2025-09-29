"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { SpeakerWaveIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { ttsClient, TTSResponse, VoicesResponse } from '@/lib/api';
import FrostedCard from './FrostedCard';

interface TTSFormData {
  text: string;
  target_voice: string;
}

interface GeneratedAudio {
  audio_url: string;
  s3_key: string;
  text: string;
  voice: string;
  timestamp: number;
}

export default function TextToSpeechCard({ onToast }: { onToast: (type: 'success' | 'error', message: string) => void }) {
  const [voices, setVoices] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingVoices, setIsLoadingVoices] = useState(true);
  const [recentAudio, setRecentAudio] = useState<GeneratedAudio[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<TTSFormData>();

  const textValue = watch('text', '');

  // Load voices on mount
  useEffect(() => {
    const loadVoices = async () => {
      try {
        const { data } = await ttsClient.get<VoicesResponse>('/voices');
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

  const onSubmit = async (data: TTSFormData) => {
    if (!data.text.trim()) {
      onToast('error', 'Please enter some text');
      return;
    }

    setIsLoading(true);

    try {
      // Small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 300));

      const response = await ttsClient.post<TTSResponse>('/generate', {
        text: data.text,
        target_voice: data.target_voice,
      });

      const newAudio: GeneratedAudio = {
        ...response.data,
        text: data.text,
        voice: data.target_voice,
        timestamp: Date.now(),
      };

      // Keep only last 3 generated audios
      setRecentAudio(prev => [newAudio, ...prev.slice(0, 2)]);
      
      onToast('success', 'Audio generated successfully!');
    } catch (error: any) {
      console.error('TTS generation failed:', error);
      onToast('error', error.response?.data?.detail || 'Failed to generate audio');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadAudio = (audioUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = filename;
    link.click();
  };

  return (
    <FrostedCard className={`transition-opacity duration-200 ${isLoading ? 'opacity-70' : ''}`}>
      <div className="flex items-center space-x-3 mb-6">
        <SpeakerWaveIcon className="h-6 w-6 text-purple-500" />
        <h2 className="text-xl font-semibold text-gray-800">Text to Speech</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
            Enter text to convert
          </label>
          <textarea
            id="text"
            rows={6}
            {...register('text', {
              required: 'Text is required',
              maxLength: {
                value: 1000,
                message: 'Text must be less than 1000 characters',
              },
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-none"
            placeholder="Type your message here..."
          />
          <div className="flex justify-between mt-1">
            <div>
              {errors.text && (
                <p className="text-sm text-red-600">{errors.text.message}</p>
              )}
            </div>
            <span className="text-sm text-gray-500">
              {textValue?.length || 0}/1000
            </span>
          </div>
        </div>

        <div>
          <label htmlFor="target_voice" className="block text-sm font-medium text-gray-700 mb-2">
            Select voice
          </label>
          {isLoadingVoices ? (
            <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
              Loading voices...
            </div>
          ) : (
            <select
              id="target_voice"
              {...register('target_voice', { required: 'Please select a voice' })}
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
          disabled={isLoading || isLoadingVoices}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-4 rounded-lg hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Generating...</span>
            </div>
          ) : (
            'Generate Audio'
          )}
        </button>
      </form>

      {/* Recent Audio */}
      {recentAudio.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Recent Generations</h3>
          <div className="space-y-4">
            {recentAudio.map((audio, index) => (
              <div key={audio.timestamp} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">Voice: {audio.voice}</p>
                    <p className="text-xs text-gray-500 truncate">{audio.text}</p>
                  </div>
                  <button
                    onClick={() => downloadAudio(audio.audio_url, `tts-${audio.voice}-${audio.timestamp}.wav`)}
                    className="ml-2 p-1 text-purple-500 hover:text-purple-700 transition-colors"
                    title="Download"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4" />
                  </button>
                </div>
                <audio controls className="w-full" preload="none">
                  <source src={audio.audio_url} type="audio/wav" />
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