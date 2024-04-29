/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Descriptions, Space, Tag } from 'antd';
import { CloudUploadOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { ServiceTemplateDetailVo } from '../../../../../xpanse-api/generated';
import { ApiDoc } from '../../../common/doc/ApiDoc';
import { ShowIcon } from './ShowIcon';
import React from 'react';
import { DeploymentText } from '../../../common/ocl/DeploymentText';
import { FlavorsText } from '../../../common/ocl/FlavorsText';
import { BillingText } from '../../../common/ocl/BillingText';
import { ServiceRegistrationStatus } from './ServiceRegistrationStatus';
import { ContactDetailsText } from '../../../common/ocl/ContactDetailsText';
import { ContactDetailsShowType } from '../../../common/ocl/ContactDetailsShowType';
import { AgreementText } from '../../../common/ocl/AgreementText';

function ServiceDetail({ serviceDetails }: { serviceDetails: ServiceTemplateDetailVo }): React.JSX.Element {
    return (
        <>
            <div className={'catalog-detail-class'}>
                <h3 className={'catalog-details-h3'}>
                    <CloudUploadOutlined />
                    &nbsp;Available Regions
                </h3>
                <Space size={[0, 8]} wrap>
                    {serviceDetails.regions.map((region) => (
                        <Tag key={region.name} className={'ocl-display-tag'} color='orange'>
                            {region.area ? `${region.area}: ${region.name}` : region.name}
                        </Tag>
                    ))}
                </Space>
            </div>
            <h3 className={'catalog-details-h3'}>
                <InfoCircleOutlined />
                &nbsp;Basic Information
            </h3>

            <Descriptions bordered column={2}>
                <Descriptions.Item label='Service' labelStyle={{ width: '230px' }}>
                    <ShowIcon serviceDetails={serviceDetails} />
                </Descriptions.Item>
                <Descriptions.Item label='Description' labelStyle={{ width: '230px' }}>
                    {serviceDetails.description}
                </Descriptions.Item>
                <Descriptions.Item label='Category'>{serviceDetails.category}</Descriptions.Item>
                <Descriptions.Item label='Service Version'>{serviceDetails.version}</Descriptions.Item>
                <Descriptions.Item label='Register Time'>{serviceDetails.createTime}</Descriptions.Item>
                <Descriptions.Item label='Update Time'>{serviceDetails.lastModifiedTime}</Descriptions.Item>
                <Descriptions.Item label='Namespace'>
                    <Tag color='cyan'>{serviceDetails.namespace}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label='Status'>
                    <ServiceRegistrationStatus serviceStatus={serviceDetails.serviceRegistrationState} />
                </Descriptions.Item>
                <Descriptions.Item label='CredentialType'>{serviceDetails.deployment.credentialType}</Descriptions.Item>
                <Descriptions.Item label='Deployment'>
                    <DeploymentText deployment={serviceDetails.deployment} />
                </Descriptions.Item>
                <Descriptions.Item label='Flavors'>
                    <FlavorsText flavors={serviceDetails.flavors.serviceFlavors} />
                </Descriptions.Item>
                <Descriptions.Item label='Billing'>
                    <BillingText billing={serviceDetails.billing} />
                </Descriptions.Item>
                <Descriptions.Item label={'Service API'}>
                    <ApiDoc id={serviceDetails.id} styleClass={'service-api-doc-link'} />
                </Descriptions.Item>
                <Descriptions.Item label='Contact Details'>
                    <ContactDetailsText
                        serviceProviderContactDetails={serviceDetails.serviceProviderContactDetails}
                        showFor={ContactDetailsShowType.Catalog}
                    />
                </Descriptions.Item>
                <Descriptions.Item label='EULA'>
                    {serviceDetails.eula ? <AgreementText eula={serviceDetails.eula} /> : <span>Not Provided</span>}
                </Descriptions.Item>
            </Descriptions>
        </>
    );
}

export default ServiceDetail;
