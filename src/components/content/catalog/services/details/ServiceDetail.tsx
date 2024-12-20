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
import useDeployedServicesByIsvQuery from '../../../deployedServices/myServices/query/useDeployedServiceByIsvQuery';
import DeploymentManagement from '../../../deployment/DeploymentManagement';
import ServiceConfigManagement from '../../../serviceConfigurationManage/ServiceConfigManagement';
import { ShowIcon } from './ShowIcon';

function ServiceDetail({ serviceDetails }: { serviceDetails: ServiceTemplateDetailVo }): React.JSX.Element {
    const currentRole = useCurrentUserRoleStore((state) => state.currentUserRole);
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
        void navigate({
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
                <Descriptions.Item label='Service' labelStyle={{ width: '230px' }}>
                    <ShowIcon serviceDetails={serviceDetails} />
                </Descriptions.Item>
                <Descriptions.Item label='Service Template Id' labelStyle={{ width: '230px' }}>
                    {serviceDetails.serviceTemplateId}
                </Descriptions.Item>
                <Descriptions.Item label='Category'>{serviceDetails.category}</Descriptions.Item>
                <Descriptions.Item label='Service Version'>{serviceDetails.version}</Descriptions.Item>
                <Descriptions.Item label='Service Vendor'>
                    <Tag color='cyan'>{serviceDetails.serviceVendor}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label='Description' labelStyle={{ width: '230px' }}>
                    {serviceDetails.description}
                </Descriptions.Item>
                <Descriptions.Item label='Register Time'>{serviceDetails.createTime}</Descriptions.Item>
                <Descriptions.Item label='Update Time'>{serviceDetails.lastModifiedTime}</Descriptions.Item>
                <Descriptions.Item label='Status'>
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
        </>
    );
}

export default ServiceDetail;
