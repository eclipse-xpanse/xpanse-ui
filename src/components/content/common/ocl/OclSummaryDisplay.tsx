/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert, UploadFile } from 'antd';
import React from 'react';
import { Ocl } from '../../../../xpanse-api/generated';
import DisplayOclData from './DisplayOclData';
import { ValidationStatus } from './ValidationStatus';

function OclSummaryDisplay({
    setOclValidationStatus,
    ocl,
    file,
}: {
    setOclValidationStatus: (newState: ValidationStatus) => void;
    ocl: Ocl;
    file: UploadFile;
}): React.JSX.Element {
    const oclTableData = DisplayOclData({ ocl: ocl });
    if (typeof oclTableData === 'string') {
        file.status = 'error';
        setOclValidationStatus('error');
        return (
            <Alert
                type={'error'}
                showIcon={true}
                message={`OCL data in the uploaded file not Valid. Error while parsing - ${oclTableData}`}
            />
        );
    } else {
        file.status = 'done';
        setOclValidationStatus('completed');
        return oclTableData;
    }
}

export default OclSummaryDisplay;
