/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { ChangeEvent } from 'react';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

export type TextInputEventHandler = (event: ChangeEvent<HTMLInputElement>) => void;
export type NumberInputEventHandler = (value: number | string | null) => void;
export type CheckBoxOnChangeHandler = (e: CheckboxChangeEvent) => void;
export type SwitchOnChangeHandler = (checked: boolean) => void;
export type ParamOnChangeHandler =
    | TextInputEventHandler
    | NumberInputEventHandler
    | CheckBoxOnChangeHandler
    | SwitchOnChangeHandler;

export interface DeployParam {
    name: string;
    kind: string;
    type: string;
    example: string;
    description: string;
    value: string;
    mandatory: boolean;
    validator: string;
}

export interface DeployParamItem {
    item: DeployParam;
    [key: string]: any;
}
