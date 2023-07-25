/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Button } from 'antd';
import { AdminService, SystemStatus } from '../../../xpanse-api/generated';
import SystemStatusIcon from './SystemStatusIcon';
import { useQuery } from '@tanstack/react-query';

function SystemStatusBar(): JSX.Element {
    const systemStatusQuery = useQuery({
        queryKey: ['systemStatusQuery'],
        queryFn: () => AdminService.health(),
        staleTime: 60000, // one minute
    });

    return (
        <>
            <Button
                className={'header-menu-button'}
                icon={
                    <SystemStatusIcon
                        isSystemUp={systemStatusQuery.data?.healthStatus === SystemStatus.healthStatus.OK}
                        isStatusLoading={systemStatusQuery.isLoading}
                    />
                }
                onClick={() => void systemStatusQuery.refetch()}
            >
                System Status
            </Button>
        </>
    );
}

export default SystemStatusBar;
