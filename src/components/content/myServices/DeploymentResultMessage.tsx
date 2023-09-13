/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Typography } from 'antd';
import React from 'react';
import { CheckOutlined, CopyOutlined } from '@ant-design/icons';

export function DeploymentResultMessage(resultMessage: string): React.JSX.Element {
    return (
        <>
            <h4>Deployment Result</h4>
            <Typography.Paragraph
                copyable={{
                    icon: [
                        <CopyOutlined className={'show-details-typography-copy'} />,
                        <CheckOutlined className={'show-details-typography-copy'} />,
                    ],
                }}
                className={'deployment-details-with-scroll'}
            >
                {resultMessage}
            </Typography.Paragraph>
        </>
    );
}
