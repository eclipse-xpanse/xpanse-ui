/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { serviceVendorApi } from '../../../xpanse-api/xpanseRestApiClient';
import { Ocl } from '../../../xpanse-api/generated';
import { UploadFile } from 'antd';
import { ValidationStatus } from './ValidationStatus';
import { MutableRefObject } from 'react';

export function registerService(
    ocl: Ocl,
    setRegisterRequestStatus: (newState: ValidationStatus) => void,
    registerResult: MutableRefObject<string>,
    file: UploadFile
): void {
    serviceVendorApi
        .register(ocl)
        .then(() => {
            file.status = 'success';
            setRegisterRequestStatus('completed');
            registerResult.current = 'Service Registered Successfully';
        })
        .catch((error: Error) => {
            file.status = 'error';
            setRegisterRequestStatus('error');
            registerResult.current = error.message;
        });
}
