/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { RocketOutlined, SettingOutlined } from '@ant-design/icons';
import { Card, Divider } from 'antd';
import React from 'react';

function WelcomeCard(): React.JSX.Element {
    return (
        <>
            <Card title='Welcome to Xpanse' variant={'outlined'}>
                <RocketOutlined />{' '}
                <a href='https://eclipse.dev/xpanse' target='_blank' rel='noopener noreferrer'>
                    Getting started with Xpanse
                </a>
                <div>Learn the fundamentals about Xpanse and cloud providers supporting it.</div>
                <Divider />
                <SettingOutlined />{' '}
                <a href='https://eclipse.dev/xpanse/docs/api' target='_blank' rel='noopener noreferrer'>
                    Xpanse Service Description Language
                </a>
                <div>Use the Xpanse Service Description Language to describe portable managed services.</div>
            </Card>
        </>
    );
}

export default WelcomeCard;
