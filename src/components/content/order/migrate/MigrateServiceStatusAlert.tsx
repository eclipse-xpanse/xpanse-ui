/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React, { useMemo } from 'react';
import { useStopwatch } from 'react-timer-hook';
import {
    ApiError,
    DeployedServiceDetails,
    GetLatestServiceOrderStatusResponse,
    Response,
    ServiceOrder,
    ServiceProviderContactDetails,
    taskStatus,
    VendorHostedDeployedServiceDetails,
} from '../../../../xpanse-api/generated';
import { convertStringArrayToUnorderedList } from '../../../utils/generateUnorderedList';
import { MigrationOrderSubmitResult } from './MigrationOrderSubmitResult';
import { MigrationProcessingStatus } from './MigrationProcessingStatus.tsx';

function MigrateServiceStatusAlert({
    migrateRequestError,
    migrateRequestData,
    deployedServiceDetails,
    oldDeployedServiceDetails,
    serviceProviderContactDetails,
    isPollingError,
    migrationDetails,
}: {
    migrateRequestError: Error | null;
    migrateRequestData: ServiceOrder | undefined;
    deployedServiceDetails: DeployedServiceDetails | VendorHostedDeployedServiceDetails | undefined;
    oldDeployedServiceDetails: DeployedServiceDetails | VendorHostedDeployedServiceDetails | undefined;
    serviceProviderContactDetails: ServiceProviderContactDetails | undefined;
    isPollingError: boolean;
    migrationDetails: GetLatestServiceOrderStatusResponse | undefined;
}): React.JSX.Element {
    const stopWatch = useStopwatch({
        autoStart: true,
    });

    const msg = useMemo(() => {
        if (migrateRequestError) {
            if (
                migrateRequestError instanceof ApiError &&
                migrateRequestError.body &&
                typeof migrateRequestError.body === 'object' &&
                'details' in migrateRequestError.body
            ) {
                const response: Response = migrateRequestError.body as Response;
                return getOrderSubmissionFailedDisplay(response.details);
            } else {
                return getOrderSubmissionFailedDisplay([migrateRequestError.message]);
            }
        } else if (isPollingError) {
            return 'Migration status polling failed. Please visit MyServices page to check the status of the request.';
        } else if (migrationDetails) {
            if (migrationDetails.isOrderCompleted) {
                return (
                    <MigrationProcessingStatus
                        deployedResponse={deployedServiceDetails}
                        destroyedResponse={oldDeployedServiceDetails}
                    />
                );
            } else {
                return 'Migrating... Please wait...';
            }
        }
        return 'Migrate request submission in-progress';
    }, [deployedServiceDetails, migrationDetails, isPollingError, migrateRequestError, oldDeployedServiceDetails]);

    const alertType = useMemo(() => {
        if (isPollingError || migrateRequestError) {
            return 'error';
        }
        if (migrationDetails) {
            if (migrationDetails.taskStatus === taskStatus.FAILED) {
                return 'error';
            }
        }
        return 'success';
    }, [migrationDetails, isPollingError, migrateRequestError]);

    if (isPollingError || migrateRequestError || migrationDetails?.isOrderCompleted) {
        if (stopWatch.isRunning) {
            stopWatch.pause();
        }
    }

    function getOrderSubmissionFailedDisplay(reasons: string[]) {
        return (
            <div>
                <span>{'Service deployment request failed.'}</span>
                <div>{convertStringArrayToUnorderedList(reasons)}</div>
            </div>
        );
    }

    if (migrationDetails) {
        if (migrationDetails.taskStatus === taskStatus.FAILED) {
            if (stopWatch.isRunning) {
                stopWatch.pause();
            }
        }
    }

    return (
        <MigrationOrderSubmitResult
            msg={msg}
            uuid={migrateRequestData?.serviceId ?? '-'}
            type={alertType}
            stopWatch={stopWatch}
            contactServiceDetails={alertType !== 'success' ? serviceProviderContactDetails : undefined}
        />
    );
}

export default MigrateServiceStatusAlert;
