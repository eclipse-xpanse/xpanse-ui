import { OidcProvider } from '@axa-fr/react-oidc';
import React, { lazy } from 'react';
import { env } from '../../config/config.ts';
import { OidcConfig } from './OidcConfig.ts';

const SessionLost = lazy(() => import('./../content/login/SessionLost.tsx'));

export function ConditionalOidcProvider({ children }: { children: React.JSX.Element }): React.JSX.Element {
    if (env.VITE_APP_AUTH_DISABLED !== 'true') {
        return (
            <OidcProvider configuration={OidcConfig} sessionLostComponent={SessionLost}>
                {children}
            </OidcProvider>
        );
    } else {
        return <>{children}</>;
    }
}
