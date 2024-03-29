/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React, { useState } from 'react';
import { Button, Descriptions, Image, Tag } from 'antd';
import { cspMap } from '../common/csp/CspLogo';
import { FlavoursText } from '../common/ocl/FlavorsText';
import { BillingText } from '../common/ocl/BillingText';
import { DeploymentText } from '../common/ocl/DeploymentText';
import { ContactDetailsText } from '../common/ocl/ContactDetailsText';
import { ContactDetailsShowType } from '../common/ocl/ContactDetailsShowType';
import { CloudServiceProvider, ServiceTemplateDetailVo } from '../../../xpanse-api/generated';
import { ApproveOrRejectServiceTemplate } from './ApproveOrRejectServiceTemplate';
import '../../../styles/service_review.css';
import useGetRegistrationDetails from './query/useGetRegistrationDetails';

export const ServiceReviewsDetails = ({
    currentServiceTemplateVo,
    setAlertTipCloseStatus,
}: {
    currentServiceTemplateVo: ServiceTemplateDetailVo | undefined;
    setAlertTipCloseStatus: (arg: boolean) => void;
}): React.JSX.Element => {
    const PLACE_HOLDER_UNKNOWN_VALUE: string = 'NOT PROVIDED';
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isApproved, setIsApproved] = useState<boolean | undefined>(undefined);
    const getRegistrationDetailsQuery = useGetRegistrationDetails(currentServiceTemplateVo?.id);

    if (!currentServiceTemplateVo) {
        return <></>;
    }
    const onClickApprove = () => {
        setIsApproved(true);
        setIsModalOpen(true);
    };
    const onClickReject = () => {
        setIsApproved(false);
        setIsModalOpen(true);
    };
    const handleModalClose = (isClose: boolean) => {
        if (isClose) {
            setIsModalOpen(false);
        }
    };
    return (
        <>
            {' '}
            <Button
                type='primary'
                onClick={onClickApprove}
                disabled={
                    getRegistrationDetailsQuery.isSuccess &&
                    getRegistrationDetailsQuery.data.serviceRegistrationState !==
                        ServiceTemplateDetailVo.serviceRegistrationState.APPROVAL_PENDING
                }
            >
                Approve
            </Button>
            <Button
                type='primary'
                onClick={onClickReject}
                className={'reject-btn-class'}
                disabled={
                    getRegistrationDetailsQuery.isSuccess &&
                    getRegistrationDetailsQuery.data.serviceRegistrationState !==
                        ServiceTemplateDetailVo.serviceRegistrationState.APPROVAL_PENDING
                }
            >
                Reject
            </Button>
            <ApproveOrRejectServiceTemplate
                currentServiceTemplateVo={currentServiceTemplateVo}
                isApproved={isApproved}
                isModalOpen={isModalOpen}
                handleModalClose={handleModalClose}
                setAlertTipCloseStatus={setAlertTipCloseStatus}
            />
            <div className={'ocl-data-display'}>
                <div className={'ocl-data-main-info'}>
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
                            <Tag className={'ocl-display-tag'} color='blue' key={currentServiceTemplateVo.name}>
                                {currentServiceTemplateVo.name}
                            </Tag>
                            <br />
                            <br />
                        </div>
                        <div>
                            <b>Cloud Service Provider</b>
                            <br />
                            <div className={'ocl-display-tag'}>
                                <Image
                                    width={120}
                                    preview={false}
                                    src={
                                        cspMap.get(currentServiceTemplateVo.csp.valueOf() as CloudServiceProvider.name)
                                            ?.logo
                                    }
                                />
                            </div>
                            <br />
                        </div>
                        <div>
                            <b>Available Regions</b>
                            <br />
                            {currentServiceTemplateVo.regions.map((region) => (
                                <Tag className={'ocl-display-tag'} color='orange' key={region.name}>
                                    {region.area ? `${region.area}: ${region.name}` : region.name}
                                </Tag>
                            ))}
                            <br />
                            <br />
                        </div>
                        <div>
                            <b>Service Hosted By</b>
                            <br />
                            <Tag
                                className={'ocl-display-tag'}
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
                    <Descriptions title={'Basic Information'} column={2} bordered className={'ocl-data-info-table'}>
                        <Descriptions.Item label='Service Template Id'>{currentServiceTemplateVo.id}</Descriptions.Item>
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
                        <Descriptions.Item label='Flavors'>
                            <FlavoursText flavors={currentServiceTemplateVo.flavors} />
                        </Descriptions.Item>
                        <Descriptions.Item label='Billing'>
                            <BillingText billing={currentServiceTemplateVo.billing} />
                        </Descriptions.Item>
                        <Descriptions.Item label='Deployment'>
                            <DeploymentText deployment={currentServiceTemplateVo.deployment} />
                        </Descriptions.Item>
                        <Descriptions.Item label='CredentialType'>
                            {currentServiceTemplateVo.deployment.credentialType
                                ? currentServiceTemplateVo.deployment.credentialType
                                : ''}
                        </Descriptions.Item>
                        <Descriptions.Item label='Contact Details'>
                            <ContactDetailsText
                                serviceProviderContactDetails={currentServiceTemplateVo.serviceProviderContactDetails}
                                showFor={ContactDetailsShowType.Catalog}
                            />
                        </Descriptions.Item>
                        <Descriptions.Item label='Description'>
                            {currentServiceTemplateVo.description}
                        </Descriptions.Item>
                    </Descriptions>
                    {getRegistrationDetailsQuery.isSuccess &&
                    getRegistrationDetailsQuery.data.serviceRegistrationState !==
                        ServiceTemplateDetailVo.serviceRegistrationState.APPROVAL_PENDING ? (
                        <>
                            <Descriptions
                                title={'Service Review Details'}
                                column={1}
                                bordered
                                className={'ocl-data-info-table'}
                            >
                                <Descriptions.Item label='Registration Status'>
                                    {currentServiceTemplateVo.serviceRegistrationState.valueOf()}
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
        </>
    );
};
