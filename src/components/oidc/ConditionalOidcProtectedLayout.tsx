/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { OidcSecure } from '@axa-fr/react-oidc';
import React, { Suspense } from 'react';
import { env } from '../../config/config.ts';
import FallbackSkeleton from '../content/common/lazy/FallBackSkeleton.tsx';

export function ConditionalOidcProtectedLayout({ children }: { children: React.JSX.Element }): React.JSX.Element {
    if (env.VITE_APP_AUTH_DISABLED !== 'true') {
        return (
            <OidcSecure>
                <Suspense fallback={<FallbackSkeleton />}>{children}</Suspense>
            </OidcSecure>
        );
    } else {
        return <Suspense fallback={<FallbackSkeleton />}>{children}</Suspense>;
    }
}
