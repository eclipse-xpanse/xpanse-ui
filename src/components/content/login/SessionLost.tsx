/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useOidc } from '@axa-fr/react-oidc';
import React, { useEffect } from 'react';

export function SessionLost(): React.JSX.Element {
    const { login } = useOidc();

    useEffect(() => {
        void login();
    }, [login]);

    return <></>;
}
