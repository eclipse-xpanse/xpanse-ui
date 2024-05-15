/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { UserOrderableServiceVo } from '../../../../xpanse-api/generated';
import { sortVersion } from '../../../utils/Sort';
import { Version } from '../types/Version';

export function getSortedVersionList(currentVersions: Map<string, UserOrderableServiceVo[]>): Version[] {
    if (currentVersions.size <= 0) {
        return [{ value: '', label: '' }];
    }
    const versionSet: string[] = Array.from(currentVersions.keys());
    const versions: { value: string; label: string }[] = [];
    sortVersion(versionSet).forEach((version) => {
        currentVersions.forEach((_, k) => {
            if (version === k) {
                const versionItem = { value: k || '', label: k || '' };
                versions.push(versionItem);
            }
        });
    });

    return versions;
}
