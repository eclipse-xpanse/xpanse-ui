/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { ItemType } from 'antd/es/menu/interface';
import { category } from '../../../xpanse-api/generated';
import { catalogMenu } from '../../content/catalog/services/menu/catalogMenu';
import registerPanelMenu from '../../content/register/registerPanelMenu';
import {
    credentialMenu,
    healthCheckMenu,
    monitorMenu,
    myServicesMenu,
    policiesMenu,
    registeredServicesMenu,
    reportsMenu,
    serviceReviewsMenu,
    servicesMenu,
    workflowsMenu,
} from './servicesMenu';

export function getMenuItems(currentRole: string): ItemType[] {
    const serviceCategories: string[] = Object.values(category).filter((v) => isNaN(Number(v)));
    if (currentRole === 'isv') {
        return [catalogMenu(serviceCategories), registerPanelMenu(), credentialMenu(), reportsMenu()];
    } else if (currentRole === 'admin') {
        return [healthCheckMenu()];
    } else if (currentRole === 'csp') {
        return [serviceReviewsMenu(), registeredServicesMenu()];
    } else {
        return [
            servicesMenu(serviceCategories),
            myServicesMenu(),
            monitorMenu(),
            credentialMenu(),
            policiesMenu(),
            workflowsMenu(),
        ];
    }
}
