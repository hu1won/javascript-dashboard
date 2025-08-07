'use client'

import React, { useState } from 'react';
import { 
  Modal, 
  Input, 
  Button, 
  Space, 
  Radio, 
  Form, 
  Select, 
  Card, 
  Divider,
  message,
  Tooltip,
  Switch,
  InputNumber,
  DatePicker,
  TimePicker,
  Row,
  Col,
  Typography
} from 'antd';
import { 
  StarOutlined, 
  StarFilled, 
  PlusOutlined,
  UserOutlined,
  TeamOutlined,
  HomeOutlined,
  QuestionOutlined,
  BellOutlined,
  GiftOutlined,
  CalendarOutlined,
  DollarOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { Title, Text } = Typography;

interface CouponData {
  name: string;
  target: string;
  targetInfo: any;
  notificationSettings: {
    enableNotification: boolean;
    notificationType: string;
  };
  benefitSettings: {
    minAmount: number;
    discountType: string;
    discountValue: number;
    maxDiscount: number;
    usageLimit: number;
    validPeriod: {
      startDate: any;
      endDate: any;
      startTime: any;
      endTime: any;
    };
  };
}

// 센터 데이터
const centerData = [
  { value: 'center1', label: '제주 영어 센터', address: '제주시 제주대로 123' },
  { value: 'center2', label: '서귀포 수학 센터', address: '서귀포시 서귀포로 456' },
  { value: 'center3', label: '제주 과학 센터', address: '제주시 과학로 789' },
  { value: 'center4', label: '서귀포 예술 센터', address: '서귀포시 예술로 101' },
  { value: 'center5', label: '제주 체육 센터', address: '제주시 체육로 202' },
  { value: 'center6', label: '서귀포 음악 센터', address: '서귀포시 음악로 303' },
  { value: 'center7', label: '제주 미술 센터', address: '제주시 미술로 404' },
  { value: 'center8', label: '서귀포 컴퓨터 센터', address: '서귀포시 컴퓨터로 505' }
];

// 선생님 데이터
const teacherData = [
  { value: 'teacher1', label: '김영희 선생님', subject: '영어', center: '제주 영어 센터' },
  { value: 'teacher2', label: '이철수 선생님', subject: '수학', center: '서귀포 수학 센터' },
  { value: 'teacher3', label: '박민수 선생님', subject: '과학', center: '제주 과학 센터' },
  { value: 'teacher4', label: '최지영 선생님', subject: '예술', center: '서귀포 예술 센터' },
  { value: 'teacher5', label: '정민호 선생님', subject: '체육', center: '제주 체육 센터' },
  { value: 'teacher6', label: '김소영 선생님', subject: '음악', center: '서귀포 음악 센터' },
  { value: 'teacher7', label: '박현우 선생님', subject: '미술', center: '제주 미술 센터' },
  { value: 'teacher8', label: '이수진 선생님', subject: '컴퓨터', center: '서귀포 컴퓨터 센터' }
];

// 부모님 데이터
const parentData = [
  { value: 'parent1', label: '김철수 부모님', student: '김민수', center: '제주 영어 센터' },
  { value: 'parent2', label: '이영희 부모님', student: '이지은', center: '서귀포 수학 센터' },
  { value: 'parent3', label: '박민수 부모님', student: '박서연', center: '제주 과학 센터' },
  { value: 'parent4', label: '최지영 부모님', student: '최동현', center: '서귀포 예술 센터' },
  { value: 'parent5', label: '정민호 부모님', student: '정수빈', center: '제주 체육 센터' },
  { value: 'parent6', label: '김소영 부모님', student: '김현우', center: '서귀포 음악 센터' },
  { value: 'parent7', label: '박현우 부모님', student: '박지민', center: '제주 미술 센터' },
  { value: 'parent8', label: '이수진 부모님', student: '이하나', center: '서귀포 컴퓨터 센터' }
];

const Button7: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [selectedTarget, setSelectedTarget] = useState<string>('');
  const [favoriteCoupons, setFavoriteCoupons] = useState<string[]>([
    '신규 가입 쿠폰',
    '생일 축하 쿠폰',
    '학기말 할인 쿠폰',
    '추천인 쿠폰'
  ]);
  const [isFavoriteOpen, setIsFavoriteOpen] = useState(false);
  const [showBenefitSettings, setShowBenefitSettings] = useState(false);
  const [couponNumberType, setCouponNumberType] = useState<string>('');
  const [discountType, setDiscountType] = useState<string>('');

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      console.log('쿠폰 발행 데이터:', values);
      message.success('쿠폰이 성공적으로 발행되었습니다!');
      setIsModalOpen(false);
      form.resetFields();
      setSelectedTarget('');
      setShowBenefitSettings(false);
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setSelectedTarget('');
    setShowBenefitSettings(false);
    setCouponNumberType('');
    setDiscountType('');
  };

  const handleTargetChange = (target: string) => {
    setSelectedTarget(target);
    form.setFieldsValue({ targetInfo: undefined });
    setShowBenefitSettings(false);
    setCouponNumberType('');
    setDiscountType('');
  };

  const addToFavorites = () => {
    const couponName = form.getFieldValue('couponName');
    if (couponName && !favoriteCoupons.includes(couponName)) {
      setFavoriteCoupons([...favoriteCoupons, couponName]);
      message.success('즐겨찾기에 추가되었습니다!');
    }
  };

  const selectFavoriteCoupon = (couponName: string) => {
    form.setFieldsValue({ couponName });
    setIsFavoriteOpen(false);
  };

  const renderTargetForm = () => {
    switch (selectedTarget) {
      case '센터':
        return (
          <>
            <Form.Item
              name={['targetInfo', 'center']}
              label="센터 선택"
              rules={[{ required: true, message: '센터를 선택해주세요!' }]}
            >
              <Select 
                placeholder="센터를 검색하거나 선택하세요"
                showSearch
                filterOption={(input, option) =>
                  (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                }
                onSelect={(value) => {
                  const selectedCenter = centerData.find(center => center.value === value);
                  if (selectedCenter) {
                    setShowBenefitSettings(true);
                  }
                }}
              >
                {centerData.map(center => (
                  <Option key={center.value} value={center.value}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{center.label}</span>
                      <span className="text-xs text-gray-500">{center.address}</span>
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>
            
            {form.getFieldValue(['targetInfo', 'center']) && (
              <>
                <Divider />
                
                <Card size="small" className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <BellOutlined className="mr-2" />
                      <Text strong>발행 알림 설정</Text>
                    </div>
                    <Form.Item
                      name={['notificationSettings', 'enableNotification']}
                      valuePropName="checked"
                      initialValue={true}
                      className="mb-0"
                    >
                      <Switch />
                    </Form.Item>
                  </div>
                  
                  <Form.Item
                    name={['notificationSettings', 'notificationType']}
                    label="알림 대상"
                    initialValue="center_all"
                  >
                    <Radio.Group>
                      <Radio value="center_all">센터 전체</Radio>
                      <Radio value="center_admin">관리자만</Radio>
                      <Radio value="center_members">센터 소속 전체</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Card>
                
                <Card size="small">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <GiftOutlined className="mr-2" />
                      <Text strong>사용 혜택 설정</Text>
                    </div>
                    <Button 
                      type="primary" 
                      size="small"
                      onClick={() => setShowBenefitSettings(!showBenefitSettings)}
                    >
                      {showBenefitSettings ? '접기' : '펼치기'}
                    </Button>
                  </div>
                  
                  {showBenefitSettings && (
                    <div className="space-y-6">
                      {/* 할인 설정 그룹 */}
                      <div>
                        <div className="text-sm font-medium mb-3 text-gray-700">할인 설정</div>
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item
                              name={['benefitSettings', 'minAmount']}
                              label="최소 사용 금액"
                              rules={[{ required: true, message: '최소 사용 금액을 입력해주세요!' }]}
                            >
                              <InputNumber
                                placeholder="0"
                                min={0}
                                className="w-full"
                                addonBefore="₩"
                              />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              name={['benefitSettings', 'discountType']}
                              label="할인 유형"
                              rules={[{ required: true, message: '할인 유형을 선택해주세요!' }]}
                            >
                              <Select placeholder="할인 유형 선택">
                                <Option value="percentage">퍼센트 할인</Option>
                                <Option value="fixed">고정 금액 할인</Option>
                                <Option value="free">무료</Option>
                              </Select>
                            </Form.Item>
                          </Col>
                        </Row>
                        
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item
                              name={['benefitSettings', 'discountValue']}
                              label="할인 값"
                              rules={[{ required: true, message: '할인 값을 입력해주세요!' }]}
                            >
                              <InputNumber
                                placeholder="0"
                                min={0}
                                className="w-full"
                                addonBefore={
                                  form.getFieldValue(['benefitSettings', 'discountType']) === 'percentage' ? '%' : '₩'
                                }
                              />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              name={['benefitSettings', 'maxDiscount']}
                              label="최대 할인 금액"
                            >
                              <InputNumber
                                placeholder="제한 없음"
                                min={0}
                                className="w-full"
                                addonBefore="₩"
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      </div>

                      {/* 사용 제한 그룹 */}
                      <div>
                        <div className="text-sm font-medium mb-3 text-gray-700">사용 제한</div>
                        <Form.Item
                          name={['benefitSettings', 'usageLimit']}
                          label="사용 횟수 제한"
                        >
                          <InputNumber
                            placeholder="무제한"
                            min={1}
                            className="w-full"
                          />
                        </Form.Item>
                      </div>

                      {/* 유효 기간 그룹 */}
                      <div>
                        <div className="text-sm font-medium mb-3 text-gray-700">유효 기간</div>
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item
                              name={['benefitSettings', 'validPeriod', 'startDate']}
                              label="시작 날짜"
                              rules={[{ required: true, message: '시작 날짜를 선택해주세요!' }]}
                            >
                              <DatePicker className="w-full" />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              name={['benefitSettings', 'validPeriod', 'endDate']}
                              label="종료 날짜"
                              rules={[{ required: true, message: '종료 날짜를 선택해주세요!' }]}
                            >
                              <DatePicker className="w-full" />
                            </Form.Item>
                          </Col>
                        </Row>
                        
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item
                              name={['benefitSettings', 'validPeriod', 'startTime']}
                              label="시작 시간"
                            >
                              <TimePicker className="w-full" format="HH:mm" />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              name={['benefitSettings', 'validPeriod', 'endTime']}
                              label="종료 시간"
                            >
                              <TimePicker className="w-full" format="HH:mm" />
                            </Form.Item>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  )}
                </Card>
              </>
            )}
          </>
        );
      
      case '선생님':
        return (
          <>
            <Form.Item
              name={['targetInfo', 'teacher']}
              label="선생님 선택"
              rules={[{ required: true, message: '선생님을 선택해주세요!' }]}
            >
              <Select 
                placeholder="선생님을 검색하거나 선택하세요"
                showSearch
                filterOption={(input, option) =>
                  (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                }
                onSelect={(value) => {
                  const selectedTeacher = teacherData.find(teacher => teacher.value === value);
                  if (selectedTeacher) {
                    setShowBenefitSettings(true);
                  }
                }}
              >
                {teacherData.map(teacher => (
                  <Option key={teacher.value} value={teacher.value}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{teacher.label}</span>
                      <span className="text-xs text-gray-500">{teacher.subject} • {teacher.center}</span>
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>
            
            {form.getFieldValue(['targetInfo', 'teacher']) && (
              <>
                <Divider />
                
                <Card size="small" className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <BellOutlined className="mr-2" />
                      <Text strong>발행 알림 설정</Text>
                    </div>
                    <Form.Item
                      name={['notificationSettings', 'enableNotification']}
                      valuePropName="checked"
                      initialValue={true}
                      className="mb-0"
                    >
                      <Switch />
                    </Form.Item>
                  </div>
                </Card>
                
                <Card size="small">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <GiftOutlined className="mr-2" />
                      <Text strong>사용 혜택 설정</Text>
                    </div>
                    <Button 
                      type="primary" 
                      size="small"
                      onClick={() => setShowBenefitSettings(!showBenefitSettings)}
                    >
                      {showBenefitSettings ? '접기' : '펼치기'}
                    </Button>
                  </div>
                  
                  {showBenefitSettings && (
                    <div className="space-y-6">
                      {/* 할인 설정 그룹 */}
                      <div>
                        <div className="text-sm font-medium mb-3 text-gray-700">할인 설정</div>
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item
                              name={['benefitSettings', 'minAmount']}
                              label="최소 사용 금액"
                              rules={[{ required: true, message: '최소 사용 금액을 입력해주세요!' }]}
                            >
                              <InputNumber
                                placeholder="0"
                                min={0}
                                className="w-full"
                                addonBefore="₩"
                              />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              name={['benefitSettings', 'discountType']}
                              label="할인 유형"
                              rules={[{ required: true, message: '할인 유형을 선택해주세요!' }]}
                            >
                              <Select placeholder="할인 유형 선택">
                                <Option value="percentage">퍼센트 할인</Option>
                                <Option value="fixed">고정 금액 할인</Option>
                                <Option value="free">무료</Option>
                              </Select>
                            </Form.Item>
                          </Col>
                        </Row>
                        
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item
                              name={['benefitSettings', 'discountValue']}
                              label="할인 값"
                              rules={[{ required: true, message: '할인 값을 입력해주세요!' }]}
                            >
                              <InputNumber
                                placeholder="0"
                                min={0}
                                className="w-full"
                                addonBefore={
                                  form.getFieldValue(['benefitSettings', 'discountType']) === 'percentage' ? '%' : '₩'
                                }
                              />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              name={['benefitSettings', 'maxDiscount']}
                              label="최대 할인 금액"
                            >
                              <InputNumber
                                placeholder="제한 없음"
                                min={0}
                                className="w-full"
                                addonBefore="₩"
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      </div>

                      {/* 사용 제한 그룹 */}
                      <div>
                        <div className="text-sm font-medium mb-3 text-gray-700">사용 제한</div>
                        <Form.Item
                          name={['benefitSettings', 'usageLimit']}
                          label="사용 횟수 제한"
                        >
                          <InputNumber
                            placeholder="무제한"
                            min={1}
                            className="w-full"
                          />
                        </Form.Item>
                      </div>

                      {/* 유효 기간 그룹 */}
                      <div>
                        <div className="text-sm font-medium mb-3 text-gray-700">유효 기간</div>
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item
                              name={['benefitSettings', 'validPeriod', 'startDate']}
                              label="시작 날짜"
                              rules={[{ required: true, message: '시작 날짜를 선택해주세요!' }]}
                            >
                              <DatePicker className="w-full" />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              name={['benefitSettings', 'validPeriod', 'endDate']}
                              label="종료 날짜"
                              rules={[{ required: true, message: '종료 날짜를 선택해주세요!' }]}
                            >
                              <DatePicker className="w-full" />
                            </Form.Item>
                          </Col>
                        </Row>
                        
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item
                              name={['benefitSettings', 'validPeriod', 'startTime']}
                              label="시작 시간"
                            >
                              <TimePicker className="w-full" format="HH:mm" />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              name={['benefitSettings', 'validPeriod', 'endTime']}
                              label="종료 시간"
                            >
                              <TimePicker className="w-full" format="HH:mm" />
                            </Form.Item>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  )}
                </Card>
              </>
            )}
          </>
        );
      
      case '부모님':
        return (
          <>
            <Form.Item
              name={['targetInfo', 'parent']}
              label="부모님 선택"
              rules={[{ required: true, message: '부모님을 선택해주세요!' }]}
            >
              <Select 
                placeholder="부모님을 검색하거나 선택하세요"
                showSearch
                filterOption={(input, option) =>
                  (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                }
                onSelect={(value) => {
                  const selectedParent = parentData.find(parent => parent.value === value);
                  if (selectedParent) {
                    setShowBenefitSettings(true);
                  }
                }}
              >
                {parentData.map(parent => (
                  <Option key={parent.value} value={parent.value}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{parent.label}</span>
                      <span className="text-xs text-gray-500">{parent.student} • {parent.center}</span>
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>
            
            {form.getFieldValue(['targetInfo', 'parent']) && (
              <>
                <Divider />
                
                <Card size="small" className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <BellOutlined className="mr-2" />
                      <Text strong>발행 알림 설정</Text>
                    </div>
                    <Form.Item
                      name={['notificationSettings', 'enableNotification']}
                      valuePropName="checked"
                      initialValue={true}
                      className="mb-0"
                    >
                      <Switch />
                    </Form.Item>
                  </div>
                </Card>
                
                <Card size="small">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <GiftOutlined className="mr-2" />
                      <Text strong>사용 혜택 설정</Text>
                    </div>
                    <Button 
                      type="primary" 
                      size="small"
                      onClick={() => setShowBenefitSettings(!showBenefitSettings)}
                    >
                      {showBenefitSettings ? '접기' : '펼치기'}
                    </Button>
                  </div>
                  
                  {showBenefitSettings && (
                    <div className="space-y-6">
                      {/* 할인 설정 그룹 */}
                      <div>
                        <div className="text-sm font-medium mb-3 text-gray-700">할인 설정</div>
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item
                              name={['benefitSettings', 'minAmount']}
                              label="최소 사용 금액"
                              rules={[{ required: true, message: '최소 사용 금액을 입력해주세요!' }]}
                            >
                              <InputNumber
                                placeholder="0"
                                min={0}
                                className="w-full"
                                addonBefore="₩"
                              />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              name={['benefitSettings', 'discountType']}
                              label="할인 유형"
                              rules={[{ required: true, message: '할인 유형을 선택해주세요!' }]}
                            >
                              <Select placeholder="할인 유형 선택">
                                <Option value="percentage">퍼센트 할인</Option>
                                <Option value="fixed">고정 금액 할인</Option>
                                <Option value="free">무료</Option>
                              </Select>
                            </Form.Item>
                          </Col>
                        </Row>
                        
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item
                              name={['benefitSettings', 'discountValue']}
                              label="할인 값"
                              rules={[{ required: true, message: '할인 값을 입력해주세요!' }]}
                            >
                              <InputNumber
                                placeholder="0"
                                min={0}
                                className="w-full"
                                addonBefore={
                                  form.getFieldValue(['benefitSettings', 'discountType']) === 'percentage' ? '%' : '₩'
                                }
                              />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              name={['benefitSettings', 'maxDiscount']}
                              label="최대 할인 금액"
                            >
                              <InputNumber
                                placeholder="제한 없음"
                                min={0}
                                className="w-full"
                                addonBefore="₩"
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      </div>

                      {/* 사용 제한 그룹 */}
                      <div>
                        <div className="text-sm font-medium mb-3 text-gray-700">사용 제한</div>
                        <Form.Item
                          name={['benefitSettings', 'usageLimit']}
                          label="사용 횟수 제한"
                        >
                          <InputNumber
                            placeholder="무제한"
                            min={1}
                            className="w-full"
                          />
                        </Form.Item>
                      </div>

                      {/* 유효 기간 그룹 */}
                      <div>
                        <div className="text-sm font-medium mb-3 text-gray-700">유효 기간</div>
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item
                              name={['benefitSettings', 'validPeriod', 'startDate']}
                              label="시작 날짜"
                              rules={[{ required: true, message: '시작 날짜를 선택해주세요!' }]}
                            >
                              <DatePicker className="w-full" />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              name={['benefitSettings', 'validPeriod', 'endDate']}
                              label="종료 날짜"
                              rules={[{ required: true, message: '종료 날짜를 선택해주세요!' }]}
                            >
                              <DatePicker className="w-full" />
                            </Form.Item>
                          </Col>
                        </Row>
                        
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item
                              name={['benefitSettings', 'validPeriod', 'startTime']}
                              label="시작 시간"
                            >
                              <TimePicker className="w-full" format="HH:mm" />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              name={['benefitSettings', 'validPeriod', 'endTime']}
                              label="종료 시간"
                            >
                              <TimePicker className="w-full" format="HH:mm" />
                            </Form.Item>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  )}
                </Card>
              </>
            )}
          </>
        );
      
      case '미지정':
        return (
          <>
            <Form.Item
              name={['targetInfo', 'couponNumberType']}
              label="쿠폰 번호 생성 방식"
              rules={[{ required: true, message: '쿠폰 번호 생성 방식을 선택해주세요!' }]}
            >
              <Radio.Group onChange={(e) => setCouponNumberType(e.target.value)}>
                <Radio value="manual">직접 입력</Radio>
                <Radio value="auto">자동 생성</Radio>
              </Radio.Group>
            </Form.Item>
            
            {couponNumberType === 'manual' && (
              <Form.Item
                name={['targetInfo', 'couponNumber']}
                label="쿠폰 번호"
                rules={[{ required: true, message: '쿠폰 번호를 입력해주세요!' }]}
              >
                <Input placeholder="쿠폰 번호를 입력하세요" />
              </Form.Item>
            )}
            
            {couponNumberType === 'auto' && (
              <Form.Item
                name={['targetInfo', 'autoCouponPrefix']}
                label="쿠폰 번호 접두사"
              >
                <Input placeholder="예: COUPON" />
              </Form.Item>
            )}
            
            <Form.Item
              name={['targetInfo', 'usageCount']}
              label="사용 횟수"
              rules={[{ required: true, message: '사용 횟수를 입력해주세요!' }]}
            >
              <InputNumber
                placeholder="1"
                min={1}
                className="w-full"
              />
            </Form.Item>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="relative">
      <Button 
        type="primary" 
        size="large"
        onClick={showModal}
        icon={<GiftOutlined />}
      >
        쿠폰 발행
      </Button>

      <Modal
        title="쿠폰 발행"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={500}
        okText="발행"
        cancelText="취소"
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ target: '' }}
        >
          <Card size="small" className="mb-4">
            <div className="flex items-center space-x-2">
              <Form.Item
                name="couponName"
                label="쿠폰명"
                className="flex-1 mb-0"
                rules={[{ required: true, message: '쿠폰명을 입력해주세요!' }]}
              >
                <Input placeholder="쿠폰명을 입력하세요" />
              </Form.Item>
              
              <Tooltip title="즐겨찾기에 추가">
                <Button
                  type="text"
                  icon={<StarOutlined />}
                  onClick={addToFavorites}
                  className="mt-6"
                />
              </Tooltip>
              
              <Tooltip title="즐겨찾기에서 선택">
                <Button
                  type="text"
                  icon={<StarFilled />}
                  onClick={() => setIsFavoriteOpen(!isFavoriteOpen)}
                  className="mt-6"
                />
              </Tooltip>
            </div>
            
            {isFavoriteOpen && (
              <Card size="small" className="mt-2 bg-gray-50">
                <div className="text-sm font-medium mb-2">즐겨찾기 쿠폰</div>
                <Space wrap>
                  {favoriteCoupons.map((coupon, index) => (
                    <Button
                      key={index}
                      size="small"
                      onClick={() => selectFavoriteCoupon(coupon)}
                      className="text-xs"
                    >
                      {coupon}
                    </Button>
                  ))}
                </Space>
              </Card>
            )}
          </Card>

          <Divider />

          <Form.Item
            name="target"
            label="발행 대상"
            rules={[{ required: true, message: '발행 대상을 선택해주세요!' }]}
          >
            <Radio.Group onChange={(e) => handleTargetChange(e.target.value)} className="w-full">
              <div className="grid grid-cols-4 gap-2 w-full">
                <Radio.Button value="센터" className="h-12 flex flex-col items-center justify-center text-center w-full">
                  <TeamOutlined className="text-base mb-1" />
                  <span className="text-xs">센터</span>
                </Radio.Button>
                <Radio.Button value="선생님" className="h-12 flex flex-col items-center justify-center text-center w-full">
                  <UserOutlined className="text-base mb-1" />
                  <span className="text-xs">선생님</span>
                </Radio.Button>
                <Radio.Button value="부모님" className="h-12 flex flex-col items-center justify-center text-center w-full">
                  <HomeOutlined className="text-base mb-1" />
                  <span className="text-xs">부모님</span>
                </Radio.Button>
                <Radio.Button value="미지정" className="h-12 flex flex-col items-center justify-center text-center w-full">
                  <QuestionOutlined className="text-base mb-1" />
                  <span className="text-xs">미지정</span>
                </Radio.Button>
              </div>
            </Radio.Group>
          </Form.Item>

          {selectedTarget && (
            <div className="mt-4">
              {renderTargetForm()}
            </div>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default Button7;