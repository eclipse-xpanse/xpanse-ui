/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import {
    CaretDownOutlined,
    CloseCircleOutlined,
    CopyOutlined,
    DeleteOutlined,
    EditOutlined,
    FileTextOutlined,
    FundOutlined,
    HistoryOutlined,
    InfoCircleOutlined,
    LockOutlined,
    PlayCircleOutlined,
    PoweroffOutlined,
    RedoOutlined,
    RiseOutlined,
    SyncOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, Image, MenuProps, Modal, Popconfirm, Row, Space, Table, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ColumnFilterItem } from 'antd/es/table/interface';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { v4 } from 'uuid';
import appStyles from '../../../../styles/app.module.css';
import myServicesStyles from '../../../../styles/my-services.module.css';
import tableStyles from '../../../../styles/table.module.css';
import {
    billingMode,
    category,
    csp,
    DeployedService,
    DeployedServiceDetails,
    name,
    Region,
    serviceDeploymentState,
    serviceHostingType,
    ServiceProviderContactDetails,
    serviceState,
    taskStatus,
    VendorHostedDeployedServiceDetails,
} from '../../../../xpanse-api/generated';
import { sortVersionNum } from '../../../utils/Sort';
import { serviceIdQuery, serviceStateQuery } from '../../../utils/constants';
import { cspMap } from '../../common/csp/CspLogo';
import { ContactDetailsShowType } from '../../common/ocl/ContactDetailsShowType';
import { ContactDetailsText } from '../../common/ocl/ContactDetailsText';
import { useLatestServiceOrderStatusQuery } from '../../common/queries/useLatestServiceOrderStatusQuery.ts';
import { useServiceDetailsByServiceIdQuery } from '../../common/queries/useServiceDetailsByServiceIdQuery.ts';
import { getExistingServiceParameters } from '../../order/common/utils/existingServiceParameters';
import DestroyServiceStatusAlert from '../../order/destroy/DestroyServiceStatusAlert';
import { useDestroyRequestSubmitQuery } from '../../order/destroy/useDestroyRequestSubmitQuery';
import { Locks } from '../../order/locks/Locks';
import { Migrate } from '../../order/migrate/Migrate';
import { Modify } from '../../order/modify/Modify';
import OrderSubmitStatusAlert from '../../order/orderStatus/OrderSubmitStatusAlert';
import { PurgeServiceStatusAlert } from '../../order/purge/PurgeServiceStatusAlert';
import { usePurgeRequestStatusQuery } from '../../order/purge/usePurgeRequestStatusQuery';
import { usePurgeRequestSubmitQuery } from '../../order/purge/usePurgeRequestSubmitQuery';
import RecreateServiceStatusAlert from '../../order/recreate/RecreateServiceStatusAlert.tsx';
import useRecreateRequest from '../../order/recreate/useRecreateRequest.ts';
import useRedeployFailedDeploymentQuery from '../../order/retryDeployment/useRedeployFailedDeploymentQuery';
import { Scale } from '../../order/scale/Scale';
import { CurrentServiceConfiguration } from '../../order/serviceConfiguration/CurrentServiceConfiguration';
import RestartServiceStatusAlert from '../../order/serviceState/restart/RestartServiceStatusAlert';
import { useServiceStateRestartQuery } from '../../order/serviceState/restart/useServiceStateRestartQuery';
import StartServiceStatusAlert from '../../order/serviceState/start/StartServiceStatusAlert';
import { useServiceStateStartQuery } from '../../order/serviceState/start/useServiceStateStartQuery';
import StopServiceStatusAlert from '../../order/serviceState/stop/StopServiceStatusAlert';
import { useServiceStateStopQuery } from '../../order/serviceState/stop/useServiceStateStopQuery';
import { useOrderFormStore } from '../../order/store/OrderFormStore';
import { DeployedBillingMode } from '../common/DeployedBillingMode.tsx';
import { DeployedRegion } from '../common/DeployedRegion.tsx';
import DeployedServicesError from '../common/DeployedServicesError';
import { DeployedServicesHostingType } from '../common/DeployedServicesHostingType';
import { DeployedServicesRunningStatus } from '../common/DeployedServicesRunningStatus';
import { DeployedServicesStatus } from '../common/DeployedServicesStatus';
import { MyServiceDetails } from './MyServiceDetails';
import { MyServiceHistory } from './MyServiceHistory';
import useGetOrderableServiceDetailsQuery from './query/useGetOrderableServiceDetailsQuery';
import useListDeployedServicesDetailsQuery from './query/useListDeployedServicesDetailsQuery';

