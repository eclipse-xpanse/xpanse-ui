/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { InputVariable, sensitiveScope } from '../../../../xpanse-api/generated';
import { DeployParam } from '../types/DeployParam';

export const getModifyParams = (variables: InputVariable[]): DeployParam[] => {
    const params: DeployParam[] = [];

    if (variables.length > 0) {
        for (const param of variables) {
            params.push({
                name: param.name,
                kind: param.kind,
                type: param.dataType,
                example: param.example ?? '',
                description: param.description,
                value: param.value ?? '',
                mandatory: param.mandatory,
                sensitiveScope: param.sensitiveScope ?? sensitiveScope.NONE,
                valueSchema: param.valueSchema ?? undefined,
                autoFill: param.autoFill ?? undefined,
            });
        }
    }
    return params;
};
