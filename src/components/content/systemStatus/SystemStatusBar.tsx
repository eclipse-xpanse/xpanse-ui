/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Button } from 'antd';
import { SystemStatus } from '../../../xpanse-api/generated';
import SystemStatusIcon from './SystemStatusIcon';
import { useHealthCheckStatusQuery } from './useHealthCheckStatusQuery';

function SystemStatusBar(): JSX.Element {
    const healthCheckQuery = useHealthCheckStatusQuery();

    return (
        <div className={'system-status-class'}>
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
        </div>
    );
}

export default SystemStatusBar;
