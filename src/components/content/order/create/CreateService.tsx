/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Skeleton } from 'antd';
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import catalogStyles from '../../../../styles/catalog.module.css';
import { category } from '../../../../xpanse-api/generated';
import ServicesLoadingError from '../query/ServicesLoadingError';
import userOrderableServicesQuery from '../query/userOrderableServicesQuery';
import { SelectServiceForm } from './SelectServiceForm';

function CreateService(): React.JSX.Element {
    const [urlParams] = useSearchParams();
    const serviceName = decodeURI(urlParams.get('serviceName') ?? '');
    const categoryName = location.hash.split('#')[1];
    const orderableServicesQuery = userOrderableServicesQuery(categoryName as category, serviceName);

    if (orderableServicesQuery.isSuccess) {
        return <SelectServiceForm services={orderableServicesQuery.data} />;
    }

    if (orderableServicesQuery.isError) {
        return <ServicesLoadingError error={orderableServicesQuery.error} />;
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
