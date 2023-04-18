/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { MutableRefObject } from 'react';
import { ApiException, Ocl, Response } from '../../../../xpanse-api/generated';
import { ValidationStatus } from '../../register/ValidationStatus';
import { UploadFile } from 'antd';
import { serviceVendorApi } from '../../../../xpanse-api/xpanseRestApiClient';

export function updateServiceResult(
    id: string,
    ocl: Ocl,
    setUpdateRequestStatus: (newState: ValidationStatus) => void,
    updateResult: MutableRefObject<string[]>,
    file: UploadFile
): void {
    setUpdateRequestStatus('inProgress');
    serviceVendorApi
        .update(id, ocl)
        .then(() => {
            file.status = 'success';
            setUpdateRequestStatus('completed');
            updateResult.current = [`ID - ${id}`];
        })
        .catch((error: Error) => {
            file.status = 'error';
            setUpdateRequestStatus('error');
            if (error instanceof ApiException && error.body instanceof Response) {
                updateResult.current = error.body.details;
            } else {
                updateResult.current = [error.message];
            }
        });
}
