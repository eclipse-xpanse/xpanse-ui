/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { LinkOutlined } from '@ant-design/icons';
import React from 'react';
import '../../../styles/app.module.css';
import { CredentialType, Csp, getCredentialOpenApi } from '../../../xpanse-api/generated';

export function CredentialApiDoc({
    csp,
    credentialType,
    styleClass,
}: {
    csp: Csp;
    credentialType: CredentialType;
    styleClass: string;
}): React.JSX.Element {
    function onclick() {
        void getCredentialOpenApi({
            path: {
                csp: csp,
                type: credentialType,
            },
        }).then((link) => {
            if (link.data !== undefined) {
                window.open(link.data.href);
            }
        });
    }

    return (
        <button className={styleClass} onClick={onclick}>
            <LinkOutlined /> API Documentation
        </button>
    );
}
