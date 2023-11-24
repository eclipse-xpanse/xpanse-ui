/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React from 'react';
import { DeployResource } from '../../../../xpanse-api/generated';
import { convertMapToDetailsList } from '../../../utils/convertMapToDetailsList';
import { DeployedResources } from './DeployedResources';

export function DeployedServicesDetailsContent({
    content,
    requestParams,
    resultMessage,
    deployResources,
}: {
    content: Map<string, string>;
    requestParams: Map<string, unknown>;
    resultMessage: React.JSX.Element | undefined;
    deployResources: DeployResource[];
}): React.JSX.Element {
    const items: React.JSX.Element[] = [];
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
