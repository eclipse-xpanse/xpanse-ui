/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useServiceDestroyDetailsPollingQuery } from '../orderStatus/useServiceDetailsPollingQuery';
import { ServiceDetailVo, ServiceVo } from '../../../../xpanse-api/generated';
import { useStopwatch } from 'react-timer-hook';
import React, { useEffect, useState } from 'react';
import { OrderSubmitResult } from '../orderStatus/OrderSubmitResult';
import { MigrationStatus, OperationType } from '../formElements/CommonTypes';
import { OrderSubmitFailed } from '../orderStatus/OrderSubmitFailed';
import { ProcessingStatus } from '../orderStatus/ProcessingStatus';
import { useDestroyRequestSubmitQuery } from '../destroy/useDestroyRequestSubmitQuery';

export const MigrateServiceStatusPolling = ({
    currentSelectedService,
    deployData,
    isDeploySuccess,
    isDeployError,
    deployError,
    isDeployLoading,
    setIsMigrating,
    setRequestSubmitted,
    setIsPreviousDisabled,
    getCurrentMigrationStepStatus,
}: {
    currentSelectedService: ServiceVo | undefined;
    deployData: string | undefined;
    isDeploySuccess: boolean;
    isDeployError: boolean;
    deployError: Error | undefined;
    isDeployLoading: boolean;
    setIsMigrating: (arg: boolean) => void;
    setRequestSubmitted: (arg: boolean) => void;
    setIsPreviousDisabled: (arg: boolean) => void;
    getCurrentMigrationStepStatus: (srg: MigrationStatus) => void;
}): React.JSX.Element => {
    const [deployUuid, setDeployUuid] = useState<string>('');
    const [destroyUuid, setDestroyUuid] = useState<string>('');
    const [isDeployDetailsStartQuerying, setIsDeployDetailsStartQuerying] = useState<boolean>(false);
    const [isDestroyDetailsStartQuerying, setIsDestroyDetailsStartQuerying] = useState<boolean>(false);
    const [isDestroyLoading, setIsDestroyLoading] = useState<boolean>(false);
    const [isDestroySuccess, setIsDestroySuccess] = useState<boolean>(false);
    const [isDestroyError, setIsDestroyError] = useState<boolean>(false);
    const [destroyError, setDestroyError] = useState<Error | undefined>(undefined);
    const [deployStatus, setDeployStatus] = useState<ServiceDetailVo.serviceDeploymentState | undefined>(undefined);
    const [migrateSuccessResponse, setMigrateSuccessResponse] = useState<ServiceDetailVo | undefined>(undefined);
    const stopWatch = useStopwatch({
        autoStart: true,
    });

    const getServiceDetailsByIdQuery = useServiceDestroyDetailsPollingQuery(deployUuid, isDeployDetailsStartQuerying, [
        ServiceDetailVo.serviceDeploymentState.DEPLOYMENT_SUCCESSFUL,
        ServiceDetailVo.serviceDeploymentState.DEPLOYMENT_FAILED,
    ]);

    const getDestroyedServiceDetailsByIdQuery = useServiceDestroyDetailsPollingQuery(
        destroyUuid,
        isDestroyDetailsStartQuerying,
        [
            ServiceDetailVo.serviceDeploymentState.DESTROY_SUCCESSFUL,
            ServiceDetailVo.serviceDeploymentState.DESTROY_FAILED,
        ]
    );

    const destroyServiceRequest = useDestroyRequestSubmitQuery();

    //deploy
    useEffect(() => {
        if (isDeployError) {
            setIsMigrating(false);
            setRequestSubmitted(false);
            setIsPreviousDisabled(false);
            getCurrentMigrationStepStatus(MigrationStatus.Failed);
            setDeployStatus(ServiceDetailVo.serviceDeploymentState.DEPLOYMENT_FAILED);
        }
    }, [isDeployError, setIsMigrating, setRequestSubmitted, setIsPreviousDisabled, getCurrentMigrationStepStatus]);

    useEffect(() => {
        if (isDeployLoading) {
            getCurrentMigrationStepStatus(MigrationStatus.Processing);
            setDeployStatus(ServiceDetailVo.serviceDeploymentState.DEPLOYING);
        }
    }, [isDeployLoading, getCurrentMigrationStepStatus]);

    useEffect(() => {
        if (isDeploySuccess && deployData !== undefined && deployData.length > 0) {
            setDeployUuid(deployData);
            setIsDeployDetailsStartQuerying(true);
        }
    }, [isDeploySuccess, deployData]);

    useEffect(() => {
        if (isDeploySuccess && getServiceDetailsByIdQuery.isError) {
            setIsMigrating(false);
            setRequestSubmitted(false);
            setIsPreviousDisabled(false);
            setIsDeployDetailsStartQuerying(false);
            getCurrentMigrationStepStatus(MigrationStatus.Failed);
            setDeployStatus(ServiceDetailVo.serviceDeploymentState.DEPLOYMENT_FAILED);
        }
    }, [
        isDeploySuccess,
        getServiceDetailsByIdQuery.isError,
        setIsMigrating,
        setIsPreviousDisabled,
        setRequestSubmitted,
        getCurrentMigrationStepStatus,
    ]);

    useEffect(() => {
        if (getServiceDetailsByIdQuery.isSuccess) {
            const deployDetailData: ServiceDetailVo = getServiceDetailsByIdQuery.data;
            if (
                deployDetailData.serviceDeploymentState === ServiceDetailVo.serviceDeploymentState.DEPLOYMENT_SUCCESSFUL
            ) {
                setIsMigrating(true);
                setRequestSubmitted(true);
                setIsPreviousDisabled(true);
                setMigrateSuccessResponse(getServiceDetailsByIdQuery.data);
                setIsDeployDetailsStartQuerying(false);
                setDeployStatus(ServiceDetailVo.serviceDeploymentState.DEPLOYMENT_SUCCESSFUL);
            } else if (
                deployDetailData.serviceDeploymentState === ServiceDetailVo.serviceDeploymentState.DEPLOYMENT_FAILED
            ) {
                setIsMigrating(false);
                setRequestSubmitted(false);
                setIsPreviousDisabled(false);
                setIsDeployDetailsStartQuerying(false);
                getCurrentMigrationStepStatus(MigrationStatus.Failed);
                setDeployStatus(ServiceDetailVo.serviceDeploymentState.DEPLOYMENT_FAILED);
            }
        }
    }, [
        getServiceDetailsByIdQuery.isSuccess,
        getServiceDetailsByIdQuery.data,
        setIsMigrating,
        setRequestSubmitted,
        setIsPreviousDisabled,
        currentSelectedService,
        getCurrentMigrationStepStatus,
    ]);

    useEffect(() => {
        if (
            currentSelectedService !== undefined &&
            isDeploySuccess &&
            deployStatus === ServiceDetailVo.serviceDeploymentState.DEPLOYMENT_SUCCESSFUL
        ) {
            setDestroyUuid(currentSelectedService.id);
        }
    }, [currentSelectedService, isDeploySuccess, deployStatus]);

    useEffect(() => {
        if (destroyUuid.length > 0) {
            destroyServiceRequest.mutate(destroyUuid);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [destroyUuid]);

    //destroy
    useEffect(() => {
        if (destroyServiceRequest.isError && destroyServiceRequest.error) {
            setIsDestroyError(destroyServiceRequest.isError);
            setDestroyError(destroyServiceRequest.error as Error);
            setIsMigrating(false);
            setRequestSubmitted(false);
            setIsPreviousDisabled(false);
            getCurrentMigrationStepStatus(MigrationStatus.Failed);
        }
    }, [
        destroyServiceRequest.isError,
        destroyServiceRequest.error,
        setIsMigrating,
        setRequestSubmitted,
        setIsPreviousDisabled,
        getCurrentMigrationStepStatus,
    ]);

    useEffect(() => {
        if (destroyServiceRequest.isLoading) {
            setIsDestroyLoading(true);
        }
    }, [destroyServiceRequest.isLoading]);

    useEffect(() => {
        if (destroyServiceRequest.isSuccess) {
            setIsDestroyLoading(false);
            setIsDestroySuccess(true);
            setIsDestroyDetailsStartQuerying(true);
        }
    }, [destroyServiceRequest.isSuccess]);

    useEffect(() => {
        if (getDestroyedServiceDetailsByIdQuery.isError) {
            setIsDestroyLoading(false);
            setIsMigrating(false);
            setRequestSubmitted(false);
            setIsPreviousDisabled(false);
            setIsDestroyDetailsStartQuerying(false);
            getCurrentMigrationStepStatus(MigrationStatus.Failed);
        }
    }, [
        isDestroySuccess,
        getDestroyedServiceDetailsByIdQuery.isError,
        setIsMigrating,
        setIsPreviousDisabled,
        setRequestSubmitted,
        getCurrentMigrationStepStatus,
    ]);

    useEffect(() => {
        if (isDestroySuccess && getDestroyedServiceDetailsByIdQuery.isSuccess) {
            const destroyDetailData: ServiceDetailVo = getDestroyedServiceDetailsByIdQuery.data;
            if (
                destroyDetailData.serviceDeploymentState === ServiceDetailVo.serviceDeploymentState.DESTROY_SUCCESSFUL
            ) {
                setIsMigrating(true);
                setRequestSubmitted(true);
                setIsPreviousDisabled(true);
                setIsDestroyLoading(false);
                setIsDestroyDetailsStartQuerying(false);
                getCurrentMigrationStepStatus(MigrationStatus.Finished);
            } else if (
                destroyDetailData.serviceDeploymentState === ServiceDetailVo.serviceDeploymentState.DESTROY_FAILED
            ) {
                setIsMigrating(false);
                setRequestSubmitted(false);
                setIsPreviousDisabled(false);
                setIsDestroyLoading(false);
                setIsDestroyDetailsStartQuerying(false);
                getCurrentMigrationStepStatus(MigrationStatus.Failed);
            }
        }
    }, [
        isDestroySuccess,
        getDestroyedServiceDetailsByIdQuery.isSuccess,
        getDestroyedServiceDetailsByIdQuery.data,
        setIsMigrating,
        setRequestSubmitted,
        setIsPreviousDisabled,
        getCurrentMigrationStepStatus,
    ]);

    if (isDeployLoading) {
        return OrderSubmitResult(
            'Request submission in-progress',
            '-',
            'success',
            ServiceDetailVo.serviceDeploymentState.DEPLOYING,
            stopWatch,
            OperationType.Migrate
        );
    } else if (isDeployError && deployError) {
        return OrderSubmitFailed(
            deployError,
            ServiceDetailVo.serviceDeploymentState.DEPLOYMENT_FAILED,
            stopWatch,
            OperationType.Migrate
        );
    } else if (deployUuid.length > 0 && isDeploySuccess) {
        if (deployUuid.length > 0 && getServiceDetailsByIdQuery.isError) {
            return OrderSubmitResult(
                'Migrate status polling failed. Please visit MyServices page to check the status of the request.',
                deployUuid,
                'error',
                ServiceDetailVo.serviceDeploymentState.DEPLOYMENT_FAILED,
                stopWatch,
                OperationType.Migrate
            );
        } else if (deployUuid.length > 0 && getServiceDetailsByIdQuery.isLoading) {
            return OrderSubmitResult(
                'Request accepted',
                deployUuid,
                'success',
                ServiceDetailVo.serviceDeploymentState.DEPLOYING,
                stopWatch,
                OperationType.Migrate
            );
        } else if (deployUuid.length > 0 && getServiceDetailsByIdQuery.isSuccess) {
            if (
                getServiceDetailsByIdQuery.data.serviceDeploymentState ===
                ServiceDetailVo.serviceDeploymentState.DEPLOYING
            ) {
                return OrderSubmitResult(
                    'Migrating, Please wait...',
                    deployUuid,
                    'success',
                    getServiceDetailsByIdQuery.data.serviceDeploymentState,
                    stopWatch,
                    OperationType.Migrate
                );
            } else if (
                getServiceDetailsByIdQuery.data.serviceDeploymentState ===
                ServiceDetailVo.serviceDeploymentState.DEPLOYMENT_FAILED
            ) {
                return OrderSubmitResult(
                    ProcessingStatus(getServiceDetailsByIdQuery.data, OperationType.Migrate),
                    deployUuid,
                    'error',
                    getServiceDetailsByIdQuery.data.serviceDeploymentState,
                    stopWatch,
                    OperationType.Migrate
                );
            } else if (
                getServiceDetailsByIdQuery.data.serviceDeploymentState ===
                ServiceDetailVo.serviceDeploymentState.DEPLOYMENT_SUCCESSFUL
            ) {
                if (destroyUuid.length > 0 && isDestroyLoading) {
                    if (isDestroyError && destroyError) {
                        return OrderSubmitFailed(
                            destroyError,
                            ServiceDetailVo.serviceDeploymentState.DESTROY_FAILED,
                            stopWatch,
                            OperationType.Migrate
                        );
                    }

                    if (destroyUuid.length > 0 && isDestroySuccess) {
                        if (destroyUuid.length > 0 && getDestroyedServiceDetailsByIdQuery.isLoading) {
                            return OrderSubmitResult(
                                'Migrating, Please wait...',
                                destroyUuid,
                                'success',
                                ServiceDetailVo.serviceDeploymentState.DESTROYING,
                                stopWatch,
                                OperationType.Migrate
                            );
                        } else if (destroyUuid.length > 0 && getDestroyedServiceDetailsByIdQuery.isError) {
                            return OrderSubmitResult(
                                'Migrate status polling failed. Please visit MyServices page to check the status of the request.',
                                destroyUuid,
                                'error',
                                ServiceDetailVo.serviceDeploymentState.DESTROY_FAILED,
                                stopWatch,
                                OperationType.Migrate
                            );
                        } else if (destroyUuid.length > 0 && getDestroyedServiceDetailsByIdQuery.isSuccess) {
                            if (
                                getDestroyedServiceDetailsByIdQuery.data.serviceDeploymentState ===
                                ServiceDetailVo.serviceDeploymentState.DESTROYING
                            ) {
                                return OrderSubmitResult(
                                    'Migrating, Please wait...',
                                    destroyUuid,
                                    'success',
                                    ServiceDetailVo.serviceDeploymentState.DESTROYING,
                                    stopWatch,
                                    OperationType.Migrate
                                );
                            } else if (
                                getDestroyedServiceDetailsByIdQuery.data.serviceDeploymentState ===
                                ServiceDetailVo.serviceDeploymentState.DESTROY_SUCCESSFUL
                            ) {
                                if (migrateSuccessResponse !== undefined) {
                                    return OrderSubmitResult(
                                        ProcessingStatus(migrateSuccessResponse, OperationType.Migrate),
                                        deployUuid,
                                        'success',
                                        getDestroyedServiceDetailsByIdQuery.data.serviceDeploymentState,
                                        stopWatch,
                                        OperationType.Migrate
                                    );
                                }
                            } else if (
                                getDestroyedServiceDetailsByIdQuery.data.serviceDeploymentState ===
                                ServiceDetailVo.serviceDeploymentState.DESTROY_FAILED
                            ) {
                                return OrderSubmitResult(
                                    ProcessingStatus(getDestroyedServiceDetailsByIdQuery.data, OperationType.Migrate),
                                    destroyUuid,
                                    'error',
                                    getDestroyedServiceDetailsByIdQuery.data.serviceDeploymentState,
                                    stopWatch,
                                    OperationType.Migrate
                                );
                            }
                            return OrderSubmitResult(
                                'Migrating, Please wait...',
                                destroyUuid,
                                'success',
                                ServiceDetailVo.serviceDeploymentState.DESTROYING,
                                stopWatch,
                                OperationType.Migrate
                            );
                        }
                        return OrderSubmitResult(
                            'Migrating, Please wait...',
                            destroyUuid,
                            'success',
                            ServiceDetailVo.serviceDeploymentState.DESTROYING,
                            stopWatch,
                            OperationType.Migrate
                        );
                    }
                    return OrderSubmitResult(
                        'Migrating, Please wait...',
                        destroyUuid,
                        'success',
                        ServiceDetailVo.serviceDeploymentState.DESTROYING,
                        stopWatch,
                        OperationType.Migrate
                    );
                } else if (isDestroyError && destroyError) {
                    return OrderSubmitFailed(
                        destroyError,
                        ServiceDetailVo.serviceDeploymentState.DESTROY_FAILED,
                        stopWatch,
                        OperationType.Migrate
                    );
                } else if (destroyUuid.length > 0 && isDestroySuccess) {
                    if (destroyUuid.length > 0 && getDestroyedServiceDetailsByIdQuery.isLoading) {
                        return OrderSubmitResult(
                            'Migrating, Please wait...',
                            destroyUuid,
                            'success',
                            ServiceDetailVo.serviceDeploymentState.DESTROYING,
                            stopWatch,
                            OperationType.Migrate
                        );
                    } else if (destroyUuid.length > 0 && getDestroyedServiceDetailsByIdQuery.isError) {
                        return OrderSubmitResult(
                            'Migrate status polling failed. Please visit MyServices page to check the status of the request.',
                            destroyUuid,
                            'error',
                            ServiceDetailVo.serviceDeploymentState.DESTROY_FAILED,
                            stopWatch,
                            OperationType.Migrate
                        );
                    } else if (destroyUuid.length > 0 && getDestroyedServiceDetailsByIdQuery.isSuccess) {
                        if (
                            getDestroyedServiceDetailsByIdQuery.data.serviceDeploymentState ===
                            ServiceDetailVo.serviceDeploymentState.DESTROYING
                        ) {
                            return OrderSubmitResult(
                                'Migrating, Please wait...',
                                destroyUuid,
                                'success',
                                ServiceDetailVo.serviceDeploymentState.DESTROYING,
                                stopWatch,
                                OperationType.Migrate
                            );
                        } else if (
                            getDestroyedServiceDetailsByIdQuery.data.serviceDeploymentState ===
                            ServiceDetailVo.serviceDeploymentState.DESTROY_SUCCESSFUL
                        ) {
                            if (migrateSuccessResponse !== undefined) {
                                return OrderSubmitResult(
                                    ProcessingStatus(migrateSuccessResponse, OperationType.Migrate),
                                    deployUuid,
                                    'success',
                                    getDestroyedServiceDetailsByIdQuery.data.serviceDeploymentState,
                                    stopWatch,
                                    OperationType.Migrate
                                );
                            }
                        } else if (
                            getDestroyedServiceDetailsByIdQuery.data.serviceDeploymentState ===
                            ServiceDetailVo.serviceDeploymentState.DESTROY_FAILED
                        ) {
                            return OrderSubmitResult(
                                ProcessingStatus(getDestroyedServiceDetailsByIdQuery.data, OperationType.Migrate),
                                destroyUuid,
                                'error',
                                getDestroyedServiceDetailsByIdQuery.data.serviceDeploymentState,
                                stopWatch,
                                OperationType.Migrate
                            );
                        }
                        return OrderSubmitResult(
                            'Migrating, Please wait...',
                            destroyUuid,
                            'success',
                            ServiceDetailVo.serviceDeploymentState.DESTROYING,
                            stopWatch,
                            OperationType.Migrate
                        );
                    }
                    return OrderSubmitResult(
                        'Migrating, Please wait...',
                        destroyUuid,
                        'success',
                        ServiceDetailVo.serviceDeploymentState.DESTROYING,
                        stopWatch,
                        OperationType.Migrate
                    );
                }
                return OrderSubmitResult(
                    'Migrating, Please wait...',
                    deployUuid,
                    'success',
                    ServiceDetailVo.serviceDeploymentState.DEPLOYING,
                    stopWatch,
                    OperationType.Migrate
                );
            }
            return OrderSubmitResult(
                'Migrating, Please wait...',
                deployUuid,
                'success',
                ServiceDetailVo.serviceDeploymentState.DEPLOYING,
                stopWatch,
                OperationType.Migrate
            );
        }
        return OrderSubmitResult(
            'Migrating, Please wait...',
            deployUuid,
            'success',
            ServiceDetailVo.serviceDeploymentState.DEPLOYING,
            stopWatch,
            OperationType.Migrate
        );
    }

    return <></>;
};
