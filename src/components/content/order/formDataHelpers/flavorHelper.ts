/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import {
    ApiError,
    ErrorResponse,
    FlavorPriceResult,
    ServiceFlavor,
    UserOrderableServiceVo,
} from '../../../../xpanse-api/generated';
import { isErrorResponse } from '../../common/error/isErrorResponse';
import { ServiceFlavorWithPriceResult } from '../types/ServiceFlavorWithPrice.ts';

export function getServiceFlavorList(
    selectCsp: string,
    selectServiceHostingType: string,
    userOrderableServices: UserOrderableServiceVo[] | undefined
): ServiceFlavor[] {
    const flavorMapper: Map<string, ServiceFlavor[]> = new Map<string, ServiceFlavor[]>();
    if (userOrderableServices) {
        userOrderableServices.forEach((userOrderableServiceVo) => {
            if (
                userOrderableServiceVo.csp === selectCsp &&
                userOrderableServiceVo.serviceHostingType === selectServiceHostingType
            ) {
                flavorMapper.set(
                    userOrderableServiceVo.csp,
                    [...userOrderableServiceVo.flavors.serviceFlavors].sort((a, b) => a.priority - b.priority)
                );
            }
        });
    }

    return flavorMapper.get(selectCsp) ?? [];
}

export const getServicePriceErrorDetails = (error: Error) => {
    if (error instanceof ApiError && error.body && isErrorResponse(error.body)) {
        const response: ErrorResponse = error.body;
        return response.details;
    } else {
        return [error.message];
    }
};

const periodMapping: Record<string, string> = {
    yearly: 'year',
    monthly: 'month',
    daily: 'day',
    hourly: 'hour',
    oneTime: 'one time',
};

export const getMappedPeriod = (period: string): string => {
    return periodMapping[period] || 'unknown';
};

export const convertToFlavorMap = (
    serviceFlavorWithPriceList?: ServiceFlavorWithPriceResult[]
): Record<string, ServiceFlavorWithPriceResult> => {
    if (!serviceFlavorWithPriceList || serviceFlavorWithPriceList.length === 0) {
        return {};
    }
    return serviceFlavorWithPriceList.reduce<Record<string, ServiceFlavorWithPriceResult>>((map, flavor) => {
        map[flavor.name] = flavor;
        return map;
    }, {});
};

export const getFlavorWithPricesList = (
    priceResults: FlavorPriceResult[],
    flavorList?: ServiceFlavor[]
): ServiceFlavorWithPriceResult[] => {
    if (!flavorList || flavorList.length === 0) {
        return [];
    }

    return flavorList
        .map((flavor) => {
            const priceResult = priceResults.find((price) => flavor.name === price.flavorName);
            if (priceResult) {
                return {
                    ...flavor,
                    price: priceResult,
                };
            }
            return null;
        })
        .filter(Boolean) as ServiceFlavorWithPriceResult[];
};
