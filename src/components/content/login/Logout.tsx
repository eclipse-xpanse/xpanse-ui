/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { PoweroffOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useOidc } from '@axa-fr/react-oidc';
function Logout(): JSX.Element {
    const { logout } = useOidc();
    return (
        <Button
            type='link'
            onClick={() => void logout(window.location.href.replace(window.location.hash, ''))}
            icon={<PoweroffOutlined />}
            block={true}
            size='small'
        >
            LogOut
        </Button>
    );
}
export default Logout;
