/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React from 'react';
import { useLocation } from 'react-router-dom';
import { Category } from '../../../../../xpanse-api/generated';
import CategoryCatalog from '../tree/CategoryCatalog';

export default function CatalogMainPage(): React.JSX.Element {
    const location = useLocation();
    const category = getCategory();

    function getCategory(): Category | undefined {
        if (location.hash.split('#').length > 1) {
            return location.hash.split('#')[1] as Category;
        }
        return undefined;
    }

    if (category) {
        return <CategoryCatalog key={category} category={category} />;
    } else {
        return <></>;
    }
}
