/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import React from 'react';
import {
    DeployedService,
    DeployRequest,
    serviceHostingType,
    ServiceOrder,
    ServiceOrderStatusUpdate,
    ServiceProviderContactDetails,
} from '../../../../xpanse-api/generated';
import { useServiceDetailsByServiceIdQuery } from '../../common/queries/useServiceDetailsByServiceIdQuery.ts';
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
        | UseMutationResult<ServiceOrder, Error, DeployRequest>
        | UseMutationResult<ServiceOrder, Error, string>;
    redeployFailedDeploymentQuery: UseMutationResult<ServiceOrder, Error, string>;
    getSubmitLatestServiceOrderStatusQuery: UseQueryResult<ServiceOrderStatusUpdate>;
    serviceProviderContactDetails: ServiceProviderContactDetails | undefined;
    retryRequest: () => void;
    onClose: () => void;
}): React.JSX.Element => {
    const getServiceDetailsQuery = useServiceDetailsByServiceIdQuery(
        currentSelectedService.serviceId,
        currentSelectedService.serviceHostingType,
        getSubmitLatestServiceOrderStatusQuery.data?.taskStatus
    );
    return (
        <>
            <OrderSubmitStatusAlert
                uuid={currentSelectedService.serviceId}
                serviceHostType={currentSelectedService.serviceHostingType as serviceHostingType}
                submitDeploymentRequest={submitDeploymentRequest}
                redeployFailedDeploymentQuery={redeployFailedDeploymentQuery}
                getSubmitLatestServiceOrderStatusQuery={getSubmitLatestServiceOrderStatusQuery}
                deployedServiceDetails={getServiceDetailsQuery.data}
                serviceProviderContactDetails={serviceProviderContactDetails}
                retryRequest={retryRequest}
                onClose={onClose}
            />
        </>
    );
};
