/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert } from 'antd';
import React from 'react';
import workflowStyles from '../../../styles/workflows.module.css';

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
        <div className={workflowStyles.workflowTip}>
            {' '}
            <Alert description={msg} type={type} onClose={onRemove} closable={true} showIcon={true} />{' '}
        </div>
    );
};
