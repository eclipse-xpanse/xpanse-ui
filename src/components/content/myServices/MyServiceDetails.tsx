/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import '../../../styles/app.css';
import { convertMapToUnorderedList, convertStringArrayToUnorderedList } from '../../utils/generateUnorderedList';
import { useQuery } from '@tanstack/react-query';
import { ApiError, Response, ServiceService } from '../../../xpanse-api/generated';
import { getUserName } from '../../oidc/OidcConfig';
import { OidcIdToken } from '@axa-fr/react-oidc/dist/ReactOidc';
import { useOidcIdToken } from '@axa-fr/react-oidc';
import { Alert, Skeleton } from 'antd';
import React from 'react';
export const MyServiceDetails = ({ serviceId }: { serviceId: string }): React.JSX.Element => {
    const oidcIdToken: OidcIdToken = useOidcIdToken();
    const userName = getUserName(oidcIdToken.idTokenPayload as object);
    const getDeployedServicesDetailsByIdQuery = useQuery({
        queryKey: ['getDeployedServiceDetailsById', serviceId, userName],
        queryFn: () => ServiceService.getDeployedServiceDetailsById(serviceId, userName),
        refetchOnWindowFocus: false,
    });

    if (getDeployedServicesDetailsByIdQuery.isSuccess) {
        const endPointMap = new Map<string, string>();
        const requestMap = new Map<string, string>();
        const resultMessageMap = new Map<string, string>();
        if (getDeployedServicesDetailsByIdQuery.data.deployedServiceProperties) {
            for (const key in getDeployedServicesDetailsByIdQuery.data.deployedServiceProperties) {
                endPointMap.set(key, getDeployedServicesDetailsByIdQuery.data.deployedServiceProperties[key]);
            }
        }
        if (getDeployedServicesDetailsByIdQuery.data.createRequest.serviceRequestProperties) {
            for (const key in getDeployedServicesDetailsByIdQuery.data.createRequest.serviceRequestProperties) {
                requestMap.set(
                    key,
                    getDeployedServicesDetailsByIdQuery.data.createRequest.serviceRequestProperties[key]
                );
            }
        }
        if (getDeployedServicesDetailsByIdQuery.data.resultMessage) {
            resultMessageMap.set('Result message details', getDeployedServicesDetailsByIdQuery.data.resultMessage);
        }

        return <>{getContent(endPointMap, requestMap, resultMessageMap)}</>;
    }

    if (getDeployedServicesDetailsByIdQuery.isLoading) {
        return (
            <Skeleton
                className={'my-service-details-skeleton'}
                active={true}
                loading={getDeployedServicesDetailsByIdQuery.isLoading}
                paragraph={{ rows: 2, width: ['20%', '20%'] }}
                title={{ width: '5%' }}
            />
        );
    }

    if (
        getDeployedServicesDetailsByIdQuery.error instanceof ApiError &&
        'details' in getDeployedServicesDetailsByIdQuery.error.body
    ) {
        const response: Response = getDeployedServicesDetailsByIdQuery.error.body as Response;
        return (
            <Alert
                message={response.resultType.valueOf()}
                description={convertStringArrayToUnorderedList(response.details)}
                type={'error'}
                closable={true}
                className={'my-service-details-skeleton'}
            />
        );
    } else if (getDeployedServicesDetailsByIdQuery.error instanceof Error) {
        return (
            <Alert
                message='Fetching Service Details Failed'
                description={getDeployedServicesDetailsByIdQuery.error.message}
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
