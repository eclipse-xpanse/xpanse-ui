/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert } from 'antd';

function ServicesLoadingError(): JSX.Element {
    return (
        <div>
            <br />
            <Alert
                type={'error'}
                message={'Error while loading available services'}
                className={'services-loading-error'}
            />
        </div>
    );
}

export default ServicesLoadingError;
