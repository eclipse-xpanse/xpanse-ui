/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { LinkOutlined } from '@ant-design/icons';
import '../../../styles/app.css';
import { Link } from '../../../xpanse-api/generated';
import { ServicesAvailableService } from '../../../xpanse-api/generated/services/ServicesAvailableService';

export function ApiDoc({ id, styleClass }: { id: string; styleClass: string }): JSX.Element {
    function onclick() {
        ServicesAvailableService.openApi(id)
            .then((link: Link) => {
                if (link.href !== undefined) {
                    window.open(link.href);
                }
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
