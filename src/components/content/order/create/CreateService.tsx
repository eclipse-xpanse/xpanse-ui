/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React, { useEffect, useRef, useState } from 'react';
import { To, useLocation, useSearchParams } from 'react-router-dom';
import { Billing, UserOrderableServiceVo } from '../../../../xpanse-api/generated';
import NavigateOrderSubmission from './NavigateOrderSubmission';
import CspSelect from '../formElements/CspSelect';
import GoToSubmit from '../formElements/GoToSubmit';
import { Select, Skeleton, Space, Tabs } from 'antd';
import { Tab } from 'rc-tabs/lib/interface';
import { currencyMapper } from '../../../utils/currency';
import { servicesSubPageRoute } from '../../../utils/constants';
import { OrderSubmitProps } from './OrderSubmit';
import ServicesLoadingError from '../query/ServicesLoadingError';
import userOrderableServicesQuery from '../query/userOrderableServicesQuery';
import { ServiceHostingSelection } from './ServiceHostingSelection';
import { convertAreasToTabs } from '../formDataHelpers/areaHelper';
import { getRegionDropDownValues } from '../formDataHelpers/regionHelper';
import { Region } from '../types/Region';
import { getFlavorList } from '../formDataHelpers/flavorHelper';
import { Flavor } from '../types/Flavor';
import { getSortedVersionList } from '../formDataHelpers/versionHelper';
import { getAvailableServiceHostingTypes } from '../formDataHelpers/serviceHostingTypeHelper';
import { getCspListForVersion } from '../formDataHelpers/cspHelper';
import { getBilling } from '../formDataHelpers/billingHelper';

