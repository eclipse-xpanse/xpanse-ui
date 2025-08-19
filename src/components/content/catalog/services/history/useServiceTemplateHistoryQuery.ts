/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import {
    getServiceTemplateRequestHistoryForCsp,
    GetServiceTemplateRequestHistoryForCspData,
    getServiceTemplateRequestHistoryForIsv,
    GetServiceTemplateRequestHistoryForIsvData,
    Options,
    ServiceTemplateRequestStatus,
    ServiceTemplateRequestType,
} from '../../../../../xpanse-api/generated';
import { useCurrentUserRoleStore } from '../../../../layouts/header/useCurrentRoleStore';

export default function useServiceTemplateHistoryQuery(
    serviceTemplateId: string,
    requestStatus: ServiceTemplateRequestStatus | undefined,
    requestType: ServiceTemplateRequestType | undefined
) {
    return useQuery({
        queryKey: [
            'getServiceTemplateRequestHistoryByServiceTemplateId',
            serviceTemplateId,
            requestStatus,
            requestType,
        ],
        queryFn: async () => {
            if (useCurrentUserRoleStore.getState().currentUserRole === 'isv') {
                const request: Options<GetServiceTemplateRequestHistoryForIsvData> = {
                    path: {
                        serviceTemplateId: serviceTemplateId,
                    },
                    query: {
                        requestStatus: requestStatus,
                        requestType: requestType,
                    },
                };
                const response = await getServiceTemplateRequestHistoryForIsv(request);
                return response.data;
            } else if (useCurrentUserRoleStore.getState().currentUserRole === 'csp') {
                const request: Options<GetServiceTemplateRequestHistoryForCspData> = {
                    path: {
                        serviceTemplateId: serviceTemplateId,
                    },
                    query: {
                        requestStatus: requestStatus,
                        requestType: requestType,
                    },
                };
                const response = await getServiceTemplateRequestHistoryForCsp(request);
                return response.data;
            } else {
                throw new Error('The current user role does not allow access to service template history information.');
            }
        },
        refetchOnWindowFocus: false,
    });
}
