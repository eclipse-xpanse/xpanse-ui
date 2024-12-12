/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React from 'react';
import serviceOrderStyles from '../../../../styles/service-order.module.css';

export const ShowIsv = ({ namespace }: { namespace: string }): React.JSX.Element => {
    return <span className={serviceOrderStyles.serviceIsvVendor}>Vendor - {namespace}</span>;
};
