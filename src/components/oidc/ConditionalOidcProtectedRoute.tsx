import { OidcSecure } from '@axa-fr/react-oidc';
import React, { Suspense } from 'react';
import { env } from '../../config/config.ts';
import FallbackSkeleton from '../content/common/lazy/FallBackSkeleton.tsx';
import Protected from '../protectedRoutes/ProtectedRoute.tsx';
import { roles } from '../utils/constants.tsx';

export function ConditionalOidcProtectedRoute({
    children,
    allowedRoles,
}: {
    children: React.JSX.Element;
    allowedRoles: roles[];
}): React.JSX.Element {
    if (env.VITE_APP_AUTH_DISABLED !== 'true') {
        return (
            <OidcSecure>
                <Protected allowedRole={allowedRoles}>
                    <Suspense fallback={<FallbackSkeleton />}>{children}</Suspense>
                </Protected>
            </OidcSecure>
        );
    } else {
        return (
            <Protected allowedRole={allowedRoles}>
                <Suspense fallback={<FallbackSkeleton />}>{children}</Suspense>
            </Protected>
        );
    }
}
