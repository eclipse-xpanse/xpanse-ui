/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Button, Popover } from 'antd';
import React from 'react';
import oclDisplayStyles from '../../../../styles/ocl-display.module.css';

export function AgreementText({ eula }: { eula: string }): React.JSX.Element {
    return (
        <Popover
            content={<pre className={oclDisplayStyles.oclAgreementText}>{eula}</pre>}
            title={'Eula'}
            trigger='hover'
        >
            <Button className={oclDisplayStyles.oclDataHover} type={'link'}>
                {'terms and conditions'}
            </Button>
        </Popover>
    );
}