function MyServices(): React.JSX.Element {
    const [urlParams] = useSearchParams();
    const serviceIdInQuery = getServiceIdFormQuery();
    const serviceDeploymentStateInQuery = getServiceDeploymentStateFromQuery();
    const serviceStateInQuery = getServiceStateFromQuery();
    let serviceVoList: DeployedService[] = [];
    let versionFilters: ColumnFilterItem[] = [];
    let serviceHostingTypeFilters: ColumnFilterItem[] = [];
    let serviceBillingModeFilters: ColumnFilterItem[] = [];
    let serviceRegionNameFilters: ColumnFilterItem[] = [];
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
    const [isStartRequestSubmitted, setIsStartRequestSubmitted] = useState<boolean>(false);
    const [isStopRequestSubmitted, setIsStopRequestSubmitted] = useState<boolean>(false);
    const [isRestartRequestSubmitted, setIsRestartRequestSubmitted] = useState<boolean>(false);
    const [isDestroyRequestSubmitted, setIsDestroyRequestSubmitted] = useState<boolean>(false);
    const [isPurgeRequestSubmitted, setIsPurgeRequestSubmitted] = useState<boolean>(false);
    const [isRetryDeployRequestSubmitted, setIsRetryDeployRequestSubmitted] = useState<boolean>(false);
    const [isRecreateRequestSubmitted, setIsRecreateRequestSubmitted] = useState<boolean>(false);
    const [isMyServiceDetailsModalOpen, setIsMyServiceDetailsModalOpen] = useState(false);
    const [isMyServiceHistoryModalOpen, setIsMyServiceHistoryModalOpen] = useState(false);
    const [isMyServiceConfigurationModalOpen, setIsMyServiceConfigurationModalOpen] = useState(false);
    const [isMigrateModalOpen, setIsMigrateModalOpen] = useState<boolean>(false);
    const [isModifyModalOpen, setIsModifyModalOpen] = useState<boolean>(false);
    const [isScaleModalOpen, setIsScaleModalOpen] = useState<boolean>(false);
    const [isLocksModalOpen, setIsLocksModalOpen] = useState<boolean>(false);
    const [uniqueRequestId, setUniqueRequestId] = useState<string>(v4());
    const serviceDestroyQuery = useDestroyRequestSubmitQuery();
    const servicePurgeQuery = usePurgeRequestSubmitQuery();
    const redeployFailedDeploymentQuery = useRedeployFailedDeploymentQuery();
    const serviceRecreateRequest = useRecreateRequest();
    const serviceStateStartQuery = useServiceStateStartQuery(refreshData);
    const serviceStateStopQuery = useServiceStateStopQuery(refreshData);
    const serviceStateRestartQuery = useServiceStateRestartQuery(refreshData);
    const [clearFormVariables] = useOrderFormStore((state) => [state.clearFormVariables]);
    const navigate = useNavigate();
    const listDeployedServicesQuery = useListDeployedServicesDetailsQuery();
    const getOrderableServiceDetails = useGetOrderableServiceDetailsQuery(activeRecord?.serviceTemplateId);

    const getDestroyServiceStatusPollingQuery = useLatestServiceOrderStatusQuery(
        serviceDestroyQuery.data?.orderId ?? '',
        serviceDestroyQuery.isSuccess,
        [taskStatus.SUCCESSFUL, taskStatus.FAILED]
    );

    const getStartServiceDetailsQuery = useLatestServiceOrderStatusQuery(
        serviceStateStartQuery.data?.orderId ?? '',
        serviceStateStartQuery.isSuccess,
        [taskStatus.SUCCESSFUL, taskStatus.FAILED]
    );

    const getStopServiceDetailsQuery = useLatestServiceOrderStatusQuery(
        serviceStateStopQuery.data?.orderId ?? '',
        serviceStateStopQuery.isSuccess,
        [taskStatus.SUCCESSFUL, taskStatus.FAILED]
    );

    const getRestartServiceDetailsQuery = useLatestServiceOrderStatusQuery(
        serviceStateRestartQuery.data?.orderId ?? '',
        serviceStateRestartQuery.isSuccess,
        [taskStatus.SUCCESSFUL, taskStatus.FAILED]
    );

    const getReDeployLatestServiceOrderStatusQuery = useLatestServiceOrderStatusQuery(
        redeployFailedDeploymentQuery.data?.orderId ?? '',
        redeployFailedDeploymentQuery.isSuccess,
        [taskStatus.SUCCESSFUL, taskStatus.FAILED]
    );

    const getRecreateServiceOrderStatusPollingQuery = useLatestServiceOrderStatusQuery(
        serviceRecreateRequest.data?.orderId,
        serviceRecreateRequest.isSuccess,
        [taskStatus.SUCCESSFUL, taskStatus.FAILED]
    );

    const getServiceDetailsQuery = useServiceDetailsByServiceIdQuery(
        activeRecord?.serviceId,
        activeRecord ? (activeRecord.serviceHostingType as serviceHostingType) : serviceHostingType.SELF,
        getReDeployLatestServiceOrderStatusQuery.data?.taskStatus
    );

    useEffect(() => {
        void listDeployedServicesQuery.refetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        serviceRecreateRequest.isError,
        serviceRecreateRequest.isPending,
        getRecreateServiceOrderStatusPollingQuery.isError,
        getRecreateServiceOrderStatusPollingQuery.data?.isOrderCompleted,
        serviceStateStartQuery.isError,
        serviceStateStartQuery.isPending,
        getStartServiceDetailsQuery.isError,
        getStartServiceDetailsQuery.data?.isOrderCompleted,
        serviceStateStopQuery.isError,
        serviceStateStopQuery.isPending,
        getStopServiceDetailsQuery.isError,
        getStopServiceDetailsQuery.data?.isOrderCompleted,
        serviceStateRestartQuery.isError,
        serviceStateRestartQuery.isPending,
        getRestartServiceDetailsQuery.isError,
        getRestartServiceDetailsQuery.data?.isOrderCompleted,
        redeployFailedDeploymentQuery.isError,
        redeployFailedDeploymentQuery.isPending,
        getReDeployLatestServiceOrderStatusQuery.isError,
        getReDeployLatestServiceOrderStatusQuery.data?.isOrderCompleted,
    ]);

    const getPurgeServiceDetailsQuery = usePurgeRequestStatusQuery(
        activeRecord?.serviceId,
        activeRecord ? (activeRecord.serviceHostingType as serviceHostingType) : serviceHostingType.SELF,
        servicePurgeQuery.isSuccess
    );

    if (listDeployedServicesQuery.isSuccess && listDeployedServicesQuery.data.length > 0) {
        if (serviceDeploymentStateInQuery) {
            serviceVoList = listDeployedServicesQuery.data.filter((serviceVo: DeployedService) =>
                serviceDeploymentStateInQuery.includes(serviceVo.serviceDeploymentState as serviceDeploymentState)
            );
        } else if (serviceStateInQuery) {
            serviceVoList = listDeployedServicesQuery.data.filter((serviceVo: DeployedService) =>
                serviceStateInQuery.includes(serviceVo.serviceState as serviceState)
            );
        } else if (serviceIdInQuery) {
            serviceVoList = listDeployedServicesQuery.data.filter(
                (serviceVo: { serviceId: string }) => serviceVo.serviceId === serviceIdInQuery
            );
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
        updateBillingModeFilters();
        updateRegionFilters(listDeployedServicesQuery.data);
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
                            className={myServicesStyles.buttonAsLink}
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
                        className={myServicesStyles.buttonAsLink}
                        icon={<InfoCircleOutlined />}
                        type={'link'}
                    >
                        details
                    </Button>
                ),
            },
            {
                key: 'locks',
                label: (
                    <Button
                        onClick={() => {
                            locks(record);
                        }}
                        className={myServicesStyles.buttonAsLink}
                        icon={<LockOutlined />}
                        disabled={
                            activeRecord !== undefined ||
                            record.serviceDeploymentState.toString() === serviceDeploymentState.MODIFYING.toString() ||
                            record.serviceDeploymentState.toString() ===
                                serviceDeploymentState.DEPLOYMENT_FAILED.toString() ||
                            record.serviceDeploymentState.toString() ===
                                serviceDeploymentState.DESTROY_SUCCESSFUL.toString() ||
                            record.serviceDeploymentState.toString() === serviceDeploymentState.DEPLOYING.toString() ||
                            record.serviceDeploymentState.toString() === serviceDeploymentState.DESTROYING.toString()
                        }
                        type={'link'}
                    >
                        locks
                    </Button>
                ),
            },
            {
                key: 'scale',
                label: (
                    <>
                        {record.lockConfig?.modifyLocked ? (
                            <Tooltip
                                placement={'left'}
                                style={{ maxWidth: '100%' }}
                                title={'scaling has been locked for this service.'}
                            >
                                <Button
                                    className={myServicesStyles.buttonAsLink}
                                    icon={<RiseOutlined />}
                                    disabled={true}
                                    type={'link'}
                                >
                                    modify parameters
                                </Button>
                                <LockOutlined />
                            </Tooltip>
                        ) : (
                            <Button
                                onClick={() => {
                                    scale(record);
                                }}
                                className={myServicesStyles.buttonAsLink}
                                icon={<RiseOutlined />}
                                disabled={
                                    activeRecord !== undefined ||
                                    record.serviceDeploymentState.toString() ===
                                        serviceDeploymentState.MODIFYING.toString() ||
                                    record.serviceDeploymentState.toString() ===
                                        serviceDeploymentState.DEPLOYMENT_FAILED.toString() ||
                                    record.serviceDeploymentState.toString() ===
                                        serviceDeploymentState.DESTROY_SUCCESSFUL.toString() ||
                                    record.serviceDeploymentState.toString() ===
                                        serviceDeploymentState.DEPLOYING.toString() ||
                                    record.serviceDeploymentState.toString() ===
                                        serviceDeploymentState.DESTROYING.toString()
                                }
                                type={'link'}
                            >
                                scale
                            </Button>
                        )}
                    </>
                ),
            },
            {
                key: 'modify parameters',
                label: (
                    <>
                        {record.lockConfig?.modifyLocked ? (
                            <Tooltip
                                placement={'left'}
                                style={{ maxWidth: '100%' }}
                                title={'modifications has been locked for this service.'}
                            >
                                <Button
                                    className={myServicesStyles.buttonAsLink}
                                    icon={<EditOutlined />}
                                    disabled={true}
                                    type={'link'}
                                >
                                    modify parameters
                                </Button>
                                <LockOutlined />
                            </Tooltip>
                        ) : (
                            <Button
                                onClick={() => {
                                    modify(record);
                                }}
                                className={myServicesStyles.buttonAsLink}
                                icon={<EditOutlined />}
                                disabled={
                                    activeRecord !== undefined ||
                                    (record.lockConfig?.modifyLocked !== undefined && record.lockConfig.modifyLocked) ||
                                    record.serviceDeploymentState.toString() ===
                                        serviceDeploymentState.MODIFYING.toString() ||
                                    record.serviceDeploymentState.toString() ===
                                        serviceDeploymentState.DEPLOYMENT_FAILED.toString() ||
                                    record.serviceDeploymentState.toString() ===
                                        serviceDeploymentState.DESTROY_SUCCESSFUL.toString() ||
                                    record.serviceDeploymentState.toString() ===
                                        serviceDeploymentState.DEPLOYING.toString() ||
                                    record.serviceDeploymentState.toString() ===
                                        serviceDeploymentState.DESTROYING.toString()
                                }
                                type={'link'}
                            >
                                modify parameters
                            </Button>
                        )}
                    </>
                ),
            },
            {
                key: 'migrate',
                label: (
                    <>
                        {record.lockConfig?.modifyLocked ? (
                            <Tooltip
                                placement={'left'}
                                style={{ maxWidth: '100%' }}
                                title={'migration has been locked for this service.'}
                            >
                                <Button
                                    className={myServicesStyles.buttonAsLink}
                                    icon={<CopyOutlined />}
                                    disabled={true}
                                    type={'link'}
                                >
                                    migrate
                                </Button>
                                <LockOutlined />
                            </Tooltip>
                        ) : (
                            <Button
                                onClick={() => {
                                    migrate(record);
                                }}
                                className={myServicesStyles.buttonAsLink}
                                icon={<CopyOutlined />}
                                disabled={
                                    activeRecord !== undefined ||
                                    record.serviceDeploymentState.toString() ===
                                        serviceDeploymentState.DEPLOYMENT_FAILED.toString() ||
                                    record.serviceDeploymentState.toString() ===
                                        serviceDeploymentState.MODIFICATION_FAILED.toString() ||
                                    record.serviceDeploymentState.toString() ===
                                        serviceDeploymentState.DESTROY_SUCCESSFUL.toString() ||
                                    record.serviceDeploymentState.toString() ===
                                        serviceDeploymentState.DEPLOYING.toString() ||
                                    record.serviceDeploymentState.toString() ===
                                        serviceDeploymentState.DESTROYING.toString()
                                }
                                type={'link'}
                            >
                                migrate
                            </Button>
                        )}
                    </>
                ),
            },
            record.serviceDeploymentState.toString() === serviceDeploymentState.DEPLOYMENT_FAILED.toString()
                ? {
                      key: 'retryDeployment',
                      label: (
                          <Popconfirm
                              title='Retry Deployment the service'
                              description='Are you sure to retry the service deployment?'
                              cancelText='Yes'
                              okText='No'
                              onCancel={() => {
                                  retryDeployment(record);
                              }}
                          >
                              <Button
                                  className={myServicesStyles.buttonAsLink}
                                  icon={<PlayCircleOutlined />}
                                  disabled={isDisableRetryDeploymentBtn(record)}
                                  type={'link'}
                              >
                                  retry deployment
                              </Button>
                          </Popconfirm>
                      ),
                  }
                : null,
            record.serviceDeploymentState.toString() === serviceDeploymentState.DEPLOYMENT_SUCCESSFUL.toString() ||
            record.serviceDeploymentState.toString() === serviceDeploymentState.DESTROY_FAILED.toString() ||
            record.serviceDeploymentState.toString() === serviceDeploymentState.MODIFICATION_FAILED.toString() ||
            record.serviceDeploymentState.toString() === serviceDeploymentState.MODIFICATION_SUCCESSFUL.toString()
                ? {
                      key: 'recreateService',
                      label: (
                          <Popconfirm
                              title='Recreate the service'
                              description='Are you sure to recreate the service?'
                              cancelText='Yes'
                              okText='No'
                              onCancel={() => {
                                  recreate(record);
                              }}
                          >
                              <Button
                                  className={myServicesStyles.buttonAsLink}
                                  icon={<RedoOutlined />}
                                  disabled={isDisableRecreateBtn(record)}
                                  type={'link'}
                              >
                                  recreate
                              </Button>
                          </Popconfirm>
                      ),
                  }
                : null,
            {
                key:
                    record.serviceDeploymentState.toString() === serviceDeploymentState.DESTROY_SUCCESSFUL.toString() ||
                    record.serviceDeploymentState.toString() === serviceDeploymentState.DEPLOYMENT_FAILED.toString() ||
                    record.serviceDeploymentState.toString() === serviceDeploymentState.ROLLBACK_FAILED.toString()
                        ? 'purge'
                        : 'destroy',
                label:
                    record.serviceDeploymentState.toString() === serviceDeploymentState.DESTROY_SUCCESSFUL.toString() ||
                    record.serviceDeploymentState.toString() === serviceDeploymentState.DEPLOYMENT_FAILED.toString() ||
                    record.serviceDeploymentState.toString() === serviceDeploymentState.ROLLBACK_FAILED.toString() ? (
                        <>
                            {record.lockConfig?.destroyLocked ? (
                                <Tooltip
                                    placement={'left'}
                                    style={{ maxWidth: '100%' }}
                                    title={'purging has been locked for this service.'}
                                >
                                    <Button
                                        icon={<DeleteOutlined />}
                                        disabled={true}
                                        className={myServicesStyles.buttonAsLink}
                                        type={'link'}
                                    >
                                        purge
                                    </Button>
                                    <LockOutlined />
                                </Tooltip>
                            ) : (
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
                                        disabled={
                                            activeRecord !== undefined ||
                                            (record.lockConfig?.destroyLocked !== undefined &&
                                                record.lockConfig.destroyLocked)
                                        }
                                        className={myServicesStyles.buttonAsLink}
                                        type={'link'}
                                    >
                                        purge
                                    </Button>
                                </Popconfirm>
                            )}
                        </>
                    ) : (
                        <>
                            {record.lockConfig?.destroyLocked ? (
                                <Tooltip
                                    placement={'left'}
                                    style={{ maxWidth: '100%' }}
                                    title={'destroy has been locked for this service.'}
                                >
                                    <Button
                                        icon={<CloseCircleOutlined />}
                                        disabled={true}
                                        className={myServicesStyles.buttonAsLink}
                                        type={'link'}
                                    >
                                        purge
                                    </Button>
                                    <LockOutlined />
                                </Tooltip>
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
                                                serviceDeploymentState.DESTROY_FAILED.toString() &&
                                                record.serviceDeploymentState.toString() !==
                                                    serviceDeploymentState.DEPLOYMENT_SUCCESSFUL.toString() &&
                                                record.serviceDeploymentState.toString() !==
                                                    serviceDeploymentState.MODIFICATION_FAILED.toString() &&
                                                record.serviceDeploymentState.toString() !==
                                                    serviceDeploymentState.MODIFICATION_SUCCESSFUL.toString()) ||
                                            activeRecord !== undefined
                                        }
                                        className={myServicesStyles.buttonAsLink}
                                        type={'link'}
                                    >
                                        destroy
                                    </Button>
                                </Popconfirm>
                            )}
                        </>
                    ),
            },
            {
                key: 'start',
                label: (
                    <Button
                        onClick={() => {
                            start(record);
                        }}
                        className={myServicesStyles.buttonAsLink}
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
                            className={myServicesStyles.buttonAsLink}
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
                    <Popconfirm
                        title='Restart the service'
                        description='Are you sure to restart the service?'
                        cancelText='Yes'
                        okText='No'
                        onCancel={() => {
                            restart(record);
                        }}
                    >
                        <Button
                            icon={<SyncOutlined />}
                            className={myServicesStyles.buttonAsLink}
                            disabled={isDisabledStopOrRestartBtn(record)}
                            type={'link'}
                        >
                            restart
                        </Button>
                    </Popconfirm>
                ),
            },
            {
                key: 'history',
                label: (
                    <Button
                        onClick={() => {
                            handleMyServiceHistoryOpenModal(record);
                        }}
                        className={myServicesStyles.buttonAsLink}
                        icon={<HistoryOutlined />}
                        type={'link'}
                    >
                        history
                    </Button>
                ),
            },
            {
                key: 'service configuration',
                label: (
                    <Button
                        onClick={() => {
                            handleMyServiceConfigurationOpenModal(record);
                        }}
                        className={myServicesStyles.buttonAsLink}
                        disabled={isDisableServiceConfigBtn(record)}
                        icon={<FileTextOutlined />}
                        type={'link'}
                    >
                        service configuration
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
        if (record.serviceHostingType === serviceHostingType.SERVICE_VENDOR) {
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
            record.serviceDeploymentState !== serviceDeploymentState.DEPLOYMENT_SUCCESSFUL &&
            record.serviceDeploymentState !== serviceDeploymentState.MODIFICATION_SUCCESSFUL
        ) {
            if (record.serviceDeploymentState !== serviceDeploymentState.DESTROY_FAILED) {
                return true;
            }
        }

        if (
            activeRecord?.serviceId === record.serviceId &&
            (serviceStateStartQuery.isPending || serviceStateStopQuery.isPending || serviceStateRestartQuery.isPending)
        ) {
            return true;
        }

        if (
            record.serviceState === serviceState.STARTING ||
            record.serviceState === serviceState.STOPPING ||
            record.serviceState === serviceState.RESTARTING
        ) {
            return true;
        }

        return record.serviceState === serviceState.RUNNING;
    };

    const isDisabledStopOrRestartBtn = (record: DeployedService) => {
        if (
            record.serviceDeploymentState !== serviceDeploymentState.DEPLOYMENT_SUCCESSFUL &&
            record.serviceDeploymentState !== serviceDeploymentState.MODIFICATION_SUCCESSFUL
        ) {
            if (record.serviceDeploymentState !== serviceDeploymentState.DESTROY_FAILED) {
                return true;
            }
        }

        if (
            activeRecord?.serviceId === record.serviceId &&
            (serviceStateStartQuery.isPending || serviceStateStopQuery.isPending || serviceStateRestartQuery.isPending)
        ) {
            return true;
        }

        if (
            record.serviceState === serviceState.STARTING ||
            record.serviceState === serviceState.STOPPING ||
            record.serviceState === serviceState.RESTARTING
        ) {
            return true;
        }

        return record.serviceState === serviceState.STOPPED;
    };

    const isDisableRetryDeploymentBtn = (record: DeployedService) => {
        if (record.serviceDeploymentState === serviceDeploymentState.DEPLOYING) {
            return true;
        }
        return false;
    };

    const isDisableServiceConfigBtn = (record: DeployedService) => {
        if (
            record.serviceDeploymentState === serviceDeploymentState.DEPLOYMENT_SUCCESSFUL ||
            record.serviceDeploymentState === serviceDeploymentState.DESTROY_FAILED ||
            record.serviceDeploymentState === serviceDeploymentState.MODIFICATION_SUCCESSFUL
        ) {
            if (record.serviceConfigurationDetails) {
                return false;
            }
        }
        return true;
    };

    const isDisableRecreateBtn = (record: DeployedService) => {
        if (
            record.serviceDeploymentState !== serviceDeploymentState.DEPLOYMENT_SUCCESSFUL &&
            record.serviceDeploymentState !== serviceDeploymentState.DESTROY_FAILED &&
            record.serviceDeploymentState !== serviceDeploymentState.MODIFICATION_FAILED &&
            record.serviceDeploymentState !== serviceDeploymentState.MODIFICATION_SUCCESSFUL
        ) {
            return true;
        }
        return false;
    };

    const closeDestroyResultAlert = (isClose: boolean) => {
        if (isClose) {
            setActiveRecord(undefined);
            refreshData();
            setIsDestroyRequestSubmitted(false);
        }
    };

    const closeStartResultAlert = (isClose: boolean) => {
        if (isClose) {
            setActiveRecord(undefined);
            setIsStartRequestSubmitted(false);
        }
    };

    const closeStopResultAlert = (isClose: boolean) => {
        if (isClose) {
            setActiveRecord(undefined);
            setIsStopRequestSubmitted(false);
        }
    };

    const closeRestartResultAlert = (isClose: boolean) => {
        if (isClose) {
            setActiveRecord(undefined);
            setIsRestartRequestSubmitted(false);
        }
    };

    const closePurgeResultAlert = (isClose: boolean) => {
        if (isClose) {
            setActiveRecord(undefined);
            refreshData();
            setIsPurgeRequestSubmitted(false);
        }
    };

    const closeRetryDeployResultAlert = () => {
        setActiveRecord(undefined);
        refreshData();
        setIsRetryDeployRequestSubmitted(false);
        setUniqueRequestId('');
    };

    const closeRecreateResultAlert = (isClose: boolean) => {
        if (isClose) {
            setActiveRecord(undefined);
            refreshData();
            setIsRecreateRequestSubmitted(false);
        }
    };

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
            render: (serviceHostingType: serviceHostingType) => (
                <DeployedServicesHostingType currentServiceHostingType={serviceHostingType} />
            ),
        },
        {
            title: 'BillingMode',
            dataIndex: 'billingMode',
            filters: serviceBillingModeFilters,
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value: React.Key | boolean, record) => record.billingMode.startsWith(value.toString()),
            align: 'center',
            render: (billingMode: billingMode) => <DeployedBillingMode currentBillingMode={billingMode} />,
        },
        {
            title: 'Region',
            dataIndex: 'region',
            filters: serviceRegionNameFilters,
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value: React.Key | boolean, record) => record.region.name.startsWith(value.toString()),
            align: 'center',
            render: (region: Region) => <DeployedRegion currentRegion={region} />,
        },
        {
            title: 'Csp',
            dataIndex: 'csp',
            filters: cspFilters,
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
            render: (serviceState: serviceDeploymentState) => DeployedServicesStatus(serviceState),
            filtered: !!serviceDeploymentStateInQuery,
            align: 'center',
        },
        {
            title: 'ServiceState',
            dataIndex: 'serviceState',
            align: 'center',
            filters: serviceStateInQuery ? undefined : serviceStateFilters,
            filtered: !!serviceStateInQuery,
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
                                    serviceDeploymentState.DEPLOYMENT_SUCCESSFUL.toString() &&
                                record.serviceDeploymentState.toString() !==
                                    serviceDeploymentState.MODIFICATION_SUCCESSFUL.toString()
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
            record.serviceHostingType === serviceHostingType.SELF
                ? (record as DeployedServiceDetails)
                : (record as VendorHostedDeployedServiceDetails)
        );
        servicePurgeQuery.mutate(record.serviceId);
        record.serviceDeploymentState = serviceDeploymentState.DESTROYING;
    };

    const migrationTitle = (record: DeployedService): React.JSX.Element => {
        return (
            <div className={tableStyles.genericTableContainer}>
                <div className={appStyles.contentTitle}>
                    Service: {record.name}@{record.version}
                </div>
            </div>
        );
    };

    const locksTitle = (): React.JSX.Element => {
        return <div className={appStyles.contentTitle}>Service Lock Config</div>;
    };

    function destroy(record: DeployedService): void {
        setIsDestroyRequestSubmitted(true);
        setActiveRecord(
            record.serviceHostingType === serviceHostingType.SELF
                ? (record as DeployedServiceDetails)
                : (record as VendorHostedDeployedServiceDetails)
        );
        serviceDestroyQuery.mutate(record.serviceId);
        record.serviceDeploymentState = serviceDeploymentState.DESTROYING;
    }

    function start(record: DeployedService): void {
        // force close any old alerts if still open.
        setIsStopRequestSubmitted(false);
        setIsRestartRequestSubmitted(false);
        setIsStartRequestSubmitted(true);
        setActiveRecord(
            record.serviceHostingType === serviceHostingType.SELF
                ? (record as DeployedServiceDetails)
                : (record as VendorHostedDeployedServiceDetails)
        );
        serviceStateStartQuery.mutate(record.serviceId);
        record.serviceState = serviceState.STARTING;
    }

    function stop(record: DeployedService): void {
        // force close any old alerts if still open.
        setIsStartRequestSubmitted(false);
        setIsRestartRequestSubmitted(false);
        setIsStopRequestSubmitted(true);
        setActiveRecord(
            record.serviceHostingType === serviceHostingType.SELF
                ? (record as DeployedServiceDetails)
                : (record as VendorHostedDeployedServiceDetails)
        );
        serviceStateStopQuery.mutate(record.serviceId);
        record.serviceState = serviceState.STOPPING;
    }

    function restart(record: DeployedService): void {
        // force close any old alerts if still open.
        setIsStartRequestSubmitted(false);
        setIsStopRequestSubmitted(false);
        setIsRestartRequestSubmitted(true);
        setActiveRecord(
            record.serviceHostingType === serviceHostingType.SELF
                ? (record as DeployedServiceDetails)
                : (record as VendorHostedDeployedServiceDetails)
        );
        serviceStateRestartQuery.mutate(record.serviceId);
        record.serviceState = serviceState.RESTARTING;
    }

    function migrate(record: DeployedService): void {
        setActiveRecord(
            record.serviceHostingType === serviceHostingType.SELF
                ? (record as DeployedServiceDetails)
                : (record as VendorHostedDeployedServiceDetails)
        );
        setIsMigrateModalOpen(true);
    }

    function modify(record: DeployedService): void {
        setActiveRecord(
            record.serviceHostingType === serviceHostingType.SELF
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
            record.serviceHostingType === serviceHostingType.SELF
                ? (record as DeployedServiceDetails)
                : (record as VendorHostedDeployedServiceDetails)
        );
        const existingParameters = getExistingServiceParameters(record);
        for (const existingServiceParametersKey in existingParameters) {
            cacheFormVariable(existingServiceParametersKey, existingParameters[existingServiceParametersKey]);
        }
        setIsScaleModalOpen(true);
    }

    function locks(record: DeployedService): void {
        setActiveRecord(
            record.serviceHostingType === serviceHostingType.SELF
                ? (record as DeployedServiceDetails)
                : (record as VendorHostedDeployedServiceDetails)
        );
        const existingParameters = getExistingServiceParameters(record);
        for (const existingServiceParametersKey in existingParameters) {
            cacheFormVariable(existingServiceParametersKey, existingParameters[existingServiceParametersKey]);
        }
        setIsLocksModalOpen(true);
    }

    function retryDeployment(record: DeployedService): void {
        setIsRetryDeployRequestSubmitted(true);
        setActiveRecord(
            record.serviceHostingType === serviceHostingType.SELF
                ? (record as DeployedServiceDetails)
                : (record as VendorHostedDeployedServiceDetails)
        );
        redeployFailedDeploymentQuery.mutate(record.serviceId);
        record.serviceDeploymentState = serviceDeploymentState.DEPLOYING;
    }

    function recreate(record: DeployedService): void {
        setIsRecreateRequestSubmitted(true);
        setActiveRecord(
            record.serviceHostingType === serviceHostingType.SELF
                ? (record as DeployedServiceDetails)
                : (record as VendorHostedDeployedServiceDetails)
        );
        serviceRecreateRequest.mutate(record.serviceId);
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

    function updateServiceDeploymentStateFilters(): void {
        const filters: ColumnFilterItem[] = [];
        Object.values(serviceDeploymentState).forEach((serviceStateItem) => {
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
        Object.values(serviceState).forEach((serviceStateItem) => {
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

    function updateBillingModeFilters(): void {
        const filters: ColumnFilterItem[] = [];
        Object.values(billingMode).forEach((billingMode) => {
            const filter = {
                text: billingMode,
                value: billingMode,
            };
            filters.push(filter);
        });
        serviceBillingModeFilters = filters;
    }

    function updateRegionFilters(resp: DeployedService[]): void {
        const filters: ColumnFilterItem[] = [];
        const regionNameSet = new Set<string>('');
        resp.forEach((v) => {
            if (v.region.name) {
                regionNameSet.add(v.region.name);
            }
        });
        regionNameSet.forEach((name) => {
            const filter = {
                text: name,
                value: name,
            };
            filters.push(filter);
        });
        serviceRegionNameFilters = filters;
    }

    function refreshData(): void {
        clearFormVariables();
        setIsPurgeRequestSubmitted(false);
        void listDeployedServicesQuery.refetch();
    }

    const handleMyServiceDetailsOpenModal = (record: DeployedService) => {
        setActiveRecord(
            record.serviceHostingType === serviceHostingType.SELF
                ? (record as DeployedServiceDetails)
                : (record as VendorHostedDeployedServiceDetails)
        );
        setIsMyServiceDetailsModalOpen(true);
    };

    const handleMyServiceDetailsModalClose = () => {
        setActiveRecord(undefined);
        setIsMyServiceDetailsModalOpen(false);
    };

    const handleMyServiceHistoryOpenModal = (record: DeployedService) => {
        setActiveRecord(
            record.serviceHostingType === serviceHostingType.SELF
                ? (record as DeployedServiceDetails)
                : (record as VendorHostedDeployedServiceDetails)
        );
        setIsMyServiceHistoryModalOpen(true);
    };

    const handleMyServiceHistoryModalClose = () => {
        setActiveRecord(undefined);
        setIsMyServiceHistoryModalOpen(false);
    };

    const handleMyServiceConfigurationOpenModal = (record: DeployedService) => {
        setActiveRecord(
            record.serviceHostingType === serviceHostingType.SELF
                ? (record as DeployedServiceDetails)
                : (record as VendorHostedDeployedServiceDetails)
        );
        setIsMyServiceConfigurationModalOpen(true);
    };

    const handleMyServiceConfigurationModalClose = () => {
        setActiveRecord(undefined);
        setIsMyServiceConfigurationModalOpen(false);
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

    const handleCancelLocksModel = () => {
        setActiveRecord(undefined);
        clearFormVariables();
        refreshData();
        setIsLocksModalOpen(false);
    };

    function getServiceDeploymentStateFromQuery(): serviceDeploymentState[] | undefined {
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

    function getServiceStateFromQuery(): serviceState[] | undefined {
        const serviceStateList: serviceState[] = [];
        if (urlParams.size > 0) {
            urlParams.forEach((value, key) => {
                if (key === serviceStateQuery && Object.values(serviceState).includes(value as serviceState)) {
                    serviceStateList.push(value as serviceState);
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

    const retryRequest = () => {
        setUniqueRequestId(v4());
        if (activeRecord && activeRecord.serviceId.length > 0) {
            redeployFailedDeploymentQuery.mutate(activeRecord.serviceId);
        }
    };

    return (
        <div className={tableStyles.genericTableContainer}>
            {isDestroyRequestSubmitted && activeRecord ? (
                <DestroyServiceStatusAlert
                    key={activeRecord.serviceId}
                    deployedService={activeRecord}
                    destroySubmitError={serviceDestroyQuery.error}
                    serviceStateDestroyQueryError={getDestroyServiceStatusPollingQuery.error}
                    serviceStateDestroyQueryData={getDestroyServiceStatusPollingQuery.data}
                    closeDestroyResultAlert={closeDestroyResultAlert}
                />
            ) : null}
            {isStartRequestSubmitted && activeRecord ? (
                <StartServiceStatusAlert
                    key={activeRecord.serviceId}
                    deployedService={activeRecord}
                    serviceStateStartQuery={serviceStateStartQuery}
                    closeStartResultAlert={closeStartResultAlert}
                    getStartServiceDetailsQuery={getStartServiceDetailsQuery}
                />
            ) : null}
            {isStopRequestSubmitted && activeRecord ? (
                <StopServiceStatusAlert
                    key={activeRecord.serviceId}
                    deployedService={activeRecord}
                    serviceStateStopQuery={serviceStateStopQuery}
                    closeStopResultAlert={closeStopResultAlert}
                    getStopServiceDetailsQuery={getStopServiceDetailsQuery}
                />
            ) : null}
            {isRestartRequestSubmitted && activeRecord ? (
                <RestartServiceStatusAlert
                    key={activeRecord.serviceId}
                    deployedService={activeRecord}
                    serviceStateRestartQuery={serviceStateRestartQuery}
                    closeRestartResultAlert={closeRestartResultAlert}
                    getRestartServiceDetailsQuery={getRestartServiceDetailsQuery}
                />
            ) : null}
            {isPurgeRequestSubmitted && activeRecord ? (
                <PurgeServiceStatusAlert
                    key={activeRecord.serviceId}
                    deployedService={activeRecord}
                    purgeSubmitError={servicePurgeQuery.error}
                    statusPollingError={getPurgeServiceDetailsQuery.error}
                    closePurgeResultAlert={closePurgeResultAlert}
                />
            ) : null}
            {isRetryDeployRequestSubmitted && activeRecord ? (
                <OrderSubmitStatusAlert
                    key={uniqueRequestId}
                    uuid={activeRecord.serviceId}
                    serviceHostType={activeRecord.serviceHostingType as serviceHostingType}
                    submitDeploymentRequest={redeployFailedDeploymentQuery}
                    redeployFailedDeploymentQuery={redeployFailedDeploymentQuery}
                    getSubmitLatestServiceOrderStatusQuery={getReDeployLatestServiceOrderStatusQuery}
                    deployedServiceDetails={getServiceDetailsQuery.data}
                    serviceProviderContactDetails={getOrderableServiceDetails.data?.serviceProviderContactDetails}
                    retryRequest={retryRequest}
                    onClose={closeRetryDeployResultAlert}
                />
            ) : null}
            {isRecreateRequestSubmitted && activeRecord ? (
                <RecreateServiceStatusAlert
                    key={activeRecord.serviceId}
                    currentSelectedService={activeRecord}
                    recreateRequest={serviceRecreateRequest}
                    recreateServiceOrderStatusPollingQueryError={getRecreateServiceOrderStatusPollingQuery.error}
                    recreateServiceOrderStatusPollingQueryData={getRecreateServiceOrderStatusPollingQuery.data}
                    closeRecreateResultAlert={closeRecreateResultAlert}
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
                    title={'Service Modified History'}
                    width={1600}
                    footer={null}
                    open={isMyServiceHistoryModalOpen}
                    onCancel={handleMyServiceHistoryModalClose}
                >
                    <MyServiceHistory deployedService={activeRecord} />
                </Modal>
            ) : null}
            {activeRecord ? (
                <Modal
                    title={'Service Configuration'}
                    width={1600}
                    footer={null}
                    open={isMyServiceConfigurationModalOpen}
                    onCancel={handleMyServiceConfigurationModalClose}
                >
                    <CurrentServiceConfiguration
                        userOrderableServiceVo={getOrderableServiceDetails.data}
                        deployedService={activeRecord}
                    />
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
                    width={1600}
                    mask={true}
                >
                    <Migrate currentSelectedService={activeRecord} />
                </Modal>
            ) : null}

            {activeRecord ? (
                <Modal
                    open={isLocksModalOpen}
                    title={locksTitle()}
                    closable={true}
                    maskClosable={false}
                    destroyOnClose={true}
                    footer={null}
                    onCancel={handleCancelLocksModel}
                    width={400}
                    mask={true}
                >
                    <Locks currentSelectedService={activeRecord} />
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
                <div className={myServicesStyles.serviceInstanceList}>
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
