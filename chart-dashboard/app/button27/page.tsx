'use client'

import React, { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import { 
  Modal, 
  Form, 
  Input, 
  DatePicker, 
  Select, 
  Button, 
  Space, 
  InputNumber,
  Card,
  Divider
} from 'antd';
import { 
  UserOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  CalendarOutlined,
  DollarOutlined,
  EditOutlined,
  RobotOutlined,
  PlusOutlined,
  DeleteOutlined,
  FileOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

const Button27Page: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [isTyping, setIsTyping] = useState(false);
  const [servicePlanSteps, setServicePlanSteps] = useState([0]); // 서비스 계획 수립 단계 배열
  const [currentServicePlanIndex, setCurrentServicePlanIndex] = useState(0); // 현재 서비스 계획 인덱스
  const [showMonitoringModal, setShowMonitoringModal] = useState(false);
  const [showFinalModal, setShowFinalModal] = useState(false);

  // 클라이언트에서만 모달 열기
  useEffect(() => {
    setIsModalOpen(true);
  }, []);

  // 기본 단계들
  const baseSteps = [
    { title: '아동 및 보호자 정보', icon: UserOutlined },
    { title: '장애 아동정보', icon: FileTextOutlined },
    { title: '서비스 정보', icon: InfoCircleOutlined },
  ];

  // 서비스 계획 수립 단계들 (동적)
  const servicePlanStepTitles = servicePlanSteps.map((_, index) => ({
    title: `서비스 계획 수립 ${index + 1}`,
    icon: CalendarOutlined,
  }));

  // 나머지 단계들
  const remainingSteps = [
    { title: '이용 계획 및 비용', icon: DollarOutlined },
    { title: '기관 정보', icon: UserOutlined },
  ];

  // 전체 단계 배열
  const steps = [
    ...baseSteps,
    ...servicePlanStepTitles,
    ...remainingSteps,
  ];

  // 서비스 계획 수립 단계의 시작 인덱스
  const SERVICE_PLAN_START_INDEX = baseSteps.length;

  // 각 단계별 자동 입력 데이터
  const getAutoFillData = (step: number) => {
    // 기본 단계들
    if (step === 0) {
      return {
        childName: '김민수',
        serviceNumber: '2025-001234',
        birthDate: '2018-05-15',
        guardianName: '김철수',
        guardianPhone: '010-1234-5678',
      };
    }
    if (step === 1) {
      return {
        registrationType: '등록',
        disabilityLevel: '경증',
      };
    }
    if (step === 2) {
      return {
        serviceArea: '소근육',
        monthlyFee: 200000,
        selfPayment: 50000,
        issueDate: '2025-01-15',
      };
    }
    
    // 서비스 계획 수립 단계들
    if (step >= SERVICE_PLAN_START_INDEX && step < SERVICE_PLAN_START_INDEX + servicePlanSteps.length) {
      const planIndex = step - SERVICE_PLAN_START_INDEX;
      const planId = servicePlanSteps[planIndex];
      return {
        planId,
        mainNeeds: '소근육 발달을 위한 훈련이 필요합니다.',
        currentLevel: '현재 소근육 조작 능력이 또래보다 낮은 수준입니다.',
        shortTermGoal: '3개월 내 간단한 물건 집기와 놀이 활동을 할 수 있도록 합니다.',
        longTermGoal: '6개월 내 일상생활 활동에 필요한 소근육 기능을 습득합니다.',
      };
    }
    
    // 나머지 단계들
    const remainingStepIndex = step - SERVICE_PLAN_START_INDEX - servicePlanSteps.length;
    if (remainingStepIndex === 0) {
      return {
        serviceType: '개별치료',
        frequency: 8,
        serviceCost: 160000,
        selfPaymentCost: 40000,
      };
    }
    if (remainingStepIndex === 1) {
      return {
        organizationName: '제주 발달재활센터',
        manager: '이영희',
        phone: '064-123-4567',
        email: 'manager@center.kr',
      };
    }
    
    return {};
  };

  // 타이핑 애니메이션 함수
  const typeText = (fieldName: string, text: string, callback?: () => void) => {
    setIsTyping(true);
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= text.length) {
        form.setFieldsValue({ [fieldName]: text.substring(0, currentIndex) });
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
        if (callback) {
          setTimeout(callback, 300);
        }
      }
    }, 30);
  };

  // 단계별 자동 입력
  useEffect(() => {
    if (!isModalOpen) return;
    
    const stepData = getAutoFillData(currentStep);
    if (!stepData || Object.keys(stepData).length === 0) return;

    const fields = Object.keys(stepData);
    let fieldIndex = 0;

    const fillNextField = () => {
      if (fieldIndex >= fields.length) return;

      const fieldName = fields[fieldIndex];
      const value = stepData[fieldName as keyof typeof stepData];

      // 서비스 계획 수립 단계는 특별 처리
      if (currentStep >= SERVICE_PLAN_START_INDEX && currentStep < SERVICE_PLAN_START_INDEX + servicePlanSteps.length) {
        if (fieldName === 'planId') {
          fieldIndex++;
          if (fieldIndex < fields.length) {
            setTimeout(fillNextField, 100);
          }
          return;
        }
        
        const planIndex = currentStep - SERVICE_PLAN_START_INDEX;
        const planId = servicePlanSteps[planIndex];
        const fieldPath = `servicePlans.${planId}.${fieldName}`;
        
        if (typeof value === 'string') {
          typeText(fieldPath, value, () => {
            fieldIndex++;
            if (fieldIndex < fields.length) {
              fillNextField();
            }
          });
        } else {
          form.setFieldsValue({ [fieldPath]: value });
          fieldIndex++;
          if (fieldIndex < fields.length) {
            setTimeout(fillNextField, 500);
          }
        }
        return;
      }

      if (fieldName.includes('Date') || fieldName.includes('date')) {
        fieldIndex++;
        if (fieldIndex < fields.length) {
          setTimeout(fillNextField, 300);
        }
        return;
      }

      if (typeof value === 'string') {
        typeText(fieldName, value, () => {
          fieldIndex++;
          if (fieldIndex < fields.length) {
            fillNextField();
          }
        });
      } else if (typeof value === 'number') {
        const valueStr = value.toString();
        typeText(fieldName, valueStr, () => {
          fieldIndex++;
          if (fieldIndex < fields.length) {
            fillNextField();
          }
        });
      } else {
        form.setFieldsValue({ [fieldName]: value });
        fieldIndex++;
        if (fieldIndex < fields.length) {
          setTimeout(fillNextField, 500);
        }
      }
    };

    const startDelay = setTimeout(() => {
      fillNextField();
    }, 500);

    return () => {
      clearTimeout(startDelay);
    };
  }, [currentStep, isModalOpen, servicePlanSteps]);

  const [isStepComplete, setIsStepComplete] = useState(false);

  // 단계별 필드 완료 여부 확인
  useEffect(() => {
    const checkStepComplete = async () => {
      try {
        const stepData = getAutoFillData(currentStep);
        
        // 서비스 계획 수립 단계는 특별 처리
        if (currentStep >= SERVICE_PLAN_START_INDEX && currentStep < SERVICE_PLAN_START_INDEX + servicePlanSteps.length) {
          const planIndex = currentStep - SERVICE_PLAN_START_INDEX;
          const planId = servicePlanSteps[planIndex];
          const values = form.getFieldsValue();
          const plan = values.servicePlans?.[planId];
          
          const isComplete = plan?.mainNeeds && plan?.currentLevel && plan?.shortTermGoal && plan?.longTermGoal;
          setIsStepComplete(!!isComplete);
          return;
        }

        if (!stepData || Object.keys(stepData).length === 0) {
          setIsStepComplete(true);
          return;
        }

        const fields = Object.keys(stepData).filter(f => f !== 'planId');
        const values = form.getFieldsValue();
        
        let allFilled = true;
        for (const field of fields) {
          const value = values[field];
          if (value === undefined || value === null || value === '') {
            allFilled = false;
            break;
          }
        }

        setIsStepComplete(allFilled);
      } catch (error) {
        setIsStepComplete(false);
      }
    };

    const timer = setInterval(checkStepComplete, 200);
    checkStepComplete();

    return () => clearInterval(timer);
  }, [currentStep, form, isTyping, servicePlanSteps]);

  const handleNext = async () => {
    try {
      const values = await form.validateFields();
      
      // 마지막 단계 완료 시 모니터링 모달
      if (currentStep === steps.length - 1) {
        setIsModalOpen(false);
        setShowMonitoringModal(true);
      } else if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
        setIsStepComplete(false);
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setCurrentStep(0);
    setServicePlanSteps([0]);
  };

  const addServicePlan = () => {
    const newId = Math.max(...servicePlanSteps, -1) + 1;
    const newSteps = [...servicePlanSteps, newId];
    setServicePlanSteps(newSteps);
    // 새로운 서비스 계획 단계로 이동
    setCurrentStep(SERVICE_PLAN_START_INDEX + newSteps.length - 1);
    setIsStepComplete(false);
  };

  const renderStepContent = () => {
    // 서비스 계획 수립 단계 처리
    if (currentStep >= SERVICE_PLAN_START_INDEX && currentStep < SERVICE_PLAN_START_INDEX + servicePlanSteps.length) {
      const planIndex = currentStep - SERVICE_PLAN_START_INDEX;
      const planId = servicePlanSteps[planIndex];
      
      return (
        <>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">서비스 계획 수립 {planIndex + 1}</h3>
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={addServicePlan}
            >
              서비스 계획 추가
            </Button>
          </div>
          <Form.Item
            name={['servicePlans', planId, 'mainNeeds']}
            rules={[{ required: true, message: '주요 욕구를 입력해주세요!' }]}
            className="mb-4"
          >
            <div className="flex items-center gap-4">
              <span className="w-40 text-right font-medium">주요 욕구</span>
              <TextArea rows={3} placeholder="주요 욕구를 문장으로 작성하세요" className="flex-1 text-left" />
            </div>
          </Form.Item>
          <Form.Item
            name={['servicePlans', planId, 'currentLevel']}
            rules={[{ required: true, message: '현행 수준을 입력해주세요!' }]}
            className="mb-4"
          >
            <div className="flex items-center gap-4">
              <span className="w-40 text-right font-medium">현행 수준</span>
              <TextArea rows={3} placeholder="현행 수준을 문장으로 작성하세요" className="flex-1 text-left" />
            </div>
          </Form.Item>
          <Form.Item
            name={['servicePlans', planId, 'shortTermGoal']}
            rules={[{ required: true, message: '단기 목표를 입력해주세요!' }]}
            className="mb-4"
          >
            <div className="flex items-center gap-4">
              <span className="w-40 text-right font-medium">단기 목표</span>
              <TextArea rows={3} placeholder="단기 목표를 문장으로 작성하세요" className="flex-1 text-left" />
            </div>
          </Form.Item>
          <Form.Item
            name={['servicePlans', planId, 'longTermGoal']}
            rules={[{ required: true, message: '장기 목표를 입력해주세요!' }]}
            className="mb-4"
          >
            <div className="flex items-center gap-4">
              <span className="w-40 text-right font-medium">장기 목표</span>
              <TextArea rows={3} placeholder="장기 목표를 문장으로 작성하세요" className="flex-1 text-left" />
            </div>
          </Form.Item>
        </>
      );
    }

    // 나머지 단계들
    const remainingStepIndex = currentStep - SERVICE_PLAN_START_INDEX - servicePlanSteps.length;
    
    switch (currentStep) {
      case 0:
        return (
          <>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-4">아동 정보</h3>
              <Form.Item
                name="childName"
                rules={[{ required: true, message: '아동명을 입력해주세요!' }]}
              >
                <div className="flex items-center gap-4">
                  <span className="w-40 text-right font-medium">아동명</span>
                  <Input placeholder="아동명을 입력하세요" className="flex-1 text-left" />
                </div>
              </Form.Item>
              <Form.Item
                name="serviceNumber"
                rules={[{ required: true, message: '관리번호를 입력해주세요!' }]}
              >
                <div className="flex items-center gap-4">
                  <span className="w-40 text-right font-medium">사회복지서비스 관리번호</span>
                  <Input placeholder="사회복지서비스 관리번호를 입력하세요" className="flex-1 text-left" />
                </div>
              </Form.Item>
              <Form.Item
                name="birthDate"
                rules={[{ required: true, message: '생년월일을 선택해주세요!' }]}
              >
                <div className="flex items-center gap-4">
                  <span className="w-40 text-right font-medium">생년월일</span>
                  <DatePicker className="flex-1 text-left" />
                </div>
              </Form.Item>
            </div>
            <Divider />
            <div>
              <h3 className="text-lg font-semibold mb-4">보호자 정보</h3>
              <Form.Item
                name="guardianName"
                rules={[{ required: true, message: '보호자 성함을 입력해주세요!' }]}
              >
                <div className="flex items-center gap-4">
                  <span className="w-40 text-right font-medium">성함</span>
                  <Input placeholder="보호자 성함을 입력하세요" className="flex-1 text-left" />
                </div>
              </Form.Item>
              <Form.Item
                name="guardianPhone"
                rules={[{ required: true, message: '연락처를 입력해주세요!' }]}
              >
                <div className="flex items-center gap-4">
                  <span className="w-40 text-right font-medium">연락처</span>
                  <Input placeholder="연락처를 입력하세요" className="flex-1 text-left" />
                </div>
              </Form.Item>
              <Form.Item>
                <div className="flex items-center gap-4">
                  <span className="w-40 text-right font-medium">보호자 서명</span>
                  <Button type="default" icon={<FileOutlined />}>
                    불러오기
                  </Button>
                </div>
              </Form.Item>
            </div>
          </>
        );

      case 1:
        return (
          <>
            <Form.Item
              name="registrationType"
              rules={[{ required: true, message: '등록 유형을 선택해주세요!' }]}
            >
              <div className="flex items-center gap-4">
                <span className="w-40 text-right font-medium">등록(예견) 유형</span>
                <Select placeholder="등록 유형을 선택하세요" className="flex-1 text-left">
                  <Option value="등록">등록</Option>
                  <Option value="예견">예견</Option>
                </Select>
              </div>
            </Form.Item>
            <Form.Item
              name="disabilityLevel"
              rules={[{ required: true, message: '장애 정도를 선택해주세요!' }]}
            >
              <div className="flex items-center gap-4">
                <span className="w-40 text-right font-medium">장애 정도</span>
                <Select placeholder="장애 정도를 선택하세요" className="flex-1 text-left">
                  <Option value="경증">경증</Option>
                  <Option value="중증">중증</Option>
                  <Option value="중증도">중증도</Option>
                </Select>
              </div>
            </Form.Item>
          </>
        );

      case 2:
        return (
          <>
            <Form.Item
              name="serviceArea"
              rules={[{ required: true, message: '제공영역을 선택해주세요!' }]}
            >
              <div className="flex items-center gap-4">
                <span className="w-40 text-right font-medium">발달재활서비스 제공영역</span>
                <Select placeholder="제공영역을 선택하세요" className="flex-1 text-left">
                  <Option value="소근육">소근육</Option>
                  <Option value="대근육">대근육</Option>
                  <Option value="감각">감각</Option>
                  <Option value="언어">언어</Option>
                </Select>
              </div>
            </Form.Item>
            <Form.Item
              name="monthlyFee"
              rules={[{ required: true, message: '월 이용액을 입력해주세요!' }]}
            >
              <div className="flex items-center gap-4">
                <span className="w-40 text-right font-medium">월 이용액</span>
                <InputNumber
                  placeholder="월 이용액을 입력하세요"
                  formatter={value => `₩ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={((value: string | undefined): number => {
                    if (!value) return 0;
                    const parsed = value.replace(/[₩,\s]/g, '');
                    return parsed === '' ? 0 : Number(parsed) || 0;
                  }) as any}
                  className="flex-1 text-left"
                  min={0}
                />
              </div>
            </Form.Item>
            <Form.Item
              name="selfPayment"
              rules={[{ required: true, message: '본인부담금을 입력해주세요!' }]}
            >
              <div className="flex items-center gap-4">
                <span className="w-40 text-right font-medium">본인부담금</span>
                <InputNumber
                  placeholder="본인부담금을 입력하세요"
                  formatter={value => `₩ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={((value: string | undefined): number => {
                    if (!value) return 0;
                    const parsed = value.replace(/[₩,\s]/g, '');
                    return parsed === '' ? 0 : Number(parsed) || 0;
                  }) as any}
                  className="flex-1 text-left"
                  min={0}
                />
              </div>
            </Form.Item>
            <Form.Item
              name="issueDate"
              rules={[{ required: true, message: '발급일을 선택해주세요!' }]}
            >
              <div className="flex items-center gap-4">
                <span className="w-40 text-right font-medium">발급일</span>
                <DatePicker className="flex-1 text-left" />
              </div>
            </Form.Item>
          </>
        );

      default:
        // 나머지 단계들 (이용 계획 및 비용, 기관 정보)
        if (remainingStepIndex === 0) {
          return (
            <>
              <Form.Item
                name="serviceType"
                rules={[{ required: true, message: '서비스종류를 선택해주세요!' }]}
              >
                <div className="flex items-center gap-4">
                  <span className="w-40 text-right font-medium">서비스종류</span>
                  <Select placeholder="서비스종류를 선택하세요" className="flex-1 text-left">
                    <Option value="개별치료">개별치료</Option>
                    <Option value="그룹치료">그룹치료</Option>
                    <Option value="가정방문">가정방문</Option>
                  </Select>
                </div>
              </Form.Item>
              <Form.Item
                name="frequency"
                rules={[{ required: true, message: '횟수를 입력해주세요!' }]}
              >
                <div className="flex items-center gap-4">
                  <span className="w-40 text-right font-medium">횟수</span>
                  <InputNumber
                    placeholder="횟수를 입력하세요"
                    className="flex-1 text-left"
                    min={1}
                  />
                </div>
              </Form.Item>
              <Form.Item
                name="serviceCost"
                rules={[{ required: true, message: '서비스 비용을 입력해주세요!' }]}
              >
                <div className="flex items-center gap-4">
                  <span className="w-40 text-right font-medium">서비스 비용</span>
                  <InputNumber
                    placeholder="서비스 비용을 입력하세요"
                    formatter={value => value ? `₩ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
                    parser={((value: string | undefined): number => {
                      if (!value) return 0;
                      const parsed = value.replace(/[₩,\s]/g, '');
                      return parsed === '' ? 0 : Number(parsed) || 0;
                    }) as any}
                    className="flex-1 text-left"
                    min={0}
                  />
                </div>
              </Form.Item>
              <Form.Item
                name="selfPaymentCost"
                rules={[{ required: true, message: '본인부담금을 입력해주세요!' }]}
              >
                <div className="flex items-center gap-4">
                  <span className="w-40 text-right font-medium">본인부담금</span>
                  <InputNumber
                    placeholder="본인부담금을 입력하세요"
                    formatter={value => `₩ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={((value: string | undefined): number => {
                      if (!value) return 0;
                      const parsed = value.replace(/[₩,\s]/g, '');
                      return parsed === '' ? 0 : Number(parsed) || 0;
                    }) as any}
                    className="flex-1 text-left"
                    min={0}
                  />
                </div>
              </Form.Item>
            </>
          );
        }
        
        if (remainingStepIndex === 1) {
          return (
            <>
              <Form.Item
                name="organizationName"
                rules={[{ required: true, message: '기관명을 입력해주세요!' }]}
              >
                <div className="flex items-center gap-4">
                  <span className="w-40 text-right font-medium">기관명</span>
                  <Input placeholder="기관명을 입력하세요" className="flex-1 text-left" />
                </div>
              </Form.Item>
              <Form.Item
                name="manager"
                rules={[{ required: true, message: '담당자를 입력해주세요!' }]}
              >
                <div className="flex items-center gap-4">
                  <span className="w-40 text-right font-medium">담당자</span>
                  <Input placeholder="담당자를 입력하세요" className="flex-1 text-left" />
                </div>
              </Form.Item>
              <Form.Item
                name="phone"
                rules={[{ required: true, message: '전화번호를 입력해주세요!' }]}
              >
                <div className="flex items-center gap-4">
                  <span className="w-40 text-right font-medium">전화번호</span>
                  <Input placeholder="전화번호를 입력하세요" className="flex-1 text-left" />
                </div>
              </Form.Item>
              <Form.Item
                name="email"
                rules={[{ required: true, message: '이메일을 입력해주세요!' }]}
              >
                <div className="flex items-center gap-4">
                  <span className="w-40 text-right font-medium">이메일</span>
                  <Input placeholder="이메일을 입력하세요" className="flex-1 text-left" />
                </div>
              </Form.Item>
            </>
          );
        }
        
        return null;
    }
  };

  const handleMonitoringChoice = (choice: 'now' | 'later') => {
    setShowMonitoringModal(false);
    if (choice === 'now') {
      // 지금 작성하기 로직
      console.log('지금 작성하기');
    } else {
      // 다음에 작성하기 - 최종 모달로
      setShowFinalModal(true);
    }
  };

  const handleFinalChoice = (choice: 'direct' | 'ai') => {
    console.log('선택:', choice === 'direct' ? '이대로 작성하기' : 'AI로 보완하기');
    setShowFinalModal(false);
    form.resetFields();
    setCurrentStep(0);
    setServicePlanSteps([0]);
  };

  return (
    <div className="p-4">
      <Modal
        title={
          <div className="text-center py-2">
            <h2 className="text-2xl font-bold mb-0">서비스 계획서 작성</h2>
          </div>
        }
        open={isModalOpen}
        onCancel={handleCancel}
        width={900}
        footer={null}
        destroyOnClose
        styles={{
          content: {
            borderRadius: '24px',
            padding: '40px',
          },
          header: {
            borderBottom: 'none',
            padding: '0',
          },
        }}
        className="toss-modal"
      >
        <div className="px-4">
          {/* 커스텀 진행도 표시 */}
          <div className="mb-8">
            <div className="flex items-start justify-center gap-2 relative">
              {steps.map((step, index) => (
                <React.Fragment key={index}>
                  <div className="flex flex-col items-center relative z-10" style={{ minHeight: '60px' }}>
                    <div
                      className={`w-5 h-5 rounded-full transition-all relative ${
                        index === currentStep
                          ? 'bg-white'
                          : index < currentStep
                          ? 'bg-blue-500'
                          : 'bg-gray-300'
                      }`}
                      style={{
                        border: index === currentStep ? '2px solid #3b82f6' : 'none',
                        boxShadow:
                          index === currentStep
                            ? '0 0 0 4px rgba(59, 130, 246, 0.3), 0 0 0 8px rgba(59, 130, 246, 0.15), 0 0 0 12px rgba(59, 130, 246, 0.1)'
                            : 'none',
                      }}
                    />
                    {index === currentStep && (
                      <div className="mt-3 text-sm font-medium text-blue-500 whitespace-nowrap">
                        {step.title}
                      </div>
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 transition-colors ${
                        index < currentStep ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                      style={{ minWidth: '20px', marginTop: '10px' }}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8 mb-6">
            <Form
              form={form}
              layout="vertical"
            >
              {renderStepContent()}
            </Form>
          </div>

          <div className="flex justify-between gap-4">
            <Button
              onClick={handlePrev}
              disabled={currentStep === 0 || isTyping}
              size="large"
              className="rounded-full px-8 h-12 border-2"
            >
              이전
            </Button>
            <Button
              type="primary"
              onClick={handleNext}
              disabled={!isStepComplete || isTyping}
              size="large"
              className="rounded-full px-8 h-12 bg-blue-500 hover:bg-blue-600 border-0 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isTyping ? '입력 중...' : currentStep === steps.length - 1 ? '완료' : '다음'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* 모니터링 작성 선택 모달 */}
      <Modal
        title={
          <div className="text-center py-2">
            <h2 className="text-2xl font-bold mb-0">서비스 계획 모니터링</h2>
          </div>
        }
        open={showMonitoringModal}
        onCancel={() => setShowMonitoringModal(false)}
        footer={null}
        width={500}
        styles={{
          content: {
            borderRadius: '24px',
            padding: '40px',
          },
          header: {
            borderBottom: 'none',
            padding: '0',
          },
        }}
      >
        <div className="text-center py-4">
          <p className="mb-8 text-lg text-gray-600">서비스 계획 모니터링을 지금 작성하시겠습니까?</p>
          <Space direction="vertical" size="middle" className="w-full">
            <Button
              type="primary"
              onClick={() => handleMonitoringChoice('now')}
              className="w-full rounded-full h-14 text-base font-semibold bg-blue-500 hover:bg-blue-600 border-0 shadow-lg"
              size="large"
            >
              지금 작성하기
            </Button>
            <Button
              onClick={() => handleMonitoringChoice('later')}
              className="w-full rounded-full h-14 text-base font-semibold border-2 hover:bg-gray-50"
              size="large"
            >
              다음에 작성하기
            </Button>
          </Space>
        </div>
      </Modal>

      {/* 최종 선택 모달 */}
      <Modal
        title={
          <div className="text-center py-2">
            <h2 className="text-2xl font-bold mb-0">작성 완료</h2>
          </div>
        }
        open={showFinalModal}
        onCancel={() => setShowFinalModal(false)}
        footer={null}
        width={500}
        styles={{
          content: {
            borderRadius: '24px',
            padding: '40px',
          },
          header: {
            borderBottom: 'none',
            padding: '0',
          },
        }}
      >
        <div className="text-center py-4">
          <p className="mb-8 text-lg text-gray-600">작성하신 내용을 어떻게 처리하시겠습니까?</p>
          <Space direction="vertical" size="middle" className="w-full">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => handleFinalChoice('direct')}
              className="w-full rounded-full h-14 text-base font-semibold bg-blue-500 hover:bg-blue-600 border-0 shadow-lg"
              size="large"
            >
              이대로 작성하기
            </Button>
            <Button
              icon={<RobotOutlined />}
              onClick={() => handleFinalChoice('ai')}
              className="w-full rounded-full h-14 text-base font-semibold border-2 hover:bg-gray-50"
              size="large"
            >
              AI로 보완하기
            </Button>
          </Space>
        </div>
      </Modal>

      <style jsx global>{`
        .toss-modal .ant-input,
        .toss-modal .ant-input-number,
        .toss-modal .ant-picker,
        .toss-modal .ant-select-selector {
          border-radius: 12px !important;
          border: 2px solid #e5e7eb !important;
          padding: 12px 16px !important;
          transition: all 0.2s !important;
        }
        
        .toss-modal .ant-input:focus,
        .toss-modal .ant-input-number:focus,
        .toss-modal .ant-picker:focus,
        .toss-modal .ant-select-focused .ant-select-selector {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
        }
        
        .toss-modal .ant-form-item-label > label {
          font-weight: 600;
          font-size: 15px;
          color: #374151;
        }
      `}</style>
    </div>
  );
};

export default Button27Page;
