/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { To, useLocation, useSearchParams } from 'react-router-dom';
import React, { useMemo, useState } from 'react';
import {
    AvailabilityZoneConfig,
    Billing,
    ServiceProviderContactDetails,
    UserOrderableServiceVo,
} from '../../../../xpanse-api/generated';
import { Tab } from 'rc-tabs/lib/interface';
import { Region } from '../types/Region';
import { Flavor } from '../types/Flavor';
import { getSortedVersionList } from '../formDataHelpers/versionHelper';
import { getCspListForVersion } from '../formDataHelpers/cspHelper';
import { getAvailableServiceHostingTypes } from '../formDataHelpers/serviceHostingTypeHelper';
import { getContactServiceDetailsOfServiceByCsp } from '../formDataHelpers/contactServiceDetailsHelper';
import { getFlavorList } from '../formDataHelpers/flavorHelper';
import { convertAreasToTabs } from '../formDataHelpers/areaHelper';
import { getRegionDropDownValues } from '../formDataHelpers/regionHelper';
import { getBilling } from '../formDataHelpers/billingHelper';
import { Col, Form, Row, Select, Tabs } from 'antd';
import NavigateOrderSubmission from './NavigateOrderSubmission';
import { ContactDetailsText } from '../../common/ocl/ContactDetailsText';
import { ContactDetailsShowType } from '../../common/ocl/ContactDetailsShowType';
import CspSelect from '../formElements/CspSelect';
import { ServiceHostingSelection } from '../common/ServiceHostingSelection';
import { RegionInfo } from '../common/RegionInfo';
import { FlavorInfo } from '../common/FlavorInfo';
import { BillingInfo } from '../common/BillingInfo';
import GoToSubmit from './GoToSubmit';
import { servicesSubPageRoute } from '../../../utils/constants';
import { OrderSubmitProps } from '../common/utils/OrderSubmitProps';
import { getAvailabilityZoneConfigs } from '../formDataHelpers/getAvailabilityZoneConfigs';
import { AvailabilityZoneInfo } from '../common/AvailabilityZoneInfo';
import useAvailabilityZonesVariableQuery from '../common/utils/useAvailabilityZonesVariableQuery';

