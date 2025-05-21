/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { MinusCircleOutlined } from '@ant-design/icons';
import { UseMutationResult } from '@tanstack/react-query';
import { Button, Popconfirm } from 'antd';
import React from 'react';
import catalogStyles from '../../../../../styles/catalog.module.css';
import {
    ServiceTemplateDetailVo,
    serviceTemplateRegistrationState,
    ServiceTemplateRequestInfo,
} from '../../../../../xpanse-api/generated';
import { ServiceTemplateAction } from '../details/serviceTemplateAction.tsx';

function UnpublishService({
    serviceDetail,
    setIsViewDisabled,
    unPublishRequest,
    setServiceTemplateAction,
}: {
    serviceDetail: ServiceTemplateDetailVo;
    setIsViewDisabled: (isViewDisabled: boolean) => void;
    unPublishRequest: UseMutationResult<ServiceTemplateRequestInfo, Error, void>;
    setServiceTemplateAction: (ServiceTemplateAction: ServiceTemplateAction) => void;
}): React.JSX.Element {
    const unpublish = () => {
        setIsViewDisabled(true);
        unPublishRequest.mutate();
        setServiceTemplateAction(ServiceTemplateAction.UNPUBLISH);
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
