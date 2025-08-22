/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import React, { useMemo } from 'react';
import { useStopwatch } from 'react-timer-hook';
import {
    ErrorResponse,
    OrderStatus,
    ServiceHostingType,
    ServiceOrder,
    ServiceOrderStatusUpdate,
    ServicePortingRequest,
    ServiceProviderContactDetails,
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
    closeModal,
}: {
    selectServiceHostingType: ServiceHostingType;
    portServiceRequest: UseMutationResult<ServiceOrder | undefined, Error, ServicePortingRequest>;
    getPortLatestServiceOrderStatusQuery: UseQueryResult<ServiceOrderStatusUpdate | undefined>;
    serviceProviderContactDetails: ServiceProviderContactDetails | undefined;
    closeModal: () => void;
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
        } else if (portServiceRequest.isSuccess && portServiceRequest.data) {
            if (
                getPortLatestServiceOrderStatusQuery.isSuccess &&
                getPortLatestServiceOrderStatusQuery.data &&
                (getPortLatestServiceOrderStatusQuery.data.orderStatus === OrderStatus.SUCCESSFUL ||
                    getPortLatestServiceOrderStatusQuery.data.orderStatus === OrderStatus.FAILED)
            ) {
                return (
                    <OrderProcessingStatus
                        operationType={OperationType.Port}
                        serviceOrderStatus={getPortLatestServiceOrderStatusQuery.data}
                        serviceId={portServiceRequest.data.serviceId}
                        selectedServiceHostingType={selectServiceHostingType}
                        closeModal={closeModal}
                    />
                );
            } else if (getPortLatestServiceOrderStatusQuery.isError) {
                if (selectServiceHostingType === ServiceHostingType.SERVICE_VENDOR) {
                    return 'Service porting status polling failed. Please visit MyServices page to check the status of the request and contact service vendor for error details.';
                } else {
                    return 'Service porting status polling failed. Please visit MyServices page to check the status of the request';
                }
            } else if (
                getPortLatestServiceOrderStatusQuery.isPending ||
                getPortLatestServiceOrderStatusQuery.data?.orderStatus === OrderStatus.IN_PROGRESS
            ) {
                return 'Service porting in-progress, Please wait...';
            }
        }
    }, [closeModal, selectServiceHostingType, portServiceRequest, getPortLatestServiceOrderStatusQuery]);

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
                getPortLatestServiceOrderStatusQuery.data?.orderStatus === OrderStatus.FAILED
            ) {
                if (stopWatch.isRunning) {
                    stopWatch.pause();
                }
                return 'error';
            } else if (
                getPortLatestServiceOrderStatusQuery.isSuccess &&
                getPortLatestServiceOrderStatusQuery.data?.orderStatus === OrderStatus.SUCCESSFUL
            ) {
                if (stopWatch.isRunning) {
                    stopWatch.pause();
                }
                return 'success';
            } else if (
                getPortLatestServiceOrderStatusQuery.isPending ||
                getPortLatestServiceOrderStatusQuery.data?.orderStatus === OrderStatus.IN_PROGRESS
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

    const getServiceId = (): string => {
        if (portServiceRequest.isSuccess && portServiceRequest.data) {
            return portServiceRequest.data.serviceId;
        } else {
            if (isHandleKnownErrorResponse(portServiceRequest.error) && 'serviceId' in portServiceRequest.error.body) {
                return portServiceRequest.error.body.serviceId as string;
            } else {
                return '-';
            }
        }
    };

    const getOrderId = (): string => {
        if (portServiceRequest.isSuccess && portServiceRequest.data) {
            return portServiceRequest.data.orderId;
        } else {
            if (isHandleKnownErrorResponse(portServiceRequest.error) && 'orderId' in portServiceRequest.error.body) {
                return portServiceRequest.error.body.orderId as string;
            }
            return '-';
        }
    };

    return (
        <PortServiceOrderSubmitResult
            msg={msg ?? ''}
            serviceId={getServiceId()}
            orderId={getOrderId()}
            type={alertType}
            stopWatch={stopWatch}
            contactServiceDetails={alertType !== 'success' ? serviceProviderContactDetails : undefined}
            closeModal={closeModal}
        />
    );
}

export default PortServiceStatusAlert;
