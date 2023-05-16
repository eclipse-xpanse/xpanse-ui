/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Route, Routes } from 'react-router-dom';
import './styles/app.css';
import Home from './components/content/home/Home';
import LoginScreen from './components/content/login/LoginScreen';
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
} from './components/utils/constants';
import RegisterPanel from './components/content/register/RegisterPanel';
import Catalog from './components/content/catalog/Catalog';
import Services from './components/content/order/Services';
import CreateService from './components/content/order/CreateService';
import OrderSubmitPage from './components/content/order/OrderSubmit';
import ServiceList from './components/content/order/ServiceList';
import Monitor from './components/content/monitor/Monitor';

function App(): JSX.Element {
    return (
        <Routes>
            <Route
                path={homePageRoute}
                element={
                    <Protected>
                        <Home />
                    </Protected>
                }
            />
            <Route
                path={registerPageRoute}
                element={
                    <Protected>
                        <RegisterPanel />
                    </Protected>
                }
            />
            <Route
                path={catalogPageRoute}
                element={
                    <Protected>
                        <Catalog />
                    </Protected>
                }
            />
            <Route
                path={orderPageRoute}
                element={
                    <Protected>
                        <OrderSubmitPage />
                    </Protected>
                }
            />
            <Route
                path={servicesPageRoute}
                element={
                    <Protected>
                        <Services />
                    </Protected>
                }
            />
            <Route
                path={myServicesRoute}
                element={
                    <Protected>
                        <ServiceList />
                    </Protected>
                }
            />
            <Route
                path={createServicePageRoute}
                element={
                    <Protected>
                        <CreateService />
                    </Protected>
                }
            />
            <Route
                path={monitorPageRoute}
                element={
                    <Protected>
                        <Monitor />
                    </Protected>
                }
            />
            <Route path='*' element={<LoginScreen />} />
        </Routes>
    );
}

export default App;
