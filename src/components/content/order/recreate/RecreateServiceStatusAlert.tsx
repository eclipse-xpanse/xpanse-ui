/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import React, { useMemo } from 'react';
import { useStopwatch } from 'react-timer-hook';
import {
    DeployedService,
    ErrorResponse,
    ServiceOrder,
    ServiceOrderStatusUpdate,
    ServiceProviderContactDetails,
    taskStatus,
} from '../../../../xpanse-api/generated';
import { convertStringArrayToUnorderedList } from '../../../utils/generateUnorderedList';
import { isHandleKnownErrorResponse } from '../../common/error/isHandleKnownErrorResponse.ts';
import { useServiceDetailsByServiceIdQuery } from '../../common/queries/useServiceDetailsByServiceIdQuery.ts';
import { RecreateOrderSubmitResult } from './RecreateOrderSubmitResult.tsx';
import { RecreationProcessingStatus } from './RecreationProcessingStatus.tsx';

function RecreateServiceStatusAlert({
    currentSelectedService,
    recreateRequest,
    recreateServiceOrderStatusPollingQuery,
    closeRecreateResultAlert,
    serviceProviderContactDetails,
}: {
    currentSelectedService: DeployedService;
    recreateRequest: UseMutationResult<ServiceOrder, Error, string>;
    recreateServiceOrderStatusPollingQuery: UseQueryResult<ServiceOrderStatusUpdate>;
    closeRecreateResultAlert: (arg: boolean) => void;
    serviceProviderContactDetails: ServiceProviderContactDetails | undefined;
}): React.JSX.Element {
    const getRecreateDeployServiceDetailsQuery = useServiceDetailsByServiceIdQuery(
        recreateRequest.data?.serviceId ?? '',
        currentSelectedService.serviceHostingType,
        recreateServiceOrderStatusPollingQuery.data?.taskStatus
    );

    const stopWatch = useStopwatch({
        autoStart: true,
    });

    const msg = useMemo(() => {
        if (recreateRequest.isPending) {
            return 'Recreate request submission in-progress';
        } else if (recreateRequest.isError) {
            if (isHandleKnownErrorResponse(recreateRequest.error)) {
                const response: ErrorResponse = recreateRequest.error.body;
                return getOrderSubmissionFailedDisplay(response.details);
            } else {
                return getOrderSubmissionFailedDisplay([recreateRequest.error.message]);
            }
        } else if (recreateRequest.isSuccess) {
            if (recreateServiceOrderStatusPollingQuery.isSuccess) {
                if (
                    recreateServiceOrderStatusPollingQuery.data.taskStatus.toString() ===
                    taskStatus.SUCCESSFUL.toString()
                ) {
                    return <RecreationProcessingStatus deployedResponse={getRecreateDeployServiceDetailsQuery.data} />;
                } else if (
                    recreateServiceOrderStatusPollingQuery.data.taskStatus.toString() ===
                        taskStatus.FAILED.toString() &&
                    recreateServiceOrderStatusPollingQuery.data.error
                ) {
                    return getOrderSubmissionFailedDisplay(recreateServiceOrderStatusPollingQuery.data.error.details);
                } else if (
                    recreateServiceOrderStatusPollingQuery.data.taskStatus.toString() ===
                    taskStatus.IN_PROGRESS.toString()
                ) {
                    return 'Recreating, Please wait...';
                }
            } else if (recreateServiceOrderStatusPollingQuery.isError) {
                return 'Recreation status polling failed. Please visit MyServices page to check the status of the request';
            } else {
                return 'Recreating, Please wait...';
            }
        }
    }, [getRecreateDeployServiceDetailsQuery, recreateRequest, recreateServiceOrderStatusPollingQuery]);

    const alertType = useMemo(() => {
        if (recreateRequest.isPending) {
            return 'success';
        } else if (recreateRequest.isError || recreateServiceOrderStatusPollingQuery.isError) {
            if (stopWatch.isRunning) {
                stopWatch.pause();
            }
            return 'error';
        } else if (recreateRequest.isSuccess) {
            if (
                recreateServiceOrderStatusPollingQuery.isSuccess &&
                recreateServiceOrderStatusPollingQuery.data.taskStatus.toString() === taskStatus.FAILED.toString()
            ) {
                if (stopWatch.isRunning) {
                    stopWatch.pause();
                }
                return 'error';
            } else if (
                recreateServiceOrderStatusPollingQuery.isSuccess &&
                recreateServiceOrderStatusPollingQuery.data.taskStatus.toString() === taskStatus.SUCCESSFUL.toString()
            ) {
                if (stopWatch.isRunning) {
                    stopWatch.pause();
                }
                return 'success';
            } else if (
                recreateServiceOrderStatusPollingQuery.isPending ||
                recreateServiceOrderStatusPollingQuery.data.taskStatus.toString() === taskStatus.IN_PROGRESS.toString()
            ) {
                return 'success';
            }
        }
        return 'success';
    }, [stopWatch, recreateRequest, recreateServiceOrderStatusPollingQuery]);

    function getOrderSubmissionFailedDisplay(reasons: string[]) {
        return (
            <div>
                <span>{'Service deployment request failed.'}</span>
                <div>{convertStringArrayToUnorderedList(reasons)}</div>
            </div>
        );
    }

    return (
        <RecreateOrderSubmitResult
            msg={msg ?? ''}
            uuid={recreateRequest.data?.serviceId ?? '-'}
            type={alertType}
            stopWatch={stopWatch}
            closeRecreateResultAlert={closeRecreateResultAlert}
            contactServiceDetails={alertType !== 'success' ? serviceProviderContactDetails : undefined}
        />
    );
}

export default RecreateServiceStatusAlert;
