/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert, Button, Row } from 'antd';
import React from 'react';
import errorAlertStyles from '../../../../styles/error-alert.module.css';
import tableStyles from '../../../../styles/table.module.css';
import { ErrorResponse } from '../../../../xpanse-api/generated';
import { convertStringArrayToUnorderedList } from '../../../utils/generateUnorderedList.tsx';
import { isHandleKnownErrorResponse } from './isHandleKnownErrorResponse.ts';

export default function RetryPrompt({
    error,
    retryRequest,
    errorMessage,
}: {
    error: Error;
    retryRequest: () => void;
    errorMessage: string;
}): React.JSX.Element {
    if (isHandleKnownErrorResponse(error)) {
        const response: ErrorResponse = error.body;
        return (
            <div>
                <Alert
                    showIcon={true}
                    message={response.errorType.valueOf()}
                    description={convertStringArrayToUnorderedList(response.details)}
                    type={'error'}
                    closable={true}
                    className={tableStyles.tableLoadFailureAlert}
                    action={
                        <>
                            <Row>
                                <Button
                                    className={errorAlertStyles.tryAgainBtnInAlertClass}
                                    size='small'
                                    type='primary'
                                    onClick={retryRequest}
                                    danger={true}
                                >
                                    Retry Request
                                </Button>
                            </Row>
                        </>
                    }
                />
            </div>
        );
    } else {
        return (
            <div>
                <Alert
                    showIcon={true}
                    message={errorMessage}
                    description={error.message}
                    type={'error'}
                    closable={true}
                    className={tableStyles.tableLoadFailureAlert}
                    action={
                        <>
                            <Row>
                                <Button
                                    className={errorAlertStyles.tryAgainBtnInAlertClass}
                                    size='small'
                                    type='primary'
                                    onClick={retryRequest}
                                    danger={true}
                                >
                                    Retry Request
                                </Button>
                            </Row>
                        </>
                    }
                />
            </div>
        );
    }
}
