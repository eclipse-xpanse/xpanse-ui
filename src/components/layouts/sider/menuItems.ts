/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { userRoleKey } from '../../utils/constants';
import { catalogMenu } from '../../content/catalog/services/catalogMenu';
import registerPanelMenu from '../../content/register/registerPanelMenu';
import {
    credentialMenu,
    healthCheckMenu,
    monitorMenu,
    myServicesMenu,
    servicesMenu,
} from '../../content/order/services/ServicesMenu';
import { RegisteredServiceVo } from '../../../xpanse-api/generated';
import { ItemType } from 'antd/es/menu/hooks/useItems';

export function getMenuItems(): ItemType[] {
    const serviceCategories: string[] = Object.values(RegisteredServiceVo.category).filter((v) => isNaN(Number(v)));
    if (sessionStorage.getItem(userRoleKey) === 'isv') {
        return [catalogMenu(serviceCategories), registerPanelMenu()];
    } else if (sessionStorage.getItem(userRoleKey) === 'admin') {
        return [healthCheckMenu()];
    } else {
        return [servicesMenu(serviceCategories), myServicesMenu(), monitorMenu(), credentialMenu()];
    }
}
