/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React from 'react';
import appStyles from '../../../styles/app.module.css';
import { useCurrentUserRoleStore } from '../../layouts/header/useCurrentRoleStore';
import WelcomeCard from './WelcomeCard';
import { IsvServicesDashBoard } from './isv/IsvServicesDashBoard';
import { EndUserServicesDashboard } from './user/EndUserServicesDashboard';

function Home(): React.JSX.Element {
    const currentRole = useCurrentUserRoleStore((state) => state.currentUserRole);

    return (
        <div className={appStyles.homeDataDisplay}>
            <WelcomeCard />
            <br />
            {currentRole && currentRole === 'user' ? <EndUserServicesDashboard /> : <></>}
            {currentRole && currentRole === 'isv' ? <IsvServicesDashBoard /> : <></>}
        </div>
    );
}

export default Home;
