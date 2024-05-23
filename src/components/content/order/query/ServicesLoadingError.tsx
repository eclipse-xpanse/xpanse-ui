/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert } from 'antd';
import React from 'react';
import serviceOrderStyles from '../../../../styles/service-order.module.css';
import { ApiError, Response } from '../../../../xpanse-api/generated';
import { convertStringArrayToUnorderedList } from '../../../utils/generateUnorderedList';

function ServicesLoadingError({ error }: { error: unknown }): React.JSX.Element {
    if (error instanceof ApiError && error.body && 'details' in error.body) {
        const response: Response = error.body as Response;
        return (
            <Alert
                message={response.resultType.valueOf()}
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
                description={(error as Error).message}
                type={'error'}
                closable={true}
                className={serviceOrderStyles.servicesLoadingError}
            />
        );
    }
}

export default ServicesLoadingError;
