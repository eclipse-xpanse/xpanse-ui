/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { To, useLocation, useSearchParams } from 'react-router-dom';
import {
    Billing,
    CloudServiceProvider,
    Flavor,
    Region,
    ServicesAvailableService,
    UserAvailableServiceVo,
} from '../../../xpanse-api/generated';
import Navigate from './Navigate';
import CspSelect from './formElements/CspSelect';
import GoToSubmit from './formElements/GoToSubmit';
import { Select, Space, Tabs } from 'antd';
import { Area } from '../../utils/Area';
import { Tab } from 'rc-tabs/lib/interface';
import { sortVersion } from '../../utils/Sort';
import { currencyMapper } from '../../utils/currency';
import { servicesSubPageRoute } from '../../utils/constants';
import { OrderSubmitProps } from './OrderSubmit';

function filterAreaList(
    selectVersion: string,
    selectCsp: string,
    versionMapper: Map<string, UserAvailableServiceVo[]>
): Area[] {
    const areaMapper: Map<string, Area[]> = new Map<string, Area[]>();
    versionMapper.forEach((v, k) => {
        if (k !== selectVersion) {
            return [];
        }
        for (const userAvailableServiceVo of v) {
            if (userAvailableServiceVo.csp === selectCsp) {
                const areaRegions: Map<string, Region[]> = new Map<string, Region[]>();
                for (const region of userAvailableServiceVo.regions) {
                    if (region.area && !areaRegions.has(region.area)) {
                        areaRegions.set(
                            region.area,
                            userAvailableServiceVo.regions.filter((data) => data.area === region.area)
                        );
                    }
                }
                const areas: Area[] = [];
                areaRegions.forEach((areaRegions, area) => {
                    const regionNames: string[] = [];
                    areaRegions.forEach((region) => {
                        if (region.name) {
                            regionNames.push(region.name);
                        }
                    });
                    areas.push({ name: area, regions: regionNames });
                });
                areaMapper.set(userAvailableServiceVo.csp, areas);
            }
        }
    });
    return areaMapper.get(selectCsp) ?? [];
}

