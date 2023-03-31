/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { To, useLocation } from 'react-router-dom';
import { serviceVendorApi } from '../../../xpanse-api/xpanseRestApiClient';
import {
    CloudServiceProviderNameEnum,
    Flavor,
    Ocl,
    Region,
    RegisterServiceEntity,
} from '../../../xpanse-api/generated';
import Navigate from './Navigate';
import CspSelect from './formElements/CspSelect';
import GoToSubmit from './formElements/GoToSubmit';
import { Select, Space, Tabs } from 'antd';
import { Area } from '../../utils/Area';
import { Tab } from 'rc-tabs/lib/interface';
import { sortVersion } from '../../utils/Sort';

function filterAreaList(
    selectVersion: string,
    selectCsp: string,
    versionMapper: Map<string, RegisterServiceEntity[]>
): Area[] {
    let oclList: Ocl[] = [];
    const areaMapper: Map<string, Area[]> = new Map<string, Area[]>();
    versionMapper.forEach((v, k) => {
        if (k === selectVersion) {
            const ocls: Ocl[] = [];
            for (const registerServiceEntity of v) {
                if (registerServiceEntity.ocl instanceof Ocl) {
                    ocls.push(registerServiceEntity.ocl);
                }
            }
            oclList = ocls;
        }
    });
    oclList
        .filter((v) => v.serviceVersion === selectVersion)
        .forEach((v) => {
            if (v.cloudServiceProvider.name !== selectCsp) {
                return { key: '', label: '' };
            }
            const areaRegions: Map<string, Region[]> = new Map<string, Region[]>();
            for (const region of v.cloudServiceProvider.regions) {
                if (region.area && !areaRegions.has(region.area)) {
                    areaRegions.set(
                        region.area,
                        v.cloudServiceProvider.regions.filter((data) => data.area === region.area)
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
            areaMapper.set(v.cloudServiceProvider.name, areas);
        });
    return areaMapper.get(selectCsp) ?? [];
}

function CreateService(): JSX.Element {
    const location = useLocation();

    const versionMapper = useRef<Map<string, RegisterServiceEntity[]>>(new Map<string, RegisterServiceEntity[]>());

    const [categoryName, setCategoryName] = useState<string>('');
    const [serviceName, setServiceName] = useState<string>('');

    const [versionList, setVersionList] = useState<{ value: string; label: string }[]>([{ value: '', label: '' }]);
    const [selectVersion, setSelectVersion] = useState<string>('');

    const [selectCsp, setSelectCsp] = useState<CloudServiceProviderNameEnum>('openstack');
    const [cspList, setCspList] = useState<CloudServiceProviderNameEnum[]>(['openstack']);

    const [areaList, setAreaList] = useState<Tab[]>([{ key: '', label: '' }]);
    const [selectArea, setSelectArea] = useState<string>('');

    const [regionList, setRegionList] = useState<{ value: string; label: string }[]>([{ value: '', label: '' }]);
    const [selectRegion, setSelectRegion] = useState<string>('');

    const [flavorList, setFlavorList] = useState<{ value: string; label: string; price: string }[]>([
        { value: '', label: '', price: '' },
    ]);
    const [selectFlavor, setSelectFlavor] = useState<string>('');

    useEffect(() => {
        const categoryName = location.search.split('?')[1].split('&')[0].split('=')[1];
        const serviceName = location.search.split('?')[1].split('&')[1].split('=')[1];
        const latestVersion = location.search.split('?')[1].split('&')[2].split('=')[1];
        if (!categoryName || !serviceName) {
            return;
        }
        setCategoryName(categoryName);
        setServiceName(serviceName);
        void serviceVendorApi.listRegisteredServices(categoryName, '', serviceName, '').then((rsp) => {
            if (rsp.length > 0) {
                const currentVersions: Map<string, RegisterServiceEntity[]> = new Map<
                    string,
                    RegisterServiceEntity[]
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
                const currentAreaList = getAreaList(latestVersion, currentCspList[0]);
                const currentRegionList = getRegionList(latestVersion, currentCspList[0], currentAreaList[0].key);
                const currentFlavorList = getFlavorList(latestVersion);
                setVersionList(currentVersionList);
                setSelectVersion(latestVersion);
                setCspList(currentCspList);
                setSelectCsp(currentCspList[0]);
                setAreaList(currentAreaList);
                setSelectArea(currentAreaList[0].key);
                setRegionList(currentRegionList);
                setSelectRegion(currentRegionList[0].value);
                setFlavorList(currentFlavorList);
                setSelectFlavor(currentFlavorList[0].value);
            } else {
                return;
            }
        });
    }, [location]);

    function getVersionList(): { value: string; label: string }[] {
        if (versionMapper.current.size <= 0) {
            return [{ value: '', label: '' }];
        }
        const versionSet: string[] = [];
        versionMapper.current.forEach((v, k) => {
            versionSet.push(k);
        });
        const versions: { value: string; label: string }[] = [];
        sortVersion(versionSet).forEach((verision) => {
            versionMapper.current.forEach((v, k) => {
                if (verision === k) {
                    const versionItem = { value: k || '', label: k || '' };
                    versions.push(versionItem);
                }
            });
        });

        return versions;
    }

    function getCspList(selectVersion: string) {
        let oclList: Ocl[] = [];
        const cspList: CloudServiceProviderNameEnum[] = [];

        versionMapper.current.forEach((v, k) => {
            if (k === selectVersion) {
                const ocls: Ocl[] = [];
                for (const registerServiceEntity of v) {
                    if (registerServiceEntity.ocl instanceof Ocl) {
                        ocls.push(registerServiceEntity.ocl);
                    }
                }
                oclList = ocls;
            }
        });

        if (oclList.length > 0) {
            oclList.forEach((item) => {
                if (item.serviceVersion === selectVersion) {
                    cspList.push(item.cloudServiceProvider.name);
                }
            });
        }
        return cspList;
    }

    function getAreaList(selectVersion: string, selectCsp: string) {
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

    function getRegionList(selectVersion: string, selectCsp: string, selectArea: string) {
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

    function getFlavorList(selectVersion: string) {
        const oclList: Ocl[] = [];
        versionMapper.current.forEach((v, k) => {
            if (k === selectVersion) {
                for (const registerServiceEntity of v) {
                    if (registerServiceEntity.ocl instanceof Ocl) {
                        oclList.push(registerServiceEntity.ocl);
                    }
                }
            }
        });
        const flavorMapper = new Map<string, Flavor[]>();
        oclList
            .filter((v) => v.serviceVersion === selectVersion)
            .forEach((v) => {
                flavorMapper.set(v.serviceVersion || '', v.flavors);
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

    const onChangeVersion = useCallback((value: string) => {
        const currentVersion = value;
        const currentCspList = getCspList(currentVersion);
        const currentAreaList = getAreaList(currentVersion, currentCspList[0]);
        const currentRegionList = getRegionList(currentVersion, currentCspList[0], currentAreaList[0].key);
        const currentFlavorList = getFlavorList(currentVersion);
        setSelectVersion(currentVersion);
        setCspList(currentCspList);
        setSelectCsp(currentCspList[0]);
        setAreaList(currentAreaList);
        setSelectArea(currentAreaList[0].key);
        setRegionList(currentRegionList);
        setSelectRegion(currentRegionList[0].value);
        setFlavorList(currentFlavorList);
        setSelectFlavor(currentFlavorList[0].value);
        setSelectRegion(currentRegionList[0].value);
    }, []);

    const onChangeCloudProvider = useCallback((selectVersion: string, csp: CloudServiceProviderNameEnum) => {
        const currentAreaList = getAreaList(selectVersion, csp);
        const currentRegionList = getRegionList(selectVersion, csp, currentAreaList[0].key);
        setSelectCsp(csp);
        setAreaList(currentAreaList);
        setSelectArea(currentAreaList[0].key);
        setRegionList(currentRegionList);
        setSelectRegion(currentRegionList[0].value);
    }, []);

    const onChangeAreaValue = useCallback((selectVersion: string, csp: CloudServiceProviderNameEnum, key: string) => {
        const currentRegionList = getRegionList(selectVersion, csp, key);
        setSelectArea(key);
        setRegionList(currentRegionList);
        setSelectRegion(currentRegionList[0].value);
    }, []);

    const onChangeRegion = useCallback((value: string) => {
        setSelectRegion(value);
    }, []);

    const onChangeFlavor = useCallback((value: string) => {
        setSelectFlavor(value);
    }, []);

    return (
        <>
            <div>
                <Navigate text={'<< Back'} to={-1 as To} />
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
                        onChangeCloudProvider(selectVersion, csp as CloudServiceProviderNameEnum);
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
                            onChange={onChangeFlavor}
                            options={flavorList}
                        />
                    </Space>
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
                    selectFlavor={selectFlavor}
                    versionMapper={versionMapper.current}
                />
            </div>
        </>
    );
}

export default CreateService;
