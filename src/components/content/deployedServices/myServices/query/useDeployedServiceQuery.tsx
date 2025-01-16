/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import {
    category,
    csp,
    listDeployedServicesOfCsp,
    ListDeployedServicesOfCspData,
    listDeployedServicesOfIsv,
    type ListDeployedServicesOfIsvData,
} from '../../../../../xpanse-api/generated';
import { useCurrentUserRoleStore } from '../../../../layouts/header/useCurrentRoleStore';

export default function useDeployedServicesQuery(
    categoryName: category,
    cspName: csp,
    serviceName: string,
    serviceVersion: string
) {
    return useQuery({
        queryKey: ['listDeployedServices', categoryName, cspName, serviceName, serviceVersion],
        queryFn: () => {
            const data: ListDeployedServicesOfIsvData | ListDeployedServicesOfCspData = {
                categoryName: categoryName,
                cspName: cspName,
                serviceName: serviceName,
                serviceVersion: serviceVersion,
                serviceState: undefined,
            };
            if (useCurrentUserRoleStore.getState().currentUserRole === 'isv') {
                return listDeployedServicesOfIsv(data);
            } else if (useCurrentUserRoleStore.getState().currentUserRole === 'csp') {
                return listDeployedServicesOfCsp(data);
            } else {
                throw new Error('The current user role does not allow access to deployed service information.');
            }
        },
        refetchOnWindowFocus: false,
    });
}
