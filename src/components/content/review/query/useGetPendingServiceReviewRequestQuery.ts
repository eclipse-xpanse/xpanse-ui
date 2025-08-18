/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import {
    getPendingServiceReviewRequests,
    GetPendingServiceReviewRequestsData,
    Options,
} from '../../../../xpanse-api/generated';

export default function useGetPendingServiceReviewRequestQuery(serviceTemplateId: string | undefined) {
    return useQuery({
        queryKey: ['getPendingServiceReviewRequests', serviceTemplateId],
        queryFn: async () => {
            const request: Options<GetPendingServiceReviewRequestsData> = {
                query: {
                    serviceTemplateId: serviceTemplateId,
                },
            };
            const response = await getPendingServiceReviewRequests(request);
            return response.data;
        },
        refetchOnWindowFocus: false,
    });
}
