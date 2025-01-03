/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { MinusCircleOutlined } from '@ant-design/icons';
import { UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { Button, Popconfirm } from 'antd';
import React from 'react';
import catalogStyles from '../../../../../styles/catalog.module.css';
import {
    category,
    ServiceTemplateDetailVo,
    serviceTemplateRegistrationState,
    ServiceTemplateRequestInfo,
} from '../../../../../xpanse-api/generated';
import { getQueryKey } from '../query/useAvailableServiceTemplatesQuery';

function UnpublishService({
    category,
    serviceDetail,
    setIsViewDisabled,
    unPublishRequest,
}: {
    category: category;
    serviceDetail: ServiceTemplateDetailVo;
    setIsViewDisabled: (isViewDisabled: boolean) => void;
    unPublishRequest: UseMutationResult<ServiceTemplateRequestInfo, Error, void>;
}): React.JSX.Element {
    const queryClient = useQueryClient();
    const unpublish = () => {
        setIsViewDisabled(true);
        unPublishRequest.mutate(undefined, {
            onSuccess: () => {
                void queryClient.invalidateQueries({ queryKey: getQueryKey(category) });
            },
            onSettled: () => {
                setIsViewDisabled(false);
            },
        });
    };

    return (
        <div className={catalogStyles.updateUnpublishBtnClass}>
            <Popconfirm
                title='Unpublish the service'
                description='Are you sure to unpublish this service?'
                cancelText='Yes'
                okText='No'
                onCancel={() => {
                    unpublish();
                }}
            >
                <Button
                    icon={<MinusCircleOutlined />}
                    type='primary'
                    className={catalogStyles.catalogManageBtnClass}
                    disabled={
                        unPublishRequest.isSuccess ||
                        serviceDetail.serviceTemplateRegistrationState !== serviceTemplateRegistrationState.APPROVED ||
                        !serviceDetail.isAvailableInCatalog
                    }
                >
                    Unpublish
                </Button>
            </Popconfirm>
        </div>
    );
}

export default UnpublishService;
