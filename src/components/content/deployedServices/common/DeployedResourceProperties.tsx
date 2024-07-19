/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { CheckOutlined, CopyOutlined } from '@ant-design/icons';
import { Button, Popover, Typography } from 'antd';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import myServiceStyles from '../../../../styles/my-services.module.css';
import { DeployResource } from '../../../../xpanse-api/generated';

function DeployedResourceProperties(deployResource: DeployResource): React.JSX.Element {
    if (Object.keys(deployResource).length) {
        return (
            <Popover content={<pre>{convertRecordToList(deployResource.properties)}</pre>} trigger='hover'>
                <Button type={'link'}>{deployResource.resourceName}</Button>
            </Popover>
        );
    } else {
        return <>{deployResource.resourceId}</>;
    }
}

function convertRecordToList(record: Record<string, string>): React.JSX.Element {
    const properties: React.JSX.Element[] = [];
    for (const propertyName in record) {
        properties.push(
            <div className={myServiceStyles.deployedResourceProperties}>
                <b className={myServiceStyles.resourcePropertiesKey}>{propertyName}:</b> &nbsp;
                {getCopyablePropertyValue(record[propertyName])}
            </div>
        );
    }
    return <>{properties}</>;
}

function getCopyablePropertyValue(value: string) {
    const { Paragraph } = Typography;
    return (
        <Paragraph
            copyable={{
                text: value,
                icon: [
                    <CopyOutlined className={myServiceStyles.showDetailsTypographyCopy} key={uuidv4()} />,
                    <CheckOutlined className={myServiceStyles.showDetailsTypographyCopy} key={uuidv4()} />,
                ],
            }}
        >
            {value}
        </Paragraph>
    );
}

export default DeployedResourceProperties;
