'use client'

import React, { useMemo, useState } from 'react';
import { Card, Typography, Table, Row, Col, Select, Tooltip, Space, Badge, Tag, Statistic } from 'antd';
import { QuestionCircleOutlined, LinkOutlined, WarningOutlined, CheckCircleOutlined, CloseCircleOutlined, FileExcelOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

type TableProps = {
  title: string;
  tooltip?: string;
  columns: { title: string; dataIndex: string; key: string; width?: number; render?: (text: any, record: any) => React.ReactNode }[];
  data: any[];
  titleRight?: React.ReactNode;
  rowClassName?: (record: any) => string;
  expandable?: any;
};

const DataTable: React.FC<TableProps> = ({ title, columns, data, titleRight, rowClassName, expandable }) => {
  return (
    <Card
      bordered
      title={
        <Space>
          <span>{title}</span>
          {titleRight}
        </Space>
      }
    >
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        locale={{ emptyText: '데이터를 추가하세요' }}
        size="small"
        rowKey="key"
        rowClassName={rowClassName}
        expandable={expandable}
      />
    </Card>
  );
};

function pad(n: number) { return n.toString().padStart(2, '0'); }
function randomInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randomApprovedAt2025() {
  const month = pad(randomInt(1, 12));
  const day = pad(randomInt(1, 28));
  const hour = pad(randomInt(8, 20));
  const minute = pad(randomInt(0, 59));
  return `2025-${month}-${day} ${hour}:${minute}`;
}
function formatKRW(n: number) { return `${n.toLocaleString('ko-KR')}원`; }
function toDate(s: string) {
  const [date, time] = s.split(' ');
  const [y, m, d] = date.split('-').map(Number);
  const [hh, mm] = time.split(':').map(Number);
  return new Date(y, m - 1, d, hh, mm, 0, 0);
}

const Button25Page: React.FC = () => {
  const [teacher, setTeacher] = useState<string>('김민지');

  // Mock statistics data
  const stats = useMemo(() => ({
    total: 150,
    normal: 116,
    failed: 34,
    abnormal: 51,
  }), []);

  const commonService = '발달재활서비스 가형';
  const commonSchedule = '2025-01-01 13:00';

  const childCell = (text: string) => (
    <Space size={4}>
      {text}
      <Tooltip title="아동 상세 보기">
        <LinkOutlined style={{ color: '#1890ff' }} />
      </Tooltip>
    </Space>
  );

  const columnsTimeIssue = useMemo(() => ([
    { title: '아동', dataIndex: 'child', key: 'child', width: 120, render: childCell },
    { title: '서비스명', dataIndex: 'service', key: 'service', width: 160 },
    { title: '수업 일정', dataIndex: 'schedule', key: 'schedule', width: 180, render: (text: string) => (<Text strong type="danger">{text}</Text>) },
    { title: '승인 일시', dataIndex: 'approvedAt', key: 'approvedAt', width: 160 },
  ]), []);

  const dataTimeIssue = useMemo(() => (
    Array.from({ length: 10 }).map((_, i) => ({
      key: `time-${i}`,
      child: '김민수',
      service: commonService,
      schedule: commonSchedule,
      approvedAt: randomApprovedAt2025(),
    }))
  ), []);

  const columnsSystemIssue = useMemo(() => ([
    { title: '아동', dataIndex: 'child', key: 'child', width: 120, render: childCell },
    { title: '서비스명', dataIndex: 'service', key: 'service', width: 160 },
    { title: '수업 일정', dataIndex: 'schedule', key: 'schedule', width: 160 },
    { title: '승인 일시', dataIndex: 'approvedAt', key: 'approvedAt', width: 160, render: (text: string) => (text === '-' ? <Badge status="error" text={<span style={{ color: '#ff4d4f' }}>발견하지 못함</span>} /> : <Text strong type="danger">{text}</Text>) },
  ]), []);

  const dataSystemIssue = useMemo(() => (
    Array.from({ length: 10 }).map((_, i) => ({
      key: `sys-${i}`,
      child: '김민수',
      service: commonService,
      schedule: commonSchedule,
      approvedAt: '-',
    }))
  ), []);

  const columnsOverpay = useMemo(() => ([
    { title: '아동', dataIndex: 'child', key: 'child', width: 120, render: childCell },
    { title: '서비스명', dataIndex: 'service', key: 'service', width: 160 },
    { title: '바우처 수납 금액', dataIndex: 'voucherAmount', key: 'voucherAmount', width: 160, render: (text: string) => (<Text strong type="danger">{text}</Text>) },
    { title: '총 금액', dataIndex: 'totalAmount', key: 'totalAmount', width: 140 },
  ]), []);

  const dataOverpay = useMemo(() => (
    Array.from({ length: 10 }).map((_, i) => {
      const total = randomInt(10000, 100000);
      return {
        key: `over-${i}`,
        child: '김민수',
        service: commonService,
        voucherAmount: formatKRW(50000),
        totalAmount: formatKRW(total),
      };
    })
  ), []);

  // Double payment pairs (within 50 minutes)
  const doublePairs = useMemo(() => {
    const baseTimes = Array.from({ length: 3 }).map(() => randomApprovedAt2025());
    const pairs = baseTimes.map((t) => {
      const date = toDate(t);
      const inc = randomInt(5, 45);
      const newDate = new Date(date.getTime() + inc * 60 * 1000);
      const m = pad(newDate.getMonth() + 1);
      const d = pad(newDate.getDate());
      const hh = pad(newDate.getHours());
      const mm = pad(newDate.getMinutes());
      const t2 = `${newDate.getFullYear()}-${m}-${d} ${hh}:${mm}`;
      const delta = Math.abs((toDate(t2).getTime() - toDate(t).getTime()) / 60000);
      return { a: t, b: t2, delta: Math.round(delta) };
    });
    return pairs;
  }, []);

  const dataDoubleIssue = useMemo(() => {
    const rows: any[] = [];
    doublePairs.forEach((p, idx) => {
      rows.push({ key: `dbl-${idx}-a`, pairId: idx + 1, pairSide: 'A', child: '김민수', service: commonService, approvedAt: p.a, isDouble: true, delta: p.delta });
      rows.push({ key: `dbl-${idx}-b`, pairId: idx + 1, pairSide: 'B', child: '김민수', service: commonService, approvedAt: p.b, isDouble: true, delta: p.delta });
    });
    return rows;
  }, [doublePairs, commonService, commonSchedule]);

  const columnsDoubleIssue = useMemo(() => ([
    { title: '아동', dataIndex: 'child', key: 'child', width: 120, render: childCell },
    { title: '서비스명', dataIndex: 'service', key: 'service', width: 160 },
    { 
      title: '승인 일시', dataIndex: 'approvedAt', key: 'approvedAt', width: 280, render: (_: string, r: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
          <span
            style={{
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              fontWeight: 600,
              minWidth: 150,
              display: 'inline-block'
            }}
          >
            {r.approvedAt}
          </span>
          <Tag color="red" icon={<WarningOutlined />}>이중결제</Tag>
          <Text type="secondary">Δ {r.delta}분</Text>
        </div>
      )
    },
  ]), []);

  const doublePairCount = useMemo(() => doublePairs.length, [doublePairs]);

  // control expansion only for the first row
  const firstDoubleKey = dataDoubleIssue[0]?.key;
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  const consolidatedColumns = useMemo(() => ([
    { title: '아동', dataIndex: 'child', key: 'child', width: 120 },
    { title: '서비스명', dataIndex: 'service', key: 'service', width: 160 },
    { title: '승인 일시', dataIndex: 'approvedAt', key: 'approvedAt', width: 180 },
    { title: 'Δ(분)', dataIndex: 'delta', key: 'delta', width: 80 },
  ]), []);

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center">
        <Space size={8}>
          <Text strong>선생님</Text>
          <Select
            value={teacher}
            onChange={(v) => setTeacher(v)}
            style={{ width: 180 }}
            size="middle"
          >
            <Option value="김민지">김민지</Option>
          </Select>
        </Space>
      </div>

      <div className="mb-4">
        <Title level={4} className="!mb-0">이상 수납 모니터링</Title>
        <Text type="secondary">선택한 선생님: {teacher}</Text>
      </div>

      {/* Statistics Dashboard Cards */}
      <Row gutter={[12, 12]} className="mb-6">
        <Col xs={12} sm={6} lg={3}>
          <Card size="small" bodyStyle={{ padding: '16px' }}>
            <Statistic
              title={<span style={{ fontSize: '13px' }}>Excel 업로드</span>}
              value={stats.total}
              prefix={<FileExcelOutlined style={{ color: '#1890ff', fontSize: '20px' }} />}
              valueStyle={{ color: '#1890ff', fontSize: '24px' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <Card size="small" bodyStyle={{ padding: '16px' }}>
            <Statistic
              title={<span style={{ fontSize: '13px' }}>정상</span>}
              value={stats.normal}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a', fontSize: '20px' }} />}
              valueStyle={{ color: '#52c41a', fontSize: '24px' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <Card size="small" bodyStyle={{ padding: '16px' }}>
            <Statistic
              title={<span style={{ fontSize: '13px' }}>실패</span>}
              value={stats.failed}
              prefix={<CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: '20px' }} />}
              valueStyle={{ color: '#ff4d4f', fontSize: '24px' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <Card size="small" bodyStyle={{ padding: '16px' }}>
            <Statistic
              title={<span style={{ fontSize: '13px' }}>이상 결제</span>}
              value={stats.abnormal}
              prefix={<WarningOutlined style={{ color: '#faad14', fontSize: '20px' }} />}
              valueStyle={{ color: '#faad14', fontSize: '24px' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <DataTable 
            title="수납시간 이상"
            titleRight={<Tooltip title="수업 일정이 정책 기준과 불일치한 건"><QuestionCircleOutlined className="text-gray-400"/></Tooltip>}
            columns={columnsTimeIssue}
            data={dataTimeIssue}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <DataTable 
            title="수납전산 이상"
            titleRight={<Tooltip title="전산 기록과 수납 내역 불일치"><QuestionCircleOutlined className="text-gray-400"/></Tooltip>}
            columns={columnsSystemIssue}
            data={dataSystemIssue}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <DataTable 
            title="이중결제"
            titleRight={<Badge count={doublePairCount} style={{ backgroundColor: '#ff4d4f' }} />}
            columns={columnsDoubleIssue}
            data={dataDoubleIssue.slice(0, 3)}
            rowClassName={(record: any) => record.isDouble ? 'bg-red-50' : ''}
            expandable={{
              expandedRowRender: (record: any) => {
                const list = dataDoubleIssue.filter(r => r.pairId === record.pairId);
                return (
                  <div style={{ background: 'white', padding: 8 }}>
                    <Table
                      size="small"
                      pagination={false}
                      rowKey={(r: any) => r.key}
                      columns={consolidatedColumns}
                      dataSource={list}
                    />
                  </div>
                );
              },
              rowExpandable: (record: any) => record.key === firstDoubleKey,
              expandedRowKeys: expandedKeys,
              onExpandedRowsChange: (keys: React.Key[]) => setExpandedKeys(keys as string[]),
            }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <DataTable 
            title="과오결제"
            columns={columnsOverpay}
            data={dataOverpay}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Button25Page;
