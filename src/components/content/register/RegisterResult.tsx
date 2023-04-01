/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert, Button } from 'antd';
import { Ocl } from '../../../xpanse-api/generated';
import { ValidationStatus } from './ValidationStatus';

function RegisterResult({
    ocl,
    registerRequestStatus,
    registerResult,
    onRemove,
}: {
    ocl: Ocl;
    registerRequestStatus: ValidationStatus;
    registerResult: string;
    onRemove: () => void;
}): JSX.Element {
    if (registerRequestStatus === 'completed') {
        return (
            <Alert
                type={'success'}
                message={`Service ${ocl.name} Registered Successfully`}
                closable={true}
                onClose={onRemove}
                className={'result'}
            />
        );
    } else if (registerRequestStatus === 'error') {
        return (
            <Alert
                type={'error'}
                closable={true}
                showIcon={true}
                message={`Service Registration Failed`}
                description={registerResult}
                onClose={onRemove}
                className={'result'}
                action={
                    <Button size='small' type='primary' onClick={onRemove} danger={true}>
                        Try Again
                    </Button>
                }
            />
        );
    }

    return <></>;
}

export default RegisterResult;
