/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import '../../../../styles/app.css';
import {
    DeployedService,
    DeployedServiceDetails,
    DeployResource,
    VendorHostedDeployedServiceDetails,
} from '../../../../xpanse-api/generated';
import React from 'react';
import { DeploymentResultMessage } from '../common/DeploymentResultMessage';
import { DeployedServicesDetailsContent } from '../common/DeployedServicesDetailsContent';

export const MyServiceDetails = ({
    deployedService,
}: {
    deployedService: DeployedServiceDetails | VendorHostedDeployedServiceDetails;
}): React.JSX.Element => {
    const endPointMap = new Map<string, string>();
    const requestMap = new Map<string, unknown>();
    let resultMessage = undefined;
    let deployResourceMap: DeployResource[] = [];

    if (deployedService.serviceHostingType.toString() === DeployedService.serviceHostingType.SELF.toString()) {
        const serviceDetailVo = deployedService as DeployedServiceDetails;
        if (serviceDetailVo.deployedServiceProperties) {
            for (const key in serviceDetailVo.deployedServiceProperties) {
                endPointMap.set(key, serviceDetailVo.deployedServiceProperties[key]);
            }
        }
        if (serviceDetailVo.deployRequest.serviceRequestProperties) {
            for (const key in serviceDetailVo.deployRequest.serviceRequestProperties) {
                requestMap.set(key, serviceDetailVo.deployRequest.serviceRequestProperties[key]);
            }
        }
        if (serviceDetailVo.resultMessage) {
            resultMessage = DeploymentResultMessage(serviceDetailVo.resultMessage);
        }
        if (serviceDetailVo.deployResources) {
            deployResourceMap = serviceDetailVo.deployResources;
        }
    } else {
        const serviceDetailVo = deployedService as VendorHostedDeployedServiceDetails;
        if (serviceDetailVo.deployedServiceProperties) {
            for (const key in serviceDetailVo.deployedServiceProperties) {
                endPointMap.set(key, serviceDetailVo.deployedServiceProperties[key]);
            }
        }
        if (serviceDetailVo.deployRequest.serviceRequestProperties) {
            for (const key in serviceDetailVo.deployRequest.serviceRequestProperties) {
                requestMap.set(key, serviceDetailVo.deployRequest.serviceRequestProperties[key]);
            }
        }
    }

    return (
        <>
            <DeployedServicesDetailsContent
                content={endPointMap}
                requestParams={requestMap}
                resultMessage={resultMessage}
                deployResources={deployResourceMap}
                serviceTemplateId={deployedService.serviceTemplateId}
            />
        </>
    );
};
