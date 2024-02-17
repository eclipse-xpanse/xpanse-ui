/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { CheckCircleTwoTone, CloseCircleTwoTone, LoadingOutlined } from '@ant-design/icons';
import React from 'react';

function SystemStatusIcon({
    isSystemUp,
    isStatusLoading,
}: {
    isSystemUp: boolean;
    isStatusLoading: boolean;
}): React.JSX.Element {
    if (isStatusLoading) {
        return <LoadingOutlined spin />;
    }
    if (isSystemUp) {
        return <CheckCircleTwoTone twoToneColor='#52c41a' />;
    } else {
        return <CloseCircleTwoTone twoToneColor='#eb2f38' />;
    }
}

export default SystemStatusIcon;
