/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

function sortVersion(versions: string[]) {
    versions.sort((a, b) => {
        const prefixA = a.match(/[^0-9]/g)?.[0] || '';
        const prefixB = b.match(/[^0-9]/g)?.[0] || '';
        const versionA = a.replace(prefixA, '');
        const versionB = b.replace(prefixA, '');
        if (prefixA.toLowerCase() < prefixB.toUpperCase()) {
            return -1;
        } else if (prefixA.toLowerCase() > prefixB.toLowerCase()) {
            return 1;
        } else {
            return sort(versionA, versionB);
        }
    });
    return versions;
}

function sort(a: string, b: string) {
    const aArr = a.split('.').map(Number);
    const bArr = b.split('.').map(Number);
    const len = Math.max(aArr.length, bArr.length);
    for (let i = 0; i < len; i++) {
        if (aArr[i] === undefined) {
            return 1;
        }
        if (bArr[i] === undefined) {
            return -1;
        }
        if (aArr[i] > bArr[i]) {
            return -1;
        }
        if (aArr[i] < bArr[i]) {
            return 1;
        }
    }
    return 0;
}

export default sortVersion;
