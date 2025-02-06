/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { ContactsOutlined, GlobalOutlined, MailOutlined, MessageOutlined, PhoneOutlined } from '@ant-design/icons';
import { Button, Popover, Typography } from 'antd';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import oclDisplayStyles from '../../../../styles/ocl-display.module.css';
import { ServiceProviderContactDetails } from '../../../../xpanse-api/generated';
import { ContactDetailsShowType } from './ContactDetailsShowType';

export function ContactDetailsText({
    serviceProviderContactDetails,
    showFor,
}: {
    serviceProviderContactDetails: ServiceProviderContactDetails;
    showFor: ContactDetailsShowType;
}): React.JSX.Element {
    return (
        <Popover
            content={<pre>{convertRecordToList(serviceProviderContactDetails)}</pre>}
            title={'Contact Details'}
            trigger='hover'
        >
            <Button className={oclDisplayStyles.oclDataHover} type={'link'}>
                <span className={oclDisplayStyles.iconTextContainer}>
                    <ContactsOutlined className={oclDisplayStyles.icon} />
                    {showFor === ContactDetailsShowType.Order ? 'Contact Service Vendor' : 'support'}
                </span>
            </Button>
        </Popover>
    );
}

function convertRecordToList(serviceProviderContactDetails: ServiceProviderContactDetails): React.JSX.Element {
    const content: React.JSX.Element[] = [];
    if (serviceProviderContactDetails.emails) {
        content.push(
            <React.Fragment key={uuidv4()}>
                <div className={oclDisplayStyles.oclContactDetailsClass}>
                    <MailOutlined />
                    {getEmailPropertyValue(serviceProviderContactDetails.emails)}
                </div>
            </React.Fragment>
        );
    }
    if (serviceProviderContactDetails.phones) {
        content.push(
            <React.Fragment key={uuidv4()}>
                <div className={oclDisplayStyles.oclContactDetailsClass}>
                    <PhoneOutlined />
                    {getPhonePropertyValue(serviceProviderContactDetails.phones)}
                </div>
            </React.Fragment>
        );
    }
    if (serviceProviderContactDetails.chats) {
        content.push(
            <React.Fragment key={uuidv4()}>
                <div className={oclDisplayStyles.oclContactDetailsClass}>
                    <MessageOutlined />
                    {getPropertyValue(serviceProviderContactDetails.chats)}
                </div>
            </React.Fragment>
        );
    }
    if (serviceProviderContactDetails.websites) {
        content.push(
            <React.Fragment key={uuidv4()}>
                <div className={oclDisplayStyles.oclContactDetailsClass}>
                    <GlobalOutlined />
                    {getPropertyValue(serviceProviderContactDetails.websites)}
                </div>
            </React.Fragment>
        );
    }
    return <>{content}</>;
}

function getEmailPropertyValue(emailValues: string[]) {
    const { Paragraph } = Typography;
    const valueList: React.JSX.Element[] = [];

    emailValues.forEach((email) => {
        valueList.push(
            <Paragraph key={email} style={{ margin: 0 }}>
                <span>&nbsp;&nbsp;- </span>
                <a href={`mailto:${email}`}>{email}</a>
            </Paragraph>
        );
    });
    return <>{valueList}</>;
}

function getPhonePropertyValue(phoneValues: string[]) {
    const { Paragraph } = Typography;
    const valueList: React.JSX.Element[] = [];

    phoneValues.forEach((phone) => {
        valueList.push(
            <Paragraph key={phone} style={{ margin: 0 }}>
                <span>&nbsp;&nbsp;- </span>
                {phone}
            </Paragraph>
        );
    });
    return <>{valueList}</>;
}

function getPropertyValue(values: string[]) {
    const { Paragraph } = Typography;
    const valueList: React.JSX.Element[] = [];

    values.forEach((value) => {
        valueList.push(
            <Paragraph key={value} style={{ margin: 0 }}>
                <span>&nbsp;&nbsp;- </span>
                <a href={value} target='_blank' rel='noopener noreferrer'>
                    {value}
                </a>
            </Paragraph>
        );
    });
    return <>{valueList}</>;
}
