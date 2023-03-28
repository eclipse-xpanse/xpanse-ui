/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert } from 'antd';
import React from 'react';
import { ValidationStatus } from './ValidationStatus';

function YamlSyntaxValidationResult({
    validationResult,
    yamlSyntaxValidationStatus,
}: {
    validationResult: string;
    yamlSyntaxValidationStatus: ValidationStatus;
}): JSX.Element {
    if (yamlSyntaxValidationStatus === 'completed') {
        return <Alert type={'info'} showIcon={true} message={validationResult} />;
    } else {
        return <Alert type={'error'} showIcon={true} message={validationResult} />;
    }
}

export default YamlSyntaxValidationResult;
