/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { InfoCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { Button, Image, Modal, Row, Space, Table, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ColumnFilterItem } from 'antd/es/table/interface';
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import myServicesStyle from '../../../../styles/my-services.module.css';
import tablesStyle from '../../../../styles/table.module.css';
import {
    DeployedService,
    category,
    csp,
    name,
    serviceDeploymentState,
    serviceHostingType,
} from '../../../../xpanse-api/generated';
import { sortVersionNum } from '../../../utils/Sort';
import {
    serviceCategoryQuery,
    serviceCspQuery,
    serviceIdQuery,
    serviceNameKeyQuery,
    serviceStateQuery,
    serviceVersionKeyQuery,
} from '../../../utils/constants';
import { cspMap } from '../../common/csp/CspLogo';
import { useOrderFormStore } from '../../order/store/OrderFormStore';
import DeployedServicesError from '../common/DeployedServicesError';
import { DeployedServicesHostingType } from '../common/DeployedServicesHostingType';
import { DeployedServicesStatus } from '../common/DeployedServicesStatus';
import useListDeployedServicesByIsvQuery from '../myServices/query/useListDeployedServiceByIsvQuery';
import { ReportsServiceDetails } from './ReportsServiceDetails';

function Reports(): React.JSX.Element {
    const [urlParams] = useSearchParams();
    const serviceIdInQuery = getServiceIdFormQuery();
    const categoryNameInQuery = getCategoryNameFormQuery();
    const cspNameInQuery = getCspNameFormQuery();
    const serviceNameInQuery = getServiceNameFormQuery();
    const serviceVersionInQuery = getServiceVersionFormQuery();
    const serviceStateInQuery = getServiceStateFromQuery();
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

    const listDeployedServicesByIsvQuery = useListDeployedServicesByIsvQuery();

    if (listDeployedServicesByIsvQuery.isSuccess) {
        const serviceList: DeployedService[] = [];
        if (listDeployedServicesByIsvQuery.data.length > 0) {
            if (serviceStateInQuery) {
                deployedServiceList = listDeployedServicesByIsvQuery.data.filter((service: DeployedService) =>
                    serviceStateInQuery.includes(service.serviceDeploymentState as serviceDeploymentState)
                );
            } else if (serviceIdInQuery) {
                deployedServiceList = listDeployedServicesByIsvQuery.data.filter(
                    (service: { serviceId: string }) => service.serviceId === serviceIdInQuery
                );
            } else {
                deployedServiceList = listDeployedServicesByIsvQuery.data;
            }
            if (categoryNameInQuery) {
                deployedServiceList = deployedServiceList.filter(
                    (service) => service.category === (categoryNameInQuery as category)
                );
            }
            if (cspNameInQuery) {
                deployedServiceList = deployedServiceList.filter((service) => service.csp === (cspNameInQuery as csp));
            }
            if (serviceNameInQuery) {
                deployedServiceList = deployedServiceList.filter((service) => service.name === serviceNameInQuery);
            }
            if (serviceVersionInQuery) {
                deployedServiceList = deployedServiceList.filter(
                    (service) => service.version === serviceVersionInQuery
                );
            }
            updateServiceIdFilters(listDeployedServicesByIsvQuery.data);
            updateVersionFilters(listDeployedServicesByIsvQuery.data);
            updateNameFilters(listDeployedServicesByIsvQuery.data);
            updateCategoryFilters();
            updateCspFilters();
            updateServiceStateFilters();
            updateCustomerServiceNameFilters(listDeployedServicesByIsvQuery.data);
            updateServiceHostingFilters();
        } else {
            deployedServiceList = serviceList;
        }
    }

    const columns: ColumnsType<DeployedService> = [
        {
            title: 'Id',
            dataIndex: 'serviceId',
            filters: serviceIdInQuery ? undefined : serviceIdFilters,
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value: React.Key | boolean, record) => record.serviceId.startsWith(value.toString()),
            filtered: !!serviceIdInQuery,
            align: 'center',
        },
        {
            title: 'Name',
            dataIndex: 'customerServiceName',
            filters: customerServiceNameFilters,
            filterMode: 'tree',
            filterSearch: true,
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
            filters: categoryNameInQuery ? undefined : categoryFilters,
            filtered: !!categoryNameInQuery,
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value: React.Key | boolean, record) => record.category.startsWith(value.toString()),
            align: 'center',
        },
        {
            title: 'Service',
            dataIndex: 'name',
            filters: serviceNameInQuery ? undefined : nameFilters,
            filtered: !!serviceNameInQuery,
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value: React.Key | boolean, record) => record.name.startsWith(value.toString()),
            align: 'center',
        },
        {
            title: 'Version',
            dataIndex: 'version',
            filters: serviceVersionInQuery ? undefined : versionFilters,
            filtered: !!serviceVersionInQuery,
            filterMode: 'tree',
            filterSearch: true,
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
            onFilter: (value: React.Key | boolean, record) => record.serviceHostingType.startsWith(value.toString()),
            align: 'center',

            render: (serviceHostingType: serviceHostingType) => (
                <DeployedServicesHostingType currentServiceHostingType={serviceHostingType} />
            ),
        },
        {
            title: 'Csp',
            dataIndex: 'csp',
            filters: cspNameInQuery ? undefined : cspFilters,
            filtered: !!cspNameInQuery,
            filterMode: 'tree',
            filterSearch: true,
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
            dataIndex: 'createTime',
            defaultSortOrder: 'descend',
            sorter: (deployedServiceA, deployedServiceB) => {
                const dateA = new Date(deployedServiceA.createTime);
                const dateB = new Date(deployedServiceB.createTime);
                return dateA.getTime() - dateB.getTime();
            },
            align: 'center',
        },
        {
            title: 'ServiceState',
            dataIndex: 'serviceDeploymentState',
            filters: serviceStateInQuery ? undefined : serviceStateFilters,
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value: React.Key | boolean, record) =>
                record.serviceDeploymentState.startsWith(value.toString()),
            render: (serviceState: serviceDeploymentState) => DeployedServicesStatus(serviceState),
            filtered: !!serviceStateInQuery,
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

    function getServiceStateFromQuery(): serviceDeploymentState[] | undefined {
        const serviceStateList: serviceDeploymentState[] = [];
        if (urlParams.size > 0) {
            urlParams.forEach((value, key) => {
                if (
                    key === serviceStateQuery &&
                    Object.values(serviceDeploymentState).includes(value as serviceDeploymentState)
                ) {
                    serviceStateList.push(value as serviceDeploymentState);
                }
            });
            return serviceStateList;
        }
        return undefined;
    }

    function getServiceIdFormQuery(): string | undefined {
        const queryInUri = decodeURI(urlParams.get(serviceIdQuery) ?? '');
        if (queryInUri.length > 0) {
            return queryInUri;
        }
        return undefined;
    }

    function getCategoryNameFormQuery(): string | undefined {
        const queryInUri = decodeURI(urlParams.get(serviceCategoryQuery) ?? '');
        if (queryInUri.length > 0) {
            return queryInUri;
        }
        return undefined;
    }

    function getCspNameFormQuery(): string | undefined {
        const queryInUri = decodeURI(urlParams.get(serviceCspQuery) ?? '');
        if (queryInUri.length > 0) {
            return queryInUri;
        }
        return undefined;
    }

    function getServiceNameFormQuery(): string | undefined {
        const queryInUri = decodeURI(urlParams.get(serviceNameKeyQuery) ?? '');
        if (queryInUri.length > 0) {
            return queryInUri;
        }
        return undefined;
    }

    function getServiceVersionFormQuery(): string | undefined {
        const queryInUri = decodeURI(urlParams.get(serviceVersionKeyQuery) ?? '');
        if (queryInUri.length > 0) {
            return queryInUri;
        }
        return undefined;
    }

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
                <DeployedServicesError error={listDeployedServicesByIsvQuery.error} />
            ) : (
                <></>
            )}
            <Row>
                <div className={myServicesStyle.serviceInstanceList}>
                    <Table
                        columns={columns}
                        dataSource={deployedServiceList}
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
