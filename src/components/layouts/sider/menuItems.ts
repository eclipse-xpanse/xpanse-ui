/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { catalogMenu } from '../../content/catalog/services/menu/catalogMenu';
import {
    credentialMenu,
    healthCheckMenu,
    monitorMenu,
    myServicesMenu,
    policiesMenu,
    reportsMenu,
    servicesMenu,
} from './servicesMenu';
import { ServiceTemplateDetailVo } from '../../../xpanse-api/generated';
import { ItemType } from 'antd/es/menu/hooks/useItems';
import registerPanelMenu from '../../content/register/registerPanelMenu';
import { useCurrentUserRoleStore } from '../header/useCurrentRoleStore';

export function getMenuItems(): ItemType[] {
    const serviceCategories: string[] = Object.values(ServiceTemplateDetailVo.category).filter((v) => isNaN(Number(v)));
    if (useCurrentUserRoleStore.getState().currentUserRole === 'isv') {
        return [catalogMenu(serviceCategories), registerPanelMenu(), credentialMenu(), reportsMenu()];
    } else if (useCurrentUserRoleStore.getState().currentUserRole === 'admin') {
        return [healthCheckMenu()];
    } else {
        return [servicesMenu(serviceCategories), myServicesMenu(), monitorMenu(), credentialMenu(), policiesMenu()];
    }
}
