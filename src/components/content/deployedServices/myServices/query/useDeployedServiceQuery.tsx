/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import {
    Category,
    Csp,
    getAllDeployedServicesByCsp,
    type GetAllDeployedServicesByCspData,
    getAllDeployedServicesByIsv,
    type GetAllDeployedServicesByIsvData,
} from '../../../../../xpanse-api/generated';
import { Options } from '../../../../../xpanse-api/generated/client';
import { useCurrentUserRoleStore } from '../../../../layouts/header/useCurrentRoleStore';

export default function useDeployedServicesQuery(
    categoryName: Category,
    cspName: Csp,
    serviceName: string,
    serviceVersion: string
) {
    return useQuery({
        queryKey: ['listDeployedServices', categoryName, cspName, serviceName, serviceVersion],
        queryFn: async () => {
            if (useCurrentUserRoleStore.getState().currentUserRole === 'isv') {
                const request: Options<GetAllDeployedServicesByIsvData> = {
                    query: {
                        categoryName: categoryName,
                        cspName: cspName,
                        serviceName: serviceName,
                        serviceVersion: serviceVersion,
                        serviceState: undefined,
                    },
                };
                const response = await getAllDeployedServicesByIsv(request);
                return response.data;
            } else if (useCurrentUserRoleStore.getState().currentUserRole === 'csp') {
                const request: Options<GetAllDeployedServicesByCspData> = {
                    query: {
                        categoryName: categoryName,
                        serviceName: serviceName,
                        serviceVersion: serviceVersion,
                        serviceState: undefined,
                    },
                };
                const response = await getAllDeployedServicesByCsp(request);
                return response.data;
            } else {
                throw new Error('The current user role does not allow access to deployed service information.');
            }
        },
        refetchOnWindowFocus: false,
    });
}
