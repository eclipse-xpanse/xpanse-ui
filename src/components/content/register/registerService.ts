/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { serviceVendorApi } from '../../../xpanse-api/xpanseRestApiClient';
import { UploadFile } from 'antd';
import { ValidationStatus } from './ValidationStatus';
import { MutableRefObject } from 'react';
import { ApiException, Ocl, RegisteredServiceVo, Response } from '../../../xpanse-api/generated';

export function registerService(
    ocl: Ocl,
    setRegisterRequestStatus: (newState: ValidationStatus) => void,
    registerResult: MutableRefObject<string>,
    file: UploadFile
): void {
    serviceVendorApi
        .register(ocl)
        .then((registeredServiceVo: RegisteredServiceVo) => {
            file.status = 'success';
            setRegisterRequestStatus('completed');
            registerResult.current = `ID - ${registeredServiceVo.id}`;
        })
        .catch((error: Error) => {
            file.status = 'error';
            setRegisterRequestStatus('error');
            if (error instanceof ApiException && error.body instanceof Response) {
                registerResult.current = error.body.message;
            } else {
                registerResult.current = error.message;
            }
        });
}
