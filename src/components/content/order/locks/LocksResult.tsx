/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert } from 'antd';
import React from 'react';
import '../../../../styles/locks.css';
import { convertStringArrayToUnorderedList } from '../../../utils/generateUnorderedList';
import {
    ApiError,
    DeployedServiceDetails,
    Response,
    VendorHostedDeployedServiceDetails,
} from '../../../../xpanse-api/generated';
import { useLockRequestState } from './useLockRequest';

function LocksResult({
    currentSelectedService,
}: {
    currentSelectedService: DeployedServiceDetails | VendorHostedDeployedServiceDetails;
}): React.JSX.Element {
    const lockRequestState = useLockRequestState(currentSelectedService.id);
    if (lockRequestState[0]?.status === 'success') {
        return (
            <Alert
                type={'success'}
                message={
                    <>
                        Service <b>{currentSelectedService.customerServiceName}</b> lock configuration updated
                    </>
                }
                className={'alert-result'}
            />
        );
    } else if (lockRequestState[0]?.status === 'error') {
        let errMsg: string[];
        if (
            lockRequestState[0] &&
            lockRequestState[0].error instanceof ApiError &&
            lockRequestState[0]?.error.body &&
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
                className={'alert-result'}
            />
        );
    }

    return <></>;
}

export default LocksResult;
