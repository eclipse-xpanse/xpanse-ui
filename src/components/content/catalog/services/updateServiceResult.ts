/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { MutableRefObject } from 'react';
import { Ocl } from '../../../../xpanse-api/generated';
import { ValidationStatus } from '../../register/ValidationStatus';
import { UploadFile } from 'antd';
import { serviceVendorApi } from '../../../../xpanse-api/xpanseRestApiClient';

export function updateServiceResult(
    id: string,
    ocl: Ocl,
    setUpdateRequestStatus: (newState: ValidationStatus) => void,
    updateResult: MutableRefObject<string>,
    file: UploadFile
): void {
    serviceVendorApi
        .update(id, ocl)
        .then(() => {
            file.status = 'success';
            setUpdateRequestStatus('completed');
            updateResult.current = 'Service updated Successfully';
        })
        .catch((error: any) => {
            file.status = 'error';
            setUpdateRequestStatus('error');
            updateResult.current = error.message;
        });
}
