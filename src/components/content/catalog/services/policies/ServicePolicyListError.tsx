/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert } from 'antd';
import React from 'react';
import tableStyles from '../../../../../styles/table.module.css';
import { ApiError, Response } from '../../../../../xpanse-api/generated';
import { convertStringArrayToUnorderedList } from '../../../../utils/generateUnorderedList';

export default function ServicePolicyListError({ error }: { error: unknown }): React.JSX.Element {
    if (error instanceof ApiError && error.body && 'details' in error.body) {
        const response: Response = error.body as Response;
        return (
            <div>
                <Alert
                    message={response.resultType.valueOf()}
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
