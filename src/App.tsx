/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import CatalogMainPage from './components/content/catalog/services/menu/CatalogMainMenu';
import FallbackSkeleton from './components/content/common/lazy/FallBackSkeleton.tsx';
import { ConditionalOidcProtectedRoute } from './components/oidc/ConditionalOidcProtectedRoute.tsx';
import { ConditionalOidcProvider } from './components/oidc/ConditionalOidcProvider.tsx';
import {
    catalogPageRoute,
    createServicePageRoute,
    credentialPageRoute,
    healthCheckPageRoute,
    homePageRoute,
    monitorPageRoute,
    myServicesRoute,
    numberOfRetries,
    orderPageRoute,
    policiesRoute,
    registerFailedRoute,
    registerInvalidRoute,
    registerPageRoute,
    registerSuccessfulRoute,
    registeredServicesPageRoute,
    reportsRoute,
    serviceReviewsPageRoute,
    servicesPageRoute,
    workflowsPageRoute,
} from './components/utils/constants';
import './styles/app.module.css';
import { ApiError } from './xpanse-api/generated';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: (failureCount: number, error: Error) => {
                if (error instanceof ApiError) {
                    if (error.status >= 400 && error.status <= 499) {
                        return false;
                    }
                }
                return failureCount < numberOfRetries;
            },
        },
    },
});

const Home = lazy(() => import('./components/content/home/Home.tsx'));
const RegisterPanel = lazy(() => import('./components/content/register/RegisterPanel.tsx'));
const Services = lazy(() => import('./components/content/order/services/Services.tsx'));
const MyServices = lazy(() => import('./components/content/deployedServices/myServices/MyServices.tsx'));
const Monitor = lazy(() => import('./components/content/monitor/Monitor.tsx'));
const Credentials = lazy(() => import('./components/content/credentials/Credentials.tsx'));
const Policies = lazy(() => import('./components/content/userPolicies/UserPolicies.tsx'));
const Reports = lazy(() => import('./components/content/deployedServices/reports/Reports.tsx'));
const Workflows = lazy(() => import('./components/content/workflows/Workflows.tsx'));
const ServiceReviews = lazy(() => import('./components/content/review/ServiceReviews.tsx'));
const AvailableServices = lazy(() => import('./components/content/registeredServices/RegisteredServices.tsx'));
const CreateService = lazy(() => import('./components/content/order/create/CreateService.tsx'));
const OrderSubmitPage = lazy(() => import('./components/content/order/create/OrderSubmit.tsx'));
const NotFoundPage = lazy(() => import('./components/notFound/NotFoundPage.tsx'));
const HealthCheckStatus = lazy(() => import('./components/content/systemStatus/HealthCheckStatus.tsx'));

function App(): React.JSX.Element {
    return (
        <QueryClientProvider client={queryClient}>
            <ConditionalOidcProvider>
                <Routes>
                    <Route
                        key={homePageRoute}
                        path={homePageRoute}
                        element={
                            <ConditionalOidcProtectedRoute allowedRoles={['isv', 'user', 'admin', 'csp']}>
                                <Home />
                            </ConditionalOidcProtectedRoute>
                        }
                    />
                    <Route
                        key={''}
                        path={''}
                        element={
                            <ConditionalOidcProtectedRoute allowedRoles={['isv', 'user', 'admin', 'csp']}>
                                <Home />
                            </ConditionalOidcProtectedRoute>
                        }
                    />
                    {[registerPageRoute, registerFailedRoute, registerInvalidRoute, registerSuccessfulRoute].map(
                        (path) => (
                            <Route
                                key={path}
                                path={path}
                                element={
                                    <ConditionalOidcProtectedRoute allowedRoles={['isv']}>
                                        <RegisterPanel />
                                    </ConditionalOidcProtectedRoute>
                                }
                            />
                        )
                    )}
                    <Route
                        key={catalogPageRoute}
                        path={catalogPageRoute}
                        element={
                            <ConditionalOidcProtectedRoute allowedRoles={['isv']}>
                                <CatalogMainPage />
                            </ConditionalOidcProtectedRoute>
                        }
                    />
                    <Route
                        key={orderPageRoute}
                        path={orderPageRoute}
                        element={
                            <ConditionalOidcProtectedRoute allowedRoles={['user']}>
                                <OrderSubmitPage />
                            </ConditionalOidcProtectedRoute>
                        }
                    />
                    <Route
                        key={servicesPageRoute}
                        path={servicesPageRoute}
                        element={
                            <ConditionalOidcProtectedRoute allowedRoles={['user']}>
                                <Services />
                            </ConditionalOidcProtectedRoute>
                        }
                    />
                    <Route
                        key={myServicesRoute}
                        path={myServicesRoute}
                        element={
                            <ConditionalOidcProtectedRoute allowedRoles={['user']}>
                                <MyServices />
                            </ConditionalOidcProtectedRoute>
                        }
                    />
                    <Route
                        key={createServicePageRoute}
                        path={createServicePageRoute}
                        element={
                            <ConditionalOidcProtectedRoute allowedRoles={['user']}>
                                <CreateService />
                            </ConditionalOidcProtectedRoute>
                        }
                    />
                    <Route
                        key={monitorPageRoute}
                        path={monitorPageRoute}
                        element={
                            <ConditionalOidcProtectedRoute allowedRoles={['user']}>
                                <Monitor />
                            </ConditionalOidcProtectedRoute>
                        }
                    />
                    <Route
                        key={credentialPageRoute}
                        path={credentialPageRoute}
                        element={
                            <ConditionalOidcProtectedRoute allowedRoles={['user', 'isv']}>
                                <Credentials />
                            </ConditionalOidcProtectedRoute>
                        }
                    />
                    <Route
                        key={healthCheckPageRoute}
                        path={healthCheckPageRoute}
                        element={
                            <ConditionalOidcProtectedRoute allowedRoles={['admin']}>
                                <HealthCheckStatus />
                            </ConditionalOidcProtectedRoute>
                        }
                    />
                    <Route
                        key={policiesRoute}
                        path={policiesRoute}
                        element={
                            <ConditionalOidcProtectedRoute allowedRoles={['user']}>
                                <Policies />
                            </ConditionalOidcProtectedRoute>
                        }
                    />
                    <Route
                        key={reportsRoute}
                        path={reportsRoute}
                        element={
                            <ConditionalOidcProtectedRoute allowedRoles={['isv']}>
                                <Reports />
                            </ConditionalOidcProtectedRoute>
                        }
                    />
                    <Route
                        key={workflowsPageRoute}
                        path={workflowsPageRoute}
                        element={
                            <ConditionalOidcProtectedRoute allowedRoles={['user']}>
                                <Workflows />
                            </ConditionalOidcProtectedRoute>
                        }
                    />
                    <Route
                        key={serviceReviewsPageRoute}
                        path={serviceReviewsPageRoute}
                        element={
                            <ConditionalOidcProtectedRoute allowedRoles={['csp']}>
                                <ServiceReviews />
                            </ConditionalOidcProtectedRoute>
                        }
                    />
                    <Route
                        key={registeredServicesPageRoute}
                        path={registeredServicesPageRoute}
                        element={
                            <ConditionalOidcProtectedRoute allowedRoles={['csp']}>
                                <AvailableServices />
                            </ConditionalOidcProtectedRoute>
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
            </ConditionalOidcProvider>
        </QueryClientProvider>
    );
}

export default App;
