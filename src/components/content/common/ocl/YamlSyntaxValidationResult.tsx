/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert } from 'antd';
import { ValidationStatus } from './ValidationStatus';
import React from 'react';

function YamlSyntaxValidationResult({
    validationResult,
    yamlSyntaxValidationStatus,
}: {
    validationResult: string;
    yamlSyntaxValidationStatus: ValidationStatus;
}): React.JSX.Element {
    const handleClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();
    };
    if (yamlSyntaxValidationStatus === 'completed') {
        return <Alert type={'info'} showIcon={true} message={validationResult} onClick={handleClick} />;
    } else {
        return <Alert type={'error'} showIcon={true} message={validationResult} onClick={handleClick} />;
    }
}

export default YamlSyntaxValidationResult;
