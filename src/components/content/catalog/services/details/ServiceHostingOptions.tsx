/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Radio, RadioChangeEvent } from 'antd';
import React from 'react';
import { ServiceTemplateDetailVo } from '../../../../../xpanse-api/generated';

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
    const serviceHostingTypes: ServiceTemplateDetailVo.serviceHostingType[] = [];
    serviceTemplateDetailVos.forEach((serviceTemplateDetailVo) => {
        if (!serviceHostingTypes.includes(serviceTemplateDetailVo.serviceHostingType)) {
            serviceHostingTypes.push(serviceTemplateDetailVo.serviceHostingType);
        }
    });

    const onChange = (e: RadioChangeEvent) => {
        if (updateServiceHostingType) {
            serviceTemplateDetailVos.forEach((serviceTemplateDetailVo) => {
                if (
                    serviceTemplateDetailVo.serviceHostingType ===
                    (e.target.value as ServiceTemplateDetailVo.serviceHostingType)
                ) {
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
                <Radio value={ServiceTemplateDetailVo.serviceHostingType.SELF}>self</Radio>
                <Radio value={ServiceTemplateDetailVo.serviceHostingType.SERVICE_VENDOR}>service-vendor</Radio>
            </Radio.Group>
        </>
    );
}
