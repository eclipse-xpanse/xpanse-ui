/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React from 'react';
import { Tag } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { ServiceTemplateDetailVo } from '../../../xpanse-api/generated';

export function ServiceTemplateRegisterStatus(
    serviceRegistrationState: ServiceTemplateDetailVo.serviceRegistrationState
): React.JSX.Element {
    switch (serviceRegistrationState) {
        case ServiceTemplateDetailVo.serviceRegistrationState.APPROVAL_PENDING:
            return (
                <Tag
                    bordered={false}
                    icon={<SyncOutlined spin={false} />}
                    color='processing'
                    className={'my-service-status-size'}
                >
                    {serviceRegistrationState.valueOf()}
                </Tag>
            );
        case ServiceTemplateDetailVo.serviceRegistrationState.REJECTED:
            return (
                <Tag
                    bordered={false}
                    icon={<CloseCircleOutlined />}
                    color='magenta'
                    className={'my-service-status-size'}
                >
                    {serviceRegistrationState.valueOf()}
                </Tag>
            );
        case ServiceTemplateDetailVo.serviceRegistrationState.APPROVED:
            return (
                <Tag
                    bordered={false}
                    icon={<CheckCircleOutlined />}
                    color='success'
                    className={'my-service-status-size'}
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
                    className={'my-service-status-size'}
                >
                    {serviceRegistrationState as string}
                </Tag>
            );
    }
}
