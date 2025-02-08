/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import React, { useMemo } from 'react';
import { useStopwatch } from 'react-timer-hook';
import {
    ErrorResponse,
    serviceHostingType,
    ServiceOrder,
    ServiceOrderStatusUpdate,
    ServicePortingRequest,
    ServiceProviderContactDetails,
    taskStatus,
} from '../../../../xpanse-api/generated';
import { convertStringArrayToUnorderedList } from '../../../utils/generateUnorderedList';
import { isHandleKnownErrorResponse } from '../../common/error/isHandleKnownErrorResponse.ts';
import { OrderProcessingStatus } from '../orderStatus/OrderProcessingStatus.tsx';
import { OperationType } from '../types/OperationType.ts';
import { PortServiceOrderSubmitResult } from './PortServiceOrderSubmitResult.tsx';

function PortServiceStatusAlert({
    selectServiceHostingType,
    portServiceRequest,
    getPortLatestServiceOrderStatusQuery,
    serviceProviderContactDetails,
}: {
    selectServiceHostingType: serviceHostingType;
    portServiceRequest: UseMutationResult<ServiceOrder, Error, ServicePortingRequest>;
    getPortLatestServiceOrderStatusQuery: UseQueryResult<ServiceOrderStatusUpdate>;
    serviceProviderContactDetails: ServiceProviderContactDetails | undefined;
}): React.JSX.Element {
    const stopWatch = useStopwatch({
        autoStart: true,
    });

    const msg = useMemo(() => {
        if (portServiceRequest.isPending) {
            return 'Service porting request submission in-progress';
        } else if (portServiceRequest.isError) {
            if (isHandleKnownErrorResponse(portServiceRequest.error)) {
                const response: ErrorResponse = portServiceRequest.error.body;
                return getOrderSubmissionFailedDisplay(response.errorType, response.details);
            } else {
                return getOrderSubmissionFailedDisplay(portServiceRequest.error.name, [
                    portServiceRequest.error.message,
                ]);
            }
        } else if (portServiceRequest.isSuccess) {
            if (
                getPortLatestServiceOrderStatusQuery.isSuccess &&
                (getPortLatestServiceOrderStatusQuery.data.taskStatus.toString() === taskStatus.SUCCESSFUL.toString() ||
                    getPortLatestServiceOrderStatusQuery.data.taskStatus.toString() === taskStatus.FAILED.toString())
            ) {
                return (
                    <OrderProcessingStatus
                        operationType={OperationType.Port}
                        serviceOrderStatus={getPortLatestServiceOrderStatusQuery.data}
                        serviceId={portServiceRequest.data.serviceId}
                        selectedServiceHostingType={selectServiceHostingType}
                    />
                );
            } else if (getPortLatestServiceOrderStatusQuery.isError) {
                if (selectServiceHostingType === serviceHostingType.SERVICE_VENDOR) {
                    return 'Service porting status polling failed. Please visit MyServices page to check the status of the request and contact service vendor for error details.';
                } else {
                    return 'Service porting status polling failed. Please visit MyServices page to check the status of the request';
                }
            } else if (
                getPortLatestServiceOrderStatusQuery.isPending ||
                getPortLatestServiceOrderStatusQuery.data.taskStatus.toString() === taskStatus.IN_PROGRESS.toString()
            ) {
                return 'Service porting, Please wait...';
            }
        }
    }, [selectServiceHostingType, portServiceRequest, getPortLatestServiceOrderStatusQuery]);

    const alertType = useMemo(() => {
        if (portServiceRequest.isPending) {
            return 'success';
        } else if (portServiceRequest.isError || getPortLatestServiceOrderStatusQuery.isError) {
            if (stopWatch.isRunning) {
                stopWatch.pause();
            }
            return 'error';
        } else if (portServiceRequest.isSuccess) {
            if (
                getPortLatestServiceOrderStatusQuery.isSuccess &&
                getPortLatestServiceOrderStatusQuery.data.taskStatus.toString() === taskStatus.FAILED.toString()
            ) {
                if (stopWatch.isRunning) {
                    stopWatch.pause();
                }
                return 'error';
            } else if (
                getPortLatestServiceOrderStatusQuery.isSuccess &&
                getPortLatestServiceOrderStatusQuery.data.taskStatus.toString() === taskStatus.SUCCESSFUL.toString()
            ) {
                if (stopWatch.isRunning) {
                    stopWatch.pause();
                }
                return 'success';
            } else if (
                getPortLatestServiceOrderStatusQuery.isPending ||
                getPortLatestServiceOrderStatusQuery.data.taskStatus.toString() === taskStatus.IN_PROGRESS.toString()
            ) {
                return 'success';
            }
        }
        return 'success';
    }, [stopWatch, portServiceRequest, getPortLatestServiceOrderStatusQuery]);

    function getOrderSubmissionFailedDisplay(errorType: string, reasons: string[]) {
        return (
            <div>
                <span>{errorType.length > 0 ? errorType : 'Service port request failed.'}</span>
                <div>{convertStringArrayToUnorderedList(reasons)}</div>
            </div>
        );
    }

    return (
        <PortServiceOrderSubmitResult
            msg={msg ?? ''}
            uuid={portServiceRequest.data?.serviceId ?? '-'}
            type={alertType}
            stopWatch={stopWatch}
            contactServiceDetails={alertType !== 'success' ? serviceProviderContactDetails : undefined}
        />
    );
}

export default PortServiceStatusAlert;
