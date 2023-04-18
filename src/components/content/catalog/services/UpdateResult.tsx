/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert, Button } from 'antd';
import { Ocl } from '../../../../xpanse-api/generated';
import { ValidationStatus } from '../../register/ValidationStatus';
import { convertStringArrayToUnorderedList } from '../../../utils/generateUnorderedList';

function UpdateResult({
    ocl,
    updateRequestStatus,
    updateResult,
    onRemove,
}: {
    ocl: Ocl;
    updateRequestStatus: ValidationStatus;
    updateResult: string[];
    onRemove: () => void;
}): JSX.Element {
    if (updateRequestStatus === 'completed') {
        return (
            <Alert
                type={'success'}
                message={`Service ${ocl.name} Updated Successfully`}
                closable={true}
                onClose={onRemove}
                className={'result'}
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

export default UpdateResult;