function CreateService(): React.JSX.Element {
    const [urlParams] = useSearchParams();
    const location = useLocation();
    const latestVersion = decodeURI(urlParams.get('latestVersion') ?? '');
    const categoryName = decodeURI(urlParams.get('catalog') ?? '');
    const serviceName = decodeURI(urlParams.get('serviceName') ?? '');
    const versionMapper = useRef<Map<string, UserOrderableServiceVo[]>>(new Map<string, UserOrderableServiceVo[]>());
    const [versionList, setVersionList] = useState<{ value: string; label: string }[]>([{ value: '', label: '' }]);
    const [selectVersion, setSelectVersion] = useState<string>('');

    const [selectCsp, setSelectCsp] = useState<UserOrderableServiceVo.csp | undefined>(undefined);
    const [cspList, setCspList] = useState<UserOrderableServiceVo.csp[]>([]);

    const [areaList, setAreaList] = useState<Tab[]>([{ key: '', label: '' }]);
    const [selectArea, setSelectArea] = useState<string>('');

    const [regionList, setRegionList] = useState<{ value: string; label: string }[]>([{ value: '', label: '' }]);
    const [selectRegion, setSelectRegion] = useState<string>('');

    const [flavorList, setFlavorList] = useState<Flavor[]>([{ value: '', label: '', price: '' }]);
    const [selectFlavor, setSelectFlavor] = useState<string>('');
    const [priceValue, setPriceValue] = useState<string>('');
    const [currency, setCurrency] = useState<string>('');
    const [selectServiceHostType, setSelectServiceHostType] = useState<UserOrderableServiceVo.serviceHostingType>(
        UserOrderableServiceVo.serviceHostingType.SELF
    );
    const [serviceHostTypes, setServiceHostTypes] = useState<UserOrderableServiceVo.serviceHostingType[]>([]);

    const orderableServicesQuery = userOrderableServicesQuery(
        categoryName as UserOrderableServiceVo.category,
        serviceName
    );

    useEffect(() => {
        if (orderableServicesQuery.isSuccess) {
            const services: UserOrderableServiceVo[] | undefined = orderableServicesQuery.data;
            if (services.length > 0) {
                const currentVersions: Map<string, UserOrderableServiceVo[]> = new Map<
                    string,
                    UserOrderableServiceVo[]
                >();
                for (const service of services) {
                    if (service.version) {
                        if (!currentVersions.has(service.version)) {
                            currentVersions.set(
                                service.version,
                                services.filter((data) => data.version === service.version)
                            );
                        }
                    }
                }
                versionMapper.current = currentVersions;
                const currentVersionList = getSortedVersionList(currentVersions);
                const currentCspList = getCspListForVersion(latestVersion, versionMapper.current);
                let serviceHostingTypes = getAvailableServiceHostingTypes(
                    latestVersion,
                    currentCspList[0],
                    versionMapper.current
                );
                let currentFlavorList = getFlavorList(
                    latestVersion,
                    currentCspList[0],
                    serviceHostingTypes[0],
                    versionMapper.current
                );
                setVersionList(currentVersionList);
                setSelectVersion(latestVersion);
                setCspList(currentCspList);
                setFlavorList(currentFlavorList);
                let currentAreaList: Tab[] = convertAreasToTabs(
                    latestVersion,
                    currentCspList[0],
                    serviceHostingTypes[0],
                    versionMapper.current
                );
                let currentRegionList: Region[] = getRegionDropDownValues(
                    latestVersion,
                    currentCspList[0],
                    serviceHostingTypes[0],
                    currentAreaList[0]?.key ?? '',
                    versionMapper.current
                );
                let currentBilling = getBilling(
                    latestVersion,
                    currentCspList[0],
                    serviceHostingTypes[0],
                    versionMapper.current
                );
                let cspValue: UserOrderableServiceVo.csp = currentCspList[0];
                let areaValue: string = currentAreaList[0]?.key ?? '';
                let regionValue: string = currentRegionList[0]?.value ?? '';
                let flavorValue: string = currentFlavorList[0]?.value ?? '';
                let priceValue: string = currentFlavorList[0]?.price ?? '';

                if (location.state) {
                    const serviceInfo: OrderSubmitProps = location.state as OrderSubmitProps;
                    currentAreaList = convertAreasToTabs(
                        serviceInfo.version,
                        serviceInfo.csp,
                        serviceInfo.serviceHostingType,
                        versionMapper.current
                    );
                    currentRegionList = getRegionDropDownValues(
                        serviceInfo.version,
                        serviceInfo.csp,
                        serviceInfo.serviceHostingType,
                        serviceInfo.area,
                        versionMapper.current
                    );
                    currentFlavorList = getFlavorList(
                        serviceInfo.version,
                        serviceInfo.csp,
                        serviceInfo.serviceHostingType,
                        versionMapper.current
                    );
                    currentBilling = getBilling(
                        serviceInfo.version,
                        serviceInfo.csp,
                        serviceInfo.serviceHostingType,
                        versionMapper.current
                    );
                    cspValue = serviceInfo.csp;
                    areaValue = serviceInfo.area;
                    regionValue = serviceInfo.region;
                    flavorValue = serviceInfo.flavor;
                    currentFlavorList.forEach((flavorItem) => {
                        if (flavorItem.value === serviceInfo.flavor) {
                            priceValue = flavorItem.price;
                        }
                    });
                    serviceHostingTypes = [serviceInfo.serviceHostingType];
                }
                const currencyValue: string = currencyMapper[currentBilling.currency];
                setSelectCsp(cspValue);
                setAreaList(currentAreaList);
                setSelectArea(areaValue);
                setRegionList(currentRegionList);
                setSelectRegion(regionValue);
                setSelectFlavor(flavorValue);
                setPriceValue(priceValue);
                setCurrency(currencyValue);
                setSelectServiceHostType(serviceHostingTypes[0]);
                setServiceHostTypes(serviceHostingTypes);
            }
        }
    }, [orderableServicesQuery.isSuccess, orderableServicesQuery.data, latestVersion, location.state, serviceName]);

    useEffect(() => {
        if (selectCsp) {
            const currentAreaList = convertAreasToTabs(
                selectVersion,
                selectCsp,
                selectServiceHostType,
                versionMapper.current
            );
            const currentRegionList = getRegionDropDownValues(
                selectVersion,
                selectCsp,
                selectServiceHostType,
                currentAreaList[0]?.key ?? '',
                versionMapper.current
            );
            const currentFlavorList = getFlavorList(
                selectVersion,
                selectCsp,
                selectServiceHostType,
                versionMapper.current
            );
            const billing: Billing = getBilling(selectVersion, selectCsp, selectServiceHostType, versionMapper.current);
            setAreaList(currentAreaList);
            setSelectArea(currentAreaList[0]?.key ?? '');
            setRegionList(currentRegionList);
            setSelectRegion(currentRegionList[0]?.value ?? '');
            setFlavorList(currentFlavorList);
            setSelectFlavor(currentFlavorList[0]?.value ?? '');
            setPriceValue(currentFlavorList[0].price);
            setCurrency(currencyMapper[billing.currency]);
        }
    }, [selectCsp, selectServiceHostType, selectVersion]);

    const onChangeVersion = (currentVersion: string) => {
        const currentCspList = getCspListForVersion(currentVersion, versionMapper.current);
        const currentAreaList = convertAreasToTabs(
            currentVersion,
            currentCspList[0],
            selectServiceHostType,
            versionMapper.current
        );
        const currentRegionList = getRegionDropDownValues(
            currentVersion,
            currentCspList[0],
            selectServiceHostType,
            currentAreaList[0]?.key ?? '',
            versionMapper.current
        );
        const currentFlavorList = getFlavorList(
            currentVersion,
            currentCspList[0],
            selectServiceHostType,
            versionMapper.current
        );
        const serviceHostingTypes = getAvailableServiceHostingTypes(
            currentVersion,
            currentCspList[0],
            versionMapper.current
        );
        const billing: Billing = getBilling(
            currentVersion,
            currentCspList[0],
            serviceHostingTypes[0],
            versionMapper.current
        );
        setSelectVersion(currentVersion);
        setCspList(currentCspList);
        setSelectCsp(currentCspList[0]);
        setAreaList(currentAreaList);
        setSelectArea(currentAreaList[0]?.key ?? '');
        setRegionList(currentRegionList);
        setSelectRegion(currentRegionList[0]?.value ?? '');
        setFlavorList(currentFlavorList);
        setSelectFlavor(currentFlavorList[0]?.value ?? '');
        setPriceValue(currentFlavorList[0].price);
        setCurrency(currencyMapper[billing.currency]);
        setServiceHostTypes(serviceHostingTypes);
        setSelectServiceHostType(serviceHostingTypes[0]);
    };

    const onChangeCloudProvider = (selectVersion: string, csp: UserOrderableServiceVo.csp) => {
        const currentAreaList = convertAreasToTabs(selectVersion, csp, selectServiceHostType, versionMapper.current);
        const currentRegionList = getRegionDropDownValues(
            selectVersion,
            csp,
            selectServiceHostType,
            currentAreaList[0]?.key ?? '',
            versionMapper.current
        );
        const currentFlavorList = getFlavorList(selectVersion, csp, selectServiceHostType, versionMapper.current);
        const serviceHostingTypes = getAvailableServiceHostingTypes(selectVersion, csp, versionMapper.current);
        const billing: Billing = getBilling(selectVersion, csp, serviceHostingTypes[0], versionMapper.current);
        setSelectCsp(csp);
        setAreaList(currentAreaList);
        setSelectArea(currentAreaList[0]?.key ?? '');
        setRegionList(currentRegionList);
        setSelectRegion(currentRegionList[0]?.value ?? '');
        setFlavorList(currentFlavorList);
        setSelectFlavor(currentFlavorList[0]?.value ?? '');
        setPriceValue(currentFlavorList[0].price);
        setCurrency(currencyMapper[billing.currency]);
        setSelectServiceHostType(serviceHostingTypes[0]);
        setServiceHostTypes(serviceHostingTypes);
    };

    const onChangeAreaValue = (selectVersion: string, csp: UserOrderableServiceVo.csp, key: string) => {
        const currentRegionList = getRegionDropDownValues(
            selectVersion,
            csp,
            selectServiceHostType,
            key,
            versionMapper.current
        );
        setSelectArea(key);
        setRegionList(currentRegionList);
        setSelectRegion(currentRegionList[0]?.value ?? '');
    };

    const onChangeRegion = (value: string) => {
        setSelectRegion(value);
    };

    const onChangeFlavor = (value: string, selectVersion: string, csp: UserOrderableServiceVo.csp) => {
        setSelectFlavor(value);
        const currentFlavorList = getFlavorList(selectVersion, csp, selectServiceHostType, versionMapper.current);
        const billing: Billing = getBilling(selectVersion, csp, selectServiceHostType, versionMapper.current);
        currentFlavorList.forEach((flavor) => {
            if (value === flavor.value) {
                setPriceValue(flavor.price);
            }
        });
        setCurrency(currencyMapper[billing.currency]);
    };

    const onChangeServiceHostingType = (serviceHostingType: UserOrderableServiceVo.serviceHostingType) => {
        setSelectServiceHostType(serviceHostingType);
    };

    const servicePageUrl = servicesSubPageRoute + categoryName;

    if (orderableServicesQuery.isError) {
        versionMapper.current = new Map<string, UserOrderableServiceVo[]>();
        return <ServicesLoadingError error={orderableServicesQuery.error} />;
    }

    if (orderableServicesQuery.isLoading || orderableServicesQuery.isFetching) {
        return (
            <Skeleton
                className={'catalog-skeleton'}
                active={true}
                paragraph={{ rows: 2, width: ['20%', '20%'] }}
                title={{ width: '5%' }}
            />
        );
    }

    if (selectCsp) {
        return (
            <>
                <div>
                    <NavigateOrderSubmission text={'<< Back'} to={servicePageUrl as To} props={undefined} />
                    <div className={'Line'} />
                </div>
                <div className={'services-content'}>
                    <div className={'content-title'}>
                        Service: {serviceName}&nbsp;&nbsp;&nbsp;&nbsp; Version:&nbsp;
                        <Select
                            value={selectVersion}
                            className={'version-drop-down'}
                            onChange={onChangeVersion}
                            options={versionList}
                        />
                    </div>
                    <br />
                    <CspSelect
                        selectCsp={selectCsp}
                        cspList={cspList}
                        onChangeHandler={(csp: UserOrderableServiceVo.csp) => {
                            onChangeCloudProvider(selectVersion, csp);
                        }}
                    />
                    <br />
                    <ServiceHostingSelection
                        serviceHostingTypes={serviceHostTypes}
                        updateServiceHostingType={onChangeServiceHostingType}
                    ></ServiceHostingSelection>
                    <br />
                    <br />
                    <div className={'cloud-provider-tab-class content-title'}>
                        <Tabs
                            type='card'
                            size='middle'
                            activeKey={selectArea}
                            tabPosition={'top'}
                            items={areaList}
                            onChange={(area) => {
                                onChangeAreaValue(selectVersion, selectCsp, area);
                            }}
                        />
                    </div>
                    <div className={'cloud-provider-tab-class region-flavor-content'}>Region:</div>
                    <div className={'cloud-provider-tab-class region-flavor-content'}>
                        <Space wrap>
                            <Select
                                className={'select-box-class'}
                                defaultValue={selectRegion}
                                value={selectRegion}
                                style={{ width: 450 }}
                                onChange={onChangeRegion}
                                options={regionList}
                            />
                        </Space>
                    </div>
                    <div className={'cloud-provider-tab-class region-flavor-content'}>Flavor:</div>
                    <div className={'cloud-provider-tab-class region-flavor-content'}>
                        <Space wrap>
                            <Select
                                className={'select-box-class'}
                                value={selectFlavor}
                                style={{ width: 450 }}
                                onChange={(value) => {
                                    onChangeFlavor(value, selectVersion, selectCsp);
                                }}
                                options={flavorList}
                            />
                        </Space>
                    </div>
                    <div className={'cloud-provider-tab-class region-flavor-content'}>
                        Price:&nbsp;
                        <span className={'services-content-price-class'}>
                            {priceValue}&nbsp;{currency}
                        </span>
                    </div>
                </div>
                <div>
                    <div className={'Line'} />
                    <GoToSubmit
                        categoryName={categoryName}
                        serviceName={serviceName}
                        selectVersion={selectVersion}
                        selectCsp={selectCsp}
                        selectRegion={selectRegion}
                        selectArea={selectArea}
                        selectFlavor={selectFlavor}
                        versionMapper={versionMapper.current}
                        selectServiceHostingType={selectServiceHostType}
                    />
                </div>
            </>
        );
    }

    return <></>;
}

export default CreateService;
