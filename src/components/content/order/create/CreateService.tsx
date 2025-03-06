/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQueryClient } from '@tanstack/react-query';
import { Skeleton } from 'antd';
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import catalogStyles from '../../../../styles/catalog.module.css';
import { category } from '../../../../xpanse-api/generated';
import { serviceAvailableErrorText } from '../../../utils/constants.tsx';
import RetryPrompt from '../../common/error/RetryPrompt.tsx';
import userOrderableServicesQuery, { getOrderableServicesQueryKey } from '../query/userOrderableServicesQuery';
import { SelectServiceForm } from './SelectServiceForm';

function CreateService(): React.JSX.Element {
    const queryClient = useQueryClient();
    const [urlParams] = useSearchParams();
    const serviceName = decodeURI(urlParams.get('serviceName') ?? '');
    const categoryName = location.hash.split('#')[1];
    const orderableServicesQuery = userOrderableServicesQuery(categoryName as category, serviceName);

    const retryRequest = () => {
        void queryClient.refetchQueries({
            queryKey: getOrderableServicesQueryKey(categoryName as category, serviceName),
        });
    };

    if (orderableServicesQuery.isSuccess) {
        return <SelectServiceForm services={orderableServicesQuery.data} />;
    }

    if (orderableServicesQuery.isError) {
        return (
            <RetryPrompt
                error={orderableServicesQuery.error}
                retryRequest={retryRequest}
                errorMessage={serviceAvailableErrorText}
            />
        );
    }

    if (orderableServicesQuery.isLoading || orderableServicesQuery.isFetching) {
        return (
            <Skeleton
                className={catalogStyles.catalogSkeleton}
                active={true}
                paragraph={{ rows: 2, width: ['20%', '20%'] }}
                title={{ width: '5%' }}
            />
        );
    }

    return <></>;
}

export default CreateService;
