/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React, { useEffect, useState } from 'react';
import { Alert, Button, Modal, Popconfirm, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ApiError, Response, ServiceDetailVo, ServiceService, ServiceVo } from '../../../xpanse-api/generated';
import { ColumnFilterItem } from 'antd/es/table/interface';
import { CloseCircleOutlined, CopyOutlined, ExpandAltOutlined, SyncOutlined } from '@ant-design/icons';
import '../../../styles/my_services.css';
import { sortVersionNum } from '../../utils/Sort';
import { MyServiceDetails } from './MyServiceDetails';
import { destroyTimeout, waitServicePeriod } from '../../utils/constants';
import { Migrate } from '../order/migrate/Migrate';
import { convertStringArrayToUnorderedList } from '../../utils/generateUnorderedList';
import { getUserName } from '../../oidc/OidcConfig';
import { useOidcIdToken } from '@axa-fr/react-oidc';
import { useQuery } from '@tanstack/react-query';
import { OidcIdToken } from '@axa-fr/react-oidc/dist/ReactOidc';

function MyServices(): React.JSX.Element {
    const [serviceVoList, setServiceVoList] = useState<ServiceVo[]>([]);
    const [versionFilters, setVersionFilters] = useState<ColumnFilterItem[]>([]);
    const [nameFilters, setNameFilters] = useState<ColumnFilterItem[]>([]);
    const [customerServiceNameFilters, setCustomerServiceNameFilters] = useState<ColumnFilterItem[]>([]);
    const [categoryFilters, setCategoryFilters] = useState<ColumnFilterItem[]>([]);
    const [cspFilters, setCspFilters] = useState<ColumnFilterItem[]>([]);
    const [serviceStateFilters, setServiceStateFilters] = useState<ColumnFilterItem[]>([]);
    const [tip, setTip] = useState<React.JSX.Element | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);
    const [id, setId] = useState<string>('');
    const [serviceIdInModal, setServiceIdInModal] = useState<string>('');
    const [currentServiceVo, setCurrentServiceVo] = useState<ServiceVo | undefined>(undefined);
    const [isMyServiceDetailsModalOpen, setIsMyServiceDetailsModalOpen] = useState(false);
    const [title, setTitle] = useState<React.JSX.Element>(<></>);
    const [isMigrateModalOpen, setIsMigrateModalOpen] = useState<boolean>(false);
    const [servicesLoadingError, setServicesLoadingError] = useState<React.JSX.Element>(<></>);
    const oidcIdToken: OidcIdToken = useOidcIdToken();
    const userName = getUserName(oidcIdToken.idTokenPayload as object);

    const getDeployedServicesByUserQuery = useQuery({
        queryKey: ['getDeployedServicesByUser', userName],
        queryFn: () => ServiceService.getDeployedServicesByUser(userName),
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        const serviceList: ServiceVo[] = [];
        if (getDeployedServicesByUserQuery.data && getDeployedServicesByUserQuery.data.length > 0) {
            setServiceVoList(getDeployedServicesByUserQuery.data);
            updateVersionFilters(getDeployedServicesByUserQuery.data);
            updateNameFilters(getDeployedServicesByUserQuery.data);
            updateCategoryFilters();
            updateCspFilters();
            updateServiceStateFilters();
            updateCustomerServiceNameFilters(getDeployedServicesByUserQuery.data);
        } else {
            setServiceVoList(serviceList);
        }
    }, [getDeployedServicesByUserQuery.data, getDeployedServicesByUserQuery.isSuccess]);

    useEffect(() => {
        if (getDeployedServicesByUserQuery.error) {
            if (
                getDeployedServicesByUserQuery.error instanceof ApiError &&
                'details' in getDeployedServicesByUserQuery.error.body
            ) {
                const response: Response = getDeployedServicesByUserQuery.error.body as Response;
                setServicesLoadingError(
                    <Alert
                        message={response.resultType.valueOf()}
                        description={convertStringArrayToUnorderedList(response.details)}
                        type={'error'}
                        closable={true}
                        className={'failure-alert'}
                    />
                );
            } else {
                setServicesLoadingError(
                    <Alert
                        message='Fetching Service Details Failed'
                        description={(getDeployedServicesByUserQuery.error as Error).message}
                        type={'error'}
                        closable={true}
                        className={'failure-alert'}
                    />
                );
            }
        }
    }, [getDeployedServicesByUserQuery.error, getDeployedServicesByUserQuery.isError]);

    const columns: ColumnsType<ServiceVo> = [
        {
            title: 'Id',
            dataIndex: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'customerServiceName',
            filters: customerServiceNameFilters,
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value: string | number | boolean, record) => {
                if (record.customerServiceName !== undefined) {
                    const customerServiceName = record.customerServiceName;
                    return customerServiceName.startsWith(value.toString());
                }
                return false;
            },
        },
        {
            title: 'Category',
            dataIndex: 'category',
            filters: categoryFilters,
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value: string | number | boolean, record) => record.category.startsWith(value.toString()),
        },
        {
            title: 'Service',
            dataIndex: 'name',
            filters: nameFilters,
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value: string | number | boolean, record) => record.name.startsWith(value.toString()),
        },
        {
            title: 'Version',
            dataIndex: 'version',
            filters: versionFilters,
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value: string | number | boolean, record) => record.version.startsWith(value.toString()),
            sorter: (service1, service2) => sortVersionNum(service1.version, service2.version),
        },
        {
            title: 'Csp',
            dataIndex: 'csp',
            filters: cspFilters,
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value: string | number | boolean, record) => record.csp.startsWith(value.toString()),
        },
        {
            title: 'Flavor',
            dataIndex: 'flavor',
        },
        {
            title: 'ServiceState',
            dataIndex: 'serviceDeploymentState',
            filters: serviceStateFilters,
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value: string | number | boolean, record) =>
                record.serviceDeploymentState.startsWith(value.toString()),
        },
        {
            title: 'Operation',
            dataIndex: 'operation',
            render: (text: string, record: ServiceVo) => {
                return (
                    <>
                        <Space size='middle'>
                            <Button
                                type='primary'
                                icon={<CopyOutlined />}
                                onClick={() => {
                                    migrate(record);
                                }}
                                disabled={
                                    !(
                                        record.serviceDeploymentState ===
                                            ServiceVo.serviceDeploymentState.DEPLOY_SUCCESS && !loading
                                    )
                                }
                            >
                                migrate
                            </Button>

                            <Popconfirm
                                title='Destroy the service'
                                description='Are you sure to destroy the service?'
                                okText='Yes'
                                cancelText='No'
                                onConfirm={() => destroy(record)}
                            >
                                <Button
                                    loading={record.id === id ? loading : false}
                                    type='primary'
                                    icon={<CloseCircleOutlined />}
                                    disabled={
                                        !(
                                            record.serviceDeploymentState ===
                                                ServiceVo.serviceDeploymentState.DEPLOY_SUCCESS && !loading
                                        )
                                    }
                                >
                                    destroy
                                </Button>
                            </Popconfirm>
                            <Button
                                type='primary'
                                icon={<ExpandAltOutlined />}
                                onClick={() => handleMyServiceDetailsOpenModal(record.id)}
                                disabled={loading}
                            >
                                detail
                            </Button>
                        </Space>
                    </>
                );
            },
        },
    ];

    function Tip(type: 'error' | 'success', msg: string) {
        setTip(
            <div className={'submit-alert-tip'}>
                {' '}
                <Alert message='Destroy:' description={msg} showIcon type={type} />{' '}
            </div>
        );
    }

    function TipClear() {
        setTip(undefined);
    }

    function waitingServiceDestroy(uuid: string, timeout: number, date: Date) {
        Tip(
            'success',
            'Destroying, Please wait... [' + Math.ceil((new Date().getTime() - date.getTime()) / 1000).toString() + 's]'
        );
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        ServiceService.getDeployedServiceDetailsById(uuid, userName)
            .then((response) => {
                if (response.serviceDeploymentState === ServiceDetailVo.serviceDeploymentState.DESTROY_SUCCESS) {
                    Tip('success', 'Destroy success.');
                    setLoading(false);
                    refreshData();
                    TipClear();
                } else if (response.serviceDeploymentState === ServiceDetailVo.serviceDeploymentState.DESTROY_FAILED) {
                    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                    Tip('error', 'Destroy failed:' + response.resultMessage);
                    setLoading(false);
                    TipClear();
                } else {
                    setTimeout(() => {
                        waitingServiceDestroy(uuid, timeout - waitServicePeriod, date);
                    }, waitServicePeriod);
                }
            })
            .catch((e: Error) => {
                Tip('error', 'Destroy failed:' + e.message);
                setLoading(false);
                TipClear();
            });
    }

    function destroy(record: ServiceVo) {
        setId(record.id);
        setLoading(true);
        ServiceService.destroy(record.id)
            .then(() => {
                waitingServiceDestroy(record.id, destroyTimeout, new Date());
            })
            .catch((e: Error) => {
                Tip('error', 'Destroy failed:' + e.message);
                setLoading(false);
                TipClear();
            });
    }

    function migrate(record: ServiceVo): void {
        setCurrentServiceVo(record);
        setTitle(
            <div className={'services-content'}>
                <div className={'content-title'}>
                    Service: {record.name}@{record.version}
                </div>
            </div>
        );
        setIsMigrateModalOpen(true);
    }

    function updateCspFilters(): void {
        const filters: ColumnFilterItem[] = [];
        Object.values(ServiceVo.csp).forEach((csp) => {
            const filter = {
                text: csp,
                value: csp,
            };
            filters.push(filter);
        });
        setCspFilters(filters);
    }

    function updateServiceStateFilters(): void {
        const filters: ColumnFilterItem[] = [];
        Object.values(ServiceVo.serviceDeploymentState).forEach((serviceStateItem) => {
            const filter = {
                text: serviceStateItem,
                value: serviceStateItem,
            };
            filters.push(filter);
        });
        setServiceStateFilters(filters);
    }

    function updateCategoryFilters(): void {
        const filters: ColumnFilterItem[] = [];
        Object.values(ServiceVo.category).forEach((category) => {
            const filter = {
                text: category,
                value: category,
            };
            filters.push(filter);
        });
        setCategoryFilters(filters);
    }

    function updateVersionFilters(resp: ServiceVo[]): void {
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
        setVersionFilters(filters);
    }

    function updateNameFilters(resp: ServiceVo[]): void {
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
        setNameFilters(filters);
    }

    function updateCustomerServiceNameFilters(resp: ServiceVo[]): void {
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
        setCustomerServiceNameFilters(filters);
    }

    function refreshData(): void {
        void getDeployedServicesByUserQuery.refetch();
    }

    const handleMyServiceDetailsOpenModal = (id: string) => {
        setServiceIdInModal(id);
        setIsMyServiceDetailsModalOpen(true);
    };

    const handleMyServiceDetailsModalClose = () => {
        setServiceIdInModal('');
        setIsMyServiceDetailsModalOpen(false);
    };

    const handleCancelMigrateModel = () => {
        refreshData();
        setCurrentServiceVo(undefined);
        setIsMigrateModalOpen(false);
    };

    const getMigrateModalOpenStatus = (isOpen: boolean) => {
        refreshData();
        setCurrentServiceVo(undefined);
        setIsMigrateModalOpen(isOpen);
    };

    return (
        <div className={'services-content'}>
            {tip}
            <Modal
                title={'Service Details'}
                width={700}
                footer={null}
                open={serviceIdInModal.length > 0 && isMyServiceDetailsModalOpen}
                onCancel={handleMyServiceDetailsModalClose}
            >
                <MyServiceDetails serviceId={serviceIdInModal} />
            </Modal>
            <Modal
                open={isMigrateModalOpen}
                title={title}
                closable={true}
                maskClosable={false}
                destroyOnClose={true}
                footer={null}
                onCancel={() => handleCancelMigrateModel()}
                width={1400}
                mask={true}
            >
                <Migrate
                    currentSelectedService={currentServiceVo}
                    getMigrateModalOpenStatus={getMigrateModalOpenStatus}
                />
            </Modal>

            <div>
                <Button
                    disabled={loading}
                    type='primary'
                    icon={<SyncOutlined />}
                    onClick={() => {
                        refreshData();
                    }}
                >
                    refresh
                </Button>
                {servicesLoadingError}
            </div>
            <div className={'service-instance-list'}>
                <Table
                    columns={columns}
                    dataSource={serviceVoList}
                    loading={getDeployedServicesByUserQuery.isLoading || getDeployedServicesByUserQuery.isRefetching}
                />
            </div>
        </div>
    );
}

export default MyServices;
