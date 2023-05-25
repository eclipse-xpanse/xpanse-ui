/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import 'echarts/lib/chart/bar';
import '../../../styles/monitor.css';
import { MonitorOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row, Select, Tabs } from 'antd';
import { Tab } from 'rc-tabs/lib/interface';
import React, { useEffect, useState } from 'react';
import MonitorChart from './MonitorChart';
import { Metric, MonitorService, ServiceService, ServiceVo } from '../../../xpanse-api/generated';
import { arrayQueue, Queue } from '../../utils/Queue';
import { fetchMonitorMetricDataTimeInterval, monitorMetricQueueSize, usernameKey } from '../../utils/constants';
import { MonitorTip } from './MonitorTip';
import { MetricProps } from './metricProps';

function Monitor(): JSX.Element {
    const [form] = Form.useForm();
    const [serviceId, setServiceId] = useState<string>('');
    const [monitorChartItems, setMonitorChartItems] = useState<Tab[]>([]);
    const [deployedServiceList, setDeployedServiceList] = useState<ServiceVo[]>([]);
    const [refreshMonitorMetrics, setRefreshMonitorMetrics] = useState<number | undefined>(undefined);
    const monitorMetricsQueue: Queue<Metric[]> = arrayQueue<Metric[]>(monitorMetricQueueSize);
    const [tipType, setTipType] = useState<'error' | 'success' | undefined>(undefined);
    const [tipMessage, setTipMessage] = useState<string>('');
    const [isQueryResultAvailable, setIsQueryResultAvailable] = useState<boolean>(false);
    const [serviceNameList, setServiceNameList] = useState<{ value: string; label: string }[]>([
        { value: '', label: '' },
    ]);
    const [customerServiceNameList, setCustomerServiceNameList] = useState<{ value: string; label: string }[]>([
        { value: '', label: '' },
    ]);

    useEffect(() => {
        const userName: string | null = localStorage.getItem(usernameKey);
        if (!userName) {
            return;
        }
        void ServiceService.getDeployedServicesByUser(userName)
            .then((rsp: ServiceVo[]) => {
                const serviceNameList: { value: string; label: string }[] = [];
                const customerServiceNameList: { value: string; label: string }[] = [];
                if (rsp.length > 0) {
                    rsp.forEach((serviceVo: ServiceVo) => {
                        if (serviceVo.serviceState === ServiceVo.serviceState.DEPLOY_SUCCESS) {
                            const customerServiceName: { value: string; label: string } = {
                                value: serviceVo.customerServiceName ?? '',
                                label: serviceVo.customerServiceName ?? '',
                            };
                            customerServiceNameList.push(customerServiceName);
                            const serviceName: { value: string; label: string } = {
                                value: serviceVo.name,
                                label: serviceVo.name,
                            };

                            serviceNameList.push(serviceName);
                        }
                    });
                    setDeployedServiceList(rsp);
                    setServiceNameList(serviceNameList);
                    setCustomerServiceNameList(customerServiceNameList);
                }
            })
            .catch(() => {
                setDeployedServiceList([]);
                setServiceNameList([]);
                setCustomerServiceNameList([]);
                setTipType('error');
                setTipMessage('Error while fetching all deployed services.');
                setIsQueryResultAvailable(true);
            });
    }, []);

    const handleChangeServiceName = (selectServiceName: string) => {
        if (selectServiceName) {
            const cusServiceNameList: { value: string; label: string }[] = [];
            deployedServiceList.forEach((serviceVo: ServiceVo) => {
                if (serviceVo.name === selectServiceName) {
                    const cusServiceName: { value: string; label: string } = {
                        value: serviceVo.customerServiceName ?? '',
                        label: serviceVo.customerServiceName ?? '',
                    };
                    cusServiceNameList.push(cusServiceName);
                }
            });
            setCustomerServiceNameList(cusServiceNameList);
        }
    };

    const handleChangeCustomerServiceName = (selectCustomerServiceName: string) => {
        form.setFieldsValue({ ServiceId: getCurrentServiceId(selectCustomerServiceName) });
    };

    const getCurrentServiceId = (selectCustomerServiceName: string): string => {
        let currentServiceId: string = '';
        if (selectCustomerServiceName) {
            deployedServiceList.forEach((serviceVo) => {
                if (selectCustomerServiceName === serviceVo.customerServiceName) {
                    currentServiceId = serviceVo.id;
                }
            });
        }
        return currentServiceId;
    };

    const onFinish = (values: { ServiceName: string; CustomerServiceName: string; ServiceId: string }) => {
        monitorMetricsQueue.clear();
        if (refreshMonitorMetrics) {
            clearInterval(refreshMonitorMetrics);
        }
        if (!values.ServiceId) {
            return;
        }
        const selectedServiceId = values.ServiceId;
        setServiceId(selectedServiceId);
        void MonitorService.getMetrics(selectedServiceId)
            .then((rsp: Metric[]) => {
                if (rsp.length > 0) {
                    setTipMessage('');
                    setTipType(undefined);
                    monitorMetricsQueue.enqueue(rsp);
                    showMonitorMetrics(monitorMetricsQueue);
                    startFetchMonitorMetricDataTimer(monitorMetricsQueue, selectedServiceId);
                }
            })
            .catch(() => {
                setTipType('error');
                setTipMessage('Error while getting metrics of the deployed service.');
                setIsQueryResultAvailable(true);
            });
    };

    const startFetchMonitorMetricDataTimer = (monitorMetricsQueue: Queue<Metric[]>, selectedServiceId: string) => {
        try {
            const newFetchMonitorMetricDataTimer: number = window.setInterval(
                () => fetchMonitorMetricsData(monitorMetricsQueue, selectedServiceId),
                fetchMonitorMetricDataTimeInterval
            );
            setRefreshMonitorMetrics(newFetchMonitorMetricDataTimer);
            return () => {
                if (refreshMonitorMetrics) {
                    clearInterval(refreshMonitorMetrics);
                }
            };
        } catch (error) {
            setTipType('error');
            setTipMessage('An exception occurred in the request metric timer.');
            setIsQueryResultAvailable(true);
        }
    };

    const fetchMonitorMetricsData = (monitorMetricsQueue: Queue<Metric[]>, selectedServiceId: string) => {
        void MonitorService.getMetrics(selectedServiceId)
            .then((rsp: Metric[]) => {
                if (rsp.length > 0) {
                    setTipType(undefined);
                    setTipMessage('');
                    if (monitorMetricsQueue.isFull()) {
                        monitorMetricsQueue.dequeue();
                    }
                    monitorMetricsQueue.enqueue(rsp);
                    showMonitorMetrics(monitorMetricsQueue);
                }
            })
            .catch(() => {
                setTipType('error');
                setTipMessage('Error while getting metrics of the deployed service.');
                setIsQueryResultAvailable(true);
            });
    };

    const showMonitorMetrics = (queue: Queue<Metric[]>) => {
        if (queue.isEmpty()) {
            return;
        }
        const metrics: Metric[] = [];
        for (let i = 0; i < queue.size(); i++) {
            queue.peek(i)?.item.forEach((metric) => {
                metrics.push(metric);
            });
        }
        const currentMetrics: Map<string, Metric[]> = new Map<string, Metric[]>();
        for (const metric of metrics) {
            if (metric.name && !currentMetrics.has(metric.name)) {
                currentMetrics.set(
                    metric.name,
                    metrics.filter((data: Metric) => data.name === metric.name)
                );
            }
        }
        setMonitorChartItems(getMonitorChartItems(currentMetrics));
    };

    const getMonitorChartItems = (currentMetrics: Map<string, Metric[]>) => {
        const chartItems: Tab[] = [];
        currentMetrics.forEach((v, k) => {
            const metricProps: MetricProps[] = [];
            v.forEach((metric: Metric) => {
                const labelsMap = new Map<string, string>();
                if (metric.labels) {
                    for (const key in metric.labels) {
                        labelsMap.set(key, metric.labels[key]);
                    }
                }
                let metricProp: MetricProps = {
                    id: labelsMap.get('id') ?? '',
                    name: metric.name ?? '',
                    vmName: labelsMap.get('name') ?? '',
                    value: 0,
                };
                if (metric.metrics) {
                    metricProp = {
                        id: labelsMap.get('id') ?? '',
                        name: metric.name ?? '',
                        vmName: labelsMap.get('name') ?? '',
                        value: metric.metrics[0].value ?? 0,
                    };
                }
                metricProps.push(metricProp);
            });
            const chartItem: Tab = {
                key: k,
                label: <b>{k.split('_')[0]}</b>,
                children: <MonitorChart monitorType={k} metricProps={metricProps} />,
            };
            chartItems.push(chartItem);
        });
        return chartItems;
    };

    const onReset = () => {
        setServiceId('');
        form.resetFields();
        setTipType(undefined);
        setIsQueryResultAvailable(false);
        if (refreshMonitorMetrics) {
            clearInterval(refreshMonitorMetrics);
        }
    };

    const onFinishFailed = () => {
        setTipType('error');
        setTipMessage('An exception occurred while querying metrics.');
        setIsQueryResultAvailable(true);
    };

    return (
        <div className={'services-content'}>
            <div className={'monitor-service-select-title'}>
                <h3>
                    <MonitorOutlined />
                    &nbsp; Operating System Monitor
                </h3>
            </div>
            <MonitorTip type={tipType} msg={tipMessage} />
            <Form
                name='basic'
                form={form}
                initialValues={{ remember: true, ServiceId: '' }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Row justify='space-between'>
                    <Col span={4}>
                        <Form.Item name='ServiceName' label='ServiceName'>
                            <Select
                                placeholder='Select a service'
                                allowClear
                                onChange={handleChangeServiceName}
                                options={serviceNameList}
                                disabled={isQueryResultAvailable}
                            ></Select>
                        </Form.Item>
                    </Col>
                    <Col span={7}>
                        <Form.Item name='CustomerServiceName' label='CustomerServiceName' rules={[{ required: true }]}>
                            <Select
                                placeholder='Select a service'
                                onChange={handleChangeCustomerServiceName}
                                allowClear
                                options={customerServiceNameList}
                                disabled={isQueryResultAvailable}
                            ></Select>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name='ServiceId' label='ServiceId'>
                            <Input disabled={true} />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item>
                            <Button type='primary' htmlType='submit' style={{ marginRight: '15px' }}>
                                Search
                            </Button>
                            <Button htmlType='button' onClick={onReset}>
                                Cancel
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            {serviceId.length > 0 ? (
                <div>
                    <Tabs defaultActiveKey='1' items={monitorChartItems} />
                </div>
            ) : (
                <div></div>
            )}
        </div>
    );
}
export default Monitor;
