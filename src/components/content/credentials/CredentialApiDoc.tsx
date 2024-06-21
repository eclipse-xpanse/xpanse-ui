/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { LinkOutlined } from '@ant-design/icons';
import React from 'react';
import '../../../styles/app.module.css';
import {
    CredentialVariables,
    getCredentialOpenApi,
    GetCredentialOpenApiData,
    Link,
} from '../../../xpanse-api/generated';

export function CredentialApiDoc({
    csp,
    credentialType,
    styleClass,
}: {
    csp: CredentialVariables['csp'];
    credentialType: CredentialVariables['type'];
    styleClass: string;
}): React.JSX.Element {
    function onclick() {
        const data: GetCredentialOpenApiData = {
            csp: csp,
            type: credentialType,
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
