/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { CheckOutlined, CopyOutlined, DownOutlined } from '@ant-design/icons';
import { Button, Collapse, List, Typography } from 'antd';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import myServiceStyles from '../../../../styles/my-services.module.css';
import { DeployResource } from '../../../../xpanse-api/generated';

function DeployedResourceProperties(deployResource: DeployResource): React.JSX.Element {
    if (Object.keys(deployResource).length) {
        return (
            <Collapse
                bordered={false}
                className={myServiceStyles.resourceCollapse}
                expandIcon={({ isActive }) => <DownOutlined rotate={isActive ? 180 : 0} />}
                items={[
                    {
                        key: '1',
                        label: <Button type='link'>{deployResource.resourceName}</Button>,
                        className: myServiceStyles.resourcePanel,
                        children: <div>{convertRecordToList(deployResource.properties)}</div>,
                    },
                ]}
            />
        );
    } else {
        return <>{deployResource.resourceId}</>;
    }
}

function convertRecordToList(record: Record<string, string>): React.JSX.Element {
    const items = Object.entries(record).map(([key, value]) => ({
        title: key,
        description: getCopyablePropertyValue(value),
    }));

    return (
        <List
            itemLayout='horizontal'
            dataSource={items}
            renderItem={(item) => (
                <List.Item>
                    <List.Item.Meta
                        title={<span className={myServiceStyles.resourcePropertiesKey}>{item.title}</span>}
                        description={item.description}
                        className={myServiceStyles.resourceProperties}
                    />
                </List.Item>
            )}
            className={myServiceStyles.resourceList}
        />
    );
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
