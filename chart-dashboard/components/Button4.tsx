'use client'

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, MicOff, Square } from 'lucide-react';

export default function Button4() {
  const [isRecording, setIsRecording] = useState(false);
  const [volume, setVolume] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [error, setError] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recordingStartTimeRef = useRef<number>(0);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isRecordingRef = useRef<boolean>(false); // ref로 실시간 상태 추적

  // 볼륨에 따른 색상 결정
  const getButtonColor = () => {
    if (!isRecording) return 'bg-blue-500 hover:bg-blue-600'; // 녹음 중이 아니면 파란색
    
    if (audioLevel > 0.8) return 'bg-red-500 hover:bg-red-600'; // 볼륨이 너무 클 때
    if (audioLevel > 0.02) return 'bg-green-500 hover:bg-green-600'; // 소리가 들릴 때 (초록색)
    return 'bg-blue-500 hover:bg-blue-600'; // 기본 상태 (파란색)
  };

  // 볼륨 레벨 모니터링
  const updateVolume = () => {
    console.log('updateVolume 호출됨 - isRecordingRef:', isRecordingRef.current, 'analyserRef:', !!analyserRef.current);
    
    if (analyserRef.current && isRecordingRef.current) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      
      // 데이터 배열의 일부 값들 출력
      console.log('Data Array 샘플:', dataArray.slice(0, 10));
      
      // 단순 평균 방식으로 변경 (더 안정적)
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      const normalizedVolume = average / 255;
      
      // 볼륨을 더 민감하게 조정
      const adjustedVolume = normalizedVolume * 5; // 5배 증폭 (민감도 낮춤)
      
      setAudioLevel(adjustedVolume);
      setVolume(adjustedVolume);
      
      console.log('=== 볼륨 정보 ===');
      console.log('Average:', average.toFixed(1));
      console.log('Normalized:', normalizedVolume.toFixed(5));
      console.log('Adjusted:', adjustedVolume.toFixed(3));
      console.log('Audio Level State:', audioLevel.toFixed(3));
      console.log('Color:', getButtonColor());
      console.log('================');
    } else {
      console.log('조건 불만족 - analyserRef:', !!analyserRef.current, 'isRecordingRef:', isRecordingRef.current);
    }
    
    if (isRecordingRef.current) {
      animationFrameRef.current = requestAnimationFrame(updateVolume);
    }
  };

  // 마이크 초기화
  const initializeMicrophone = async () => {
    try {
      console.log('마이크 초기화 시작...');
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        } 
      });
      
      console.log('마이크 스트림 획득:', stream);
      streamRef.current = stream;
      
      // AudioContext 설정 (볼륨 모니터링용)
      audioContextRef.current = new AudioContext();
      console.log('AudioContext 생성:', audioContextRef.current);
      
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256; // 더 빠른 반응을 위해 낮춤
      analyserRef.current.smoothingTimeConstant = 0.1; // 더 빠른 반응
      console.log('Analyser 설정:', analyserRef.current);
      
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
      microphoneRef.current.connect(analyserRef.current);
      console.log('마이크 소스 연결 완료');
      
      setIsInitialized(true);
      console.log('마이크 초기화 완료 - 모든 설정 완료');
      
    } catch (error) {
      console.error('마이크 접근 권한이 필요합니다:', error);
      setError('마이크 접근 권한을 허용해주세요.');
    }
  };

  // 녹음 시작
  const startRecording = async () => {
    try {
      console.log('녹음 시작 함수 호출됨');
      console.log('현재 상태 - isInitialized:', isInitialized, 'streamRef:', !!streamRef.current);
      
      if (!isInitialized) {
        console.log('마이크 초기화 필요 - 초기화 시작');
        await initializeMicrophone();
      }
      
      if (!streamRef.current) {
        throw new Error('마이크가 초기화되지 않았습니다.');
      }
      
      // MediaRecorder 설정
      mediaRecorderRef.current = new MediaRecorder(streamRef.current);
      console.log('MediaRecorder 생성됨');
      
      // 녹음 시간 업데이트
      durationIntervalRef.current = setInterval(() => {
        setRecordingDuration(Math.floor((Date.now() - recordingStartTimeRef.current) / 1000));
      }, 1000);
      
      // 녹음 데이터 처리
      const chunks: Blob[] = [];
      mediaRecorderRef.current.ondataavailable = (event) => {
        chunks.push(event.data);
      };
      
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        setRecordedAudio(url);
        console.log('녹음 완료:', url);
      };
      
      mediaRecorderRef.current.start();
      console.log('녹음 시작됨');
      
      // 상태 설정 후 볼륨 모니터링 시작
      setIsRecording(true);
      isRecordingRef.current = true; // ref도 동시에 업데이트
      setRecordingDuration(0);
      recordingStartTimeRef.current = Date.now();
      
      console.log('녹음 상태 설정 완료 - isRecording을 true로 설정');
      
      // 즉시 볼륨 모니터링 시작
      console.log('볼륨 모니터링 시작...');
      updateVolume();
      
    } catch (error) {
      console.error('녹음 시작 실패:', error);
      setError('녹음을 시작할 수 없습니다. 마이크 권한을 확인해주세요.');
    }
  };

  // 녹음 중지
  const stopRecording = () => {
    console.log('녹음 중지 함수 호출됨');
    
    if (mediaRecorderRef.current && isRecordingRef.current) {
      mediaRecorderRef.current.stop();
      console.log('MediaRecorder 중지됨');
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      console.log('AnimationFrame 취소됨');
    }
    
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
      console.log('Duration Interval 취소됨');
    }
    
    setIsRecording(false);
    isRecordingRef.current = false; // ref도 동시에 업데이트
    setVolume(0);
    setAudioLevel(0);
    
    console.log('녹음 중지됨 - 볼륨 리셋');
  };

  // 녹음 재생
  const playRecording = () => {
    if (recordedAudio && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // 녹음 중지
  const stopPlaying = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  // 녹음 다운로드
  const downloadRecording = () => {
    if (recordedAudio) {
      const a = document.createElement('a');
      a.href = recordedAudio;
      a.download = `recording-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  // 마이크 해제
  const cleanupMicrophone = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    analyserRef.current = null;
    microphoneRef.current = null;
    setIsInitialized(false);
  };

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
      if (mediaRecorderRef.current && isRecordingRef.current) {
        stopRecording();
      }
      cleanupMicrophone();
      
      // 녹음된 오디오 URL 정리
      if (recordedAudio) {
        URL.revokeObjectURL(recordedAudio);
      }
    };
  }, []);

  // 컴포넌트 마운트 시 마이크 초기화
  useEffect(() => {
    initializeMicrophone();
  }, []);

  // 오디오 재생 완료 시 처리
  useEffect(() => {
    if (audioRef.current) {
      const handleEnded = () => setIsPlaying(false);
      audioRef.current.addEventListener('ended', handleEnded);
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('ended', handleEnded);
        }
      };
    }
  }, [recordedAudio]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>음성 녹음</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-6">
        {/* 녹음 버튼 */}
        <div className="relative">
          {/* 소리 증폭 효과 (바깥쪽 원들) */}
          {isRecording && audioLevel > 0.02 && (
            <>
              {/* 첫 번째 증폭 원 */}
                              <div 
                  className={`absolute inset-0 rounded-full border-2 transition-all duration-200 ${
                    audioLevel > 0.8 ? 'border-red-400' : 'border-green-400'
                  }`}
                style={{
                  transform: `scale(${1 + audioLevel * 0.5})`,
                  opacity: audioLevel * 0.6
                }}
              />
              {/* 두 번째 증폭 원 */}
                              <div 
                  className={`absolute inset-0 rounded-full border-2 transition-all duration-300 ${
                    audioLevel > 0.8 ? 'border-red-300' : 'border-green-300'
                  }`}
                style={{
                  transform: `scale(${1 + audioLevel * 0.8})`,
                  opacity: audioLevel * 0.4
                }}
              />
              {/* 세 번째 증폭 원 */}
                              <div 
                  className={`absolute inset-0 rounded-full border-2 transition-all duration-400 ${
                    audioLevel > 0.8 ? 'border-red-200' : 'border-green-200'
                  }`}
                style={{
                  transform: `scale(${1 + audioLevel * 1.2})`,
                  opacity: audioLevel * 0.2
                }}
              />
            </>
          )}
          
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={!isInitialized && !error}
            className={`
              relative w-24 h-24 rounded-full flex items-center justify-center text-white transition-all duration-200
              ${getButtonColor()}
              ${isRecording && audioLevel > 0.02 ? 'animate-pulse' : ''}
              ${!isInitialized && !error ? 'opacity-50 cursor-not-allowed' : 'shadow-lg hover:shadow-xl transform hover:scale-105'}
            `}
            style={{
              transform: isRecording && audioLevel > 0.02 ? `scale(${1 + audioLevel * 0.1})` : 'scale(1)'
            }}
          >
            {isRecording ? (
              <Square size={32} />
            ) : (
              <Mic size={32} />
            )}
          </button>
        </div>
        
        {/* 실시간 볼륨 표시 */}
        {isRecording && (
          <div className="text-xs text-gray-500 text-center">
            현재 볼륨: {Math.round(audioLevel * 100)}% | 증폭: {Math.round(audioLevel * 120)}%
          </div>
        )}

        {/* 상태 표시 */}
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">
            {isRecording ? `녹음 중... (${recordingDuration}s)` : '녹음 시작'}
          </p>
          <p className="text-sm text-gray-600">
            {isRecording ? '중지하려면 버튼을 클릭하세요' : '녹음을 시작하려면 버튼을 클릭하세요'}
          </p>
          {!isInitialized && !error && (
            <p className="text-sm text-blue-600 mt-2">마이크 초기화 중...</p>
          )}
          {error && (
            <p className="text-sm text-red-600 mt-2">{error}</p>
          )}
        </div>

        {/* 볼륨 레벨 표시 */}
        {isRecording && (
          <div className="w-full max-w-md">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>볼륨 레벨</span>
              <span>{Math.round(audioLevel * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-100 ${
                  audioLevel > 0.8 ? 'bg-red-500' : 
                  audioLevel > 0.02 ? 'bg-green-500' : 'bg-blue-500'
                }`}
                style={{ width: `${audioLevel * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>대기</span>
              <span>소리 감지</span>
              <span>너무 큼</span>
            </div>
            {/* 디버깅 정보 */}
            <div className="text-xs text-gray-400 mt-2 text-center">
              Average: {(audioLevel / 10 * 255).toFixed(1)} | Level: {audioLevel.toFixed(3)}
            </div>
          </div>
        )}

        {/* 녹음된 오디오 재생 컨트롤 */}
        {recordedAudio && (
          <div className="w-full max-w-md space-y-4">
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-3 text-center">녹음된 오디오</h3>
              
              {/* 오디오 플레이어 */}
              <audio 
                ref={audioRef}
                src={recordedAudio} 
                controls 
                className="w-full mb-3"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
              
              {/* 컨트롤 버튼들 */}
              <div className="flex space-x-2 justify-center">
                <button
                  onClick={isPlaying ? stopPlaying : playRecording}
                  className={`px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors ${
                    isPlaying 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-green-500 hover:bg-green-600'
                  }`}
                >
                  {isPlaying ? '정지' : '재생'}
                </button>
                
                <button
                  onClick={downloadRecording}
                  className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors"
                >
                  다운로드
                </button>
                
                <button
                  onClick={() => {
                    setRecordedAudio('');
                    setIsPlaying(false);
                    if (recordedAudio) {
                      URL.revokeObjectURL(recordedAudio);
                    }
                  }}
                  className="px-4 py-2 rounded-lg bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium transition-colors"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 증폭 효과 가이드 */}
        <div className="flex space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>대기</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>소리 감지</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>매우 큰 소리</span>
          </div>
        </div>
        
        {/* 증폭 효과 설명 */}
        <div className="text-xs text-gray-500 text-center max-w-md">
          소리가 감지되면 버튼 주변에 원이 나타나고, 소리가 클수록 더 많은 원이 더 크게 확장됩니다.
        </div>
      </CardContent>
    </Card>
  );
}

