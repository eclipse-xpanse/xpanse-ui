/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { LinkOutlined } from '@ant-design/icons';
import { servicesAvailableApi } from '../../../xpanse-api/xpanseRestApiClient';
import '../../../styles/app.css';

export function ApiDoc({ id, styleClass }: { id: string; styleClass: string }): JSX.Element {
    function onclick() {
        servicesAvailableApi
            .openApi(id)
            .then((resp: string) => {
                window.open(resp);
            })
            .catch((error) => {
                console.error(error);
            });
    }
    return (
        <button className={styleClass} onClick={onclick}>
            <LinkOutlined /> API Documentation
        </button>
    );
}
