/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert, Button } from 'antd';
import React from 'react';
import errorAlertStyles from '../../../styles/error-alert.module.css';
import registerStyles from '../../../styles/register.module.css';
import { Ocl, ServiceTemplateRegistrationState } from '../../../xpanse-api/generated';
import { convertStringArrayToUnorderedList } from '../../utils/generateUnorderedList';
import { useGetServiceTemplateDetailsQuery } from './query/useGetServiceTemplateDetailsQuery.ts';

function RegisterResult({
    ocl,
    serviceTemplateId,
    registerRequestStatus,
    registerResult,
    onRemove,
    retryRequest,
}: {
    ocl: Ocl;
    serviceTemplateId: string;
    registerRequestStatus: string;
    registerResult: string[];
    onRemove: () => void;
    retryRequest: () => void;
}): React.JSX.Element {
    const getServiceTemplateDetailsQuery = useGetServiceTemplateDetailsQuery(serviceTemplateId);
    if (
        registerRequestStatus === 'success' &&
        getServiceTemplateDetailsQuery.isSuccess &&
        getServiceTemplateDetailsQuery.data
    ) {
        return (
            <Alert
                type={'success'}
                message={
                    getServiceTemplateDetailsQuery.data.serviceTemplateRegistrationState ===
                    ServiceTemplateRegistrationState.APPROVED ? (
                        <>
                            Service <b>{ocl.name}</b> registered and added to catalog successfully
                        </>
                    ) : (
                        <>
                            Service <b>{ocl.name}</b> registration request submitted successfully
                        </>
                    )
                }
                closable={true}
                onClose={onRemove}
                className={registerStyles.result}
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
                className={registerStyles.result}
                action={
                    <>
                        <Button
                            className={errorAlertStyles.tryAgainBtnInAlertClass}
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
