/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert } from 'antd';
import React from 'react';
import { ApiError, Response } from '../../../../xpanse-api/generated';
import { convertStringArrayToUnorderedList } from '../../../utils/generateUnorderedList';

function ServicesLoadingError({ error }: { error: unknown }): React.JSX.Element {
    if (error instanceof ApiError && 'details' in error.body) {
        const response: Response = error.body as Response;
        return (
            <Alert
                message={response.resultType.valueOf()}
                description={convertStringArrayToUnorderedList(response.details)}
                type={'error'}
                closable={true}
                className={'services-loading-error'}
            />
        );
    } else {
        return (
            <Alert
                message='Fetching Available Services Failed'
                description={(error as Error).message}
                type={'error'}
                closable={true}
                className={'services-loading-error'}
            />
        );
    }
}

export default ServicesLoadingError;
