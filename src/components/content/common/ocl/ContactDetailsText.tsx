/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { ServiceProviderContactDetails } from '../../../../xpanse-api/generated';
import { Button, Popover, Typography } from 'antd';
import React from 'react';
import { ContactsOutlined, GlobalOutlined, MailOutlined, MessageOutlined, PhoneOutlined } from '@ant-design/icons';
import { ContactDetailsShowType } from './ContactDetailsShowType';
import { v4 as uuidv4 } from 'uuid';

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
            <Button className={'ocl-data-hover'} type={'link'}>
                <ContactsOutlined />
                {showFor === ContactDetailsShowType.Order ? ' Contact Service Vendor ' : ' support '}
            </Button>
        </Popover>
    );
}

function convertRecordToList(serviceProviderContactDetails: ServiceProviderContactDetails): React.JSX.Element {
    const content: React.JSX.Element[] = [];
    if (serviceProviderContactDetails.email) {
        content.push(
            <React.Fragment key={uuidv4()}>
                <div className={'ocl-contact-details-class'}>
                    <MailOutlined />
                    {getEmailPropertyValue(serviceProviderContactDetails.email)}
                </div>
            </React.Fragment>
        );
    }
    if (serviceProviderContactDetails.phone) {
        content.push(
            <React.Fragment key={uuidv4()}>
                <div className={'ocl-contact-details-class'}>
                    <PhoneOutlined />
                    {getPhonePropertyValue(serviceProviderContactDetails.phone)}
                </div>
            </React.Fragment>
        );
    }
    if (serviceProviderContactDetails.chat) {
        content.push(
            <React.Fragment key={uuidv4()}>
                <div className={'ocl-contact-details-class'}>
                    <MessageOutlined />
                    {getPropertyValue(serviceProviderContactDetails.chat)}
                </div>
            </React.Fragment>
        );
    }
    if (serviceProviderContactDetails.website) {
        content.push(
            <React.Fragment key={uuidv4()}>
                <div className={'ocl-contact-details-class'}>
                    <GlobalOutlined />
                    {getPropertyValue(serviceProviderContactDetails.website)}
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
