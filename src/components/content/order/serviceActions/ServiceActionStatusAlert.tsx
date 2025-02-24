/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import React, { useMemo } from 'react';
import {
    CreateServiceActionData,
    ErrorResponse,
    orderStatus,
    serviceHostingType,
    ServiceOrder,
    ServiceOrderStatusUpdate,
} from '../../../../xpanse-api/generated';
import { convertStringArrayToUnorderedList } from '../../../utils/generateUnorderedList';
import { isHandleKnownErrorResponse } from '../../common/error/isHandleKnownErrorResponse.ts';
import { ServiceChangeSubmitResult } from '../common/ServiceChangeSubmitResult.tsx';
import { OrderProcessingStatus } from '../orderStatus/OrderProcessingStatus.tsx';
import { OperationType } from '../types/OperationType';

function ServiceActionStatusAlert({
    serviceId,
    serviceHostType,
    createServiceActionRequest,
    getServiceActionStatusPollingQuery,
    actionName,
}: {
    serviceId: string;
    serviceHostType: serviceHostingType;
    createServiceActionRequest: UseMutationResult<ServiceOrder, Error, CreateServiceActionData>;
    getServiceActionStatusPollingQuery: UseQueryResult<ServiceOrderStatusUpdate>;
    actionName?: string;
}): React.JSX.Element {
    const msg = useMemo(() => {
        if (createServiceActionRequest.isPending) {
            return 'Request submission in-progress';
        } else if (createServiceActionRequest.isError) {
            if (isHandleKnownErrorResponse(createServiceActionRequest.error)) {
                const response: ErrorResponse = createServiceActionRequest.error.body;
                return getOrderSubmissionFailedDisplay(response.errorType, response.details);
            } else {
                return getOrderSubmissionFailedDisplay(createServiceActionRequest.error.name, [
                    createServiceActionRequest.error.message,
                ]);
            }
        } else if (createServiceActionRequest.isSuccess) {
            if (
                getServiceActionStatusPollingQuery.isSuccess &&
                (getServiceActionStatusPollingQuery.data.orderStatus.toString() === orderStatus.SUCCESSFUL.toString() ||
                    getServiceActionStatusPollingQuery.data.orderStatus.toString() === orderStatus.FAILED.toString())
            ) {
                return (
                    <OrderProcessingStatus
                        operationType={OperationType.Action}
                        serviceOrderStatus={getServiceActionStatusPollingQuery.data}
                        serviceId={serviceId}
                        selectedServiceHostingType={serviceHostType}
                        actionName={actionName}
                    />
                );
            } else if (getServiceActionStatusPollingQuery.isError) {
                if (serviceHostType === serviceHostingType.SERVICE_VENDOR) {
                    return 'Status polling failed. Please visit MyServices page to check the status of the request and contact service vendor for error details.';
                } else {
                    return 'Status polling failed. Please visit MyServices page to check the status of the request';
                }
            } else if (
                getServiceActionStatusPollingQuery.isPending ||
                !getServiceActionStatusPollingQuery.data.isOrderCompleted
            ) {
                return 'Submitting, Please wait...';
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        createServiceActionRequest.isPending,
        createServiceActionRequest.isError,
        createServiceActionRequest.isSuccess,
        createServiceActionRequest.error,
        getServiceActionStatusPollingQuery.isSuccess,
        getServiceActionStatusPollingQuery.data,
        getServiceActionStatusPollingQuery.isError,
        getServiceActionStatusPollingQuery.isPending,
        serviceId,
        serviceHostType,
        actionName,
    ]);

    const alertType = useMemo(() => {
        if (createServiceActionRequest.isPending) {
            return 'success';
        } else if (createServiceActionRequest.isError || getServiceActionStatusPollingQuery.isError) {
            return 'error';
        } else if (createServiceActionRequest.isSuccess) {
            if (
                getServiceActionStatusPollingQuery.isSuccess &&
                getServiceActionStatusPollingQuery.data.orderStatus.toString() === orderStatus.FAILED.toString()
            ) {
                return 'error';
            } else if (
                getServiceActionStatusPollingQuery.isSuccess &&
                getServiceActionStatusPollingQuery.data.orderStatus.toString() === orderStatus.SUCCESSFUL.toString()
            ) {
                return 'success';
            } else if (
                getServiceActionStatusPollingQuery.isPending ||
                getServiceActionStatusPollingQuery.data.orderStatus.toString() === orderStatus.IN_PROGRESS.toString()
            ) {
                return 'success';
            }
        }
        return 'success';
    }, [createServiceActionRequest, getServiceActionStatusPollingQuery]);

    function getOrderSubmissionFailedDisplay(errorType: string, reasons: string[]) {
        return (
            <div>
                <span>
                    {' '}
                    {errorType.length > 0 ? (
                        errorType
                    ) : (
                        <>
                            <strong>{actionName}</strong> request failed.
                        </>
                    )}
                </span>
                <div>{convertStringArrayToUnorderedList(reasons)}</div>
            </div>
        );
    }

    const getOrderId = (): string => {
        if (createServiceActionRequest.isSuccess) {
            return createServiceActionRequest.data.orderId;
        } else {
            if (
                isHandleKnownErrorResponse(createServiceActionRequest.error) &&
                'orderId' in createServiceActionRequest.error.body
            ) {
                return createServiceActionRequest.error.body.orderId as string;
            } else {
                return '';
            }
        }
    };

    return <ServiceChangeSubmitResult msg={msg ?? ''} orderId={getOrderId()} type={alertType} />;
}

export default ServiceActionStatusAlert;
