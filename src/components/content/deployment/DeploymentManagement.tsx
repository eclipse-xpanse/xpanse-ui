/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { DeploymentUnitOutlined } from '@ant-design/icons';
import React from 'react';
import catalogStyles from '../../../styles/catalog.module.css';
import { Deployment } from '../../../xpanse-api/generated';
import DeploymentInformation from './DeploymentInformation.tsx';
import DeploymentVariables from './DeploymentVariables';

function DeploymentManagement({ deployment }: { deployment: Deployment }): React.JSX.Element {
    return (
        <>
            <h3 className={catalogStyles.catalogDetailsH3}>
                <DeploymentUnitOutlined />
                &nbsp;Service Deployment Management
            </h3>
            <DeploymentInformation deployment={deployment} />
            <DeploymentVariables
                variables={deployment.terraformDeployment?.inputVariables ?? deployment.helmDeployment?.inputVariables}
            />
        </>
    );
}

export default DeploymentManagement;
