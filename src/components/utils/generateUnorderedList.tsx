/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */
import '../../styles/my_services.css';
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

export function convertMapToUnorderedList(result: Map<string, string>, title: string): string | React.JSX.Element {
    if (result.size > 0) {
        const items: React.JSX.Element[] = [];
        result.forEach((v, k) =>
            items.push(
                <li>
                    <span className={'service-instance-list-detail'}>{k}:</span>&nbsp;&nbsp;{v}
                </li>
            )
        );
        return (
            <div>
                <h4>{title}</h4>
                <ul>{items}</ul>
            </div>
        );
    }
    return '';
}
