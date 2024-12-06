import { CheckCircleOutlined, CloseCircleOutlined, StopOutlined } from '@ant-design/icons';
import { Descriptions, Tag } from 'antd';
import React from 'react';
import { ServiceTemplateDetailVo } from '../../../../../xpanse-api/generated';

const AvailableInCatalog: React.FC<{ serviceDetails: ServiceTemplateDetailVo }> = ({ serviceDetails }) => {
    return (
        <Descriptions.Item label='availableInCatalog'>
            {(serviceDetails.serviceTemplateRegistrationState === 'in-review' ||
                serviceDetails.serviceTemplateRegistrationState === 'approved') &&
            !serviceDetails.availableInCatalog ? (
                <Tag icon={<StopOutlined />} color='#e67300'>
                    false(review inProgress)
                </Tag>
            ) : serviceDetails.serviceTemplateRegistrationState === 'approved' && serviceDetails.availableInCatalog ? (
                <Tag icon={<CheckCircleOutlined />} color='#87d068'>
                    true
                </Tag>
            ) : serviceDetails.serviceTemplateRegistrationState === 'approved' &&
              !serviceDetails.availableInCatalog &&
              !serviceDetails.isUpdatePending ? (
                <Tag icon={<CloseCircleOutlined />} color='#cd201f'>
                    false
                </Tag>
            ) : serviceDetails.serviceTemplateRegistrationState === 'rejected' &&
              !serviceDetails.availableInCatalog &&
              serviceDetails.isUpdatePending ? (
                <Tag icon={<StopOutlined />} color='#e67300'>
                    false(review inProgress)
                </Tag>
            ) : serviceDetails.serviceTemplateRegistrationState === 'approved' &&
              serviceDetails.availableInCatalog &&
              serviceDetails.isUpdatePending ? (
                <Tag icon={<CheckCircleOutlined />} color='#87d068'>
                    true
                </Tag>
            ) : null}
        </Descriptions.Item>
    );
};
export default AvailableInCatalog;
