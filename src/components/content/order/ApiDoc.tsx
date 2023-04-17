/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { LinkOutlined } from '@ant-design/icons';
import { serviceVendorApi } from '../../../xpanse-api/xpanseRestApiClient';
import '../../../styles/app.css';

export function ApiDoc({ id }: { id: string }): JSX.Element {
    function onclick() {
        serviceVendorApi
            .openApi(id)
            .then((resp: string) => {
                window.open(resp);
            })
            .catch((error) => {
                console.error(error);
            });
    }
    return (
        <button className={'content-title-api'} onClick={onclick}>
            <LinkOutlined /> API Documentation
        </button>
    );
}
