/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import {
    category,
    csp,
    getAllDeployedServicesByCsp,
    getAllDeployedServicesByIsv,
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
            if (useCurrentUserRoleStore.getState().currentUserRole === 'isv') {
                return getAllDeployedServicesByIsv({
                    categoryName: categoryName,
                    cspName: cspName,
                    serviceName: serviceName,
                    serviceVersion: serviceVersion,
                    serviceState: undefined,
                });
            } else if (useCurrentUserRoleStore.getState().currentUserRole === 'csp') {
                return getAllDeployedServicesByCsp({
                    categoryName: categoryName,
                    serviceName: serviceName,
                    serviceVersion: serviceVersion,
                    serviceState: undefined,
                });
            } else {
                throw new Error('The current user role does not allow access to deployed service information.');
            }
        },
        refetchOnWindowFocus: false,
    });
}
