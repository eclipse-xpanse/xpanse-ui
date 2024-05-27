/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Layout } from 'antd';
import React from 'react';
import appStyles from '../../../styles/app.module.css';
import { footerText } from '../../utils/constants';

function LayoutFooter(): React.JSX.Element {
    return <Layout.Footer className={appStyles.antLayoutFooter}>{footerText}</Layout.Footer>;
}

export default LayoutFooter;
