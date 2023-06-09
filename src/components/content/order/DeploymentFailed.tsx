/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { ServiceDetailVo } from '../../../xpanse-api/generated';

function DeploymentFailed(response: ServiceDetailVo): JSX.Element {
    return (
        <div>
            <span>{'Deployment Failed.'}</span>
            <div>{response.resultMessage}</div>
        </div>
    );
}

export default DeploymentFailed;
