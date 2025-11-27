'use client'

import React, { useState, useEffect, useRef } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { 
  Modal, 
  Form, 
  Input, 
  DatePicker, 
  Select, 
  Checkbox, 
  Button, 
  Space, 
  Row, 
  Col,
  InputNumber,
  Radio,
  RadioGroupProps
} from 'antd';
import { 
  CheckCircleOutlined,
  FileTextOutlined,
  UserOutlined,
  HomeOutlined,
  PhoneOutlined,
  CalendarOutlined,
  DollarOutlined,
  HeartOutlined,
  MessageOutlined,
  InfoCircleOutlined,
  EditOutlined,
  RobotOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

const Button26Page: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [typingIndex, setTypingIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 각 단계별 자동 입력 데이터
  const autoFillData: Record<number, Record<string, any>> = {
    0: {
      consultationPlace: '제주시 제주대로 123',
      // consultationDate는 자동 입력 제외
    },
    1: {
      name: '김민수',
      address: '제주시 제주대로 456',
      guardian: '김철수',
      guardianPhone: '010-1234-5678',
      relationship: '부',
    },
    2: {
      targetCategory: ['수급자', '차상위계층'],
    },
    3: {
      selfPayment: 50000,
      governmentSupport: 200000,
    },
    4: {
      physicalDevelopment: '소근육',
      languageCommunication: '구문/의미',
    },
    5: {
      consultationContent: '아동의 소근육 발달이 지연되어 있으며, 일상생활 활동에 어려움이 있습니다. 부모님과 함께 꾸준한 훈련이 필요합니다.',
      consultationResult: '소근육 발달 프로그램을 주 2회 진행하기로 결정했습니다. 가정에서도 간단한 놀이 활동을 통해 지속적인 훈련을 할 수 있도록 안내했습니다.',
    },
    6: {
      guidance: '다음 상담은 2주 후에 예정되어 있습니다. 가정에서 실시한 활동 내용을 기록해 오시면 더욱 효과적인 상담이 가능합니다.',
    },
    7: {
      // finalDate는 자동 입력 제외
      consultant: '이영희',
    },
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
    }, 30); // 타이핑 속도 (30ms - 더 빠르게)
  };


  // 단계별 자동 입력
  useEffect(() => {
    if (!isModalOpen) return;
    
    const stepData = autoFillData[currentStep];
    if (!stepData) return;

    const fields = Object.keys(stepData);
    let fieldIndex = 0;

    const fillNextField = () => {
      if (fieldIndex >= fields.length) {
        // 모든 필드 입력 완료
        return;
      }

      const fieldName = fields[fieldIndex];
      const value = stepData[fieldName];

      // 날짜 필드는 자동 입력 제외
      if (fieldName.includes('Date') || fieldName.includes('date')) {
        fieldIndex++;
        if (fieldIndex < fields.length) {
          setTimeout(fillNextField, 300);
        }
        return;
      }

      if (typeof value === 'string') {
        // 문자열 필드: 타이핑 애니메이션
        typeText(fieldName, value, () => {
          fieldIndex++;
          if (fieldIndex < fields.length) {
            fillNextField();
          }
        });
      } else if (Array.isArray(value)) {
        // 배열 필드 (체크박스): 즉시 입력
        form.setFieldsValue({ [fieldName]: value });
        fieldIndex++;
        if (fieldIndex < fields.length) {
          setTimeout(fillNextField, 500);
        }
      } else if (typeof value === 'number') {
        // 숫자 필드: 타이핑 애니메이션
        const valueStr = value.toString();
        typeText(fieldName, valueStr, () => {
          fieldIndex++;
          if (fieldIndex < fields.length) {
            fillNextField();
          }
        });
      } else {
        // 기타: 즉시 입력
        form.setFieldsValue({ [fieldName]: value });
        fieldIndex++;
        if (fieldIndex < fields.length) {
          setTimeout(fillNextField, 500);
        }
      }
    };

    // 첫 필드 입력 시작 전 약간의 딜레이
    const startDelay = setTimeout(() => {
      fillNextField();
    }, 500);

    return () => {
      clearTimeout(startDelay);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [currentStep, isModalOpen]);

  const steps = [
    { title: '상담 정보', icon: <CalendarOutlined /> },
    { title: '기본 정보', icon: <UserOutlined /> },
    { title: '대상 구분', icon: <FileTextOutlined /> },
    { title: '금액 정보', icon: <DollarOutlined /> },
    { title: '발달 영역', icon: <HeartOutlined /> },
    { title: '상담 내용', icon: <MessageOutlined /> },
    { title: '안내사항', icon: <InfoCircleOutlined /> },
    { title: '최종 확인', icon: <CheckCircleOutlined /> },
  ];

  const [isStepComplete, setIsStepComplete] = useState(false);

  // 단계별 필드 완료 여부 확인
  useEffect(() => {
    const checkStepComplete = async () => {
      try {
        const stepData = autoFillData[currentStep];
        if (!stepData) {
          setIsStepComplete(true);
          return;
        }

        const fields = Object.keys(stepData);
        const values = form.getFieldsValue();
        
        let allFilled = true;
        for (const field of fields) {
          const value = values[field];
          if (value === undefined || value === null || value === '') {
            allFilled = false;
            break;
          }
          if (Array.isArray(value) && value.length === 0) {
            allFilled = false;
            break;
          }
        }

        setIsStepComplete(allFilled);
      } catch (error) {
        setIsStepComplete(false);
      }
    };

    // 폼 값 변경 감지
    const timer = setInterval(checkStepComplete, 200);
    checkStepComplete();

    return () => clearInterval(timer);
  }, [currentStep, form, isTyping]);

  const handleNext = async () => {
    try {
      const values = await form.validateFields();
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
        setIsStepComplete(false);
      } else {
        // 8단계 완료 후 선택 창
        setIsModalOpen(false);
        setShowFinalModal(true);
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
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <Form.Item
              name="consultationPlace"
              label="상담장소"
              rules={[{ required: true, message: '상담장소를 입력해주세요!' }]}
            >
              <Input placeholder="상담장소를 입력하세요" />
            </Form.Item>
            <Form.Item
              name="consultationDate"
              label="상담일시"
              rules={[{ required: true, message: '상담일시를 선택해주세요!' }]}
            >
              <DatePicker showTime format="YYYY-MM-DD HH:mm" className="w-full" />
            </Form.Item>
          </>
        );

      case 1:
        return (
          <>
            <Form.Item
              name="name"
              label="성명"
              rules={[{ required: true, message: '성명을 입력해주세요!' }]}
            >
              <Input placeholder="성명을 입력하세요" />
            </Form.Item>
            <Form.Item
              name="address"
              label="주소"
              rules={[{ required: true, message: '주소를 입력해주세요!' }]}
            >
              <Input placeholder="주소를 입력하세요" />
            </Form.Item>
            <Form.Item
              name="guardian"
              label="보호자"
              rules={[{ required: true, message: '보호자를 입력해주세요!' }]}
            >
              <Input placeholder="보호자를 입력하세요" />
            </Form.Item>
            <Form.Item
              name="guardianPhone"
              label="보호자 연락처"
              rules={[{ required: true, message: '보호자 연락처를 입력해주세요!' }]}
            >
              <Input placeholder="보호자 연락처를 입력하세요" />
            </Form.Item>
            <Form.Item
              name="relationship"
              label="관계"
              rules={[{ required: true, message: '관계를 선택해주세요!' }]}
            >
              <Select placeholder="관계를 선택하세요">
                <Option value="부">부</Option>
                <Option value="모">모</Option>
                <Option value="조부">조부</Option>
                <Option value="조모">조모</Option>
                <Option value="기타">기타</Option>
              </Select>
            </Form.Item>
          </>
        );

      case 2:
        return (
          <Form.Item
            name="targetCategory"
            label="대상 구분"
            rules={[{ required: true, message: '대상 구분을 선택해주세요!' }]}
          >
            <Checkbox.Group>
              <Space direction="vertical">
                <Checkbox value="수급자">수급자</Checkbox>
                <Checkbox value="차상위계층">차상위계층</Checkbox>
                <Checkbox value="한부모가정">한부모가정</Checkbox>
                <Checkbox value="다문화가정">다문화가정</Checkbox>
                <Checkbox value="일반기준">일반기준</Checkbox>
              </Space>
            </Checkbox.Group>
          </Form.Item>
        );

      case 3:
        return (
          <>
            <Form.Item
              name="selfPayment"
              label="본인 부담금"
              rules={[{ required: true, message: '본인 부담금을 입력해주세요!' }]}
            >
              <InputNumber
                placeholder="본인 부담금을 입력하세요"
                formatter={value => `₩ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => {
                  const parsed = value ? value.replace(/\₩\s?|(,*)/g, '') : '';
                  return parsed ? Number(parsed) : 0;
                }}
                className="w-full"
                min={0}
              />
            </Form.Item>
            <Form.Item
              name="governmentSupport"
              label="정부지원금"
              rules={[{ required: true, message: '정부지원금을 입력해주세요!' }]}
            >
              <InputNumber
                placeholder="정부지원금을 입력하세요"
                formatter={value => `₩ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => {
                  const parsed = value ? value.replace(/\₩\s?|(,*)/g, '') : '';
                  return parsed ? Number(parsed) : 0;
                }}
                className="w-full"
                min={0}
              />
            </Form.Item>
          </>
        );

      case 4:
        return (
          <>
            <Form.Item
              name="physicalDevelopment"
              label="신체발달"
              rules={[{ required: true, message: '신체발달을 선택해주세요!' }]}
            >
              <Radio.Group>
                <Space direction="vertical">
                  <Radio value="감각">감각</Radio>
                  <Radio value="소근육">소근육</Radio>
                  <Radio value="대근육">대근육</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              name="languageCommunication"
              label="언어 및 의사소통"
              rules={[{ required: true, message: '언어 및 의사소통을 선택해주세요!' }]}
            >
              <Radio.Group>
                <Space direction="vertical">
                  <Radio value="구문/의미">구문/의미</Radio>
                  <Radio value="음운/청력">음운/청력</Radio>
                  <Radio value="화용">화용</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
          </>
        );

      case 5:
        return (
          <>
            <Form.Item
              name="consultationContent"
              label="상담 내용"
              rules={[{ required: true, message: '상담 내용을 입력해주세요!' }]}
            >
              <TextArea rows={4} placeholder="상담 내용을 문장으로 작성하세요" />
            </Form.Item>
            <Form.Item
              name="consultationResult"
              label="상담결과 및 조치사항"
              rules={[{ required: true, message: '상담결과 및 조치사항을 입력해주세요!' }]}
            >
              <TextArea rows={4} placeholder="상담결과 및 조치사항을 문장으로 작성하세요" />
            </Form.Item>
          </>
        );

      case 6:
        return (
          <Form.Item
            name="guidance"
            label="안내사항"
            rules={[{ required: true, message: '안내사항을 입력해주세요!' }]}
          >
            <TextArea rows={6} placeholder="안내사항을 문장으로 작성하세요" />
          </Form.Item>
        );

      case 7:
        return (
          <>
            <Form.Item
              name="finalDate"
              label="날짜"
              rules={[{ required: true, message: '날짜를 선택해주세요!' }]}
            >
              <DatePicker className="w-full" />
            </Form.Item>
            <Form.Item
              name="consultant"
              label="상담자"
              rules={[{ required: true, message: '상담자를 입력해주세요!' }]}
            >
              <Input placeholder="상담자를 입력하세요" />
            </Form.Item>
          </>
        );

      default:
        return null;
    }
  };

  const [showFinalModal, setShowFinalModal] = useState(false);

  const handleFinalStep = async () => {
    try {
      const values = await form.validateFields();
      setIsModalOpen(false);
      setShowFinalModal(true);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleFinalChoice = (choice: 'direct' | 'ai') => {
    console.log('선택:', choice === 'direct' ? '이대로 작성하기' : 'AI로 보완하기');
    setShowFinalModal(false);
    form.resetFields();
    setCurrentStep(0);
  };

  return (
    <div className="p-4">
      <Modal
        title={
          <div className="text-center py-2">
            <h2 className="text-2xl font-bold mb-0">상담 등록</h2>
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
                    {/* 동그란 점 */}
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
                    {/* 현재 단계 텍스트만 해당 동그라미 아래에 표시 */}
                    {index === currentStep && (
                      <div className="mt-3 text-sm font-medium text-blue-500 whitespace-nowrap">
                        {step.title}
                      </div>
                    )}
                  </div>
                  {/* 연결선 */}
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
              onClick={currentStep === steps.length - 1 ? handleFinalStep : handleNext}
              disabled={!isStepComplete || isTyping}
              size="large"
              className="rounded-full px-8 h-12 bg-blue-500 hover:bg-blue-600 border-0 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isTyping ? '입력 중...' : currentStep === steps.length - 1 ? '완료' : '다음'}
            </Button>
          </div>
        </div>
      </Modal>

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
        
        .toss-modal .ant-steps-item-icon {
          border-radius: 50% !important;
        }
        
        .toss-modal .ant-steps-item-process .ant-steps-item-icon {
          background: #3b82f6 !important;
          border-color: #3b82f6 !important;
        }
        
        .toss-modal .ant-steps-item-finish .ant-steps-item-icon {
          background: #3b82f6 !important;
          border-color: #3b82f6 !important;
        }
        
        .toss-modal .ant-checkbox-wrapper,
        .toss-modal .ant-radio-wrapper {
          padding: 12px;
          border-radius: 12px;
          margin-bottom: 8px;
          transition: all 0.2s;
        }
        
        .toss-modal .ant-checkbox-wrapper:hover,
        .toss-modal .ant-radio-wrapper:hover {
          background: #f3f4f6;
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

export default Button26Page;
