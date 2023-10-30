/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React from 'react';

export function convertStringArrayToUnorderedList(result: string[]): string | React.JSX.Element {
    if (result.length === 1) {
        return result[0];
    }
    if (result.length > 1) {
        const items: React.JSX.Element[] = [];
        result.forEach((item) => items.push(<li>{item}</li>));
        return <ul>{items}</ul>;
    }
    return '';
}
