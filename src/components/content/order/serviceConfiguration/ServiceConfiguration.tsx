/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React from 'react';
import '../../../../styles/app.module.css';
import {
    DeployedServiceDetails,
    UserOrderableServiceVo,
    VendorHostedDeployedServiceDetails,
} from '../../../../xpanse-api/generated';
import { ServiceConfigurationDetails } from './ServiceConfigurationDetails.tsx';

export const ServiceConfiguration = ({
    userOrderableServiceVo,
    deployedService,
}: {
    userOrderableServiceVo: UserOrderableServiceVo | undefined;
    deployedService: DeployedServiceDetails | VendorHostedDeployedServiceDetails;
}): React.JSX.Element => {
    return (
        <div>
            <ServiceConfigurationDetails
                userOrderableServiceVo={userOrderableServiceVo}
                deployedService={deployedService}
            />
        </div>
    );
};
