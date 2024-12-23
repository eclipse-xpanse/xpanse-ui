/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { MinusCircleOutlined } from '@ant-design/icons';
import { Button, Popconfirm } from 'antd';
import React from 'react';
import catalogStyles from '../../../../../styles/catalog.module.css';
import { serviceTemplateRegistrationState } from '../../../../../xpanse-api/generated';
import { useUnpublishRequest } from './UnpublishMutation.ts';

function UnpublishService({
    id,
    setIsViewDisabled,
    serviceRegistrationStatus,
    isAvailableInCatalog,
}: {
    id: string;
    setIsViewDisabled: (isViewDisabled: boolean) => void;
    serviceRegistrationStatus: serviceTemplateRegistrationState;
    isAvailableInCatalog: boolean;
}): React.JSX.Element {
    const unpublishRequest = useUnpublishRequest(id);

    const unpublish = () => {
        setIsViewDisabled(true);
        unpublishRequest.mutate();
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
                        unpublishRequest.isSuccess ||
                        serviceRegistrationStatus !== serviceTemplateRegistrationState.APPROVED ||
                        !isAvailableInCatalog
                    }
                >
                    Unpublish
                </Button>
            </Popconfirm>
        </div>
    );
}

export default UnpublishService;
