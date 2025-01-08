/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { HistoryOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import React, { useState } from 'react';
import catalogStyles from '../../../../../styles/catalog.module.css';
import { ServiceTemplateDetailVo, ServiceTemplateRequestHistory } from '../../../../../xpanse-api/generated';
import ServiceTemplateHistoryTable from './ServiceTemplateHistoryTable';
import useServiceTemplateHistoryQuery from './useServiceTemplateHistoryQuery';

function ServiceTemplateHistory({
    serviceTemplateDetailVo,
}: {
    serviceTemplateDetailVo: ServiceTemplateDetailVo;
}): React.JSX.Element {
    const serviceTemplateHistoryQuery = useServiceTemplateHistoryQuery(
        serviceTemplateDetailVo.serviceTemplateId,
        undefined,
        undefined
    );
    const [isServiceTemplateHistoryModalOpen, setIsServiceTemplateHistoryModalOpen] = useState(false);

    let serviceTemplateRequestHistoryList: ServiceTemplateRequestHistory[] = [];
    if (serviceTemplateHistoryQuery.isSuccess) {
        serviceTemplateRequestHistoryList = serviceTemplateHistoryQuery.data;
    }

    const handleServiceTemplateHistoryOpenModal = () => {
        setIsServiceTemplateHistoryModalOpen(true);
    };

    const handleServiceTemplateHistoryModalClose = () => {
        setIsServiceTemplateHistoryModalOpen(false);
    };

    return (
        <div className={catalogStyles.updateUnpublishBtnClass}>
            {isServiceTemplateHistoryModalOpen && serviceTemplateRequestHistoryList.length > 0 ? (
                <Modal
                    title={'Service Template History'}
                    width={1600}
                    footer={null}
                    open={isServiceTemplateHistoryModalOpen}
                    onCancel={handleServiceTemplateHistoryModalClose}
                >
                    <ServiceTemplateHistoryTable data={serviceTemplateRequestHistoryList} />
                </Modal>
            ) : null}
            {serviceTemplateHistoryQuery.isSuccess && serviceTemplateHistoryQuery.data.length > 0 ? (
                <Button
                    icon={<HistoryOutlined />}
                    type='primary'
                    onClick={() => {
                        handleServiceTemplateHistoryOpenModal();
                    }}
                    className={catalogStyles.catalogManageBtnClass}
                >
                    History
                </Button>
            ) : null}
        </div>
    );
}

export default ServiceTemplateHistory;
