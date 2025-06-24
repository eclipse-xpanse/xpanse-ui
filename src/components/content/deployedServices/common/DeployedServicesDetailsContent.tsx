/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React from 'react';
import { DeployResource } from '../../../../xpanse-api/generated';
import { ServiceDetailParameterGroup } from '../myServices/ServiceDetailParameterGroup.tsx';
import { DeployedResources } from './DeployedResources';

export function DeployedServicesDetailsContent({
    content,
    requestParams,
    deployResources,
}: {
    content: Map<string, string>;
    requestParams: Map<string, string>;
    deployResources: DeployResource[];
}): React.JSX.Element {
    const items: React.JSX.Element[] = [];
    if (content.size > 0) {
        items.push(<ServiceDetailParameterGroup content={content} title='Endpoint Information' />);
    }
    if (requestParams.size > 0) {
        items.push(<ServiceDetailParameterGroup content={requestParams} title='Request Parameters' />);
    }
    if (deployResources.length > 0) {
        items.push(<DeployedResources content={deployResources} title='Deployed Resources' />);
    }

    return <span>{items}</span>;
}
