'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Button, Input, Card } from 'antd';
import { MessageOutlined, SendOutlined, CloseOutlined } from '@ant-design/icons';

const { TextArea } = Input;

interface Message {
  type: 'bot' | 'user';
  content: string;
}

interface Option {
  id: string;
  title: string;
  description: string;
}

const Button28Page: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [remainingEdits, setRemainingEdits] = useState(3); // 남은 수정 횟수
  const [isTyping, setIsTyping] = useState(false); // AI 타이핑 중인지
  const [typingContent, setTypingContent] = useState(''); // 타이핑 중인 내용
  const [isApplying, setIsApplying] = useState(false); // 적용 중인지
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const options: Option[] = [
    {
      id: 'intervention-goal',
      title: '주호소 문제에 따른 개입 목표',
      description: '주요 호소 문제를 바탕으로 설정한 개입 목표를 확인하고 수정할 수 있습니다.',
    },
    {
      id: 'intervention-content',
      title: '상담 및 치료적 개입 내용',
      description: '아동은 초기 치료 적응 과정에서 치료자와의 관계 형성이 원활하게 이루어졌으며 치료 환경에도 안정적으로 참여하고 있다. 언어 과제에 대한 이해도가 점차 향상되고 있으며, 지시 따르기와 표현 능력에서 긍정적인 변화를 보이고 있다. 상담에서는 가정 내 언어 자극 제공 방법과 반복 연습의 중요성을 공유하였다. 향후에도 아동의 의사소통 능력 강화를 위해 지속적인 모니터링과 개별화된 치료적 접근을 이어갈 예정이다.',
    },
    {
      id: 'guardian-consultation',
      title: '보호자 상담',
      description: '보호자 상담에서는 아동의 현재 발달 과정에서 부족한 부분에 대해 구체적으로 설명하였다. 상담자는 해당 부분의 특성을 함께 확인하며 앞으로의 해결 방향과 목표를 제시하였다. 보호자는 상담 내용을 경청하며 아동의 긍정적인 성장을 도울 예정이다.',
    },
    {
      id: 'change-degree',
      title: '목표에 따른 변화정도',
      description: '아동은 언어치료 초기보다 발화 길이가 약간 증가하였으며, 문장 내 단어의 사용이 자연스러워지고 다양한 어휘 표현 시도가 관찰된다. 지시어나 접속어 사용에 대한 이해도 향상되어 치료 목표에 따른 변화가 점진적으로 나타나고 있다. 또래 아동과의 간단한 대화 상황에서도 이해와 표현이 원활해지는 모습을 보이며, 지속적인 치료 참여를 통해 목표 달성을 향해 긍정적인 변화를 보이고 있다.',
    },
    {
      id: 'future-goal',
      title: '추후 개입 목표',
      description: '아이는 입술이 완전히 닿지 않은 채 발음을 할 때 공기가 새어나오는 모습이 관찰된다. 특히 ㅋ 발음에서 이러한 현상이 두드러지며, 정확한 발음을 위해 해당 소리에 대한 체계적인 훈련이 필요하다.',
    },
    {
      id: 'future-plan',
      title: '추후 개입 계획',
      description: '아이는 ‘ㅋ’ 발음을 보다 정확히 구사할 수 있도록 단어와 문장을 활용한 말하기 놀이 형태의 발음 연습을 진행할 예정이다.',
    },
  ];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          type: 'bot',
          content: '어떤 부분 수정을 원하시나요?',
        },
      ]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingContent]);

  const handleOptionSelect = (option: Option) => {
    setSelectedOption(option);
    setRemainingEdits(3); // 새로운 옵션 선택 시 수정 횟수 초기화
    const newMessages: Message[] = [
      ...messages,
      {
        type: 'user',
        content: option.title,
      },
      {
        type: 'bot',
        content: `'${option.title}'의 내용은 이거야.\n\n${option.description}\n\n어떻게 수정해줄까?`,
      },
    ];
    setMessages(newMessages);
  };

  // AI가 텍스트를 수정하는 함수 (예시)
  const modifyText = (original: string, userRequest: string): string => {
    // 간단한 예시: 실제로는 AI API를 호출해야 함
    // 여기서는 사용자 요청에 따라 텍스트를 약간 수정하는 예시
    let modified = original;
    
    // 사용자 요청에 따라 간단한 수정 (실제로는 AI가 처리)
    if (userRequest.includes('더 자세히') || userRequest.includes('상세히')) {
      modified = original + ' 더 구체적으로 설명하면, 치료 과정에서 지속적인 관찰과 평가를 통해 아동의 발달 상황을 면밀히 모니터링하고 있다.';
    } else if (userRequest.includes('간단히') || userRequest.includes('요약')) {
      modified = original.split('.').slice(0, 2).join('.') + '.';
    } else {
      // 기본 수정: 문장을 더 자연스럽게
      modified = original.replace(/이다\./g, '입니다.').replace(/하였다\./g, '했습니다.');
    }
    
    return modified;
  };

  // 타이핑 애니메이션 효과 (최소 3초)
  const typeText = (text: string, callback: () => void) => {
    setIsTyping(true);
    setTypingContent('');
    const startTime = Date.now();
    const minDuration = 3000; // 최소 3초
    const updateInterval = 30; // 업데이트 간격 (ms)
    
    const typingInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      
      // 시간에 비례해서 인덱스 계산 (3초에 걸쳐 타이핑)
      const progress = Math.min(elapsed / minDuration, 1);
      const index = Math.floor(progress * text.length);
      
      setTypingContent(text.substring(0, index));
      
      // 최소 3초가 지났고 텍스트도 모두 타이핑되었으면 종료
      if (elapsed >= minDuration && index >= text.length) {
        clearInterval(typingInterval);
        setTypingContent(text);
        setIsTyping(false);
        callback();
      }
    }, updateInterval);
  };

  const handleSendMessage = () => {
    const trimmedInput = userInput.trim();
    if (!trimmedInput || remainingEdits <= 0) return;

    // 사용자 메시지 추가
    const newMessages: Message[] = [
      ...messages,
      {
        type: 'user',
        content: trimmedInput,
      },
    ];
    setMessages(newMessages);
    setUserInput('');
    setRemainingEdits(prev => prev - 1);

    // AI가 수정 중임을 표시
    const originalText = selectedOption?.description || '';
    const modifiedText = modifyText(originalText, trimmedInput);
    
    // 타이핑 애니메이션 시작
    const typingMessage = 'AI가 수정 중입니다......';
    typeText(typingMessage, () => {
      // 타이핑 완료 후 수정된 텍스트 표시
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            type: 'bot',
            content: `이렇게 수정됐어!!\n\n${modifiedText}\n\n한번 더 수정할래?`,
          },
        ]);
      }, 300);
    });
  };

  const handleReset = () => {
    setSelectedOption(null);
    setMessages([
      {
        type: 'bot',
        content: '어떤 부분 수정을 원하시나요?',
      },
    ]);
    setUserInput('');
    setRemainingEdits(3);
    setIsTyping(false);
    setTypingContent('');
  };

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {/* 챗봇 버튼 */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-50"
          style={{ position: 'fixed', bottom: '24px', right: '24px' }}
        >
          <MessageOutlined className="text-2xl" />
        </button>
      )}

      {/* 챗봇 창 */}
      {isOpen && (
        <div 
          className="fixed w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden relative"
          style={{ position: 'fixed', bottom: '24px', right: '24px' }}
        >
          {/* 적용 중 오버레이 */}
          {isApplying && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center rounded-2xl">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
                <p className="text-lg font-semibold text-gray-700">적용 중...</p>
                <p className="text-sm text-gray-500 mt-1">잠시만 기다려주세요</p>
              </div>
            </div>
          )}
          {/* 헤더 */}
          
          <div className="bg-blue-500 text-white p-4 flex items-center justify-between rounded-t-2xl">
            
            <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">AI 수정 도우미</h3>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block bg-white/20 text-white text-xs font-medium px-2 py-1 rounded-full">
                  아동청소년심리지원서비스
                </span>
                <span className="text-xs text-blue-100">서비스 중간점검 보고서</span>
              </div>
              
              {selectedOption ? (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-blue-100">남은 수정 횟수</span>
                    <span className="text-sm font-bold">{remainingEdits}/3</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-white/60 via-white/80 to-white rounded-full transition-all duration-300"
                      style={{ width: `${(remainingEdits / 3) * 100}%` }}
                    />
                  </div>
                </div>
              ) : (
                <p className="text-xs text-blue-100 mt-1">어떤 부분을 수정할까요?</p>
              )}
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                handleReset();
              }}
              className="text-white hover:text-gray-200 transition-colors ml-4"
            >
              <CloseOutlined className="text-xl" />
            </button>
          </div>

          {/* 메시지 영역 */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
            {messages.map((message, index) => {
              const isEditResultMessage = message.type === 'bot' && message.content.includes('이렇게 수정됐어');
              
              return (
                <div key={index}>
                  <div
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.type === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-gray-800 shadow-sm'
                      }`}
                      style={{
                        borderRadius: message.type === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                      }}
                    >
                      <p className="text-sm whitespace-pre-line">{message.content}</p>
                    </div>
                  </div>
                  {/* 수정 횟수 표시 및 적용하기 버튼 (수정 결과 메시지 아래에만) */}
                  {isEditResultMessage && selectedOption && (
                    <div className="ml-2 space-y-2">
                      <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-full px-3 py-1.5 flex items-center gap-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-gray-600 font-medium">남은 수정 횟수</span>
                            <span className="text-xs font-bold text-blue-600">{remainingEdits}/3</span>
                          </div>
                          <div className="w-16 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-full transition-all duration-300"
                              style={{ width: `${(remainingEdits / 3) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <button
                          onClick={() => {
                            setIsApplying(true);
                            // 적용 중 애니메이션 후 챗봇 닫기
                            setTimeout(() => {
                              setIsOpen(false);
                              handleReset();
                              setIsApplying(false);
                            }, 2000); // 2초 후 닫기
                          }}
                          className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full text-sm font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                        >
                          ✓ 이대로 적용하기
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* AI 타이핑 중 표시 */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-white text-gray-800 shadow-sm">
                  <p className="text-sm">
                    {typingContent}
                    <span className="animate-pulse">|</span>
                  </p>
                </div>
              </div>
            )}

            {/* 선택 옵션들 */}
            {!selectedOption && messages.length === 1 && (
              <div className="space-y-2">
                {options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleOptionSelect(option)}
                    className="w-full text-left p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all hover:bg-blue-50 border border-gray-100 hover:border-blue-200"
                  >
                    <div className="font-medium text-gray-800">{option.title}</div>
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* 입력 영역 */}
          {selectedOption && (
            <div className="p-4 bg-white border-t border-gray-200">
              {remainingEdits <= 0 ? (
                <div className="text-center py-4 space-y-3">
                  <p className="text-sm text-gray-500">
                    수정 횟수가 모두 소진되었습니다.
                  </p>
                  <button
                    onClick={() => {
                      // 토큰을 사용하여 수정 횟수 추가
                      setRemainingEdits(3);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium text-sm transition-all shadow-md hover:shadow-lg"
                  >
                    🪙 토큰을 사용하여 추가 수정하기
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <TextArea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="수정 내용을 입력해주세요..."
                    autoSize={{ minRows: 1, maxRows: 4 }}
                    disabled={isTyping || remainingEdits <= 0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey && !isTyping && remainingEdits > 0) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="rounded-xl"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!userInput.trim() || isTyping || remainingEdits <= 0}
                    className="w-12 h-12 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-colors"
                  >
                    <SendOutlined />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Button28Page;
