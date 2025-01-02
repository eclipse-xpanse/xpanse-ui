/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { UseMutationResult } from '@tanstack/react-query';
import { Alert, Button } from 'antd';
import React from 'react';
import catalogStyles from '../../../../../styles/catalog.module.css';
import errorAlertStyles from '../../../../../styles/error-alert.module.css';
import { Ocl, ServiceTemplateRequestInfo } from '../../../../../xpanse-api/generated';
import { convertStringArrayToUnorderedList } from '../../../../utils/generateUnorderedList';

function UpdateResult({
    ocl,
    updateServiceRequest,
    updateResult,
    onRemove,
    retryRequest,
    tryNewFile,
}: {
    ocl: Ocl;
    updateServiceRequest: UseMutationResult<ServiceTemplateRequestInfo, Error, Ocl>;
    updateResult: string[];
    onRemove: () => void;
    retryRequest: () => void;
    tryNewFile: () => void;
}): React.JSX.Element {
    if (updateServiceRequest.isSuccess) {
        return (
            <Alert
                type={'success'}
                message={
                    updateServiceRequest.data.requestSubmittedForReview ? (
                        <>
                            Service template <b>{ocl.name}</b> update request submitted to review.
                        </>
                    ) : (
                        <>
                            Service template <b>{ocl.name}</b> updated in catalog successfully.
                        </>
                    )
                }
                closable={true}
                onClose={onRemove}
                className={catalogStyles.catalogServiceUpdateResult}
                description={convertStringArrayToUnorderedList(updateResult)}
            />
        );
    }

    if (updateServiceRequest.isError) {
        return (
            <Alert
                type={'error'}
                closable={true}
                showIcon={true}
                message={`Service Update Failed`}
                description={convertStringArrayToUnorderedList(updateResult)}
                onClose={onRemove}
                className={catalogStyles.catalogServiceUpdateResult}
                action={
                    <>
                        <Button
                            className={errorAlertStyles.tryAgainBtnInAlertClass}
                            size='small'
                            type='primary'
                            onClick={retryRequest}
                            danger={true}
                        >
                            Try Again
                        </Button>
                        <Button size='small' type='primary' onClick={tryNewFile} danger={true}>
                            Try New File
                        </Button>
                    </>
                }
            />
        );
    }

    return <></>;
}

export default UpdateResult;
