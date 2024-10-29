/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { GlobalOutlined } from '@ant-design/icons';
import { InfoCircleOutlined } from '@ant-design/icons/lib/icons';
import { Descriptions, Image, Tag, Tooltip, Typography } from 'antd';
import React from 'react';
import catalogStyles from '../../../../styles/catalog.module.css';
import oclDisplayStyles from '../../../../styles/ocl-display.module.css';
import { Ocl, serviceHostingType } from '../../../../xpanse-api/generated';
import { DeployedServicesHostingType } from '../../deployedServices/common/DeployedServicesHostingType';
import DeploymentManagement from '../../deployment/DeploymentManagement';
import ServiceConfigManagement from '../../serviceConfigurationManage/ServiceConfigManagement';
import { cspMap } from '../csp/CspLogo';
import { AgreementText } from './AgreementText';
import { BillingText } from './BillingText';
import { ContactDetailsShowType } from './ContactDetailsShowType';
import { ContactDetailsText } from './ContactDetailsText';
import { FlavorsText } from './FlavorsText.tsx';
import { RegionText } from './RegionText.tsx';

function DisplayOclData({ ocl }: { ocl: Ocl }): React.JSX.Element | string {
    const PLACE_HOLDER_UNKNOWN_VALUE: string = 'NOT PROVIDED';
    const { Paragraph } = Typography;
    try {
        return (
            <>
                <div className={oclDisplayStyles.oclDataDisplay}>
                    <div className={oclDisplayStyles.oclDataMainInfo}>
                        <div>
                            {
                                <Image
                                    alt={'Service Icon'}
                                    width={100}
                                    height={100}
                                    src={ocl.icon}
                                    referrerPolicy='no-referrer'
                                    preview={false}
                                    fallback='data:image/png;base64,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'
                                />
                            }
                        </div>
                        <div>
                            <div>
                                <br />
                                <b>Service Name</b>
                                <br />
                                <Tooltip placement='topLeft' title={ocl.name}>
                                    <Paragraph
                                        ellipsis={true}
                                        className={oclDisplayStyles.oclDataDisplayServiceRegisterName}
                                    >
                                        {ocl.name}
                                    </Paragraph>
                                </Tooltip>
                            </div>
                            <div>
                                <b>Cloud Service Provider</b>
                                <br />
                                <div className={oclDisplayStyles.oclDisplayTag}>
                                    <Image
                                        width={120}
                                        preview={false}
                                        src={cspMap.get(ocl.cloudServiceProvider.name)?.logo}
                                    />
                                </div>
                                <br />
                            </div>
                            <div>
                                <b>Service Hosted By</b>
                                <br />
                                <DeployedServicesHostingType
                                    currentServiceHostingType={ocl.serviceHostingType as serviceHostingType}
                                    className={oclDisplayStyles.oclDisplayTag}
                                />
                                <br />
                                <br />
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className={catalogStyles.catalogDetailsH3}>
                            <GlobalOutlined />
                            &nbsp;Available Regions
                        </h3>
                        <RegionText regions={ocl.cloudServiceProvider.regions} />
                        <h3 className={catalogStyles.catalogDetailsH3}>
                            <InfoCircleOutlined />
                            &nbsp;Basic Information
                        </h3>
                        <Descriptions column={2} bordered className={oclDisplayStyles.oclDataInfoTable}>
                            <Descriptions.Item label='Category'>
                                {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
                                {ocl.category ? ocl.category : PLACE_HOLDER_UNKNOWN_VALUE}
                            </Descriptions.Item>
                            <Descriptions.Item label='Version'>{ocl.serviceVersion}</Descriptions.Item>
                            <Descriptions.Item label='Namespace'>
                                <Tag color='cyan'>{ocl.namespace}</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label='Description'>{ocl.description}</Descriptions.Item>
                            <Descriptions.Item label='Billing Modes'>
                                <BillingText billing={ocl.billing} />
                            </Descriptions.Item>
                            <Descriptions.Item label='CredentialType'>
                                {ocl.deployment.credentialType ? ocl.deployment.credentialType.valueOf() : ''}
                            </Descriptions.Item>
                            <Descriptions.Item label='Contact Details'>
                                <ContactDetailsText
                                    serviceProviderContactDetails={ocl.serviceProviderContactDetails}
                                    showFor={ContactDetailsShowType.Catalog}
                                />
                            </Descriptions.Item>
                            <Descriptions.Item label='EULA'>
                                {ocl.eula ? <AgreementText eula={ocl.eula} /> : <span>Not Provided</span>}
                            </Descriptions.Item>
                        </Descriptions>
                        <FlavorsText flavors={ocl.flavors.serviceFlavors} />
                        <DeploymentManagement deployment={ocl.deployment} />
                        {ocl.serviceConfigurationManage ? (
                            <ServiceConfigManagement configurationManage={ocl.serviceConfigurationManage} />
                        ) : null}
                    </div>
                </div>
            </>
        );
    } catch (error: unknown) {
        if (error instanceof Error) {
            return error.message;
        } else {
            return 'Unhandled Exception';
        }
    }
}

export default DisplayOclData;
