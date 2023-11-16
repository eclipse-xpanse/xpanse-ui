/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React from 'react';
import { Input, Typography } from 'antd';
import { CheckOutlined, CopyOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

export function convertMapToDetailsList(content: Map<string, unknown>, title: string): React.JSX.Element {
    if (content.size > 0) {
        const items: React.JSX.Element[] = [];
        const { Paragraph } = Typography;
        content.forEach((v, k) => {
            items.push(
                <li key={k} className={'details-content'}>
                    <div className={'service-instance-detail-position'}>
                        <div className={'service-instance-list-detail '}>{k}:&nbsp;&nbsp;</div>
                        {title.includes('Endpoint Information') ? (
                            <div className={'show-details'}>
                                <Paragraph
                                    copyable={{
                                        text: String(v),
                                        icon: [
                                            <CopyOutlined className={'show-details-typography-copy'} />,
                                            <CheckOutlined className={'show-details-typography-copy'} />,
                                        ],
                                    }}
                                >
                                    <Input.Password
                                        readOnly={true}
                                        bordered={false}
                                        className={'show-details'}
                                        defaultValue={String(v)}
                                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                    />
                                </Paragraph>
                            </div>
                        ) : (
                            <div>
                                &nbsp;&nbsp;
                                {String(v)}
                            </div>
                        )}
                    </div>
                </li>
            );
        });

        return (
            <div>
                <h4>{title}</h4>
                <ul>{items}</ul>
            </div>
        );
    }
    return <></>;
}
