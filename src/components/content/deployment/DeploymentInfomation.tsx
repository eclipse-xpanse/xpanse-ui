/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Descriptions } from 'antd';
import React from 'react';
import catalogStyles from '../../../styles/catalog.module.css';
import oclDisplayStyles from '../../../styles/ocl-display.module.css';
import { Deployment } from '../../../xpanse-api/generated';
import { DeploymentScriptText } from '../common/ocl/DeploymentScript';
import { DeploymentText } from '../common/ocl/DeploymentText';
import { getDeployerToolIcon } from '../common/ocl/getDeployerToolIcon';

function DeploymentInfomation({ deployment }: { deployment: Deployment }): React.JSX.Element {
    return (
        <>
            <div className={`${catalogStyles.catalogDetailsH6} ${catalogStyles.managementInfo}`}>
                &nbsp;Deployment Information
            </div>
            <Descriptions column={2} bordered className={oclDisplayStyles.oclDataInfoTable}>
                <Descriptions.Item label='Kind'>
                    {
                        <img
                            src={getDeployerToolIcon(deployment.deployerTool.kind.valueOf())}
                            alt={deployment.deployerTool.kind}
                            className={oclDisplayStyles.oclDataDisplayDeploymentKind}
                        />
                    }
                </Descriptions.Item>
                <Descriptions.Item label='Version'>{deployment.deployerTool.version}</Descriptions.Item>
                <Descriptions.Item label='Service Availability Config'>
                    <DeploymentText deployment={deployment} />
                </Descriptions.Item>
                <Descriptions.Item label='Deployment Scripts'>
                    <DeploymentScriptText deployment={deployment} />
                </Descriptions.Item>
            </Descriptions>
        </>
    );
}

export default DeploymentInfomation;
