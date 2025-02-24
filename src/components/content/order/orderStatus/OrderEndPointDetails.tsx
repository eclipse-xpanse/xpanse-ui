/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Skeleton } from 'antd';
import React from 'react';
import submitResultStyles from '../../../../styles/submit-result.module.css';
import { serviceHostingType, ServiceOrderStatusUpdate } from '../../../../xpanse-api/generated';
import { convertMapToDetailsList } from '../../../utils/convertMapToDetailsList.tsx';
import FallbackSkeleton from '../../common/lazy/FallBackSkeleton.tsx';
import { useServiceDetailsByServiceIdQuery } from '../../common/queries/useServiceDetailsByServiceIdQuery.ts';
import { OperationType } from '../types/OperationType.ts';

export function OrderEndPointDetails({
    serviceOrderStatus,
    serviceId,
    selectedServiceHostingType,
    operationType,
}: {
    serviceOrderStatus: ServiceOrderStatusUpdate;
    serviceId: string;
    selectedServiceHostingType: serviceHostingType;
    operationType: OperationType;
}): React.JSX.Element {
    const endPointMap = new Map<string, string>();
    const deployServiceDetailsQuery = useServiceDetailsByServiceIdQuery(
        serviceId,
        selectedServiceHostingType,
        serviceOrderStatus.orderStatus
    );
    if (
        deployServiceDetailsQuery.isPending ||
        deployServiceDetailsQuery.isFetching ||
        deployServiceDetailsQuery.isRefetching
    ) {
        return <Skeleton />;
    }
    if (deployServiceDetailsQuery.data) {
        if (deployServiceDetailsQuery.data.deployedServiceProperties) {
            for (const key in deployServiceDetailsQuery.data.deployedServiceProperties) {
                endPointMap.set(key, deployServiceDetailsQuery.data.deployedServiceProperties[key]);
            }
        }
        if (endPointMap.size > 0) {
            return (
                <>
                    <span>{getOperationResult(operationType)}</span>
                    <div className={submitResultStyles.resultContainer}>
                        {convertMapToDetailsList(endPointMap, 'Endpoint Information')}
                    </div>
                </>
            );
        } else {
            return <span>{getOperationResult(operationType)}</span>;
        }
    }

    function getOperationResult(type: OperationType): string {
        switch (type) {
            case OperationType.Deploy:
                return 'Deployment Successful';
            case OperationType.Destroy:
                return 'Destroy Successful';
            case OperationType.Modify:
                return 'Modification Successful';
            case OperationType.Recreate:
                return 'Recreation Successful';
            case OperationType.Port:
                return 'Service ported successfully';
            default:
                return 'Deployment Successful';
        }
    }
    return <FallbackSkeleton />;
}
