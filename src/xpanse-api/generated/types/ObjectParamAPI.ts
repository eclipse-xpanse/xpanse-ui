/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Configuration } from '../configuration';
import { CategoryOclVo } from '../models/CategoryOclVo';
import { CreateRequest } from '../models/CreateRequest';
import { Ocl } from '../models/Ocl';
import { RegisteredServiceVo } from '../models/RegisteredServiceVo';
import { Response } from '../models/Response';
import { ServiceDetailVo } from '../models/ServiceDetailVo';
import { ServiceVo } from '../models/ServiceVo';
import { SystemStatus } from '../models/SystemStatus';
import { UserAvailableServiceVo } from '../models/UserAvailableServiceVo';

import {
    ObservableAdminApi,
    ObservableServiceApi,
    ObservableServicesAvailableApi,
    ObservableServiceVendorApi,
} from './ObservableAPI';
import { AdminApiRequestFactory, AdminApiResponseProcessor } from '../apis/AdminApi';
import { ServiceApiRequestFactory, ServiceApiResponseProcessor } from '../apis/ServiceApi';
import { ServiceVendorApiRequestFactory, ServiceVendorApiResponseProcessor } from '../apis/ServiceVendorApi';
import {
    ServicesAvailableApiRequestFactory,
    ServicesAvailableApiResponseProcessor,
} from '../apis/ServicesAvailableApi';

export interface AdminApiHealthRequest {}

export class ObjectAdminApi {
    private api: ObservableAdminApi;

    public constructor(
        configuration: Configuration,
        requestFactory?: AdminApiRequestFactory,
        responseProcessor?: AdminApiResponseProcessor
    ) {
        this.api = new ObservableAdminApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * @param param the request object
     */
    public health(param: AdminApiHealthRequest = {}, options?: Configuration): Promise<SystemStatus> {
        return this.api.health(options).toPromise();
    }
}

export interface ServiceApiDeployRequest {
    /**
     *
     * @type CreateRequest
     * @memberof ServiceApideploy
     */
    createRequest: CreateRequest;
}

export interface ServiceApiDestroyRequest {
    /**
     *
     * @type string
     * @memberof ServiceApidestroy
     */
    id: string;
}

export interface ServiceApiListDeployedServicesRequest {}

export interface ServiceApiServiceDetailRequest {
    /**
     * Task id of deploy service
     * @type string
     * @memberof ServiceApiserviceDetail
     */
    id: string;
}

export class ObjectServiceApi {
    private api: ObservableServiceApi;

    public constructor(
        configuration: Configuration,
        requestFactory?: ServiceApiRequestFactory,
        responseProcessor?: ServiceApiResponseProcessor
    ) {
        this.api = new ObservableServiceApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Start a task to deploy registered service.
     * @param param the request object
     */
    public deploy(param: ServiceApiDeployRequest, options?: Configuration): Promise<string> {
        return this.api.deploy(param.createRequest, options).toPromise();
    }

    /**
     * Start a task to destroy the deployed service using id.
     * @param param the request object
     */
    public destroy(param: ServiceApiDestroyRequest, options?: Configuration): Promise<Response> {
        return this.api.destroy(param.id, options).toPromise();
    }

    /**
     * List the deployed services.
     * @param param the request object
     */
    public listDeployedServices(
        param: ServiceApiListDeployedServicesRequest = {},
        options?: Configuration
    ): Promise<Array<ServiceVo>> {
        return this.api.listDeployedServices(options).toPromise();
    }

    /**
     * Get deployed service using id.
     * @param param the request object
     */
    public serviceDetail(param: ServiceApiServiceDetailRequest, options?: Configuration): Promise<ServiceDetailVo> {
        return this.api.serviceDetail(param.id, options).toPromise();
    }
}

export interface ServiceVendorApiDetailRequest {
    /**
     * id of registered service
     * @type string
     * @memberof ServiceVendorApidetail
     */
    id: string;
}

export interface ServiceVendorApiFetchRequest {
    /**
     * URL of Ocl file
     * @type string
     * @memberof ServiceVendorApifetch
     */
    oclLocation: string;
}

export interface ServiceVendorApiFetchUpdateRequest {
    /**
     * id of registered service
     * @type string
     * @memberof ServiceVendorApifetchUpdate
     */
    id: string;
    /**
     * URL of Ocl file
     * @type string
     * @memberof ServiceVendorApifetchUpdate
     */
    oclLocation: string;
}

export interface ServiceVendorApiListCategoriesRequest {}

export interface ServiceVendorApiListRegisteredServicesRequest {
    /**
     * category of the service
     * @type string
     * @memberof ServiceVendorApilistRegisteredServices
     */
    categoryName?: string;
    /**
     * name of the service provider
     * @type string
     * @memberof ServiceVendorApilistRegisteredServices
     */
    cspName?: string;
    /**
     * name of the service
     * @type string
     * @memberof ServiceVendorApilistRegisteredServices
     */
    serviceName?: string;
    /**
     * version of the service
     * @type string
     * @memberof ServiceVendorApilistRegisteredServices
     */
    serviceVersion?: string;
}

export interface ServiceVendorApiRegisterRequest {
    /**
     *
     * @type Ocl
     * @memberof ServiceVendorApiregister
     */
    ocl: Ocl;
}

export interface ServiceVendorApiUnregisterRequest {
    /**
     * id of registered service
     * @type string
     * @memberof ServiceVendorApiunregister
     */
    id: string;
}

export interface ServiceVendorApiUpdateRequest {
    /**
     * id of registered service
     * @type string
     * @memberof ServiceVendorApiupdate
     */
    id: string;
    /**
     *
     * @type Ocl
     * @memberof ServiceVendorApiupdate
     */
    ocl: Ocl;
}

export class ObjectServiceVendorApi {
    private api: ObservableServiceVendorApi;

