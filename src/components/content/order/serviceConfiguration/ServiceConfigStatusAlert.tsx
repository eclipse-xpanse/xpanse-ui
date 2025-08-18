/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import React, { useMemo } from 'react';
import {
    ChangeServiceConfigurationData,
    ErrorResponse,
    Options,
    OrderStatus,
    ServiceHostingType,
    ServiceOrder,
    ServiceOrderStatusUpdate,
} from '../../../../xpanse-api/generated';
import { convertStringArrayToUnorderedList } from '../../../utils/generateUnorderedList';
import { isHandleKnownErrorResponse } from '../../common/error/isHandleKnownErrorResponse.ts';
import { ServiceChangeSubmitResult } from '../common/ServiceChangeSubmitResult.tsx';
import { OrderProcessingStatus } from '../orderStatus/OrderProcessingStatus.tsx';
import { OperationType } from '../types/OperationType';

function ServiceConfigStatusAlert({
    serviceId,
    serviceHostType,
    updateConfigRequest,
    getUpdateConfigStatusPollingQuery,
}: {
    serviceId: string;
    serviceHostType: ServiceHostingType;
    updateConfigRequest: UseMutationResult<ServiceOrder | undefined, Error, Options<ChangeServiceConfigurationData>>;
    getUpdateConfigStatusPollingQuery: UseQueryResult<ServiceOrderStatusUpdate | undefined>;
}): React.JSX.Element {
    const msg = useMemo(() => {
        if (updateConfigRequest.isPending) {
            return 'Request submission in-progress';
        } else if (updateConfigRequest.isError) {
            if (isHandleKnownErrorResponse(updateConfigRequest.error)) {
                const response: ErrorResponse = updateConfigRequest.error.body;
                return getOrderSubmissionFailedDisplay(response.errorType, response.details);
            } else {
                return getOrderSubmissionFailedDisplay(updateConfigRequest.error.name, [
                    updateConfigRequest.error.message,
                ]);
            }
        } else if (updateConfigRequest.isSuccess) {
            if (
                getUpdateConfigStatusPollingQuery.isSuccess &&
                getUpdateConfigStatusPollingQuery.data &&
                (getUpdateConfigStatusPollingQuery.data.orderStatus === OrderStatus.SUCCESSFUL ||
                    getUpdateConfigStatusPollingQuery.data.orderStatus === OrderStatus.FAILED)
            ) {
                return (
                    <OrderProcessingStatus
                        operationType={OperationType.UpdateConfig}
                        serviceOrderStatus={getUpdateConfigStatusPollingQuery.data}
                        serviceId={serviceId}
                        selectedServiceHostingType={serviceHostType}
                    />
                );
            } else if (getUpdateConfigStatusPollingQuery.isError) {
                if (serviceHostType === ServiceHostingType.SERVICE_VENDOR) {
                    return 'Status polling failed. Please visit MyServices page to check the status of the request and contact service vendor for error details.';
                } else {
                    return 'Status polling failed. Please visit MyServices page to check the status of the request';
                }
            } else if (
                getUpdateConfigStatusPollingQuery.isPending ||
                !getUpdateConfigStatusPollingQuery.data?.isOrderCompleted
            ) {
                return 'Updating, Please wait...';
            }
        }
    }, [
        updateConfigRequest.isPending,
        updateConfigRequest.isError,
        updateConfigRequest.isSuccess,
        updateConfigRequest.error,
        getUpdateConfigStatusPollingQuery.isSuccess,
        getUpdateConfigStatusPollingQuery.data,
        getUpdateConfigStatusPollingQuery.isError,
        getUpdateConfigStatusPollingQuery.isPending,
        serviceId,
        serviceHostType,
    ]);

    const alertType = useMemo(() => {
        if (updateConfigRequest.isPending) {
            return 'success';
        } else if (updateConfigRequest.isError || getUpdateConfigStatusPollingQuery.isError) {
            return 'error';
        } else if (updateConfigRequest.isSuccess) {
            if (
                getUpdateConfigStatusPollingQuery.isSuccess &&
                getUpdateConfigStatusPollingQuery.data &&
                getUpdateConfigStatusPollingQuery.data.orderStatus === OrderStatus.FAILED
            ) {
                return 'error';
            } else if (
                getUpdateConfigStatusPollingQuery.isSuccess &&
                getUpdateConfigStatusPollingQuery.data &&
                getUpdateConfigStatusPollingQuery.data.orderStatus === OrderStatus.SUCCESSFUL
            ) {
                return 'success';
            } else if (
                getUpdateConfigStatusPollingQuery.isPending ||
                getUpdateConfigStatusPollingQuery.data?.orderStatus === OrderStatus.IN_PROGRESS
            ) {
                return 'success';
            }
        }
        return 'success';
    }, [updateConfigRequest, getUpdateConfigStatusPollingQuery]);

    function getOrderSubmissionFailedDisplay(errorType: string, reasons: string[]) {
        return (
            <div>
                <span>{errorType.length > 0 ? errorType : 'Service config request failed.'}</span>
                <div>{convertStringArrayToUnorderedList(reasons)}</div>
            </div>
        );
    }

    const getOrderId = (): string => {
        if (updateConfigRequest.isSuccess && updateConfigRequest.data) {
            return updateConfigRequest.data.orderId;
        } else {
            if (isHandleKnownErrorResponse(updateConfigRequest.error) && 'orderId' in updateConfigRequest.error.body) {
                return updateConfigRequest.error.body.orderId as string;
            } else {
                return '';
            }
        }
    };

    return <ServiceChangeSubmitResult msg={msg ?? ''} orderId={getOrderId()} type={alertType} />;
}

export default ServiceConfigStatusAlert;
