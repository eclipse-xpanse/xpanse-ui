/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert } from 'antd';
import React from 'react';
import submitAlertStyles from '../../../../styles/submit-alert.module.css';
import UserPolicySubmitResultDetails from '../UserPolicySubmitResultDetails.tsx';

export default function UpdateSubmitResult({ isUpdated }: { isUpdated: boolean }): React.JSX.Element {
    if (isUpdated) {
        return (
            <div className={submitAlertStyles.submitAlertTip}>
                {' '}
                <Alert
                    message={'There is no change in the current data'}
                    description={<UserPolicySubmitResultDetails msg={'Policy update request failed'} uuid={''} />}
                    showIcon
                    closable={true}
                    type={'error'}
                />{' '}
            </div>
        );
    }

    return <></>;
}
