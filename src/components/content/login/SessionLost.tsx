/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useOidc } from '@axa-fr/react-oidc';
import React from 'react';

export default function SessionLost(): React.JSX.Element {
    const { login } = useOidc();
    void login();
    return <></>;
}
