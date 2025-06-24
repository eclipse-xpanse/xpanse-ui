/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { CheckOutlined, CopyOutlined, LinkOutlined, TagFilled } from '@ant-design/icons';
import { Typography } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import submitResultStyles from '../../../../styles/submit-result.module.css';
import { myServicesRoute } from '../../../utils/constants';

function OrderSubmitResultDetails({
    msg,
    serviceId,
    orderId,
}: {
    msg: string | React.JSX.Element;
    serviceId: string;
    orderId: string;
}): React.JSX.Element {
    const { Paragraph } = Typography;
    const navigate = useNavigate();
    return (
        <div>
            <div className={submitResultStyles.resultContainer}>
                <TagFilled /> &nbsp; Service ID: <LinkOutlined /> &nbsp;
                <Paragraph
                    className={submitResultStyles.resultMainDetails}
                    copyable={{
                        text: String(serviceId),
                        icon: [
                            <CopyOutlined className={submitResultStyles.showDetailsTypographyCopy} key={uuidv4()} />,
                            <CheckOutlined className={submitResultStyles.showDetailsTypographyCopy} key={uuidv4()} />,
                        ],
                    }}
                >
                    <span
                        onClick={() => {
                            void navigate(`${myServicesRoute}?serviceId=${encodeURIComponent(serviceId)}`);
                        }}
                        className={submitResultStyles.showDetailsTypographyCopyInfo}
                    >
                        {serviceId}
                    </span>
                </Paragraph>
            </div>
            <div className={submitResultStyles.resultContainer}>
                <TagFilled /> &nbsp; Order ID:&nbsp;
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
                    <span className={submitResultStyles.showDetailsTypographyCopyInfoNoLink}>{orderId}</span>
                </Paragraph>
            </div>
            {msg}
        </div>
    );
}

export default OrderSubmitResultDetails;
