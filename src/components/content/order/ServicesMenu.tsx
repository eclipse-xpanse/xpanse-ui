/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { BarsOutlined, HddOutlined } from '@ant-design/icons';
import { ItemType } from 'antd/es/menu/hooks/useItems';
import {
    myServicesLabelName,
    myServicesRoute,
    servicesLabelName,
    servicesPageRoute,
    servicesSubPageRoute,
} from '../../utils/constants';
import { Link } from 'react-router-dom';

export const servicesMenu = (data: string[]): ItemType => {
    const subMenuItems = data.map((subMenu: string) => {
        let subMenuLabelStr: string =
            subMenu.charAt(0).toUpperCase() + subMenu.substring(1, subMenu.length).replace('_', '');
        return {
            key: servicesSubPageRoute + subMenu,
            label: subMenuLabelStr,
        };
    });

    return {
        key: servicesPageRoute,
        label: servicesLabelName,
        icon: <HddOutlined />,
        children: subMenuItems,
    };
};

export const serviceListMenu = (): ItemType => {
    return {
        key: myServicesRoute,
        label: <Link to={myServicesRoute}>{myServicesLabelName}</Link>,
        icon: <BarsOutlined />,
        title: 'MyServices',
    };
};
