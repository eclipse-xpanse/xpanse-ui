/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React from 'react';
import { ServiceChangeParameter } from '../../../../xpanse-api/generated';
import { BooleanInput } from '../common/formItemElements/BooleanInput.tsx';
import { NumberInput } from '../common/formItemElements/NumberInput.tsx';
import { TextInput } from '../common/formItemElements/TextInput.tsx';

export function ServiceConfigParameterItem({
    actionParameter,
}: {
    actionParameter: ServiceChangeParameter | undefined;
}): React.JSX.Element {
    if (!actionParameter) {
        return <></>;
    }
    switch (actionParameter.dataType) {
        case 'string':
            return <TextInput actionParameter={actionParameter} />;
        case 'number':
            return <NumberInput actionParameter={actionParameter} />;
        case 'boolean':
            return <BooleanInput actionParameter={actionParameter} />;
        default:
            return <></>;
    }
}
