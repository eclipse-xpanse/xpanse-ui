/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { FileTextOutlined } from '@ant-design/icons';
import { Card, Tabs, TabsProps } from 'antd';
import React from 'react';
import '../../../../styles/app.module.css';
import {
    DeployedServiceDetails,
    UserOrderableServiceVo,
    VendorHostedDeployedServiceDetails,
} from '../../../../xpanse-api/generated';
import { CurrentServiceConfigurationDetails } from './CurrentServiceConfigurationDetails';

export const CurrentServiceConfiguration = ({
    userOrderableServiceVo,
    deployedService,
}: {
    userOrderableServiceVo: UserOrderableServiceVo | undefined;
    deployedService: DeployedServiceDetails | VendorHostedDeployedServiceDetails;
}): React.JSX.Element => {
    const items: TabsProps['items'] = [
        {
            key: 'CurrentConfig',
            label: 'Current Config',
            icon: <FileTextOutlined />,
            children: (
                <CurrentServiceConfigurationDetails
                    userOrderableServiceVo={userOrderableServiceVo}
                    serviceConfigurationDetails={deployedService.serviceConfigurationDetails}
                />
            ),
        },
    ];

    return (
        <Card>
            <Tabs tabPosition={'left'} items={items} />
        </Card>
    );
};
