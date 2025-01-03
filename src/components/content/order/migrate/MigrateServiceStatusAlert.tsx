/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import React, { useMemo } from 'react';
import { useStopwatch } from 'react-timer-hook';
import {
    DeployedServiceDetails,
    ErrorResponse,
    MigrateRequest,
    serviceHostingType,
    ServiceOrder,
    ServiceOrderStatusUpdate,
    ServiceProviderContactDetails,
    taskStatus,
    VendorHostedDeployedServiceDetails,
} from '../../../../xpanse-api/generated';
import { convertStringArrayToUnorderedList } from '../../../utils/generateUnorderedList';
import { isHandleKnownErrorResponse } from '../../common/error/isHandleKnownErrorResponse.ts';
import { MigrationOrderSubmitResult } from './MigrationOrderSubmitResult';
import { MigrationProcessingStatus } from './MigrationProcessingStatus.tsx';

function MigrateServiceStatusAlert({
    selectServiceHostingType,
    migrateServiceRequest,
    deployedServiceDetails,
    oldDeployedServiceDetails,
    getMigrateLatestServiceOrderStatusQuery,
    serviceProviderContactDetails,
    getMigrateModalClosableStatus,
}: {
    selectServiceHostingType: serviceHostingType;
    migrateServiceRequest: UseMutationResult<ServiceOrder, Error, MigrateRequest>;
    deployedServiceDetails: DeployedServiceDetails | VendorHostedDeployedServiceDetails | undefined;
    oldDeployedServiceDetails: DeployedServiceDetails | VendorHostedDeployedServiceDetails | undefined;
    getMigrateLatestServiceOrderStatusQuery: UseQueryResult<ServiceOrderStatusUpdate>;
    serviceProviderContactDetails: ServiceProviderContactDetails | undefined;
    getMigrateModalClosableStatus: (arg: boolean) => void;
}): React.JSX.Element {
    const stopWatch = useStopwatch({
        autoStart: true,
    });

    const msg = useMemo(() => {
        if (migrateServiceRequest.isPending) {
            getMigrateModalClosableStatus(false);
            return 'Migrate request submission in-progress';
        } else if (migrateServiceRequest.isError) {
            if (isHandleKnownErrorResponse(migrateServiceRequest.error)) {
                getMigrateModalClosableStatus(true);
                const response: ErrorResponse = migrateServiceRequest.error.body;
                return getOrderSubmissionFailedDisplay(response.errorType, response.details);
            } else {
                getMigrateModalClosableStatus(true);
                return getOrderSubmissionFailedDisplay(migrateServiceRequest.error.name, [
                    migrateServiceRequest.error.message,
                ]);
            }
        } else if (migrateServiceRequest.isSuccess) {
            if (
                getMigrateLatestServiceOrderStatusQuery.isSuccess &&
                (getMigrateLatestServiceOrderStatusQuery.data.taskStatus.toString() ===
                    taskStatus.SUCCESSFUL.toString() ||
                    getMigrateLatestServiceOrderStatusQuery.data.taskStatus.toString() === taskStatus.FAILED.toString())
            ) {
                getMigrateModalClosableStatus(true);
                return (
                    <MigrationProcessingStatus
                        deployedResponse={deployedServiceDetails}
                        destroyedResponse={oldDeployedServiceDetails}
                    />
                );
            } else if (getMigrateLatestServiceOrderStatusQuery.isError) {
                if (selectServiceHostingType === serviceHostingType.SERVICE_VENDOR) {
                    getMigrateModalClosableStatus(true);
                    return 'Migrate status polling failed. Please visit MyServices page to check the status of the request and contact service vendor for error details.';
                } else {
                    getMigrateModalClosableStatus(true);
                    return 'Migrate status polling failed. Please visit MyServices page to check the status of the request';
                }
            } else if (
                getMigrateLatestServiceOrderStatusQuery.isPending ||
                getMigrateLatestServiceOrderStatusQuery.data.taskStatus.toString() === taskStatus.IN_PROGRESS.toString()
            ) {
                getMigrateModalClosableStatus(false);
                return 'Migrating, Please wait...';
            }
        }
    }, [
        selectServiceHostingType,
        deployedServiceDetails,
        oldDeployedServiceDetails,
        migrateServiceRequest,
        getMigrateLatestServiceOrderStatusQuery,
        getMigrateModalClosableStatus,
    ]);

    const alertType = useMemo(() => {
        if (migrateServiceRequest.isPending) {
            return 'success';
        } else if (migrateServiceRequest.isError || getMigrateLatestServiceOrderStatusQuery.isError) {
            if (stopWatch.isRunning) {
                stopWatch.pause();
            }
            return 'error';
        } else if (migrateServiceRequest.isSuccess) {
            if (
                getMigrateLatestServiceOrderStatusQuery.isSuccess &&
                getMigrateLatestServiceOrderStatusQuery.data.taskStatus.toString() === taskStatus.FAILED.toString()
            ) {
                if (stopWatch.isRunning) {
                    stopWatch.pause();
                }
                return 'error';
            } else if (
                getMigrateLatestServiceOrderStatusQuery.isSuccess &&
                getMigrateLatestServiceOrderStatusQuery.data.taskStatus.toString() === taskStatus.SUCCESSFUL.toString()
            ) {
                if (stopWatch.isRunning) {
                    stopWatch.pause();
                }
                return 'success';
            } else if (
                getMigrateLatestServiceOrderStatusQuery.isPending ||
                getMigrateLatestServiceOrderStatusQuery.data.taskStatus.toString() === taskStatus.IN_PROGRESS.toString()
            ) {
                return 'success';
            }
        }
        return 'success';
    }, [stopWatch, migrateServiceRequest, getMigrateLatestServiceOrderStatusQuery]);

    function getOrderSubmissionFailedDisplay(errorType: string, reasons: string[]) {
        return (
            <div>
                <span>{errorType.length > 0 ? errorType : 'Service deployment request failed.'}</span>
                <div>{convertStringArrayToUnorderedList(reasons)}</div>
            </div>
        );
    }

    return (
        <MigrationOrderSubmitResult
            msg={msg ?? ''}
            uuid={migrateServiceRequest.data?.serviceId ?? '-'}
            type={alertType}
            stopWatch={stopWatch}
            contactServiceDetails={alertType !== 'success' ? serviceProviderContactDetails : undefined}
        />
    );
}

export default MigrateServiceStatusAlert;
