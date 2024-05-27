/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import React from 'react';
import catalogStyles from '../../../../../styles/catalog.module.css';
import { ServiceTemplateDetailVo } from '../../../../../xpanse-api/generated';
import serviceRegistrationState = ServiceTemplateDetailVo.serviceRegistrationState;

export function ServiceRegistrationStatus({
    serviceStatus,
}: {
    serviceStatus: ServiceTemplateDetailVo.serviceRegistrationState;
}): React.JSX.Element {
    switch (serviceStatus) {
        case serviceRegistrationState.APPROVED:
            return (
                <Tag icon={<CheckCircleOutlined />} color='success' className={catalogStyles.catalogServiceStatusSize}>
                    {serviceStatus.valueOf()}
                </Tag>
            );
        case ServiceTemplateDetailVo.serviceRegistrationState.APPROVAL_PENDING:
            return (
                <Tag
                    icon={<ExclamationCircleOutlined />}
                    color='orange'
                    className={catalogStyles.catalogServiceStatusSize}
                >
                    {serviceStatus.valueOf()}
                </Tag>
            );
        default:
            return (
                <Tag
                    icon={<ExclamationCircleOutlined />}
                    color='warning'
                    className={catalogStyles.catalogServiceStatusSize}
                >
                    {serviceStatus as string}
                </Tag>
            );
    }
}
