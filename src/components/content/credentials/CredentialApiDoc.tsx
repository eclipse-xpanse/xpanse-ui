/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { LinkOutlined } from '@ant-design/icons';
import React from 'react';
import '../../../styles/app.module.css';
import {
    credentialType,
    csp,
    getCredentialOpenApi,
    GetCredentialOpenApiData,
    Link,
} from '../../../xpanse-api/generated';

export function CredentialApiDoc({
    csp,
    credentialType,
    styleClass,
}: {
    csp: string;
    credentialType: string;
    styleClass: string;
}): React.JSX.Element {
    function onclick() {
        const data: GetCredentialOpenApiData = {
            csp: csp as csp,
            type: credentialType as credentialType,
        };
        void getCredentialOpenApi(data).then((link: Link) => {
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
