/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React from 'react';
import myServicesStyle from '../../../../styles/my-services.module.css';
import { DeployResource } from '../../../../xpanse-api/generated';
import { convertMapToDetailsList } from '../../../utils/convertMapToDetailsList';
import { ContactDetailsShowType } from '../../common/ocl/ContactDetailsShowType';
import { ContactDetailsText } from '../../common/ocl/ContactDetailsText';
import useGetOrderableServiceDetailsByServiceIdQuery from '../myServices/query/useGetOrderableServiceDetailsByServiceIdQuery.ts';
import { DeployedResources } from './DeployedResources';

export function DeployedServicesDetailsContent({
    content,
    requestParams,
    deployResources,
    serviceId,
}: {
    content: Map<string, string>;
    requestParams: Map<string, string>;
    deployResources: DeployResource[];
    serviceId: string;
}): React.JSX.Element {
    const items: React.JSX.Element[] = [];
    const getOrderableServiceDetails = useGetOrderableServiceDetailsByServiceIdQuery(serviceId);

    if (getOrderableServiceDetails.isSuccess) {
        items.push(
            <div className={myServicesStyle.myServiceContactContainer}>
                <div className={myServicesStyle.myServiceContactContainerContentPosition}>
                    <ContactDetailsText
                        serviceProviderContactDetails={getOrderableServiceDetails.data.serviceProviderContactDetails}
                        showFor={ContactDetailsShowType.Order}
                    />
                </div>
            </div>
        );
    }
    if (content.size > 0) {
        items.push(convertMapToDetailsList(content, 'Endpoint Information'));
    }
    if (requestParams.size > 0) {
        items.push(convertMapToDetailsList(requestParams, 'Request Parameters'));
    }
    if (deployResources.length > 0) {
        items.push(DeployedResources(deployResources, 'Deployed Resources'));
    }

    return <span>{items}</span>;
}
