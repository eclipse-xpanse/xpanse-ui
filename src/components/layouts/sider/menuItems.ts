/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { ItemType } from 'antd/es/menu/hooks/useItems';
import { ServiceTemplateDetailVo } from '../../../xpanse-api/generated';
import { catalogMenu } from '../../content/catalog/services/menu/catalogMenu';
import registerPanelMenu from '../../content/register/registerPanelMenu';
import { useCurrentUserRoleStore } from '../header/useCurrentRoleStore';
import {
    credentialMenu,
    healthCheckMenu,
    monitorMenu,
    myServicesMenu,
    policiesMenu,
    reportsMenu,
    serviceReviewsMenu,
    servicesMenu,
    workflowsMenu,
} from './servicesMenu';

export function getMenuItems(): ItemType[] {
    const serviceCategories: string[] = Object.values(ServiceTemplateDetailVo.category).filter((v) => isNaN(Number(v)));
    if (useCurrentUserRoleStore.getState().currentUserRole === 'isv') {
        return [catalogMenu(serviceCategories), registerPanelMenu(), credentialMenu(), reportsMenu()];
    } else if (useCurrentUserRoleStore.getState().currentUserRole === 'admin') {
        return [healthCheckMenu()];
    } else if (useCurrentUserRoleStore.getState().currentUserRole === 'csp') {
        return [serviceReviewsMenu()];
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
