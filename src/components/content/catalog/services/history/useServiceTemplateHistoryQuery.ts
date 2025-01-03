/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import {
    getServiceTemplateRequestHistoryByServiceTemplateId,
    GetServiceTemplateRequestHistoryByServiceTemplateIdData,
} from '../../../../../xpanse-api/generated';

export default function useServiceTemplateHistoryQuery(serviceTemplateId: string) {
    return useQuery({
        queryKey: ['getServiceTemplateRequestHistoryByServiceTemplateId', serviceTemplateId],
        queryFn: () => {
            const data: GetServiceTemplateRequestHistoryByServiceTemplateIdData = {
                serviceTemplateId: serviceTemplateId,
            };
            return getServiceTemplateRequestHistoryByServiceTemplateId(data);
        },
        refetchOnWindowFocus: false,
    });
}
