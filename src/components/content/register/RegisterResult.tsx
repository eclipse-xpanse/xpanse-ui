/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert, Button } from 'antd';
import React from 'react';
import { Ocl } from '../../../xpanse-api/generated';
import { convertStringArrayToUnorderedList } from '../../utils/generateUnorderedList';

function RegisterResult({
    ocl,
    registerRequestStatus,
    registerResult,
    onRemove,
    retryRequest,
}: {
    ocl: Ocl;
    registerRequestStatus: string;
    registerResult: string[];
    onRemove: () => void;
    retryRequest: () => void;
}): React.JSX.Element {
    if (registerRequestStatus === 'success') {
        return (
            <Alert
                type={'success'}
                message={
                    <>
                        Service <b>{ocl.name}</b> registration request submitted successfully
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
                message={`Service registration request failed`}
                description={convertStringArrayToUnorderedList(registerResult)}
                onClose={onRemove}
                className={'result'}
                action={
                    <>
                        <Button
                            className={'try-again-btn-class'}
                            size='small'
                            type='primary'
                            onClick={retryRequest}
                            danger={true}
                        >
                            Retry Request
                        </Button>
                        <Button size='small' type='primary' onClick={onRemove} danger={true}>
                            Upload New File
                        </Button>
                    </>
                }
            />
        );
    }

    return <></>;
}

export default RegisterResult;
