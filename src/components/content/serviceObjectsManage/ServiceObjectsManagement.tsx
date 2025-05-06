/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { DownOutlined, PlaySquareOutlined } from '@ant-design/icons';
import { Button, Dropdown, MenuProps, Space } from 'antd';
import React, { useState } from 'react';
import catalogStyles from '../../../styles/catalog.module.css';
import serviceObjectsStyles from '../../../styles/service-objects.module.css';
import { ServiceObject } from '../../../xpanse-api/generated';
import { ServiceObjectItems } from './ServiceObjectItems.tsx';

export const ServiceObjectsManagement = ({
    serviceObjects,
}: {
    serviceObjects: ServiceObject[];
}): React.JSX.Element => {
    const [serviceObject, setServiceObject] = useState<ServiceObject | undefined>(serviceObjects[0]);
    const [currentType, setCurrentType] = useState<string>(serviceObjects[0].type);

    const onClick: MenuProps['onClick'] = ({ key }) => {
        setCurrentType(key);

        const selectedServiceObject = serviceObjects.find((item) => item.type === key);
        setServiceObject(selectedServiceObject);
    };

    const typeItems: MenuProps['items'] = serviceObjects.map((serviceObject) => {
        return {
            key: serviceObject.type,
            label: serviceObject.type,
        };
    });

    return (
        <>
            {' '}
            <h3 className={catalogStyles.catalogDetailsH3}>
                <PlaySquareOutlined />
                &nbsp;Service Object Management
            </h3>
            <Space>
                {'Service Object Type: '}
                <Dropdown
                    menu={{
                        items: typeItems,
                        selectable: true,
                        defaultSelectedKeys: [serviceObjects[0]?.type],
                        onClick: onClick,
                    }}
                    trigger={['hover']}
                >
                    <Button className={serviceObjectsStyles.serviceTypeSelectClass}>
                        {currentType}
                        <DownOutlined />
                    </Button>
                </Dropdown>
            </Space>
            {serviceObject ? <ServiceObjectItems key={serviceObject.type} serviceObject={serviceObject} /> : <></>}
        </>
    );
};
