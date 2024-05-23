/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { CheckOutlined, CopyOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import myServicesStyles from '../../../../styles/my-services.module.css';
import submitResultStyles from '../../../../styles/submit-result.module.css';

export function DeploymentResultMessage(resultMessage: string): React.JSX.Element {
    return (
        <>
            <h4>Deployment Result</h4>
            <Typography.Paragraph
                copyable={{
                    icon: [
                        <CopyOutlined className={submitResultStyles.showDetailsTypographyCopy} key={uuidv4()} />,
                        <CheckOutlined className={submitResultStyles.showDetailsTypographyCopy} key={uuidv4()} />,
                    ],
                }}
                className={myServicesStyles.deploymentDetailsWithScroll}
            >
                {resultMessage}
            </Typography.Paragraph>
        </>
    );
}
