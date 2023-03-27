/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useCallback, useEffect, useState } from 'react';
import { To, useLocation } from 'react-router-dom';
import { serviceVendorApi } from '../../../xpanse-api/xpanseRestApiClient';
import { RegisterServiceEntity } from '../../../xpanse-api/generated';
import Navigate from './Navigate';
import CspSelect from './formElements/CspSelect';
import VersionSelect from './formElements/VersionSelect';
import AreaSelect from './formElements/AreaSelect';
import RegionSelect from './formElements/RegionSelect';
import FlavorSelect from './formElements/FlavorSelect';
import GoToSubmit from './formElements/GoToSubmit';

function CreateService(): JSX.Element {
    const location = useLocation();

    const [versionMapper, setVersionMapper] = useState<Map<string, RegisterServiceEntity[]>>(
        new Map<string, RegisterServiceEntity[]>()
    );

    const [categoryName, setCategoryName] = useState<string>('');
    const [serviceName, setServiceName] = useState<string>('');
    const [selectVersion, setSelectVersion] = useState<string>('');
    const [selectCsp, setSelectCsp] = useState<string>('');
    const [selectArea, setSelectArea] = useState<string>('');
    const [selectRegion, setSelectRegion] = useState<string>('');
    const [selectFlavor, setSelectFlavor] = useState<string>('');

    const onChangeVersion = useCallback((value: string) => {
        setSelectVersion(value);
    }, []);

    const onChangeCloudProvider = useCallback((csp: string) => {
        setSelectCsp(csp);
    }, []);

    const onChangeFlavor = useCallback((value: string) => {
        setSelectFlavor(value);
    }, []);

    const onChangeAreaValue = useCallback((key: string) => {
        setSelectArea(key);
    }, []);

    const onChangeRegion = useCallback((value: string) => {
        setSelectRegion(value);
    }, []);

    function groupRegisterServicesByVersion(registerServiceEntityList: RegisterServiceEntity[]): Map<string, any[]> {
        let map: Map<string, any[]> = new Map<string, any[]>();
        for (let registerServiceEntity of registerServiceEntityList) {
            if (!map.has(registerServiceEntity.version as string)) {
                map.set(
                    registerServiceEntity.version as string,
                    registerServiceEntityList.filter((data) => data.version === registerServiceEntity.version)
                );
            }
        }
        return map;
    }

    useEffect(() => {
        const categoryName = location.search.split('?')[1].split('&')[0].split('=')[1];
        const serviceName = location.search.split('?')[1].split('&')[1].split('=')[1];
        if (!categoryName || !serviceName) {
            return;
        }
        setCategoryName(categoryName);
        setServiceName(serviceName);
        serviceVendorApi.listRegisteredServices(categoryName, '', serviceName, '').then((rsp) => {
            if (rsp.length > 0) {
                let versions: { value: string; label: string }[] = [];
                const result: Map<string, RegisterServiceEntity[]> = groupRegisterServicesByVersion(rsp);
                setVersionMapper(result);
                result.forEach((v, k) => {
                    let versionItem = { value: k || '', label: k || '' };
                    versions.push(versionItem);
                });
                setSelectCsp(result.get(versions[0].value)?.at(0)?.csp as string);
                setSelectVersion(versions[0].value);
                setSelectArea(
                    result.get(versions[0].value)?.at(0)?.ocl?.cloudServiceProvider?.regions.at(0)?.area as string
                );
            } else {
                return;
            }
        });
    }, [location]);

    return (
        <>
            <div>
                <Navigate text={'<< Back'} to={-1 as To} />
                <div className={'Line'} />
            </div>
            <div className={'services-content'}>
                <VersionSelect
                    serviceName={serviceName}
                    versionMapper={versionMapper}
                    onChangeHandler={onChangeVersion}
                />
                <CspSelect
                    versionMapper={versionMapper}
                    selectVersion={selectVersion}
                    onChangeHandler={onChangeCloudProvider}
                />
                <AreaSelect
                    selectVersion={selectVersion}
                    selectCsp={selectCsp}
                    versionMapper={versionMapper}
                    onChangeHandler={onChangeAreaValue}
                />
                <RegionSelect
                    selectVersion={selectVersion}
                    selectCsp={selectCsp}
                    selectArea={selectArea}
                    versionMapper={versionMapper}
                    onChangeHandler={onChangeRegion}
                />
                <FlavorSelect
                    selectVersion={selectVersion}
                    selectCsp={selectCsp}
                    versionMapper={versionMapper}
                    onChangeHandler={onChangeFlavor}
                />
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
                    versionMapper={versionMapper}
                />
            </div>
        </>
    );
}

export default CreateService;
