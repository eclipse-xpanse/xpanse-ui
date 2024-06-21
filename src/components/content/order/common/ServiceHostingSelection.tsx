/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Radio, RadioChangeEvent } from 'antd';
import React from 'react';
import serviceOrderStyles from '../../../../styles/service-order.module.css';
import { UserOrderableServiceVo } from '../../../../xpanse-api/generated';

export function ServiceHostingSelection({
    serviceHostingTypes,
    updateServiceHostingType,
    disabledAlways,
    previousSelection,
}: {
    serviceHostingTypes: UserOrderableServiceVo['serviceHostingType'][];
    updateServiceHostingType?: (serviceHostingType: UserOrderableServiceVo['serviceHostingType']) => void;
    disabledAlways: boolean;
    previousSelection: UserOrderableServiceVo['serviceHostingType'] | undefined;
}): React.JSX.Element {
    const onChange = (e: RadioChangeEvent) => {
        if (updateServiceHostingType) {
            updateServiceHostingType(e.target.value as UserOrderableServiceVo['serviceHostingType']);
        }
    };

    const value: UserOrderableServiceVo['serviceHostingType'] | undefined = previousSelection
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
                    <Radio value={'self'}>self</Radio>
                    <Radio value={'service-vendor'}>service-vendor</Radio>
                </Radio.Group>
            </div>
        </>
    );
}
