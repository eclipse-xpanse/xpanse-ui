/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React from 'react';
import { DeployParam } from '../../types/DeployParam';
import { DeployRequest } from '../../../../../xpanse-api/generated';
import { TextInput } from '../../formElements/TextInput';
import { NumberInput } from '../../formElements/NumberInput';
import { BooleanInput } from '../../formElements/BooleanInput';

export function OrderItem({
    item,
    csp,
    region,
}: {
    item: DeployParam;
    csp: DeployRequest.csp;
    region: string;
}): React.JSX.Element {
    if (item.type === 'string') {
        return <TextInput item={item} csp={csp} region={region} />;
    }
    if (item.type === 'number') {
        return <NumberInput item={item} />;
    }
    if (item.type === 'boolean') {
        return <BooleanInput item={item} />;
    }

    return <></>;
}
