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
} from '../../../../../xpanse-api/generated';
import { useCurrentUserRoleStore } from '../../../../layouts/header/useCurrentRoleStore';

export default function useServiceTemplateHistoryQuery(
    serviceTemplateId: string,
    requestStatus: 'in-review' | 'accepted' | 'rejected' | 'cancelled' | undefined,
    requestType: 'register' | 'update' | 'unpublish' | 'republish' | undefined
) {
    return useQuery({
        queryKey: [
            'getServiceTemplateRequestHistoryByServiceTemplateId',
            serviceTemplateId,
            requestStatus,
            requestType,
        ],
        queryFn: () => {
            const data: GetServiceTemplateRequestHistoryForIsvData | GetServiceTemplateRequestHistoryForCspData = {
                serviceTemplateId: serviceTemplateId,
                requestStatus: requestStatus,
                requestType: requestType,
            };
            if (useCurrentUserRoleStore.getState().currentUserRole === 'isv') {
                return getServiceTemplateRequestHistoryForIsv(data);
            } else if (useCurrentUserRoleStore.getState().currentUserRole === 'csp') {
                return getServiceTemplateRequestHistoryForCsp(data);
            } else {
                throw new Error('The current user role does not allow access to service template history information.');
            }
        },
        refetchOnWindowFocus: false,
    });
}
