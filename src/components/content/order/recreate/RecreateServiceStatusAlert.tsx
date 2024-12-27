/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { UseMutationResult } from '@tanstack/react-query';
import React, { useMemo } from 'react';
import { useStopwatch } from 'react-timer-hook';
import {
    DeployedService,
    ErrorResponse,
    serviceDeploymentState,
    ServiceOrder,
    ServiceOrderStatusUpdate,
    taskStatus,
} from '../../../../xpanse-api/generated';
import { convertStringArrayToUnorderedList } from '../../../utils/generateUnorderedList';
import { isHandleKnownErrorResponse } from '../../common/error/isHandleKnownErrorResponse.ts';
import { useServiceDetailsByServiceIdQuery } from '../../common/queries/useServiceDetailsByServiceIdQuery.ts';
import useGetOrderableServiceDetailsQuery from '../../deployedServices/myServices/query/useGetOrderableServiceDetailsQuery.ts';
import { RecreateOrderSubmitResult } from './RecreateOrderSubmitResult.tsx';
import { RecreationProcessingStatus } from './RecreationProcessingStatus.tsx';

function RecreateServiceStatusAlert({
    currentSelectedService,
    recreateRequest,
    recreateServiceOrderStatusPollingQueryError,
    recreateServiceOrderStatusPollingQueryData,
    closeRecreateResultAlert,
}: {
    currentSelectedService: DeployedService;
    recreateRequest: UseMutationResult<ServiceOrder, Error, string>;
    recreateServiceOrderStatusPollingQueryError: Error | null;
    recreateServiceOrderStatusPollingQueryData: ServiceOrderStatusUpdate | undefined;
    closeRecreateResultAlert: (arg: boolean) => void;
}): React.JSX.Element {
    const getOrderableServiceDetails = useGetOrderableServiceDetailsQuery(currentSelectedService.serviceTemplateId);

    const getRecreateDeployServiceDetailsQuery = useServiceDetailsByServiceIdQuery(
        recreateRequest.data?.serviceId ?? '',
        currentSelectedService.serviceHostingType,
        recreateServiceOrderStatusPollingQueryData?.taskStatus
    );

    if (
        recreateServiceOrderStatusPollingQueryData?.isOrderCompleted &&
        getRecreateDeployServiceDetailsQuery.isSuccess &&
        [
            serviceDeploymentState.DESTROY_FAILED.toString(),
            serviceDeploymentState.DEPLOYMENT_FAILED.toString(),
            serviceDeploymentState.DEPLOYMENT_SUCCESSFUL.toString(),
        ].includes(getRecreateDeployServiceDetailsQuery.data.serviceDeploymentState)
    ) {
        currentSelectedService.serviceDeploymentState =
            getRecreateDeployServiceDetailsQuery.data.serviceDeploymentState;
        currentSelectedService.serviceState = getRecreateDeployServiceDetailsQuery.data.serviceState;
    }

    const stopWatch = useStopwatch({
        autoStart: true,
    });

    const msg = useMemo(() => {
        if (recreateRequest.isPending) {
            return 'Recreate request submission in-progress';
        }
        if (recreateRequest.isError) {
            currentSelectedService.serviceDeploymentState = serviceDeploymentState.DEPLOYMENT_FAILED;
            if (isHandleKnownErrorResponse(recreateRequest.error)) {
                const response: ErrorResponse = recreateRequest.error.body;
                return getOrderSubmissionFailedDisplay(response.details);
            } else {
                return getOrderSubmissionFailedDisplay([recreateRequest.error.message]);
            }
        }

        if (recreateServiceOrderStatusPollingQueryError) {
            currentSelectedService.serviceDeploymentState = serviceDeploymentState.DEPLOYMENT_FAILED;
            return 'Recreation status polling failed. Please visit MyServices page to check the status of the request.';
        }

        if (recreateServiceOrderStatusPollingQueryData?.isOrderCompleted) {
            return <RecreationProcessingStatus deployedResponse={getRecreateDeployServiceDetailsQuery.data} />;
        } else {
            return 'Recreating... Please wait...';
        }
    }, [
        currentSelectedService,
        recreateRequest.isPending,
        recreateRequest.isError,
        recreateRequest.error,
        recreateServiceOrderStatusPollingQueryError,
        recreateServiceOrderStatusPollingQueryData,
        getRecreateDeployServiceDetailsQuery,
    ]);

    const alertType = useMemo(() => {
        if (recreateRequest.isError || recreateServiceOrderStatusPollingQueryError) {
            return 'error';
        }
        if (recreateServiceOrderStatusPollingQueryData?.taskStatus === taskStatus.FAILED) {
            return 'error';
        }

        return 'success';
    }, [
        recreateRequest.isError,
        recreateServiceOrderStatusPollingQueryError,
        recreateServiceOrderStatusPollingQueryData,
    ]);

    if (
        recreateRequest.isError ||
        recreateServiceOrderStatusPollingQueryError ||
        recreateServiceOrderStatusPollingQueryData?.isOrderCompleted
    ) {
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

    return (
        <RecreateOrderSubmitResult
            msg={msg}
            uuid={recreateRequest.data?.serviceId ?? '-'}
            type={alertType}
            stopWatch={stopWatch}
            closeRecreateResultAlert={closeRecreateResultAlert}
            contactServiceDetails={
                alertType !== 'success' ? getOrderableServiceDetails.data?.serviceProviderContactDetails : undefined
            }
        />
    );
}

export default RecreateServiceStatusAlert;
