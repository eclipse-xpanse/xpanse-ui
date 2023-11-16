/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { ServiceTemplateDetailVo } from '../../../../../xpanse-api/generated';
import { Divider, Radio, RadioChangeEvent } from 'antd';
import React from 'react';
import { EnvironmentOutlined } from '@ant-design/icons';

export function ServiceHostingOptions({
    serviceTemplateDetailVos,
    defaultDisplayedService,
    updateServiceHostingType,
}: {
    serviceTemplateDetailVos: ServiceTemplateDetailVo[];
    defaultDisplayedService: ServiceTemplateDetailVo;
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
            <h3 className={'catalog-details-h3'}>
                <EnvironmentOutlined />
                &nbsp;Service Hosting Options
            </h3>
            <Radio.Group
                disabled={serviceHostingTypes.length === 1}
                value={defaultDisplayedService.serviceHostingType}
                onChange={onChange}
            >
                <Radio value={ServiceTemplateDetailVo.serviceHostingType.SELF}>self</Radio>
                <Radio value={ServiceTemplateDetailVo.serviceHostingType.SERVICE_VENDOR}>service-vendor</Radio>
            </Radio.Group>
            <Divider />
        </>
    );
}
