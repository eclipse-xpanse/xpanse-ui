/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert } from 'antd';
import React, { useState } from 'react';
import credentialStyles from '../../../styles/credential.module.css';

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
        <div className={credentialStyles.credentialTip}>
            {' '}
            <Alert description={msg} type={type} onClose={onRemoveAlert} closable={true} />{' '}
        </div>
    );
};
