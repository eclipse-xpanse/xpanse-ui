/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import {
    getAllDeployedServicesWithDetails,
    type GetAllDeployedServicesWithDetailsData,
} from '../../../../../xpanse-api/generated';

export default function useListDeployedServicesDetailsQuery() {
    return useQuery({
        queryKey: getListDeployedServicesDetailsQueryKey(),
        queryFn: () => {
            const data: GetAllDeployedServicesWithDetailsData = {
                categoryName: undefined,
                cspName: undefined,
                serviceName: undefined,
                serviceVersion: undefined,
                serviceState: undefined,
            };
            return getAllDeployedServicesWithDetails(data);
        },
        refetchOnWindowFocus: false,
    });
}

export function getListDeployedServicesDetailsQueryKey(): string[] {
    return ['listDeployedServicesDetails'];
}
