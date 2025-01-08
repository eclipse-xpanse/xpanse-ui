/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import {
    getServiceTemplateRequestHistoryByServiceTemplateId,
    GetServiceTemplateRequestHistoryByServiceTemplateIdData,
} from '../../../../../xpanse-api/generated';

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
            const data: GetServiceTemplateRequestHistoryByServiceTemplateIdData = {
                serviceTemplateId: serviceTemplateId,
                requestStatus: requestStatus,
                requestType: requestType,
            };
            return getServiceTemplateRequestHistoryByServiceTemplateId(data);
        },
        refetchOnWindowFocus: false,
    });
}
