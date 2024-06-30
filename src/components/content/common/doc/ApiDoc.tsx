/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { LinkOutlined } from '@ant-design/icons';
import React from 'react';
import { Link, openApi, OpenApiData } from '../../../../xpanse-api/generated';

export function ApiDoc({ id, styleClass }: { id: string; styleClass: string }): React.JSX.Element {
    function onclick() {
        const data: OpenApiData = {
            id: id,
        };
        void openApi(data).then((link: Link) => {
            if (link.href !== undefined) {
                window.open(link.href);
            }
        });
    }

    return (
        <button className={styleClass} onClick={onclick}>
            <LinkOutlined /> API Documentation
        </button>
    );
}
