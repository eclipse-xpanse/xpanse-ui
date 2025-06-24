/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { InfoCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { Button, Image, Modal, Row, Space, Table, TablePaginationConfig, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ColumnFilterItem, FilterValue, SorterResult } from 'antd/es/table/interface';
import React, { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import myServicesStyle from '../../../../styles/my-services.module.css';
import tablesStyle from '../../../../styles/table.module.css';
import {
    category,
    csp,
    DeployedService,
    name,
    serviceDeploymentState,
    serviceHostingType,
} from '../../../../xpanse-api/generated';
import { sortVersionNum } from '../../../utils/Sort';
import { serviceDetailsErrorText } from '../../../utils/constants';
import { cspMap } from '../../common/csp/CspLogo';
import RetryPrompt from '../../common/error/RetryPrompt.tsx';
import { useOrderFormStore } from '../../order/store/OrderFormStore';
import { DeployedServicesHostingType } from '../common/DeployedServicesHostingType';
import { DeployedServicesStatus } from '../common/DeployedServicesStatus';
import useListDeployedServicesByIsvQuery from '../myServices/query/useListDeployedServiceByIsvQuery';
import { ReportsServiceDetails } from './ReportsServiceDetails';

function Reports(): React.JSX.Element {
    const location = useLocation();
    const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
    let deployedServiceList: DeployedService[] = [];
    let versionFilters: ColumnFilterItem[] = [];
    let serviceHostingTypeFilters: ColumnFilterItem[] = [];
    let nameFilters: ColumnFilterItem[] = [];
    let customerServiceNameFilters: ColumnFilterItem[] = [];
    let categoryFilters: ColumnFilterItem[] = [];
    let cspFilters: ColumnFilterItem[] = [];
    let serviceIdFilters: ColumnFilterItem[] = [];
    let serviceStateFilters: ColumnFilterItem[] = [];
    const [serviceIdInModal, setServiceIdInModal] = useState<string>('');

    const [isMyServiceDetailsModalOpen, setIsMyServiceDetailsModalOpen] = useState(false);
    const [clearFormVariables] = useOrderFormStore((state) => [state.clearFormVariables]);

    // redirect from isv service details page
    const serviceNameInQuery = useMemo(() => {
        const serviceName = searchParams.get('serviceName');
        return serviceName ? [serviceName] : null;
    }, [searchParams]);

    const serviceVersionInQuery = useMemo(() => {
        const serviceVersion = searchParams.get('serviceVersion');
        return serviceVersion ? [serviceVersion] : null;
    }, [searchParams]);

    // redirect from isv dashboard
    const serviceDeploymentStateInQuery = useMemo(() => {
        const states = searchParams.getAll('serviceDeploymentState');
        return states.length > 0 ? states : null;
    }, [searchParams]);

    const [serviceDeploymentStateFilteredValue, setServiceDeploymentStateFilteredValue] = useState<FilterValue | null>(
        serviceDeploymentStateInQuery
    );
    const [serviceIdFilteredValue, setServiceIdFilteredValue] = useState<FilterValue | null>(null);
    const [customerServiceNameFilteredValue, setCustomerServiceNameFilteredValue] = useState<FilterValue | null>(null);
    const [categoryFilteredValue, setCategoryFilteredValue] = useState<FilterValue | null>(null);
    const [cspFilteredValue, setCspFilteredValue] = useState<FilterValue | null>(null);
    const [serviceNameFilteredValue, setServiceNameFilteredValue] = useState<FilterValue | null>(serviceNameInQuery);
    const [serviceVersionFilteredValue, setServiceVersionFilteredValue] = useState<FilterValue | null>(
        serviceVersionInQuery
    );
    const [serviceHostingTypeFilteredValue, setServiceHostingTypeFilteredValue] = useState<FilterValue | null>(null);

    const handleFilterChange = (
        _pagination: TablePaginationConfig,
        filters: Record<string, FilterValue | null>,
        _sorter: SorterResult<DeployedService> | SorterResult<DeployedService>[]
    ) => {
        setServiceDeploymentStateFilteredValue(filters.serviceDeploymentState);
        setServiceIdFilteredValue(filters.serviceId);
        setCategoryFilteredValue(filters.category);
        setCspFilteredValue(filters.csp);
        setServiceNameFilteredValue(filters.name);
        setServiceVersionFilteredValue(filters.version);
        setCustomerServiceNameFilteredValue(filters.customerServiceName);
        setServiceHostingTypeFilteredValue(filters.serviceHostingType);
    };

    const listDeployedServicesByIsvQuery = useListDeployedServicesByIsvQuery();

    if (listDeployedServicesByIsvQuery.isSuccess && listDeployedServicesByIsvQuery.data.length > 0) {
        deployedServiceList = listDeployedServicesByIsvQuery.data;
        updateServiceIdFilters(listDeployedServicesByIsvQuery.data);
        updateVersionFilters(listDeployedServicesByIsvQuery.data);
        updateNameFilters(listDeployedServicesByIsvQuery.data);
        updateCategoryFilters();
        updateCspFilters();
        updateServiceStateFilters();
        updateCustomerServiceNameFilters(listDeployedServicesByIsvQuery.data);
        updateServiceHostingFilters();
    }

    const columns: ColumnsType<DeployedService> = [
        {
            title: 'ServiceId',
            dataIndex: 'serviceId',
            filters: serviceIdFilters,
            filterMode: 'tree',
            filterSearch: true,
            filteredValue: serviceIdFilteredValue,
            onFilter: (value: React.Key | boolean, record) => record.serviceId.startsWith(value.toString()),
            align: 'center',
        },
        {
            title: 'Name',
            dataIndex: 'customerServiceName',
            filters: customerServiceNameFilters,
            filterMode: 'tree',
            filterSearch: true,
            filteredValue: customerServiceNameFilteredValue,
            onFilter: (value: React.Key | boolean, record) => {
                if (record.customerServiceName !== undefined) {
                    const customerServiceName = record.customerServiceName;
                    return customerServiceName.startsWith(value.toString());
                }
                return false;
            },
            align: 'center',
        },
        {
            title: 'Category',
            dataIndex: 'category',
            filters: categoryFilters,
            filterMode: 'tree',
            filterSearch: true,
            filteredValue: categoryFilteredValue,
            onFilter: (value: React.Key | boolean, record) => record.category.startsWith(value.toString()),
            align: 'center',
        },
        {
            title: 'Service',
            dataIndex: 'name',
            filters: nameFilters,
            filterMode: 'tree',
            filterSearch: true,
            filteredValue: serviceNameFilteredValue,
            onFilter: (value: React.Key | boolean, record) => record.name.startsWith(value.toString()),
            align: 'center',
        },
        {
            title: 'Version',
            dataIndex: 'version',
            filters: versionFilters,
            filterMode: 'tree',
            filterSearch: true,
            filteredValue: serviceVersionFilteredValue,
            onFilter: (value: React.Key | boolean, record) => record.version.startsWith(value.toString()),
            sorter: (service1, service2) => sortVersionNum(service1.version, service2.version),
            align: 'center',
        },
        {
            title: 'ServiceHostedBy',
            dataIndex: 'serviceHostingType',
            filters: serviceHostingTypeFilters,
            filterMode: 'tree',
            filterSearch: true,
            filteredValue: serviceHostingTypeFilteredValue,
            onFilter: (value: React.Key | boolean, record) => record.serviceHostingType.startsWith(value.toString()),
            align: 'center',

            render: (serviceHostingType: serviceHostingType) => (
                <DeployedServicesHostingType currentServiceHostingType={serviceHostingType} />
            ),
        },
        {
            title: 'Csp',
            dataIndex: 'csp',
            filters: cspFilters,
            filterMode: 'tree',
            filterSearch: true,
            filteredValue: cspFilteredValue,
            onFilter: (value: React.Key | boolean, record) => record.csp.startsWith(value.toString()),
            render: (csp: csp, _) => {
                return (
                    <Space size='middle'>
                        <Image width={100} preview={false} src={cspMap.get(csp.valueOf() as name)?.logo} />
                    </Space>
                );
            },
            align: 'center',
        },
        {
            title: 'Flavor',
            dataIndex: 'flavor',
            align: 'center',
        },
        {
            title: 'Created On',
            dataIndex: 'createdTime',
            defaultSortOrder: 'descend',
            sorter: (deployedServiceA, deployedServiceB) => {
                const dateA = new Date(deployedServiceA.createdTime);
                const dateB = new Date(deployedServiceB.createdTime);
                return dateA.getTime() - dateB.getTime();
            },
            align: 'center',
        },
        {
            title: 'ServiceDeploymentState',
            dataIndex: 'serviceDeploymentState',
            filters: serviceStateFilters,
            filterMode: 'tree',
            filterSearch: true,
            filteredValue: serviceDeploymentStateFilteredValue,
            onFilter: (value: React.Key | boolean, record) =>
                record.serviceDeploymentState.startsWith(value.toString()),
            render: (serviceState: serviceDeploymentState) => DeployedServicesStatus(serviceState),
            align: 'center',
        },
        {
            title: 'Operation',
            dataIndex: 'operation',
            render: (_text: string, record: DeployedService) => {
                return (
                    <>
                        <Space size='middle'>
                            <Tooltip
                                title={
                                    record.serviceHostingType === serviceHostingType.SELF
                                        ? 'details of self hosted services cannot be viewed.'
                                        : ''
                                }
                            >
                                <Button
                                    disabled={record.serviceHostingType === serviceHostingType.SELF}
                                    type='primary'
                                    icon={<InfoCircleOutlined />}
                                    onClick={() => {
                                        handleMyServiceDetailsOpenModal(record);
                                    }}
                                >
                                    details
                                </Button>
                            </Tooltip>
                        </Space>
                    </>
                );
            },
            align: 'center',
        },
    ];

    function updateServiceIdFilters(resp: DeployedService[]): void {
        const filters: ColumnFilterItem[] = [];
        const serviceIdSet = new Set<string>('');
        resp.forEach((v) => {
            serviceIdSet.add(v.serviceId);
        });
        serviceIdSet.forEach((id) => {
            const filter = {
                text: id,
                value: id,
            };
            filters.push(filter);
        });
        serviceIdFilters = filters;
    }

    function updateCspFilters(): void {
        const filters: ColumnFilterItem[] = [];
        Object.values(csp).forEach((csp) => {
            const filter = {
                text: csp,
                value: csp,
            };
            filters.push(filter);
        });
        cspFilters = filters;
    }

    function updateServiceStateFilters(): void {
        const filters: ColumnFilterItem[] = [];
        Object.values(serviceDeploymentState).forEach((serviceStateItem) => {
            const filter = {
                text: serviceStateItem,
                value: serviceStateItem,
            };
            filters.push(filter);
        });
        serviceStateFilters = filters;
    }

    function updateCategoryFilters(): void {
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

    function updateVersionFilters(resp: DeployedService[]): void {
        const filters: ColumnFilterItem[] = [];
        const versionSet = new Set<string>('');
        resp.forEach((v) => {
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
    }

    function updateNameFilters(resp: DeployedService[]): void {
        const filters: ColumnFilterItem[] = [];
        const nameSet = new Set<string>('');
        resp.forEach((v) => {
            nameSet.add(v.name);
        });
        nameSet.forEach((name) => {
            const filter = {
                text: name,
                value: name,
            };
            filters.push(filter);
        });
        nameFilters = filters;
    }

    function updateCustomerServiceNameFilters(resp: DeployedService[]): void {
        const filters: ColumnFilterItem[] = [];
        const customerServiceNameSet = new Set<string>('');
        resp.forEach((v) => {
            if (v.customerServiceName) {
                customerServiceNameSet.add(v.customerServiceName);
            }
        });
        customerServiceNameSet.forEach((name) => {
            const filter = {
                text: name,
                value: name,
            };
            filters.push(filter);
        });
        customerServiceNameFilters = filters;
    }

    function updateServiceHostingFilters(): void {
        const filters: ColumnFilterItem[] = [];
        Object.values(serviceHostingType).forEach((serviceHostingType) => {
            const filter = {
                text: serviceHostingType,
                value: serviceHostingType,
            };
            filters.push(filter);
        });
        serviceHostingTypeFilters = filters;
    }

    function refreshData(): void {
        clearFormVariables();
        void listDeployedServicesByIsvQuery.refetch();
    }

    const handleMyServiceDetailsOpenModal = (deployedService: DeployedService) => {
        setServiceIdInModal(deployedService.serviceId);
        setIsMyServiceDetailsModalOpen(true);
    };

    const handleMyServiceDetailsModalClose = () => {
        setServiceIdInModal('');
        setIsMyServiceDetailsModalOpen(false);
    };

    return (
        <div className={tablesStyle.genericTableContainer}>
            <Modal
                title={'Service Details'}
                width={1000}
                footer={null}
                open={serviceIdInModal.length > 0 && isMyServiceDetailsModalOpen}
                onCancel={handleMyServiceDetailsModalClose}
            >
                <ReportsServiceDetails serviceId={serviceIdInModal} />
            </Modal>

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
            {listDeployedServicesByIsvQuery.isError ? (
                <RetryPrompt
                    error={listDeployedServicesByIsvQuery.error}
                    retryRequest={refreshData}
                    errorMessage={serviceDetailsErrorText}
                />
            ) : (
                <></>
            )}
            <Row>
                <div className={myServicesStyle.serviceInstanceList}>
                    <Table
                        columns={columns}
                        dataSource={deployedServiceList}
                        onChange={handleFilterChange}
                        loading={
                            listDeployedServicesByIsvQuery.isPending || listDeployedServicesByIsvQuery.isRefetching
                        }
                        rowKey={'id'}
                    />
                </div>
            </Row>
        </div>
    );
}

export default Reports;
