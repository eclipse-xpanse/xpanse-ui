/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Typography } from 'antd';
import serviceOperationStyles from '../../../../styles/service-operation.module.css';
import { ServiceOrderDetails } from '../../../../xpanse-api/generated';
const { Text } = Typography;
export const MyServiceHistoryDetails = ({ record }: { record: ServiceOrderDetails }) => {
    const requestBodyContent =
        record.requestBody && Object.keys(record.requestBody).length > 0 ? (
            <>
                <div className={serviceOperationStyles.orderHistoryRequestContent}>
                    <pre>{JSON.stringify(record.requestBody, null, 2)}</pre>
                </div>
            </>
        ) : (
            <Text>Empty Requests</Text>
        );

    const resultPropertiesContent =
        record.resultProperties && Object.keys(record.resultProperties).length > 0 ? (
            <>
                <ul className={serviceOperationStyles.orderHistoryValueLi}>
                    {Object.entries(record.resultProperties).map(([key, value]) => (
                        <li key={key}>
                            <Text strong>{key}:</Text>
                            <pre>{JSON.stringify(value, null, 2)}</pre>
                        </li>
                    ))}
                </ul>
            </>
        ) : (
            <Text>No Results Changed</Text>
        );

    return (
        <div style={{ maxHeight: '60vh', maxWidth: '60vw', overflowY: 'auto' }}>
            <h4>Request Body:</h4>
            {requestBodyContent}
            <h4>Result Properties:</h4>
            {resultPropertiesContent}
        </div>
    );
};
