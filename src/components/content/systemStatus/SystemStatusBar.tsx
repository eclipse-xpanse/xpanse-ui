/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Button, Space } from 'antd';
import { useState } from 'react';
import { AdminService, SystemStatus } from '../../../xpanse-api/generated';
import SystemStatusIcon from './SystemStatusIcon';

function SystemStatusBar(): JSX.Element {
    const [healthState, setHealthState] = useState<SystemStatus.healthStatus>(SystemStatus.healthStatus.NOK);
    const [isReloadSystemStatus, setReloadSystemStatus] = useState<boolean>(false);

    AdminService.health()
        .then((systemStatus: SystemStatus) => setHealthState(systemStatus.healthStatus))
        .catch((error: unknown) => {
            console.error(error);
            setHealthState(SystemStatus.healthStatus.NOK);
        });

    return (
        <Space>
            <Button
                className={'header-menu-button'}
                icon={<SystemStatusIcon isSystemUp={healthState === 'OK'} />}
                onClick={() => setReloadSystemStatus(!isReloadSystemStatus)}
            >
                System Status
            </Button>
        </Space>
    );
}

export default SystemStatusBar;
