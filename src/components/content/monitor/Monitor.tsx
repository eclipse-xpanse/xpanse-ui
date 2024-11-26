/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { MonitorOutlined } from '@ant-design/icons';
import { Button, Col, Empty, Form, Input, Row, Select, Skeleton } from 'antd';
import React, { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import monitorStyles from '../../../styles/monitor.module.css';
import emptyServicesStyle from '../../../styles/services-empty.module.css';
import tablesStyle from '../../../styles/table.module.css';
import { ApiError, DeployedService, ErrorResponse, serviceDeploymentState } from '../../../xpanse-api/generated';
import { isErrorResponse } from '../common/error/isErrorResponse';
import { MetricAutoRefreshSwitch } from './MetricAutoRefreshSwitch';
import { MetricChartsPerRowDropDown } from './MetricChartsPerRowDropDown';
import { MetricTimePeriodRadioButton } from './MetricTimePeriodRadioButton';
import { chartsPerRowWithTwo, lastMinuteRadioButtonKeyId } from './metricProps';
import { useDeployedServicesByUserQuery } from './useDeployedServicesByUserQuery';

const MonitorChart = lazy(() => import('./MonitorChart.tsx'));

function Monitor(): React.JSX.Element {
    const [form] = Form.useForm();
    const [serviceId, setServiceId] = useState<string>('');
    let deployedServiceList: DeployedService[] = [];
    const tipType = useRef<'error' | 'success' | undefined>(undefined);
    const tipMessage = useRef<string>('');
    const tipDescription = useRef<string>('');
    let serviceNameList: { value: string; label: string }[] = [{ value: '', label: '' }];
    let customerServiceNameList: { value: string; label: string; serviceName: string; id: string }[] = [
        { value: '', label: '', serviceName: '', id: '' },
    ];

    const [timePeriod, setTimePeriod] = useState<number>(lastMinuteRadioButtonKeyId.valueOf());
    const [isAutoRefresh, setIsAutoRefresh] = useState<boolean>(true);
    const [chartsPerRow, setChartsPerRow] = useState<string>(chartsPerRowWithTwo);
    const [numberOfChartsAvailable, setNumberOfChartsAvailable] = useState<number>(0);
    const deployedServiceQuery = useDeployedServicesByUserQuery();

    const location = useLocation();

    const onFinish = useCallback((values: { serviceName: string; customerServiceName: string; serviceId: string }) => {
        setServiceId('');
        if (!values.serviceId) {
            tipType.current = undefined;
            tipMessage.current = '';
            tipDescription.current = '';
            return;
        }
        setServiceId(values.serviceId);
    }, []);

    // Effect necessary since the form data is set outside the React context.
    useEffect(() => {
        if (location.state) {
            const serviceVo: DeployedService = location.state as DeployedService;
            form.setFieldsValue({ serviceName: serviceVo.name });
            form.setFieldsValue({ customerServiceName: serviceVo.customerServiceName ?? undefined });
            form.setFieldsValue({ serviceId: serviceVo.serviceId });
            onFinish({
                serviceName: serviceVo.name,
                customerServiceName: serviceVo.customerServiceName ?? '',
                serviceId: serviceVo.serviceId,
            });
        }
    }, [form, location.state, onFinish]);

    if (deployedServiceQuery.isSuccess) {
        const serviceList: DeployedService[] = deployedServiceQuery.data;
        const newServiceNameList: { value: string; label: string }[] = [];
        const newCustomerServiceNameList: { value: string; label: string; serviceName: string; id: string }[] = [];
        if (serviceList.length > 0) {
            const serviceVoMap: Map<string, DeployedService[]> = new Map<string, DeployedService[]>();
            serviceList.forEach((serviceVo: DeployedService) => {
                if (serviceVo.serviceDeploymentState === serviceDeploymentState.DEPLOYMENT_SUCCESSFUL) {
                    if (!serviceVoMap.has(serviceVo.name)) {
                        serviceVoMap.set(
                            serviceVo.name,
                            serviceList.filter((data: DeployedService) => data.name === serviceVo.name)
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
                        id: serviceVo.serviceId,
                    };
                    newCustomerServiceNameList.push(customerServiceName);
                }
            });
            serviceVoMap.forEach((_, name) => {
                const serviceNameUnique: { value: string; label: string } = {
                    value: name,
                    label: name,
                };
                newServiceNameList.push(serviceNameUnique);
            });
            deployedServiceList = serviceList;
            serviceNameList = newServiceNameList;
            customerServiceNameList = newCustomerServiceNameList;
        }
    }

    if (deployedServiceQuery.isError) {
        tipType.current = 'error';
        if (
            deployedServiceQuery.error instanceof ApiError &&
            deployedServiceQuery.error.body &&
            isErrorResponse(deployedServiceQuery.error.body)
        ) {
            const response: ErrorResponse = deployedServiceQuery.error.body;
            tipMessage.current = response.errorType.valueOf();
            tipDescription.current = response.details.join();
        } else if (deployedServiceQuery.error instanceof Error) {
            tipMessage.current = 'Error while fetching all deployed services.';
            tipDescription.current = deployedServiceQuery.error.message;
        }
    }

    const handleChangeServiceName = (selectServiceName: string) => {
        const newCustomerServiceNameList: { value: string; label: string; serviceName: string; id: string }[] = [];
        if (selectServiceName) {
            form.setFieldsValue({ serviceId: '' });
            form.setFieldsValue({ customerServiceName: '' });
            deployedServiceList.forEach((serviceVo: DeployedService) => {
                if (
                    serviceVo.name === selectServiceName &&
                    serviceVo.serviceDeploymentState === serviceDeploymentState.DEPLOYMENT_SUCCESSFUL
                ) {
                    const cusServiceName: { value: string; label: string; serviceName: string; id: string } = {
                        value: serviceVo.customerServiceName ?? '',
                        label: serviceVo.customerServiceName ?? '',
                        serviceName: serviceVo.name,
                        id: serviceVo.serviceId,
                    };
                    newCustomerServiceNameList.push(cusServiceName);
                }
            });
        }
        customerServiceNameList = newCustomerServiceNameList;
    };

    const handleChangeCustomerServiceName = (selectCustomerServiceName: string) => {
        setServiceId('');
        form.setFieldsValue({ serviceId: selectCustomerServiceName });
        if (customerServiceNameList.length > 0) {
            const currentCustomerServiceNameList: { value: string; label: string; serviceName: string; id: string }[] =
                customerServiceNameList.filter((service) => service.id === selectCustomerServiceName);
            form.setFieldsValue({ serviceName: currentCustomerServiceNameList[0].serviceName });
        }
    };

    const onReset = () => {
        setServiceId('');
        tipType.current = undefined;
        tipMessage.current = '';
        tipDescription.current = '';
        form.resetFields();
        const newCustomerServiceNameList: { value: string; label: string; serviceName: string; id: string }[] = [];
        deployedServiceList.forEach((serviceVo: DeployedService) => {
            if (serviceVo.serviceDeploymentState === serviceDeploymentState.DEPLOYMENT_SUCCESSFUL) {
                const cusServiceName: { value: string; label: string; serviceName: string; id: string } = {
                    value: serviceVo.customerServiceName ?? '',
                    label: serviceVo.customerServiceName ?? '',
                    serviceName: serviceVo.name,
                    id: serviceVo.serviceId,
                };
                newCustomerServiceNameList.push(cusServiceName);
            }
        });
        customerServiceNameList = newCustomerServiceNameList;
    };

    const onFinishFailed = () => {
        setServiceId('');
    };

    return (
        <div className={tablesStyle.genericTableContainer}>
            <div className={monitorStyles.monitorServiceSelectTitle}>
                <h3>
                    <MonitorOutlined />
                    &nbsp; Operating System Monitor
                </h3>
            </div>
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
                                disabled={deployedServiceQuery.isError}
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
                                disabled={deployedServiceQuery.isError}
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
                                disabled={deployedServiceQuery.isError}
                                className={monitorStyles.monitorSearchButtonClass}
                            >
                                Search
                            </Button>{' '}
                            &nbsp;&nbsp;
                            <Button htmlType='button' onClick={onReset}>
                                Cancel
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            <div className={monitorStyles.chartOperationClass}>
                <MetricTimePeriodRadioButton isLoading={false} timePeriod={timePeriod} setTimePeriod={setTimePeriod} />
                <br />
                <br />
                <br />
                <div>
                    <MetricAutoRefreshSwitch
                        isLoading={false}
                        isAutoRefresh={isAutoRefresh}
                        setIsAutoRefresh={setIsAutoRefresh}
                    />
                    <MetricChartsPerRowDropDown
                        isLoading={false}
                        metricChartsPerRow={chartsPerRow}
                        optionLength={numberOfChartsAvailable}
                        setMetricChartsPerRow={setChartsPerRow}
                    />
                </div>
            </div>
            {serviceId.length > 0 ? (
                <div>
                    <Suspense fallback={<Skeleton />}>
                        <MonitorChart
                            serviceId={serviceId}
                            timePeriod={timePeriod}
                            isAutoRefresh={isAutoRefresh}
                            chartsPerRow={chartsPerRow}
                            setNumberOfChartsAvailable={setNumberOfChartsAvailable}
                            onReset={onReset}
                        />
                    </Suspense>
                </div>
            ) : (
                <div className={emptyServicesStyle.serviceBlankClass}>
                    <Empty description={'No metrics data available.'} />
                </div>
            )}
        </div>
    );
}

export default Monitor;
