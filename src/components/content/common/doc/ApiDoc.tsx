/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { LinkOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';
import serviceOrderStyles from '../../../../styles/service-order.module.css';
import { Link, openApi, OpenApiData } from '../../../../xpanse-api/generated';

export function ApiDoc({
    serviceTemplateId,
    styleClass,
}: {
    serviceTemplateId: string;
    styleClass: string;
}): React.JSX.Element {
    function onclick() {
        const data: OpenApiData = {
            serviceTemplateId: serviceTemplateId,
        };
        void openApi(data).then((link: Link) => {
            if (link.href !== undefined) {
                window.open(link.href);
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
