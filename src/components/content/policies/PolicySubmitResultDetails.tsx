/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Typography } from 'antd';
import { CheckOutlined, CopyOutlined } from '@ant-design/icons';
import React from 'react';
import { policiesRoute } from '../../utils/constants';
import { createSearchParams, useNavigate } from 'react-router-dom';

function PolicySubmitResultDetails({ msg, uuid }: { msg: string | JSX.Element; uuid: string }): JSX.Element {
    const { Paragraph } = Typography;
    const navigate = useNavigate();
    return (
        <div>
            {uuid.length > 0 ? (
                <div className={'service-instance-detail-position'}>
                    Policy ID:&nbsp;
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
                                    pathname: policiesRoute,
                                    search: createSearchParams({
                                        policyId: uuid,
                                    }).toString(),
                                });
                            }}
                            className={'show-details-typography-copy-info'}
                        >
                            {uuid}
                        </span>
                    </Paragraph>
                </div>
            ) : null}

            {msg}
        </div>
    );
}

export default PolicySubmitResultDetails;
