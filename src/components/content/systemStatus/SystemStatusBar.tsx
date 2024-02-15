/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Button } from 'antd';
import { SystemStatus } from '../../../xpanse-api/generated';
import SystemStatusIcon from './SystemStatusIcon';
import { useHealthCheckStatusQuery } from './useHealthCheckStatusQuery';
import React from 'react';

function SystemStatusBar(): React.JSX.Element {
    const healthCheckQuery = useHealthCheckStatusQuery();

    return (
        <>
            <Button
                className={'header-menu-button'}
                icon={
                    <SystemStatusIcon
                        isSystemUp={healthCheckQuery.data?.healthStatus === SystemStatus.healthStatus.OK}
                        isStatusLoading={healthCheckQuery.isLoading}
                    />
                }
                onClick={() => void healthCheckQuery.refetch()}
            >
                System Status
            </Button>
        </>
    );
}

export default SystemStatusBar;
