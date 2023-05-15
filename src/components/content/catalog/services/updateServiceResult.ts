/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { MutableRefObject } from 'react';

import { UploadFile } from 'antd';
import { ApiError, Ocl, ServiceVendorService, Response } from '../../../../xpanse-api/generated';
import { ValidationStatus } from '../../register/ValidationStatus';

export function updateServiceResult(
    id: string,
    ocl: Ocl,
    setUpdateRequestStatus: (newState: ValidationStatus) => void,
    updateResult: MutableRefObject<string[]>,
    file: UploadFile
): void {
    setUpdateRequestStatus('inProgress');
    ServiceVendorService.update(id, ocl)
        .then(() => {
            file.status = 'success';
            setUpdateRequestStatus('completed');
            updateResult.current = [`ID - ${id}`];
        })
        .catch((error: Error) => {
            file.status = 'error';
            setUpdateRequestStatus('error');
            if (error instanceof ApiError && 'details' in error.body) {
                const response: Response = error.body as Response;
                updateResult.current = response.details;
            } else {
                updateResult.current = [error.message];
            }
        });
}