    public constructor(
        configuration: Configuration,
        requestFactory?: ServiceVendorApiRequestFactory,
        responseProcessor?: ServiceVendorApiResponseProcessor
    ) {
        this.api = new ObservableServiceVendorApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Get registered service using id.
     * @param param the request object
     */
    public detail(param: ServiceVendorApiDetailRequest, options?: Configuration): Promise<RegisteredServiceVo> {
        return this.api.detail(param.id, options).toPromise();
    }

    /**
     * Register new service with URL of Ocl file.
     * @param param the request object
     */
    public fetch(param: ServiceVendorApiFetchRequest, options?: Configuration): Promise<RegisteredServiceVo> {
        return this.api.fetch(param.oclLocation, options).toPromise();
    }

    /**
     * Update registered service using id and ocl file url.
     * @param param the request object
     */
    public fetchUpdate(
        param: ServiceVendorApiFetchUpdateRequest,
        options?: Configuration
    ): Promise<RegisteredServiceVo> {
        return this.api.fetchUpdate(param.id, param.oclLocation, options).toPromise();
    }

    /**
     * Get category list.
     * @param param the request object
     */
    public listCategories(
        param: ServiceVendorApiListCategoriesRequest = {},
        options?: Configuration
    ): Promise<Array<string>> {
        return this.api.listCategories(options).toPromise();
    }

    /**
     * List registered service with query params.
     * @param param the request object
     */
    public listRegisteredServices(
        param: ServiceVendorApiListRegisteredServicesRequest = {},
        options?: Configuration
    ): Promise<Array<RegisteredServiceVo>> {
        return this.api
            .listRegisteredServices(param.categoryName, param.cspName, param.serviceName, param.serviceVersion, options)
            .toPromise();
    }

    /**
     * Register new service using ocl model.
     * @param param the request object
     */
    public register(param: ServiceVendorApiRegisterRequest, options?: Configuration): Promise<RegisteredServiceVo> {
        return this.api.register(param.ocl, options).toPromise();
    }

    /**
     * Unregister registered service using id.
     * @param param the request object
     */
    public unregister(param: ServiceVendorApiUnregisterRequest, options?: Configuration): Promise<Response> {
        return this.api.unregister(param.id, options).toPromise();
    }

    /**
     * Update registered service using id and ocl model.
     * @param param the request object
     */
    public update(param: ServiceVendorApiUpdateRequest, options?: Configuration): Promise<RegisteredServiceVo> {
        return this.api.update(param.id, param.ocl, options).toPromise();
    }
}

export interface ServicesAvailableApiAvailableServiceDetailRequest {
    /**
     * The id of available service.
     * @type string
     * @memberof ServicesAvailableApiavailableServiceDetail
     */
    id: string;
}

export interface ServicesAvailableApiGetAvailableServicesTreeRequest {
    /**
     * category of the service
     * @type string
     * @memberof ServicesAvailableApigetAvailableServicesTree
     */
    categoryName: string;
}

export interface ServicesAvailableApiListAvailableServicesRequest {
    /**
     * category of the service
     * @type string
     * @memberof ServicesAvailableApilistAvailableServices
     */
    categoryName?: string;
    /**
     * name of the service provider
     * @type string
     * @memberof ServicesAvailableApilistAvailableServices
     */
    cspName?: string;
    /**
     * name of the service
     * @type string
     * @memberof ServicesAvailableApilistAvailableServices
     */
    serviceName?: string;
    /**
     * version of the service
     * @type string
     * @memberof ServicesAvailableApilistAvailableServices
     */
    serviceVersion?: string;
}

export interface ServicesAvailableApiOpenApiRequest {
    /**
     *
     * @type string
     * @memberof ServicesAvailableApiopenApi
     */
    id: string;
}

export class ObjectServicesAvailableApi {
    private api: ObservableServicesAvailableApi;

    public constructor(
        configuration: Configuration,
        requestFactory?: ServicesAvailableApiRequestFactory,
        responseProcessor?: ServicesAvailableApiResponseProcessor
    ) {
        this.api = new ObservableServicesAvailableApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Get available service by id.
     * @param param the request object
     */
    public availableServiceDetail(
        param: ServicesAvailableApiAvailableServiceDetailRequest,
        options?: Configuration
    ): Promise<UserAvailableServiceVo> {
        return this.api.availableServiceDetail(param.id, options).toPromise();
    }

    /**
     * Get the available services by tree.
     * @param param the request object
     */
    public getAvailableServicesTree(
        param: ServicesAvailableApiGetAvailableServicesTreeRequest,
        options?: Configuration
    ): Promise<Array<CategoryOclVo>> {
        return this.api.getAvailableServicesTree(param.categoryName, options).toPromise();
    }

    /**
     * List the available services.
     * @param param the request object
     */
    public listAvailableServices(
        param: ServicesAvailableApiListAvailableServicesRequest = {},
        options?: Configuration
    ): Promise<Array<UserAvailableServiceVo>> {
        return this.api
            .listAvailableServices(param.categoryName, param.cspName, param.serviceName, param.serviceVersion, options)
            .toPromise();
    }

    /**
     * Get the API document of the available service.
     * @param param the request object
     */
    public openApi(param: ServicesAvailableApiOpenApiRequest, options?: Configuration): Promise<any> {
        return this.api.openApi(param.id, options).toPromise();
    }
}
