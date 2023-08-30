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
    if (yamlSyntaxValidationStatus === 'completed') {
        return <Alert type={'info'} showIcon={true} message={validationResult} />;
    } else {
        return <Alert type={'error'} showIcon={true} message={validationResult} />;
    }
}

export default YamlSyntaxValidationResult;
