/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { LinkOutlined } from '@ant-design/icons';
import { serviceVendorApi } from '../../../xpanse-api/xpanseRestApiClient';
import '../../../styles/app.css';

export function ApiDoc({ id }: { id: string }): JSX.Element {
    function onclick() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
        serviceVendorApi
            .openApi(id)
            .then((resp) => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
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
