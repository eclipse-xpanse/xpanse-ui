/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert } from 'antd';
import React from 'react';

export const WorkflowsTip = ({
    type,
    msg,
    onRemove,
}: {
    type: 'error' | 'success' | undefined;
    msg: string;
    onRemove: () => void;
}): React.JSX.Element => {
    if (!type) {
        return <></>;
    }

    return (
        <div className={'credential-tip'}>
            {' '}
            <Alert description={msg} type={type} onClose={onRemove} closable={true} />{' '}
        </div>
    );
};
