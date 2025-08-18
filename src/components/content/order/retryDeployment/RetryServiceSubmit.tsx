/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import React from 'react';
import {
    DeployedService,
    DeployRequest,
    ServiceOrder,
    ServiceOrderStatusUpdate,
    ServiceProviderContactDetails,
} from '../../../../xpanse-api/generated';
import OrderSubmitStatusAlert from '../orderStatus/OrderSubmitStatusAlert.tsx';

export const RetryServiceSubmit = ({
    currentSelectedService,
    submitDeploymentRequest,
    redeployFailedDeploymentQuery,
    getSubmitLatestServiceOrderStatusQuery,
    serviceProviderContactDetails,
    retryRequest,
    onClose,
}: {
    currentSelectedService: DeployedService;
    submitDeploymentRequest:
        | UseMutationResult<ServiceOrder | undefined, Error, DeployRequest>
        | UseMutationResult<ServiceOrder | undefined, Error, string>;
    redeployFailedDeploymentQuery: UseMutationResult<ServiceOrder | undefined, Error, string>;
    getSubmitLatestServiceOrderStatusQuery: UseQueryResult<ServiceOrderStatusUpdate | undefined>;
    serviceProviderContactDetails: ServiceProviderContactDetails | undefined;
    retryRequest: () => void;
    onClose: () => void;
}): React.JSX.Element => {
    return (
        <>
            <OrderSubmitStatusAlert
                serviceId={currentSelectedService.serviceId}
                serviceHostType={currentSelectedService.serviceHostingType}
                submitDeploymentRequest={submitDeploymentRequest}
                redeployFailedDeploymentQuery={redeployFailedDeploymentQuery}
                getSubmitLatestServiceOrderStatusQuery={getSubmitLatestServiceOrderStatusQuery}
                serviceProviderContactDetails={serviceProviderContactDetails}
                retryRequest={retryRequest}
                onClose={onClose}
            />
        </>
    );
};
