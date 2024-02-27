/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React from 'react';
import { DeployResource } from '../../../../xpanse-api/generated';
import { convertMapToDetailsList } from '../../../utils/convertMapToDetailsList';
import { DeployedResources } from './DeployedResources';
import useGetOrderableServiceDetailsQuery from '../myServices/query/useGetOrderableServiceDetailsQuery';
import { ContactDetailsShowType } from '../../common/ocl/ContactDetailsShowType';
import { ContactDetailsText } from '../../common/ocl/ContactDetailsText';

export function DeployedServicesDetailsContent({
    content,
    requestParams,
    resultMessage,
    deployResources,
    serviceTemplateId,
}: {
    content: Map<string, string>;
    requestParams: Map<string, unknown>;
    resultMessage: React.JSX.Element | undefined;
    deployResources: DeployResource[];
    serviceTemplateId?: string;
}): React.JSX.Element {
    const items: React.JSX.Element[] = [];
    const getOrderableServiceDetails = useGetOrderableServiceDetailsQuery(serviceTemplateId);

    if (getOrderableServiceDetails.isSuccess) {
        items.push(
            <div className={'my-service-contact-container'}>
                <div className={'my-service-contact-container-content-position'}>
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
    if (resultMessage !== undefined) {
        items.push(resultMessage);
    }
    if (deployResources.length > 0) {
        items.push(DeployedResources(deployResources, 'Deployed Resources'));
    }

    return <span>{items}</span>;
}
