/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import React, { useMemo } from 'react';
import {
    DeployedService,
    ErrorResponse,
    OrderStatus,
    ServiceHostingType,
    ServiceOrder,
    ServiceOrderStatusUpdate,
    ServiceProviderContactDetails,
} from '../../../../../xpanse-api/generated';
import { convertStringArrayToUnorderedList } from '../../../../utils/generateUnorderedList.tsx';
import { isHandleKnownErrorResponse } from '../../../common/error/isHandleKnownErrorResponse.ts';
import { ServiceStateSubmitResult } from '../../common/ServiceStateSubmitResult.tsx';
import { OrderProcessingStatus } from '../../orderStatus/OrderProcessingStatus.tsx';
import { OperationType } from '../../types/OperationType.ts';

function RestartServiceStatusAlert({
    deployedService,
    serviceStateRestartQuery,
    closeRestartResultAlert,
    getRestartServiceDetailsQuery,
    serviceProviderContactDetails,
}: {
    deployedService: DeployedService;
    serviceStateRestartQuery: UseMutationResult<ServiceOrder | undefined, Error, string>;
    closeRestartResultAlert: (arg: boolean) => void;
    getRestartServiceDetailsQuery: UseQueryResult<ServiceOrderStatusUpdate | undefined>;
    serviceProviderContactDetails: ServiceProviderContactDetails | undefined;
}): React.JSX.Element {
    const onClose = () => {
        closeRestartResultAlert(true);
    };

    const msg = (() => {
        if (serviceStateRestartQuery.isPending) {
            return 'Request submission in-progress';
        } else if (serviceStateRestartQuery.isError) {
            if (isHandleKnownErrorResponse(serviceStateRestartQuery.error)) {
                const response: ErrorResponse = serviceStateRestartQuery.error.body;
                return getOrderSubmissionFailedDisplay(response.errorType, response.details);
            } else {
                return getOrderSubmissionFailedDisplay(serviceStateRestartQuery.error.name, [
                    serviceStateRestartQuery.error.message,
                ]);
            }
        } else if (serviceStateRestartQuery.isSuccess) {
            if (
                getRestartServiceDetailsQuery.isSuccess &&
                (getRestartServiceDetailsQuery.data?.orderStatus === OrderStatus.SUCCESSFUL ||
                    getRestartServiceDetailsQuery.data?.orderStatus === OrderStatus.FAILED)
            ) {
                return (
                    <OrderProcessingStatus
                        operationType={OperationType.Restart}
                        serviceOrderStatus={getRestartServiceDetailsQuery.data}
                        serviceId={deployedService.serviceId}
                        selectedServiceHostingType={deployedService.serviceHostingType}
                    />
                );
            } else if (getRestartServiceDetailsQuery.isError) {
                if (deployedService.serviceHostingType === ServiceHostingType.SERVICE_VENDOR) {
                    return 'Service restart status polling failed. Please visit MyServices page to check the status of the request and contact service vendor for error details.';
                } else {
                    return 'Service restart status polling failed. Please visit MyServices page to check the status of the request';
                }
            } else if (
                getRestartServiceDetailsQuery.isPending ||
                getRestartServiceDetailsQuery.data?.orderStatus === OrderStatus.IN_PROGRESS
            ) {
                return 'Restarting, Please wait...';
            }
        }
    })();

    const alertType = useMemo(() => {
        if (serviceStateRestartQuery.isPending) {
            return 'success';
        } else if (serviceStateRestartQuery.isError || getRestartServiceDetailsQuery.isError) {
            return 'error';
        } else if (serviceStateRestartQuery.isSuccess) {
            if (
                getRestartServiceDetailsQuery.isSuccess &&
                getRestartServiceDetailsQuery.data?.orderStatus === OrderStatus.FAILED
            ) {
                return 'error';
            } else if (
                getRestartServiceDetailsQuery.isSuccess &&
                getRestartServiceDetailsQuery.data?.orderStatus === OrderStatus.SUCCESSFUL
            ) {
                return 'success';
            } else if (
                getRestartServiceDetailsQuery.isPending ||
                getRestartServiceDetailsQuery.data?.orderStatus === OrderStatus.IN_PROGRESS
            ) {
                return 'success';
            }
        }
        return 'success';
    }, [serviceStateRestartQuery, getRestartServiceDetailsQuery]);

    function getOrderSubmissionFailedDisplay(errorType: string, reasons: string[]) {
        return (
            <div>
                <span>{errorType.length > 0 ? errorType : 'Service restart request failed.'}</span>
                <div>{convertStringArrayToUnorderedList(reasons)}</div>
            </div>
        );
    }

    const getOrderId = (): string => {
        if (serviceStateRestartQuery.isSuccess && serviceStateRestartQuery.data) {
            return serviceStateRestartQuery.data.orderId;
        } else {
            if (
                isHandleKnownErrorResponse(serviceStateRestartQuery.error) &&
                'orderId' in serviceStateRestartQuery.error.body
            ) {
                return serviceStateRestartQuery.error.body.orderId as string;
            }
            return '-';
        }
    };

    return (
        <ServiceStateSubmitResult
            msg={msg ?? ''}
            serviceId={deployedService.serviceId}
            orderId={getOrderId()}
            type={alertType}
            onClose={onClose}
            contactServiceDetails={alertType !== 'success' ? serviceProviderContactDetails : undefined}
        />
    );
}

export default RestartServiceStatusAlert;