function CreateService(): JSX.Element {
    const [urlParams] = useSearchParams();
    const location = useLocation();

    const versionMapper = useRef<Map<string, UserAvailableServiceVo[]>>(new Map<string, UserAvailableServiceVo[]>());

    const [categoryName, setCategoryName] = useState<string>('');
    const [serviceName, setServiceName] = useState<string>('');

    const [versionList, setVersionList] = useState<{ value: string; label: string }[]>([{ value: '', label: '' }]);
    const [selectVersion, setSelectVersion] = useState<string>('');

    const [selectCsp, setSelectCsp] = useState<CloudServiceProvider.name>(CloudServiceProvider.name.OPENSTACK);
    const [cspList, setCspList] = useState<CloudServiceProvider.name[]>([CloudServiceProvider.name.OPENSTACK]);

    const [areaList, setAreaList] = useState<Tab[]>([{ key: '', label: '' }]);
    const [selectArea, setSelectArea] = useState<string>('');

    const [regionList, setRegionList] = useState<{ value: string; label: string }[]>([{ value: '', label: '' }]);
    const [selectRegion, setSelectRegion] = useState<string>('');

    const [flavorList, setFlavorList] = useState<{ value: string; label: string; price: string }[]>([
        { value: '', label: '', price: '' },
    ]);
    const [selectFlavor, setSelectFlavor] = useState<string>('');
    const [priceValue, setPriceValue] = useState<string>('');
    const [currency, setCurrency] = useState<string>('');

    useEffect(() => {
        const categoryName = decodeURI(urlParams.get('catalog') ?? '') as UserAvailableServiceVo.category;
        const serviceName = decodeURI(urlParams.get('serviceName') ?? '');
        const latestVersion = decodeURI(urlParams.get('latestVersion') ?? '');
        if (serviceName === '' || latestVersion === '') {
            return;
        }
        setCategoryName(categoryName);
        setServiceName(serviceName);
        void ServicesAvailableService.listAvailableServices(categoryName, '', serviceName, '')
            .then((rsp) => {
                if (rsp.length > 0) {
                    const currentVersions: Map<string, UserAvailableServiceVo[]> = new Map<
                        string,
                        UserAvailableServiceVo[]
                    >();
                    for (const registerServiceEntity of rsp) {
                        if (registerServiceEntity.version) {
                            if (!currentVersions.has(registerServiceEntity.version)) {
                                currentVersions.set(
                                    registerServiceEntity.version,
                                    rsp.filter((data) => data.version === registerServiceEntity.version)
                                );
                            }
                        }
                    }
                    versionMapper.current = currentVersions;
                    const currentVersionList = getVersionList();
                    const currentCspList = getCspList(latestVersion);
                    const currentFlavorList = getFlavorList(latestVersion);
                    setVersionList(currentVersionList);
                    setSelectVersion(latestVersion);
                    setCspList(currentCspList);
                    setFlavorList(currentFlavorList);
                    let currentAreaList: Tab[] = getAreaList(latestVersion, currentCspList[0]);
                    let currentRegionList: { value: string; label: string }[] = getRegionList(
                        latestVersion,
                        currentCspList[0],
                        currentAreaList[0]?.key ?? ''
                    );
                    let currentBilling = getBilling(latestVersion, currentCspList[0]);
                    let cspValue: CloudServiceProvider.name = currentCspList[0];
                    let areaValue: string = currentAreaList[0]?.key ?? '';
                    let regionValue: string = currentRegionList[0]?.value ?? '';
                    let flavorValue: string = currentFlavorList[0]?.value ?? '';
                    let priceValue: string = currentFlavorList[0]?.price ?? '';
                    if (location.state) {
                        const serviceInfo: OrderSubmitProps = location.state as OrderSubmitProps;
                        currentAreaList = getAreaList(latestVersion, serviceInfo.csp);
                        currentRegionList = getRegionList(latestVersion, serviceInfo.csp, serviceInfo.area);
                        currentBilling = getBilling(latestVersion, serviceInfo.csp.toString());
                        cspValue = serviceInfo.csp as unknown as CloudServiceProvider.name;
                        areaValue = serviceInfo.area;
                        regionValue = serviceInfo.region;
                        flavorValue = serviceInfo.flavor;
                        currentFlavorList.forEach((flavorItem) => {
                            if (flavorItem.value === serviceInfo.flavor) {
                                priceValue = flavorItem.price;
                            }
                        });
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
                } else {
                    return;
                }
            })
            .catch((error: Error) => {
                console.log(error.message);
                versionMapper.current = new Map<string, UserAvailableServiceVo[]>();
            });
    }, [location, urlParams]);

    function getVersionList(): { value: string; label: string }[] {
        if (versionMapper.current.size <= 0) {
            return [{ value: '', label: '' }];
        }
        const versionSet: string[] = [];
        versionMapper.current.forEach((v, k) => {
            versionSet.push(k);
        });
        const versions: { value: string; label: string }[] = [];
        sortVersion(versionSet).forEach((version) => {
            versionMapper.current.forEach((v, k) => {
                if (version === k) {
                    const versionItem = { value: k || '', label: k || '' };
                    versions.push(versionItem);
                }
            });
        });

        return versions;
    }

    function getCspList(selectVersion: string): CloudServiceProvider.name[] {
        const cspList: CloudServiceProvider.name[] = [];

        versionMapper.current.forEach((v, k) => {
            if (k === selectVersion) {
                for (const userAvailableServiceVo of v) {
                    cspList.push(userAvailableServiceVo.csp as unknown as CloudServiceProvider.name);
                }
            }
        });
        return cspList;
    }

    function getAreaList(selectVersion: string, selectCsp: string): Tab[] {
        const areaList: Area[] = filterAreaList(selectVersion, selectCsp, versionMapper.current);
        let areaItems: Tab[] = [];
        if (areaList.length > 0) {
            areaItems = areaList.map((area: Area) => {
                if (!area.name) {
                    return { key: '', label: '' };
                }
                const name = area.name;
                return {
                    label: name,
                    key: name,
                    children: [],
                };
            });
        }
        return areaItems;
    }

    function getRegionList(
        selectVersion: string,
        selectCsp: string,
        selectArea: string
    ): { value: string; label: string }[] {
        const areaList: Area[] = filterAreaList(selectVersion, selectCsp, versionMapper.current);
        let regions: { value: string; label: string }[] = [];
        if (areaList.length > 0) {
            regions = areaList
                .filter((v) => v.name === selectArea)
                .flatMap((v) => {
                    return v.regions.map((region) => {
                        if (!region) {
                            return { value: '', label: '' };
                        }
                        return {
                            value: region,
                            label: region,
                        };
                    });
                });
        }
        return regions;
    }

    function getFlavorList(selectVersion: string): { value: string; label: string; price: string }[] {
        const flavorMapper = new Map<string, Flavor[]>();
        versionMapper.current.forEach((v, k) => {
            if (k === selectVersion) {
                for (const userAvailableServiceVo of v) {
                    flavorMapper.set(userAvailableServiceVo.version || '', userAvailableServiceVo.flavors);
                }
            }
        });

        const flavorList = flavorMapper.get(selectVersion) ?? [];
        const flavors: { value: string; label: string; price: string }[] = [];
        if (flavorList.length > 0) {
            for (const flavor of flavorList) {
                const flavorItem = { value: flavor.name, label: flavor.name, price: flavor.fixedPrice.toString() };
                flavors.push(flavorItem);
            }
        }

        return flavors;
    }

    function getBilling(selectVersion: string, csp: string): Billing {
        let billing: Billing = {
            model: '' as string,
            period: 'daily' as Billing.period,
            currency: 'euro' as Billing.currency,
        };
        versionMapper.current.forEach((v, k) => {
            if (selectVersion === k) {
                v.forEach((registeredServiceVo) => {
                    if (csp === registeredServiceVo.csp.valueOf()) {
                        billing = registeredServiceVo.billing;
                    }
                });
            }
        });
        return billing;
    }

    const onChangeVersion = useCallback((value: string) => {
        const currentVersion = value;
        const currentCspList = getCspList(currentVersion);
        const currentAreaList = getAreaList(currentVersion, currentCspList[0]);
        const currentRegionList = getRegionList(currentVersion, currentCspList[0], currentAreaList[0]?.key ?? '');
        const currentFlavorList = getFlavorList(currentVersion);
        const billing: Billing = getBilling(currentVersion, currentCspList[0]);
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
    }, []);

    const onChangeCloudProvider = useCallback((selectVersion: string, csp: CloudServiceProvider.name) => {
        const currentAreaList = getAreaList(selectVersion, csp);
        const currentRegionList = getRegionList(selectVersion, csp, currentAreaList[0]?.key ?? '');
        const currentFlavorList = getFlavorList(selectVersion);
        const billing: Billing = getBilling(selectVersion, csp);
        setSelectCsp(csp);
        setAreaList(currentAreaList);
        setSelectArea(currentAreaList[0]?.key ?? '');
        setRegionList(currentRegionList);
        setSelectRegion(currentRegionList[0]?.value ?? '');
        setFlavorList(currentFlavorList);
        setSelectFlavor(currentFlavorList[0]?.value ?? '');
        setPriceValue(currentFlavorList[0].price);
        setCurrency(currencyMapper[billing.currency]);
    }, []);

    const onChangeAreaValue = useCallback((selectVersion: string, csp: CloudServiceProvider.name, key: string) => {
        const currentRegionList = getRegionList(selectVersion, csp, key);
        setSelectArea(key);
        setRegionList(currentRegionList);
        setSelectRegion(currentRegionList[0]?.value ?? '');
    }, []);

    const onChangeRegion = useCallback((value: string) => {
        setSelectRegion(value);
    }, []);

    const onChangeFlavor = useCallback((value: string, selectVersion: string, csp: CloudServiceProvider.name) => {
        setSelectFlavor(value);
        const currentFlavorList = getFlavorList(selectVersion);
        const billing: Billing = getBilling(selectVersion, csp);
        currentFlavorList.forEach((flavor) => {
            if (value === flavor.value) {
                setPriceValue(flavor.price);
            }
        });
        setCurrency(currencyMapper[billing.currency]);
    }, []);

    const servicePageUrl = servicesSubPageRoute + categoryName;

    return (
        <>
            <div>
                <Navigate text={'<< Back'} to={servicePageUrl as To} props={undefined} />
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
                    onChangeHandler={(csp) => {
                        onChangeCloudProvider(selectVersion, csp as CloudServiceProvider.name);
                    }}
                />
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
                />
            </div>
        </>
    );
}

export default CreateService;
