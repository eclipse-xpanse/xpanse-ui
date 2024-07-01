/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { LoadingOutlined } from '@ant-design/icons';
import { UseQueryResult } from '@tanstack/react-query';
import { Flex, Form, Radio, Spin } from 'antd';
import React from 'react';
import flavorStyles from '../../../../styles/flavor.module.css';
import serviceOrderStyles from '../../../../styles/service-order.module.css';
import { ServiceFlavor } from '../../../../xpanse-api/generated';
import { ServiceFlavorWithPriceResult } from '../types/ServiceFlavorWithPrice';
import { FlavorFeatures } from './FlavorFeatures.tsx';
import { FlavorPrice } from './FlavorPrice';
import { FlavorTitle } from './FlavorTitle';

export const FlavorSelection = ({
    selectFlavor,
    flavorList,
    onChangeFlavor,
    getServicePriceQuery,
}: {
    selectFlavor: string;
    flavorList?: ServiceFlavor[];
    onChangeFlavor?: (newFlavor: string) => void;
    getServicePriceQuery: UseQueryResult<ServiceFlavorWithPriceResult[]>;
}): React.JSX.Element => {
    const retryRequest = () => {
        void getServicePriceQuery.refetch();
    };

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
                                            <FlavorTitle title={flavor.name} />
                                            {getServicePriceQuery.isLoading || getServicePriceQuery.isFetching ? (
                                                <div className={flavorStyles.flavorSkeleton}>
                                                    <Spin
                                                        indicator={
                                                            <LoadingOutlined
                                                                className={flavorStyles.flavorPriceLoading}
                                                                spin
                                                            />
                                                        }
                                                    />
                                                </div>
                                            ) : (
                                                <FlavorPrice
                                                    flavor={flavor}
                                                    isSuccess={getServicePriceQuery.isSuccess}
                                                    priceData={getServicePriceQuery.data}
                                                    isError={getServicePriceQuery.isError}
                                                    error={getServicePriceQuery.error}
                                                    retryRequest={retryRequest}
                                                />
                                            )}
                                            <FlavorFeatures flavor={flavor} />
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
