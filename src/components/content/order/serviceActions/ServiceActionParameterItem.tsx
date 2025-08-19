import React from 'react';
import { ServiceChangeParameter, VariableDataType } from '../../../../xpanse-api/generated';
import { BooleanInput } from '../common/formItemElements/BooleanInput.tsx';
import { NumberInput } from '../common/formItemElements/NumberInput.tsx';
import { TextInput } from '../common/formItemElements/TextInput.tsx';

export function ServiceActionParameterItem({
    actionParameter,
}: {
    actionParameter: ServiceChangeParameter;
}): React.JSX.Element {
    switch (actionParameter.dataType) {
        case VariableDataType.STRING:
            return <TextInput actionParameter={actionParameter} />;
        case VariableDataType.NUMBER:
            return <NumberInput actionParameter={actionParameter} />;
        case VariableDataType.BOOLEAN:
            return <BooleanInput actionParameter={actionParameter} />;
        default:
            return <></>;
    }
}
