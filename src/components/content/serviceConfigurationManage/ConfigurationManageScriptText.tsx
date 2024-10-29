/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Button, Popover } from 'antd';
import React from 'react';
import YAML from 'yaml';
import oclDisplayStyles from '../../../styles/ocl-display.module.css';
import { ConfigManageScript } from '../../../xpanse-api/generated';

export function ConfigurationManageScriptText({
    configManageScripts,
}: {
    configManageScripts: ConfigManageScript[] | undefined;
}): React.JSX.Element {
    if (configManageScripts && configManageScripts.length > 0) {
        const yamlDocument = new YAML.Document();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        yamlDocument.contents = configManageScripts;

        return (
            <Popover
                content={<pre className={oclDisplayStyles.oclDeploymentScript}>{yamlDocument.toString()}</pre>}
                title={'Service Configuration Script'}
                trigger='hover'
            >
                <Button className={oclDisplayStyles.oclDataHover} type={'link'}>
                    {'scripts'}
                </Button>
            </Popover>
        );
    }
    return <></>;
}
