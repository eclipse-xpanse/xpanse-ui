/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Form, Radio, RadioChangeEvent, Space } from 'antd';
import React from 'react';
import serviceOrderStyles from '../../../../styles/service-order.module.css';
import { serviceHostingType } from '../../../../xpanse-api/generated';

export function ServiceHostingSelection({
    serviceHostingTypes,
    updateServiceHostingType,
    disabledAlways,
    previousSelection,
}: {
    serviceHostingTypes: serviceHostingType[];
    updateServiceHostingType?: (serviceHostingType: serviceHostingType) => void;
    disabledAlways: boolean;
    previousSelection: serviceHostingType | undefined;
}): React.JSX.Element {
    const onChange = (e: RadioChangeEvent) => {
        if (updateServiceHostingType) {
            updateServiceHostingType(e.target.value as serviceHostingType);
        }
    };

    const value: string | undefined = previousSelection
        ? previousSelection
        : serviceHostingTypes.length > 0
          ? serviceHostingTypes[0]
          : undefined;

    return (
        <div className={serviceOrderStyles.orderFormSelectionFirstInGroup}>
            <Form.Item
                name='Service Hosted By'
                label={
                    <p
                        className={`${serviceOrderStyles.orderFormSelectionStyle} ${serviceOrderStyles.orderFormItemName}`}
                    >
                        {'Service Hosted By'}
                    </p>
                }
                labelCol={{ span: 2, style: { textAlign: 'left' } }}
            >
                <Space wrap>
                    <Radio.Group
                        onChange={onChange}
                        disabled={disabledAlways || serviceHostingTypes.length === 1}
                        value={value}
                        className={serviceOrderStyles.orderFormSelectionStyle}
                    >
                        <Radio value={serviceHostingType.SELF}>self</Radio>
                        <Radio value={serviceHostingType.SERVICE_VENDOR}>service-vendor</Radio>
                    </Radio.Group>
                </Space>
            </Form.Item>
        </div>
    );
}
