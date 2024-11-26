/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert } from 'antd';
import React from 'react';
import tableStyles from '../../../../../styles/table.module.css';
import { ApiError, ErrorResponse } from '../../../../../xpanse-api/generated';
import { convertStringArrayToUnorderedList } from '../../../../utils/generateUnorderedList';
import { isErrorResponse } from '../../../common/error/isErrorResponse';

export default function ServicePolicyListError({ error }: { error: unknown }): React.JSX.Element {
    if (error instanceof ApiError && error.body && isErrorResponse(error.body)) {
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
                    description={(error as Error).message}
                    type={'error'}
                    closable={false}
                    className={tableStyles.tableLoadFailureAlert}
                />
            </div>
        );
    }
}
