/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { InfoCircleOutlined } from '@ant-design/icons';
import { Alert, Button, Modal, Skeleton, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { useState } from 'react';
import catalogStyles from '../../../../../styles/catalog.module.css';
import { ServiceTemplateRequestHistory } from '../../../../../xpanse-api/generated';
import { isHandleKnownErrorResponse } from '../../../common/error/isHandleKnownErrorResponse';
import DisplayOclData from '../../../common/ocl/DisplayOclData';
import useRequestedServiceTemplateQuery from './useRequestedServiceTemplateQuery';

function ServiceTemplateHistoryTable({ data }: { data: ServiceTemplateRequestHistory[] }): React.JSX.Element {
    const [isRequestedServiceTemplateQuery, setIsRequestedServiceTemplateQuery] = useState<boolean>(false);
    const [serviceTemplateRequestId, setServiceTemplateRequestHistoryId] = useState<string | undefined>(undefined);
    const requestedServiceTemplateQuery = useRequestedServiceTemplateQuery(serviceTemplateRequestId);

    const columns: ColumnsType<ServiceTemplateRequestHistory> = [
        {
            title: 'RequestId',
            dataIndex: 'requestId',
            align: 'center',
        },
        {
            title: 'RequestType',
            dataIndex: 'requestType',
            align: 'center',
            render: (_text, record) => {
                if (record.requestType === 'register') {
                    return <Tag color='default'>{record.requestType}</Tag>;
                } else if (record.requestType === 'republish') {
                    return <Tag color='success'>{record.requestType}</Tag>;
                } else if (record.requestType === 'unpublish') {
                    return <Tag color='error'>{record.requestType}</Tag>;
                } else {
                    return <Tag color='processing'>{record.requestType}</Tag>;
                }
            },
        },
        {
            title: 'RequestStatus',
            dataIndex: 'requestStatus',
            align: 'center',
            render: (_text, record) => {
                if (record.requestStatus === 'in-review') {
                    return <Tag color='#ffa366'>{record.requestStatus}</Tag>;
                } else if (record.requestStatus === 'accepted') {
                    return <Tag color='#87d068'>{record.requestStatus}</Tag>;
                } else if (record.requestStatus === 'rejected') {
                    return <Tag color='#ff6666'>{record.requestStatus}</Tag>;
                } else {
                    return <Tag color='default'>{record.requestStatus}</Tag>;
                }
            },
        },
        {
            title: 'ReviewComment',
            dataIndex: 'reviewComment',
            align: 'center',
        },
        {
            title: 'CreatedTime',
            dataIndex: 'createTime',
            align: 'center',
        },
        {
            title: 'LastModifiedTime',
            dataIndex: 'lastModifiedTime',
            align: 'center',
        },
        {
            title: 'Service Template',
            dataIndex: 'service template',
            render: (_text: string, record) => {
                return (
                    <>
                        <Button
                            type='primary'
                            icon={<InfoCircleOutlined />}
                            onClick={() => {
                                handleRequestedServiceTemplateOpenModal(record);
                            }}
                        >
                            request template
                        </Button>
                    </>
                );
            },
            align: 'center',
        },
    ];

    const handleRequestedServiceTemplateOpenModal = (record: ServiceTemplateRequestHistory) => {
        setIsRequestedServiceTemplateQuery(true);
        setServiceTemplateRequestHistoryId(record.requestId);
    };

    const handleRequestedServiceTemplateModalClose = () => {
        setIsRequestedServiceTemplateQuery(false);
        setServiceTemplateRequestHistoryId(undefined);
    };

    return (
        <div>
            {requestedServiceTemplateQuery.isLoading ? (
                <Modal
                    title={'Requested Service Template'}
                    width={1600}
                    footer={null}
                    open={isRequestedServiceTemplateQuery}
                    onCancel={handleRequestedServiceTemplateModalClose}
                >
                    <Skeleton active />
                </Modal>
            ) : requestedServiceTemplateQuery.isSuccess ? (
                <Modal
                    title={'Requested Service Template'}
                    width={1600}
                    footer={null}
                    open={isRequestedServiceTemplateQuery}
                    onCancel={handleRequestedServiceTemplateModalClose}
                >
                    <DisplayOclData ocl={requestedServiceTemplateQuery.data} />
                </Modal>
            ) : requestedServiceTemplateQuery.isError ? (
                <div className={catalogStyles.requestedServiceTemplateHistoryError}>
                    {isHandleKnownErrorResponse(requestedServiceTemplateQuery.error) ? (
                        <Alert
                            message={
                                <>
                                    Request Service Template with requestId <strong>{serviceTemplateRequestId}</strong>{' '}
                                    error
                                </>
                            }
                            description={String(requestedServiceTemplateQuery.error.body.details)}
                            showIcon
                            type={'error'}
                            closable={true}
                            onClose={handleRequestedServiceTemplateModalClose}
                        />
                    ) : (
                        <Alert
                            message={
                                <>
                                    Request Service Template with requestId <strong>{serviceTemplateRequestId}</strong>{' '}
                                    error
                                </>
                            }
                            description={requestedServiceTemplateQuery.error.message}
                            showIcon
                            type={'error'}
                            closable={true}
                            onClose={handleRequestedServiceTemplateModalClose}
                        />
                    )}
                </div>
            ) : null}

            <Table columns={columns} dataSource={data} rowKey={'id'} />
        </div>
    );
}

export default ServiceTemplateHistoryTable;
