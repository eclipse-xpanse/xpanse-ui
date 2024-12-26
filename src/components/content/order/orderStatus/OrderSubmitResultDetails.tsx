/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { CheckOutlined, CopyOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import React from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import submitResultStyles from '../../../../styles/submit-result.module.css';
import { myServicesRoute } from '../../../utils/constants';

function OrderSubmitResultDetails({ msg, uuid }: { msg: string | React.JSX.Element; uuid: string }): React.JSX.Element {
    const { Paragraph } = Typography;
    const navigate = useNavigate();
    return (
        <div>
            <div className={submitResultStyles.resultContainer}>
                Service ID:&nbsp;
                <Paragraph
                    className={submitResultStyles.resultMainDetails}
                    copyable={{
                        text: String(uuid),
                        icon: [
                            <CopyOutlined className={submitResultStyles.showDetailsTypographyCopy} key={uuidv4()} />,
                            <CheckOutlined className={submitResultStyles.showDetailsTypographyCopy} key={uuidv4()} />,
                        ],
                    }}
                >
                    <span
                        onClick={() => {
                            void navigate({
                                pathname: myServicesRoute,
                                search: createSearchParams({
                                    serviceId: uuid,
                                }).toString(),
                            });
                        }}
                        className={submitResultStyles.showDetailsTypographyCopyInfo}
                    >
                        {uuid}
                    </span>
                </Paragraph>
            </div>
            {msg}
        </div>
    );
}

export default OrderSubmitResultDetails;
