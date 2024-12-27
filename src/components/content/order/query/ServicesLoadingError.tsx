/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert } from 'antd';
import React from 'react';
import serviceOrderStyles from '../../../../styles/service-order.module.css';
import { ErrorResponse } from '../../../../xpanse-api/generated';
import { convertStringArrayToUnorderedList } from '../../../utils/generateUnorderedList';
import { isHandleKnownErrorResponse } from '../../common/error/isHandleKnownErrorResponse.ts';

function ServicesLoadingError({ error }: { error: Error }): React.JSX.Element {
    if (isHandleKnownErrorResponse(error)) {
        const response: ErrorResponse = error.body;
        return (
            <Alert
                message={response.errorType.valueOf()}
                description={convertStringArrayToUnorderedList(response.details)}
                type={'error'}
                closable={true}
                className={serviceOrderStyles.servicesLoadingError}
            />
        );
    } else {
        return (
            <Alert
                message='Fetching Available Services Failed'
                description={error.message}
                type={'error'}
                closable={true}
                className={serviceOrderStyles.servicesLoadingError}
            />
        );
    }
}

export default ServicesLoadingError;
