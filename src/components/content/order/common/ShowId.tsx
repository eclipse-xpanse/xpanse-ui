/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Typography } from 'antd';
import React from 'react';
import showIdStyles from '../../../../styles/show-id.module.css';

export const ShowId = ({ id }: { id: string }): React.JSX.Element => {
    const { Paragraph } = Typography;
    return (
        <>
            <div className={showIdStyles.serviceIdValue}>
                <Paragraph className={showIdStyles.serviceOrderIdClass} ellipsis={true} copyable={{ tooltips: id }}>
                    {id}
                </Paragraph>
            </div>
        </>
    );
};
