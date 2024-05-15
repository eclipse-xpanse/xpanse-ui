/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Route, Routes } from 'react-router-dom';
import './styles/app.css';
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
    serviceReviewsPageRoute,
    servicesPageRoute,
    workflowsPageRoute,
} from './components/utils/constants';
import { OidcConfig } from './components/oidc/OidcConfig';
import { OidcProvider, OidcSecure } from '@axa-fr/react-oidc';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CatalogMainPage from './components/content/catalog/services/menu/CatalogMainMenu';
import React, { lazy, Suspense } from 'react';
import FallbackSkeleton from './components/content/common/lazy/FallBackSkeleton.tsx';

const queryClient = new QueryClient();

const Home = lazy(() => import('./components/content/home/Home.tsx'));
const RegisterPanel = lazy(() => import('./components/content/register/RegisterPanel.tsx'));
const Services = lazy(() => import('./components/content/order/services/Services.tsx'));
const MyServices = lazy(() => import('./components/content/deployedServices/myServices/MyServices.tsx'));
const Monitor = lazy(() => import('./components/content/monitor/Monitor.tsx'));
const Credentials = lazy(() => import('./components/content/credentials/Credentials.tsx'));
const Policies = lazy(() => import('.//components/content/policies/Policies.tsx'));
const Reports = lazy(() => import('./components/content/deployedServices/reports/Reports.tsx'));
const Workflows = lazy(() => import('./components/content/workflows/Workflows.tsx'));
const ServiceReviews = lazy(() => import('./components/content/review/ServiceReviews.tsx'));
const CreateService = lazy(() => import('./components/content/order/create/CreateService.tsx'));
const OrderSubmitPage = lazy(() => import('./components/content/order/create/OrderSubmit.tsx'));
const NotFoundPage = lazy(() => import('./components/notFound/NotFoundPage.tsx'));
const HealthCheckStatus = lazy(() => import('./components/content/systemStatus/HealthCheckStatus.tsx'));
const SessionLost = lazy(() => import('./components/content/login/SessionLost.tsx'));

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
                                <Protected allowedRole={['isv', 'user', 'admin', 'csp']}>
                                    <Suspense fallback={<FallbackSkeleton />}>
                                        <Home />
                                    </Suspense>
                                </Protected>
                            </OidcSecure>
                        }
                    />
                    <Route
                        key={''}
                        path={''}
                        element={
                            <OidcSecure>
                                <Protected allowedRole={['isv', 'user', 'admin', 'csp']}>
                                    <Suspense fallback={<FallbackSkeleton />}>
                                        <Home />
                                    </Suspense>
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
                                            <Suspense fallback={<FallbackSkeleton />}>
                                                <RegisterPanel />
                                            </Suspense>
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
                                    <Suspense fallback={<FallbackSkeleton />}>
                                        <CatalogMainPage />
                                    </Suspense>
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
                                    <Suspense fallback={<FallbackSkeleton />}>
                                        <OrderSubmitPage />
                                    </Suspense>
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
                                    <Suspense fallback={<FallbackSkeleton />}>
                                        <Services />
                                    </Suspense>
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
                                    <Suspense fallback={<FallbackSkeleton />}>
                                        <MyServices />
                                    </Suspense>
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
                                    <Suspense fallback={<FallbackSkeleton />}>
                                        <CreateService />
                                    </Suspense>
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
                                    <Suspense fallback={<FallbackSkeleton />}>
                                        <Monitor />
                                    </Suspense>
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
                                    <Suspense fallback={<FallbackSkeleton />}>
                                        <Credentials />
                                    </Suspense>
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
                                    <Suspense fallback={<FallbackSkeleton />}>
                                        <HealthCheckStatus />
                                    </Suspense>
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
                                    <Suspense fallback={<FallbackSkeleton />}>
                                        <Policies />
                                    </Suspense>
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
                                    <Suspense fallback={<FallbackSkeleton />}>
                                        <Reports />
                                    </Suspense>
                                </Protected>
                            </OidcSecure>
                        }
                    />
                    <Route
                        key={workflowsPageRoute}
                        path={workflowsPageRoute}
                        element={
                            <OidcSecure>
                                <Protected allowedRole={['user']}>
                                    <Suspense fallback={<FallbackSkeleton />}>
                                        <Workflows />
                                    </Suspense>
                                </Protected>
                            </OidcSecure>
                        }
                    />
                    <Route
                        key={serviceReviewsPageRoute}
                        path={serviceReviewsPageRoute}
                        element={
                            <OidcSecure>
                                <Protected allowedRole={['csp']}>
                                    <Suspense fallback={<FallbackSkeleton />}>
                                        <ServiceReviews />
                                    </Suspense>
                                </Protected>
                            </OidcSecure>
                        }
                    />
                    <Route
                        path='*'
                        element={
                            <Suspense fallback={<FallbackSkeleton />}>
                                <NotFoundPage />
                            </Suspense>
                        }
                    />
                </Routes>
            </OidcProvider>
        </QueryClientProvider>
    );
}

export default App;
