/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { To, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import React, { useEffect, useMemo, useState } from 'react';
import {
    AvailabilityZoneConfig,
    DeployRequest,
    ServiceProviderContactDetails,
    UserOrderableServiceVo,
} from '../../../../xpanse-api/generated';
import { Tab } from 'rc-tabs/lib/interface';
import { RegionDropDownInfo } from '../types/RegionDropDownInfo';
import { Flavor } from '../types/Flavor';
import { getSortedVersionList } from '../formDataHelpers/versionHelper';
import { getCspListForVersion } from '../formDataHelpers/cspHelper';
import { getAvailableServiceHostingTypes } from '../formDataHelpers/serviceHostingTypeHelper';
import { getContactServiceDetailsOfServiceByCsp } from '../formDataHelpers/contactServiceDetailsHelper';
import { getFlavorList } from '../formDataHelpers/flavorHelper';
import { convertAreasToTabs } from '../formDataHelpers/areaHelper';
import { getRegionDropDownValues } from '../formDataHelpers/regionHelper';
import { getBillingModes } from '../formDataHelpers/billingHelper';
import { Button, Col, Form, Row, Select, Tabs, Tooltip, Typography } from 'antd';
import NavigateOrderSubmission from './NavigateOrderSubmission';
import { ContactDetailsText } from '../../common/ocl/ContactDetailsText';
import { ContactDetailsShowType } from '../../common/ocl/ContactDetailsShowType';
import CspSelect from '../formElements/CspSelect';
import { ServiceHostingSelection } from '../common/ServiceHostingSelection';
import { RegionInfo } from '../common/RegionInfo';
import { FlavorInfo } from '../common/FlavorInfo';
import { BillingInfo } from '../common/BillingInfo';
import { orderPageRoute, servicesSubPageRoute } from '../../../utils/constants';
import { OrderSubmitProps } from '../common/utils/OrderSubmitProps';
import useGetAvailabilityZonesForRegionQuery from '../common/utils/useGetAvailabilityZonesForRegionQuery';
import { getAvailabilityZoneRequirementsForAService } from '../formDataHelpers/getAvailabilityZoneRequirementsForAService';
import { AvailabilityZoneFormItem } from '../common/availabilityzone/AvailabilityZoneFormItem';
import { getEulaByCsp } from '../formDataHelpers/eulaHelper';
import { getDeployParams } from '../formDataHelpers/deployParamsHelper';
import { BillingModeSelection } from '../common/BillingModeSelection';

export function SelectServiceForm({ services }: { services: UserOrderableServiceVo[] }): React.JSX.Element {
    const { Paragraph } = Typography;
    const [form] = Form.useForm();
    const [urlParams] = useSearchParams();
    const location = useLocation();
    const navigate = useNavigate();
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
    const [selectCsp, setSelectCsp] = useState<UserOrderableServiceVo.csp>(
        serviceInfo ? (serviceInfo.csp as UserOrderableServiceVo.csp) : cspList[0]
    );

    let serviceHostTypes: UserOrderableServiceVo.serviceHostingType[] = getAvailableServiceHostingTypes(
        selectCsp,
        versionToServicesMap.get(selectVersion)
    );
    const [selectServiceHostType, setSelectServiceHostType] = useState<UserOrderableServiceVo.serviceHostingType>(
        serviceInfo
            ? (serviceInfo.serviceHostingType as UserOrderableServiceVo.serviceHostingType)
            : serviceHostTypes[0]
    );
    let areaList: Tab[] = convertAreasToTabs(selectCsp, selectServiceHostType, versionToServicesMap.get(selectVersion));
    const [selectArea, setSelectArea] = useState<string>(serviceInfo ? serviceInfo.area : areaList[0].key);
    let regionList: RegionDropDownInfo[] = getRegionDropDownValues(
        selectCsp,
        selectServiceHostType,
        selectArea,
        versionToServicesMap.get(selectVersion)
    );
    const [selectRegion, setSelectRegion] = useState<string>(serviceInfo ? serviceInfo.region : regionList[0].value);
    const [selectAvailabilityZones, setSelectAvailabilityZones] = useState<Record<string, string>>(
        serviceInfo?.availabilityZones ?? {}
    );

    let flavorList: Flavor[] = getFlavorList(selectCsp, selectServiceHostType, versionToServicesMap.get(selectVersion));
    const [selectFlavor, setSelectFlavor] = useState<string>(serviceInfo ? serviceInfo.flavor : flavorList[0].value);

    let billingModes: DeployRequest.billingMode[] | undefined = getBillingModes(
        selectCsp,
        selectServiceHostType,
        versionToServicesMap.get(selectVersion)
    );
    const [selectBillingMode, setSelectBillMode] = useState<string>(
        serviceInfo ? serviceInfo.billingMode : billingModes ? billingModes[0] : ''
    );

    let priceValue: string = flavorList.find((flavor) => flavor.value === selectFlavor)?.price ?? '';

    let currentServiceProviderContactDetails: ServiceProviderContactDetails | undefined =
        getContactServiceDetailsOfServiceByCsp(selectCsp, versionToServicesMap.get(selectVersion));
    const currentEula: string | undefined = getEulaByCsp(selectCsp, versionToServicesMap.get(selectVersion));

    const getAvailabilityZonesForRegionQuery = useGetAvailabilityZonesForRegionQuery(selectCsp, selectRegion);
    const availabilityZoneConfigs: AvailabilityZoneConfig[] = getAvailabilityZoneRequirementsForAService(
        selectCsp,
        services
    );

    // Side effect needed to update initial state when data from backend is available.
    useEffect(() => {
        if (!serviceInfo?.availabilityZones) {
            if (getAvailabilityZonesForRegionQuery.isSuccess && getAvailabilityZonesForRegionQuery.data.length > 0) {
                if (availabilityZoneConfigs.length > 0) {
                    const defaultSelection: Record<string, string> = {};
                    availabilityZoneConfigs.forEach((availabilityZoneConfig) => {
                        if (availabilityZoneConfig.mandatory) {
                            defaultSelection[availabilityZoneConfig.varName] =
                                getAvailabilityZonesForRegionQuery.data[0];
                        }
                    });
                    setSelectAvailabilityZones(defaultSelection);
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getAvailabilityZonesForRegionQuery.isSuccess, getAvailabilityZonesForRegionQuery.data]);

    const onChangeServiceHostingType = (serviceHostingType: UserOrderableServiceVo.serviceHostingType) => {
        location.state = undefined;
        setSelectServiceHostType(serviceHostingType);
    };

    const onChangeFlavor = (newFlavor: string) => {
        setSelectFlavor(newFlavor);
        billingModes = getBillingModes(selectCsp, selectServiceHostType, versionToServicesMap.get(selectVersion));
        setSelectBillMode(billingModes ? billingModes[0] : '');
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
        billingModes = getBillingModes(cspList[0], serviceHostTypes[0], versionToServicesMap.get(currentVersion));
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
        setSelectBillMode(billingModes ? billingModes[0] : '');
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
        billingModes = getBillingModes(csp, serviceHostTypes[0], versionToServicesMap.get(selectVersion));
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
        setSelectBillMode(billingModes ? billingModes[0] : '');
    };

    function onAvailabilityZoneChange(varName: string, availabilityZone: string | undefined) {
        if (availabilityZone !== undefined) {
            setSelectAvailabilityZones((prevState: Record<string, string>) => ({
                ...prevState,
                [varName]: availabilityZone,
            }));
        } else {
            const newAvailabilityZone = selectAvailabilityZones;
            delete newAvailabilityZone[varName];
            setSelectAvailabilityZones({ ...newAvailabilityZone });
        }
    }

    function isAvailabilityZoneRequired(): boolean {
        return availabilityZoneConfigs.filter((availabilityZoneConfig) => availabilityZoneConfig.mandatory).length > 0;
    }

    const gotoOrderSubmit = function () {
        const orderSubmitParams: OrderSubmitProps = getDeployParams(
            versionToServicesMap.get(selectVersion) ?? [],
            selectCsp,
            selectServiceHostType,
            { name: selectRegion, area: selectArea },
            selectFlavor,
            currentServiceProviderContactDetails,
            selectAvailabilityZones,
            currentEula,
            selectBillingMode
        );

        navigate(
            orderPageRoute
                .concat('?serviceName=', orderSubmitParams.name)
                .concat('&version=', orderSubmitParams.version)
                .concat('#', orderSubmitParams.category),
            {
                state: orderSubmitParams,
            }
        );
    };

    return (
        <>
            <Form
                form={form}
                layout='vertical'
                autoComplete='off'
                initialValues={{ selectRegion, selectFlavor }}
                onFinish={gotoOrderSubmit}
                validateTrigger={['gotoOrderSubmit']}
            >
                <div>
                    <NavigateOrderSubmission text={'<< Back'} to={servicePageUrl as To} props={undefined} />
                    <div className={'Line'} />
                </div>
                <div className={'generic-table-container'}>
                    <Row justify='start' gutter={10}>
                        <Col span={6}>
                            <Tooltip placement='topLeft' title={serviceName}>
                                <Paragraph ellipsis={true} className={'content-title'}>
                                    Service: {serviceName}
                                </Paragraph>
                            </Tooltip>
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
                    <div className={'cloud-provider-tab-class'}>
                        Version:&nbsp;
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
                    {availabilityZoneConfigs.map((availabilityZoneConfig) => {
                        return (
                            <AvailabilityZoneFormItem
                                availabilityZoneConfig={availabilityZoneConfig}
                                selectRegion={selectRegion}
                                onAvailabilityZoneChange={onAvailabilityZoneChange}
                                selectAvailabilityZones={selectAvailabilityZones}
                                selectCsp={selectCsp}
                                key={availabilityZoneConfig.varName}
                            />
                        );
                    })}
                    <FlavorInfo selectFlavor={selectFlavor} flavorList={flavorList} onChangeFlavor={onChangeFlavor} />
                    <BillingModeSelection
                        selectBillingMode={selectBillingMode}
                        setSelectBillingMode={setSelectBillMode}
                        billingModes={billingModes}
                    />
                    <BillingInfo priceValue={priceValue} />
                </div>
                <div>
                    <div className={'Line'} />
                    <div className={'order-param-item-row'}>
                        <div className={'order-param-item-left'} />
                        <div className={'order-param-submit'}>
                            <Button
                                type='primary'
                                htmlType='submit'
                                disabled={
                                    getAvailabilityZonesForRegionQuery.isError ||
                                    (isAvailabilityZoneRequired() &&
                                        getAvailabilityZonesForRegionQuery.data?.length === 0)
                                }
                            >
                                &nbsp;&nbsp;Next&nbsp;&nbsp;
                            </Button>
                        </div>
                    </div>
                </div>
            </Form>
        </>
    );
}
