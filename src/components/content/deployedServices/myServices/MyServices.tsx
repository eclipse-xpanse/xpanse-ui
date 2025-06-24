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
    SettingOutlined,
    SyncOutlined,
} from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import {
    Button,
    Dropdown,
    Image,
    MenuProps,
    Modal,
    Popconfirm,
    Row,
    Space,
    Table,
    TablePaginationConfig,
    Tooltip,
} from 'antd';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';
import type { ColumnsType, ColumnType } from 'antd/es/table';
import { ColumnFilterItem, FilterValue, SorterResult } from 'antd/es/table/interface';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { v4 } from 'uuid';
import myServicesStyles from '../../../../styles/my-services.module.css';
import tableStyles from '../../../../styles/table.module.css';
import {
    billingMode,
    csp,
    DeployedService,
    DeployedServiceDetails,
    name,
    orderStatus,
    Region,
    serviceDeploymentState,
    serviceHostingType,
    serviceState,
    VendorHostedDeployedServiceDetails,
} from '../../../../xpanse-api/generated';
import { serviceDetailsErrorText } from '../../../utils/constants.tsx';
import { sortVersionNum } from '../../../utils/Sort';
import { cspMap } from '../../common/csp/CspLogo';
import RetryPrompt from '../../common/error/RetryPrompt.tsx';
import { ContactDetailsShowType } from '../../common/ocl/ContactDetailsShowType.ts';
import { ContactDetailsText } from '../../common/ocl/ContactDetailsText.tsx';
import { useLatestServiceOrderStatusQuery } from '../../common/queries/useLatestServiceOrderStatusQuery.ts';
import { ServiceTitle } from '../../order/common/ServiceTitle.tsx';
import { ShowId } from '../../order/common/ShowId.tsx';
import { getExistingServiceParameters } from '../../order/common/utils/existingServiceParameters';
import DestroyServiceStatusAlert from '../../order/destroy/DestroyServiceStatusAlert';
import { useDestroyRequestSubmitQuery } from '../../order/destroy/useDestroyRequestSubmitQuery';
import { Locks } from '../../order/locks/Locks';
import { Modify } from '../../order/modify/Modify';
import { PurgeServiceStatusAlert } from '../../order/purge/PurgeServiceStatusAlert.tsx';
import { usePurgeRequestStatusQuery } from '../../order/purge/usePurgeRequestStatusQuery.ts';
import { usePurgeRequestSubmitQuery } from '../../order/purge/usePurgeRequestSubmitQuery';
import RecreateServiceStatusAlert from '../../order/recreate/RecreateServiceStatusAlert.tsx';
import useRecreateRequest from '../../order/recreate/useRecreateRequest.ts';
import { RetryServiceSubmit } from '../../order/retryDeployment/RetryServiceSubmit.tsx';
import useRedeployFailedDeploymentQuery from '../../order/retryDeployment/useRedeployFailedDeploymentQuery';
import { ScaleModal } from '../../order/scale/ScaleModal.tsx';
import { CreateServiceActionForm } from '../../order/serviceActions/CreateServiceActionForm';
import { ServiceConfiguration } from '../../order/serviceConfiguration/ServiceConfiguration.tsx';
import { getCurrentConfigurationQueryKey } from '../../order/serviceConfiguration/useGetConfigurationOfServiceQuery.ts';
import { ServicePorting } from '../../order/servicePorting/ServicePorting.tsx';
import RestartServiceStatusAlert from '../../order/serviceState/restart/RestartServiceStatusAlert';
import { useServiceStateRestartQuery } from '../../order/serviceState/restart/useServiceStateRestartQuery';
import StartServiceStatusAlert from '../../order/serviceState/start/StartServiceStatusAlert';
import { useServiceStateStartQuery } from '../../order/serviceState/start/useServiceStateStartQuery';
import StopServiceStatusAlert from '../../order/serviceState/stop/StopServiceStatusAlert';
import { useServiceStateStopQuery } from '../../order/serviceState/stop/useServiceStateStopQuery';
import { useOrderFormStore } from '../../order/store/OrderFormStore';
import { DeployedBillingMode } from '../common/DeployedBillingMode.tsx';
import { DeployedRegion } from '../common/DeployedRegion.tsx';
import { DeployedServicesHostingType } from '../common/DeployedServicesHostingType';
import { DeployedServicesRunningStatus } from '../common/DeployedServicesRunningStatus';
import { DeployedServicesStatus } from '../common/DeployedServicesStatus';
import { LocksTitle } from './LocksTitle.tsx';
import { MyServiceDetails } from './MyServiceDetails';
import { MyServiceHistory } from './MyServiceHistory';
import {
    getDefaultColumns,
    isDisableDestroyButton,
    isDisableDetails,
    isDisabledStopOrRestartButton,
    isDisableModifyButton,
    isDisableRecreateButton,
    isDisableRetryDeploymentButton,
    isDisableScaleButton,
    isDisableServiceActionButton,
    isDisableServiceConfigBtn,
    isDisableServicePortingButton,
    isDisableStartButton,
    Option,
    showForExtraLargeScreenColumn,
    showForExtraSmallScreenColumn,
    showForLargeScreenColumn,
    updateBillingModeFilters,
    updateCategoryFilters,
    updateCspFilters,
    updateCustomerServiceNameFilters,
    updateNameFilters,
    updateRegionFilters,
    updateServiceDeploymentStateFilters,
    updateServiceHostingFilters,
    updateServiceIdFilters,
    updateServiceStateFilters,
    updateVersionFilters,
} from './myServiceProps.tsx';
import useGetOrderableServiceDetailsByServiceIdQuery from './query/useGetOrderableServiceDetailsByServiceIdQuery.ts';
import useListDeployedServicesDetailsQuery, {
    getListDeployedServicesDetailsQueryKey,
} from './query/useListDeployedServicesDetailsQuery';
import { SelectMyServicesColumns } from './SelectMyServicesColumns.tsx';
import { TooltipWhenDetailsDisabled } from './TooltipWhenDetailsDisabled.tsx';

