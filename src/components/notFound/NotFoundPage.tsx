/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Button, Result } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { homePageRoute } from '../utils/constants';

export default function NotFoundPage(): React.JSX.Element {
    const navigate = useNavigate();
    const backHome = () => {
        void navigate(homePageRoute);
    };

    return (
        <>
            <Result
                status='404'
                title='404'
                subTitle='Sorry, the page you visited does not exist.'
                extra={
                    <Button type='primary' onClick={backHome}>
                        Back Home
                    </Button>
                }
            />
        </>
    );
}
