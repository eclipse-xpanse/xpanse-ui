/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Tabs } from 'antd';
import React, { useState } from 'react';
import { ObjectActionType, ServiceObject } from '../../../xpanse-api/generated';
import ServiceObjectManageItems from './ServiceObjectManageItems.tsx';

export const ServiceObjectItems = ({ serviceObject }: { serviceObject: ServiceObject }): React.JSX.Element => {
    const [objectManageActionType, setObjectManageActionType] = useState<ObjectActionType | undefined>(
        serviceObject.objectsManage?.[0]?.objectActionType
    );
    const onChange = (key: string) => {
        setObjectManageActionType(key as ObjectActionType);
    };
    const items = serviceObject.objectsManage?.map((objectManage) => {
        return {
            key: objectManage.objectActionType,
            label: objectManage.objectActionType,
            children: <ServiceObjectManageItems serviceObjectManage={objectManage} serviceObject={serviceObject} />,
        };
    });

    return (
        <>
            <Tabs items={items} activeKey={objectManageActionType} onChange={onChange} destroyOnHidden={true} />
        </>
    );
};
