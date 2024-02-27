/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { ServiceTemplateDetailVo } from '../../../../../xpanse-api/generated';
import serviceRegistrationState = ServiceTemplateDetailVo.serviceRegistrationState;
import { Tag } from 'antd';
import { CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import React from 'react';

export function ServiceStatus({
    serviceStatus,
}: {
    serviceStatus: ServiceTemplateDetailVo.serviceRegistrationState;
}): React.JSX.Element {
    switch (serviceStatus) {
        case serviceRegistrationState.APPROVED:
            return (
                <Tag icon={<CheckCircleOutlined />} color='success' className={'catalog-service-status-size'}>
                    {serviceStatus.valueOf()}
                </Tag>
            );
        case ServiceTemplateDetailVo.serviceRegistrationState.APPROVAL_PENDING:
            return (
                <Tag icon={<CheckCircleOutlined />} color='orange' className={'catalog-service-status-size'}>
                    {serviceStatus.valueOf()}
                </Tag>
            );
        default:
            return (
                <Tag icon={<ExclamationCircleOutlined />} color='warning' className={'catalog-service-status-size'}>
                    {serviceStatus as string}
                </Tag>
            );
    }
}
