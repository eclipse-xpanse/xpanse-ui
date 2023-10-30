/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import WelcomeCard from './WelcomeCard';
import React from 'react';
import { ServicesDashboard } from './ServicesDashboard';
import { useCurrentUserRoleStore } from '../../layouts/header/useCurrentRoleStore';

function Home(): React.JSX.Element {
    const currentRole = useCurrentUserRoleStore((state) => state.currentUserRole);

    return (
        <div className={'home-data-display'}>
            <WelcomeCard />
            <br />
            {currentRole && currentRole === 'user' ? <ServicesDashboard /> : <></>}
        </div>
    );
}

export default Home;
