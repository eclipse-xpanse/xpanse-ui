/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { CheckOutlined } from '@ant-design/icons';
import { List } from 'antd';
import React from 'react';
import flavorStyles from '../../../../styles/flavor.module.css';
import serviceModifyStyles from '../../../../styles/service-modify.module.css';
import { ServiceFlavor } from '../../../../xpanse-api/generated';

export const FlavorFeatures = (flavor: ServiceFlavor): React.JSX.Element => {
    return (
        <>
            <List
                className={flavorStyles.flavorFeaturesContent}
                size={'small'}
                split={false}
                itemLayout={'horizontal'}
                dataSource={flavor.features}
                renderItem={(item, _) => (
                    <List.Item className={flavorStyles.flavorFeatureItemName}>
                        <div>
                            <CheckOutlined className={serviceModifyStyles.flavorFeaturesItemIcon} />
                            &nbsp;{item}
                        </div>
                    </List.Item>
                )}
            />
        </>
    );
};
