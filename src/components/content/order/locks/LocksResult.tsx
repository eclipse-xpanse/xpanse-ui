/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert } from 'antd';
import React from 'react';
import '../../../../styles/locks.css';
import { convertStringArrayToUnorderedList } from '../../../utils/generateUnorderedList';
import { DeployedServiceDetails, VendorHostedDeployedServiceDetails } from '../../../../xpanse-api/generated';

function LocksResult({
    currentSelectedService,
    lockRequestStatus,
    requestResult,
}: {
    currentSelectedService: DeployedServiceDetails | VendorHostedDeployedServiceDetails;
    lockRequestStatus: string;
    requestResult: string[];
}): React.JSX.Element {
    if (lockRequestStatus === 'success') {
        return (
            <Alert
                type={'success'}
                message={
                    <>
                        Service <b>{currentSelectedService.customerServiceName}</b> lock configuration updated
                    </>
                }
                className={'alert-result'}
                description={convertStringArrayToUnorderedList(requestResult)}
            />
        );
    } else if (lockRequestStatus === 'error') {
        return (
            <Alert
                type={'error'}
                showIcon={true}
                message={`Service lock configuration update failed`}
                description={convertStringArrayToUnorderedList(requestResult)}
                className={'alert-result'}
            />
        );
    }

    return <></>;
}

export default LocksResult;
