/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { ControlOutlined } from '@ant-design/icons';
import React from 'react';
import catalogStyles from '../../../styles/catalog.module.css';
import { ServiceConfigurationManage } from '../../../xpanse-api/generated';
import ServiceConfigurationParameters from './ServiceConfigurationParameters';
import ServiceConfigurationScripts from './ServiceConfigurationScripts';

function ServiceConfigManagement({
    configurationManage,
}: {
    configurationManage: ServiceConfigurationManage;
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
                <ServiceConfigurationParameters parameters={configurationManage.configurationParameters} />
            ) : null}
        </>
    );
}

export default ServiceConfigManagement;
