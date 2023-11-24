/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import '../../../../styles/app.css';
import { useQuery } from '@tanstack/react-query';
import {
    DeployedService,
    DeployedServiceDetails,
    DeployResource,
    ServiceService,
} from '../../../../xpanse-api/generated';
import React from 'react';
import { DeploymentResultMessage } from '../common/DeploymentResultMessage';
import { DeployedServicesDetailsContent } from '../common/DeployedServicesDetailsContent';
import { GetServiceDetailsByIdQueryLoading } from '../common/GetServiceDetailsByIdQueryLoading';
import DeployedServicesError from '../common/DeployedServicesError';

export const MyServiceDetails = ({
    serviceId,
    serviceHostingType,
}: {
    serviceId: string;
    serviceHostingType: DeployedService.serviceHostingType;
}): React.JSX.Element => {
    const getServiceDetailsByIdQuery = useQuery({
        queryKey: ['getServiceDetailsById', serviceId, serviceHostingType],
        queryFn: () => {
            if (serviceHostingType === DeployedService.serviceHostingType.SELF) {
                return ServiceService.getSelfHostedServiceDetailsById(serviceId);
            } else {
                return ServiceService.getVendorHostedServiceDetailsById(serviceId);
            }
        },
        refetchOnWindowFocus: false,
    });

    if (getServiceDetailsByIdQuery.isSuccess) {
        const endPointMap = new Map<string, string>();
        const requestMap = new Map<string, unknown>();
        let resultMessage = undefined;
        let deployResourceMap: DeployResource[] = [];
        if (getServiceDetailsByIdQuery.data.deployedServiceProperties) {
            for (const key in getServiceDetailsByIdQuery.data.deployedServiceProperties) {
                endPointMap.set(key, getServiceDetailsByIdQuery.data.deployedServiceProperties[key]);
            }
        }
        if (getServiceDetailsByIdQuery.data.deployRequest.serviceRequestProperties) {
            for (const key in getServiceDetailsByIdQuery.data.deployRequest.serviceRequestProperties) {
                requestMap.set(key, getServiceDetailsByIdQuery.data.deployRequest.serviceRequestProperties[key]);
            }
        }
        if (serviceHostingType === DeployedService.serviceHostingType.SELF) {
            const serviceDetailVo = getServiceDetailsByIdQuery.data as DeployedServiceDetails;
            if (serviceDetailVo.resultMessage) {
                resultMessage = DeploymentResultMessage(serviceDetailVo.resultMessage);
            }
            if (serviceDetailVo.deployResources) {
                deployResourceMap = serviceDetailVo.deployResources;
            }
        }
        return (
            <>
                <DeployedServicesDetailsContent
                    content={endPointMap}
                    requestParams={requestMap}
                    resultMessage={resultMessage}
                    deployResources={deployResourceMap}
                />
            </>
        );
    }

    if (getServiceDetailsByIdQuery.isLoading) {
        return <GetServiceDetailsByIdQueryLoading isLoading={getServiceDetailsByIdQuery.isLoading} />;
    }

    if (getServiceDetailsByIdQuery.isError) {
        return <DeployedServicesError error={getServiceDetailsByIdQuery.error} />;
    }

    return <></>;
};
