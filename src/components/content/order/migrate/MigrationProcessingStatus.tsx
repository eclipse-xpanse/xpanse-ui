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

export function MigrationProcessingStatus({
    deployedResponse,
    destroyedResponse,
}: {
    deployedResponse: DeployedServiceDetails | VendorHostedDeployedServiceDetails | undefined;
    destroyedResponse: DeployedServiceDetails | VendorHostedDeployedServiceDetails | undefined;
}): React.JSX.Element {
    const endPointMap = new Map<string, string>();

    if (deployedResponse && deployedResponse.serviceDeploymentState === serviceDeploymentState.DEPLOYMENT_SUCCESSFUL) {
        if (
            destroyedResponse &&
            destroyedResponse.serviceDeploymentState === serviceDeploymentState.DESTROY_SUCCESSFUL
        ) {
            if (deployedResponse.deployedServiceProperties) {
                for (const key in deployedResponse.deployedServiceProperties) {
                    endPointMap.set(key, deployedResponse.deployedServiceProperties[key]);
                }
            }
            if (endPointMap.size > 0) {
                return (
                    <>
                        <span>{'Deployment Successful'}</span>
                        <div className={myServicesStyles.serviceInstanceDetailPosition}>
                            {convertMapToDetailsList(endPointMap, 'Endpoint Information')}
                        </div>
                    </>
                );
            } else {
                return <span>{'Migration Successful'}</span>;
            }
        } else if (
            destroyedResponse &&
            destroyedResponse.serviceDeploymentState === serviceDeploymentState.DESTROY_FAILED
        ) {
            return (
                <div>
                    <span>{'Migration Failed.'}</span>
                    <div>
                        {destroyedResponse.serviceHostingType === serviceHostingType.SELF.toString()
                            ? (destroyedResponse as DeployedServiceDetails).resultMessage
                                ? (destroyedResponse as DeployedServiceDetails).resultMessage
                                : (destroyedResponse as DeployedServiceDetails).resultMessage
                            : 'Migrate status polling failed. Please visit MyServices page to check ' +
                              'the status of the request and contact service vendor for error details.'}
                    </div>
                </div>
            );
        }
    } else if (
        deployedResponse &&
        deployedResponse.serviceDeploymentState === serviceDeploymentState.DEPLOYMENT_FAILED
    ) {
        return (
            <div>
                <span>{'Migration Failed.'}</span>
                <div>
                    {deployedResponse.serviceHostingType === serviceHostingType.SELF.toString()
                        ? (deployedResponse as DeployedServiceDetails).resultMessage
                            ? (deployedResponse as DeployedServiceDetails).resultMessage
                            : (deployedResponse as DeployedServiceDetails).resultMessage
                        : 'Migrate status polling failed. Please visit MyServices page to check ' +
                          'the status of the request and contact service vendor for error details.'}
                </div>
            </div>
        );
    }

    return <></>;
}
