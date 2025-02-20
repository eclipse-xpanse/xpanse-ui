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
    configParameter,
}: {
    configParameter: ServiceChangeParameter | undefined;
}): React.JSX.Element {
    if (!configParameter) {
        return <></>;
    }
    switch (configParameter.dataType) {
        case 'string':
            return <TextInput actionParameter={configParameter} />;
        case 'number':
            return <NumberInput actionParameter={configParameter} />;
        case 'boolean':
            return <BooleanInput actionParameter={configParameter} />;
        default:
            return <></>;
    }
}
