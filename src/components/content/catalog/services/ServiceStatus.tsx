import { ServiceTemplateVo } from '../../../../xpanse-api/generated';
import serviceRegistrationState = ServiceTemplateVo.serviceRegistrationState;
import { Tag } from 'antd';
import { CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import React from 'react';

export function ServiceStatus({
    serviceStatus,
}: {
    serviceStatus: ServiceTemplateVo.serviceRegistrationState;
}): React.JSX.Element {
    switch (serviceStatus) {
        case serviceRegistrationState.REGISTERED:
            return (
                <Tag icon={<CheckCircleOutlined />} color='success' className={'catalog-service-status-size'}>
                    {serviceStatus.valueOf()}
                </Tag>
            );
        case ServiceTemplateVo.serviceRegistrationState.UPDATED:
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
