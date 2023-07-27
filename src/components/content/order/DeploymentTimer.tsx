import { StopwatchResult } from 'react-timer-hook';
import { ServiceDetailVo } from '../../../xpanse-api/generated';
import { useEffect } from 'react';
import { HourglassOutlined } from '@ant-design/icons';

function DeploymentTimer({
    stopWatch,
    deploymentStatus,
}: {
    stopWatch: StopwatchResult;
    deploymentStatus: ServiceDetailVo.serviceDeploymentState;
}) {
    useEffect(() => {
        if (stopWatch.isRunning && deploymentStatus !== ServiceDetailVo.serviceDeploymentState.DEPLOYING) {
            stopWatch.pause();
        }
        if (!stopWatch.isRunning && deploymentStatus === ServiceDetailVo.serviceDeploymentState.DEPLOYING) {
            stopWatch.reset();
        }
    }, [deploymentStatus, stopWatch]);

    return (
        <div className={'timer-block'}>
            <div className={'timer-header'}>Deployment Duration</div>
            <div className={'timer-value'}>
                <HourglassOutlined /> <span>{stopWatch.hours}h</span>:<span>{stopWatch.minutes}m</span>:
                <span>{stopWatch.seconds}s</span>
            </div>
        </div>
    );
}

export default DeploymentTimer;
