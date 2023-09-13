/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import { homePageRoute } from '../utils/constants';

export const NotFoundPage = (): React.JSX.Element => {
    const navigate = useNavigate();
    const backHome = () => {
        navigate(homePageRoute);
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
};
