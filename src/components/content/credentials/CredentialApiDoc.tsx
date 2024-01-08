/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { LinkOutlined } from '@ant-design/icons';
import '../../../styles/app.css';
import { CredentialsConfigurationService, CredentialVariables, Link } from '../../../xpanse-api/generated';
import React from 'react';

export function CredentialApiDoc({
    csp,
    credentialType,
    styleClass,
}: {
    csp: CredentialVariables.csp;
    credentialType: CredentialVariables.type;
    styleClass: string;
}): React.JSX.Element {
    function onclick() {
        void CredentialsConfigurationService.getCredentialOpenApi(csp, credentialType).then((link: Link) => {
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
