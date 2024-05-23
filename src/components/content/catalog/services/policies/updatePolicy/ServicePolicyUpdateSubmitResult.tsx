/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert } from 'antd';
import React from 'react';
import submitAlertStyles from '../../../../../../styles/submit-alert.module.css';
import ServicePolicySubmitResult from '../ServicePolicySubmitResult';

export default function ServicePolicyUpdateSubmitResult({ isUpdated }: { isUpdated: boolean }): React.JSX.Element {
    if (isUpdated) {
        return (
            <div className={submitAlertStyles.submitAlertTip}>
                {' '}
                <Alert
                    message={'There is no change in the current data'}
                    description={<ServicePolicySubmitResult msg={'Policy update request failed'} uuid={''} />}
                    showIcon
                    closable={true}
                    type={'error'}
                />{' '}
            </div>
        );
    }

    return <></>;
}
