/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import {
    ApiError,
    DeployedServiceDetails,
    Response,
    ServiceMigrationDetails,
    ServiceProviderContactDetails,
} from '../../../../xpanse-api/generated';
import { useStopwatch } from 'react-timer-hook';
import React, { useMemo } from 'react';
import { MigrationOrderSubmitResult } from './MigrationOrderSubmitResult';
import { MigrationProcessingStatus } from './MigrationProcessingStatus';
import { convertStringArrayToUnorderedList } from '../../../utils/generateUnorderedList';

function MigrateServiceStatusAlert({
    migrateRequestError,
    deployedServiceDetails,
    oldDeployedServiceDetails,
    serviceProviderContactDetails,
    isPollingError,
    migrationDetails,
}: {
    migrateRequestError: Error | null;
    deployedServiceDetails: DeployedServiceDetails | undefined;
    oldDeployedServiceDetails: DeployedServiceDetails | undefined;
    serviceProviderContactDetails: ServiceProviderContactDetails | undefined;
    isPollingError: boolean;
    migrationDetails: ServiceMigrationDetails | undefined;
}): React.JSX.Element {
    const stopWatch = useStopwatch({
        autoStart: true,
    });

    const msg = useMemo(() => {
        if (migrationDetails) {
            if (
                deployedServiceDetails &&
                (migrationDetails.migrationStatus === ServiceMigrationDetails.migrationStatus.MIGRATION_COMPLETED ||
                    migrationDetails.migrationStatus === ServiceMigrationDetails.migrationStatus.DEPLOY_FAILED)
            ) {
                return (
                    <MigrationProcessingStatus
                        response={deployedServiceDetails}
                        serviceHostingType={deployedServiceDetails.serviceHostingType}
                    />
                );
            } else if (
                oldDeployedServiceDetails &&
                migrationDetails.migrationStatus === ServiceMigrationDetails.migrationStatus.DESTROY_FAILED
            ) {
                return (
                    <MigrationProcessingStatus
                        response={oldDeployedServiceDetails}
                        serviceHostingType={oldDeployedServiceDetails.serviceHostingType}
                    />
                );
            } else if (
                migrationDetails.migrationStatus === ServiceMigrationDetails.migrationStatus.DATA_IMPORT_FAILED ||
                migrationDetails.migrationStatus === ServiceMigrationDetails.migrationStatus.DATA_EXPORT_FAILED
            ) {
                return 'Data Migration Failed';
            } else if (migrationDetails.migrationStatus === ServiceMigrationDetails.migrationStatus.DEPLOY_STARTED) {
                return 'New Service Deployment In-progress';
            } else if (migrationDetails.migrationStatus === ServiceMigrationDetails.migrationStatus.DESTROY_STARTED) {
                return 'Old Service Destroy In-progress';
            } else {
                return 'Migrating... Please wait...';
            }
        } else if (migrateRequestError) {
            if (
                migrateRequestError instanceof ApiError &&
                migrateRequestError.body &&
                'details' in migrateRequestError.body
            ) {
                const response: Response = migrateRequestError.body as Response;
                return getOrderSubmissionFailedDisplay(response.details);
            } else {
                return getOrderSubmissionFailedDisplay([migrateRequestError.message]);
            }
        } else if (isPollingError) {
            return 'Migration status polling failed. Please visit MyServices page to check the status of the request.';
        }
        return 'Request submission in-progress';
    }, [deployedServiceDetails, migrationDetails, isPollingError, migrateRequestError, oldDeployedServiceDetails]);

    const alertType = useMemo(() => {
        if (isPollingError || migrateRequestError) {
            return 'error';
        }
        if (migrationDetails) {
            if (
                migrationDetails.migrationStatus === ServiceMigrationDetails.migrationStatus.MIGRATION_FAILED ||
                migrationDetails.migrationStatus === ServiceMigrationDetails.migrationStatus.DATA_EXPORT_FAILED ||
                migrationDetails.migrationStatus === ServiceMigrationDetails.migrationStatus.DATA_IMPORT_FAILED ||
                migrationDetails.migrationStatus === ServiceMigrationDetails.migrationStatus.DEPLOY_FAILED ||
                migrationDetails.migrationStatus === ServiceMigrationDetails.migrationStatus.DESTROY_FAILED
            ) {
                return 'error';
            }
        }
        return 'success';
    }, [migrationDetails, isPollingError, migrateRequestError]);

    if (isPollingError || migrateRequestError) {
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
        if (
            migrationDetails.migrationStatus === ServiceMigrationDetails.migrationStatus.MIGRATION_FAILED ||
            migrationDetails.migrationStatus === ServiceMigrationDetails.migrationStatus.DATA_EXPORT_FAILED ||
            migrationDetails.migrationStatus === ServiceMigrationDetails.migrationStatus.DATA_IMPORT_FAILED ||
            migrationDetails.migrationStatus === ServiceMigrationDetails.migrationStatus.DEPLOY_FAILED ||
            migrationDetails.migrationStatus === ServiceMigrationDetails.migrationStatus.DESTROY_FAILED ||
            migrationDetails.migrationStatus === ServiceMigrationDetails.migrationStatus.MIGRATION_COMPLETED
        ) {
            if (stopWatch.isRunning) {
                stopWatch.pause();
            }
        }
    }

    return (
        <MigrationOrderSubmitResult
            msg={msg}
            uuid={migrationDetails?.newServiceId ?? '-'}
            type={alertType}
            stopWatch={stopWatch}
            contactServiceDetails={alertType !== 'success' ? serviceProviderContactDetails : undefined}
        />
    );
}

export default MigrateServiceStatusAlert;
