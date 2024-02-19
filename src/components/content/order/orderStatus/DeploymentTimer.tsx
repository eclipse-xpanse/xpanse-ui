/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { StopwatchResult } from 'react-timer-hook';
import { DeployedServiceDetails } from '../../../../xpanse-api/generated';
import { useEffect } from 'react';
import { HourglassOutlined } from '@ant-design/icons';
import { OperationType } from '../types/OperationType';

function DeploymentTimer({
    stopWatch,
    deploymentStatus,
    operationType,
}: {
    stopWatch: StopwatchResult;
    deploymentStatus: DeployedServiceDetails.serviceDeploymentState;
    operationType: OperationType;
}) {
    useEffect(() => {
        if (operationType === OperationType.Deploy) {
            if (
                stopWatch.isRunning &&
                (deploymentStatus === DeployedServiceDetails.serviceDeploymentState.DEPLOYMENT_FAILED ||
                    deploymentStatus === DeployedServiceDetails.serviceDeploymentState.DEPLOYMENT_SUCCESSFUL)
            ) {
                stopWatch.pause();
            }
            if (!stopWatch.isRunning && deploymentStatus === DeployedServiceDetails.serviceDeploymentState.DEPLOYING) {
                stopWatch.reset();
            }
        }
        if (operationType === OperationType.Destroy) {
            if (
                stopWatch.isRunning &&
                (deploymentStatus === DeployedServiceDetails.serviceDeploymentState.DESTROY_SUCCESSFUL ||
                    deploymentStatus === DeployedServiceDetails.serviceDeploymentState.DESTROY_FAILED)
            ) {
                stopWatch.pause();
            }
            if (!stopWatch.isRunning && deploymentStatus === DeployedServiceDetails.serviceDeploymentState.DESTROYING) {
                stopWatch.reset();
            }
        }

        if (operationType === OperationType.Migrate) {
            if (
                stopWatch.isRunning &&
                (deploymentStatus === DeployedServiceDetails.serviceDeploymentState.MIGRATION_SUCCESSFUL ||
                    deploymentStatus === DeployedServiceDetails.serviceDeploymentState.MIGRATION_FAILED)
            ) {
                stopWatch.pause();
            }
            if (
                !stopWatch.isRunning &&
                !(
                    deploymentStatus === DeployedServiceDetails.serviceDeploymentState.MIGRATION_SUCCESSFUL ||
                    deploymentStatus === DeployedServiceDetails.serviceDeploymentState.MIGRATION_FAILED
                )
            ) {
                stopWatch.reset();
            }
        }
    }, [deploymentStatus, operationType, stopWatch]);

    return (
        <div className={'timer-block'}>
            <div className={'timer-header'}>Order Duration</div>
            <div className={'timer-value'}>
                <HourglassOutlined /> <span>{stopWatch.hours}h</span>:<span>{stopWatch.minutes}m</span>:
                <span>{stopWatch.seconds}s</span>
            </div>
        </div>
    );
}

export default DeploymentTimer;
