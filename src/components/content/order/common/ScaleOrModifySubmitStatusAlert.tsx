/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React, { useMemo } from 'react';
import { useStopwatch } from 'react-timer-hook';
import {
    ApiError,
    DeployedService,
    DeployedServiceDetails,
    Response,
    ServiceProviderContactDetails,
    VendorHostedDeployedServiceDetails,
} from '../../../../xpanse-api/generated';
import { convertStringArrayToUnorderedList } from '../../../utils/generateUnorderedList';
import { OrderSubmitResult } from '../orderStatus/OrderSubmitResult';
import { ProcessingStatus } from '../orderStatus/ProcessingStatus';
import { useServiceDetailsPollingQuery } from '../orderStatus/useServiceDetailsPollingQuery';
import { OperationType } from '../types/OperationType';

function ScaleOrModifySubmitStatusAlert({
    isSubmitFailed,
    submitFailedResult,
    isSubmitInProgress,
    currentSelectedService,
    serviceProviderContactDetails,
    getModifyDetailsStatus,
}: {
    isSubmitFailed: boolean;
    submitFailedResult: Error | null;
    isSubmitInProgress: boolean;
    currentSelectedService: DeployedServiceDetails | VendorHostedDeployedServiceDetails;
    serviceProviderContactDetails: ServiceProviderContactDetails | undefined;
    getModifyDetailsStatus: (arg: DeployedServiceDetails.serviceDeploymentState | undefined) => void;
}): React.JSX.Element {
    const stopWatch = useStopwatch({
        autoStart: true,
    });
    const getServiceDetailsByIdQuery = useServiceDetailsPollingQuery(
        currentSelectedService.serviceId,
        !isSubmitFailed && !isSubmitInProgress,
        currentSelectedService.serviceHostingType,
        [
            DeployedServiceDetails.serviceDeploymentState.MODIFICATION_FAILED,
            DeployedServiceDetails.serviceDeploymentState.MODIFICATION_SUCCESSFUL,
        ]
    );
    const msg = useMemo(() => {
        if (isSubmitInProgress) {
            return 'Request accepted';
        }
        if (getServiceDetailsByIdQuery.data) {
            if (
                getServiceDetailsByIdQuery.data.serviceDeploymentState.toString() ===
                DeployedServiceDetails.serviceDeploymentState.MODIFYING.toString()
            ) {
                return 'Modifying, Please wait...';
            } else if (
                getServiceDetailsByIdQuery.data.serviceDeploymentState.toString() ===
                    DeployedServiceDetails.serviceDeploymentState.MODIFICATION_SUCCESSFUL.toString() ||
                getServiceDetailsByIdQuery.data.serviceDeploymentState.toString() ===
                    DeployedServiceDetails.serviceDeploymentState.MODIFICATION_FAILED.toString() ||
                getServiceDetailsByIdQuery.data.serviceDeploymentState.toString() ===
                    DeployedServiceDetails.serviceDeploymentState.ROLLBACK_FAILED.toString()
            ) {
                return (
                    <ProcessingStatus response={getServiceDetailsByIdQuery.data} operationType={OperationType.Modify} />
                );
            }
        } else if (isSubmitFailed && submitFailedResult) {
            if (
                submitFailedResult instanceof ApiError &&
                submitFailedResult.body &&
                'details' in submitFailedResult.body
            ) {
                const response: Response = submitFailedResult.body as Response;
                return getOrderSubmissionFailedDisplay(response.details);
            } else {
                return getOrderSubmissionFailedDisplay([submitFailedResult.message]);
            }
        } else if (getServiceDetailsByIdQuery.isError) {
            return 'Modification status polling failed. Please visit MyServices page to check the status of the request.';
        } else {
            return 'Modifying, Please wait...';
        }
        return '';
    }, [
        getServiceDetailsByIdQuery.data,
        getServiceDetailsByIdQuery.isError,
        isSubmitFailed,
        submitFailedResult,
        isSubmitInProgress,
    ]);

    const alertType = useMemo(() => {
        if (getServiceDetailsByIdQuery.isError || isSubmitFailed) {
            getModifyDetailsStatus(DeployedService.serviceDeploymentState.MODIFICATION_FAILED);
            return 'error';
        }
        if (getServiceDetailsByIdQuery.data) {
            if (
                getServiceDetailsByIdQuery.data.serviceDeploymentState.toString() ===
                    DeployedServiceDetails.serviceDeploymentState.MODIFICATION_FAILED.toString() ||
                getServiceDetailsByIdQuery.data.serviceDeploymentState.toString() ===
                    DeployedServiceDetails.serviceDeploymentState.ROLLBACK_FAILED.toString()
            ) {
                getModifyDetailsStatus(DeployedService.serviceDeploymentState.MODIFICATION_FAILED);
                return 'error';
            }
        }
        getModifyDetailsStatus(DeployedService.serviceDeploymentState.MODIFICATION_SUCCESSFUL);
        return 'success';
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getServiceDetailsByIdQuery.data, getServiceDetailsByIdQuery.isError, isSubmitFailed]);

    if (isSubmitFailed || getServiceDetailsByIdQuery.isError) {
        if (stopWatch.isRunning) {
            stopWatch.pause();
        }
    }

    if (getServiceDetailsByIdQuery.data) {
        if (
            getServiceDetailsByIdQuery.data.serviceDeploymentState.toString() ===
                DeployedServiceDetails.serviceDeploymentState.MODIFICATION_FAILED.toString() ||
            getServiceDetailsByIdQuery.data.serviceDeploymentState.toString() ===
                DeployedServiceDetails.serviceDeploymentState.ROLLBACK_FAILED.toString() ||
            getServiceDetailsByIdQuery.data.serviceDeploymentState.toString() ===
                DeployedServiceDetails.serviceDeploymentState.MODIFICATION_SUCCESSFUL.toString()
        ) {
            if (stopWatch.isRunning) {
                stopWatch.pause();
            }
        }
    }

    function getOrderSubmissionFailedDisplay(reasons: string[]) {
        return (
            <div>
                <span>{'Service modification request failed.'}</span>
                <div>{convertStringArrayToUnorderedList(reasons)}</div>
            </div>
        );
    }

    return (
        <OrderSubmitResult
            msg={msg}
            uuid={currentSelectedService.serviceId}
            type={alertType}
            stopWatch={stopWatch}
            contactServiceDetails={alertType !== 'success' ? serviceProviderContactDetails : undefined}
        />
    );
}

export default ScaleOrModifySubmitStatusAlert;
