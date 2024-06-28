/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Radio, RadioChangeEvent } from 'antd';
import React from 'react';
import { ServiceTemplateDetailVo, serviceHostingType } from '../../../../../xpanse-api/generated';

export function ServiceHostingOptions({
    serviceTemplateDetailVos,
    defaultDisplayedService,
    serviceHostingTypeInQuery,
    updateServiceHostingType,
}: {
    serviceTemplateDetailVos: ServiceTemplateDetailVo[];
    defaultDisplayedService: ServiceTemplateDetailVo;
    serviceHostingTypeInQuery: string;
    updateServiceHostingType?: (serviceTemplateDetailVo: ServiceTemplateDetailVo) => void;
}): React.JSX.Element {
    const serviceHostingTypes: serviceHostingType[] = [];
    serviceTemplateDetailVos.forEach((serviceTemplateDetailVo) => {
        if (!serviceHostingTypes.includes(serviceTemplateDetailVo.serviceHostingType as serviceHostingType)) {
            serviceHostingTypes.push(serviceTemplateDetailVo.serviceHostingType as serviceHostingType);
        }
    });

    const onChange = (e: RadioChangeEvent) => {
        if (updateServiceHostingType) {
            serviceTemplateDetailVos.forEach((serviceTemplateDetailVo) => {
                if (serviceHostingType === e.target.value) {
                    updateServiceHostingType(serviceTemplateDetailVo);
                }
            });
        }
    };

    return (
        <>
            <Radio.Group
                disabled={serviceHostingTypes.length === 1}
                value={
                    serviceHostingTypeInQuery.length > 0
                        ? serviceHostingTypeInQuery
                        : defaultDisplayedService.serviceHostingType
                }
                onChange={onChange}
            >
                <Radio value={serviceHostingType.SELF}>self</Radio>
                <Radio value={serviceHostingType.SERVICE_VENDOR}>service-vendor</Radio>
            </Radio.Group>
        </>
    );
}
