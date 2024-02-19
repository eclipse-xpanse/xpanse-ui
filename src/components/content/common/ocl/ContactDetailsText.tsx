/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { ServiceProviderContactDetails } from '../../../../xpanse-api/generated';
import YAML from 'yaml';
import { Button, Popover } from 'antd';
import React from 'react';
import { ContactsOutlined } from '@ant-design/icons';
import { ContactDetailsShowType } from './ContactDetailsShowType';

export function ContactDetailsText({
    serviceProviderContactDetails,
    showFor,
}: {
    serviceProviderContactDetails: ServiceProviderContactDetails;
    showFor: ContactDetailsShowType;
}): React.JSX.Element {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (serviceProviderContactDetails) {
        const yamlDocument = new YAML.Document();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        yamlDocument.contents = serviceProviderContactDetails;
        return (
            <Popover content={<pre>{yamlDocument.toString()}</pre>} title={'Contact Details'} trigger='hover'>
                <Button className={'ocl-data-hover'} type={'link'}>
                    <ContactsOutlined />
                    {showFor === ContactDetailsShowType.Order ? ' Contact Service Vendor ' : ' support '}
                </Button>
            </Popover>
        );
    }
    return <></>;
}
