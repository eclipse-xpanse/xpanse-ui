/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { MonitorOutlined } from '@ant-design/icons';
import { Button, Col, Empty, Form, Input, Row, Select, Skeleton, Spin } from 'antd';
import React, { lazy, Suspense, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import monitorStyles from '../../../styles/monitor.module.css';
import emptyServicesStyle from '../../../styles/services-empty.module.css';
import tablesStyle from '../../../styles/table.module.css';
import { DeployedService, ServiceDeploymentState } from '../../../xpanse-api/generated';
import { MetricAutoRefreshSwitch } from './MetricAutoRefreshSwitch';
import { MetricChartsPerRowDropDown } from './MetricChartsPerRowDropDown';
import { MetricTimePeriodRadioButton } from './MetricTimePeriodRadioButton';
import { MonitorTip } from './MonitorTip.tsx';
import { chartsPerRowWithTwo, lastMinuteRadioButtonKeyId } from './metricProps';
import { useDeployedServicesByUserQuery } from './useDeployedServicesByUserQuery';

const MonitorChart = lazy(() => import('./MonitorChart.tsx'));

function Monitor(): React.JSX.Element {
    const [form] = Form.useForm();
    const [serviceId, setServiceId] = useState<string>('');
    const [serviceName, setServiceName] = useState<string>('');
    const [customerServiceName, setCustomerServiceName] = useState<string>('');
    const [submittedData, setSubmittedData] = useState<boolean>(false);

    const [timePeriod, setTimePeriod] = useState<number>(lastMinuteRadioButtonKeyId.valueOf());
    const [isAutoRefresh, setIsAutoRefresh] = useState<boolean>(true);
    const [chartsPerRow, setChartsPerRow] = useState<string>(chartsPerRowWithTwo);
    const [numberOfChartsAvailable, setNumberOfChartsAvailable] = useState<number>(0);
    const deployedServiceQuery = useDeployedServicesByUserQuery();

    const location = useLocation();

    const onFinish = () => {
        setSubmittedData(true);
    };

    if (location.state && serviceId == '') {
        const serviceVo: DeployedService = location.state as DeployedService;
        form.setFieldsValue({ serviceName: serviceVo.name });
        form.setFieldsValue({ customerServiceName: serviceVo.customerServiceName ?? undefined });
        form.setFieldsValue({ serviceId: serviceVo.serviceId });
        setServiceId(serviceVo.serviceId);
        setServiceName(serviceVo.name);
        setCustomerServiceName(serviceVo.customerServiceName ?? '');
        onFinish();
    }

    const customServiceNamesList = useMemo(() => {
        const newCustomerServiceNameList: { value: string; label: string; serviceName: string; id: string }[] = [];
        const serviceList: DeployedService[] = deployedServiceQuery.data ?? [];
        const filteredServiceNameList: DeployedService[] = serviceName
            ? serviceList.filter((service) => service.name === serviceName)
            : serviceList;
        if (deployedServiceQuery.data && deployedServiceQuery.data.length > 0) {
            filteredServiceNameList.forEach((serviceVo: DeployedService) => {
                if (serviceVo.serviceDeploymentState === ServiceDeploymentState.DEPLOYMENT_SUCCESSFUL) {
                    if (serviceVo.name === serviceName) {
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
                }
            });
        }
        return newCustomerServiceNameList;
    }, [deployedServiceQuery.data, serviceName]);

    const newServiceNameList = useMemo(() => {
        const newServiceNameList: { value: string; label: string }[] = [];
        if (deployedServiceQuery.data && deployedServiceQuery.data.length > 0) {
            deployedServiceQuery.data.forEach((serviceVo: DeployedService) => {
                if (newServiceNameList.filter((serviceName) => serviceName.value === serviceVo.name).length == 0) {
                    newServiceNameList.push({
                        value: serviceVo.name,
                        label: serviceVo.name,
                    });
                }
            });
        }
        return newServiceNameList;
    }, [deployedServiceQuery.data]);

    function getServiceIdOfService(customerServiceName: string, serviceName: string): string {
        let serviceId: string = '';
        if (deployedServiceQuery.data && deployedServiceQuery.data.length > 0) {
            serviceId =
                deployedServiceQuery.data.find(
                    (service: DeployedService) =>
                        service.name == serviceName && service.customerServiceName == customerServiceName
                )?.serviceId ?? '';
        }
        return serviceId;
    }

    const handleChangeServiceName = (selectServiceName: string) => {
        setServiceName(selectServiceName);
        form.setFieldsValue({ serviceName: selectServiceName });
    };

    const handleChangeCustomerServiceName = (selectCustomerServiceName: string) => {
        const serviceId = getServiceIdOfService(selectCustomerServiceName, serviceName);
        setServiceId(serviceId);
        setCustomerServiceName(customerServiceName);
        form.setFieldsValue({ customerServiceName: selectCustomerServiceName });
        form.setFieldsValue({ serviceId: serviceId });
    };

    const onReset = () => {
        setServiceId('');
        setServiceName('');
        setCustomerServiceName('');
        setSubmittedData(false);
        form.resetFields();
    };

    const onFinishFailed = () => {
        setServiceId('');
    };

    const retryRequest = () => {
        void deployedServiceQuery.refetch();
    };

    return (
        <div className={tablesStyle.genericTableContainer}>
            <div className={monitorStyles.monitorServiceSelectTitle}>
                <h3>
                    <MonitorOutlined />
                    &nbsp; Operating System Monitor
                </h3>
            </div>
            {deployedServiceQuery.isError ? (
                <MonitorTip
                    error={deployedServiceQuery.error}
                    isNoMetricsAvailable={false}
                    onRemove={onReset}
                    retryRequest={retryRequest}
                />
            ) : null}
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
                                disabled={deployedServiceQuery.isError || deployedServiceQuery.isLoading}
                            >
                                {newServiceNameList.map((item, _) => (
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
                                disabled={deployedServiceQuery.isError || deployedServiceQuery.isLoading}
                            >
                                {customServiceNamesList.map((item, _) => (
                                    <Select.Option key={item.id} value={item.value}>
                                        {item.value}
                                    </Select.Option>
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
            {deployedServiceQuery.isLoading || deployedServiceQuery.isPending ? (
                <Spin size='large' spinning={deployedServiceQuery.isLoading} />
            ) : null}
            {submittedData ? (
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
