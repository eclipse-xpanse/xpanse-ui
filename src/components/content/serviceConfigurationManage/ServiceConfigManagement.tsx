/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { ControlOutlined } from '@ant-design/icons';
import React from 'react';
import catalogStyles from '../../../styles/catalog.module.css';
import { ServiceChangeManage } from '../../../xpanse-api/generated';
import ServiceChangeParameters from '../common/serviceChangeParameters/ServiceChangeParameters.tsx';
import ServiceConfigurationScripts from './ServiceConfigurationScripts';

function ServiceConfigManagement({
    configurationManage,
}: {
    configurationManage: ServiceChangeManage;
}): React.JSX.Element {
    return (
        <>
            <h3 className={catalogStyles.catalogDetailsH3}>
                <ControlOutlined />
                &nbsp;Service Configuration Management
            </h3>
            {configurationManage.configManageScripts ? (
                <ServiceConfigurationScripts configurationManage={configurationManage} />
            ) : null}
            {configurationManage.configurationParameters ? (
                <ServiceChangeParameters
                    parameters={configurationManage.configurationParameters}
                    tableName={'Service Configuration Parameters'}
                />
            ) : null}
        </>
    );
}

export default ServiceConfigManagement;
