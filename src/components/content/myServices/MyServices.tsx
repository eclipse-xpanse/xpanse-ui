/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React, { useEffect, useState } from 'react';
import { Alert, Button, Image, Modal, Popconfirm, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    AbstractCredentialInfo,
    ApiError,
    CloudServiceProvider,
    Response,
    ServiceService,
    ServiceVo,
} from '../../../xpanse-api/generated';
import { ColumnFilterItem } from 'antd/es/table/interface';
import {
    AreaChartOutlined,
    CloseCircleOutlined,
    CopyOutlined,
    ExpandAltOutlined,
    SyncOutlined,
} from '@ant-design/icons';
import '../../../styles/my_services.css';
import { sortVersionNum } from '../../utils/Sort';
import { MyServiceDetails } from './MyServiceDetails';
import { Migrate } from '../order/migrate/Migrate';
import { convertStringArrayToUnorderedList } from '../../utils/generateUnorderedList';
import { useQuery } from '@tanstack/react-query';
import { useDestroyRequestSubmitQuery } from '../order/destroy/useDestroyRequestSubmitQuery';
import DestroyServiceStatusPolling from '../order/destroy/DestroyServiceStatusPolling';
import { useNavigate } from 'react-router-dom';
import { cspMap } from '../order/formElements/CspSelect';
import { MyServiceStatus } from './MyServiceStatus';
import { useOrderFormStore } from '../order/store/OrderFormStore';

