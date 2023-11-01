import { DeployResource } from '../../../xpanse-api/generated';
import { Button, Popover, Typography } from 'antd';
import React from 'react';
import { CheckOutlined, CopyOutlined } from '@ant-design/icons';

function DeployedResourceProperties(deployResource: DeployResource): React.JSX.Element {
    if (Object.keys(deployResource).length) {
        return (
            <Popover content={convertRecordToList(deployResource.properties)} trigger='hover'>
                <Button type={'link'}>{deployResource.name}</Button>
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
            <p className={'deployed-resource-properties'}>
                <b>{propertyName}:</b> &nbsp;{getCopyablePropertyValue(record[propertyName])}
            </p>
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
                    <CopyOutlined className={'show-details-typography-copy'} />,
                    <CheckOutlined className={'show-details-typography-copy'} />,
                ],
            }}
        >
            {value}
        </Paragraph>
    );
}

export default DeployedResourceProperties;
