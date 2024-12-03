/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert, Button } from 'antd';
import React from 'react';
import errorAlertStyles from '../../../../../styles/error-alert.module.css';
import serviceOrderStyles from '../../../../../styles/service-order.module.css';
import { ApiError } from '../../../../../xpanse-api/generated';
import { convertStringArrayToUnorderedList } from '../../../../utils/generateUnorderedList';

export function AvailabilityZoneError({
    isAvailabilityZoneMandatory,
    retryRequest,
    error,
}: {
    isAvailabilityZoneMandatory: boolean;
    retryRequest: () => void;
    error: Error;
}): React.JSX.Element {
    if (isAvailabilityZoneMandatory) {
        if (error instanceof ApiError && error.body && Array.isArray(error.body)) {
            return (
                <Alert
                    message='Fetching Availability Regions Failed'
                    description={convertStringArrayToUnorderedList(error.body as string[])}
                    type={'error'}
                    closable={false}
                    action={
                        <Button
                            className={errorAlertStyles.tryAgainBtnInAlertClass}
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
                            className={errorAlertStyles.tryAgainBtnInAlertClass}
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
    } else {
        return (
            <p className={serviceOrderStyles.orderFormAlert}>
                <Alert
                    message={
                        'Fetching Availability Regions Failed - This is not a mandatory field. You can proceed without this, ' +
                        'and the service will be deployed on one of the availability zones of the regions by default.'
                    }
                    description={
                        error instanceof ApiError && error.body && Array.isArray(error.body)
                            ? convertStringArrayToUnorderedList(error.body as string[])
                            : error.message
                    }
                    type={'warning'}
                    closable={false}
                    action={
                        <Button
                            className={errorAlertStyles.tryAgainBtnInAlertClass}
                            size='small'
                            type='primary'
                            onClick={retryRequest}
                            danger={true}
                        >
                            Retry Request
                        </Button>
                    }
                />
            </p>
        );
    }
}
