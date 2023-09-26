/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Layout } from 'antd';
import { footerText } from '../../utils/constants';
import '../../../styles/layout_header_footer.css';
import React from 'react';

function LayoutFooter(): React.JSX.Element {
    return <Layout.Footer className={'header-footer-class'}>{footerText}</Layout.Footer>;
}

export default LayoutFooter;
