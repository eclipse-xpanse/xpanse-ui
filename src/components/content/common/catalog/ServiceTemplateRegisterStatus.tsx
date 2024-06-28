/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import React from 'react';
import serviceReviewStyles from '../../../../styles/service-review.module.css';
import { serviceRegistrationState } from '../../../../xpanse-api/generated';

export function ServiceTemplateRegisterStatus({
    serviceRegistrationStatus,
}: {
    serviceRegistrationStatus: string;
}): React.JSX.Element {
    switch (serviceRegistrationStatus) {
        case serviceRegistrationState.APPROVAL_PENDING.toString():
            return (
                <Tag
                    bordered={false}
                    icon={<SyncOutlined spin={false} />}
                    color='processing'
                    className={serviceReviewStyles.serviceTemplateStateSize}
                >
                    {serviceRegistrationStatus.valueOf()}
                </Tag>
            );
        case serviceRegistrationState.REJECTED.toString():
            return (
                <Tag
                    bordered={false}
                    icon={<CloseCircleOutlined />}
                    color='magenta'
                    className={serviceReviewStyles.serviceTemplateStateSize}
                >
                    {serviceRegistrationStatus.valueOf()}
                </Tag>
            );
        case serviceRegistrationState.APPROVED.toString():
            return (
                <Tag
                    bordered={false}
                    icon={<CheckCircleOutlined />}
                    color='success'
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
                    color='warning'
                    className={serviceReviewStyles.serviceTemplateStateSize}
                >
                    {serviceRegistrationState as unknown as string}
                </Tag>
            );
    }
}
