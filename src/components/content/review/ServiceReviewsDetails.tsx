/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { BarsOutlined, GlobalOutlined } from '@ant-design/icons';
import { InfoCircleOutlined } from '@ant-design/icons/lib/icons';
import { Button, Descriptions, Image, Tag, Tooltip, Typography } from 'antd';
import React, { useState } from 'react';
import catalogStyles from '../../../styles/catalog.module.css';
import oclDisplayStyles from '../../../styles/ocl-display.module.css';
import serviceReviewStyles from '../../../styles/service-review.module.css';
import { name, ServiceTemplateDetailVo, serviceTemplateRegistrationState } from '../../../xpanse-api/generated';
import { cspMap } from '../common/csp/CspLogo';
import { AgreementText } from '../common/ocl/AgreementText';
import { BillingText } from '../common/ocl/BillingText';
import { ContactDetailsShowType } from '../common/ocl/ContactDetailsShowType';
import { ContactDetailsText } from '../common/ocl/ContactDetailsText';
import { DeploymentText } from '../common/ocl/DeploymentText';
import { FlavorsText } from '../common/ocl/FlavorsText';
import { RegionText } from '../common/ocl/RegionText.tsx';
import DeploymentManagement from '../deployment/DeploymentManagement';
import ServiceConfigManagement from '../serviceConfigurationManage/ServiceConfigManagement';
import { ApproveOrRejectServiceTemplate } from './ApproveOrRejectServiceTemplate';
import useApproveOrRejectRequest from './query/useApproveOrRejectRequest';

