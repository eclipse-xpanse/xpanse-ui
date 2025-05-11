/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React from 'react';
import { ObjectManage, ServiceObject } from '../../../xpanse-api/generated';
import ServiceObjectParameters from './ServiceObjectParameters.tsx';
import ServiceObjectScripts from './ServiceObjectScripts.tsx';

function ServiceObjectManageItems({
    serviceObjectManage,
    serviceObject,
}: {
    serviceObjectManage: ObjectManage;
    serviceObject: ServiceObject;
}): React.JSX.Element {
    return (
        <>
            <ServiceObjectScripts serviceObjectManage={serviceObjectManage} serviceObject={serviceObject} />

            {serviceObjectManage.objectParameters ? (
                <ServiceObjectParameters
                    parameters={serviceObjectManage.objectParameters}
                    tableName={'Service Object Parameters'}
                />
            ) : null}
        </>
    );
}

export default ServiceObjectManageItems;
