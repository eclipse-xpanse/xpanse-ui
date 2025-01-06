/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import React from 'react';
import serviceReviewStyles from '../../../../styles/service-review.module.css';
import { serviceTemplateRegistrationState } from '../../../../xpanse-api/generated';

export function ServiceTemplateRegisterStatus({
    serviceRegistrationStatus,
}: {
    serviceRegistrationStatus: serviceTemplateRegistrationState;
}): React.JSX.Element {
    switch (serviceRegistrationStatus) {
        case serviceTemplateRegistrationState.IN_REVIEW:
            return (
                <Tag
                    bordered={false}
                    icon={<SyncOutlined spin={false} />}
                    color='#ffa366'
                    className={serviceReviewStyles.serviceTemplateStateSize}
                >
                    {serviceRegistrationStatus.valueOf()}
                </Tag>
            );
        case serviceTemplateRegistrationState.REJECTED:
            return (
                <Tag
                    bordered={false}
                    icon={<CloseCircleOutlined />}
                    color='#ff6666'
                    className={serviceReviewStyles.serviceTemplateStateSize}
                >
                    {serviceRegistrationStatus.valueOf()}
                </Tag>
            );
        case serviceTemplateRegistrationState.APPROVED:
            return (
                <Tag
                    bordered={false}
                    icon={<CheckCircleOutlined />}
                    color='#87d068'
                    className={serviceReviewStyles.serviceTemplateStateSize}
                >
                    {serviceRegistrationStatus.valueOf()}
                </Tag>
            );
        default:
            return (
                <Tag
                    bordered={false}
                    icon={<ExclamationCircleOutlined />}
                    color='default'
                    className={serviceReviewStyles.serviceTemplateStateSize}
                >
                    {serviceRegistrationStatus as unknown as string}
                </Tag>
            );
    }
}
