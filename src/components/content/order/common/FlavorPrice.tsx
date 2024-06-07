/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Tag, Typography } from 'antd';
import React from 'react';
import flavorStyles from '../../../../styles/flavor.module.css';
import serviceModifyStyles from '../../../../styles/service-modify.module.css';
import { ServiceFlavor } from '../../../../xpanse-api/generated';
import { convertToFlavorMap, getMappedPeriod } from '../formDataHelpers/flavorHelper.ts';
import { ServiceFlavorWithPriceResult } from '../types/ServiceFlavorWithPrice.ts';
import { FlavorPriceRetry } from './FlavorPriceRetry.tsx';

export const FlavorPrice = ({
    flavor,
    isSuccess,
    priceData,
    isError,
    error,
    retryRequest,
}: {
    flavor: ServiceFlavor;
    isSuccess: boolean;
    priceData?: ServiceFlavorWithPriceResult[];
    isError: boolean;
    error: Error | null;
    retryRequest: () => void;
}): React.JSX.Element => {
    const { Text } = Typography;
    const flavorMap = convertToFlavorMap(priceData);
    return (
        <>
            {isSuccess ? (
                <div className={flavorStyles.flavorPriceContent}>
                    {flavor.name && flavorMap[flavor.name].price.successful ? (
                        <>
                            {flavorMap[flavor.name].price.recurringPrice ? (
                                <Tag color={'blue'} className={serviceModifyStyles.flavorPriceContent}>
                                    {flavorMap[flavor.name].price.recurringPrice?.cost
                                        .toString()
                                        .concat(' ')
                                        .concat(flavorMap[flavor.name].price.recurringPrice?.currency ?? '')
                                        .concat('/')
                                        .concat(
                                            getMappedPeriod(flavorMap[flavor.name].price.recurringPrice?.period ?? '')
                                        )}
                                </Tag>
                            ) : null}
                            {flavorMap[flavor.name].price.oneTimePaymentPrice ? (
                                <div className={flavorStyles.flavorOneTimePriceContent}>
                                    <Text type={'secondary'} className={flavorStyles.antTypography}>
                                        {flavorMap[flavor.name].price.oneTimePaymentPrice?.cost
                                            .toString()
                                            .concat(' ')
                                            .concat(flavorMap[flavor.name].price.oneTimePaymentPrice?.currency ?? '')
                                            .concat('/')
                                            .concat(
                                                getMappedPeriod(
                                                    flavorMap[flavor.name].price.oneTimePaymentPrice?.period ?? ''
                                                )
                                            )}
                                    </Text>
                                </div>
                            ) : null}
                        </>
                    ) : (
                        <>
                            <FlavorPriceRetry flavor={flavor} flavorMap={flavorMap} retryRequest={retryRequest} />
                        </>
                    )}
                </div>
            ) : null}
            {isError ? (
                <FlavorPriceRetry flavor={flavor} flavorMap={flavorMap} error={error} retryRequest={retryRequest} />
            ) : null}
        </>
    );
};
