/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { InfoCircleOutlined, SearchOutlined, SyncOutlined } from '@ant-design/icons';
import { Button, Input, Modal, Row, Space, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { ColumnFilterItem, FilterDropdownProps } from 'antd/es/table/interface';
import React, { useState } from 'react';
import serviceReviewStyles from '../../../styles/service-review.module.css';
import tableStyles from '../../../styles/table.module.css';
import {
    category,
    kind,
    serviceHostingType,
    serviceTemplateRegistrationState,
    ServiceTemplateRequestToReview,
} from '../../../xpanse-api/generated';
import { ServiceTemplateRegisterStatus } from '../common/catalog/ServiceTemplateRegisterStatus.tsx';
import { DeployedServicesHostingType } from '../deployedServices/common/DeployedServicesHostingType';
import GetServiceTemplatesListError from './GetServiceTemplatesListError';
import { ServiceReviewsDetails } from './ServiceReviewsDetails';
import useGetPendingServiceReviewRequestQuery from './query/useGetPendingServiceReviewRequestQuery';

export default function ServiceReviews(): React.JSX.Element {
    let serviceNameFilters: ColumnFilterItem[] = [];
    let versionFilters: ColumnFilterItem[] = [];
    let categoryFilters: ColumnFilterItem[] = [];
    let serviceHostingTypeFilters: ColumnFilterItem[] = [];
    let deployerTypeFilters: ColumnFilterItem[] = [];
    let serviceTemplateRequestToReviewList: ServiceTemplateRequestToReview[] = [];
    const [currentServiceTemplateRequestToReview, setCurrentServiceTemplateRequestToReview] = useState<
        ServiceTemplateRequestToReview | undefined
    >(undefined);
    const [isServiceTemplateDetailsModalOpen, setIsServiceTemplateDetailsModalOpen] = useState(false);

    const pendingServiceReviewRequestQuery = useGetPendingServiceReviewRequestQuery(undefined);

    const getServiceHostingTypeFilters = (): void => {
        const filters: ColumnFilterItem[] = [];
        Object.values(serviceHostingType).forEach((serviceHostingType) => {
            const filter = {
                text: serviceHostingType,
                value: serviceHostingType,
            };
            filters.push(filter);
        });
        serviceHostingTypeFilters = filters;
    };

    const getServiceNameFilters = (serviceTemplateRequestToReviewList: ServiceTemplateRequestToReview[]): void => {
        const filters: ColumnFilterItem[] = [];
        const nameSet = new Set<string>('');
        serviceTemplateRequestToReviewList.forEach((v) => {
            nameSet.add(v.ocl.name);
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

    const getVersionFilters = (serviceTemplateRequestToReviewList: ServiceTemplateRequestToReview[]): void => {
        const filters: ColumnFilterItem[] = [];
        const versionSet = new Set<string>('');
        serviceTemplateRequestToReviewList.forEach((v) => {
            versionSet.add(v.ocl.serviceVersion);
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
        Object.values(category).forEach((category) => {
            const filter = {
                text: category,
                value: category,
            };
            filters.push(filter);
        });
        categoryFilters = filters;
    }

    function getDeployerTypeFilters(): void {
        const filters: ColumnFilterItem[] = [];
        Object.values(kind).forEach((kind) => {
            const filter = {
                text: kind,
                value: kind,
            };
            filters.push(filter);
        });
        deployerTypeFilters = filters;
    }

    if (pendingServiceReviewRequestQuery.isSuccess && pendingServiceReviewRequestQuery.data.length > 0) {
        serviceTemplateRequestToReviewList = pendingServiceReviewRequestQuery.data;
        getServiceNameFilters(pendingServiceReviewRequestQuery.data);
        getVersionFilters(pendingServiceReviewRequestQuery.data);
        getServiceHostingTypeFilters();
        getCategoryFilters();
        getDeployerTypeFilters();
    }

    const handleSearch = (confirm: FilterDropdownProps['confirm']) => {
        confirm();
    };
    const handleReset = (clearFilters: (() => void) | undefined) => {
        if (clearFilters) {
            clearFilters();
        }
    };

    const columns: ColumnsType<ServiceTemplateRequestToReview> = [
        {
            title: 'Request Id',
            dataIndex: 'requestId',
            onFilter: (value: React.Key | boolean, record) => record.requestId.startsWith(value.toString()),
            align: 'left',
        },
        {
            title: 'Request Type',
            dataIndex: 'requestType',
            onFilter: (value: React.Key | boolean, record) => record.requestType.startsWith(value.toString()),
            align: 'left',
        },
        {
            title: 'Service Template Id',
            dataIndex: 'serviceTemplateId',
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div className={serviceReviewStyles.searchContainerClass}>
                    <Input
                        placeholder='Search ID'
                        value={selectedKeys[0]}
                        onChange={(e) => {
                            setSelectedKeys(e.target.value ? [e.target.value] : []);
                        }}
                        onPressEnter={() => {
                            handleSearch(confirm);
                        }}
                        className={serviceReviewStyles.searchInputClass}
                    />
                    <Button
                        type='primary'
                        onClick={() => {
                            handleSearch(confirm);
                        }}
                        icon={<SearchOutlined />}
                        size='small'
                        className={serviceReviewStyles.searchButtonClass}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => {
                            handleReset(clearFilters);
                        }}
                        size='small'
                        className={serviceReviewStyles.searchResetClass}
                    >
                        Reset
                    </Button>
                </div>
            ),
            filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
            onFilter: (value: React.Key | boolean, record) => {
                if (record.serviceTemplateId) {
                    return record.serviceTemplateId.toString().toLowerCase().includes(value.toString().toLowerCase());
                }
                return false;
            },
            align: 'left',
        },
        {
            title: 'Category',
            dataIndex: 'category',
            filters: categoryFilters,
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value: React.Key | boolean, record) => record.ocl.category.startsWith(value.toString()),
            align: 'left',
            render: (_, record) => <div>{record.ocl.category}</div>,
        },
        {
            title: 'Service Name',
            dataIndex: 'name',
            filters: serviceNameFilters,
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value: React.Key | boolean, record) => {
                if (record.ocl.name) {
                    const customerServiceName = record.ocl.name;
                    return customerServiceName.startsWith(value.toString());
                }
                return false;
            },
            align: 'left',
            render: (_, record) => <div>{record.ocl.name}</div>,
        },
        {
            title: 'Service Version',
            dataIndex: 'serviceVersion',
            filters: versionFilters,
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value: React.Key | boolean, record) => {
                if (record.ocl.serviceVersion) {
                    const customerServiceName = record.ocl.serviceVersion;
                    return customerServiceName.startsWith(value.toString());
                }
                return false;
            },
            align: 'left',
            render: (_, record) => <div>{record.ocl.serviceVersion}</div>,
        },
        {
            title: 'Service Hosting Type',
            dataIndex: 'serviceHostingType',
            filters: serviceHostingTypeFilters,
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value: React.Key | boolean, record) =>
                record.ocl.serviceHostingType.startsWith(value.toString()),
            align: 'center',
            render: (_, record) => (
                <DeployedServicesHostingType
                    currentServiceHostingType={record.ocl.serviceHostingType as serviceHostingType}
                />
            ),
        },
        {
            title: 'Deployer Type',
            dataIndex: 'deployment',
            filters: deployerTypeFilters,
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value: React.Key | boolean, record) =>
                record.ocl.deployment.deployerTool.kind.toString() === value.toString(),
            align: 'left',
            render: (_, record) => (
                <Tag bordered={false} color='success' className={serviceReviewStyles.deployerTypeSize}>
                    {record.ocl.deployment.deployerTool.kind.toString() === kind.TERRAFORM.toString()
                        ? 'Terraform'
                        : 'Opentofu'}
                </Tag>
            ),
        },
        {
            title: 'Registration Status',
            dataIndex: 'serviceTemplateRegistrationState',
            align: 'left',
            render: () => (
                <ServiceTemplateRegisterStatus serviceRegistrationStatus={serviceTemplateRegistrationState.IN_REVIEW} />
            ),
        },
        {
            title: 'Operation',
            dataIndex: 'operation',
            render: (_text: string, record: ServiceTemplateRequestToReview) => {
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
                                review
                            </Button>
                        </Space>
                    </>
                );
            },
            align: 'left',
        },
    ];

    const handleServiceTemplateDetailsOpenModal = (serviceTemplateRequestToReview: ServiceTemplateRequestToReview) => {
        setCurrentServiceTemplateRequestToReview(serviceTemplateRequestToReview);
        setIsServiceTemplateDetailsModalOpen(true);
    };

    const refreshData = () => {
        setIsServiceTemplateDetailsModalOpen(false);
        void pendingServiceReviewRequestQuery.refetch();
    };

    const handleServiceTemplateDetailsModalClose = () => {
        setCurrentServiceTemplateRequestToReview(undefined);
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
        <div className={tableStyles.genericTableContainer}>
            {currentServiceTemplateRequestToReview ? (
                <Modal
                    title={'Service Details'}
                    width={'80%'}
                    footer={null}
                    destroyOnClose={true}
                    open={isServiceTemplateDetailsModalOpen}
                    onCancel={handleServiceTemplateDetailsModalClose}
                >
                    <ServiceReviewsDetails
                        currentServiceTemplateRequestToReview={currentServiceTemplateRequestToReview}
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
            {pendingServiceReviewRequestQuery.isError ? (
                <GetServiceTemplatesListError error={pendingServiceReviewRequestQuery.error} />
            ) : (
                <></>
            )}

            <Row>
                <div className={serviceReviewStyles.serviceInstanceList}>
                    <Table
                        columns={columns}
                        dataSource={serviceTemplateRequestToReviewList}
                        loading={
                            pendingServiceReviewRequestQuery.isLoading || pendingServiceReviewRequestQuery.isRefetching
                        }
                        rowKey={'id'}
                    />
                </div>
            </Row>
        </div>
    );
}