export function SelectServiceForm({ services }: { services: UserOrderableServiceVo[] }): React.JSX.Element {
    const [urlParams] = useSearchParams();
    const location = useLocation();
    const latestVersion = decodeURI(urlParams.get('latestVersion') ?? '');
    const serviceName = decodeURI(urlParams.get('serviceName') ?? '');
    const categoryName = decodeURI(urlParams.get('catalog') ?? '');
    const servicePageUrl = servicesSubPageRoute + categoryName;
    let serviceInfo: OrderSubmitProps | undefined;
    const versionToServicesMap = useMemo<Map<string, UserOrderableServiceVo[]>>(() => {
        const currentVersions: Map<string, UserOrderableServiceVo[]> = new Map<string, UserOrderableServiceVo[]>();
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
        return currentVersions;
    }, [services]);

    // if the component is revisited by the customer after going to final order submission page, the user selected values are set as URL state.
    // These values must be read and set in the form again by default.
    if (location.state) {
        serviceInfo = location.state as OrderSubmitProps;
    }
    const versionList: { value: string; label: string }[] = getSortedVersionList(versionToServicesMap);
    const [selectVersion, setSelectVersion] = useState<string>(serviceInfo ? serviceInfo.version : latestVersion);
    let cspList: UserOrderableServiceVo.csp[] = getCspListForVersion(selectVersion, versionToServicesMap);
    const [selectCsp, setSelectCsp] = useState<UserOrderableServiceVo.csp>(serviceInfo ? serviceInfo.csp : cspList[0]);

    let serviceHostTypes: UserOrderableServiceVo.serviceHostingType[] = getAvailableServiceHostingTypes(
        selectCsp,
        versionToServicesMap.get(selectVersion)
    );
    const [selectServiceHostType, setSelectServiceHostType] = useState<UserOrderableServiceVo.serviceHostingType>(
        serviceInfo ? serviceInfo.serviceHostingType : serviceHostTypes[0]
    );
    let areaList: Tab[] = convertAreasToTabs(selectCsp, selectServiceHostType, versionToServicesMap.get(selectVersion));
    const [selectArea, setSelectArea] = useState<string>(serviceInfo ? serviceInfo.area : areaList[0].key);
    let regionList: Region[] = getRegionDropDownValues(
        selectCsp,
        selectServiceHostType,
        selectArea,
        versionToServicesMap.get(selectVersion)
    );
    const [selectRegion, setSelectRegion] = useState<string>(serviceInfo ? serviceInfo.region : regionList[0].value);

    const availabilityZonesVariableRequest = useAvailabilityZonesVariableQuery(selectCsp, selectRegion);
    const availabilityZoneConfigs: AvailabilityZoneConfig[] | undefined = getAvailabilityZoneConfigs(
        selectCsp,
        versionToServicesMap.get(selectVersion)
    );
    const [selectAvailabilityZones, setSelectAvailabilityZones] = useState<Record<string, string>>(
        serviceInfo?.availabilityZones ?? {}
    );
    const availabilityZones = useMemo<string[]>(() => {
        if (availabilityZoneConfigs && availabilityZonesVariableRequest.isSuccess) {
            availabilityZoneConfigs.forEach((availabilityZone) => {
                setSelectAvailabilityZones((prevState: Record<string, string>) => ({
                    ...prevState,
                    [availabilityZone.varName]: availabilityZone.mandatory
                        ? availabilityZonesVariableRequest.data[0]
                        : '',
                }));
            });
            return availabilityZonesVariableRequest.data;
        } else {
            return [];
        }
    }, [
        availabilityZoneConfigs,
        availabilityZonesVariableRequest.isSuccess,
        availabilityZonesVariableRequest.data,
        setSelectAvailabilityZones,
    ]);

    let flavorList: Flavor[] = getFlavorList(selectCsp, selectServiceHostType, versionToServicesMap.get(selectVersion));
    const [selectFlavor, setSelectFlavor] = useState<string>(serviceInfo ? serviceInfo.flavor : flavorList[0].value);
    let priceValue: string = flavorList.find((flavor) => flavor.value === selectFlavor)?.price ?? '';

    let currentServiceProviderContactDetails: ServiceProviderContactDetails | undefined =
        getContactServiceDetailsOfServiceByCsp(selectCsp, versionToServicesMap.get(selectVersion));
    let currentBilling: Billing = getBilling(selectCsp, selectServiceHostType, versionToServicesMap.get(selectVersion));

    const onChangeServiceHostingType = (serviceHostingType: UserOrderableServiceVo.serviceHostingType) => {
        location.state = undefined;
        setSelectServiceHostType(serviceHostingType);
    };

    const onChangeFlavor = (newFlavor: string) => {
        setSelectFlavor(newFlavor);
        currentBilling = getBilling(selectCsp, selectServiceHostType, versionToServicesMap.get(selectVersion));
        flavorList.forEach((flavor) => {
            if (newFlavor === flavor.value) {
                priceValue = flavor.price;
            }
        });
    };

    const onChangeRegion = (value: string) => {
        setSelectRegion(value);
    };

    const onChangeAreaValue = (newArea: string) => {
        setSelectArea(newArea);
        const currentRegionList = getRegionDropDownValues(
            selectCsp,
            selectServiceHostType,
            newArea,
            versionToServicesMap.get(selectVersion)
        );
        regionList = currentRegionList;
        setSelectRegion(currentRegionList[0]?.value ?? '');
    };

    const onChangeVersion = (currentVersion: string) => {
        cspList = getCspListForVersion(currentVersion, versionToServicesMap);
        serviceHostTypes = getAvailableServiceHostingTypes(cspList[0], versionToServicesMap.get(currentVersion));
        areaList = convertAreasToTabs(cspList[0], serviceHostTypes[0], versionToServicesMap.get(currentVersion));
        regionList = getRegionDropDownValues(
            cspList[0],
            selectServiceHostType,
            areaList[0]?.key ?? '',
            versionToServicesMap.get(currentVersion)
        );
        flavorList = getFlavorList(cspList[0], selectServiceHostType, versionToServicesMap.get(currentVersion));
        currentBilling = getBilling(cspList[0], serviceHostTypes[0], versionToServicesMap.get(currentVersion));
        currentServiceProviderContactDetails = getContactServiceDetailsOfServiceByCsp(
            cspList[0],
            versionToServicesMap.get(currentVersion)
        );
        setSelectArea(areaList[0].key);
        setSelectFlavor(flavorList[0].value);
        setSelectRegion(regionList[0].value);
        setSelectVersion(currentVersion);
        setSelectCsp(cspList[0]);
        setSelectServiceHostType(serviceHostTypes[0]);
    };

    const onChangeCloudProvider = (csp: UserOrderableServiceVo.csp) => {
        serviceHostTypes = getAvailableServiceHostingTypes(csp, versionToServicesMap.get(selectVersion));
        areaList = convertAreasToTabs(csp, serviceHostTypes[0], versionToServicesMap.get(selectVersion));
        regionList = getRegionDropDownValues(
            csp,
            serviceHostTypes[0],
            areaList[0]?.key ?? '',
            versionToServicesMap.get(selectVersion)
        );
        flavorList = getFlavorList(csp, serviceHostTypes[0], versionToServicesMap.get(selectVersion));
        currentBilling = getBilling(csp, serviceHostTypes[0], versionToServicesMap.get(selectVersion));
        currentServiceProviderContactDetails = getContactServiceDetailsOfServiceByCsp(
            csp,
            versionToServicesMap.get(selectVersion)
        );
        priceValue = flavorList[0].value;
        serviceHostTypes = getAvailableServiceHostingTypes(csp, versionToServicesMap.get(selectVersion));
        setSelectCsp(csp);
        setSelectArea(areaList[0]?.key ?? '');
        setSelectRegion(regionList[0]?.value ?? '');
        setSelectFlavor(flavorList[0]?.value ?? '');
        setSelectServiceHostType(serviceHostTypes[0]);
    };

    return (
        <>
            <Form layout='vertical' initialValues={{ selectRegion, selectFlavor }}>
                <div>
                    <NavigateOrderSubmission text={'<< Back'} to={servicePageUrl as To} props={undefined} />
                    <div className={'Line'} />
                </div>
                <div className={'generic-table-container'}>
                    <Row justify='start' gutter={10}>
                        <Col span={4}>
                            <div className={'content-title'}>Service: {serviceName}</div>
                        </Col>
                        <Col span={6}>
                            <div className={'content-title'}>
                                Version:&nbsp;
                                <Select
                                    value={selectVersion}
                                    className={'version-drop-down'}
                                    onChange={onChangeVersion}
                                    options={versionList}
                                />
                            </div>
                        </Col>
                        {currentServiceProviderContactDetails !== undefined ? (
                            <Col span={4}>
                                <ContactDetailsText
                                    serviceProviderContactDetails={currentServiceProviderContactDetails}
                                    showFor={ContactDetailsShowType.Order}
                                />
                            </Col>
                        ) : (
                            <></>
                        )}
                    </Row>

                    <br />
                    <CspSelect
                        selectCsp={selectCsp}
                        cspList={cspList}
                        onChangeHandler={(csp: UserOrderableServiceVo.csp) => {
                            onChangeCloudProvider(csp);
                        }}
                    />
                    <br />
                    <ServiceHostingSelection
                        serviceHostingTypes={serviceHostTypes}
                        updateServiceHostingType={onChangeServiceHostingType}
                        disabledAlways={false}
                        previousSelection={selectServiceHostType}
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
                                onChangeAreaValue(area);
                            }}
                        />
                    </div>
                    <RegionInfo selectRegion={selectRegion} onChangeRegion={onChangeRegion} regionList={regionList} />
                    {availabilityZonesVariableRequest.isSuccess ? (
                        <AvailabilityZoneInfo
                            availabilityZones={availabilityZones}
                            availabilityZoneConfigs={availabilityZoneConfigs}
                            selectAvailabilityZones={selectAvailabilityZones}
                            setSelectAvailabilityZones={setSelectAvailabilityZones}
                        />
                    ) : undefined}
                    <FlavorInfo selectFlavor={selectFlavor} flavorList={flavorList} onChangeFlavor={onChangeFlavor} />
                    <BillingInfo priceValue={priceValue} billing={currentBilling} />
                </div>
                <div>
                    <div className={'Line'} />
                    <GoToSubmit
                        selectedVersion={selectVersion}
                        selectedCsp={selectCsp}
                        region={{ name: selectRegion, area: selectArea }}
                        selectedFlavor={selectFlavor}
                        versionMapper={versionToServicesMap}
                        selectedServiceHostingType={selectServiceHostType}
                        currentServiceProviderContactDetails={currentServiceProviderContactDetails}
                        availabilityZones={selectAvailabilityZones}
                    />
                </div>
            </Form>
        </>
    );
}
