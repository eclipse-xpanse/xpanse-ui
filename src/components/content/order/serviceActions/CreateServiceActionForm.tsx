/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Card, Empty, Skeleton, Tabs } from 'antd';
import React, { useState } from 'react';
import '../../../../styles/app.module.css';
import {
    DeployedServiceDetails,
    serviceHostingType,
    UserOrderableServiceVo,
    VendorHostedDeployedServiceDetails,
} from '../../../../xpanse-api/generated';
import { ServiceActionParameter } from './ServiceActionParameter';
import { useCreateServiceActionRequest } from './useCreateServiceActionRequest';

export const CreateServiceActionForm = ({
    deployedService,
    userOrderableServiceVo,
}: {
    deployedService: DeployedServiceDetails | VendorHostedDeployedServiceDetails;
    userOrderableServiceVo: UserOrderableServiceVo | undefined;
}): React.JSX.Element => {
    const createServiceActionRequest = useCreateServiceActionRequest();
    const [actionName, setActionName] = useState<string | undefined>(userOrderableServiceVo?.serviceActions?.[0]?.name);
    const onChange = (key: string) => {
        setActionName(key);
        createServiceActionRequest.reset();
    };
    const items =
        userOrderableServiceVo?.serviceActions?.map((serviceAction) => {
            return {
                key: serviceAction.name,
                label: serviceAction.name,
                disabled: createServiceActionRequest.isPending || createServiceActionRequest.isSuccess,
                children: (
                    <ServiceActionParameter
                        serviceId={deployedService.serviceId}
                        serviceHostType={deployedService.serviceHostingType as serviceHostingType}
                        actionName={serviceAction.name}
                        actionParameters={serviceAction.actionParameters ?? []}
                        createServiceActionRequest={createServiceActionRequest}
                    />
                ),
            };
        }) ?? [];

    if (!userOrderableServiceVo) {
        return <Skeleton active />;
    }

    if (!userOrderableServiceVo.serviceActions || userOrderableServiceVo.serviceActions.length === 0) {
        return <Empty description={'No actions defined for this service.'} />;
    }

    return (
        <>
            <Card>
                <Tabs
                    defaultActiveKey={userOrderableServiceVo.serviceActions[0].name}
                    items={items}
                    activeKey={actionName}
                    onChange={onChange}
                    destroyInactiveTabPane={true}
                />
            </Card>
        </>
    );
};
