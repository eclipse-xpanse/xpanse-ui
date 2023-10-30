/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert, Card } from 'antd';
import React from 'react';
import { ApiError, Response } from '../../../xpanse-api/generated';
import { convertStringArrayToUnorderedList } from '../../utils/generateUnorderedList';

export default function ServicesDashboardError({ error }: { error: unknown }): React.JSX.Element {
    if (error instanceof ApiError && 'details' in error.body) {
        const response: Response = error.body as Response;
        return (
            <Card title='Services Dashboard' bordered={true}>
                <Alert
                    message={response.resultType.valueOf()}
                    description={convertStringArrayToUnorderedList(response.details)}
                    type={'error'}
                    closable={false}
                    className={'failure-alert'}
                />
            </Card>
        );
    } else {
        return (
            <Card title='Services Dashboard' bordered={true}>
                <Alert
                    message='Fetching Service Details Failed'
                    description={(error as Error).message}
                    type={'error'}
                    closable={false}
                    className={'failure-alert'}
                />
            </Card>
        );
    }
}
