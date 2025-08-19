/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { LinkOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';
import serviceOrderStyles from '../../../../styles/service-order.module.css';
import { openApi } from '../../../../xpanse-api/generated';

export function ApiDoc({
    serviceTemplateId,
    styleClass,
}: {
    serviceTemplateId: string;
    styleClass: string;
}): React.JSX.Element {
    function onclick() {
        void openApi({
            path: {
                serviceTemplateId: serviceTemplateId,
            },
        }).then((link) => {
            if (link.data !== undefined) {
                window.open(link.data.href);
            }
        });
    }

    return (
        <Button
            className={`${styleClass} ${serviceOrderStyles.serviceOrderApiDocCustomButton}`}
            onClick={onclick}
            type={'text'}
        >
            <LinkOutlined /> API Documentation
        </Button>
    );
}
