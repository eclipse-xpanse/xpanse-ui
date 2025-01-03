/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert, Skeleton } from 'antd';
import React from 'react';
import DisplayOclData from '../../../common/ocl/DisplayOclData';
import useRequestedServiceTemplateQuery from './useRequestedServiceTemplateQuery';

function ServiceTemplateRequested({ requestId }: { requestId: string }): React.JSX.Element {
    const requestedServiceTemplateQuery = useRequestedServiceTemplateQuery(requestId);

    return (
        <div>
            {requestedServiceTemplateQuery.isLoading ? (
                <Skeleton active />
            ) : requestedServiceTemplateQuery.isSuccess ? (
                <DisplayOclData ocl={requestedServiceTemplateQuery.data} />
            ) : requestedServiceTemplateQuery.isError ? (
                <Alert
                    message='Error'
                    description={requestedServiceTemplateQuery.error.message}
                    type='error'
                    showIcon
                    closable
                />
            ) : null}
        </div>
    );
}

export default ServiceTemplateRequested;
