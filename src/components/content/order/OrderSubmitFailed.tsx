/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { MigrateSubmitResult, OrderSubmitResult } from './OrderSubmitResult';
import { convertStringArrayToUnorderedList } from '../../utils/generateUnorderedList';
import { ApiError, Response, ServiceDetailVo } from '../../../xpanse-api/generated';
import { StopwatchResult } from 'react-timer-hook';

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
    deploymentStatus: ServiceDetailVo.serviceDeploymentState,
    stopWatch: StopwatchResult
): JSX.Element {
    if (error instanceof ApiError && 'details' in error.body) {
        const response: Response = error.body as Response;
        return OrderSubmitResult(
            getOrderSubmissionFailedDisplay(response.details),
            '-',
            'error',
            deploymentStatus,
            stopWatch
        );
    }
    return OrderSubmitResult(
        getOrderSubmissionFailedDisplay([error.message]),
        '-',
        'error',
        deploymentStatus,
        stopWatch
    );
}

export const MigrateSubmitFailed = (error: Error): JSX.Element => {
    if (error instanceof ApiError && 'details' in error.body) {
        const response: Response = error.body as Response;
        return MigrateSubmitResult(getOrderSubmissionFailedDisplay(response.details), '-', 'error');
    }
    return MigrateSubmitResult(getOrderSubmissionFailedDisplay([error.message]), '-', 'error');
};
