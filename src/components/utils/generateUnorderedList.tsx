/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

export function convertStringArrayToUnorderedList(result: string[]): string | JSX.Element {
    if (result.length === 1) {
        return result[0];
    }
    if (result.length > 1) {
        const items: JSX.Element[] = [];
        result.forEach((item) => items.push(<li>{item}</li>));
        return <ul>{items}</ul>;
    }
    return '';
}