function MyServices(): React.JSX.Element {
    const [serviceVoList, setServiceVoList] = useState<ServiceVo[]>([]);
    const [versionFilters, setVersionFilters] = useState<ColumnFilterItem[]>([]);
    const [nameFilters, setNameFilters] = useState<ColumnFilterItem[]>([]);
    const [customerServiceNameFilters, setCustomerServiceNameFilters] = useState<ColumnFilterItem[]>([]);
    const [categoryFilters, setCategoryFilters] = useState<ColumnFilterItem[]>([]);
    const [cspFilters, setCspFilters] = useState<ColumnFilterItem[]>([]);
    const [serviceStateFilters, setServiceStateFilters] = useState<ColumnFilterItem[]>([]);
    const [id, setId] = useState<string>('');
    const [isDestroying, setIsDestroying] = useState<boolean>(false);
    const [isDestroyingCompleted, setIsDestroyingCompleted] = useState<boolean>(false);
    const [serviceIdInModal, setServiceIdInModal] = useState<string>('');
    const [currentServiceVo, setCurrentServiceVo] = useState<ServiceVo | undefined>(undefined);
    const [isMyServiceDetailsModalOpen, setIsMyServiceDetailsModalOpen] = useState(false);
    const [title, setTitle] = useState<React.JSX.Element>(<></>);
    const [isMigrateModalOpen, setIsMigrateModalOpen] = useState<boolean>(false);
    const [servicesLoadingError, setServicesLoadingError] = useState<React.JSX.Element>(<></>);
    const serviceDestroyQuery = useDestroyRequestSubmitQuery();
    const [clearFormVariables] = useOrderFormStore((state) => [state.clearFormVariables]);

    const navigate = useNavigate();

    const listDeployedServicesQuery = useQuery({
        queryKey: ['listDeployedServices'],
        queryFn: () => ServiceService.listDeployedServices(undefined, undefined, undefined, undefined, undefined),
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        const serviceList: ServiceVo[] = [];
        if (listDeployedServicesQuery.isSuccess && listDeployedServicesQuery.data.length > 0) {
            setServiceVoList(listDeployedServicesQuery.data);
            updateVersionFilters(listDeployedServicesQuery.data);
            updateNameFilters(listDeployedServicesQuery.data);
            updateCategoryFilters();
            updateCspFilters();
            updateServiceStateFilters();
            updateCustomerServiceNameFilters(listDeployedServicesQuery.data);
        } else {
            setServiceVoList(serviceList);
        }
    }, [listDeployedServicesQuery.data, listDeployedServicesQuery.isSuccess]);

    useEffect(() => {
        if (listDeployedServicesQuery.isError) {
            if (
                listDeployedServicesQuery.error instanceof ApiError &&
                'details' in listDeployedServicesQuery.error.body
            ) {
                const response: Response = listDeployedServicesQuery.error.body as Response;
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
                        description={(listDeployedServicesQuery.error as Error).message}
                        type={'error'}
                        closable={true}
                        className={'failure-alert'}
                    />
                );
            }
        } else {
            setServicesLoadingError(<></>);
        }
    }, [listDeployedServicesQuery.error, listDeployedServicesQuery.isError]);

    useEffect(() => {
        if (isDestroyingCompleted) {
            setId('');
            refreshData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDestroyingCompleted]);

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
            render: (csp: AbstractCredentialInfo.csp, _) => {
                return (
                    <Space size='middle'>
                        <Image
                            width={100}
                            preview={false}
                            src={cspMap.get(csp.valueOf() as CloudServiceProvider.name)?.logo}
                        />
                    </Space>
                );
            },
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
            render: (serviceState: ServiceVo.serviceDeploymentState) => MyServiceStatus(serviceState),
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
                                icon={<AreaChartOutlined />}
                                onClick={() => {
                                    onMonitor(record);
                                }}
                                disabled={
                                    isDestroying ||
                                    record.serviceDeploymentState ===
                                        ServiceVo.serviceDeploymentState.DEPLOYMENT_FAILED ||
                                    record.serviceDeploymentState ===
                                        ServiceVo.serviceDeploymentState.DESTROY_SUCCESSFUL ||
                                    record.serviceDeploymentState === ServiceVo.serviceDeploymentState.DEPLOYING ||
                                    record.serviceDeploymentState === ServiceVo.serviceDeploymentState.DESTROYING
                                }
                            >
                                monitor
                            </Button>
                            <Button
                                type='primary'
                                icon={<CopyOutlined />}
                                onClick={() => {
                                    migrate(record);
                                }}
                                disabled={
                                    isDestroying ||
                                    record.serviceDeploymentState ===
                                        ServiceVo.serviceDeploymentState.DEPLOYMENT_FAILED ||
                                    record.serviceDeploymentState ===
                                        ServiceVo.serviceDeploymentState.DESTROY_SUCCESSFUL ||
                                    record.serviceDeploymentState === ServiceVo.serviceDeploymentState.DEPLOYING ||
                                    record.serviceDeploymentState === ServiceVo.serviceDeploymentState.DESTROYING
                                }
                            >
                                migrate
                            </Button>
                            {record.serviceDeploymentState === ServiceVo.serviceDeploymentState.DESTROY_SUCCESSFUL ||
                            record.serviceDeploymentState === ServiceVo.serviceDeploymentState.DEPLOYMENT_FAILED ? (
                                <Button
                                    loading={record.id === id ? isDestroying : false}
                                    type='primary'
                                    icon={<CloseCircleOutlined />}
                                    disabled={true}
                                >
                                    destroy
                                </Button>
                            ) : (
                                <Popconfirm
                                    title='Destroy the service'
                                    description='Are you sure to destroy the service?'
                                    okText='Yes'
                                    cancelText='No'
                                    onConfirm={() => {
                                        destroy(record);
                                    }}
                                >
                                    <Button
                                        loading={record.id === id ? isDestroying : false}
                                        type='primary'
                                        icon={<CloseCircleOutlined />}
                                        disabled={
                                            !(
                                                (record.serviceDeploymentState ===
                                                    ServiceVo.serviceDeploymentState.DESTROY_FAILED ||
                                                    record.serviceDeploymentState ===
                                                        ServiceVo.serviceDeploymentState.DEPLOYMENT_SUCCESSFUL) &&
                                                !isDestroying
                                            )
                                        }
                                    >
                                        destroy
                                    </Button>
                                </Popconfirm>
                            )}
                            <Button
                                type='primary'
                                icon={<ExpandAltOutlined />}
                                onClick={() => {
                                    handleMyServiceDetailsOpenModal(record.id);
                                }}
                                disabled={isDestroying}
                            >
                                detail
                            </Button>
                        </Space>
                    </>
                );
            },
        },
    ];

    function destroy(record: ServiceVo) {
        setIsDestroying(true);
        setId(record.id);
        setIsDestroyingCompleted(false);
        serviceDestroyQuery.mutate(record.id);
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

    function onMonitor(record: ServiceVo): void {
        navigate('/monitor', {
            state: record,
        });
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
        clearFormVariables();
        void listDeployedServicesQuery.refetch();
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
        clearFormVariables();
        refreshData();
        setCurrentServiceVo(undefined);
        setIsMigrateModalOpen(false);
    };

    return (
        <div className={'services-content'}>
            {isDestroying && id.length > 0 ? (
                <DestroyServiceStatusPolling
                    uuid={id}
                    error={serviceDestroyQuery.error as Error}
                    isLoading={serviceDestroyQuery.isLoading}
                    setIsDestroying={setIsDestroying}
                    setIsDestroyingCompleted={setIsDestroyingCompleted}
                />
            ) : null}
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
                onCancel={() => {
                    handleCancelMigrateModel();
                }}
                width={1400}
                mask={true}
            >
                <Migrate currentSelectedService={currentServiceVo} />
            </Modal>

            <div>
                <Button
                    disabled={isDestroying}
                    type='primary'
                    icon={<SyncOutlined />}
                    onClick={() => {
                        refreshData();
                    }}
                >
                    refresh
                </Button>
            </div>
            {servicesLoadingError}
            <div className={'service-instance-list'}>
                <Table
                    columns={columns}
                    dataSource={serviceVoList}
                    loading={listDeployedServicesQuery.isLoading || listDeployedServicesQuery.isRefetching}
                    rowKey={'id'}
                />
            </div>
        </div>
    );
}

export default MyServices;
