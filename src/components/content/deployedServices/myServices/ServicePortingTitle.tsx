/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React from 'react';
import appStyles from '../../../../styles/app.module.css';
import tableStyles from '../../../../styles/table.module.css';
import { DeployedService } from '../../../../xpanse-api/generated';

export const ServicePortingTitle = ({ record }: { record: DeployedService }): React.JSX.Element => {
    return (
        <div className={tableStyles.genericTableContainer}>
            <div className={appStyles.contentTitle}>
                Service: {record.name}@{record.version}
            </div>
        </div>
    );
};
