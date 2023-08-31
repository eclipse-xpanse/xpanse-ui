/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Deployment } from '../../../../xpanse-api/generated';
import React from 'react';
import YAML from 'yaml';
import { Button, Popover } from 'antd';

export function DeploymentText({ deployment }: { deployment: Deployment }): React.JSX.Element {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (deployment) {
        const yamlDocument = new YAML.Document();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        yamlDocument.contents = deployment;
        return (
            <Popover
                content={<pre className={'deployment-script'}>{yamlDocument.toString()}</pre>}
                title={'Deployment'}
                trigger='hover'
            >
                <Button className={'ocl-data-hover'} type={'link'}>
                    {deployment.kind}
                </Button>
            </Popover>
        );
    }
    return <></>;
}
