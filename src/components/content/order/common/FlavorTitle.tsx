/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React from 'react';
import flavorStyles from '../../../../styles/flavor.module.css';

export const FlavorTitle = ({ title }: { title: string }): React.JSX.Element => {
    return <span className={flavorStyles.flavorCardTitle}>{title}</span>;
};
