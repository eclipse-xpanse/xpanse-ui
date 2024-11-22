/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert, Button, Card } from 'antd';
import React from 'react';
import errorAlertStyles from '../../../../styles/error-alert.module.css';
import { ApiError, ErrorResponse } from '../../../../xpanse-api/generated';
import { convertStringArrayToUnorderedList } from '../../../utils/generateUnorderedList';
import { isErrorResponse } from '../../common/error/isErrorResponse';

export default function DashBoardError({
    error,
    retryRequest,
}: {
    error: unknown;
    retryRequest: () => void;
}): React.JSX.Element {
    if (error instanceof ApiError && error.body && isErrorResponse(error.body)) {
        const response: ErrorResponse = error.body;
        return (
            <Card title='Services Dashboard' bordered={true}>
                <Alert
                    message={response.errorType.valueOf()}
                    description={convertStringArrayToUnorderedList(response.details)}
                    type={'error'}
                    closable={false}
                    className={errorAlertStyles.errorFailureAlert}
                    action={
                        <Button
                            className={errorAlertStyles.tryAgainBtnInAlertClass}
                            size='small'
                            type='primary'
                            onClick={retryRequest}
                            danger={true}
                        >
                            Retry Request
                        </Button>
                    }
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
                    className={errorAlertStyles.errorFailureAlert}
                    action={
                        <Button
                            className={errorAlertStyles.tryAgainBtnInAlertClass}
                            size='small'
                            type='primary'
                            onClick={retryRequest}
                            danger={true}
                        >
                            Retry Request
                        </Button>
                    }
                />
            </Card>
        );
    }
}
