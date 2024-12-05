/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Typography } from 'antd';
import serviceModifyStyles from '../../../../styles/service-modify.module.css';
import { ServiceOrderDetails } from '../../../../xpanse-api/generated';

const { Text } = Typography;

export const MyServiceHistoryDetails = ({ record }: { record: ServiceOrderDetails }) => {
    const previousDeployRequest = record.previousDeployRequest;
    const newDeployRequest = record.newDeployRequest;

    const previousContent = previousDeployRequest ? (
        <ul className={serviceModifyStyles.modifyHistoryValueLi}>
            <li>
                <Text strong>Customer Service Name:</Text>&nbsp;{previousDeployRequest.customerServiceName}
            </li>
            {previousDeployRequest.serviceRequestProperties ? (
                <li>
                    <Text strong>Service Request Properties:</Text>&nbsp;
                    {JSON.stringify(previousDeployRequest.serviceRequestProperties)}
                </li>
            ) : (
                <></>
            )}
        </ul>
    ) : null;

    const newContent = newDeployRequest ? (
        <ul className={serviceModifyStyles.modifyHistoryValueLi}>
            <li>
                <Text strong>Customer Service Name:</Text>&nbsp;{newDeployRequest.customerServiceName}
            </li>
            {newDeployRequest.serviceRequestProperties ? (
                <li>
                    <Text strong>Service Request Properties:</Text>&nbsp;
                    {JSON.stringify(newDeployRequest.serviceRequestProperties)}
                </li>
            ) : (
                <></>
            )}
        </ul>
    ) : null;

    return (
        <div>
            <h4>Previous Deploy Request:</h4>
            {previousContent}
            <h4>New Deploy Request:</h4>
            {newContent}
        </div>
    );
};
