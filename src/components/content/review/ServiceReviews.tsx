/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React, { useState } from 'react';
import useListAllServiceTemplatesQuery from './query/useListAllServiceTemplatesQuery';
import { Deployment, ServiceTemplateDetailVo } from '../../../xpanse-api/generated';
import { Button, Input, Modal, Row, Space, Table, Tag } from 'antd';
import { InfoCircleOutlined, SearchOutlined, SyncOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import { ColumnFilterItem, FilterDropdownProps } from 'antd/es/table/interface';
import { ServiceReviewsDetails } from './ServiceReviewsDetails';
import '../../../styles/service_review.css';
import GetServiceTemplatesListError from './GetServiceTemplatesListError';
import { ServiceTemplateRegisterStatus } from './ServiceTemplateRegisterStatus';

export const ServiceReviews = (): React.JSX.Element => {
    let serviceNameFilters: ColumnFilterItem[] = [];
    let versionFilters: ColumnFilterItem[] = [];
    let cspFilters: ColumnFilterItem[] = [];
    let categoryFilters: ColumnFilterItem[] = [];
    let registrationStatusFilters: ColumnFilterItem[] = [];
    let deployerTypeFilters: ColumnFilterItem[] = [];
    let serviceTemplateList: ServiceTemplateDetailVo[] = [];
    const [currentServiceTemplateVo, setCurrentServiceTemplateVo] = useState<ServiceTemplateDetailVo | undefined>(
        undefined
    );
    const [isServiceTemplateDetailsModalOpen, setIsServiceTemplateDetailsModalOpen] = useState(false);

    const allServiceTemplatesListQuery = useListAllServiceTemplatesQuery();

    const getCspFilters = (): void => {
        const filters: ColumnFilterItem[] = [];
        Object.values(ServiceTemplateDetailVo.csp).forEach((csp) => {
            const filter = {
                text: csp,
                value: csp,
            };
            filters.push(filter);
        });
        cspFilters = filters;
    };
    const getServiceNameFilters = (serviceTemplateDetailVoList: ServiceTemplateDetailVo[]): void => {
        const filters: ColumnFilterItem[] = [];
        const nameSet = new Set<string>('');
        serviceTemplateDetailVoList.forEach((v) => {
            nameSet.add(v.name);
        });
        nameSet.forEach((name) => {
            const filter = {
                text: name,
                value: name,
            };
            filters.push(filter);
        });
        serviceNameFilters = filters;
    };

    const getVersionFilters = (serviceTemplateDetailVoList: ServiceTemplateDetailVo[]): void => {
        const filters: ColumnFilterItem[] = [];
        const versionSet = new Set<string>('');
        serviceTemplateDetailVoList.forEach((v) => {
            versionSet.add(v.version);
        });
        versionSet.forEach((version) => {
            const filter = {
                text: version,
                value: version,
            };
            filters.push(filter);
        });
        versionFilters = filters;
    };

    function getCategoryFilters(): void {
        const filters: ColumnFilterItem[] = [];
        Object.values(ServiceTemplateDetailVo.category).forEach((category) => {
            const filter = {
                text: category,
                value: category,
            };
            filters.push(filter);
        });
        categoryFilters = filters;
    }

    function getRegistrationStatusFilters(): void {
        const filters: ColumnFilterItem[] = [];
        Object.values(ServiceTemplateDetailVo.serviceRegistrationState).forEach((status) => {
            const filter = {
                text: status,
                value: status,
            };
            filters.push(filter);
        });
        registrationStatusFilters = filters;
    }

    function getDeployerTypeFilters(): void {
        const filters: ColumnFilterItem[] = [];
        Object.values(Deployment.kind).forEach((kind) => {
            const filter = {
                text: kind,
                value: kind,
            };
            filters.push(filter);
        });
        deployerTypeFilters = filters;
    }

    if (allServiceTemplatesListQuery.isSuccess && allServiceTemplatesListQuery.data.length > 0) {
        serviceTemplateList = allServiceTemplatesListQuery.data;
        getServiceNameFilters(allServiceTemplatesListQuery.data);
        getVersionFilters(allServiceTemplatesListQuery.data);
        getCspFilters();
        getCategoryFilters();
        getRegistrationStatusFilters();
        getDeployerTypeFilters();
    }

    const handleSearch = (selectedKeys: React.Key[], confirm: FilterDropdownProps['confirm']) => {
        confirm();
    };
    const handleReset = (clearFilters: (() => void) | undefined) => {
        if (clearFilters) {
            clearFilters();
        }
    };

    const columns: ColumnsType<ServiceTemplateDetailVo> = [
        {
            title: 'Service Template Id',
            dataIndex: 'id',
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div className={'search-container-class'}>
                    <Input
                        placeholder='Search ID'
                        value={selectedKeys[0]}
                        onChange={(e) => {
                            setSelectedKeys(e.target.value ? [e.target.value] : []);
                        }}
                        onPressEnter={() => {
                            handleSearch(selectedKeys, confirm);
                        }}
                        className={'search-input-class'}
                    />
                    <Button
                        type='primary'
                        onClick={() => {
                            handleSearch(selectedKeys, confirm);
                        }}
                        icon={<SearchOutlined />}
                        size='small'
                        className={'search-button-class'}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => {
                            handleReset(clearFilters);
                        }}
                        size='small'
                        className={'search-reset-class'}
                    >
                        Reset
                    </Button>
                </div>
            ),
            filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
            onFilter: (value: React.Key | boolean, record) => {
                if (record.id) {
                    return record.id.toString().toLowerCase().includes(value.toString().toLowerCase());
                }
                return false;
            },
            align: 'left',
        },
        {
            title: 'Service Name',
            dataIndex: 'name',
            filters: serviceNameFilters,
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value: React.Key | boolean, record) => {
                if (record.name) {
                    const customerServiceName = record.name;
                    return customerServiceName.startsWith(value.toString());
                }
                return false;
            },
            align: 'left',
        },
        {
            title: 'Version',
            dataIndex: 'version',
            filters: versionFilters,
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value: React.Key | boolean, record) => {
                if (record.version) {
                    const customerServiceName = record.version;
                    return customerServiceName.startsWith(value.toString());
                }
                return false;
            },
            align: 'left',
        },
        {
            title: 'Csp',
            dataIndex: 'csp',
            filters: cspFilters,
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value: React.Key | boolean, record) => record.csp.startsWith(value.toString()),
            align: 'left',
        },
        {
            title: 'Category',
            dataIndex: 'category',
            filters: categoryFilters,
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value: React.Key | boolean, record) => record.category.startsWith(value.toString()),
            align: 'left',
        },
        {
            title: 'Registration Status',
            dataIndex: 'serviceRegistrationState',
            filters: registrationStatusFilters,
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value: React.Key | boolean, record) =>
                record.serviceRegistrationState.startsWith(value.toString()),
            align: 'left',
            render: (serviceRegistrationState: ServiceTemplateDetailVo.serviceRegistrationState) =>
                ServiceTemplateRegisterStatus(serviceRegistrationState),
        },
        {
            title: 'Deployer Type',
            dataIndex: 'deployment',
            filters: deployerTypeFilters,
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value: React.Key | boolean, record) => record.deployment.kind.startsWith(value.toString()),
            align: 'left',
            render: (deployment: Deployment) =>
                deployment.kind === Deployment.kind.TERRAFORM ? (
                    <Tag bordered={false} color='success' className={'my-service-status-size'}>
                        {'Terraform'}
                    </Tag>
                ) : (
                    <Tag bordered={false} color='success' className={'my-service-status-size'}>
                        {'Opentofu'}
                    </Tag>
                ),
        },
        {
            title: 'Operation',
            dataIndex: 'operation',
            render: (_text: string, record: ServiceTemplateDetailVo) => {
                return (
                    <>
                        <Space size='middle'>
                            <Button
                                type='primary'
                                icon={<InfoCircleOutlined />}
                                onClick={() => {
                                    handleServiceTemplateDetailsOpenModal(record);
                                }}
                            >
                                {record.serviceRegistrationState ===
                                ServiceTemplateDetailVo.serviceRegistrationState.APPROVAL_PENDING
                                    ? 'review'
                                    : 'details'}
                            </Button>
                        </Space>
                    </>
                );
            },
            align: 'left',
        },
    ];

    const handleServiceTemplateDetailsOpenModal = (serviceTemplateDetailVo: ServiceTemplateDetailVo) => {
        setCurrentServiceTemplateVo(serviceTemplateDetailVo);
        setIsServiceTemplateDetailsModalOpen(true);
    };

    const refreshData = () => {
        setIsServiceTemplateDetailsModalOpen(false);
        void allServiceTemplatesListQuery.refetch();
    };

    const handleServiceTemplateDetailsModalClose = () => {
        setCurrentServiceTemplateVo(undefined);
        setIsServiceTemplateDetailsModalOpen(false);
        refreshData();
    };

    const setAlertTipCloseStatus = (isClose: boolean) => {
        if (isClose) {
            setIsServiceTemplateDetailsModalOpen(false);
            refreshData();
        }
    };

    return (
        <div className={'generic-table-container'}>
            {currentServiceTemplateVo ? (
                <Modal
                    title={'Service Details'}
                    width={1000}
                    footer={null}
                    destroyOnClose={true}
                    open={isServiceTemplateDetailsModalOpen}
                    onCancel={handleServiceTemplateDetailsModalClose}
                >
                    <ServiceReviewsDetails
                        currentServiceTemplateVo={currentServiceTemplateVo}
                        setAlertTipCloseStatus={setAlertTipCloseStatus}
                    />
                </Modal>
            ) : null}

            <div>
                <Button
                    type='primary'
                    icon={<SyncOutlined />}
                    onClick={() => {
                        refreshData();
                    }}
                >
                    refresh
                </Button>
            </div>
            {allServiceTemplatesListQuery.isError ? (
                <GetServiceTemplatesListError error={allServiceTemplatesListQuery.error} />
            ) : (
                <></>
            )}

            <Row>
                <div className={'service-instance-list'}>
                    <Table
                        columns={columns}
                        dataSource={serviceTemplateList}
                        loading={allServiceTemplatesListQuery.isLoading || allServiceTemplatesListQuery.isRefetching}
                        rowKey={'id'}
                    />
                </div>
            </Row>
        </div>
    );
};
