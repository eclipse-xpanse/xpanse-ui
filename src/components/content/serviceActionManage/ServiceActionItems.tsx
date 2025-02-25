/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React from 'react';
import { ServiceAction } from '../../../xpanse-api/generated';
import ServiceChangeParameters from '../common/serviceChangeParameters/ServiceChangeParameters.tsx';
import ServiceActionScripts from './ServiceActionScripts.tsx';

function ServiceActionItems({ serviceAction }: { serviceAction: ServiceAction }): React.JSX.Element {
    return (
        <>
            {serviceAction.actionManageScripts ? <ServiceActionScripts serviceAction={serviceAction} /> : null}
            {serviceAction.actionParameters ? (
                <ServiceChangeParameters
                    parameters={serviceAction.actionParameters}
                    tableName={'Service Action Parameters'}
                />
            ) : null}
        </>
    );
}

export default ServiceActionItems;
