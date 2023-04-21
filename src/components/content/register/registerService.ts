/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { UploadFile } from 'antd';
import { ValidationStatus } from './ValidationStatus';
import { MutableRefObject } from 'react';
import { ApiError, Ocl, RegisteredServiceVo, Response, ServiceVendorService } from '../../../xpanse-api/generated';

export function registerService(
    ocl: Ocl,
    setRegisterRequestStatus: (newState: ValidationStatus) => void,
    registerResult: MutableRefObject<string[]>,
    file: UploadFile
): void {
    setRegisterRequestStatus('inProgress');
    ServiceVendorService.register(ocl)
        .then((registeredServiceVo: RegisteredServiceVo) => {
            file.status = 'success';
            setRegisterRequestStatus('completed');
            registerResult.current = [`ID - ${registeredServiceVo.id}`];
        })
        .catch((error: Error) => {
            file.status = 'error';
            setRegisterRequestStatus('error');
            if (error instanceof ApiError && 'details' in error.body) {
                const response: Response = error.body as Response;
                registerResult.current = response.details;
            } else {
                registerResult.current = [error.message];
            }
        });
}
