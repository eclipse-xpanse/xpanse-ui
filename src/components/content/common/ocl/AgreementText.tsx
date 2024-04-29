/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React from 'react';
import { Button, Popover } from 'antd';

export function AgreementText({ eula }: { eula: string }): React.JSX.Element {
    return (
        <Popover content={<pre className={'agreement-text'}>{eula}</pre>} title={'Eula'} trigger='hover'>
            <Button className={'ocl-data-hover'} type={'link'}>
                {'terms and conditions'}
            </Button>
        </Popover>
    );
}
