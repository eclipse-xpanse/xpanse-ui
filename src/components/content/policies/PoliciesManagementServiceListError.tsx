/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert } from 'antd';
import React from 'react';
import errorAlertStyles from '../../../styles/error-alert.module.css';
import { ApiError, ErrorResponse } from '../../../xpanse-api/generated';
import { convertStringArrayToUnorderedList } from '../../utils/generateUnorderedList';
import { isErrorResponse } from '../common/error/isErrorResponse';

export default function PoliciesManagementServiceListError({ error }: { error: unknown }): React.JSX.Element {
    if (error instanceof ApiError && error.body && isErrorResponse(error.body)) {
        const response: ErrorResponse = error.body;
        return (
            <div>
                <Alert
                    message={response.errorType.valueOf()}
                    description={convertStringArrayToUnorderedList(response.details)}
                    type={'error'}
                    closable={false}
                    className={errorAlertStyles.errorFailureAlert}
                />
            </div>
        );
    } else {
        return (
            <div>
                <Alert
                    message='Fetching Policies Management Service Details Failed'
                    description={(error as Error).message}
                    type={'error'}
                    closable={false}
                    className={errorAlertStyles.errorFailureAlert}
                />
            </div>
        );
    }
}
