/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert, Button } from 'antd';
import { Ocl } from '../../../xpanse-api/generated';
import { ValidationStatus } from './ValidationStatus';
import { convertStringArrayToUnorderedList } from '../../utils/generateUnorderedList';

function RegisterResult({
    ocl,
    registerRequestStatus,
    registerResult,
    onRemove,
}: {
    ocl: Ocl;
    registerRequestStatus: ValidationStatus;
    registerResult: string[];
    onRemove: () => void;
}): JSX.Element {
    if (registerRequestStatus === 'completed') {
        return (
            <Alert
                type={'success'}
                message={
                    <>
                        Service <b>{ocl.name}</b> Registered Successfully
                    </>
                }
                closable={true}
                onClose={onRemove}
                className={'result'}
                description={convertStringArrayToUnorderedList(registerResult)}
            />
        );
    } else if (registerRequestStatus === 'error') {
        return (
            <Alert
                type={'error'}
                closable={true}
                showIcon={true}
                message={`Service Registration Failed`}
                description={convertStringArrayToUnorderedList(registerResult)}
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
