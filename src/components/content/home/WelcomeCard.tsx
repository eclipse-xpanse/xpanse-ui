/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { RocketOutlined, SettingOutlined } from '@ant-design/icons';
import { Card, Divider } from 'antd';

function WelcomeCard(): JSX.Element {
    return (
        <>
            <Card title='Welcome to Xpanse' bordered={true}>
                <RocketOutlined />{' '}
                <a href='https://eclipse-xpanse.github.io/xpanse-website/'>Getting started with Xpanse</a>
                <div>Learn the fundamentals about Xpanse and cloud providers supporting it.</div>
                <Divider />
                <SettingOutlined />{' '}
                <a href='https://eclipse-xpanse.github.io/xpanse-website/docs/api'>
                    Xpanse Service Description Language
                </a>
                <div>Use the Xpanse Service Description Language to describe portable managed services.</div>
            </Card>
        </>
    );
}

export default WelcomeCard;
