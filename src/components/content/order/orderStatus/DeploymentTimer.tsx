/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { StopwatchResult } from 'react-timer-hook';
import { ServiceDetailVo } from '../../../../xpanse-api/generated';
import { useEffect } from 'react';
import { HourglassOutlined } from '@ant-design/icons';
import { OperationType } from '../formElements/CommonTypes';

function DeploymentTimer({
    stopWatch,
    deploymentStatus,
    operationType,
}: {
    stopWatch: StopwatchResult;
    deploymentStatus: ServiceDetailVo.serviceDeploymentState;
    operationType: OperationType;
}) {
    useEffect(() => {
        if (operationType === OperationType.Deploy) {
            if (
                stopWatch.isRunning &&
                (deploymentStatus === ServiceDetailVo.serviceDeploymentState.DEPLOY_FAILED ||
                    deploymentStatus === ServiceDetailVo.serviceDeploymentState.DEPLOY_SUCCESS)
            ) {
                stopWatch.pause();
            }
            if (!stopWatch.isRunning && deploymentStatus === ServiceDetailVo.serviceDeploymentState.DEPLOYING) {
                stopWatch.reset();
            }
        }
        if (operationType === OperationType.Destroy) {
            if (
                stopWatch.isRunning &&
                (deploymentStatus === ServiceDetailVo.serviceDeploymentState.DESTROY_SUCCESS ||
                    deploymentStatus === ServiceDetailVo.serviceDeploymentState.DESTROY_FAILED)
            ) {
                stopWatch.pause();
            }
            if (!stopWatch.isRunning && deploymentStatus === ServiceDetailVo.serviceDeploymentState.DESTROYING) {
                stopWatch.reset();
            }
        }

        if (operationType === OperationType.Migrate) {
            if (
                stopWatch.isRunning &&
                (deploymentStatus === ServiceDetailVo.serviceDeploymentState.DEPLOY_FAILED ||
                    deploymentStatus === ServiceDetailVo.serviceDeploymentState.DESTROY_FAILED ||
                    deploymentStatus === ServiceDetailVo.serviceDeploymentState.DESTROY_SUCCESS)
            ) {
                stopWatch.pause();
            }
            if (
                !stopWatch.isRunning &&
                (deploymentStatus === ServiceDetailVo.serviceDeploymentState.DEPLOYING ||
                    deploymentStatus === ServiceDetailVo.serviceDeploymentState.DESTROYING)
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
