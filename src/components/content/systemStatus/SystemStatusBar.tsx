/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Button } from 'antd';
import React from 'react';
import appStyles from '../../../styles/app.module.css';
import SystemStatusIcon from './SystemStatusIcon';
import { useHealthCheckStatusQuery } from './useHealthCheckStatusQuery';

function SystemStatusBar(): React.JSX.Element {
    const healthCheckQuery = useHealthCheckStatusQuery();

    return (
        <>
            <Button
                className={appStyles.headerMenuButton}
                icon={
                    <SystemStatusIcon
                        isSystemUp={healthCheckQuery.data?.healthStatus.toString() === 'OK'}
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
