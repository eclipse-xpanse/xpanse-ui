/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Typography } from 'antd';
import { CheckOutlined, CopyOutlined } from '@ant-design/icons';
import React from 'react';
import { myServicesRoute } from '../../../utils/constants';
import { createSearchParams, useNavigate } from 'react-router-dom';

function OrderSubmitResultDetails({ msg, uuid }: { msg: string | JSX.Element; uuid: string }): JSX.Element {
    const { Paragraph } = Typography;
    const navigate = useNavigate();
    return (
        <div>
            <div className={'service-instance-detail-position'}>
                Service ID:&nbsp;
                <Paragraph
                    className={'service-instance-Paragraph'}
                    copyable={{
                        text: String(uuid),
                        icon: [
                            <CopyOutlined className={'show-details-typography-copy'} />,
                            <CheckOutlined className={'show-details-typography-copy'} />,
                        ],
                    }}
                >
                    <span
                        onClick={() => {
                            navigate({
                                pathname: myServicesRoute,
                                search: createSearchParams({
                                    serviceId: uuid,
                                }).toString(),
                            });
                        }}
                        className={'show-details-typography-copy-info'}
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
