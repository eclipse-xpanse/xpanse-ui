/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Button, Popover } from 'antd';
import React from 'react';
import YAML from 'yaml';
import oclDisplayStyles from '../../../../styles/ocl-display.module.css';
import { Deployment } from '../../../../xpanse-api/generated';

export function DeploymentText({ deployment }: { deployment: Deployment }): React.JSX.Element {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (deployment) {
        const yamlDocument = new YAML.Document();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        yamlDocument.contents = deployment.serviceAvailabilityConfig;
        return (
            <Popover
                content={<pre className={oclDisplayStyles.oclDeploymentScript}>{yamlDocument.toString()}</pre>}
                title={'Service Availability Config'}
                trigger='hover'
            >
                <Button className={oclDisplayStyles.oclDataHover} type={'link'}>
                    {`service availability`}
                </Button>
            </Popover>
        );
    }
    return <></>;
}
