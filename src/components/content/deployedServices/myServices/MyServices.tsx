/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React, { useState } from 'react';
import { Button, Dropdown, Image, MenuProps, Modal, Popconfirm, Row, Space, Table, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    AbstractCredentialInfo,
    CloudServiceProvider,
    DeployedService,
    DeployedServiceDetails,
    ServiceProviderContactDetails,
    VendorHostedDeployedServiceDetails,
} from '../../../../xpanse-api/generated';
import { ColumnFilterItem } from 'antd/es/table/interface';
import {
    CaretDownOutlined,
    CloseCircleOutlined,
    CopyOutlined,
    DeleteOutlined,
    EditOutlined,
    FundOutlined,
    InfoCircleOutlined,
    PlayCircleOutlined,
    PoweroffOutlined,
    RiseOutlined,
    SyncOutlined,
} from '@ant-design/icons';
import '../../../../styles/my_services.css';
import { sortVersionNum } from '../../../utils/Sort';
import { Migrate } from '../../order/migrate/Migrate';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useOrderFormStore } from '../../order/store/OrderFormStore';
import { PurgeServiceStatusAlert } from '../../order/purge/PurgeServiceStatusAlert';
import { usePurgeRequestSubmitQuery } from '../../order/purge/usePurgeRequestSubmitQuery';
import { useDestroyRequestSubmitQuery } from '../../order/destroy/useDestroyRequestSubmitQuery';
import DestroyServiceStatusAlert from '../../order/destroy/DestroyServiceStatusAlert';
import { serviceIdQuery, serviceStateQuery } from '../../../utils/constants';
import { cspMap } from '../../common/csp/CspLogo';
import DeployedServicesError from '../common/DeployedServicesError';
import { DeployedServicesStatus } from '../common/DeployedServicesStatus';
import { DeployedServicesRunningStatus } from '../common/DeployedServicesRunningStatus';
import { DeployedServicesHostingType } from '../common/DeployedServicesHostingType';
import { MyServiceDetails } from './MyServiceDetails';
import useListDeployedServicesDetailsQuery from './query/useListDeployedServicesDetailsQuery';
import { useServiceStateStartQuery } from './query/useServiceStateStartQuery';
import { useServiceStateStopQuery } from './query/useServiceStateStopQuery';
import { useServiceStateRestartQuery } from './query/useServiceStateRestartQuery';
import useGetOrderableServiceDetailsQuery from './query/useGetOrderableServiceDetailsQuery';
import { ContactDetailsShowType } from '../../common/ocl/ContactDetailsShowType';
import { ContactDetailsText } from '../../common/ocl/ContactDetailsText';
import { useServiceDetailsPollingQuery } from '../../order/orderStatus/useServiceDetailsPollingQuery';
import { usePurgeRequestStatusQuery } from '../../order/purge/usePurgeRequestStatusQuery';
import { Modify } from '../../order/modify/Modify';
import { Scale } from '../../order/scale/Scale';
import { getExistingServiceParameters } from '../../order/common/utils/existingServiceParameters';

