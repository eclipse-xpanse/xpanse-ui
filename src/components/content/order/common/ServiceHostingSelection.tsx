/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Radio, RadioChangeEvent } from 'antd';
import React from 'react';
import serviceOrderStyles from '../../../../styles/service-order.module.css';
import { serviceHostingType } from '../../../../xpanse-api/generated';

export function ServiceHostingSelection({
    serviceHostingTypes,
    updateServiceHostingType,
    disabledAlways,
    previousSelection,
}: {
    serviceHostingTypes: string[];
    updateServiceHostingType?: (serviceHostingType: serviceHostingType) => void;
    disabledAlways: boolean;
    previousSelection: string;
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
        <>
            <div className={serviceOrderStyles.orderFormFlexElements}>
                <div
                    className={`${serviceOrderStyles.orderFormSelectionStyle} ${serviceOrderStyles.orderFormItemName}`}
                >
                    Service Hosted By:
                </div>
                <Radio.Group
                    onChange={onChange}
                    disabled={disabledAlways || serviceHostingTypes.length === 1}
                    value={value}
                    className={serviceOrderStyles.orderFormSelectionStyle}
                >
                    <Radio value={serviceHostingType.SELF}>self</Radio>
                    <Radio value={serviceHostingType.SERVICE_VENDOR}>service-vendor</Radio>
                </Radio.Group>
            </div>
        </>
    );
}
