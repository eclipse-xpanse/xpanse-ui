/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { OrderSubmitResult } from './OrderSubmitResult';
import { convertStringArrayToUnorderedList } from '../../../utils/generateUnorderedList';
import {
    ApiError,
    DeployedServiceDetails,
    Response,
    ServiceProviderContactDetails,
} from '../../../../xpanse-api/generated';
import { StopwatchResult } from 'react-timer-hook';
import React from 'react';
import { OperationType } from '../types/OperationType';

function getOrderSubmissionFailedDisplay(reasons: string[]) {
    return (
        <div>
            <span>{'Service deployment request failed.'}</span>
            <div>{convertStringArrayToUnorderedList(reasons)}</div>
        </div>
    );
}

export function OrderSubmitFailed(
    error: Error,
    deploymentStatus: DeployedServiceDetails.serviceDeploymentState,
    stopWatch: StopwatchResult,
    operationType: OperationType,
    contactServiceDetails: ServiceProviderContactDetails | undefined
): React.JSX.Element {
    if (error instanceof ApiError && error.body && 'details' in error.body) {
        const response: Response = error.body as Response;
        return OrderSubmitResult(
            getOrderSubmissionFailedDisplay(response.details),
            '-',
            'error',
            deploymentStatus,
            stopWatch,
            operationType,
            contactServiceDetails
        );
    }
    return OrderSubmitResult(
        getOrderSubmissionFailedDisplay([error.message]),
        '-',
        'error',
        deploymentStatus,
        stopWatch,
        operationType,
        contactServiceDetails
    );
}