export const ServiceReviewsDetails = ({
    currentServiceTemplateVo,
    setAlertTipCloseStatus,
}: {
    currentServiceTemplateVo: ServiceTemplateDetailVo;
    setAlertTipCloseStatus: (arg: boolean) => void;
}): React.JSX.Element => {
    const PLACE_HOLDER_UNKNOWN_VALUE: string = 'NOT PROVIDED';
    const [isReviewCommentsModalOpen, setIsReviewCommentsModalOpen] = useState<boolean>(false);
    const [isApproved, setIsApproved] = useState<boolean | undefined>(undefined);
    const { Paragraph } = Typography;
    const approveOrRejectRequest = useApproveOrRejectRequest(currentServiceTemplateVo.serviceTemplateId);
    const onClickApprove = () => {
        setIsApproved(true);
        setIsReviewCommentsModalOpen(true);
    };
    const onClickReject = () => {
        setIsApproved(false);
        setIsReviewCommentsModalOpen(true);
    };
    const handleReviewCommentsModalClose = (isClose: boolean) => {
        if (isClose) {
            setIsReviewCommentsModalOpen(false);
        }
    };
    return (
        <div className={serviceReviewStyles.modalContainer}>
            {' '}
            <div className={serviceReviewStyles.modalContainer}>
                <Button
                    type='primary'
                    onClick={onClickApprove}
                    disabled={
                        approveOrRejectRequest.isSuccess ||
                        currentServiceTemplateVo.serviceTemplateRegistrationState !==
                            serviceTemplateRegistrationState.IN_PROGRESS
                    }
                >
                    Approve
                </Button>
                <Button
                    type='primary'
                    onClick={onClickReject}
                    className={serviceReviewStyles.rejectBtnClass}
                    disabled={
                        approveOrRejectRequest.isSuccess ||
                        currentServiceTemplateVo.serviceTemplateRegistrationState !==
                            serviceTemplateRegistrationState.IN_PROGRESS
                    }
                >
                    Reject
                </Button>
            </div>
            <ApproveOrRejectServiceTemplate
                key={currentServiceTemplateVo.serviceTemplateId}
                currentServiceTemplateVo={currentServiceTemplateVo}
                isApproved={isApproved}
                isModalOpen={isReviewCommentsModalOpen}
                handleModalClose={handleReviewCommentsModalClose}
                setAlertTipCloseStatus={setAlertTipCloseStatus}
                approveOrRejectRequest={approveOrRejectRequest}
            />
            <div className={oclDisplayStyles.oclDataDisplay}>
                <div className={oclDisplayStyles.oclDataMainInfo}>
                    <div>
                        {
                            <Image
                                alt={'Service Icon'}
                                width={100}
                                height={100}
                                src={currentServiceTemplateVo.icon}
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
                            <Tooltip placement='topLeft' title={currentServiceTemplateVo.name}>
                                <Paragraph ellipsis={true} className={oclDisplayStyles.oclDataDisplayServiceReviewName}>
                                    {currentServiceTemplateVo.name}
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
                                    src={cspMap.get(currentServiceTemplateVo.csp.valueOf() as name)?.logo}
                                />
                            </div>
                            <br />
                        </div>
                        <div>
                            <b>Service Hosted By</b>
                            <br />
                            <Tag
                                className={oclDisplayStyles.oclDisplayTag}
                                color='red'
                                key={currentServiceTemplateVo.serviceHostingType.toString()}
                            >
                                {currentServiceTemplateVo.serviceHostingType.toString()}
                            </Tag>
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
                    <RegionText regions={currentServiceTemplateVo.regions} />
                    <h3 className={catalogStyles.catalogDetailsH3}>
                        <InfoCircleOutlined />
                        &nbsp;Basic Information
                    </h3>
                    <Descriptions column={2} bordered className={oclDisplayStyles.oclDataInfoTable}>
                        <Descriptions.Item label='Service Template Id'>
                            {currentServiceTemplateVo.serviceTemplateId}
                        </Descriptions.Item>
                        <Descriptions.Item label='Category'>
                            {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
                            {currentServiceTemplateVo.category
                                ? currentServiceTemplateVo.category
                                : PLACE_HOLDER_UNKNOWN_VALUE}
                        </Descriptions.Item>
                        <Descriptions.Item label='Version'>{currentServiceTemplateVo.version}</Descriptions.Item>
                        <Descriptions.Item label='Namespace'>
                            <Tag color='cyan'>{currentServiceTemplateVo.namespace}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label='Description'>
                            {currentServiceTemplateVo.description}
                        </Descriptions.Item>
                        <Descriptions.Item label='CredentialType'>
                            {currentServiceTemplateVo.deployment.credentialType
                                ? currentServiceTemplateVo.deployment.credentialType
                                : ''}
                        </Descriptions.Item>
                        <Descriptions.Item label='Billing Modes'>
                            <BillingText billing={currentServiceTemplateVo.billing} />
                        </Descriptions.Item>
                        <Descriptions.Item label='Deployment'>
                            <DeploymentText deployment={currentServiceTemplateVo.deployment} />
                        </Descriptions.Item>
                        <Descriptions.Item label='Contact Details'>
                            <ContactDetailsText
                                serviceProviderContactDetails={currentServiceTemplateVo.serviceProviderContactDetails}
                                showFor={ContactDetailsShowType.Catalog}
                            />
                        </Descriptions.Item>
                        <Descriptions.Item label='EULA'>
                            {currentServiceTemplateVo.eula ? (
                                <AgreementText eula={currentServiceTemplateVo.eula} />
                            ) : (
                                <span>Not Provided</span>
                            )}
                        </Descriptions.Item>
                    </Descriptions>
                    <FlavorsText flavors={currentServiceTemplateVo.flavors.serviceFlavors} />
                    <DeploymentManagement deployment={currentServiceTemplateVo.deployment} />
                    {currentServiceTemplateVo.serviceConfigurationManage ? (
                        <ServiceConfigManagement
                            configurationManage={currentServiceTemplateVo.serviceConfigurationManage}
                        />
                    ) : null}
                    {currentServiceTemplateVo.serviceTemplateRegistrationState !==
                    serviceTemplateRegistrationState.IN_PROGRESS ? (
                        <>
                            <h3 className={catalogStyles.catalogDetailsH3}>
                                <BarsOutlined />
                                &nbsp;Service Review Details
                            </h3>
                            <Descriptions column={1} bordered className={oclDisplayStyles.oclDataInfoTable}>
                                <Descriptions.Item label='Registration Status'>
                                    {currentServiceTemplateVo.serviceTemplateRegistrationState.valueOf()}
                                </Descriptions.Item>
                                <Descriptions.Item label='Comments'>
                                    {currentServiceTemplateVo.reviewComment}
                                </Descriptions.Item>
                            </Descriptions>
                        </>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </div>
    );
};
