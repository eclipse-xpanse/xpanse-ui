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
    response,
    currentServiceHostingType,
}: {
    response: DeployedServiceDetails | VendorHostedDeployedServiceDetails;
    currentServiceHostingType: string;
}): React.JSX.Element {
    const endPointMap = new Map<string, string>();
    if (response.serviceDeploymentState === serviceDeploymentState.DEPLOYMENT_SUCCESSFUL) {
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
    } else if (response.serviceDeploymentState === serviceDeploymentState.DEPLOYMENT_FAILED) {
        return (
            <div>
                <span>{'Migration Failed.'}</span>
                <div>
                    {currentServiceHostingType === serviceHostingType.SELF.toString()
                        ? (response as DeployedServiceDetails).resultMessage
                        : 'Migrate status polling failed. Please visit MyServices page to check the status of the request.'}
                </div>
            </div>
        );
    }
    return <></>;
}
