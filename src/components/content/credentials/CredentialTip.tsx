/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert } from 'antd';
import React, { useState } from 'react';

export const CredentialTip = ({
    type,
    msg,
    onRemove,
}: {
    type: 'error' | 'success' | undefined;
    msg: string;
    onRemove: () => void;
}): React.JSX.Element => {
    const [isAlertVisible, setIsAlertVisible] = useState<boolean>(true);

    function onRemoveAlert() {
        setIsAlertVisible(false);
        onRemove();
    }
    if (!type || !isAlertVisible) {
        return <></>;
    }

    return (
        <div className={'credential-tip'}>
            {' '}
            <Alert description={msg} type={type} onClose={onRemoveAlert} closable={true} />{' '}
        </div>
    );
};
