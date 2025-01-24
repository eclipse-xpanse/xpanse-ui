/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert, Card, Empty, Tabs } from 'antd';
import React, { useState } from 'react';
import '../../../../styles/app.module.css';
import serviceActionStyles from '../../../../styles/service-action.module.css';
import {
    DeployedServiceDetails,
    UserOrderableServiceVo,
    VendorHostedDeployedServiceDetails,
} from '../../../../xpanse-api/generated';
import { isHandleKnownErrorResponse } from '../../common/error/isHandleKnownErrorResponse';
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
                children: (
                    <ServiceActionParameter
                        serviceId={deployedService.serviceId}
                        actionName={serviceAction.name}
                        actionParameters={serviceAction.actionParameters ?? []}
                        createServiceActionRequest={createServiceActionRequest}
                    />
                ),
            };
        }) ?? [];

    return (
        <>
            {createServiceActionRequest.isSuccess ? (
                <Alert
                    className={serviceActionStyles.serviceActionAlert}
                    message={'service action request submitted successfully'}
                    description={
                        <>
                            use the orders page in MyServices to see the status of the order, orderId{' '}
                            <strong>{createServiceActionRequest.data.orderId}</strong>.
                        </>
                    }
                    showIcon
                    type={'success'}
                    closable={true}
                />
            ) : createServiceActionRequest.isError ? (
                <div>
                    {isHandleKnownErrorResponse(createServiceActionRequest.error) ? (
                        <Alert
                            className={serviceActionStyles.serviceActionAlert}
                            message={<>{actionName} service action request failed.</>}
                            description={String(createServiceActionRequest.error.body.details)}
                            showIcon
                            type={'error'}
                            closable={true}
                        />
                    ) : (
                        <Alert
                            className={serviceActionStyles.serviceActionAlert}
                            message={<>{actionName} service action request failed.</>}
                            description={createServiceActionRequest.error.message}
                            showIcon
                            type={'error'}
                            closable={true}
                        />
                    )}
                </div>
            ) : (
                <></>
            )}
            {userOrderableServiceVo?.serviceActions ? (
                <Card>
                    <Tabs
                        defaultActiveKey={userOrderableServiceVo.serviceActions[0].name}
                        items={items}
                        onChange={onChange}
                    />
                </Card>
            ) : (
                <Empty description={'No actions defined for this service'} />
            )}
        </>
    );
};
