/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React, { useMemo } from 'react';
import { useStopwatch } from 'react-timer-hook';
import {
    ApiError,
    DeployedServiceDetails,
    Response,
    ServiceProviderContactDetails,
} from '../../../../xpanse-api/generated';
import { convertStringArrayToUnorderedList } from '../../../utils/generateUnorderedList';
import { OperationType } from '../types/OperationType';
import { OrderSubmitResult } from './OrderSubmitResult';
import { ProcessingStatus } from './ProcessingStatus';

function OrderSubmitStatusAlert({
    uuid,
    isSubmitFailed,
    isRetrySubmitIsPending,
    isRetrySubmitFailed,
    deployedServiceDetails,
    serviceProviderContactDetails,
    isPollingError,
    retryRequest,
    onClose,
}: {
    uuid: string | undefined;
    isSubmitFailed: Error | null;
    isRetrySubmitIsPending: boolean;
    isRetrySubmitFailed: Error | null;
    deployedServiceDetails: DeployedServiceDetails | undefined;
    serviceProviderContactDetails: ServiceProviderContactDetails | undefined;
    isPollingError: boolean;
    retryRequest: () => void;
    onClose: () => void;
}): React.JSX.Element {
    const stopWatch = useStopwatch({
        autoStart: true,
    });
    const msg = useMemo(() => {
        if (isRetrySubmitIsPending) {
            return 'Retry request submission in-progress';
        }
        if (deployedServiceDetails) {
            if (
                uuid &&
                deployedServiceDetails.serviceDeploymentState.toString() ===
                    DeployedServiceDetails.serviceDeploymentState.DEPLOYING.toString()
            ) {
                return 'Deploying, Please wait...';
            } else if (
                deployedServiceDetails.serviceDeploymentState.toString() ===
                    DeployedServiceDetails.serviceDeploymentState.DEPLOYMENT_SUCCESSFUL.toString() ||
                deployedServiceDetails.serviceDeploymentState.toString() ===
                    DeployedServiceDetails.serviceDeploymentState.DEPLOYMENT_FAILED.toString() ||
                deployedServiceDetails.serviceDeploymentState.toString() ===
                    DeployedServiceDetails.serviceDeploymentState.ROLLBACK_FAILED.toString()
            ) {
                return <ProcessingStatus response={deployedServiceDetails} operationType={OperationType.Deploy} />;
            }
        } else if (isSubmitFailed) {
            if (isSubmitFailed instanceof ApiError && isSubmitFailed.body && 'details' in isSubmitFailed.body) {
                const response: Response = isSubmitFailed.body as Response;
                return getOrderSubmissionFailedDisplay(response.details);
            } else {
                return getOrderSubmissionFailedDisplay([isSubmitFailed.message]);
            }
        } else if (isRetrySubmitFailed) {
            if (
                isRetrySubmitFailed instanceof ApiError &&
                isRetrySubmitFailed.body &&
                'details' in isRetrySubmitFailed.body
            ) {
                const response: Response = isRetrySubmitFailed.body as Response;
                return getOrderSubmissionFailedDisplay(response.details);
            } else {
                return getOrderSubmissionFailedDisplay([isRetrySubmitFailed.message]);
            }
        } else if (uuid && isPollingError) {
            return 'Deployment status polling failed. Please visit MyServices page to check the status of the request.';
        } else if (uuid) {
            return 'Request accepted';
        } else if (uuid === undefined) {
            return 'Request submission in-progress';
        }
        return '';
    }, [deployedServiceDetails, uuid, isPollingError, isSubmitFailed, isRetrySubmitFailed, isRetrySubmitIsPending]);

    const alertType = useMemo(() => {
        if (isPollingError || isSubmitFailed) {
            return 'error';
        }
        if (isRetrySubmitFailed) {
            return 'error';
        }

        if (isRetrySubmitIsPending) {
            return 'success';
        }

        if (deployedServiceDetails) {
            if (
                deployedServiceDetails.serviceDeploymentState.toString() ===
                    DeployedServiceDetails.serviceDeploymentState.DEPLOYMENT_FAILED.toString() ||
                deployedServiceDetails.serviceDeploymentState.toString() ===
                    DeployedServiceDetails.serviceDeploymentState.ROLLBACK_FAILED.toString()
            ) {
                return 'error';
            }
        }
        return 'success';
    }, [deployedServiceDetails, isPollingError, isSubmitFailed, isRetrySubmitFailed, isRetrySubmitIsPending]);

    if (isPollingError || isSubmitFailed) {
        if (stopWatch.isRunning) {
            stopWatch.pause();
        }
    }

    if (isRetrySubmitFailed && stopWatch.isRunning) {
        stopWatch.pause();
    }

    if (deployedServiceDetails) {
        if (
            deployedServiceDetails.serviceDeploymentState.toString() ===
                DeployedServiceDetails.serviceDeploymentState.DEPLOYMENT_FAILED.toString() ||
            deployedServiceDetails.serviceDeploymentState.toString() ===
                DeployedServiceDetails.serviceDeploymentState.ROLLBACK_FAILED.toString() ||
            deployedServiceDetails.serviceDeploymentState.toString() ===
                DeployedServiceDetails.serviceDeploymentState.DEPLOYMENT_SUCCESSFUL.toString()
        ) {
            if (stopWatch.isRunning) {
                stopWatch.pause();
            }
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

    return (
        <OrderSubmitResult
            msg={msg}
            uuid={uuid ?? '-'}
            type={alertType}
            stopWatch={stopWatch}
            contactServiceDetails={alertType !== 'success' ? serviceProviderContactDetails : undefined}
            retryRequest={retryRequest}
            onClose={onClose}
        />
    );
}

export default OrderSubmitStatusAlert;
