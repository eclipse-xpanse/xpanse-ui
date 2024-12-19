/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Button, Col, Form, Row, Tabs, Tooltip, Typography } from 'antd';
import { Tab } from 'rc-tabs/lib/interface';
import React, { useEffect, useMemo, useState } from 'react';
import { To, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import appStyles from '../../../../styles/app.module.css';
import serviceOrderStyles from '../../../../styles/service-order.module.css';
import tableStyles from '../../../../styles/table.module.css';
import {
    AvailabilityZoneConfig,
    billingMode,
    csp,
    Region,
    ServiceFlavor,
    serviceHostingType,
    ServiceProviderContactDetails,
    UserOrderableServiceVo,
} from '../../../../xpanse-api/generated';
import { orderPageRoute, servicesSubPageRoute } from '../../../utils/constants';
import { ApiDoc } from '../../common/doc/ApiDoc.tsx';
import { ContactDetailsShowType } from '../../common/ocl/ContactDetailsShowType';
import { ContactDetailsText } from '../../common/ocl/ContactDetailsText';
import { BillingModeSelection } from '../common/BillingModeSelection';
import { FlavorSelection } from '../common/FlavorSelection.tsx';
import { IsvNameDisplay } from '../common/IsvNameDisplay.tsx';
import { RegionSelection } from '../common/RegionSelection.tsx';
import { ServiceHostingSelection } from '../common/ServiceHostingSelection';
import { AvailabilityZoneFormItem } from '../common/availabilityzone/AvailabilityZoneFormItem';
import useGetServicePricesQuery from '../common/useGetServicePricesQuery';
import { OrderSubmitProps } from '../common/utils/OrderSubmitProps';
import useGetAvailabilityZonesForRegionQuery from '../common/utils/useGetAvailabilityZonesForRegionQuery';
import { convertAreasToTabs } from '../formDataHelpers/areaHelper';
import { getBillingModes, getDefaultBillingMode } from '../formDataHelpers/billingHelper';
import { getContactServiceDetailsOfServiceByCsp } from '../formDataHelpers/contactServiceDetailsHelper';
import { getCspListForVersion } from '../formDataHelpers/cspHelper';
import { getDeployParams } from '../formDataHelpers/deployParamsHelper';
import { getEulaByCsp } from '../formDataHelpers/eulaHelper';
import { getServiceFlavorList } from '../formDataHelpers/flavorHelper.ts';
import { getAvailabilityZoneRequirementsForAService } from '../formDataHelpers/getAvailabilityZoneRequirementsForAService';
import { getRegionDropDownValues } from '../formDataHelpers/regionHelper';
import { getAvailableServiceHostingTypes } from '../formDataHelpers/serviceHostingTypeHelper';
import { serviceVendorHelper } from '../formDataHelpers/serviceVendorHelper.ts';
import { getSortedVersionList } from '../formDataHelpers/versionHelper';
import CspSelect from '../formElements/CspSelect';
import VersionSelect from '../formElements/VersionSelect';
import { RegionDropDownInfo } from '../types/RegionDropDownInfo';
import NavigateOrderSubmission from './NavigateOrderSubmission';

export function SelectServiceForm({ services }: { services: UserOrderableServiceVo[] }): React.JSX.Element {
    const { Paragraph } = Typography;
    const [form] = Form.useForm();
    const [urlParams] = useSearchParams();
    const location = useLocation();
    const navigate = useNavigate();
    const latestVersion = decodeURI(urlParams.get('latestVersion') ?? '');
    const serviceName = decodeURI(urlParams.get('serviceName') ?? '');
    const categoryName: string = location.hash.split('#')[1];
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
    let cspList: csp[] = getCspListForVersion(selectVersion, versionToServicesMap);
    const [selectCsp, setSelectCsp] = useState<csp>(serviceInfo ? serviceInfo.csp : cspList[0]);

    let serviceHostTypes: serviceHostingType[] = getAvailableServiceHostingTypes(
        selectCsp,
        versionToServicesMap.get(selectVersion)
    );
    const [selectServiceHostType, setSelectServiceHostType] = useState<serviceHostingType>(
        serviceInfo ? serviceInfo.serviceHostingType : serviceHostTypes[0]
    );
    let areaList: Tab[] = convertAreasToTabs(selectCsp, selectServiceHostType, versionToServicesMap.get(selectVersion));
    const [selectArea, setSelectArea] = useState<string>(serviceInfo ? serviceInfo.area : areaList[0].key);
    let regionList: RegionDropDownInfo[] = getRegionDropDownValues(
        selectCsp,
        selectServiceHostType,
        selectArea,
        versionToServicesMap.get(selectVersion)
    );
    const [selectRegion, setSelectRegion] = useState<Region>(serviceInfo ? serviceInfo.region : regionList[0].region);

    // get the service vendor from the service template with servicename, category, serviceVersion, csp and serviceHostType
    const selectServiceVendor = serviceVendorHelper(
        selectCsp,
        selectServiceHostType,
        versionToServicesMap.get(selectVersion)
    );

    const [serviceVendor, setServiceVendor] = useState<string>(
        serviceInfo ? serviceInfo.serviceVendor : selectServiceVendor
    );

    const getServiceTemplateId = (): string => {
        const service = services.find(
            (service) =>
                service.version === selectVersion &&
                service.csp === selectCsp &&
                selectServiceHostType === service.serviceHostingType
        );
        return service ? service.serviceTemplateId : '';
    };
    const [selectAvailabilityZones, setSelectAvailabilityZones] = useState<Record<string, string>>(
        serviceInfo?.availabilityZones ?? {}
    );

    let flavorList: ServiceFlavor[] = getServiceFlavorList(
        selectCsp,
        selectServiceHostType,
        versionToServicesMap.get(selectVersion)
    );
    const [selectFlavor, setSelectFlavor] = useState<string>(serviceInfo ? serviceInfo.flavor : flavorList[0].name);

    let billingModes: billingMode[] | undefined = getBillingModes(
        selectCsp,
        selectServiceHostType,
        versionToServicesMap.get(selectVersion)
    );
    let defaultBillingMode: billingMode | undefined = getDefaultBillingMode(
        selectCsp,
        selectServiceHostType,
        versionToServicesMap.get(selectVersion)
    );
    const [selectBillingMode, setSelectBillMode] = useState<billingMode>(
        serviceInfo
            ? serviceInfo.billingMode
            : defaultBillingMode
              ? defaultBillingMode
              : billingModes
                ? billingModes[0]
                : billingMode.FIXED
    );

    let currentServiceProviderContactDetails: ServiceProviderContactDetails | undefined =
        getContactServiceDetailsOfServiceByCsp(selectCsp, versionToServicesMap.get(selectVersion));
    const currentEula: string | undefined = getEulaByCsp(selectCsp, versionToServicesMap.get(selectVersion));

    const getAvailabilityZonesForRegionQuery = useGetAvailabilityZonesForRegionQuery(
        selectCsp,
        selectRegion,
        getServiceTemplateId()
    );
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

    const onChangeServiceHostingType = (serviceHostingType: serviceHostingType) => {
        location.state = undefined;
        setSelectServiceHostType(serviceHostingType);
        setServiceVendor(serviceVendorHelper(selectCsp, serviceHostingType, versionToServicesMap.get(selectVersion)));

        areaList = convertAreasToTabs(selectCsp, serviceHostingType, versionToServicesMap.get(selectVersion));
        setSelectArea(areaList[0].key);

        regionList = getRegionDropDownValues(
            selectCsp,
            serviceHostingType,
            areaList[0].key,
            versionToServicesMap.get(selectVersion)
        );
        setSelectRegion(regionList[0].region);
        billingModes = getBillingModes(selectCsp, serviceHostingType, versionToServicesMap.get(selectVersion));
        defaultBillingMode = getDefaultBillingMode(
            selectCsp,
            serviceHostingType,
            versionToServicesMap.get(selectVersion)
        );
        setSelectBillMode(defaultBillingMode ? defaultBillingMode : billingModes ? billingModes[0] : billingMode.FIXED);

        flavorList = getServiceFlavorList(selectCsp, serviceHostingType, versionToServicesMap.get(selectVersion));
        setSelectFlavor(flavorList[0]?.name ?? '');
    };

    const onChangeRegion = (region: Region) => {
        setSelectRegion(region);
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
        setSelectRegion(currentRegionList[0].region);
    };

    const onChangeVersion = (currentVersion: string) => {
        cspList = getCspListForVersion(currentVersion, versionToServicesMap);
        serviceHostTypes = getAvailableServiceHostingTypes(cspList[0], versionToServicesMap.get(currentVersion));
        areaList = convertAreasToTabs(cspList[0], serviceHostTypes[0], versionToServicesMap.get(currentVersion));
        regionList = getRegionDropDownValues(
            cspList[0],
            serviceHostTypes[0],
            areaList[0]?.key ?? '',
            versionToServicesMap.get(currentVersion)
        );
        flavorList = getServiceFlavorList(cspList[0], serviceHostTypes[0], versionToServicesMap.get(currentVersion));
        billingModes = getBillingModes(cspList[0], serviceHostTypes[0], versionToServicesMap.get(currentVersion));
        currentServiceProviderContactDetails = getContactServiceDetailsOfServiceByCsp(
            cspList[0],
            versionToServicesMap.get(currentVersion)
        );
        setSelectArea(areaList[0].key);
        setSelectFlavor(flavorList[0].name);
        setSelectRegion(regionList[0].region);
        setSelectVersion(currentVersion);
        setSelectCsp(cspList[0]);
        setSelectServiceHostType(serviceHostTypes[0]);
        defaultBillingMode = getDefaultBillingMode(
            cspList[0],
            serviceHostTypes[0],
            versionToServicesMap.get(currentVersion)
        );
        setServiceVendor(
            serviceVendorHelper(cspList[0], serviceHostTypes[0], versionToServicesMap.get(currentVersion))
        );
        setSelectBillMode(defaultBillingMode ? defaultBillingMode : billingModes ? billingModes[0] : billingMode.FIXED);
    };

    const onChangeCloudProvider = (csp: csp) => {
        setSelectCsp(csp);

        serviceHostTypes = getAvailableServiceHostingTypes(csp, versionToServicesMap.get(selectVersion));
        setSelectServiceHostType(serviceHostTypes[0]);

        setServiceVendor(serviceVendorHelper(csp, serviceHostTypes[0], versionToServicesMap.get(selectVersion)));

        areaList = convertAreasToTabs(csp, serviceHostTypes[0], versionToServicesMap.get(selectVersion));
        setSelectArea(areaList[0]?.key ?? '');

        regionList = getRegionDropDownValues(
            csp,
            serviceHostTypes[0],
            areaList[0]?.key ?? '',
            versionToServicesMap.get(selectVersion)
        );
        setSelectRegion(regionList[0].region);

        billingModes = getBillingModes(csp, serviceHostTypes[0], versionToServicesMap.get(selectVersion));
        defaultBillingMode = getDefaultBillingMode(csp, serviceHostTypes[0], versionToServicesMap.get(selectVersion));
        setSelectBillMode(defaultBillingMode ? defaultBillingMode : billingModes ? billingModes[0] : billingMode.FIXED);

        flavorList = getServiceFlavorList(csp, serviceHostTypes[0], versionToServicesMap.get(selectVersion));
        setSelectFlavor(flavorList[0]?.name ?? '');

        currentServiceProviderContactDetails = getContactServiceDetailsOfServiceByCsp(
            csp,
            versionToServicesMap.get(selectVersion)
        );
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

    const getServicePriceQuery = useGetServicePricesQuery(
        getServiceTemplateId(),
        selectRegion.name,
        selectRegion.site,
        selectBillingMode,
        flavorList
    );

    const gotoOrderSubmit = function () {
        const orderSubmitParams: OrderSubmitProps = getDeployParams(
            versionToServicesMap.get(selectVersion) ?? [],
            selectCsp,
            selectServiceHostType,
            selectRegion,
            selectFlavor,
            currentServiceProviderContactDetails,
            selectAvailabilityZones,
            currentEula,
            selectBillingMode
        );

        void navigate(
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
                layout='inline'
                autoComplete='off'
                initialValues={{ selectRegion, selectFlavor }}
                onFinish={gotoOrderSubmit}
                validateTrigger={['gotoOrderSubmit']}
                className={serviceOrderStyles.orderFormInlineDisplay}
            >
                <div className={tableStyles.genericTableContainer}>
                    <Row justify='space-between'>
                        <Col span={6}>
                            <Tooltip placement='topLeft' title={serviceName}>
                                <Paragraph ellipsis={true} className={appStyles.contentTitle}>
                                    Service: {serviceName}
                                </Paragraph>
                            </Tooltip>
                        </Col>
                        {currentServiceProviderContactDetails !== undefined ? (
                            <Col span={8}>
                                <div className={serviceOrderStyles.serviceVendorContactClass}>
                                    <div className={serviceOrderStyles.serviceApiDocClass}>
                                        <ApiDoc
                                            id={getServiceTemplateId()}
                                            styleClass={serviceOrderStyles.contentTitleApi}
                                        ></ApiDoc>
                                    </div>
                                    <div className={serviceOrderStyles.serviceOrderTypeOptionVendor}>
                                        <IsvNameDisplay serviceVendor={serviceVendor} />
                                    </div>
                                    <div>
                                        {' '}
                                        <ContactDetailsText
                                            serviceProviderContactDetails={currentServiceProviderContactDetails}
                                            showFor={ContactDetailsShowType.Order}
                                        />
                                    </div>
                                </div>
                            </Col>
                        ) : (
                            <></>
                        )}
                    </Row>
                    <div className={serviceOrderStyles.orderFormGroupItems}>
                        <VersionSelect
                            selectVersion={selectVersion}
                            versionList={versionList}
                            onChangeVersion={(version: string) => {
                                onChangeVersion(version);
                            }}
                        />
                        <br />
                        <CspSelect
                            selectCsp={selectCsp}
                            cspList={cspList}
                            onChangeHandler={(csp: csp) => {
                                onChangeCloudProvider(csp);
                            }}
                        />
                        <br />
                        <ServiceHostingSelection
                            serviceHostingTypes={serviceHostTypes}
                            updateServiceHostingType={onChangeServiceHostingType}
                            disabledAlways={false}
                            previousSelection={selectServiceHostType}
                        />
                    </div>
                    <div className={serviceOrderStyles.orderFormGroupItems}>
                        <br />
                        <div className={`${serviceOrderStyles.orderFormSelectionStyle} ${appStyles.contentTitle}`}>
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
                        <RegionSelection
                            selectArea={selectArea}
                            selectRegion={selectRegion}
                            onChangeRegion={onChangeRegion}
                            disabled={false}
                            regionList={regionList}
                        />
                        {availabilityZoneConfigs.map((availabilityZoneConfig) => {
                            return (
                                <div
                                    key={availabilityZoneConfig.varName}
                                    className={serviceOrderStyles.orderFormAzConfigs}
                                >
                                    <AvailabilityZoneFormItem
                                        availabilityZoneConfig={availabilityZoneConfig}
                                        selectRegion={selectRegion}
                                        onAvailabilityZoneChange={onAvailabilityZoneChange}
                                        selectAvailabilityZones={selectAvailabilityZones}
                                        selectCsp={selectCsp}
                                        key={availabilityZoneConfig.varName}
                                        selectedServiceTemplateId={getServiceTemplateId()}
                                    />
                                </div>
                            );
                        })}
                    </div>
                    <div className={serviceOrderStyles.orderFormGroupItems}>
                        <BillingModeSelection
                            selectBillingMode={selectBillingMode}
                            setSelectBillingMode={setSelectBillMode}
                            billingModes={billingModes}
                        />
                        <FlavorSelection
                            selectFlavor={selectFlavor}
                            setSelectFlavor={setSelectFlavor}
                            flavorList={flavorList}
                            getServicePriceQuery={getServicePriceQuery}
                        />
                    </div>
                </div>
                <Row justify='space-around'>
                    <Col span={6}>
                        <div>
                            <NavigateOrderSubmission
                                text={'Back'}
                                to={servicePageUrl as To}
                                props={undefined}
                                disabled={false}
                            />
                        </div>
                    </Col>
                    <Col span={4}>
                        <div className={serviceOrderStyles.orderParamSubmit}>
                            <Button
                                type='primary'
                                htmlType='submit'
                                disabled={
                                    getAvailabilityZonesForRegionQuery.isPending ||
                                    getServicePriceQuery.isPending ||
                                    getServicePriceQuery.isError ||
                                    (isAvailabilityZoneRequired() && getAvailabilityZonesForRegionQuery.isError)
                                }
                            >
                                &nbsp;&nbsp;Next&nbsp;&nbsp;
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Form>
        </>
    );
}
