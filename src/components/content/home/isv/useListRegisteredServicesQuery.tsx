/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { ServiceVendorService } from '../../../../xpanse-api/generated';

export default function useListRegisteredServicesQuery() {
    return useQuery({
        queryKey: ['listRegisteredServicesByIsv'],
        queryFn: () => ServiceVendorService.listServiceTemplates(undefined, undefined, undefined, undefined, undefined),
        refetchOnWindowFocus: false,
    });
}