function MyServices(): React.JSX.Element {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const location = useLocation();

    // Read URL search parameters
    const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
    const detailsParam = searchParams.get('details') === 'true';

    // redirect from order page
    const serviceIdInQuery = useMemo(() => {
        const serviceId = searchParams.get('serviceId');
        return serviceId ?? null;
    }, [searchParams]);

    // redirect from end user dashboard
    const serviceDeploymentStateInQuery = useMemo(() => {
        const states = searchParams.getAll('serviceDeploymentState');
        return states.length > 0 ? states : null;
    }, [searchParams]);

    const [filters, setFilters] = useState<Record<string, FilterValue | null>>({
        serviceId: serviceIdInQuery ? [serviceIdInQuery] : null,
        customerServiceName: null,
        category: null,
        csp: null,
        name: null,
        version: null,
        serviceHostingType: null,
        billingMode: null,
        region: null,
        serviceDeploymentState: serviceDeploymentStateInQuery,
        serviceState: null,
    });

    const handleFilterChange = (
        _pagination: TablePaginationConfig,
        filters: Record<string, FilterValue | null>,
        _sorter: SorterResult<DeployedService> | SorterResult<DeployedService>[]
    ) => {
        setFilters(filters);
    };

    const [cacheFormVariable] = useOrderFormStore((state) => [state.addDeployVariable]);
    const [clearFormVariables] = useOrderFormStore((state) => [state.clearFormVariables]);

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

    const [isStartRequestSubmitted, setIsStartRequestSubmitted] = useState<boolean>(false);
    const [isStopRequestSubmitted, setIsStopRequestSubmitted] = useState<boolean>(false);
    const [isRestartRequestSubmitted, setIsRestartRequestSubmitted] = useState<boolean>(false);

    const [isDestroyRequestSubmitted, setIsDestroyRequestSubmitted] = useState<boolean>(false);
    const [isPurgeRequestSubmitted, setIsPurgeRequestSubmitted] = useState<boolean>(false);
    const [isRetryDeployRequestSubmitted, setIsRetryDeployRequestSubmitted] = useState<boolean>(false);
    const [isRecreateRequestSubmitted, setIsRecreateRequestSubmitted] = useState<boolean>(false);

    const [isMyServiceDetailsModalOpen, setIsMyServiceDetailsModalOpen] = useState<boolean>(false);
    const [isMyServiceHistoryModalOpen, setIsMyServiceHistoryModalOpen] = useState<boolean>(false);
    const [isMyServiceConfigurationModalOpen, setIsMyServiceConfigurationModalOpen] = useState<boolean>(false);
    const [isServiceActionsModalOpen, setIsServiceActionsModalOpen] = useState<boolean>(false);

    const [isServicePortingModalOpen, setIsServicePortingModalOpen] = useState<boolean>(false);
    const [isModifyModalOpen, setIsModifyModalOpen] = useState<boolean>(false);
    const [isScaleModalOpen, setIsScaleModalOpen] = useState<boolean>(false);
    const [isLocksModalOpen, setIsLocksModalOpen] = useState<boolean>(false);

    const [uniqueRequestId, setUniqueRequestId] = useState<string>(v4());
    const [isColumnSelectorVisible, setIsColumnSelectorVisible] = useState(false);

    const serviceDestroyQuery = useDestroyRequestSubmitQuery();
    const servicePurgeQuery = usePurgeRequestSubmitQuery();
    const redeployFailedDeploymentQuery = useRedeployFailedDeploymentQuery(
        activeRecord ? (activeRecord.serviceHostingType as serviceHostingType) : serviceHostingType.SELF
    );
    const serviceRecreateRequest = useRecreateRequest();

    const serviceStateStartQuery = useServiceStateStartQuery();
    const serviceStateStopQuery = useServiceStateStopQuery();
    const serviceStateRestartQuery = useServiceStateRestartQuery();

    const listDeployedServicesQuery = useListDeployedServicesDetailsQuery();
    const getOrderableServiceDetails = useGetOrderableServiceDetailsByServiceIdQuery(activeRecord?.serviceId);

    const getStartServiceDetailsQuery = useLatestServiceOrderStatusQuery(
        serviceStateStartQuery.data?.orderId ?? '',
        serviceStateStartQuery.isSuccess,
        [orderStatus.SUCCESSFUL, orderStatus.FAILED],
        isStartRequestSubmitted
    );

    const getStopServiceDetailsQuery = useLatestServiceOrderStatusQuery(
        serviceStateStopQuery.data?.orderId ?? '',
        serviceStateStopQuery.isSuccess,
        [orderStatus.SUCCESSFUL, orderStatus.FAILED],
        isStopRequestSubmitted
    );

    const getRestartServiceDetailsQuery = useLatestServiceOrderStatusQuery(
        serviceStateRestartQuery.data?.orderId ?? '',
        serviceStateRestartQuery.isSuccess,
        [orderStatus.SUCCESSFUL, orderStatus.FAILED],
        isRestartRequestSubmitted
    );

    const getDestroyServiceStatusPollingQuery = useLatestServiceOrderStatusQuery(
        serviceDestroyQuery.data?.orderId ?? '',
        serviceDestroyQuery.isSuccess,
        [orderStatus.SUCCESSFUL, orderStatus.FAILED],
        isDestroyRequestSubmitted
    );

    const getReDeployLatestServiceOrderStatusQuery = useLatestServiceOrderStatusQuery(
        redeployFailedDeploymentQuery.data?.orderId ?? '',
        redeployFailedDeploymentQuery.isSuccess,
        [orderStatus.SUCCESSFUL, orderStatus.FAILED],
        isRetryDeployRequestSubmitted
    );

    const getRecreateServiceOrderStatusPollingQuery = useLatestServiceOrderStatusQuery(
        serviceRecreateRequest.data?.orderId,
        serviceRecreateRequest.isSuccess,
        [orderStatus.SUCCESSFUL, orderStatus.FAILED],
        isRecreateRequestSubmitted
    );

    const getPurgeServiceDetailsQuery = usePurgeRequestStatusQuery(
        activeRecord?.serviceId,
        activeRecord ? (activeRecord.serviceHostingType as serviceHostingType) : serviceHostingType.SELF,
        servicePurgeQuery.isSuccess,
        isPurgeRequestSubmitted
    );

    const resetAllRequestStates = useCallback(() => {
        setIsStartRequestSubmitted(false);
        setIsStopRequestSubmitted(false);
        setIsRestartRequestSubmitted(false);
        setIsDestroyRequestSubmitted(false);
        setIsPurgeRequestSubmitted(false);
        setIsRetryDeployRequestSubmitted(false);
        setIsRecreateRequestSubmitted(false);
    }, []);

    const handleMyServiceDetailsOpenModal = useCallback(
        (record: DeployedService) => {
            setActiveRecord(
                record.serviceHostingType === serviceHostingType.SELF
                    ? (record as DeployedServiceDetails)
                    : (record as VendorHostedDeployedServiceDetails)
            );
            resetAllRequestStates();
            setIsMyServiceDetailsModalOpen(true);
        },
        [resetAllRequestStates]
    );

    useEffect(() => {
        void listDeployedServicesQuery.refetch();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        servicePurgeQuery.isError,
        getPurgeServiceDetailsQuery.isError,
        serviceDestroyQuery.isError,
        getDestroyServiceStatusPollingQuery.data?.isOrderCompleted,
        serviceRecreateRequest.isError,
        getRecreateServiceOrderStatusPollingQuery.data?.isOrderCompleted,
        serviceStateStartQuery.isError,
        getStartServiceDetailsQuery.data?.isOrderCompleted,
        serviceStateStopQuery.isError,
        getStopServiceDetailsQuery.data?.isOrderCompleted,
        serviceStateRestartQuery.isError,
        getRestartServiceDetailsQuery.data?.isOrderCompleted,
        redeployFailedDeploymentQuery.isError,
        getReDeployLatestServiceOrderStatusQuery.data?.isOrderCompleted,
    ]);

    if (listDeployedServicesQuery.isSuccess && listDeployedServicesQuery.data.length > 0) {
        serviceIdFilters = updateServiceIdFilters(listDeployedServicesQuery.data);
        versionFilters = updateVersionFilters(listDeployedServicesQuery.data);
        nameFilters = updateNameFilters(listDeployedServicesQuery.data);
        categoryFilters = updateCategoryFilters();
        cspFilters = updateCspFilters();
        serviceDeploymentStateFilters = updateServiceDeploymentStateFilters();
        serviceStateFilters = updateServiceStateFilters();
        customerServiceNameFilters = updateCustomerServiceNameFilters(listDeployedServicesQuery.data);
        serviceHostingTypeFilters = updateServiceHostingFilters();
        serviceBillingModeFilters = updateBillingModeFilters();
        serviceRegionNameFilters = updateRegionFilters(listDeployedServicesQuery.data);
    }

    useEffect(() => {
        // If details param is true, and we have a serviceId in the URL
        if (
            detailsParam &&
            serviceIdInQuery &&
            listDeployedServicesQuery.isSuccess &&
            listDeployedServicesQuery.data.length > 0
        ) {
            // Find the service with the matching ID
            const serviceId = serviceIdInQuery;
            const service = listDeployedServicesQuery.data.find((svc) => svc.serviceId === serviceId);
            // If found, open the details modal
            if (service) {
                handleMyServiceDetailsOpenModal(service);
            }
        }
    }, [
        detailsParam,
        handleMyServiceDetailsOpenModal,
        serviceIdInQuery,
        listDeployedServicesQuery.isSuccess,
        listDeployedServicesQuery.data,
    ]);

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
                                <TooltipWhenDetailsDisabled
                                    serviceProviderContactDetails={
                                        getOrderableServiceDetails.data.serviceProviderContactDetails
                                    }
                                />
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
                        disabled={false} //enabled always irrespective of the state.
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
                                    scale
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
                                disabled={isDisableScaleButton(record, activeRecord)}
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
                                disabled={isDisableModifyButton(record, activeRecord)}
                                type={'link'}
                            >
                                modify parameters
                            </Button>
                        )}
                    </>
                ),
            },
            {
                key: 'servicePorting',
                label: (
                    <>
                        {record.lockConfig?.modifyLocked ? (
                            <Tooltip
                                placement={'left'}
                                style={{ maxWidth: '100%' }}
                                title={'service porting has been locked for this service.'}
                            >
                                <Button
                                    className={myServicesStyles.buttonAsLink}
                                    icon={<CopyOutlined />}
                                    disabled={true}
                                    type={'link'}
                                >
                                    port service
                                </Button>
                                <LockOutlined />
                            </Tooltip>
                        ) : (
                            <Button
                                onClick={() => {
                                    servicePorting(record);
                                }}
                                className={myServicesStyles.buttonAsLink}
                                icon={<CopyOutlined />}
                                disabled={isDisableServicePortingButton(record, activeRecord)}
                                type={'link'}
                            >
                                port service
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
                                  disabled={isDisableRetryDeploymentButton(record)}
                                  type={'link'}
                              >
                                  retry deployment
                              </Button>
                          </Popconfirm>
                      ),
                  }
                : null,
            {
                key: 'recreateService',
                label: (
                    <>
                        {record.lockConfig?.modifyLocked ? (
                            <Tooltip
                                placement={'left'}
                                style={{ maxWidth: '100%' }}
                                title={'recreate has been locked for this service.'}
                            >
                                <Button
                                    className={myServicesStyles.buttonAsLink}
                                    icon={<RedoOutlined />}
                                    disabled={true}
                                    type={'link'}
                                >
                                    recreate
                                </Button>
                                <LockOutlined />
                            </Tooltip>
                        ) : (
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
                                    disabled={isDisableRecreateButton(
                                        record,
                                        activeRecord,
                                        serviceStateStartQuery.isPending,
                                        serviceStateStopQuery.isPending,
                                        serviceStateRestartQuery.isPending
                                    )}
                                    type={'link'}
                                >
                                    recreate
                                </Button>
                            </Popconfirm>
                        )}
                    </>
                ),
            },
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
                                        disabled={isDisableDestroyButton(record, activeRecord)}
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
                        disabled={isDisableStartButton(
                            record,
                            activeRecord,
                            serviceStateStartQuery.isPending,
                            serviceStateStopQuery.isPending,
                            serviceStateRestartQuery.isPending
                        )}
                        type={'link'}
                    >
                        start
                    </Button>
                ),
            },
            {
                key: 'stop',
                label: (
                    <>
                        {record.lockConfig?.modifyLocked ? (
                            <Tooltip
                                placement={'left'}
                                style={{ maxWidth: '100%' }}
                                title={'stop has been locked for this service.'}
                            >
                                <Button
                                    className={myServicesStyles.buttonAsLink}
                                    icon={<PoweroffOutlined />}
                                    disabled={true}
                                    type={'link'}
                                >
                                    stop
                                </Button>
                                <LockOutlined />
                            </Tooltip>
                        ) : (
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
                                    className={myServicesStyles.buttonAsLink}
                                    icon={<PoweroffOutlined />}
                                    disabled={isDisabledStopOrRestartButton(
                                        record,
                                        activeRecord,
                                        serviceStateStartQuery.isPending,
                                        serviceStateStopQuery.isPending,
                                        serviceStateRestartQuery.isPending
                                    )}
                                    type={'link'}
                                >
                                    stop
                                </Button>
                            </Popconfirm>
                        )}
                    </>
                ),
            },
            {
                key: 'restart',
                label: (
                    <>
                        {record.lockConfig?.modifyLocked ? (
                            <Tooltip
                                placement={'left'}
                                style={{ maxWidth: '100%' }}
                                title={'restart has been locked for this service.'}
                            >
                                <Button
                                    className={myServicesStyles.buttonAsLink}
                                    icon={<SyncOutlined />}
                                    disabled={true}
                                    type={'link'}
                                >
                                    restart
                                </Button>
                                <LockOutlined />
                            </Tooltip>
                        ) : (
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
                                    className={myServicesStyles.buttonAsLink}
                                    icon={<SyncOutlined />}
                                    disabled={isDisabledStopOrRestartButton(
                                        record,
                                        activeRecord,
                                        serviceStateStartQuery.isPending,
                                        serviceStateStopQuery.isPending,
                                        serviceStateRestartQuery.isPending
                                    )}
                                    type={'link'}
                                >
                                    restart
                                </Button>
                            </Popconfirm>
                        )}
                    </>
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
                        order history
                    </Button>
                ),
            },
            {
                key: 'configuration',
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
                        configuration
                    </Button>
                ),
            },
            {
                key: 'actions',
                label: (
                    <Button
                        onClick={() => {
                            handleServiceActionsOpenModal(record);
                        }}
                        className={myServicesStyles.buttonAsLink}
                        disabled={isDisableServiceActionButton(record)}
                        icon={<FileTextOutlined />}
                        type={'link'}
                    >
                        actions
                    </Button>
                ),
            },
        ];
    };

    const columns: ColumnsType<DeployedService> = [
        {
            title: 'Id',
            dataIndex: 'serviceId',
            key: 'serviceId',
            filters: serviceIdFilters,
            filterMode: 'tree',
            filterSearch: true,
            filteredValue: filters.serviceId ?? [],
            onFilter: (value: React.Key | boolean, record) => {
                return record.serviceId.startsWith(value.toString());
            },
            width: 100,
            align: 'center',
            render: (value: string) => {
                return <ShowId id={value} />;
            },
        },
        {
            title: 'Name',
            dataIndex: 'customerServiceName',
            key: 'customerServiceName',
            align: 'center',
            filters: customerServiceNameFilters,
            filterMode: 'tree',
            filterSearch: true,
            filteredValue: filters.customerServiceName ?? [],
            onFilter: (value: React.Key | boolean, record) => {
                if (record.customerServiceName !== undefined) {
                    const customerServiceName = record.customerServiceName;
                    return customerServiceName.startsWith(value.toString());
                }
                return false;
            },
            width: 100,
            render: (text) => <div className={myServicesStyles.columnsWidth}>{text}</div>,
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            filters: categoryFilters,
            filterMode: 'tree',
            filterSearch: true,
            filteredValue: filters.category ?? [],
            onFilter: (value: React.Key | boolean, record) => record.category.startsWith(value.toString()),
            align: 'center',
        },
        {
            title: 'Service',
            dataIndex: 'name',
            key: 'name',
            filters: nameFilters,
            filterMode: 'tree',
            filterSearch: true,
            filteredValue: filters.name ?? [],
            onFilter: (value: React.Key | boolean, record) => record.name.startsWith(value.toString()),
            align: 'center',
        },
        {
            title: 'Version',
            dataIndex: 'version',
            key: 'version',
            filters: versionFilters,
            filterMode: 'tree',
            filterSearch: true,
            filteredValue: filters.version ?? [],
            onFilter: (value: React.Key | boolean, record) => record.version.startsWith(value.toString()),
            sorter: (service1, service2) => sortVersionNum(service1.version, service2.version),
            align: 'center',
        },
        {
            title: 'ServiceHostedBy',
            dataIndex: 'serviceHostingType',
            key: 'serviceHostingType',
            filters: serviceHostingTypeFilters,
            filterMode: 'tree',
            filterSearch: true,
            filteredValue: filters.serviceHostingType ?? [],
            onFilter: (value: React.Key | boolean, record) => record.serviceHostingType.startsWith(value.toString()),
            align: 'center',
            render: (serviceHostingType: serviceHostingType) => (
                <DeployedServicesHostingType currentServiceHostingType={serviceHostingType} />
            ),
        },
        {
            title: 'BillingMode',
            dataIndex: 'billingMode',
            key: 'billingMode',
            filters: serviceBillingModeFilters,
            filterMode: 'tree',
            filterSearch: true,
            filteredValue: filters.billingMode ?? [],
            onFilter: (value: React.Key | boolean, record) => record.billingMode.startsWith(value.toString()),
            align: 'center',
            render: (billingMode: billingMode) => <DeployedBillingMode currentBillingMode={billingMode} />,
        },
        {
            title: 'Region',
            dataIndex: 'region',
            key: 'region',
            filters: serviceRegionNameFilters,
            filterMode: 'tree',
            filterSearch: true,
            filteredValue: filters.region ?? [],
            onFilter: (value: React.Key | boolean, record) => record.region.name.startsWith(value.toString()),
            align: 'center',
            render: (region: Region) => <DeployedRegion currentRegion={region} />,
        },
        {
            title: 'Csp',
            dataIndex: 'csp',
            key: 'csp',
            filters: cspFilters,
            filterMode: 'tree',
            filterSearch: true,
            filteredValue: filters.csp ?? [],
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
            key: 'flavor',
            align: 'center',
            width: 150,
            render: (text) => <div className={myServicesStyles.columnsWidth}>{text}</div>,
        },
        {
            title: 'Created On',
            dataIndex: 'createdTime',
            key: 'createdTime',
            defaultSortOrder: 'descend',
            sorter: (serviceVoA, serviceVoB) => {
                const dateA = new Date(serviceVoA.createdTime);
                const dateB = new Date(serviceVoB.createdTime);
                return dateA.getTime() - dateB.getTime();
            },
            align: 'center',
        },
        {
            title: 'ServiceDeploymentState',
            dataIndex: 'serviceDeploymentState',
            key: 'serviceDeploymentState',
            filters: serviceDeploymentStateFilters,
            filterMode: 'tree',
            filterSearch: true,
            filteredValue: filters.serviceDeploymentState ?? [],
            onFilter: (value: React.Key | boolean, record) =>
                record.serviceDeploymentState.startsWith(value.toString()),
            render: (serviceState: serviceDeploymentState) => DeployedServicesStatus(serviceState),
            align: 'center',
        },
        {
            title: 'ServiceState',
            dataIndex: 'serviceState',
            key: 'serviceState',
            align: 'center',
            filters: serviceStateFilters,
            filterMode: 'tree',
            filterSearch: true,
            filteredValue: filters.serviceState ?? [],
            onFilter: (value: React.Key | boolean, record) => record.serviceState.startsWith(value.toString()),
            render: (_text, record) => DeployedServicesRunningStatus(record),
        },
        {
            title: 'Monitor',
            dataIndex: 'monitor',
            key: 'monitor',
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
            key: 'operation',
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

    // show for different screen size
    const screens = useBreakpoint(true, null);
    const getDefaultCols = () => {
        if (!screens) {
            return columns;
        }

        if (screens.xs) {
            return columns
                .filter((col) =>
                    showForExtraSmallScreenColumn.includes((col as ColumnType<DeployedService>).dataIndex as string)
                )
                .map((col) => ({
                    ...col,
                    filteredValue: filters[(col as ColumnType<DeployedService>).dataIndex as string] ?? [],
                }));
        } else if (screens.sm || screens.md || screens.lg) {
            return columns
                .filter((col) =>
                    showForLargeScreenColumn.includes((col as ColumnType<DeployedService>).dataIndex as string)
                )
                .map((col) => ({
                    ...col,
                    filteredValue: filters[(col as ColumnType<DeployedService>).dataIndex as string] ?? [],
                }));
        } else if (screens.xl) {
            return columns
                .filter((col) =>
                    showForExtraLargeScreenColumn.includes((col as ColumnType<DeployedService>).dataIndex as string)
                )
                .map((col) => ({
                    ...col,
                    filteredValue: filters[(col as ColumnType<DeployedService>).dataIndex as string] ?? [],
                }));
        } else {
            return columns.map((col) => ({
                ...col,
                filteredValue: filters[(col as ColumnType<DeployedService>).dataIndex as string] ?? [],
            }));
        }
    };

    const [selectedColumns, setSelectedColumns] = useState<ColumnsType<DeployedService>>([]);
    const [checkedValues, setCheckedValues] = useState<string[]>([]);

    useMemo(() => {
        const defaultCols = getDefaultCols();
        setSelectedColumns(defaultCols);
        setCheckedValues(getDefaultColumns(defaultCols));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [screens, filters]);

    const closeDestroyResultAlert = (isClose: boolean) => {
        if (isClose) {
            setActiveRecord(undefined);
            setIsDestroyRequestSubmitted(false);
            serviceDestroyQuery.reset();
        }
    };

    const closeStartResultAlert = (isClose: boolean) => {
        if (isClose) {
            setActiveRecord(undefined);
            setIsStartRequestSubmitted(false);
            serviceStateStartQuery.reset();
        }
    };

    const closeStopResultAlert = (isClose: boolean) => {
        if (isClose) {
            setActiveRecord(undefined);
            setIsStopRequestSubmitted(false);
            serviceStateStopQuery.reset();
        }
    };

    const closeRestartResultAlert = (isClose: boolean) => {
        if (isClose) {
            setActiveRecord(undefined);
            setIsRestartRequestSubmitted(false);
            serviceStateRestartQuery.reset();
        }
    };

    const closePurgeResultAlert = (isClose: boolean) => {
        if (isClose) {
            setActiveRecord(undefined);
            setIsPurgeRequestSubmitted(false);
            servicePurgeQuery.reset();
        }
    };

    const closeRetryDeployResultAlert = () => {
        setActiveRecord(undefined);
        refreshData();
        setIsRetryDeployRequestSubmitted(false);
        setUniqueRequestId('');
        redeployFailedDeploymentQuery.reset();
    };

    const closeRecreateResultAlert = (isClose: boolean) => {
        if (isClose) {
            setActiveRecord(undefined);
            setIsRecreateRequestSubmitted(false);
            serviceRecreateRequest.reset();
        }
    };

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

    function servicePorting(record: DeployedService): void {
        setActiveRecord(
            record.serviceHostingType === serviceHostingType.SELF
                ? (record as DeployedServiceDetails)
                : (record as VendorHostedDeployedServiceDetails)
        );
        setIsServicePortingModalOpen(true);
        resetAllRequestStates();
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
        resetAllRequestStates();
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
        resetAllRequestStates();
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
        resetAllRequestStates();
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
        record.serviceDeploymentState = serviceDeploymentState.DESTROYING;
    }

    function onMonitor(record: DeployedService): void {
        void navigate('/monitor', {
            state: record,
        });
    }

    function refreshData(): void {
        clearFormVariables();
        setIsPurgeRequestSubmitted(false);
        void listDeployedServicesQuery.refetch();
    }

    const handleMyServiceDetailsModalClose = () => {
        setActiveRecord(undefined);
        setIsMyServiceDetailsModalOpen(false);
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete('details');
        const result = navigate(
            {
                search: newSearchParams.toString(),
            },
            { replace: true }
        );

        // If navigate returns a Promise, handle potential errors
        if (result instanceof Promise) {
            result.catch((error: unknown) => {
                // eslint-disable-next-line no-console
                console.error(error);
            });
        }
    };

    const handleMyServiceHistoryOpenModal = (record: DeployedService) => {
        setActiveRecord(
            record.serviceHostingType === serviceHostingType.SELF
                ? (record as DeployedServiceDetails)
                : (record as VendorHostedDeployedServiceDetails)
        );
        resetAllRequestStates();
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
        resetAllRequestStates();
        setIsMyServiceConfigurationModalOpen(true);
    };

    const handleMyServiceConfigurationModalClose = () => {
        setActiveRecord(undefined);
        setIsMyServiceConfigurationModalOpen(false);
        void queryClient.resetQueries({ queryKey: getCurrentConfigurationQueryKey(activeRecord?.serviceId ?? '') });
    };

    const handleServiceActionsOpenModal = (record: DeployedService) => {
        setActiveRecord(
            record.serviceHostingType === serviceHostingType.SELF
                ? (record as DeployedServiceDetails)
                : (record as VendorHostedDeployedServiceDetails)
        );
        resetAllRequestStates();
        setIsServiceActionsModalOpen(true);
    };

    const handleServiceActionsModalClose = () => {
        setActiveRecord(undefined);
        setIsServiceActionsModalOpen(false);
    };

    const handleCancelServicePortingModel = () => {
        setActiveRecord(undefined);
        clearFormVariables();
        refreshData();
        setIsServicePortingModalOpen(false);
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

    const retryRequest = () => {
        setUniqueRequestId(v4());
        if (activeRecord && activeRecord.serviceId.length > 0) {
            redeployFailedDeploymentQuery.mutate(activeRecord.serviceId);
        }
    };

    const retryRequestForMyServicesTable = () => {
        void queryClient.refetchQueries({
            queryKey: getListDeployedServicesDetailsQueryKey(),
        });
    };

    const handleColumnsSelectAll = () => {
        setCheckedValues(columnOptions.map((option) => option.value));
    };

    const handleColumnsSelectNone = () => {
        setCheckedValues([]);
    };

    const columnOptions: Option[] = columns.map((column) => ({
        label: column.title as string,
        value: (column as ColumnType<DeployedService>).dataIndex as string,
    }));

    const handleColumnChange = (checkedValues: string[]) => {
        setCheckedValues(checkedValues);
    };

    const handleColumnSelectorOpen = () => {
        setCheckedValues(getDefaultColumns(selectedColumns));
        setIsColumnSelectorVisible(true);
    };

    const handleColumnSelectorSubmit = () => {
        setIsColumnSelectorVisible(false);
        if (checkedValues.length > 0) {
            const selectedColumns = columns
                .filter((column) => checkedValues.includes((column as ColumnType<DeployedService>).dataIndex as string))
                .map((col) => ({
                    ...col,
                    filteredValue: filters[(col as ColumnType<DeployedService>).dataIndex as string] ?? [],
                }));

            setSelectedColumns(selectedColumns);
        }
    };

    const handleColumnSelectorClose = () => {
        setIsColumnSelectorVisible(false);
    };

    return (
        <div className={tableStyles.genericTableContainer}>
            {isDestroyRequestSubmitted && activeRecord ? (
                <DestroyServiceStatusAlert
                    key={`${activeRecord.serviceId}-destroy`}
                    deployedService={activeRecord}
                    destroySubmitRequest={serviceDestroyQuery}
                    getDestroyServiceOrderStatusQuery={getDestroyServiceStatusPollingQuery}
                    closeDestroyResultAlert={closeDestroyResultAlert}
                    serviceProviderContactDetails={getOrderableServiceDetails.data?.serviceProviderContactDetails}
                />
            ) : null}
            {isStartRequestSubmitted && activeRecord ? (
                <StartServiceStatusAlert
                    key={`${activeRecord.serviceId}-start`}
                    deployedService={activeRecord}
                    serviceStateStartQuery={serviceStateStartQuery}
                    closeStartResultAlert={closeStartResultAlert}
                    getStartServiceDetailsQuery={getStartServiceDetailsQuery}
                    serviceProviderContactDetails={getOrderableServiceDetails.data?.serviceProviderContactDetails}
                />
            ) : null}
            {isStopRequestSubmitted && activeRecord ? (
                <StopServiceStatusAlert
                    key={`${activeRecord.serviceId}-stop`}
                    deployedService={activeRecord}
                    serviceStateStopQuery={serviceStateStopQuery}
                    closeStopResultAlert={closeStopResultAlert}
                    getStopServiceDetailsQuery={getStopServiceDetailsQuery}
                    serviceProviderContactDetails={getOrderableServiceDetails.data?.serviceProviderContactDetails}
                />
            ) : null}
            {isRestartRequestSubmitted && activeRecord ? (
                <RestartServiceStatusAlert
                    key={`${activeRecord.serviceId}-restart`}
                    deployedService={activeRecord}
                    serviceStateRestartQuery={serviceStateRestartQuery}
                    closeRestartResultAlert={closeRestartResultAlert}
                    getRestartServiceDetailsQuery={getRestartServiceDetailsQuery}
                    serviceProviderContactDetails={getOrderableServiceDetails.data?.serviceProviderContactDetails}
                />
            ) : null}
            {isPurgeRequestSubmitted && activeRecord ? (
                <PurgeServiceStatusAlert
                    key={`${activeRecord.serviceId}-purge`}
                    deployedService={activeRecord}
                    purgeSubmitRequest={servicePurgeQuery}
                    getPurgeServiceDetailsQuery={getPurgeServiceDetailsQuery}
                    closePurgeResultAlert={closePurgeResultAlert}
                    serviceProviderContactDetails={getOrderableServiceDetails.data?.serviceProviderContactDetails}
                />
            ) : null}
            {isRetryDeployRequestSubmitted && activeRecord ? (
                <RetryServiceSubmit
                    key={`${uniqueRequestId}-retry`}
                    currentSelectedService={activeRecord}
                    submitDeploymentRequest={redeployFailedDeploymentQuery}
                    redeployFailedDeploymentQuery={redeployFailedDeploymentQuery}
                    getSubmitLatestServiceOrderStatusQuery={getReDeployLatestServiceOrderStatusQuery}
                    serviceProviderContactDetails={getOrderableServiceDetails.data?.serviceProviderContactDetails}
                    retryRequest={retryRequest}
                    onClose={closeRetryDeployResultAlert}
                />
            ) : null}
            {isRecreateRequestSubmitted && activeRecord ? (
                <RecreateServiceStatusAlert
                    key={`${activeRecord.serviceId}-recreate`}
                    currentSelectedService={activeRecord}
                    recreateRequest={serviceRecreateRequest}
                    recreateServiceOrderStatusPollingQuery={getRecreateServiceOrderStatusPollingQuery}
                    closeRecreateResultAlert={closeRecreateResultAlert}
                    serviceProviderContactDetails={getOrderableServiceDetails.data?.serviceProviderContactDetails}
                />
            ) : null}
            {activeRecord ? (
                <Modal
                    title={
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <ServiceTitle
                                title={activeRecord.name}
                                version={activeRecord.version}
                                icon={getOrderableServiceDetails.data?.icon ?? undefined}
                            />
                            {getOrderableServiceDetails.data ? (
                                <ContactDetailsText
                                    serviceProviderContactDetails={
                                        getOrderableServiceDetails.data.serviceProviderContactDetails
                                    }
                                    showFor={ContactDetailsShowType.Order}
                                />
                            ) : null}
                        </div>
                    }
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
                    title={'Service Orders'}
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
                    width={680}
                    footer={null}
                    open={isMyServiceConfigurationModalOpen}
                    destroyOnHidden={true}
                    onCancel={handleMyServiceConfigurationModalClose}
                >
                    <ServiceConfiguration
                        userOrderableServiceVo={getOrderableServiceDetails.data}
                        deployedService={activeRecord}
                    />
                </Modal>
            ) : null}
            {activeRecord ? (
                <Modal
                    title={'Service Actions'}
                    width={680}
                    footer={null}
                    open={isServiceActionsModalOpen}
                    onCancel={handleServiceActionsModalClose}
                >
                    <CreateServiceActionForm
                        deployedService={activeRecord}
                        userOrderableServiceVo={getOrderableServiceDetails.data}
                    />
                </Modal>
            ) : null}
            {activeRecord ? (
                <Modal
                    key={`${activeRecord.serviceId}-servicePorting`}
                    open={isServicePortingModalOpen}
                    title={
                        <ServiceTitle
                            title={activeRecord.name}
                            version={activeRecord.version}
                            icon={getOrderableServiceDetails.data?.icon ?? undefined}
                        />
                    }
                    closable={true}
                    maskClosable={false}
                    destroyOnHidden={true}
                    footer={null}
                    onCancel={handleCancelServicePortingModel}
                    width={1600}
                    mask={true}
                >
                    <ServicePorting currentSelectedService={activeRecord} />
                </Modal>
            ) : null}

            {activeRecord ? (
                <Modal
                    open={isLocksModalOpen}
                    title={<LocksTitle />}
                    closable={true}
                    maskClosable={false}
                    destroyOnHidden={true}
                    footer={null}
                    onCancel={handleCancelLocksModel}
                    width={400}
                    mask={true}
                >
                    <Locks currentSelectedService={activeRecord} />
                </Modal>
            ) : null}

            {activeRecord ? (
                <ScaleModal
                    handleCancelScaleModel={handleCancelScaleModel}
                    isScaleModalOpen={isScaleModalOpen}
                    activeRecord={activeRecord}
                    icon={getOrderableServiceDetails.data?.icon ?? ''}
                />
            ) : null}

            {activeRecord ? (
                <Modal
                    open={isModifyModalOpen}
                    title={
                        <ServiceTitle
                            title={activeRecord.name}
                            version={activeRecord.version}
                            icon={getOrderableServiceDetails.data?.icon ?? undefined}
                        />
                    }
                    closable={true}
                    maskClosable={false}
                    destroyOnHidden={true}
                    footer={null}
                    onCancel={handleCancelModifyModel}
                    width={1400}
                    mask={true}
                >
                    <Modify currentSelectedService={activeRecord} />
                </Modal>
            ) : null}

            <Modal
                title={'Select Columns'}
                open={isColumnSelectorVisible}
                onCancel={handleColumnSelectorClose}
                onOk={handleColumnSelectorSubmit}
                width={800}
                destroyOnHidden={true}
                okButtonProps={{ disabled: checkedValues.length === 0 }}
            >
                <SelectMyServicesColumns
                    checkedValues={checkedValues}
                    columnOptions={columnOptions}
                    handleColumnChange={handleColumnChange}
                    handleColumnsSelectAll={handleColumnsSelectAll}
                    handleColumnsSelectNone={handleColumnsSelectNone}
                />
            </Modal>

            <div className={myServicesStyles.refreshBtnContainer}>
                <div className={myServicesStyles.refreshBtnClass}>
                    <Button
                        disabled={activeRecord !== undefined}
                        type='primary'
                        icon={<SyncOutlined />}
                        onClick={() => {
                            refreshData();
                        }}
                        block={false}
                    >
                        Refresh
                    </Button>
                </div>
                <div className={myServicesStyles.selectColumnsClass}>
                    {' '}
                    <Button type='primary' icon={<SettingOutlined />} onClick={handleColumnSelectorOpen} block={false}>
                        Select Columns
                    </Button>
                </div>
            </div>
            {listDeployedServicesQuery.isError ? (
                <>
                    <RetryPrompt
                        error={listDeployedServicesQuery.error}
                        retryRequest={retryRequestForMyServicesTable}
                        errorMessage={serviceDetailsErrorText}
                    />
                </>
            ) : (
                <></>
            )}

            <Row>
                <div className={myServicesStyles.serviceInstanceList}>
                    <Table
                        columns={selectedColumns}
                        dataSource={listDeployedServicesQuery.data}
                        loading={listDeployedServicesQuery.isPending || listDeployedServicesQuery.isRefetching}
                        rowKey={'serviceId'}
                        onChange={handleFilterChange}
                        scroll={{ x: 'max-content' }}
                    />
                </div>
            </Row>
        </div>
    );
}

export default MyServices;
