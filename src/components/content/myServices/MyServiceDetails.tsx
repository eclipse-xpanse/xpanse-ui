/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import '../../../styles/app.css';
import { convertStringArrayToUnorderedList } from '../../utils/generateUnorderedList';
import { useQuery } from '@tanstack/react-query';
import { ApiError, DeployResource, Response, ServiceService } from '../../../xpanse-api/generated';
import { Alert, Skeleton } from 'antd';
import React from 'react';
import { ServiceDetailsContent } from './ServiceDetailsContent';
import { DeploymentResultMessage } from './DeploymentResultMessage';
export const MyServiceDetails = ({ serviceId }: { serviceId: string }): React.JSX.Element => {
    const getServiceDetailsByIdQuery = useQuery({
        queryKey: ['getServiceDetailsById', serviceId],
        queryFn: () => ServiceService.getServiceDetailsById(serviceId),
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
        if (getServiceDetailsByIdQuery.data.resultMessage) {
            resultMessage = DeploymentResultMessage(getServiceDetailsByIdQuery.data.resultMessage);
        }
        if (getServiceDetailsByIdQuery.data.deployResources) {
            deployResourceMap = getServiceDetailsByIdQuery.data.deployResources;
        }
        return (
            <>
                <ServiceDetailsContent
                    content={endPointMap}
                    requestParams={requestMap}
                    resultMessage={resultMessage}
                    deployResources={deployResourceMap}
                />
            </>
        );
    }

    if (getServiceDetailsByIdQuery.isLoading) {
        return (
            <Skeleton
                className={'my-service-details-skeleton'}
                active={true}
                loading={getServiceDetailsByIdQuery.isLoading}
                paragraph={{ rows: 2, width: ['20%', '20%'] }}
                title={{ width: '5%' }}
            />
        );
    }

    if (getServiceDetailsByIdQuery.error instanceof ApiError && 'details' in getServiceDetailsByIdQuery.error.body) {
        const response: Response = getServiceDetailsByIdQuery.error.body as Response;
        return (
            <Alert
                message={response.resultType.valueOf()}
                description={convertStringArrayToUnorderedList(response.details)}
                type={'error'}
                closable={true}
                className={'my-service-details-skeleton'}
            />
        );
    } else if (getServiceDetailsByIdQuery.error instanceof Error) {
        return (
            <Alert
                message='Fetching Service Details Failed'
                description={getServiceDetailsByIdQuery.error.message}
                type={'error'}
                closable={true}
                className={'my-service-details-skeleton'}
            />
        );
    }

    return <></>;
};
