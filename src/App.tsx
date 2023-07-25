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
    homePageRoute,
    orderPageRoute,
    registerPageRoute,
    myServicesRoute,
    servicesPageRoute,
    monitorPageRoute,
    credentialPageRoute,
    healthCheckPageRoute,
} from './components/utils/constants';
import RegisterPanel from './components/content/register/RegisterPanel';
import Catalog from './components/content/catalog/Catalog';
import Services from './components/content/order/Services';
import CreateService from './components/content/order/CreateService';
import OrderSubmitPage from './components/content/order/OrderSubmit';
import ServiceList from './components/content/order/ServiceList';
import Monitor from './components/content/monitor/Monitor';
import Credential from './components/content/credential/Credential';
import { OidcConfig } from './components/oidc/OidcConfig';
import { OidcProvider, OidcSecure } from '@axa-fr/react-oidc';
import { NotFoundPage } from './components/notFound/NotFoundPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HealthCheckStatus } from './components/content/systemStatus/HealthCheckStatus';

const queryClient = new QueryClient();

function App(): JSX.Element {
    return (
        <QueryClientProvider client={queryClient}>
            <OidcProvider configuration={OidcConfig}>
                <Routes>
                    <Route
                        path={homePageRoute}
                        element={
                            <OidcSecure>
                                <Protected allowedRole={'all'}>
                                    <Home />
                                </Protected>
                            </OidcSecure>
                        }
                    />
                    <Route
                        path={''}
                        element={
                            <OidcSecure>
                                <Protected allowedRole={'all'}>
                                    <Home />
                                </Protected>
                            </OidcSecure>
                        }
                    />
                    <Route
                        path={registerPageRoute}
                        element={
                            <OidcSecure>
                                <Protected allowedRole={'csp'}>
                                    <RegisterPanel />
                                </Protected>
                            </OidcSecure>
                        }
                    />
                    <Route
                        path={catalogPageRoute}
                        element={
                            <OidcSecure>
                                <Protected allowedRole={'csp'}>
                                    <Catalog />
                                </Protected>
                            </OidcSecure>
                        }
                    />
                    <Route
                        path={orderPageRoute}
                        element={
                            <OidcSecure>
                                <Protected allowedRole={'user'}>
                                    <OrderSubmitPage />
                                </Protected>
                            </OidcSecure>
                        }
                    />
                    <Route
                        path={servicesPageRoute}
                        element={
                            <OidcSecure>
                                <Protected allowedRole={'user'}>
                                    <Services />
                                </Protected>
                            </OidcSecure>
                        }
                    />
                    <Route
                        path={myServicesRoute}
                        element={
                            <OidcSecure>
                                <Protected allowedRole={'user'}>
                                    <ServiceList />
                                </Protected>
                            </OidcSecure>
                        }
                    />
                    <Route
                        path={createServicePageRoute}
                        element={
                            <OidcSecure>
                                <Protected allowedRole={'user'}>
                                    <CreateService />
                                </Protected>
                            </OidcSecure>
                        }
                    />
                    <Route
                        path={monitorPageRoute}
                        element={
                            <OidcSecure>
                                <Protected allowedRole={'user'}>
                                    <Monitor />
                                </Protected>
                            </OidcSecure>
                        }
                    />
                    <Route
                        path={credentialPageRoute}
                        element={
                            <OidcSecure>
                                <Protected allowedRole={'user'}>
                                    <Credential />
                                </Protected>
                            </OidcSecure>
                        }
                    />
                    <Route
                        path={healthCheckPageRoute}
                        element={
                            <OidcSecure>
                                <Protected allowedRole={'admin'}>
                                    <HealthCheckStatus />
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
