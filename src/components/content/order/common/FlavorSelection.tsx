/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Flex, Form, Radio } from 'antd';
import React from 'react';
import flavorStyles from '../../../../styles/flavor.module.css';
import serviceOrderStyles from '../../../../styles/service-order.module.css';
import { ServiceFlavor } from '../../../../xpanse-api/generated';
import { FlavorFeatures } from './FlavorFeatures';
import { FlavorPrice } from './FlavorPrice';
import { FlavorTitle } from './FlavorTitle';

export const FlavorSelection = ({
    selectFlavor,
    flavorList,
    onChangeFlavor,
}: {
    selectFlavor: string;
    flavorList?: ServiceFlavor[];
    onChangeFlavor?: (newFlavor: string) => void;
}): React.JSX.Element => {
    return (
        <>
            <div
                className={`${serviceOrderStyles.orderFormSelectionStyle} ${flavorStyles.regionFlavorContent} ${serviceOrderStyles.orderFormItemName}`}
            >
                <Form.Item
                    name='selectFlavor'
                    label='Flavor'
                    rules={[{ required: true, message: 'Flavor is required' }]}
                >
                    {flavorList && flavorList.length > 0 ? (
                        <Flex vertical gap='middle'>
                            <Radio.Group
                                optionType={'button'}
                                onChange={(e) => {
                                    if (onChangeFlavor) {
                                        onChangeFlavor(e.target.value as string);
                                    }
                                }}
                                value={selectFlavor}
                                className={flavorStyles.antRadioGroup}
                            >
                                {flavorList.map((flavor: ServiceFlavor) => (
                                    <div key={flavor.name} className={flavorStyles.customRadioButton}>
                                        <Radio.Button
                                            key={flavor.name}
                                            value={flavor.name}
                                            className={flavorStyles.customRadioButtonContent}
                                        >
                                            {FlavorTitle(flavor.name)}
                                            <div className={flavorStyles.flavorPriceContent}>{FlavorPrice()}</div>
                                            {FlavorFeatures(flavor)}
                                        </Radio.Button>
                                    </div>
                                ))}
                            </Radio.Group>
                        </Flex>
                    ) : null}
                </Form.Item>
            </div>
        </>
    );
};
