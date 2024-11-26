/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { AlertTwoTone, LoadingOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Modal, Space } from 'antd';
import { SearchProps } from 'antd/lib/input';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import appStyles from '../../../styles/app.module.css';
import searchServiceStyle from '../../../styles/search-services.module.css';
import { category } from '../../../xpanse-api/generated';
import { groupServicesByLatestVersion } from '../../content/order/common/utils/groupServicesByLatestVersion.ts';
import userOrderableServicesQuery from '../../content/order/query/userOrderableServicesQuery.ts';
import { UserServiceLatestVersionDisplayType } from '../../content/order/services/UserServiceLatestVersionDisplayType.ts';
import { createServicePageRoute } from '../../utils/constants.tsx';

export function SearchServices() {
    const navigate = useNavigate();
    const orderableServicesQuery = userOrderableServicesQuery(undefined, undefined);
    const [isSearchClicked, setIsSearchClicked] = useState<boolean>(false);
    const [searchText, setSearchText] = useState<string>('');
    const { Search } = Input;
    const onSelectService = function (serviceName: string, latestVersion: string, category: category) {
        setIsSearchClicked(false);
        setSearchText('');
        void navigate(
            createServicePageRoute
                .concat('?serviceName=', serviceName)
                .concat('&latestVersion=', latestVersion.replace(' ', ''))
                .concat('#', category)
        );
    };

    const onSearch: SearchProps['onSearch'] = (value, _e, _info) => {
        setSearchText(value);
    };

    const filteredServices: UserServiceLatestVersionDisplayType[] = useMemo(() => {
        let serviceList: UserServiceLatestVersionDisplayType[] = [];
        if (orderableServicesQuery.data && searchText) {
            serviceList = groupServicesByLatestVersion(orderableServicesQuery.data, searchText);
        }
        return serviceList;
    }, [orderableServicesQuery.data, searchText]);

    const retryRequest = () => {
        void orderableServicesQuery.refetch();
    };

    return (
        <>
            <Modal
                title='Search Services'
                width={1000}
                open={isSearchClicked}
                onCancel={() => {
                    setIsSearchClicked(false);
                    setSearchText('');
                }}
                footer={null}
            >
                <Search
                    loading={false}
                    onSearch={onSearch}
                    value={searchText}
                    onChange={(e) => {
                        setSearchText(e.target.value);
                    }}
                />
                {searchText.length > 0 ? (
                    filteredServices.length > 0 ? (
                        filteredServices.map((service) => {
                            return (
                                <div key={service.name}>
                                    <Button
                                        onClick={() => {
                                            onSelectService(service.name, service.latestVersion, service.category);
                                        }}
                                        type={'link'}
                                        className={searchServiceStyle.searchResults}
                                    >
                                        {service.name}
                                    </Button>
                                    <Space>{service.content}</Space>
                                </div>
                            );
                        })
                    ) : orderableServicesQuery.isError ? (
                        <div className={searchServiceStyle.searchErrorBlock}>
                            <AlertTwoTone twoToneColor='#eb2f96' className={searchServiceStyle.searchErrorIcon} />
                            <div className={searchServiceStyle.searchResults}>
                                {'Error loading services - ' + orderableServicesQuery.error.toString()}
                            </div>
                            <Button
                                type={'link'}
                                onClick={retryRequest}
                                className={searchServiceStyle.searchErrorRetryButton}
                            >
                                retry
                            </Button>
                        </div>
                    ) : orderableServicesQuery.isLoading ? (
                        <div className={searchServiceStyle.searchServicesLoading}>
                            <div className={searchServiceStyle.searchResults}>{'Loading Services'}</div>
                            <LoadingOutlined spin className={searchServiceStyle.searchLoadingIcon} />
                        </div>
                    ) : (
                        <p className={searchServiceStyle.searchServicesNoMatchFound}>
                            Your search <span className={searchServiceStyle.searchTextColor}>{searchText}</span> did not
                            match any service names
                        </p>
                    )
                ) : undefined}
            </Modal>
            <Button
                className={appStyles.headerMenuButton}
                icon={<SearchOutlined />}
                onClick={() => {
                    setIsSearchClicked(true);
                }}
            >
                Search Services
            </Button>
        </>
    );
}
