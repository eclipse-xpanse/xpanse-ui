/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Route, Routes } from 'react-router-dom';
import './styles/app.css';
import Home from './components/content/home/Home';
import Protected from './components/protectedRoutes/ProtectedRoute';
import {
    catalogPageRoute,
    createServicePageRoute,
    credentialPageRoute,
    healthCheckPageRoute,
    homePageRoute,
    monitorPageRoute,
    myServicesRoute,
    orderPageRoute,
    policiesRoute,
    registerFailedRoute,
    registerInvalidRoute,
    registerPageRoute,
    registerSuccessfulRoute,
    reportsRoute,
    servicesPageRoute,
} from './components/utils/constants';
import RegisterPanel from './components/content/register/RegisterPanel';
import Services from './components/content/order/services/Services';
import CreateService from './components/content/order/create/CreateService';
import OrderSubmitPage from './components/content/order/create/OrderSubmit';
import MyServices from './components/content/deployedServices/myServices/MyServices';
import Monitor from './components/content/monitor/Monitor';
import Credentials from './components/content/credentials/Credentials';
import { OidcConfig } from './components/oidc/OidcConfig';
import { OidcProvider, OidcSecure } from '@axa-fr/react-oidc';
import { NotFoundPage } from './components/notFound/NotFoundPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HealthCheckStatus } from './components/content/systemStatus/HealthCheckStatus';
import CatalogMainPage from './components/content/catalog/services/menu/CatalogMainMenu';
import React from 'react';
import { SessionLost } from './components/content/login/SessionLost';
import Policies from './components/content/policies/Policies';
import Reports from './components/content/deployedServices/reports/Reports';

const queryClient = new QueryClient();

function App(): React.JSX.Element {
    return (
        <QueryClientProvider client={queryClient}>
            <OidcProvider configuration={OidcConfig} sessionLostComponent={SessionLost}>
                <Routes>
                    <Route
                        key={homePageRoute}
                        path={homePageRoute}
                        element={
                            <OidcSecure>
                                <Protected allowedRole={['isv', 'user', 'admin']}>
                                    <Home />
                                </Protected>
                            </OidcSecure>
                        }
                    />
                    <Route
                        key={''}
                        path={''}
                        element={
                            <OidcSecure>
                                <Protected allowedRole={['isv', 'user', 'admin']}>
                                    <Home />
                                </Protected>
                            </OidcSecure>
                        }
                    />
                    {[registerPageRoute, registerFailedRoute, registerInvalidRoute, registerSuccessfulRoute].map(
                        (path) => (
                            <Route
                                key={path}
                                path={path}
                                element={
                                    <OidcSecure>
                                        <Protected allowedRole={['isv']}>
                                            <RegisterPanel />
                                        </Protected>
                                    </OidcSecure>
                                }
                            />
                        )
                    )}
                    <Route
                        key={catalogPageRoute}
                        path={catalogPageRoute}
                        element={
                            <OidcSecure>
                                <Protected allowedRole={['isv']}>
                                    <CatalogMainPage />
                                </Protected>
                            </OidcSecure>
                        }
                    />
                    <Route
                        key={orderPageRoute}
                        path={orderPageRoute}
                        element={
                            <OidcSecure>
                                <Protected allowedRole={['user']}>
                                    <OrderSubmitPage />
                                </Protected>
                            </OidcSecure>
                        }
                    />
                    <Route
                        key={servicesPageRoute}
                        path={servicesPageRoute}
                        element={
                            <OidcSecure>
                                <Protected allowedRole={['user']}>
                                    <Services />
                                </Protected>
                            </OidcSecure>
                        }
                    />
                    <Route
                        key={myServicesRoute}
                        path={myServicesRoute}
                        element={
                            <OidcSecure>
                                <Protected allowedRole={['user']}>
                                    <MyServices />
                                </Protected>
                            </OidcSecure>
                        }
                    />
                    <Route
                        key={createServicePageRoute}
                        path={createServicePageRoute}
                        element={
                            <OidcSecure>
                                <Protected allowedRole={['user']}>
                                    <CreateService />
                                </Protected>
                            </OidcSecure>
                        }
                    />
                    <Route
                        key={monitorPageRoute}
                        path={monitorPageRoute}
                        element={
                            <OidcSecure>
                                <Protected allowedRole={['user']}>
                                    <Monitor />
                                </Protected>
                            </OidcSecure>
                        }
                    />
                    <Route
                        key={credentialPageRoute}
                        path={credentialPageRoute}
                        element={
                            <OidcSecure>
                                <Protected allowedRole={['user', 'isv']}>
                                    <Credentials />
                                </Protected>
                            </OidcSecure>
                        }
                    />
                    <Route
                        key={healthCheckPageRoute}
                        path={healthCheckPageRoute}
                        element={
                            <OidcSecure>
                                <Protected allowedRole={['admin']}>
                                    <HealthCheckStatus />
                                </Protected>
                            </OidcSecure>
                        }
                    />
                    <Route
                        key={policiesRoute}
                        path={policiesRoute}
                        element={
                            <OidcSecure>
                                <Protected allowedRole={['user']}>
                                    <Policies />
                                </Protected>
                            </OidcSecure>
                        }
                    />
                    <Route
                        key={reportsRoute}
                        path={reportsRoute}
                        element={
                            <OidcSecure>
                                <Protected allowedRole={['isv']}>
                                    <Reports />
                                </Protected>
                            </OidcSecure>
                        }
                    />
                    <Route path='*' element={<NotFoundPage />} />
                </Routes>
            </OidcProvider>
        </QueryClientProvider>
    );
}

export default App;
