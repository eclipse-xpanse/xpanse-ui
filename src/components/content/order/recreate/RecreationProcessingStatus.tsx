/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React from 'react';
import myServicesStyles from '../../../../styles/my-services.module.css';
import {
    DeployedServiceDetails,
    serviceDeploymentState,
    serviceHostingType,
    VendorHostedDeployedServiceDetails,
} from '../../../../xpanse-api/generated';
import { convertMapToDetailsList } from '../../../utils/convertMapToDetailsList';

export function RecreationProcessingStatus({
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
                    <span>{'Recreation Successful'}</span>
                    <div className={myServicesStyles.serviceInstanceDetailPosition}>
                        {convertMapToDetailsList(endPointMap, 'Endpoint Information')}
                    </div>
                </>
            );
        } else {
            return <span>{'Recreation Successful'}</span>;
        }
    } else if (
        (deployedResponse && deployedResponse.serviceDeploymentState === serviceDeploymentState.DEPLOYMENT_FAILED) ||
        (deployedResponse && deployedResponse.serviceDeploymentState === serviceDeploymentState.DESTROY_FAILED)
    ) {
        return (
            <div>
                <span>{'Recreation Failed.'}</span>
                <div>
                    {deployedResponse.serviceHostingType === serviceHostingType.SELF.toString()
                        ? (deployedResponse as DeployedServiceDetails).resultMessage
                            ? (deployedResponse as DeployedServiceDetails).resultMessage
                            : (deployedResponse as DeployedServiceDetails).resultMessage
                        : 'Recreate status polling failed. Please visit MyServices page to check ' +
                          'the status of the request and contact service vendor for error details.'}
                </div>
            </div>
        );
    }

    return <></>;
}
