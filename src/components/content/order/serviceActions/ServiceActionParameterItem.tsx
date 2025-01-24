import React from 'react';
import { ServiceChangeParameter } from '../../../../xpanse-api/generated';
import { BooleanInput } from './elements/BooleanInput';
import { NumberInput } from './elements/NumberInput';
import { TextInput } from './elements/TextInput';

export function ServiceActionParameterItem({
    actionParameter,
}: {
    actionParameter: ServiceChangeParameter;
}): React.JSX.Element {
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
