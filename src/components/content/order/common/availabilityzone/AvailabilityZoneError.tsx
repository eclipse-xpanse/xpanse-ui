/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { ApiError, Response } from '../../../../../xpanse-api/generated';
import { Alert, Button } from 'antd';
import { convertStringArrayToUnorderedList } from '../../../../utils/generateUnorderedList';
export function AvailabilityZoneError({ retryRequest, error }: { retryRequest: () => void; error: Error }) {
    if (error instanceof ApiError && error.body && 'details' in error.body) {
        const response: Response = error.body as Response;
        return (
            <Alert
                message={response.resultType.valueOf()}
                description={convertStringArrayToUnorderedList(response.details)}
                type={'error'}
                closable={false}
                action={
                    <Button
                        className={'try-again-btn-class'}
                        size='small'
                        type='primary'
                        onClick={retryRequest}
                        danger={true}
                    >
                        Retry Request
                    </Button>
                }
            />
        );
    } else {
        return (
            <Alert
                message='Fetching Availability Regions Failed'
                description={error.message}
                type={'error'}
                closable={false}
                action={
                    <Button
                        className={'try-again-btn-class'}
                        size='small'
                        type='primary'
                        onClick={retryRequest}
                        danger={true}
                    >
                        Retry Request
                    </Button>
                }
            />
        );
    }
}
