/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import 'echarts/lib/chart/bar';
import '../../../styles/monitor.css';
import { MonitorOutlined } from '@ant-design/icons';
import { Button, Col, Empty, Form, Input, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { ApiError, Response, ServiceVo } from '../../../xpanse-api/generated';
import { MonitorTip } from './MonitorTip';
import { MonitorChart } from './MonitorChart';
import { useDeployedServicesByUserQuery } from './useDeployedServicesByUserQuery';

function Monitor(): JSX.Element {
    const [form] = Form.useForm();
    const [serviceId, setServiceId] = useState<string>('');
    const [deployedServiceList, setDeployedServiceList] = useState<ServiceVo[]>([]);
    const [tipType, setTipType] = useState<'error' | 'success' | undefined>(undefined);
    const [tipMessage, setTipMessage] = useState<string>('');
    const [tipDescription, setTipDescription] = useState<string>('');
    const [isQueryResultDisabled, setIsQueryResultDisabled] = useState<boolean>(false);
    const [serviceNameList, setServiceNameList] = useState<{ value: string; label: string }[]>([
        { value: '', label: '' },
    ]);
    const [customerServiceNameList, setCustomerServiceNameList] = useState<
        { value: string; label: string; serviceName: string; id: string }[]
    >([{ value: '', label: '', serviceName: '', id: '' }]);

    const deployedServiceQuery = useDeployedServicesByUserQuery();

    useEffect(() => {
        if (deployedServiceQuery.isSuccess) {
            const serviceList: ServiceVo[] | undefined = deployedServiceQuery.data;
            const serviceNameList: { value: string; label: string }[] = [];
            const customerServiceNameList: { value: string; label: string; serviceName: string; id: string }[] = [];

            if (serviceList.length > 0) {
                const serviceVoMap: Map<string, ServiceVo[]> = new Map<string, ServiceVo[]>();
                serviceList.forEach((serviceVo: ServiceVo) => {
                    if (serviceVo.serviceDeploymentState === ServiceVo.serviceDeploymentState.DEPLOY_SUCCESS) {
                        if (!serviceVoMap.has(serviceVo.name)) {
                            serviceVoMap.set(
                                serviceVo.name,
                                serviceList.filter((data: ServiceVo) => data.name === serviceVo.name)
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
                setDeployedServiceList(serviceList);
                setServiceNameList(serviceNameList);
                setCustomerServiceNameList(customerServiceNameList);
            }
        }
    }, [deployedServiceQuery.data, deployedServiceQuery.isSuccess]);

    useEffect(() => {
        if (deployedServiceQuery.isError) {
            setDeployedServiceList([]);
            setServiceNameList([]);
            setCustomerServiceNameList([]);
            setTipType('error');
            setIsQueryResultDisabled(true);
            if (deployedServiceQuery.error instanceof ApiError && 'details' in deployedServiceQuery.error.body) {
                const response: Response = deployedServiceQuery.error.body as Response;
                setTipMessage(response.resultType.valueOf());
                setTipDescription(response.details.join());
            } else if (deployedServiceQuery.error instanceof Error) {
                setTipMessage('Error while fetching all deployed services.');
                setTipDescription(deployedServiceQuery.error.message);
            }
        }
    }, [deployedServiceQuery.isError, deployedServiceQuery.error]);

    const handleChangeServiceName = (selectServiceName: string) => {
        const customerServiceNameList: { value: string; label: string; serviceName: string; id: string }[] = [];
        if (selectServiceName) {
            form.setFieldsValue({ serviceId: '' });
            form.setFieldsValue({ customerServiceName: '' });
            deployedServiceList.forEach((serviceVo: ServiceVo) => {
                if (
                    serviceVo.name === selectServiceName &&
                    serviceVo.serviceDeploymentState === ServiceVo.serviceDeploymentState.DEPLOY_SUCCESS
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
        form.setFieldsValue({ serviceId: selectCustomerServiceName });
        if (customerServiceNameList.length > 0) {
            const currentCustomerServiceNameList: { value: string; label: string; serviceName: string; id: string }[] =
                customerServiceNameList.filter((service) => service.id === selectCustomerServiceName);
            form.setFieldsValue({ serviceName: currentCustomerServiceNameList[0].serviceName });
        }
    };

    const onFinish = (values: { serviceName: string; customerServiceName: string; serviceId: string }) => {
        setServiceId('');
        if (!values.serviceId) {
            setTipType(undefined);
            setTipMessage('');
            setTipDescription('');
            return;
        }
        setIsQueryResultDisabled(false);
        setServiceId(values.serviceId);
    };
    const onReset = () => {
        setServiceId('');
        setTipType(undefined);
        setTipMessage('');
        setTipDescription('');
        setIsQueryResultDisabled(false);
        form.resetFields();
        const customerServiceNameList: { value: string; label: string; serviceName: string; id: string }[] = [];
        deployedServiceList.forEach((serviceVo: ServiceVo) => {
            if (serviceVo.serviceDeploymentState === ServiceVo.serviceDeploymentState.DEPLOY_SUCCESS) {
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
        setServiceId('');
    };

    const onRemove = () => {
        setServiceId('');
        form.resetFields();
        setTipType(undefined);
        setTipMessage('');
        setTipDescription('');
        setIsQueryResultDisabled(false);
    };

    const getTipInfo = (
        serviceId: string,
        isLoading: boolean,
        tipType: 'error' | 'success' | undefined,
        tipMessage: string,
        tipDescription: string,
        isQueryResultDisabled: boolean
    ) => {
        setServiceId(serviceId);
        setTipType(tipType);
        setTipMessage(tipMessage);
        setTipDescription(tipDescription);
        setIsQueryResultDisabled(isQueryResultDisabled);
    };

    return (
        <div className={'services-content'}>
            <div className={'monitor-service-select-title'}>
                <h3>
                    <MonitorOutlined />
                    &nbsp; Operating System Monitor
                </h3>
            </div>
            <MonitorTip type={tipType} msg={tipMessage} description={tipDescription} onRemove={onRemove} />

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
                                disabled={isQueryResultDisabled}
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
                                disabled={isQueryResultDisabled}
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
                                disabled={isQueryResultDisabled}
                                className={'monitor-search-button-class'}
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
            {serviceId.length > 0 ? (
                <div>
                    <MonitorChart serviceId={serviceId} getTipInfo={getTipInfo} />
                </div>
            ) : (
                <div className={'service-blank-class'}>
                    <Empty description={'No services available.'} />
                </div>
            )}
        </div>
    );
}
export default Monitor;
