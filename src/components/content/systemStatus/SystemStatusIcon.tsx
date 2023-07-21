/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { CheckCircleTwoTone, CloseCircleTwoTone, LoadingOutlined } from '@ant-design/icons';

function SystemStatusIcon({
    isSystemUp,
    isStatusLoading,
}: {
    isSystemUp: boolean;
    isStatusLoading: boolean;
}): JSX.Element {
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
