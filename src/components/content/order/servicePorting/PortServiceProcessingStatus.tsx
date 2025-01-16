/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React from 'react';
import myServicesStyles from '../../../../styles/my-services.module.css';
import {
    DeployedServiceDetails,
    serviceDeploymentState,
    VendorHostedDeployedServiceDetails,
} from '../../../../xpanse-api/generated';
import { convertMapToDetailsList } from '../../../utils/convertMapToDetailsList';

export function PortServiceProcessingStatus({
    deployedResponse,
}: {
    deployedResponse: DeployedServiceDetails | VendorHostedDeployedServiceDetails | undefined;
}): React.JSX.Element {
    const endPointMap = new Map<string, string>();

    if (deployedResponse && deployedResponse.serviceDeploymentState === serviceDeploymentState.DEPLOYMENT_SUCCESSFUL) {
        if (deployedResponse.deployedServiceProperties) {
            for (const key in deployedResponse.deployedServiceProperties) {
                endPointMap.set(key, deployedResponse.deployedServiceProperties[key]);
            }
        }
        if (endPointMap.size > 0) {
            return (
                <>
                    <span>{'Service ported successfully'}</span>
                    <div className={myServicesStyles.serviceInstanceDetailPosition}>
                        {convertMapToDetailsList(endPointMap, 'Endpoint Information')}
                    </div>
                </>
            );
        } else {
            return <span>{'Service ported successfully'}</span>;
        }
    }

    return <></>;
}
