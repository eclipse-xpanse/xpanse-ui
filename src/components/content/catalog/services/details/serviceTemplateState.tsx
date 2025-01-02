import { CheckCircleOutlined, CloseCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import React from 'react';
import { ServiceTemplateDetailVo, serviceTemplateRegistrationState } from '../../../../../xpanse-api/generated';

function ServiceTemplateState({ serviceDetails }: { serviceDetails: ServiceTemplateDetailVo }): React.JSX.Element {
    return (
        <>
            <div>
                {serviceDetails.isAvailableInCatalog ? (
                    <Tag icon={<CheckCircleOutlined />} color='#87d068'>
                        Available In Catalog
                    </Tag>
                ) : (
                    <Tag icon={<CloseCircleOutlined />} color='#ff6666'>
                        Not Available in Catalog
                    </Tag>
                )}
                {}
                {serviceDetails.isReviewInProgress &&
                serviceDetails.serviceTemplateRegistrationState === serviceTemplateRegistrationState.IN_REVIEW ? (
                    <Tag icon={<SyncOutlined spin />} color='#ffa366'>
                        Registration Review In-Progress
                    </Tag>
                ) : serviceDetails.isReviewInProgress &&
                  (serviceDetails.serviceTemplateRegistrationState === serviceTemplateRegistrationState.APPROVED ||
                      serviceDetails.serviceTemplateRegistrationState === serviceTemplateRegistrationState.REJECTED) ? (
                    <Tag icon={<SyncOutlined spin />} color='#ffa366'>
                        Update review in-progress
                    </Tag>
                ) : null}
            </div>
        </>
    );
}
export default ServiceTemplateState;
