/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Descriptions } from 'antd';
import React from 'react';
import catalogStyles from '../../../styles/catalog.module.css';
import deploymentVariablesStyles from '../../../styles/deployment-variables.module.css';
import oclDisplayStyles from '../../../styles/ocl-display.module.css';
import { ServiceChangeManage } from '../../../xpanse-api/generated';
import { ConfigurationManageScriptText } from './ConfigurationManageScriptText';
import { getServiceConfigurationToolIcon } from './getServiceConfigurationToolIcon';

function ServiceConfigurationScripts({
    configurationManage,
}: {
    configurationManage: ServiceChangeManage;
}): React.JSX.Element {
    return (
        <>
            <div className={`${catalogStyles.catalogDetailsH6} ${catalogStyles.managementInfo}`}>
                &nbsp;Configuration Scripts
            </div>
            <Descriptions column={1} bordered className={oclDisplayStyles.oclDataInfoTable}>
                <Descriptions.Item label='Type'>
                    <img
                        src={getServiceConfigurationToolIcon(configurationManage.type.valueOf())}
                        alt={configurationManage.type}
                        className={deploymentVariablesStyles.ansibleKindContent}
                    />
                </Descriptions.Item>
                <Descriptions.Item label='Agent Version'>{configurationManage.agentVersion}</Descriptions.Item>
                <Descriptions.Item label='Config Manage Scripts'>
                    <ConfigurationManageScriptText configManageScripts={configurationManage.configManageScripts} />
                </Descriptions.Item>
            </Descriptions>
        </>
    );
}

export default ServiceConfigurationScripts;
