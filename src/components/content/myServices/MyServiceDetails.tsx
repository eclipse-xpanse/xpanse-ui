/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import '../../../styles/app.css';
import { convertMapToUnorderedList, convertStringArrayToUnorderedList } from '../../utils/generateUnorderedList';
import { useQuery } from '@tanstack/react-query';
import { ApiError, Response, ServiceService } from '../../../xpanse-api/generated';
import { Alert, Skeleton } from 'antd';
import React from 'react';
export const MyServiceDetails = ({ serviceId }: { serviceId: string }): React.JSX.Element => {
    const getServiceDetailsByIdQuery = useQuery({
        queryKey: ['getServiceDetailsById', serviceId],
        queryFn: () => ServiceService.getServiceDetailsById(serviceId),
        refetchOnWindowFocus: false,
    });

    if (getServiceDetailsByIdQuery.isSuccess) {
        const endPointMap = new Map<string, string>();
        const requestMap = new Map<string, string>();
        const resultMessageMap = new Map<string, string>();
        if (getServiceDetailsByIdQuery.data.deployedServiceProperties) {
            for (const key in getServiceDetailsByIdQuery.data.deployedServiceProperties) {
                endPointMap.set(key, getServiceDetailsByIdQuery.data.deployedServiceProperties[key]);
            }
        }
        if (getServiceDetailsByIdQuery.data.createRequest.serviceRequestProperties) {
            for (const key in getServiceDetailsByIdQuery.data.createRequest.serviceRequestProperties) {
                requestMap.set(key, getServiceDetailsByIdQuery.data.createRequest.serviceRequestProperties[key]);
            }
        }
        if (getServiceDetailsByIdQuery.data.resultMessage) {
            resultMessageMap.set('Result message details', getServiceDetailsByIdQuery.data.resultMessage);
        }

        return <>{getContent(endPointMap, requestMap, resultMessageMap)}</>;
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

    function getContent(
        content: Map<string, string>,
        requestParams: Map<string, string>,
        resultMessage: Map<string, string>
    ): string | React.JSX.Element {
        const items: React.JSX.Element[] = [];
        if (content.size > 0) {
            const endPointInfo: string | React.JSX.Element = convertMapToUnorderedList(content, 'Endpoint Information');
            items.push(endPointInfo as React.JSX.Element);
        }
        if (requestParams.size > 0) {
            const requestParam: string | React.JSX.Element = convertMapToUnorderedList(
                requestParams,
                'Request Parameters'
            );
            items.push(requestParam as React.JSX.Element);
        }
        if (resultMessage.size > 0) {
            const result: string | React.JSX.Element = convertMapToUnorderedList(resultMessage, 'Result Message');
            items.push(result as React.JSX.Element);
        }
        return <span>{items}</span>;
    }

    return <></>;
};
