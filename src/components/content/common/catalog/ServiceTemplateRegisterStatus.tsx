/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import React from 'react';
import serviceReviewStyles from '../../../../styles/service-review.module.css';
import { ServiceTemplateDetailVo } from '../../../../xpanse-api/generated';

export function ServiceTemplateRegisterStatus({
    serviceRegistrationState,
}: {
    serviceRegistrationState: ServiceTemplateDetailVo['serviceRegistrationState'];
}): React.JSX.Element {
    switch (serviceRegistrationState) {
        case 'approval pending':
            return (
                <Tag
                    bordered={false}
                    icon={<SyncOutlined spin={false} />}
                    color='processing'
                    className={serviceReviewStyles.serviceTemplateStateSize}
                >
                    {serviceRegistrationState.valueOf()}
                </Tag>
            );
        case 'rejected':
            return (
                <Tag
                    bordered={false}
                    icon={<CloseCircleOutlined />}
                    color='magenta'
                    className={serviceReviewStyles.serviceTemplateStateSize}
                >
                    {serviceRegistrationState.valueOf()}
                </Tag>
            );
        case 'approved':
            return (
                <Tag
                    bordered={false}
                    icon={<CheckCircleOutlined />}
                    color='success'
                    className={serviceReviewStyles.serviceTemplateStateSize}
                >
                    {serviceRegistrationState.valueOf()}
                </Tag>
            );
        default:
            return (
                <Tag
                    bordered={false}
                    icon={<ExclamationCircleOutlined />}
                    color='warning'
                    className={serviceReviewStyles.serviceTemplateStateSize}
                >
                    {serviceRegistrationState as string}
                </Tag>
            );
    }
}
