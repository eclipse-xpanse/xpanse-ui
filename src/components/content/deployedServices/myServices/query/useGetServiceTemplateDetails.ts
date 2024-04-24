/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { ServiceVendorService } from '../../../../../xpanse-api/generated';

export default function useGetServiceTemplateDetails(serviceTemplateId: string | undefined) {
    return useQuery({
        queryKey: ['getServiceTemplateDetails', serviceTemplateId],
        queryFn: () => ServiceVendorService.details(serviceTemplateId ?? ''),
        enabled: serviceTemplateId !== undefined && serviceTemplateId.length > 0,
    });
}
