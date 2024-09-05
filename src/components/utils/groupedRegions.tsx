/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Region } from '../../xpanse-api/generated';

export interface GroupedRegionItem {
    /**
     * The names of the region
     */
    name: string[];
    /**
     * The sites with the region belongs to, such as default, Chinese Mainland, International,
     */
    site: string[];
    /**
     * The area which the region belongs to, such as Asia, Europe, Africa
     */
    area: string;
}

export const groupedRegions = (regions: Region[]): GroupedRegionItem[] => {
    const groupedData: Record<string, GroupedRegionItem> = {};

    regions.forEach((item) => {
        const groupKey = `${item.name}-${item.area}`;

        if (!(groupKey in groupedData)) {
            groupedData[groupKey] = {
                name: [item.name],
                site: [item.site],
                area: item.area,
            };
        } else {
            if (!groupedData[groupKey].site.includes(item.site)) {
                groupedData[groupKey].site.push(item.site);
            }
        }
    });

    return Object.values(groupedData);
};
