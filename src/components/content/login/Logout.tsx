/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { PoweroffOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useOidc } from '@axa-fr/react-oidc';
import React from 'react';
import { createServicePageRoute, homePageRoute, registerPageRoute } from '../../utils/constants';
function Logout(): React.JSX.Element {
    const { logout } = useOidc();

    function getRedirectUri() {
        if (window.location.pathname.startsWith(createServicePageRoute)) {
            // Create service URL contains dynamic url. So, redirect back to the home page.
            return homePageRoute;
        }
        if (window.location.pathname.startsWith(registerPageRoute)) {
            return registerPageRoute;
        }
        return window.location.href.replace(window.location.hash, '');
    }
    return (
        <Button
            type='link'
            onClick={() => void logout(getRedirectUri())}
            icon={<PoweroffOutlined />}
            block={true}
            size='small'
        >
            LogOut
        </Button>
    );
}
export default Logout;
