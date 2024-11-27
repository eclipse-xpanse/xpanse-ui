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
    csp,
    Deployment,
    kind,
    serviceHostingType,
    ServiceTemplateDetailVo,
    serviceTemplateRegistrationState,
} from '../../../xpanse-api/generated';
import { ServiceTemplateRegisterStatus } from '../common/catalog/ServiceTemplateRegisterStatus.tsx';
import { DeployedServicesHostingType } from '../deployedServices/common/DeployedServicesHostingType';
import GetServiceTemplatesListError from './GetServiceTemplatesListError';
import { ServiceReviewsDetails } from './ServiceReviewsDetails';
import useListAllServiceTemplatesQuery from './query/useListAllServiceTemplatesQuery';

export default function ServiceReviews(): React.JSX.Element {
    let serviceNameFilters: ColumnFilterItem[] = [];
    let versionFilters: ColumnFilterItem[] = [];
    let cspFilters: ColumnFilterItem[] = [];
    let categoryFilters: ColumnFilterItem[] = [];
    let serviceHostingTypeFilters: ColumnFilterItem[] = [];
    let registrationStatusFilters: ColumnFilterItem[] = [];
    let deployerTypeFilters: ColumnFilterItem[] = [];
    let serviceTemplateList: ServiceTemplateDetailVo[] = [];
    const [currentServiceTemplateVo, setCurrentServiceTemplateVo] = useState<ServiceTemplateDetailVo | undefined>(
        undefined
    );
    const [isServiceTemplateDetailsModalOpen, setIsServiceTemplateDetailsModalOpen] = useState(false);

    const allServiceTemplatesListQuery = useListAllServiceTemplatesQuery();

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

    const getCspFilters = (): void => {
        const filters: ColumnFilterItem[] = [];
        Object.values(csp).forEach((csp) => {
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
        Object.values(category).forEach((category) => {
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
        Object.values(serviceTemplateRegistrationState).forEach((status) => {
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
        Object.values(kind).forEach((kind) => {
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
        getServiceHostingTypeFilters();
        getCspFilters();
        getCategoryFilters();
        getRegistrationStatusFilters();
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

    const columns: ColumnsType<ServiceTemplateDetailVo> = [
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
            onFilter: (value: React.Key | boolean, record) => record.category.startsWith(value.toString()),
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
            title: 'Service Hosting Type',
            dataIndex: 'serviceHostingType',
            filters: serviceHostingTypeFilters,
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value: React.Key | boolean, record) => record.serviceHostingType.startsWith(value.toString()),
            align: 'center',
            render: (value: serviceHostingType) => <DeployedServicesHostingType currentServiceHostingType={value} />,
        },
        {
            title: 'Deployer Type',
            dataIndex: 'deployment',
            filters: deployerTypeFilters,
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value: React.Key | boolean, record) =>
                record.deployment.deployerTool.kind.toString() === value.toString(),
            align: 'left',
            render: (deployment: Deployment) =>
                deployment.deployerTool.kind.toString() === kind.TERRAFORM.toString() ? (
                    <Tag bordered={false} color='success' className={serviceReviewStyles.deployerTypeSize}>
                        {'Terraform'}
                    </Tag>
                ) : (
                    <Tag bordered={false} color='success' className={serviceReviewStyles.deployerTypeSize}>
                        {'Opentofu'}
                    </Tag>
                ),
        },
        {
            title: 'Registration Status',
            dataIndex: 'serviceTemplateRegistrationState',
            filters: registrationStatusFilters,
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value: React.Key | boolean, record) =>
                record.serviceTemplateRegistrationState.startsWith(value.toString()),
            align: 'left',
            render: (serviceTemplateRegistrationState: serviceTemplateRegistrationState) => (
                <ServiceTemplateRegisterStatus serviceRegistrationStatus={serviceTemplateRegistrationState} />
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
                                {record.serviceTemplateRegistrationState === serviceTemplateRegistrationState.IN_REVIEW
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
        <div className={tableStyles.genericTableContainer}>
            {currentServiceTemplateVo ? (
                <Modal
                    title={'Service Details'}
                    width={'80%'}
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
                <div className={serviceReviewStyles.serviceInstanceList}>
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
}
