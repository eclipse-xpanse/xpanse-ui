/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import WelcomeCard from './WelcomeCard';
import React from 'react';
import { EndUserServicesDashboard } from './user/EndUserServicesDashboard';
import { useCurrentUserRoleStore } from '../../layouts/header/useCurrentRoleStore';
import { IsvServicesDashBoard } from './isv/IsvServicesDashBoard';

function Home(): React.JSX.Element {
    const currentRole = useCurrentUserRoleStore((state) => state.currentUserRole);

    return (
        <div className={'home-data-display'}>
            <WelcomeCard />
            <br />
            {currentRole && currentRole === 'user' ? <EndUserServicesDashboard /> : <></>}
            {currentRole && currentRole === 'isv' ? <IsvServicesDashBoard /> : <></>}
        </div>
    );
}

export default Home;
