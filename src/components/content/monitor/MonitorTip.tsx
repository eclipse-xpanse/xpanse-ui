/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert, Button } from 'antd';
import React from 'react';
import errorAlertStyles from '../../../styles/error-alert.module.css';
import monitorStyles from '../../../styles/monitor.module.css';
import { ErrorResponse } from '../../../xpanse-api/generated';
import { isHandleKnownErrorResponse } from '../common/error/isHandleKnownErrorResponse.ts';

export const MonitorTip = ({
    error,
    isNoMetricsAvailable,
    onRemove,
    retryRequest,
}: {
    error: Error | null;
    isNoMetricsAvailable: boolean;
    onRemove: () => void;
    retryRequest: () => void;
}): React.JSX.Element => {
    const getMessage = (error: Error | null, isNoMetricAvailable: boolean) => {
        if (error) {
            if (isHandleKnownErrorResponse(error)) {
                const response: ErrorResponse = error.body;
                return response.errorType.valueOf();
            } else {
                return 'Error while fetching metrics data.';
            }
        } else if (isNoMetricAvailable) {
            return 'No metrics found for the selected service.';
        }
        return '';
    };

    const getDescription = (error: Error | null, isNoMetricAvailable: boolean) => {
        if (error) {
            if (isHandleKnownErrorResponse(error)) {
                const response: ErrorResponse = error.body;
                return response.details.join();
            } else {
                return error.message;
            }
        } else if (isNoMetricAvailable) {
            return '';
        }
        return '';
    };

    return (
        <div className={monitorStyles.monitorTipClass}>
            {' '}
            <Alert
                showIcon={true}
                message={getMessage(error, isNoMetricsAvailable)}
                description={getDescription(error, isNoMetricsAvailable)}
                type={'error'}
                onClose={onRemove}
                closable={true}
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
            />{' '}
        </div>
    );
};
