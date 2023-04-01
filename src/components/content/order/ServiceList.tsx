/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */
import React, { useEffect, useState } from 'react';
import { Button, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ServiceVo } from '../../../xpanse-api/generated';
import { serviceApi } from '../../../xpanse-api/xpanseRestApiClient';
import { ColumnFilterItem } from 'antd/es/table/interface';
import { CloseCircleOutlined, CopyOutlined, SyncOutlined } from '@ant-design/icons';
import '../../../styles/service_instance_list.css';
import { sortVersionNum } from '../../utils/Sort';

function ServiceList(): JSX.Element {
    const [serviceVoList, setServiceVoList] = useState<ServiceVo[]>([]);
    const [versionFilters, setVersionFilters] = useState<ColumnFilterItem[]>([]);
    const [nameFilters, setNameFilters] = useState<ColumnFilterItem[]>([]);
    const [categoryFilters, setCategoryFilters] = useState<ColumnFilterItem[]>([]);
    const [cspFilters, setCspFilters] = useState<ColumnFilterItem[]>([]);

    const columns: ColumnsType<ServiceVo> = [
        {
            title: 'Id',
            dataIndex: 'id',
        },
        {
            title: 'Category',
            dataIndex: 'category',
            filters: categoryFilters,
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value: string | number | boolean, record) => record.category.startsWith(value.toString()),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            filters: nameFilters,
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value: string | number | boolean, record) => record.name.startsWith(value.toString()),
        },
        {
            title: 'Version',
            dataIndex: 'version',
            filters: versionFilters,
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value: string | number | boolean, record) => record.version.startsWith(value.toString()),
            sorter: (service1, service2) => sortVersionNum(service1.version, service2.version),
        },
        {
            title: 'Csp',
            dataIndex: 'csp',
            filters: cspFilters,
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value: string | number | boolean, record) => record.csp.startsWith(value.toString()),
        },
        {
            title: 'Flavor',
            dataIndex: 'flavor',
        },
        {
            title: 'ServiceState',
            dataIndex: 'serviceState',
        },
        {
            title: 'Operation',
            dataIndex: 'operation',
            render: () => (
                <Space size='middle'>
                    <Button type='primary' icon={<CopyOutlined />}>
                        migrate
                    </Button>
                    <Button type='primary' icon={<CloseCircleOutlined />}>
                        destroy
                    </Button>
                </Space>
            ),
        },
    ];

    function updateCspFilters(resp: ServiceVo[]): void {
        const filters: ColumnFilterItem[] = [];
        const cspSet = new Set<string>('');
        resp.forEach((v) => {
            cspSet.add(v.csp);
        });
        cspSet.forEach((csp) => {
            const filter = {
                text: csp,
                value: csp,
            };
            filters.push(filter);
        });
        setCspFilters(filters);
    }
    function updateCategoryFilters(resp: ServiceVo[]): void {
        const filters: ColumnFilterItem[] = [];
        const categorySet = new Set<string>('');
        resp.forEach((v) => {
            categorySet.add(v.category);
        });
        categorySet.forEach((category) => {
            const filter = {
                text: category,
                value: category,
            };
            filters.push(filter);
        });
        setCategoryFilters(filters);
    }

    function updateVersionFilters(resp: ServiceVo[]): void {
        const filters: ColumnFilterItem[] = [];
        const versionSet = new Set<string>('');
        resp.forEach((v) => {
            versionSet.add(v.version);
        });
        versionSet.forEach((version) => {
            const filter = {
                text: version,
                value: version,
            };
            filters.push(filter);
        });
        setVersionFilters(filters);
    }

    function updateNameFilters(resp: ServiceVo[]): void {
        const filters: ColumnFilterItem[] = [];
        const nameSet = new Set<string>('');
        resp.forEach((v) => {
            nameSet.add(v.name);
        });
        nameSet.forEach((name) => {
            const filter = {
                text: name,
                value: name,
            };
            filters.push(filter);
        });
        setNameFilters(filters);
    }

    function getServices(): void {
        void serviceApi.services().then((resp) => {
            const serviceList: ServiceVo[] = [];
            if (resp.length > 0) {
                setServiceVoList(resp);
                updateVersionFilters(resp);
                updateNameFilters(resp);
                updateCategoryFilters(resp);
                updateCspFilters(resp);
            } else {
                setServiceVoList(serviceList);
            }
        });
    }

    useEffect(() => {
        getServices();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function refreshData(): void {
        getServices();
    }

    return (
        <div className={'services-content'}>
            <div>
                <Button
                    type='primary'
                    icon={<SyncOutlined />}
                    onClick={() => {
                        refreshData();
                    }}
                >
                    refresh
                </Button>
            </div>
            <div className={'service-instance-list'}>
                <Table columns={columns} dataSource={serviceVoList} />
            </div>
        </div>
    );
}

export default ServiceList;
