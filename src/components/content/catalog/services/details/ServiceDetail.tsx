/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { CloudUploadOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Descriptions, Space, Tag } from 'antd';
import React from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';
import appStyles from '../../../../../styles/app.module.css';
import catalogStyles from '../../../../../styles/catalog.module.css';
import oclDisplayStyles from '../../../../../styles/ocl-display.module.css';
import {
    DeployedService,
    ServiceTemplateDetailVo,
    category,
    csp,
    serviceDeploymentState,
    serviceRegistrationState,
} from '../../../../../xpanse-api/generated';
import { reportsRoute } from '../../../../utils/constants';
import { ServiceTemplateRegisterStatus } from '../../../common/catalog/ServiceTemplateRegisterStatus.tsx';
import { ApiDoc } from '../../../common/doc/ApiDoc';
import { AgreementText } from '../../../common/ocl/AgreementText';
import { BillingText } from '../../../common/ocl/BillingText';
import { ContactDetailsShowType } from '../../../common/ocl/ContactDetailsShowType';
import { ContactDetailsText } from '../../../common/ocl/ContactDetailsText';
import { DeploymentText } from '../../../common/ocl/DeploymentText';
import { FlavorsText } from '../../../common/ocl/FlavorsText';
import useDeployedServicesByIsvQuery from '../../../deployedServices/myServices/query/useDeployedServiceByIsvQuery';
import { ShowIcon } from './ShowIcon';

function ServiceDetail({ serviceDetails }: { serviceDetails: ServiceTemplateDetailVo }): React.JSX.Element {
    const navigate = useNavigate();
    let numberOfActiveServiceDeployments: number = 0;
    const listDeployedServicesByIsvQuery = useDeployedServicesByIsvQuery(
        serviceDetails.category as category,
        serviceDetails.csp as csp,
        serviceDetails.name,
        serviceDetails.version
    );

    if (listDeployedServicesByIsvQuery.data !== undefined && listDeployedServicesByIsvQuery.data.length > 0) {
        listDeployedServicesByIsvQuery.data.forEach((serviceItem: DeployedService) => {
            if (
                serviceItem.serviceDeploymentState === serviceDeploymentState.DEPLOYMENT_SUCCESSFUL ||
                serviceItem.serviceDeploymentState === serviceDeploymentState.DESTROY_FAILED ||
                serviceItem.serviceDeploymentState === serviceDeploymentState.MODIFICATION_SUCCESSFUL ||
                serviceItem.serviceDeploymentState === serviceDeploymentState.MODIFICATION_FAILED
            ) {
                numberOfActiveServiceDeployments++;
            }
        });
    }

    const onClick = () => {
        getReportsRedirectionUrl(
            serviceDetails.category as category,
            serviceDetails.csp as csp,
            serviceDetails.name,
            serviceDetails.version,
            [
                serviceDeploymentState.DEPLOYMENT_SUCCESSFUL,
                serviceDeploymentState.DESTROY_FAILED,
                serviceDeploymentState.MODIFICATION_SUCCESSFUL,
                serviceDeploymentState.MODIFICATION_FAILED,
            ]
        );
    };

    const getReportsRedirectionUrl = (
        categoryName: category,
        csp: csp,
        serviceName: string,
        version: string,
        serviceState: serviceDeploymentState[]
    ) => {
        navigate({
            pathname: reportsRoute,
            search: createSearchParams({
                serviceState: serviceState,
                categoryName,
                csp,
                serviceName,
                version,
            }).toString(),
        });
    };

    return (
        <>
            <div className={catalogStyles.catalogDetailClass}>
                <h3 className={catalogStyles.catalogDetailsH3}>
                    <CloudUploadOutlined />
                    &nbsp;Available Regions
                </h3>
                <Space size={[0, 8]} wrap>
                    {serviceDetails.regions.map((region) => (
                        <Tag key={region.name} className={oclDisplayStyles.oclDisplayTag} color='orange'>
                            {region.area ? `${region.area}: ${region.name}` : region.name}
                        </Tag>
                    ))}
                </Space>
            </div>
            <h3 className={catalogStyles.catalogDetailsH3}>
                <InfoCircleOutlined />
                &nbsp;Basic Information
            </h3>

            <Descriptions bordered column={2}>
                <Descriptions.Item label='Service' labelStyle={{ width: '230px' }}>
                    <ShowIcon serviceDetails={serviceDetails} />
                </Descriptions.Item>
                <Descriptions.Item label='ServiceTemplateId' labelStyle={{ width: '230px' }}>
                    {serviceDetails.serviceTemplateId}
                </Descriptions.Item>
                <Descriptions.Item label='Category'>{serviceDetails.category}</Descriptions.Item>
                <Descriptions.Item label='Service Version'>{serviceDetails.version}</Descriptions.Item>
                <Descriptions.Item label='Namespace'>
                    <Tag color='cyan'>{serviceDetails.namespace}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label='Description' labelStyle={{ width: '230px' }}>
                    {serviceDetails.description}
                </Descriptions.Item>
                <Descriptions.Item label='Register Time'>{serviceDetails.createTime}</Descriptions.Item>
                <Descriptions.Item label='Update Time'>{serviceDetails.lastModifiedTime}</Descriptions.Item>
                <Descriptions.Item label='Status'>
                    <ServiceTemplateRegisterStatus
                        serviceRegistrationStatus={serviceDetails.serviceRegistrationState as serviceRegistrationState}
                    />
                </Descriptions.Item>
                <Descriptions.Item label='CredentialType'>{serviceDetails.deployment.credentialType}</Descriptions.Item>
                <Descriptions.Item label='Deployment'>
                    <DeploymentText deployment={serviceDetails.deployment} />
                </Descriptions.Item>
                <Descriptions.Item label='Flavors'>
                    <FlavorsText flavors={serviceDetails.flavors.serviceFlavors} />
                </Descriptions.Item>
                <Descriptions.Item label='Billing Modes'>
                    <BillingText billing={serviceDetails.billing} />
                </Descriptions.Item>
                <Descriptions.Item label={'Service API'}>
                    <ApiDoc id={serviceDetails.serviceTemplateId} styleClass={appStyles.serviceApiDocLink} />
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
                <Descriptions.Item label='Active Deployments'>
                    <span>{numberOfActiveServiceDeployments}</span>&nbsp;
                    <button onClick={onClick} className={catalogStyles.catalogActiveDeployment}>
                        view services
                    </button>
                </Descriptions.Item>
            </Descriptions>
        </>
    );
}

export default ServiceDetail;
