'use client'

import React, { useState, useEffect } from 'react';
import { Input, Button, Card, Badge } from 'antd';
import { 
  SearchOutlined, 
  UserOutlined, 
  FileTextOutlined, 
  FolderOutlined,
  CloseOutlined,
  LogoutOutlined,
  CheckCircleOutlined,
  EditOutlined
} from '@ant-design/icons';

interface Child {
  id: string;
  name: string;
  gender: '남' | '여';
  birthDate: string;
  age: string;
  serviceCount: number;
}

interface FileItem {
  id: string;
  name: string;
  isCompleted: boolean;
}

interface Service {
  id: string;
  name: string;
}

const Button29Page: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('치료 상태');
  const [isServiceSelectOpen, setIsServiceSelectOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [completedFiles, setCompletedFiles] = useState<Set<string>>(new Set());

  const children: Child[] = [
    { id: '1', name: '김카누', gender: '남', birthDate: '25.05.31', age: '5개월', serviceCount: 0 },
    { id: '2', name: '박창민', gender: '남', birthDate: '20.01.01', age: '5년 10개월', serviceCount: 0 },
    { id: '3', name: '파닉스', gender: '남', birthDate: '25.01.01', age: '10개월', serviceCount: 1 },
    { id: '4', name: '김누리', gender: '남', birthDate: '20.01.01', age: '5년 10개월', serviceCount: 1 },
    { id: '5', name: '한글', gender: '남', birthDate: '25.01.01', age: '10개월', serviceCount: 0 },
    { id: '6', name: '도레미', gender: '남', birthDate: '20.01.01', age: '5년 10개월', serviceCount: 1 },
    { id: '7', name: '신하리', gender: '여', birthDate: '21.11.19', age: '4년', serviceCount: 1 },
    { id: '8', name: '최혜리', gender: '여', birthDate: '20.07.07', age: '5년 4개월', serviceCount: 2 },
    { id: '9', name: '이해찬', gender: '남', birthDate: '21.08.22', age: '4년 3개월', serviceCount: 1 },
    { id: '10', name: '이단우', gender: '남', birthDate: '21.03.15', age: '4년 8개월', serviceCount: 3 },
  ];

  const services: Service[] = [
    { id: '1', name: '장애아동가족지원-발달재활바우처 나형 [언어]' },
    { id: '2', name: '장애아동가족지원-발달재활바우처 나형 [심리]' },
    { id: '3', name: '일반 [언어]' },
    { id: '4', name: '아동청소년심리서비스 가형 [미술]' },
  ];

  const initialFiles: FileItem[] = [
    { id: '1', name: '접수상담 기록부', isCompleted: false },
    { id: '2', name: '평가 진단서', isCompleted: false },
    { id: '3', name: '발달 재활 의뢰서', isCompleted: false },
  ];

  const serviceFiles: FileItem[] = [
    { id: '4', name: '장 단기 치료계획서', isCompleted: false },
    { id: '5', name: '서비스 제공 계획서', isCompleted: false },
    { id: '6', name: '서비스 일정표', isCompleted: false },
    { id: '7', name: '서비스 제공기록지', isCompleted: false },
    { id: '8', name: '중간(진전) 보고서', isCompleted: false },
    { id: '9', name: '종료 보고서', isCompleted: false },
  ];

  const contractFiles: FileItem[] = [
    { id: '10', name: '계약서', isCompleted: false },
    { id: '11', name: '치료 동의서', isCompleted: false },
    { id: '12', name: '개인정보 수집 동의서', isCompleted: false },
  ];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const filteredChildren = children.filter(child =>
    child.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileComplete = (fileId: string) => {
    setCompletedFiles(prev => new Set(prev).add(fileId));
  };

  const allInitialFilesCompleted = initialFiles.every(file => completedFiles.has(file.id));

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setIsServiceSelectOpen(false);
  };

  const folderName = selectedService ? selectedService.name : '수업 시작전';
  const isTemporary = !selectedService;

  if (!isMounted) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* 헤더 */}
      <div className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">말이랑 문서함</h1>
        <button className="text-white hover:text-gray-200 transition-colors">
          <CloseOutlined className="text-xl" />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* 왼쪽 사이드바 - 아동 리스트 */}
        <div className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
          selectedChild ? 'w-80' : 'w-80'
        }`}>
          {/* 나가기 버튼 */}
          <div className="p-4 border-b border-gray-200">
            <Button
              icon={<LogoutOutlined />}
              className="w-full"
              onClick={() => {
                setSelectedChild(null);
                setSelectedService(null);
                setCompletedFiles(new Set());
                setIsServiceSelectOpen(false);
              }}
            >
              나가기
            </Button>
          </div>

          {/* 검색 */}
          <div className="p-4 border-b border-gray-200">
            <Input
              placeholder="아동명으로 검색하세요."
              prefix={<SearchOutlined />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-lg"
            />
          </div>

          {/* 필터 */}
          <div className="p-4 border-b border-gray-200 flex gap-2">
            {['치료 상태', '담당 선생님', '바우처'].map((filter) => (
              <Button
                key={filter}
                type={activeFilter === filter ? 'primary' : 'default'}
                size="small"
                onClick={() => setActiveFilter(filter)}
                className="flex-1"
              >
                {filter}
              </Button>
            ))}
          </div>

          {/* 아동 리스트 */}
          <div className="flex-1 overflow-y-auto">
            {filteredChildren.map((child) => (
              <div
                key={child.id}
                onClick={() => {
                  setSelectedChild(child);
                  setSelectedService(null);
                  setCompletedFiles(new Set());
                  setIsServiceSelectOpen(false);
                }}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-blue-50 transition-colors ${
                  selectedChild?.id === child.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-800">{child.name}</span>
                  <span className="text-sm text-gray-500">
                    서비스 {child.serviceCount} {'>'}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {child.gender} {child.birthDate} ({child.age})
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 문서함 슬라이드 패널 */}
        {selectedChild && (
          <div 
            className="absolute left-80 top-0 bottom-0 w-96 bg-white border-r border-gray-200 shadow-xl z-40 transition-all duration-300"
            style={{
              animation: 'slideIn 0.3s ease-out',
            }}
          >
            <div className="h-full overflow-y-auto">
              <div className="p-6">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-bold">{selectedChild.name} 문서함</h2>
                    <button
                      onClick={() => {
                        setSelectedChild(null);
                        setSelectedService(null);
                        setCompletedFiles(new Set());
                        setIsServiceSelectOpen(false);
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <CloseOutlined />
                    </button>
                  </div>
                  <p className="text-gray-500">
                    {selectedChild.gender} {selectedChild.birthDate} ({selectedChild.age})
                  </p>
                </div>

                {/* 폴더 */}
                <Card
                  className={`mb-4 transition-all ${
                    isTemporary
                      ? 'opacity-60 border-dashed border-2 border-gray-300 bg-gray-50'
                      : 'opacity-100 border-solid border border-gray-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-4">
                    <FolderOutlined className={`text-2xl flex-shrink-0 mt-1 ${isTemporary ? 'text-gray-400' : 'text-blue-500'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className={`text-lg font-semibold break-words ${isTemporary ? 'text-gray-500' : 'text-gray-800'}`}>
                          {folderName}
                        </h3>
                        {isTemporary && (
                          <Badge count="임시" className="bg-gray-400 text-white text-xs px-2 py-0.5 rounded flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 임시 폴더 파일 리스트 */}
                  {isTemporary && (
                    <div className="space-y-2">
                      {initialFiles.map((file) => (
                        <div
                          key={file.id}
                          className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                            completedFiles.has(file.id)
                              ? 'bg-green-50 border-green-200'
                              : 'bg-white border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <FileTextOutlined
                              className={completedFiles.has(file.id) ? 'text-green-500' : 'text-gray-400'}
                            />
                            <span className={completedFiles.has(file.id) ? 'text-green-700 font-medium' : 'text-gray-700'}>
                              {file.name}
                            </span>
                          </div>
                          {completedFiles.has(file.id) ? (
                            <CheckCircleOutlined className="text-green-500" />
                          ) : (
                            <Button
                              size="small"
                              onClick={() => handleFileComplete(file.id)}
                              className="text-xs"
                            >
                              작성하기
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 서비스 선택 후 파일 리스트 */}
                  {selectedService && (
                    <>
                      {/* 고정 문서 (접수상담 기록부, 평가 진단서, 발달 재활 의뢰서) */}
                      <div className="mb-4 bg-gray-50 border-2 border-gray-200 rounded-lg p-3">
                        <div className="space-y-2">
                          {initialFiles.map((file) => (
                            <div
                              key={file.id}
                              className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                                completedFiles.has(file.id)
                                  ? 'bg-green-50 border-green-200'
                                  : 'bg-white border-gray-200'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <FileTextOutlined
                                  className={completedFiles.has(file.id) ? 'text-green-500' : 'text-gray-400'}
                                />
                                <span className={completedFiles.has(file.id) ? 'text-green-700 font-medium' : 'text-gray-700'}>
                                  {file.name}
                                </span>
                              </div>
                              <Button
                                size="small"
                                icon={<EditOutlined />}
                                onClick={() => handleFileComplete(file.id)}
                                className="text-xs"
                              >
                                {completedFiles.has(file.id) ? '편집' : '작성하기'}
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 서비스 파일 리스트 */}
                      <div className="space-y-2 mb-4">
                        {serviceFiles.map((file) => (
                          <div
                            key={file.id}
                            className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                              completedFiles.has(file.id)
                                ? 'bg-green-50 border-green-200'
                                : 'bg-white border-gray-200 hover:border-blue-300'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <FileTextOutlined
                                className={completedFiles.has(file.id) ? 'text-green-500' : 'text-gray-400'}
                              />
                              <span className={completedFiles.has(file.id) ? 'text-green-700 font-medium' : 'text-gray-700'}>
                                {file.name}
                              </span>
                            </div>
                            {completedFiles.has(file.id) ? (
                              <CheckCircleOutlined className="text-green-500" />
                            ) : (
                              <Button
                                size="small"
                                onClick={() => handleFileComplete(file.id)}
                                className="text-xs"
                              >
                                작성하기
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* 구분선 */}
                      <div className="border-t border-gray-300 my-4"></div>

                      {/* 계약 관련 파일 리스트 */}
                      <div className="space-y-2">
                        {contractFiles.map((file) => (
                          <div
                            key={file.id}
                            className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                              completedFiles.has(file.id)
                                ? 'bg-green-50 border-green-200'
                                : 'bg-white border-gray-200 hover:border-blue-300'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <FileTextOutlined
                                className={completedFiles.has(file.id) ? 'text-green-500' : 'text-gray-400'}
                              />
                              <span className={completedFiles.has(file.id) ? 'text-green-700 font-medium' : 'text-gray-700'}>
                                {file.name}
                              </span>
                            </div>
                            {completedFiles.has(file.id) ? (
                              <CheckCircleOutlined className="text-green-500" />
                            ) : (
                              <Button
                                size="small"
                                onClick={() => handleFileComplete(file.id)}
                                className="text-xs"
                              >
                                작성하기
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* 안내 텍스트 (임시 폴더일 때만 표시) */}
                  {isTemporary && (
                    <p className="text-sm text-gray-500 mt-3">
                      * 접수 기록부, 평가진단서가 작성이 완료되면 서비스 선택이 가능합니다.
                    </p>
                  )}

                  {/* 서비스 선택 버튼 (초기 파일들이 모두 완료되었을 때만 표시) */}
                  {isTemporary && allInitialFilesCompleted && !isServiceSelectOpen && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <Button
                        type="primary"
                        size="large"
                        className="w-full"
                        onClick={() => setIsServiceSelectOpen(true)}
                      >
                        서비스 선택
                      </Button>
                    </div>
                  )}

                  {/* 서비스 선택 리스트 */}
                  {isServiceSelectOpen && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="font-semibold mb-3">서비스를 선택해주세요</h4>
                      <div className="space-y-2">
                        {services.map((service) => (
                          <Button
                            key={service.id}
                            block
                            size="large"
                            className="text-left h-auto py-3 whitespace-normal break-words"
                            onClick={() => handleServiceSelect(service)}
                            style={{ wordBreak: 'break-word' }}
                          >
                            <span className="block text-sm leading-relaxed">{service.name}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* 오른쪽 영역 (비어있음) */}
        <div className="flex-1 bg-white"></div>
      </div>

      <style jsx global>{`
        @keyframes slideIn {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Button29Page;
