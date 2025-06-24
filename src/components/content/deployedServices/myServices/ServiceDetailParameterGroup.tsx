/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { CheckOutlined, CopyOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Divider, Input, List, Typography } from 'antd';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import myServicesStyles from '../../../../styles/my-services.module.css';

interface OutputItem {
    title: string;
    description: React.JSX.Element;
}

function getValue(key: string, value: unknown, title: string) {
    const { Paragraph } = Typography;
    let outputValue: React.JSX.Element;
    if (title === 'Endpoint Information') {
        outputValue = (
            <div className={myServicesStyles.groupValueHideCopyItems}>
                <div>
                    <Input.Password
                        readOnly={true}
                        variant={'borderless'}
                        className={myServicesStyles.showDetails}
                        defaultValue={String(value)}
                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    />
                </div>
                <Paragraph
                    className={myServicesStyles.positionCopyIcon}
                    copyable={{
                        text: String(value),
                        icon: [
                            <CopyOutlined className={myServicesStyles.showDetails} key={uuidv4()} />,
                            <CheckOutlined className={myServicesStyles.showDetails} key={uuidv4()} />,
                        ],
                    }}
                />
            </div>
        );
    } else {
        outputValue = <div>{String(value)}</div>;
    }

    return {
        title: key,
        description: outputValue,
    };
}
export function ServiceDetailParameterGroup({
    content,
    title,
}: {
    title: string;
    content: Map<string, unknown>;
}): React.JSX.Element {
    if (content.size > 0) {
        const items: OutputItem[] = [];
        content.forEach((value, key) => {
            items.push(getValue(key, value, title));
        });
        return (
            <>
                <List
                    bordered={true}
                    header={<Typography className={myServicesStyles.serviceInstanceListDetail}>{title}</Typography>}
                    dataSource={items}
                    renderItem={(item) => (
                        <List.Item key={item.title}>
                            <List.Item.Meta title={item.title} description={item.description} />
                        </List.Item>
                    )}
                />
                <Divider dashed />
            </>
        );
    }
    return <></>;
}
