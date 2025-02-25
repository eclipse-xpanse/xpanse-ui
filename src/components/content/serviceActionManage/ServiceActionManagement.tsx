/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { PlaySquareOutlined } from '@ant-design/icons';
import { Card, Tabs } from 'antd';
import React, { useState } from 'react';
import catalogStyles from '../../../styles/catalog.module.css';
import { ServiceAction } from '../../../xpanse-api/generated';
import ServiceActionItems from './ServiceActionItems.tsx';

export const ServiceActionManagement = ({ serviceActions }: { serviceActions: ServiceAction[] }): React.JSX.Element => {
    const [actionName, setActionName] = useState<string | undefined>(serviceActions[0].name);
    const onChange = (key: string) => {
        setActionName(key);
    };
    const items = serviceActions.map((serviceAction) => {
        return {
            key: serviceAction.name,
            label: serviceAction.name,
            children: <ServiceActionItems serviceAction={serviceAction} />,
        };
    });

    return (
        <>
            {' '}
            <h3 className={catalogStyles.catalogDetailsH3}>
                <PlaySquareOutlined />
                &nbsp;Service Action Management
            </h3>
            <Card>
                <Tabs
                    defaultActiveKey={serviceActions[0].name}
                    items={items}
                    activeKey={actionName}
                    onChange={onChange}
                    destroyInactiveTabPane={true}
                />
            </Card>
        </>
    );
};
