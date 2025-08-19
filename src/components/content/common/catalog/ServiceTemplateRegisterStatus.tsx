/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import React from 'react';
import serviceReviewStyles from '../../../../styles/service-review.module.css';
import { ServiceTemplateRegistrationState } from '../../../../xpanse-api/generated';

export function ServiceTemplateRegisterStatus({
    serviceTemplateRegistrationState,
}: {
    serviceTemplateRegistrationState: ServiceTemplateRegistrationState;
}): React.JSX.Element {
    switch (serviceTemplateRegistrationState) {
        case ServiceTemplateRegistrationState.IN_REVIEW:
            return (
                <Tag
                    bordered={false}
                    icon={<SyncOutlined spin={false} />}
                    color='#ffa366'
                    className={serviceReviewStyles.serviceTemplateStateSize}
                >
                    {serviceTemplateRegistrationState.valueOf()}
                </Tag>
            );
        case ServiceTemplateRegistrationState.REJECTED:
            return (
                <Tag
                    bordered={false}
                    icon={<CloseCircleOutlined />}
                    color='#ff6666'
                    className={serviceReviewStyles.serviceTemplateStateSize}
                >
                    {serviceTemplateRegistrationState.valueOf()}
                </Tag>
            );
        case ServiceTemplateRegistrationState.APPROVED:
            return (
                <Tag
                    bordered={false}
                    icon={<CheckCircleOutlined />}
                    color='#87d068'
                    className={serviceReviewStyles.serviceTemplateStateSize}
                >
                    {serviceTemplateRegistrationState.valueOf()}
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
                    {serviceTemplateRegistrationState as unknown as string}
                </Tag>
            );
    }
}