function MyServices(): React.JSX.Element {
    const [urlParams] = useSearchParams();
    const serviceIdInQuery = getServiceIdFormQuery();
    const serviceDeploymentStateInQuery = getServiceDeploymentStateFromQuery();
    let serviceVoList: DeployedService[] = [];
    let versionFilters: ColumnFilterItem[] = [];
    let serviceHostingTypeFilters: ColumnFilterItem[] = [];
    let nameFilters: ColumnFilterItem[] = [];
    let customerServiceNameFilters: ColumnFilterItem[] = [];
    let categoryFilters: ColumnFilterItem[] = [];
    let cspFilters: ColumnFilterItem[] = [];
    let serviceIdFilters: ColumnFilterItem[] = [];
    let serviceDeploymentStateFilters: ColumnFilterItem[] = [];
    let serviceStateFilters: ColumnFilterItem[] = [];
    const [activeRecord, setActiveRecord] = useState<
        DeployedServiceDetails | VendorHostedDeployedServiceDetails | undefined
    >(undefined);
    const [cacheFormVariable] = useOrderFormStore((state) => [state.addDeployVariable]);
    const [isDestroyRequestSubmitted, setIsDestroyRequestSubmitted] = useState<boolean>(false);
    const [isPurgeRequestSubmitted, setIsPurgeRequestSubmitted] = useState<boolean>(false);
    const [isMyServiceDetailsModalOpen, setIsMyServiceDetailsModalOpen] = useState(false);
    const [isMigrateModalOpen, setIsMigrateModalOpen] = useState<boolean>(false);
    const [isModifyModalOpen, setIsModifyModalOpen] = useState<boolean>(false);
    const [isScaleModalOpen, setIsScaleModalOpen] = useState<boolean>(false);
    const serviceDestroyQuery = useDestroyRequestSubmitQuery();
    const servicePurgeQuery = usePurgeRequestSubmitQuery();
    const serviceStateStartQuery = useServiceStateStartQuery(refreshData);
    const serviceStateStopQuery = useServiceStateStopQuery(refreshData);
    const serviceStateRestartQuery = useServiceStateRestartQuery(refreshData);
    const [clearFormVariables] = useOrderFormStore((state) => [state.clearFormVariables]);
    const navigate = useNavigate();
    const listDeployedServicesQuery = useListDeployedServicesDetailsQuery();
    const getOrderableServiceDetails = useGetOrderableServiceDetailsQuery(activeRecord?.serviceTemplateId);
    const getServiceDetailsByIdQuery = useServiceDetailsPollingQuery(
        activeRecord?.id,
        serviceDestroyQuery.isSuccess,
        activeRecord?.serviceHostingType ?? DeployedService.serviceHostingType.SELF,
        [
            DeployedServiceDetails.serviceDeploymentState.DESTROY_FAILED,
            DeployedServiceDetails.serviceDeploymentState.DESTROY_SUCCESSFUL,
        ]
    );
    const getPurgeServiceDetailsQuery = usePurgeRequestStatusQuery(
        activeRecord?.id,
        activeRecord?.serviceHostingType ?? DeployedService.serviceHostingType.SELF,
        servicePurgeQuery.isSuccess
    );

    if (listDeployedServicesQuery.isSuccess && listDeployedServicesQuery.data.length > 0) {
        if (serviceDeploymentStateInQuery) {
            serviceVoList = listDeployedServicesQuery.data.filter(
                (serviceVo) => serviceVo.serviceDeploymentState === serviceDeploymentStateInQuery
            );
        } else if (serviceIdInQuery) {
            serviceVoList = listDeployedServicesQuery.data.filter((serviceVo) => serviceVo.id === serviceIdInQuery);
        } else {
            serviceVoList = listDeployedServicesQuery.data;
        }
        updateServiceIdFilters(listDeployedServicesQuery.data);
        updateVersionFilters(listDeployedServicesQuery.data);
        updateNameFilters(listDeployedServicesQuery.data);
        updateCategoryFilters();
        updateCspFilters();
        updateServiceDeploymentStateFilters();
        updateServiceStateFilters();
        updateCustomerServiceNameFilters(listDeployedServicesQuery.data);
        updateServiceHostingFilters();
    }

    const getTooltipWhenDetailsDisabled = (
        serviceProviderContactDetails: ServiceProviderContactDetails
    ): React.JSX.Element => {
        return (
            <div>
                <span>Please contact the service provider</span>
                <ContactDetailsText
                    serviceProviderContactDetails={serviceProviderContactDetails}
                    showFor={ContactDetailsShowType.Order}
                />
            </div>
        );
    };

    const getOperationMenu = (record: DeployedService): MenuProps['items'] => {
        return [
            {
                key: 'details',
                label: isDisableDetails(record) ? (
                    <Tooltip
                        placement={'left'}
                        style={{ maxWidth: '100%' }}
                        title={
                            getOrderableServiceDetails.isSuccess ? (
                                getTooltipWhenDetailsDisabled(
                                    getOrderableServiceDetails.data.serviceProviderContactDetails
                                )
                            ) : (
                                <></>
                            )
                        }
                    >
                        <Button
                            disabled={true}
                            className={'button-as-link'}
                            icon={<InfoCircleOutlined />}
                            type={'link'}
                        >
                            details
                        </Button>
                    </Tooltip>
                ) : (
                    <Button
                        onClick={() => {
                            handleMyServiceDetailsOpenModal(record);
                        }}
                        className={'button-as-link'}
                        icon={<InfoCircleOutlined />}
                        type={'link'}
                    >
                        details
                    </Button>
                ),
            },
            {
                key: 'scale',
                label: (
                    <Button
                        onClick={() => {
                            scale(record);
                        }}
                        className={'button-as-link'}
                        icon={<RiseOutlined />}
                        disabled={
                            activeRecord !== undefined ||
                            record.serviceDeploymentState.toString() ===
                                DeployedService.serviceDeploymentState.MODIFYING.toString() ||
                            record.serviceDeploymentState.toString() ===
                                DeployedService.serviceDeploymentState.DEPLOYMENT_FAILED.toString() ||
                            record.serviceDeploymentState.toString() ===
                                DeployedService.serviceDeploymentState.DESTROY_SUCCESSFUL.toString() ||
                            record.serviceDeploymentState.toString() ===
                                DeployedService.serviceDeploymentState.DEPLOYING.toString() ||
                            record.serviceDeploymentState.toString() ===
                                DeployedService.serviceDeploymentState.DESTROYING.toString()
                        }
                        type={'link'}
                    >
                        scale
                    </Button>
                ),
            },
            {
                key: 'modify parameters',
                label: (
                    <Button
                        onClick={() => {
                            modify(record);
                        }}
                        className={'button-as-link'}
                        icon={<EditOutlined />}
                        disabled={
                            activeRecord !== undefined ||
                            record.serviceDeploymentState.toString() ===
                                DeployedService.serviceDeploymentState.MODIFYING.toString() ||
                            record.serviceDeploymentState.toString() ===
                                DeployedService.serviceDeploymentState.DEPLOYMENT_FAILED.toString() ||
                            record.serviceDeploymentState.toString() ===
                                DeployedService.serviceDeploymentState.DESTROY_SUCCESSFUL.toString() ||
                            record.serviceDeploymentState.toString() ===
                                DeployedService.serviceDeploymentState.DEPLOYING.toString() ||
                            record.serviceDeploymentState.toString() ===
                                DeployedService.serviceDeploymentState.DESTROYING.toString()
                        }
                        type={'link'}
                    >
                        modify parameters
                    </Button>
                ),
            },
            {
                key: 'migrate',
                label: (
                    <Button
                        onClick={() => {
                            migrate(record);
                        }}
                        className={'button-as-link'}
                        icon={<CopyOutlined />}
                        disabled={
                            activeRecord !== undefined ||
                            record.serviceDeploymentState.toString() ===
                                DeployedService.serviceDeploymentState.DEPLOYMENT_FAILED.toString() ||
                            record.serviceDeploymentState.toString() ===
                                DeployedService.serviceDeploymentState.MODIFICATION_FAILED.toString() ||
                            record.serviceDeploymentState.toString() ===
                                DeployedService.serviceDeploymentState.DESTROY_SUCCESSFUL.toString() ||
                            record.serviceDeploymentState.toString() ===
                                DeployedService.serviceDeploymentState.DEPLOYING.toString() ||
                            record.serviceDeploymentState.toString() ===
                                DeployedService.serviceDeploymentState.DESTROYING.toString()
                        }
                        type={'link'}
                    >
                        migrate
                    </Button>
                ),
            },
            {
                key:
                    record.serviceDeploymentState.toString() ===
                        DeployedService.serviceDeploymentState.DESTROY_SUCCESSFUL.toString() ||
                    record.serviceDeploymentState.toString() ===
                        DeployedService.serviceDeploymentState.DEPLOYMENT_FAILED.toString() ||
                    record.serviceDeploymentState.toString() ===
                        DeployedService.serviceDeploymentState.MODIFICATION_FAILED.toString() ||
                    record.serviceDeploymentState.toString() ===
                        DeployedService.serviceDeploymentState.ROLLBACK_FAILED.toString()
                        ? 'purge'
                        : 'destroy',
                label:
                    record.serviceDeploymentState.toString() ===
                        DeployedService.serviceDeploymentState.DESTROY_SUCCESSFUL.toString() ||
                    record.serviceDeploymentState.toString() ===
                        DeployedService.serviceDeploymentState.DEPLOYMENT_FAILED.toString() ||
                    record.serviceDeploymentState.toString() ===
                        DeployedService.serviceDeploymentState.MODIFICATION_FAILED.toString() ||
                    record.serviceDeploymentState.toString() ===
                        DeployedService.serviceDeploymentState.ROLLBACK_FAILED.toString() ? (
                        <Popconfirm
                            title='Purge the service'
                            description='Are you sure to purge the service?'
                            cancelText='Yes'
                            okText='No'
                            onCancel={() => {
                                purge(record);
                            }}
                        >
                            <Button
                                icon={<DeleteOutlined />}
                                disabled={activeRecord !== undefined}
                                className={'button-as-link'}
                                type={'link'}
                            >
                                purge
                            </Button>
                        </Popconfirm>
                    ) : (
                        <Popconfirm
                            title='Destroy the service'
                            description='Are you sure to destroy the service?'
                            cancelText='Yes'
                            okText='No'
                            onCancel={() => {
                                destroy(record);
                            }}
                        >
                            <Button
                                icon={<CloseCircleOutlined />}
                                disabled={
                                    (record.serviceDeploymentState.toString() !==
                                        DeployedService.serviceDeploymentState.DESTROY_FAILED.toString() &&
                                        record.serviceDeploymentState.toString() !==
                                            DeployedService.serviceDeploymentState.DEPLOYMENT_SUCCESSFUL.toString() &&
                                        record.serviceDeploymentState.toString() !==
                                            DeployedService.serviceDeploymentState.MODIFICATION_SUCCESSFUL.toString()) ||
                                    activeRecord !== undefined
                                }
                                className={'button-as-link'}
                                type={'link'}
                            >
                                destroy
                            </Button>
                        </Popconfirm>
                    ),
            },
            {
                key: 'start',
                label: (
                    <Button
                        onClick={() => {
                            start(record);
                        }}
                        className={'button-as-link'}
                        icon={<PlayCircleOutlined />}
                        disabled={isDisableStartBtn(record)}
                        type={'link'}
                    >
                        start
                    </Button>
                ),
            },
            {
                key: 'stop',
                label: (
                    <Popconfirm
                        title='Stop the service'
                        description='Are you sure to stop the service?'
                        cancelText='Yes'
                        okText='No'
                        onCancel={() => {
                            stop(record);
                        }}
                    >
                        <Button
                            icon={<PoweroffOutlined />}
                            className={'button-as-link'}
                            disabled={isDisabledStopOrRestartBtn(record)}
                            type={'link'}
                        >
                            stop
                        </Button>
                    </Popconfirm>
                ),
            },
            {
                key: 'restart',
                label: (
                    <Button
                        onClick={() => {
                            restart(record);
                        }}
                        className={'button-as-link'}
                        icon={<SyncOutlined />}
                        disabled={isDisabledStopOrRestartBtn(record)}
                        type={'link'}
                    >
                        restart
                    </Button>
                ),
            },
        ];
    };

    function isHasDeployedServiceProperties(
        details: VendorHostedDeployedServiceDetails | DeployedServiceDetails
    ): boolean {
        return !!(details.deployedServiceProperties && Object.keys(details.deployedServiceProperties).length !== 0);
    }

    function isHasServiceRequestProperties(
        details: VendorHostedDeployedServiceDetails | DeployedServiceDetails
    ): boolean {
        return !!(
            details.deployRequest.serviceRequestProperties &&
            Object.keys(details.deployRequest.serviceRequestProperties).length !== 0
        );
    }

    function isHasResultMessage(details: DeployedServiceDetails): boolean {
        return !!details.resultMessage;
    }

    function isHasDeployResources(details: DeployedServiceDetails): boolean {
        return !!details.deployResources && details.deployResources.length > 0;
    }

    const isDisableDetails = (record: DeployedService) => {
        if (record.serviceHostingType === DeployedService.serviceHostingType.SERVICE_VENDOR) {
            const details = record as VendorHostedDeployedServiceDetails;
            if (isHasDeployedServiceProperties(details) || isHasServiceRequestProperties(details)) {
                return false;
            }
        } else {
            const details = record as DeployedServiceDetails;
            if (
                isHasDeployedServiceProperties(details) ||
                isHasServiceRequestProperties(details) ||
                isHasResultMessage(details) ||
                isHasDeployResources(details)
            ) {
                return false;
            }
        }
        return true;
    };

    const isDisableStartBtn = (record: DeployedService) => {
        if (
            record.serviceDeploymentState !== DeployedService.serviceDeploymentState.DEPLOYMENT_SUCCESSFUL &&
            record.serviceDeploymentState !== DeployedService.serviceDeploymentState.MODIFICATION_SUCCESSFUL
        ) {
            if (record.serviceDeploymentState !== DeployedService.serviceDeploymentState.DESTROY_FAILED) {
                return true;
            }
        }

        if (
            activeRecord?.id === record.id &&
            (serviceStateStartQuery.isPending || serviceStateStopQuery.isPending || serviceStateRestartQuery.isPending)
        ) {
            return true;
        }

        return (
            record.serviceState === DeployedService.serviceState.RUNNING ||
            record.serviceState === DeployedService.serviceState.STOPPING_FAILED
        );
    };

    const isDisabledStopOrRestartBtn = (record: DeployedService) => {
        if (
            record.serviceDeploymentState !== DeployedService.serviceDeploymentState.DEPLOYMENT_SUCCESSFUL &&
            record.serviceDeploymentState !== DeployedService.serviceDeploymentState.MODIFICATION_SUCCESSFUL
        ) {
            if (record.serviceDeploymentState !== DeployedService.serviceDeploymentState.DESTROY_FAILED) {
                return true;
            }
        }

        if (
            activeRecord?.id === record.id &&
            (serviceStateStartQuery.isPending || serviceStateStopQuery.isPending || serviceStateRestartQuery.isPending)
        ) {
            return true;
        }

        return (
            record.serviceState === DeployedService.serviceState.STOPPED ||
            record.serviceState === DeployedService.serviceState.STARTING_FAILED
        );
    };

    const closeDestroyResultAlert = (isClose: boolean) => {
        if (isClose) {
            setActiveRecord(undefined);
            refreshData();
            setIsDestroyRequestSubmitted(false);
        }
    };

    const closePurgeResultAlert = (isClose: boolean) => {
        if (isClose) {
            setActiveRecord(undefined);
            refreshData();
            setIsPurgeRequestSubmitted(false);
        }
    };

    const columns: ColumnsType<DeployedService> = [
        {
            title: 'Id',
            dataIndex: 'id',
            filters: serviceIdInQuery ? undefined : serviceIdFilters,
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value: React.Key | boolean, record) => record.id.startsWith(value.toString()),
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
            filters: categoryFilters,
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value: React.Key | boolean, record) => record.category.startsWith(value.toString()),
            align: 'center',
        },
        {
            title: 'Service',
            dataIndex: 'name',
            filters: nameFilters,
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value: React.Key | boolean, record) => record.name.startsWith(value.toString()),
            align: 'center',
        },
        {
            title: 'Version',
            dataIndex: 'version',
            filters: versionFilters,
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
            render: (serviceHostingType: DeployedService.serviceHostingType) =>
                DeployedServicesHostingType(serviceHostingType),
        },
        {
            title: 'Csp',
            dataIndex: 'csp',
            filters: cspFilters,
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value: React.Key | boolean, record) => record.csp.startsWith(value.toString()),
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
            sorter: (serviceVoA, serviceVoB) => {
                const dateA = new Date(serviceVoA.createTime);
                const dateB = new Date(serviceVoB.createTime);
                return dateA.getTime() - dateB.getTime();
            },
            align: 'center',
        },
        {
            title: 'ServiceDeploymentState',
            dataIndex: 'serviceDeploymentState',
            filters: serviceDeploymentStateInQuery ? undefined : serviceDeploymentStateFilters,
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value: React.Key | boolean, record) =>
                record.serviceDeploymentState.startsWith(value.toString()),
            render: (serviceState: DeployedService.serviceDeploymentState) => DeployedServicesStatus(serviceState),
            filtered: !!serviceDeploymentStateInQuery,
            align: 'center',
        },
        {
            title: 'ServiceState',
            dataIndex: 'serviceState',
            align: 'center',
            filters: serviceStateFilters,
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value: React.Key | boolean, record) => record.serviceState.startsWith(value.toString()),
            render: (_text, record) => DeployedServicesRunningStatus(record),
        },
        {
            title: 'Monitor',
            dataIndex: 'monitor',
            align: 'center',
            render: (_, record) => {
                return (
                    <Tooltip title='Viewing Monitoring Indicators' placement='top'>
                        <Button
                            type='text'
                            onClick={() => {
                                onMonitor(record);
                            }}
                            disabled={
                                record.serviceDeploymentState.toString() !==
                                    DeployedService.serviceDeploymentState.DEPLOYMENT_SUCCESSFUL.toString() &&
                                record.serviceDeploymentState.toString() !==
                                    DeployedService.serviceDeploymentState.MODIFICATION_SUCCESSFUL.toString()
                            }
                        >
                            <FundOutlined />
                        </Button>
                    </Tooltip>
                );
            },
        },
        {
            title: 'Operation',
            dataIndex: 'operation',
            render: (_text: string, record: DeployedService) => {
                return (
                    <>
                        <Space size='middle'>
                            <Dropdown menu={{ items: getOperationMenu(record) }}>
                                <Button
                                    onClick={(e) => {
                                        e.preventDefault();
                                    }}
                                    type={'link'}
                                >
                                    <Space>
                                        More
                                        <CaretDownOutlined />
                                    </Space>
                                </Button>
                            </Dropdown>
                        </Space>
                    </>
                );
            },
            align: 'center',
        },
    ];

    const purge = (record: DeployedService): void => {
        setIsPurgeRequestSubmitted(true);
        setActiveRecord(
            record.serviceHostingType === DeployedService.serviceHostingType.SELF
                ? (record as DeployedServiceDetails)
                : (record as VendorHostedDeployedServiceDetails)
        );
        servicePurgeQuery.mutate(record.id);
        record.serviceDeploymentState = DeployedService.serviceDeploymentState.DESTROYING;
    };

    const migrationTitle = (record: DeployedService): React.JSX.Element => {
        return (
            <div className={'generic-table-container'}>
                <div className={'content-title'}>
                    Service: {record.name}@{record.version}
                </div>
            </div>
        );
    };

    function destroy(record: DeployedService): void {
        setIsDestroyRequestSubmitted(true);
        setActiveRecord(
            record.serviceHostingType === DeployedService.serviceHostingType.SELF
                ? (record as DeployedServiceDetails)
                : (record as VendorHostedDeployedServiceDetails)
        );
        serviceDestroyQuery.mutate(record.id);
        record.serviceDeploymentState = DeployedService.serviceDeploymentState.DESTROYING;
    }

    function start(record: DeployedService): void {
        setActiveRecord(
            record.serviceHostingType === DeployedService.serviceHostingType.SELF
                ? (record as DeployedServiceDetails)
                : (record as VendorHostedDeployedServiceDetails)
        );
        record.serviceState = DeployedService.serviceState.STARTING;
        serviceStateStartQuery.mutate(record);
    }

    function stop(record: DeployedService): void {
        setActiveRecord(
            record.serviceHostingType === DeployedService.serviceHostingType.SELF
                ? (record as DeployedServiceDetails)
                : (record as VendorHostedDeployedServiceDetails)
        );
        record.serviceState = DeployedService.serviceState.STOPPING;
        serviceStateStopQuery.mutate(record);
    }

    function restart(record: DeployedService): void {
        setActiveRecord(
            record.serviceHostingType === DeployedService.serviceHostingType.SELF
                ? (record as DeployedServiceDetails)
                : (record as VendorHostedDeployedServiceDetails)
        );
        record.serviceState = DeployedService.serviceState.STOPPING;
        serviceStateRestartQuery.mutate(record);
    }

    function migrate(record: DeployedService): void {
        setActiveRecord(
            record.serviceHostingType === DeployedService.serviceHostingType.SELF
                ? (record as DeployedServiceDetails)
                : (record as VendorHostedDeployedServiceDetails)
        );
        setIsMigrateModalOpen(true);
    }

    function modify(record: DeployedService): void {
        setActiveRecord(
            record.serviceHostingType === DeployedService.serviceHostingType.SELF
                ? (record as DeployedServiceDetails)
                : (record as VendorHostedDeployedServiceDetails)
        );
        const existingParameters = getExistingServiceParameters(record);
        for (const existingServiceParametersKey in existingParameters) {
            cacheFormVariable(existingServiceParametersKey, existingParameters[existingServiceParametersKey]);
        }
        setIsModifyModalOpen(true);
    }

    function scale(record: DeployedService): void {
        setActiveRecord(
            record.serviceHostingType === DeployedService.serviceHostingType.SELF
                ? (record as DeployedServiceDetails)
                : (record as VendorHostedDeployedServiceDetails)
        );
        const existingParameters = getExistingServiceParameters(record);
        for (const existingServiceParametersKey in existingParameters) {
            cacheFormVariable(existingServiceParametersKey, existingParameters[existingServiceParametersKey]);
        }
        setIsScaleModalOpen(true);
    }

    function onMonitor(record: DeployedService): void {
        navigate('/monitor', {
            state: record,
        });
    }

    function updateServiceIdFilters(resp: DeployedService[]): void {
        const filters: ColumnFilterItem[] = [];
        const serviceIdSet = new Set<string>('');
        resp.forEach((v) => {
            serviceIdSet.add(v.id);
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
        Object.values(DeployedService.csp).forEach((csp) => {
            const filter = {
                text: csp,
                value: csp,
            };
            filters.push(filter);
        });
        cspFilters = filters;
    }

    function updateServiceDeploymentStateFilters(): void {
        const filters: ColumnFilterItem[] = [];
        Object.values(DeployedService.serviceDeploymentState).forEach((serviceStateItem) => {
            const filter = {
                text: serviceStateItem,
                value: serviceStateItem,
            };
            filters.push(filter);
        });
        serviceDeploymentStateFilters = filters;
    }

    function updateServiceStateFilters(): void {
        const filters: ColumnFilterItem[] = [];
        Object.values(DeployedService.serviceState).forEach((serviceStateItem) => {
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
        Object.values(DeployedService.category).forEach((category) => {
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
        Object.values(DeployedService.serviceHostingType).forEach((serviceHostingType) => {
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
        setIsPurgeRequestSubmitted(false);
        void listDeployedServicesQuery.refetch();
    }

    const handleMyServiceDetailsOpenModal = (record: DeployedService) => {
        setActiveRecord(
            record.serviceHostingType === DeployedService.serviceHostingType.SELF
                ? (record as DeployedServiceDetails)
                : (record as VendorHostedDeployedServiceDetails)
        );
        setIsMyServiceDetailsModalOpen(true);
    };

    const handleMyServiceDetailsModalClose = () => {
        setActiveRecord(undefined);
        setIsMyServiceDetailsModalOpen(false);
    };

    const handleCancelMigrateModel = () => {
        setActiveRecord(undefined);
        clearFormVariables();
        refreshData();
        setIsMigrateModalOpen(false);
    };

    const handleCancelModifyModel = () => {
        setActiveRecord(undefined);
        clearFormVariables();
        refreshData();
        setIsModifyModalOpen(false);
    };

    const handleCancelScaleModel = () => {
        setActiveRecord(undefined);
        clearFormVariables();
        refreshData();
        setIsScaleModalOpen(false);
    };

    function getServiceDeploymentStateFromQuery(): DeployedService.serviceDeploymentState | undefined {
        const queryInUri = decodeURI(urlParams.get(serviceStateQuery) ?? '');
        if (queryInUri.length > 0) {
            if (
                Object.values(DeployedService.serviceDeploymentState).includes(
                    queryInUri as DeployedService.serviceDeploymentState
                )
            ) {
                return queryInUri as DeployedService.serviceDeploymentState;
            }
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

    return (
        <div className={'generic-table-container'}>
            {isDestroyRequestSubmitted && activeRecord ? (
                <DestroyServiceStatusAlert
                    key={activeRecord.id}
                    deployedService={activeRecord}
                    destroySubmitError={serviceDestroyQuery.error}
                    statusPollingError={getServiceDetailsByIdQuery.error}
                    deployedServiceDetails={getServiceDetailsByIdQuery.data}
                    closeDestroyResultAlert={closeDestroyResultAlert}
                />
            ) : null}
            {isPurgeRequestSubmitted && activeRecord ? (
                <PurgeServiceStatusAlert
                    key={activeRecord.id}
                    deployedService={activeRecord}
                    purgeSubmitError={servicePurgeQuery.error}
                    statusPollingError={getPurgeServiceDetailsQuery.error}
                    closePurgeResultAlert={closePurgeResultAlert}
                />
            ) : null}
            {activeRecord ? (
                <Modal
                    title={'Service Details'}
                    width={1000}
                    footer={null}
                    open={isMyServiceDetailsModalOpen}
                    onCancel={handleMyServiceDetailsModalClose}
                >
                    <MyServiceDetails deployedService={activeRecord} />
                </Modal>
            ) : null}
            {activeRecord ? (
                <Modal
                    open={isMigrateModalOpen}
                    title={migrationTitle(activeRecord)}
                    closable={true}
                    maskClosable={false}
                    destroyOnClose={true}
                    footer={null}
                    onCancel={handleCancelMigrateModel}
                    width={1400}
                    mask={true}
                >
                    <Migrate currentSelectedService={activeRecord} />
                </Modal>
            ) : null}

            {activeRecord ? (
                <Modal
                    open={isScaleModalOpen}
                    title={migrationTitle(activeRecord)}
                    closable={true}
                    maskClosable={false}
                    destroyOnClose={true}
                    footer={null}
                    onCancel={handleCancelScaleModel}
                    width={1400}
                    mask={true}
                >
                    <Scale currentSelectedService={activeRecord} />
                </Modal>
            ) : null}

            {activeRecord ? (
                <Modal
                    open={isModifyModalOpen}
                    title={migrationTitle(activeRecord)}
                    closable={true}
                    maskClosable={false}
                    destroyOnClose={true}
                    footer={null}
                    onCancel={handleCancelModifyModel}
                    width={1400}
                    mask={true}
                >
                    <Modify currentSelectedService={activeRecord} />
                </Modal>
            ) : null}

            <div>
                <Button
                    disabled={activeRecord !== undefined}
                    type='primary'
                    icon={<SyncOutlined />}
                    onClick={() => {
                        refreshData();
                    }}
                >
                    refresh
                </Button>
            </div>
            {listDeployedServicesQuery.isError ? (
                <>
                    <DeployedServicesError error={listDeployedServicesQuery.error} />
                </>
            ) : (
                <></>
            )}

            <Row>
                <div className={'service-instance-list'}>
                    <Table
                        columns={columns}
                        dataSource={serviceVoList}
                        loading={listDeployedServicesQuery.isPending || listDeployedServicesQuery.isRefetching}
                        rowKey={'id'}
                    />
                </div>
            </Row>
        </div>
    );
}

export default MyServices;
