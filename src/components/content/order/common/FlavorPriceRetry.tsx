/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { CloseCircleOutlined, InfoCircleOutlined, RedoOutlined } from '@ant-design/icons';
import { Button, Popover } from 'antd';
import React from 'react';
import flavorStyles from '../../../../styles/flavor.module.css';
import { ServiceFlavor } from '../../../../xpanse-api/generated';
import { convertStringArrayToUnorderedList } from '../../../utils/generateUnorderedList.tsx';
import { getServicePriceErrorDetails } from '../formDataHelpers/flavorHelper.ts';
import { ServiceFlavorWithPriceResult } from '../types/ServiceFlavorWithPrice.ts';

export const FlavorPriceRetry = ({
    flavor,
    flavorMap,
    error,
    retryRequest,
}: {
    flavor: ServiceFlavor;
    flavorMap: Record<string, ServiceFlavorWithPriceResult>;
    error?: Error | null;
    retryRequest: () => void;
}): React.JSX.Element => {
    return (
        <>
            {' '}
            <Popover
                content={convertStringArrayToUnorderedList(
                    error ? getServicePriceErrorDetails(error) : [flavorMap[flavor.name].price.errorMessage ?? '']
                )}
                title={
                    <>
                        <CloseCircleOutlined className={flavorStyles.flavorPriceErrorInfo} />
                        &nbsp;&nbsp;{'Error:'}
                    </>
                }
            >
                <Button size='small' type='text' danger={true} iconPosition={'end'} icon={<InfoCircleOutlined />}>
                    Price Unavailable
                </Button>
            </Popover>
            <Popover content={<>{'retry request'}</>} className={flavorStyles.flavorRetryPopover}>
                <RedoOutlined
                    className={`${flavorStyles.flavorPriceErrorInfo} ${flavorStyles.flavorPriceReload} ${flavorStyles.antPopoverInnerContent}`}
                    onClick={() => {
                        retryRequest();
                    }}
                />
            </Popover>
        </>
    );
};
