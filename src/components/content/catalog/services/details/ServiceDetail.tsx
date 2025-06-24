/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { GlobalOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Descriptions, Tag } from 'antd';
import React from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';
import appStyles from '../../../../../styles/app.module.css';
import catalogStyles from '../../../../../styles/catalog.module.css';
import {
    category,
    csp,
    DeployedService,
    serviceDeploymentState,
    ServiceTemplateDetailVo,
    serviceTemplateRegistrationState,
} from '../../../../../xpanse-api/generated';
import { useCurrentUserRoleStore } from '../../../../layouts/header/useCurrentRoleStore';
import { reportsRoute } from '../../../../utils/constants';
import { ServiceTemplateRegisterStatus } from '../../../common/catalog/ServiceTemplateRegisterStatus.tsx';
import { ApiDoc } from '../../../common/doc/ApiDoc';
import { AgreementText } from '../../../common/ocl/AgreementText';
import { BillingText } from '../../../common/ocl/BillingText';
import { ContactDetailsShowType } from '../../../common/ocl/ContactDetailsShowType';
import { ContactDetailsText } from '../../../common/ocl/ContactDetailsText';
import { FlavorsText } from '../../../common/ocl/FlavorsText';
import { RegionText } from '../../../common/ocl/RegionText.tsx';
import useDeployedServicesQuery from '../../../deployedServices/myServices/query/useDeployedServiceQuery';
import DeploymentManagement from '../../../deployment/DeploymentManagement';
import { ServiceActionManagement } from '../../../serviceActionManage/ServiceActionManagement.tsx';
import ServiceConfigManagement from '../../../serviceConfigurationManage/ServiceConfigManagement';
import { ServiceObjectsManagement } from '../../../serviceObjectsManage/ServiceObjectsManagement.tsx';
import { ShowIcon } from './ShowIcon';

function ServiceDetail({ serviceDetails }: { serviceDetails: ServiceTemplateDetailVo }): React.JSX.Element {
    const currentRole = useCurrentUserRoleStore((state) => state.currentUserRole);
    const navigate = useNavigate();
    let numberOfActiveServiceDeployments: number = 0;
    const listDeployedServicesByIsvQuery = useDeployedServicesQuery(
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
        const searchParams = new URLSearchParams();
        searchParams.append('serviceName', serviceDetails.name);
        searchParams.append('serviceVersion', serviceDetails.version);
        void navigate({
            pathname: reportsRoute,
            search: createSearchParams({
                serviceName: serviceDetails.name,
                serviceVersion: serviceDetails.version,
            }).toString(),
        });
    };

    return (
        <>
            <div className={catalogStyles.catalogDetailClass}>
                <h3 className={catalogStyles.catalogDetailsH3}>
                    <GlobalOutlined />
                    &nbsp;Available Regions
                </h3>
                <RegionText regions={serviceDetails.regions} />
            </div>
            <h3 className={catalogStyles.catalogDetailsH3}>
                <InfoCircleOutlined />
                &nbsp;Basic Information
            </h3>

            <Descriptions bordered column={2}>
                <Descriptions.Item label='Service' styles={{ label: { width: '230px' } }}>
                    <ShowIcon serviceDetails={serviceDetails} />
                </Descriptions.Item>
                <Descriptions.Item label='Service Template Id' styles={{ label: { width: '230px' } }}>
                    {serviceDetails.serviceTemplateId}
                </Descriptions.Item>
                <Descriptions.Item label='Category'>{serviceDetails.category}</Descriptions.Item>
                <Descriptions.Item label='Service Version'>{serviceDetails.version}</Descriptions.Item>
                <Descriptions.Item label='Service Vendor'>
                    <Tag color='cyan'>{serviceDetails.serviceVendor}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label='Description' styles={{ label: { width: '230px' } }}>
                    {serviceDetails.description}
                </Descriptions.Item>
                <Descriptions.Item label='Register Time'>{serviceDetails.createdTime}</Descriptions.Item>
                <Descriptions.Item label='Update Time'>{serviceDetails.lastModifiedTime}</Descriptions.Item>
                <Descriptions.Item label='Registration Status'>
                    <ServiceTemplateRegisterStatus
                        serviceRegistrationStatus={
                            serviceDetails.serviceTemplateRegistrationState as serviceTemplateRegistrationState
                        }
                    />
                </Descriptions.Item>
                <Descriptions.Item label='Credential Type'>
                    {serviceDetails.deployment.credentialType}
                </Descriptions.Item>
                <Descriptions.Item label='Billing Modes'>
                    <BillingText billing={serviceDetails.billing} />
                </Descriptions.Item>
                <Descriptions.Item label={'Service API'}>
                    <ApiDoc
                        serviceTemplateId={serviceDetails.serviceTemplateId}
                        styleClass={appStyles.serviceApiDocLink}
                    />
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
                {currentRole && currentRole === 'isv' ? (
                    <Descriptions.Item label='Active Deployments'>
                        <span>{numberOfActiveServiceDeployments}</span>&nbsp;
                        <button onClick={onClick} className={catalogStyles.catalogActiveDeployment}>
                            view services
                        </button>
                    </Descriptions.Item>
                ) : (
                    <></>
                )}
            </Descriptions>
            <FlavorsText flavors={serviceDetails.flavors.serviceFlavors} />
            <DeploymentManagement deployment={serviceDetails.deployment} />
            {serviceDetails.serviceConfigurationManage ? (
                <ServiceConfigManagement configurationManage={serviceDetails.serviceConfigurationManage} />
            ) : null}
            {serviceDetails.serviceActions && serviceDetails.serviceActions.length > 0 ? (
                <ServiceActionManagement serviceActions={serviceDetails.serviceActions} />
            ) : null}
            {serviceDetails.serviceObjects && serviceDetails.serviceObjects.length > 0 ? (
                <ServiceObjectsManagement serviceObjects={serviceDetails.serviceObjects} />
            ) : null}
        </>
    );
}

export default ServiceDetail;
