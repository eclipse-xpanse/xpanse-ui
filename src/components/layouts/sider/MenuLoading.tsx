/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { MenuItemType } from 'antd/lib/menu/hooks/useItems';
import { Spin } from 'antd';

function MenuLoading(): MenuItemType {
    return {
        key: 'loading',
        icon: <Spin className={'menu-loading'} size={'large'} />,
        title: 'loading',
    };
}

export default MenuLoading;
