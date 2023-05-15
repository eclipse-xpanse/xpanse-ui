/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { ServiceDetailVo } from '../../../xpanse-api/generated';
import { convertMapToUnorderedList } from '../../utils/generateUnorderedList';

function DeploymentSuccessful(response: ServiceDetailVo): JSX.Element {
    const endPointMap = new Map<string, string>();
    if (response.deployedServiceProperties) {
        for (const key in response.deployedServiceProperties) {
            endPointMap.set(key, response.deployedServiceProperties[key]);
        }
    }
    if (endPointMap.size > 0) {
        return (
            <div>
                <span>{'Deployment Successful'}</span>
                <div>{convertMapToUnorderedList(endPointMap, 'Endpoint Information')}</div>
            </div>
        );
    } else {
        return <span>{'Deployment Successful'}</span>;
    }
}

export default DeploymentSuccessful;
