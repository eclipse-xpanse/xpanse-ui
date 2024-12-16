/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { getPendingServiceReviewRequests, GetPendingServiceReviewRequestsData } from '../../../../xpanse-api/generated';

export default function useGetPendingServiceReviewRequestQuery(serviceTemplateId: string | undefined) {
    return useQuery({
        queryKey: ['getPendingServiceReviewRequests', serviceTemplateId],
        queryFn: () => {
            const data: GetPendingServiceReviewRequestsData = {
                serviceTemplateId: serviceTemplateId,
            };
            return getPendingServiceReviewRequests(data);
        },
        refetchOnWindowFocus: false,
    });
}
