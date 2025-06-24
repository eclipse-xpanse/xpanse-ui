/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert, Skeleton } from 'antd';
import React from 'react';
import myServicesStyle from '../../../../styles/my-services.module.css';
import { DeployResource, ErrorResponse } from '../../../../xpanse-api/generated';
import { convertStringArrayToUnorderedList } from '../../../utils/generateUnorderedList';
import { isHandleKnownErrorResponse } from '../../common/error/isHandleKnownErrorResponse.ts';
import { DeployedServicesDetailsContent } from '../common/DeployedServicesDetailsContent';
import useGetServiceDetailsByIdForIsvQuery from './query/useGetServiceDetailsByIdForIsvQuery';

export const ReportsServiceDetails = ({ serviceId }: { serviceId: string }): React.JSX.Element => {
    const getServiceDetailsByIdQuery = useGetServiceDetailsByIdForIsvQuery(serviceId);

    if (getServiceDetailsByIdQuery.isSuccess) {
        const endPointMap = new Map<string, string>();
        const requestMap = new Map<string, string>();
        let deployResourceMap: DeployResource[] = [];
        if (getServiceDetailsByIdQuery.data.deployedServiceProperties) {
            for (const key in getServiceDetailsByIdQuery.data.deployedServiceProperties) {
                endPointMap.set(key, getServiceDetailsByIdQuery.data.deployedServiceProperties[key]);
            }
        }
        if (getServiceDetailsByIdQuery.data.inputProperties) {
            for (const key in getServiceDetailsByIdQuery.data.inputProperties) {
                requestMap.set(key, getServiceDetailsByIdQuery.data.inputProperties[key]);
            }
        }

        const serviceDetailVo = getServiceDetailsByIdQuery.data;
        if (serviceDetailVo.deployResources) {
            deployResourceMap = serviceDetailVo.deployResources;
        }

        return (
            <>
                <DeployedServicesDetailsContent
                    content={endPointMap}
                    requestParams={requestMap}
                    deployResources={deployResourceMap}
                />
            </>
        );
    }

    if (getServiceDetailsByIdQuery.isLoading) {
        return (
            <Skeleton
                className={myServicesStyle.myServiceDetailsSkeleton}
                active={true}
                loading={getServiceDetailsByIdQuery.isLoading}
                paragraph={{ rows: 2, width: ['20%', '20%'] }}
                title={{ width: '5%' }}
            />
        );
    }

    if (getServiceDetailsByIdQuery.isError) {
        if (isHandleKnownErrorResponse(getServiceDetailsByIdQuery.error)) {
            const response: ErrorResponse = getServiceDetailsByIdQuery.error.body;
            return (
                <Alert
                    message={response.errorType.valueOf()}
                    description={convertStringArrayToUnorderedList(response.details)}
                    type={'error'}
                    closable={true}
                    className={myServicesStyle.myServiceDetailsSkeleton}
                />
            );
        } else {
            return (
                <Alert
                    message='Fetching Service Details Failed'
                    description={getServiceDetailsByIdQuery.error.message}
                    type={'error'}
                    closable={true}
                    className={myServicesStyle.myServiceDetailsSkeleton}
                />
            );
        }
    }

    return <></>;
};
