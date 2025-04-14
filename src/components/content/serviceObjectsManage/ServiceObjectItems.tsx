/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Tabs } from 'antd';
import React, { useState } from 'react';
import { objectActionType, ServiceObject } from '../../../xpanse-api/generated';
import ServiceObjectManageItems from './ServiceObjectManageItems.tsx';

export const ServiceObjectItems = ({ serviceObject }: { serviceObject: ServiceObject }): React.JSX.Element => {
    const [objectManageActionType, setObjectManageActionType] = useState<objectActionType | undefined>(
        serviceObject.objectsManage?.[0]?.objectActionType as objectActionType
    );
    const onChange = (key: string) => {
        setObjectManageActionType(key as objectActionType);
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
            <Tabs items={items} activeKey={objectManageActionType} onChange={onChange} destroyInactiveTabPane={true} />
        </>
    );
};
