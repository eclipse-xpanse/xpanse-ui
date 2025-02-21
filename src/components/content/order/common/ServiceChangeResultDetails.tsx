/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { CheckOutlined, CopyOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import submitResultStyles from '../../../../styles/submit-result.module.css';

function ServiceChangeResultDetails({
    msg,
    orderId,
}: {
    msg: string | React.JSX.Element;
    orderId: string;
}): React.JSX.Element {
    const { Paragraph } = Typography;
    return (
        <div>
            <div className={submitResultStyles.resultContainer}>
                Order ID:&nbsp;
                <Paragraph
                    className={submitResultStyles.resultMainDetails}
                    copyable={{
                        text: String(orderId),
                        icon: [
                            <CopyOutlined className={submitResultStyles.showDetailsTypographyCopy} key={uuidv4()} />,
                            <CheckOutlined className={submitResultStyles.showDetailsTypographyCopy} key={uuidv4()} />,
                        ],
                    }}
                >
                    <span className={submitResultStyles.showDetailsTypographyCopyInfo}>{orderId}</span>
                </Paragraph>
            </div>
            {msg}
        </div>
    );
}

export default ServiceChangeResultDetails;
