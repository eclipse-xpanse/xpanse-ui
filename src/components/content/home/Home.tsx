/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import WelcomeCard from './WelcomeCard';
import React from 'react';
import { ServicesDashboard } from './ServicesDashboard';
import { useCurrentUserRoleStore } from '../../layouts/header/useCurrentRoleStore';

function Home(): React.JSX.Element {
    const currentRoleParams = useCurrentUserRoleStore((state) => state.currentUserRoleStoreParams);

    return (
        <div className={'home-data-display'}>
            <WelcomeCard />
            <br />
            {currentRoleParams.length > 0 && currentRoleParams === 'user' ? <ServicesDashboard /> : <></>}
        </div>
    );
}

export default Home;
