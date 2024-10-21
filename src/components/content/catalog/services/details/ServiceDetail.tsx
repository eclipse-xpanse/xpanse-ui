/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { GlobalOutlined, InfoCircleOutlined, ProfileOutlined } from '@ant-design/icons';
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
    serviceRegistrationState,
    ServiceTemplateDetailVo,
} from '../../../../../xpanse-api/generated';
import { useCurrentUserRoleStore } from '../../../../layouts/header/useCurrentRoleStore';
import { reportsRoute } from '../../../../utils/constants';
import { ServiceTemplateRegisterStatus } from '../../../common/catalog/ServiceTemplateRegisterStatus.tsx';
import { ApiDoc } from '../../../common/doc/ApiDoc';
import { AgreementText } from '../../../common/ocl/AgreementText';
import { BillingText } from '../../../common/ocl/BillingText';
import { ContactDetailsShowType } from '../../../common/ocl/ContactDetailsShowType';
import { ContactDetailsText } from '../../../common/ocl/ContactDetailsText';
import { DeploymentScriptText } from '../../../common/ocl/DeploymentScript.tsx';
import { DeploymentText } from '../../../common/ocl/DeploymentText';
import { FlavorsText } from '../../../common/ocl/FlavorsText';
import { getDeployerToolIcon } from '../../../common/ocl/getDeployerToolIcon.ts';
import { RegionText } from '../../../common/ocl/RegionText.tsx';
import useDeployedServicesByIsvQuery from '../../../deployedServices/myServices/query/useDeployedServiceByIsvQuery';
import DeploymentVariables from '../../../deploymentVariables/DeploymentVariables.tsx';
import DeploymentServiceConfigurationParameter from '../../../deployServiceConfigParameter/DeploymentServiceConfigurationParameter';
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
            <h3 className={catalogStyles.catalogDetailsH3}>
                <ProfileOutlined />
                &nbsp;Deployment Information
            </h3>
            <Descriptions column={2} bordered className={catalogStyles.catalogDeploymentInfoTable}>
                <Descriptions.Item label='Kind'>
                    {
                        <img
                            src={getDeployerToolIcon(serviceDetails.deployment.deployerTool.kind.valueOf())}
                            alt={serviceDetails.deployment.deployerTool.kind}
                            className={catalogStyles.catalogDisplayDeploymentKind}
                        />
                    }
                </Descriptions.Item>
                <Descriptions.Item label='Version'>{serviceDetails.deployment.deployerTool.version}</Descriptions.Item>
                <Descriptions.Item label='Service Availability Config'>
                    <DeploymentText deployment={serviceDetails.deployment} />
                </Descriptions.Item>
                <Descriptions.Item label='Deployment Script'>
                    <DeploymentScriptText deployment={serviceDetails.deployment} />
                </Descriptions.Item>
            </Descriptions>
            <DeploymentVariables variables={serviceDetails.deployment.variables} />
            {serviceDetails.serviceConfigurationManage?.configurationParameters ? (
                <DeploymentServiceConfigurationParameter
                    parameters={serviceDetails.serviceConfigurationManage.configurationParameters}
                />
            ) : null}
        </>
    );
}

export default ServiceDetail;
