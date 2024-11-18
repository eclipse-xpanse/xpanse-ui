/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React from 'react';
import { dummyTestUser } from '../../utils/constants.tsx';
import LayoutHeader from './LayoutHeader.tsx';

function NoAuthLayoutHeader(): React.JSX.Element {
    return <LayoutHeader userName={dummyTestUser} roles={['user', 'isv', 'csp', 'admin']} />;
}

export default NoAuthLayoutHeader;
