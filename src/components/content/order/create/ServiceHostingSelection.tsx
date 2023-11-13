/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Radio, RadioChangeEvent } from 'antd';
import { UserOrderableServiceVo } from '../../../../xpanse-api/generated';

export function ServiceHostingSelection({
    serviceHostingTypes,
    updateServiceHostingType,
}: {
    serviceHostingTypes: UserOrderableServiceVo.serviceHostingType[];
    updateServiceHostingType: (serviceHostingType: UserOrderableServiceVo.serviceHostingType) => void;
}) {
    const onChange = (e: RadioChangeEvent) => {
        updateServiceHostingType(e.target.value as UserOrderableServiceVo.serviceHostingType);
    };

    const defaultValue: UserOrderableServiceVo.serviceHostingType | undefined =
        serviceHostingTypes.length > 0 ? serviceHostingTypes[0] : undefined;

    return (
        <>
            <div className={'cloud-provider-tab-class'}>Service Hosted By:</div>
            <Radio.Group onChange={onChange} disabled={serviceHostingTypes.length === 1} defaultValue={defaultValue}>
                <Radio value={UserOrderableServiceVo.serviceHostingType.SELF}>self</Radio>
                <Radio value={UserOrderableServiceVo.serviceHostingType.SERVICE_VENDOR}>service-vendor</Radio>
            </Radio.Group>
        </>
    );
}
