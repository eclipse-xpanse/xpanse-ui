/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert } from 'antd';
import React from 'react';
import locksStyles from '../../../../styles/locks.module.css';
import {
    ApiError,
    DeployedServiceDetails,
    Response,
    VendorHostedDeployedServiceDetails,
} from '../../../../xpanse-api/generated';
import { convertStringArrayToUnorderedList } from '../../../utils/generateUnorderedList';
import { useLockRequestState } from './useLockRequest';

function LocksResult({
    currentSelectedService,
}: {
    currentSelectedService: DeployedServiceDetails | VendorHostedDeployedServiceDetails;
}): React.JSX.Element {
    const lockRequestState = useLockRequestState(currentSelectedService.serviceId);
    if (lockRequestState[0]?.status === 'success') {
        return (
            <Alert
                type={'success'}
                message={
                    <>
                        Service <b>{currentSelectedService.customerServiceName}</b> lock configuration updated
                    </>
                }
                className={locksStyles.alertResult}
            />
        );
    } else if (lockRequestState[0]?.status === 'error') {
        let errMsg: string[];
        if (
            lockRequestState[0] &&
            lockRequestState[0].error instanceof ApiError &&
            lockRequestState[0]?.error.body &&
            typeof lockRequestState[0]?.error.body === 'object' &&
            'details' in lockRequestState[0].error.body
        ) {
            const response: Response = lockRequestState[0].error.body as Response;
            errMsg = response.details;
        } else {
            errMsg = [
                lockRequestState[0].error !== null && lockRequestState[0] ? lockRequestState[0].error.message : '',
            ];
        }

        return (
            <Alert
                type={'error'}
                showIcon={true}
                message={`Service lock configuration update failed`}
                description={convertStringArrayToUnorderedList(errMsg)}
                className={locksStyles.alertResult}
            />
        );
    }

    return <></>;
}

export default LocksResult;
