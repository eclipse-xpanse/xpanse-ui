/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { ServiceProviderContactDetails } from '../../../../xpanse-api/generated';
import YAML from 'yaml';
import { Button, Popover } from 'antd';
import React from 'react';

export function ContactDetailsInfo({
    serviceProviderContactDetails,
}: {
    serviceProviderContactDetails: ServiceProviderContactDetails | undefined;
}): React.JSX.Element {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (serviceProviderContactDetails) {
        const yamlDocument = new YAML.Document();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        yamlDocument.contents = serviceProviderContactDetails;
        return (
            <Popover content={<pre>{yamlDocument.toString()}</pre>} title={'Contact Details'} trigger='hover'>
                <Button className={'contact-details-data-hover'} type={'link'}>
                    {' Contact Service Vendor '}
                </Button>
            </Popover>
        );
    }
    return <></>;
}
