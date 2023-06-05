/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import 'echarts/lib/chart/bar';
import '../../../styles/monitor.css';
import { MonitorOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row, Select, Spin, Tabs } from 'antd';
import { Tab } from 'rc-tabs/lib/interface';
import React, { useEffect, useState } from 'react';
import { Metric, MonitorService, ServiceService, ServiceVo } from '../../../xpanse-api/generated';
import { fetchMonitorMetricDataTimeInterval, monitorMetricQueueSize, usernameKey } from '../../utils/constants';
import { MonitorTip } from './MonitorTip';
import { MetricProps } from './metricProps';
import MonitorChart from './MonitorChart';

function Monitor(): JSX.Element {
    const [form] = Form.useForm();
    const [serviceId, setServiceId] = useState<string>('');
    const [deployedServiceList, setDeployedServiceList] = useState<ServiceVo[]>([]);
    const [monitorMetricsQueue, setMonitorMetricsQueue] = useState<Metric[][]>(new Array(monitorMetricQueueSize));
    const [refreshMonitorMetrics, setRefreshMonitorMetrics] = useState<number | undefined>(undefined);
    const [monitorChartItems, setMonitorChartItems] = useState<Tab[]>([]);
    const [isAutoRefresh, setIsAutoRefresh] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [tipType, setTipType] = useState<'error' | 'success' | undefined>(undefined);
    const [tipMessage, setTipMessage] = useState<string>('');
    const [isQueryResultAvailable, setIsQueryResultAvailable] = useState<boolean>(false);
    const [serviceNameList, setServiceNameList] = useState<{ value: string; label: string }[]>([
        { value: '', label: '' },
    ]);
    const [customerServiceNameList, setCustomerServiceNameList] = useState<
        { value: string; label: string; serviceName: string; id: string }[]
    >([{ value: '', label: '', serviceName: '', id: '' }]);

    useEffect(() => {
        const userName: string | null = localStorage.getItem(usernameKey);
        if (!userName) {
            return;
        }
        void ServiceService.getDeployedServicesByUser(userName)
            .then((rsp: ServiceVo[]) => {
                const serviceNameList: { value: string; label: string }[] = [];
                const customerServiceNameList: { value: string; label: string; serviceName: string; id: string }[] = [];
                if (rsp.length > 0) {
                    const serviceVoMap: Map<string, ServiceVo[]> = new Map<string, ServiceVo[]>();
                    rsp.forEach((serviceVo: ServiceVo) => {
                        if (serviceVo.serviceState === ServiceVo.serviceState.DEPLOY_SUCCESS) {
                            if (!serviceVoMap.has(serviceVo.name)) {
                                serviceVoMap.set(
                                    serviceVo.name,
                                    rsp.filter((data: ServiceVo) => data.name === serviceVo.name)
                                );
                            }
                            const customerServiceName: {
                                value: string;
                                label: string;
                                serviceName: string;
                                id: string;
                            } = {
                                value: serviceVo.customerServiceName ?? '',
                                label: serviceVo.customerServiceName ?? '',
                                serviceName: serviceVo.name,
                                id: serviceVo.id,
                            };
                            customerServiceNameList.push(customerServiceName);
                        }
                    });
                    serviceVoMap.forEach((service, name) => {
                        const serviceNameUnique: { value: string; label: string } = {
                            value: name,
                            label: name,
                        };
                        serviceNameList.push(serviceNameUnique);
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
        const customerServiceNameList: { value: string; label: string; serviceName: string; id: string }[] = [];
        if (selectServiceName) {
            form.setFieldsValue({ serviceId: '' });
            form.setFieldsValue({ customerServiceName: '' });
            deployedServiceList.forEach((serviceVo: ServiceVo) => {
                if (
                    serviceVo.name === selectServiceName &&
                    serviceVo.serviceState === ServiceVo.serviceState.DEPLOY_SUCCESS
                ) {
                    const cusServiceName: { value: string; label: string; serviceName: string; id: string } = {
                        value: serviceVo.customerServiceName ?? '',
                        label: serviceVo.customerServiceName ?? '',
                        serviceName: serviceVo.name,
                        id: serviceVo.id,
                    };
                    customerServiceNameList.push(cusServiceName);
                }
            });
        }
        setCustomerServiceNameList(customerServiceNameList);
    };

    const handleChangeCustomerServiceName = (selectCustomerServiceName: string) => {
        setServiceId('');
        setIsAutoRefresh(false);
        if (refreshMonitorMetrics) {
            clearInterval(refreshMonitorMetrics);
        }
        setMonitorMetricsQueue([]);
        form.setFieldsValue({ serviceId: selectCustomerServiceName });
        if (customerServiceNameList.length > 0) {
            const currentCustomerServiceNameList: { value: string; label: string; serviceName: string; id: string }[] =
                customerServiceNameList.filter((service) => service.id === selectCustomerServiceName);
            form.setFieldsValue({ serviceName: currentCustomerServiceNameList[0].serviceName });
        }
    };

    const onFinish = (values: { serviceName: string; customerServiceName: string; serviceId: string }) => {
        setServiceId('');
        setIsAutoRefresh(false);
        if (refreshMonitorMetrics) {
            clearInterval(refreshMonitorMetrics);
        }
        setMonitorMetricsQueue([]);
        if (!values.serviceId) {
            return;
        }
        setIsLoading(true);
        setIsQueryResultAvailable(true);
        setServiceId(values.serviceId);
        setIsAutoRefresh(true);
    };
    const autoRefreshHandler = (switchResult: boolean) => {
        setIsAutoRefresh(switchResult);
    };

    useEffect(() => {
        if (serviceId.length > 0) {
            if (isAutoRefresh) {
                startFetchMonitorMetricDataTimer();
            } else {
                if (refreshMonitorMetrics) {
                    clearInterval(refreshMonitorMetrics);
                }
                return;
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [serviceId, isAutoRefresh]);

    useEffect(() => {
        if (monitorMetricsQueue.length > 0) {
            showMonitorMetrics(monitorMetricsQueue);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [monitorMetricsQueue]);

    const fetchMonitorMetricsData = (selectedServiceId: string) => {
        void MonitorService.getMetrics(selectedServiceId)
            .then((rsp: Metric[]) => {
                if (rsp.length > 0) {
                    setIsLoading(false);
                    setIsQueryResultAvailable(false);
                    setTipMessage('');
                    setTipType(undefined);
                    setMonitorMetricsQueue((prevQueue) => {
                        const newQueue = [...prevQueue, rsp];
                        if (newQueue.length > monitorMetricQueueSize) {
                            newQueue.shift();
                        }

                        return newQueue;
                    });
                } else {
                    setIsLoading(false);
                    setServiceId('');
                    setIsAutoRefresh(false);
                    setMonitorMetricsQueue([]);
                    if (refreshMonitorMetrics) {
                        clearInterval(refreshMonitorMetrics);
                    }
                    setTipType('error');
                    setTipMessage('No metrics found for the selected service.');
                    setIsQueryResultAvailable(true);
                }
            })
            .catch(() => {
                setIsLoading(false);
                setServiceId('');
                setIsAutoRefresh(false);
                setMonitorMetricsQueue([]);
                if (refreshMonitorMetrics) {
                    clearInterval(refreshMonitorMetrics);
                }
                setTipType('error');
                setTipMessage('No metrics found for the selected service.');
                setIsQueryResultAvailable(true);
            });
    };
    const startFetchMonitorMetricDataTimer = () => {
        try {
            const newFetchMonitorMetricDataTimer: number = window.setInterval(
                () => fetchMonitorMetricsData(serviceId),
                fetchMonitorMetricDataTimeInterval
            );
            setRefreshMonitorMetrics(newFetchMonitorMetricDataTimer);
            return () => {
                if (refreshMonitorMetrics) {
                    clearInterval(refreshMonitorMetrics);
                }
            };
        } catch (error) {
            setIsLoading(false);
            setServiceId('');
            setIsAutoRefresh(false);
            setMonitorMetricsQueue([]);
            if (refreshMonitorMetrics) {
                clearInterval(refreshMonitorMetrics);
            }
            setTipType('error');
            setTipMessage('An exception occurred in the request metric timer.');
            setIsQueryResultAvailable(true);
        }
    };

    const showMonitorMetrics = (monitorMetricsQueue: Metric[][]) => {
        if (monitorMetricsQueue.length === 0) {
            return;
        }
        const metrics: Metric[] = [];
        monitorMetricsQueue.forEach((item) => {
            item.forEach((metric) => {
                metrics.push(metric);
            });
        });
        const currentMetrics: Map<string, Metric[]> = new Map<string, Metric[]>();
        for (const metric of metrics) {
            if (metric.name && !currentMetrics.has(metric.name)) {
                currentMetrics.set(
                    metric.name,
                    metrics.filter((data: Metric) => data.name === metric.name)
                );
            }
        }
        const sortedCurrentMetrics = new Map([...currentMetrics.entries()].sort());
        setMonitorChartItems(getMonitorChartItems(sortedCurrentMetrics));
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
                const metricProp: MetricProps = {
                    id: labelsMap.get('id') ?? '',
                    name: metric.name,
                    vmName: labelsMap.get('name') ?? '',
                    value: metric.metrics?.[0]?.value ?? 0,
                    unit: metric.unit,
                };
                metricProps.push(metricProp);
            });
            const chartItem: Tab = {
                key: k,
                label: <b>{k.split('_')[0]}</b>,
                children: <MonitorChart monitorType={k} metricProps={metricProps} onAutoRefresh={autoRefreshHandler} />,
            };
            chartItems.push(chartItem);
        });
        return chartItems;
    };
    const onReset = () => {
        setServiceId('');
        setIsAutoRefresh(false);
        if (refreshMonitorMetrics) {
            clearInterval(refreshMonitorMetrics);
        }
        setTipType(undefined);
        setIsQueryResultAvailable(false);
        setMonitorMetricsQueue([]);
        form.resetFields();
        const customerServiceNameList: { value: string; label: string; serviceName: string; id: string }[] = [];
        deployedServiceList.forEach((serviceVo: ServiceVo) => {
            if (serviceVo.serviceState === ServiceVo.serviceState.DEPLOY_SUCCESS) {
                const cusServiceName: { value: string; label: string; serviceName: string; id: string } = {
                    value: serviceVo.customerServiceName ?? '',
                    label: serviceVo.customerServiceName ?? '',
                    serviceName: serviceVo.name,
                    id: serviceVo.id,
                };
                customerServiceNameList.push(cusServiceName);
            }
        });
        setCustomerServiceNameList(customerServiceNameList);
    };

    const onFinishFailed = () => {
        setIsLoading(false);
        setServiceId('');
        setIsAutoRefresh(false);
        setMonitorMetricsQueue([]);
        if (refreshMonitorMetrics) {
            clearInterval(refreshMonitorMetrics);
        }
        setTipType('error');
        setTipMessage('An exception occurred while querying metrics.');
        setIsQueryResultAvailable(true);
    };

    const onRemove = () => {
        setServiceId('');
        setIsAutoRefresh(false);
        setMonitorMetricsQueue([]);
        if (refreshMonitorMetrics) {
            clearInterval(refreshMonitorMetrics);
        }
        form.resetFields();
        setTipType(undefined);
        setIsQueryResultAvailable(false);
    };

    return (
        <div className={'services-content'}>
            <div className={'monitor-service-select-title'}>
                <h3>
                    <MonitorOutlined />
                    &nbsp; Operating System Monitor
                </h3>
            </div>
            <MonitorTip type={tipType} msg={tipMessage} onRemove={onRemove} />
            <Form
                name='basic'
                form={form}
                initialValues={{ remember: true, serviceId: '' }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Row justify='space-between'>
                    <Col span={4}>
                        <Form.Item name='serviceName' label='serviceName'>
                            <Select
                                placeholder='Select a service'
                                onChange={handleChangeServiceName}
                                disabled={isQueryResultAvailable}
                            >
                                {serviceNameList.map((item, _) => (
                                    <Select.Option key={item.value} value={item.value}>
                                        {item.value}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={7}>
                        <Form.Item name='customerServiceName' label='customerServiceName' rules={[{ required: true }]}>
                            <Select
                                placeholder='Select a service'
                                onChange={handleChangeCustomerServiceName}
                                disabled={isQueryResultAvailable}
                            >
                                {customerServiceNameList.map((item, _) => (
                                    <Select.Option key={item.id}>{item.value}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name='serviceId' label='serviceId'>
                            <Input disabled={true} />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item>
                            <Button
                                type='primary'
                                htmlType='submit'
                                disabled={isQueryResultAvailable}
                                className={'monitor-search-button-class'}
                            >
                                Search
                            </Button>{' '}
                            &nbsp;&nbsp;
                            <Button htmlType='button' disabled={isQueryResultAvailable} onClick={onReset}>
                                Cancel
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            {serviceId.length > 0 ? (
                <>
                    {isLoading ? (
                        <div className={'monitor-search-loading-class'}>
                            <Spin size='large' spinning={isLoading} />
                        </div>
                    ) : (
                        <div>
                            <Tabs defaultActiveKey='1' items={monitorChartItems} />
                        </div>
                    )}
                </>
            ) : (
                <div></div>
            )}
        </div>
    );
}
export default Monitor;
