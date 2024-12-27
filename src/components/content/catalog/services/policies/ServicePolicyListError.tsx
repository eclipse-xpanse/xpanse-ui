/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert } from 'antd';
import React from 'react';
import tableStyles from '../../../../../styles/table.module.css';
import { ErrorResponse } from '../../../../../xpanse-api/generated';
import { convertStringArrayToUnorderedList } from '../../../../utils/generateUnorderedList';
import { isHandleKnownErrorResponse } from '../../../common/error/isHandleKnownErrorResponse.ts';

export default function ServicePolicyListError({ error }: { error: Error }): React.JSX.Element {
    if (isHandleKnownErrorResponse(error)) {
        const response: ErrorResponse = error.body;
        return (
            <div>
                <Alert
                    message={response.errorType.valueOf()}
                    description={convertStringArrayToUnorderedList(response.details)}
                    type={'error'}
                    closable={false}
                    className={tableStyles.tableLoadFailureAlert}
                />
            </div>
        );
    } else {
        return (
            <div>
                <Alert
                    message='Fetching Service Policies Details Failed'
                    description={error.message}
                    type={'error'}
                    closable={false}
                    className={tableStyles.tableLoadFailureAlert}
                />
            </div>
        );
    }
}
