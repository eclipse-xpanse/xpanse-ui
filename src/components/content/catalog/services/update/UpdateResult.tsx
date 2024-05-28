/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert, Button } from 'antd';
import React from 'react';
import catalogStyles from '../../../../../styles/catalog.module.css';
import { Ocl } from '../../../../../xpanse-api/generated';
import { convertStringArrayToUnorderedList } from '../../../../utils/generateUnorderedList';

function UpdateResult({
    ocl,
    updateRequestStatus,
    updateResult,
    onRemove,
}: {
    ocl: Ocl;
    updateRequestStatus: string;
    updateResult: string[];
    onRemove: () => void;
}): React.JSX.Element {
    if (updateRequestStatus === 'success') {
        return (
            <Alert
                type={'success'}
                message={
                    <>
                        Service <b>{ocl.name}</b> update request submitted successfully.
                    </>
                }
                closable={true}
                onClose={onRemove}
                className={catalogStyles.catalogServiceUpdateResult}
                description={convertStringArrayToUnorderedList(updateResult)}
            />
        );
    } else if (updateRequestStatus === 'error') {
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
                    <Button size='small' type='primary' onClick={onRemove} danger={true}>
                        Try Again
                    </Button>
                }
            />
        );
    }

    return <></>;
}

export default UpdateResult;
