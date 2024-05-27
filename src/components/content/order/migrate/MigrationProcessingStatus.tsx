/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React from 'react';
import myServicesStyles from '../../../../styles/my-services.module.css';
import { DeployedServiceDetails, VendorHostedDeployedServiceDetails } from '../../../../xpanse-api/generated';
import { convertMapToDetailsList } from '../../../utils/convertMapToDetailsList';

export function MigrationProcessingStatus({
    response,
    serviceHostingType,
}: {
    response: DeployedServiceDetails | VendorHostedDeployedServiceDetails;
    serviceHostingType: DeployedServiceDetails.serviceHostingType;
}): React.JSX.Element {
    const endPointMap = new Map<string, string>();
    if (response.serviceDeploymentState === DeployedServiceDetails.serviceDeploymentState.DEPLOYMENT_SUCCESSFUL) {
        if (response.deployedServiceProperties) {
            for (const key in response.deployedServiceProperties) {
                endPointMap.set(key, response.deployedServiceProperties[key]);
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
    } else if (response.serviceDeploymentState === DeployedServiceDetails.serviceDeploymentState.DEPLOYMENT_FAILED) {
        return (
            <div>
                <span>{'Migration Failed.'}</span>
                <div>
                    {serviceHostingType === DeployedServiceDetails.serviceHostingType.SELF
                        ? (response as DeployedServiceDetails).resultMessage
                        : 'Migrate status polling failed. Please visit MyServices page to check the status of the request.'}
                </div>
            </div>
        );
    }
    return <></>;
}
