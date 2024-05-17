/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Radio, RadioChangeEvent } from 'antd';
import React from 'react';
import { UserOrderableServiceVo } from '../../../../xpanse-api/generated';

export function ServiceHostingSelection({
    serviceHostingTypes,
    updateServiceHostingType,
    disabledAlways,
    previousSelection,
}: {
    serviceHostingTypes: UserOrderableServiceVo.serviceHostingType[];
    updateServiceHostingType?: (serviceHostingType: UserOrderableServiceVo.serviceHostingType) => void;
    disabledAlways: boolean;
    previousSelection: UserOrderableServiceVo.serviceHostingType | undefined;
}): React.JSX.Element {
    const onChange = (e: RadioChangeEvent) => {
        if (updateServiceHostingType) {
            updateServiceHostingType(e.target.value as UserOrderableServiceVo.serviceHostingType);
        }
    };

    const value: UserOrderableServiceVo.serviceHostingType | undefined = previousSelection
        ? previousSelection
        : serviceHostingTypes.length > 0
          ? serviceHostingTypes[0]
          : undefined;

    return (
        <>
            <div className={'cloud-provider-tab-class'}>Service Hosted By:</div>
            <Radio.Group
                onChange={onChange}
                disabled={disabledAlways || serviceHostingTypes.length === 1}
                value={value}
            >
                <Radio value={UserOrderableServiceVo.serviceHostingType.SELF}>self</Radio>
                <Radio value={UserOrderableServiceVo.serviceHostingType.SERVICE_VENDOR}>service-vendor</Radio>
            </Radio.Group>
        </>
    );
}
