/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { LinkOutlined } from '@ant-design/icons';
import '../../../../styles/app.css';
import { CredentialsManagementService, CredentialVariables, Link } from '../../../../xpanse-api/generated';

export function CredentialApiDoc({
    csp,
    credentialType,
    styleClass,
}: {
    csp: CredentialVariables.csp;
    credentialType: CredentialVariables.type;
    styleClass: string;
}): JSX.Element {
    function onclick() {
        CredentialsManagementService.getCredentialOpenApi(csp, credentialType)
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
