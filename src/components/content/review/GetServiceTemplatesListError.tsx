/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert } from 'antd';
import React from 'react';
import errorAlertStyles from '../../../styles/error-alert.module.css';
import { ErrorResponse } from '../../../xpanse-api/generated';
import { convertStringArrayToUnorderedList } from '../../utils/generateUnorderedList';
import { isHandleKnownErrorResponse } from '../common/error/isHandleKnownErrorResponse.ts';

export default function GetServiceTemplatesListError({ error }: { error: Error }): React.JSX.Element {
    if (isHandleKnownErrorResponse(error)) {
        const response: ErrorResponse = error.body;
        return (
            <Alert
                message={response.errorType.valueOf()}
                description={convertStringArrayToUnorderedList(response.details)}
                type={'error'}
                closable={true}
                className={errorAlertStyles.errorFailureAlert}
            />
        );
    } else {
        return (
            <Alert
                message='Fetching Service Details Failed'
                description={error.message}
                type={'error'}
                closable={true}
                className={errorAlertStyles.errorFailureAlert}
            />
        );
    }
}
