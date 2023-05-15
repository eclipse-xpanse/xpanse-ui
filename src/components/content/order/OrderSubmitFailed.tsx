/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import OrderSubmitResult from './OrderSubmitResult';
import { convertStringArrayToUnorderedList } from '../../utils/generateUnorderedList';
import { ApiError, Response } from '../../../xpanse-api/generated';

function getOrderSubmissionFailedDisplay(reasons: string[]) {
    return (
        <div>
            <span>{'Service deployment request failed.'}</span>
            <div>{convertStringArrayToUnorderedList(reasons)}</div>
        </div>
    );
}
function OrderSubmitFailed(error: Error): JSX.Element {
    if (error instanceof ApiError && 'details' in error.body) {
        const response: Response = error.body as Response;
        return OrderSubmitResult(getOrderSubmissionFailedDisplay(response.details), '-', 'error');
    }
    return OrderSubmitResult(getOrderSubmissionFailedDisplay([error.message]), '-', 'error');
}

export default OrderSubmitFailed;
