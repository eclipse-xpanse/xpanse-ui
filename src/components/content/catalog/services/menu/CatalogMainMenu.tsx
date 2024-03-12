/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useLocation } from 'react-router-dom';
import { DeployedService } from '../../../../../xpanse-api/generated';
import CategoryCatalog from '../tree/CategoryCatalog';
import React from 'react';

export default function CatalogMainPage(): React.JSX.Element {
    const location = useLocation();
    const category = getCategory();

    function getCategory(): DeployedService.category | undefined {
        if (location.hash.split('#').length > 1) {
            return location.hash.split('#')[1] as DeployedService.category;
        }
        return undefined;
    }

    if (category) {
        return <CategoryCatalog key={category} category={category} />;
    } else {
        return <></>;
    }
}
