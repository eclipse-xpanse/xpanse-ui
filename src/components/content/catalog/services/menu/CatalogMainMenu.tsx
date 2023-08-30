/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useLocation } from 'react-router-dom';
import { ServiceVo } from '../../../../../xpanse-api/generated';
import CategoryCatalog from '../tree/CategoryCatalog';
import React from 'react';

export default function CatalogMainPage(): React.JSX.Element {
    const location = useLocation();
    const category = getCategory();

    function getCategory(): ServiceVo.category | undefined {
        if (location.hash.split('#').length > 1) {
            return location.hash.split('#')[1] as ServiceVo.category;
        }
        return undefined;
    }

    if (category) {
        return <CategoryCatalog category={category} />;
    } else {
        return <></>;
    }
}
