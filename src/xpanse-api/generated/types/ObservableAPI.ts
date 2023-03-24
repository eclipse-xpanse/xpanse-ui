/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { RequestContext, ResponseContext } from '../http/http';
import { Configuration } from '../configuration';
import { Observable, of, from } from '../rxjsStub';
import { mergeMap, map } from '../rxjsStub';
import { Billing } from '../models/Billing';
import { CategoryOclVo } from '../models/CategoryOclVo';
import { CloudServiceProvider } from '../models/CloudServiceProvider';
import { CreateRequest } from '../models/CreateRequest';
import { DeployResourceEntity } from '../models/DeployResourceEntity';
import { DeployServiceEntity } from '../models/DeployServiceEntity';
import { DeployVariable } from '../models/DeployVariable';
import { Deployment } from '../models/Deployment';
import { Flavor } from '../models/Flavor';
import { Ocl } from '../models/Ocl';
import { OclDetailVo } from '../models/OclDetailVo';
import { ProviderOclVo } from '../models/ProviderOclVo';
import { Region } from '../models/Region';
import { RegisterServiceEntity } from '../models/RegisterServiceEntity';
import { Response } from '../models/Response';
import { ServiceVo } from '../models/ServiceVo';
import { SystemStatus } from '../models/SystemStatus';
import { VersionOclVo } from '../models/VersionOclVo';

import { AdminApiRequestFactory, AdminApiResponseProcessor } from '../apis/AdminApi';
import { ServiceApiRequestFactory, ServiceApiResponseProcessor } from '../apis/ServiceApi';
import { ServiceVendorApiRequestFactory, ServiceVendorApiResponseProcessor } from '../apis/ServiceVendorApi';
export class ObservableAdminApi {
    private requestFactory: AdminApiRequestFactory;
    private responseProcessor: AdminApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: AdminApiRequestFactory,
        responseProcessor?: AdminApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new AdminApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new AdminApiResponseProcessor();
    }

    /**
     */
    public health(_options?: Configuration): Observable<SystemStatus> {
        const requestContextPromise = this.requestFactory.health(_options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(
                mergeMap((ctx: RequestContext) => middleware.pre(ctx))
            );
        }

        return middlewarePreObservable
            .pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx)))
            .pipe(
                mergeMap((response: ResponseContext) => {
                    let middlewarePostObservable = of(response);
                    for (let middleware of this.configuration.middleware) {
                        middlewarePostObservable = middlewarePostObservable.pipe(
                            mergeMap((rsp: ResponseContext) => middleware.post(rsp))
                        );
                    }
                    return middlewarePostObservable.pipe(
                        map((rsp: ResponseContext) => this.responseProcessor.health(rsp))
                    );
                })
            );
    }
}


export class ObservableServiceApi {
    private requestFactory: ServiceApiRequestFactory;
    private responseProcessor: ServiceApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: ServiceApiRequestFactory,
        responseProcessor?: ServiceApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new ServiceApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new ServiceApiResponseProcessor();
    }

    /**
     * Start a task to deploy registered service.
     * @param createRequest
     */
    public deploy(createRequest: CreateRequest, _options?: Configuration): Observable<string> {
        const requestContextPromise = this.requestFactory.deploy(createRequest, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(
                mergeMap((ctx: RequestContext) => middleware.pre(ctx))
            );
        }

        return middlewarePreObservable
            .pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx)))
            .pipe(
                mergeMap((response: ResponseContext) => {
                    let middlewarePostObservable = of(response);
                    for (let middleware of this.configuration.middleware) {
                        middlewarePostObservable = middlewarePostObservable.pipe(
                            mergeMap((rsp: ResponseContext) => middleware.post(rsp))
                        );
                    }
                    return middlewarePostObservable.pipe(
                        map((rsp: ResponseContext) => this.responseProcessor.deploy(rsp))
                    );
                })
            );
    }

    /**
     * Start a task to destroy the deployed service using id.
     * @param id
     */
    public destroy(id: string, _options?: Configuration): Observable<Response> {
        const requestContextPromise = this.requestFactory.destroy(id, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(
                mergeMap((ctx: RequestContext) => middleware.pre(ctx))
            );
        }

        return middlewarePreObservable
            .pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx)))
            .pipe(
                mergeMap((response: ResponseContext) => {
                    let middlewarePostObservable = of(response);
                    for (let middleware of this.configuration.middleware) {
                        middlewarePostObservable = middlewarePostObservable.pipe(
                            mergeMap((rsp: ResponseContext) => middleware.post(rsp))
                        );
                    }
                    return middlewarePostObservable.pipe(
                        map((rsp: ResponseContext) => this.responseProcessor.destroy(rsp))
                    );
                })
            );
    }

    /**
     * @param id
     */
    public openApi(id: string, _options?: Configuration): Observable<string> {
        const requestContextPromise = this.requestFactory.openApi(id, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(
                mergeMap((ctx: RequestContext) => middleware.pre(ctx))
            );
        }

        return middlewarePreObservable
            .pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx)))
            .pipe(
                mergeMap((response: ResponseContext) => {
                    let middlewarePostObservable = of(response);
                    for (let middleware of this.configuration.middleware) {
                        middlewarePostObservable = middlewarePostObservable.pipe(
                            mergeMap((rsp: ResponseContext) => middleware.post(rsp))
                        );
                    }
                    return middlewarePostObservable.pipe(
                        map((rsp: ResponseContext) => this.responseProcessor.openApi(rsp))
                    );
                })
            );
    }

    /**
     * Get deployed service using id.
     * @param id Task id of deploy service
     */
    public serviceDetail(id: string, _options?: Configuration): Observable<DeployServiceEntity> {
        const requestContextPromise = this.requestFactory.serviceDetail(id, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(
                mergeMap((ctx: RequestContext) => middleware.pre(ctx))
            );
        }

        return middlewarePreObservable
            .pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx)))
            .pipe(
                mergeMap((response: ResponseContext) => {
                    let middlewarePostObservable = of(response);
                    for (let middleware of this.configuration.middleware) {
                        middlewarePostObservable = middlewarePostObservable.pipe(
                            mergeMap((rsp: ResponseContext) => middleware.post(rsp))
                        );
                    }
                    return middlewarePostObservable.pipe(
                        map((rsp: ResponseContext) => this.responseProcessor.serviceDetail(rsp))
                    );
                })
            );
    }

    /**
     * List the deployed services.
     */
    public services(_options?: Configuration): Observable<Array<ServiceVo>> {
        const requestContextPromise = this.requestFactory.services(_options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(
                mergeMap((ctx: RequestContext) => middleware.pre(ctx))
            );
        }

        return middlewarePreObservable
            .pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx)))
            .pipe(
                mergeMap((response: ResponseContext) => {
                    let middlewarePostObservable = of(response);
                    for (let middleware of this.configuration.middleware) {
                        middlewarePostObservable = middlewarePostObservable.pipe(
                            mergeMap((rsp: ResponseContext) => middleware.post(rsp))
                        );
                    }
                    return middlewarePostObservable.pipe(
                        map((rsp: ResponseContext) => this.responseProcessor.services(rsp))
                    );
                })
            );
    }
}


export class ObservableServiceVendorApi {
    private requestFactory: ServiceVendorApiRequestFactory;
    private responseProcessor: ServiceVendorApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: ServiceVendorApiRequestFactory,
        responseProcessor?: ServiceVendorApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new ServiceVendorApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new ServiceVendorApiResponseProcessor();
    }

    /**
     * Get registered service using id.
     * @param id id of registered service
     */
    public detail(id: string, _options?: Configuration): Observable<OclDetailVo> {
        const requestContextPromise = this.requestFactory.detail(id, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(
                mergeMap((ctx: RequestContext) => middleware.pre(ctx))
            );
        }

        return middlewarePreObservable
            .pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx)))
            .pipe(
                mergeMap((response: ResponseContext) => {
                    let middlewarePostObservable = of(response);
                    for (let middleware of this.configuration.middleware) {
                        middlewarePostObservable = middlewarePostObservable.pipe(
                            mergeMap((rsp: ResponseContext) => middleware.post(rsp))
                        );
                    }
                    return middlewarePostObservable.pipe(
                        map((rsp: ResponseContext) => this.responseProcessor.detail(rsp))
                    );
                })
            );
    }

    /**
     * Register new service with URL of Ocl file.
     * @param oclLocation URL of Ocl file
     */
    public fetch(oclLocation: string, _options?: Configuration): Observable<string> {
        const requestContextPromise = this.requestFactory.fetch(oclLocation, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(
                mergeMap((ctx: RequestContext) => middleware.pre(ctx))
            );
        }

        return middlewarePreObservable
            .pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx)))
            .pipe(
                mergeMap((response: ResponseContext) => {
                    let middlewarePostObservable = of(response);
                    for (let middleware of this.configuration.middleware) {
                        middlewarePostObservable = middlewarePostObservable.pipe(
                            mergeMap((rsp: ResponseContext) => middleware.post(rsp))
                        );
                    }
                    return middlewarePostObservable.pipe(
                        map((rsp: ResponseContext) => this.responseProcessor.fetch(rsp))
                    );
                })
            );
    }

    /**
     * Update registered service using id and ocl file url.
     * @param id id of registered service
     * @param oclLocation URL of Ocl file
     */
    public fetchUpdate(id: string, oclLocation: string, _options?: Configuration): Observable<Response> {
        const requestContextPromise = this.requestFactory.fetchUpdate(id, oclLocation, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(
                mergeMap((ctx: RequestContext) => middleware.pre(ctx))
            );
        }

        return middlewarePreObservable
            .pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx)))
            .pipe(
                mergeMap((response: ResponseContext) => {
                    let middlewarePostObservable = of(response);
                    for (let middleware of this.configuration.middleware) {
                        middlewarePostObservable = middlewarePostObservable.pipe(
                            mergeMap((rsp: ResponseContext) => middleware.post(rsp))
                        );
                    }
                    return middlewarePostObservable.pipe(
                        map((rsp: ResponseContext) => this.responseProcessor.fetchUpdate(rsp))
                    );
                })
            );
    }

    /**
     * Get category list.
     */
    public listCategories(_options?: Configuration): Observable<Array<string>> {
        const requestContextPromise = this.requestFactory.listCategories(_options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(
                mergeMap((ctx: RequestContext) => middleware.pre(ctx))
            );
        }

        return middlewarePreObservable
            .pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx)))
            .pipe(
                mergeMap((response: ResponseContext) => {
                    let middlewarePostObservable = of(response);
                    for (let middleware of this.configuration.middleware) {
                        middlewarePostObservable = middlewarePostObservable.pipe(
                            mergeMap((rsp: ResponseContext) => middleware.post(rsp))
                        );
                    }
                    return middlewarePostObservable.pipe(
                        map((rsp: ResponseContext) => this.responseProcessor.listCategories(rsp))
                    );
                })
            );
    }

    /**
     * List registered service with query params.
     * @param categoryName category of the service
     * @param cspName name of the service provider
     * @param serviceName name of the service
     * @param serviceVersion version of the service
     */
    public listRegisteredServices(
        categoryName?: string,
        cspName?: string,
        serviceName?: string,
        serviceVersion?: string,
        _options?: Configuration
    ): Observable<Array<RegisterServiceEntity>> {
        const requestContextPromise = this.requestFactory.listRegisteredServices(
            categoryName,
            cspName,
            serviceName,
            serviceVersion,
            _options
        );

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(
                mergeMap((ctx: RequestContext) => middleware.pre(ctx))
            );
        }

        return middlewarePreObservable
            .pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx)))
            .pipe(
                mergeMap((response: ResponseContext) => {
                    let middlewarePostObservable = of(response);
                    for (let middleware of this.configuration.middleware) {
                        middlewarePostObservable = middlewarePostObservable.pipe(
                            mergeMap((rsp: ResponseContext) => middleware.post(rsp))
                        );
                    }
                    return middlewarePostObservable.pipe(
                        map((rsp: ResponseContext) => this.responseProcessor.listRegisteredServices(rsp))
                    );
                })
            );
    }

    /**
     * List registered service group by serviceName, serviceVersion, cspName with category.
     * @param categoryName category of the service
     */
    public listRegisteredServicesTree(
        categoryName: string,
        _options?: Configuration
    ): Observable<Array<CategoryOclVo>> {
        const requestContextPromise = this.requestFactory.listRegisteredServicesTree(categoryName, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(
                mergeMap((ctx: RequestContext) => middleware.pre(ctx))
            );
        }

        return middlewarePreObservable
            .pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx)))
            .pipe(
                mergeMap((response: ResponseContext) => {
                    let middlewarePostObservable = of(response);
                    for (let middleware of this.configuration.middleware) {
                        middlewarePostObservable = middlewarePostObservable.pipe(
                            mergeMap((rsp: ResponseContext) => middleware.post(rsp))
                        );
                    }
                    return middlewarePostObservable.pipe(
                        map((rsp: ResponseContext) => this.responseProcessor.listRegisteredServicesTree(rsp))
                    );
                })
            );
    }

    /**
     * Register new service using ocl model.
     * @param ocl
     */
    public register(ocl: Ocl, _options?: Configuration): Observable<string> {
        const requestContextPromise = this.requestFactory.register(ocl, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(
                mergeMap((ctx: RequestContext) => middleware.pre(ctx))
            );
        }

        return middlewarePreObservable
            .pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx)))
            .pipe(
                mergeMap((response: ResponseContext) => {
                    let middlewarePostObservable = of(response);
                    for (let middleware of this.configuration.middleware) {
                        middlewarePostObservable = middlewarePostObservable.pipe(
                            mergeMap((rsp: ResponseContext) => middleware.post(rsp))
                        );
                    }
                    return middlewarePostObservable.pipe(
                        map((rsp: ResponseContext) => this.responseProcessor.register(rsp))
                    );
                })
            );
    }

    /**
     * Unregister registered service using id.
     * @param id id of registered service
     */
    public unregister(id: string, _options?: Configuration): Observable<Response> {
        const requestContextPromise = this.requestFactory.unregister(id, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(
                mergeMap((ctx: RequestContext) => middleware.pre(ctx))
            );
        }

        return middlewarePreObservable
            .pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx)))
            .pipe(
                mergeMap((response: ResponseContext) => {
                    let middlewarePostObservable = of(response);
                    for (let middleware of this.configuration.middleware) {
                        middlewarePostObservable = middlewarePostObservable.pipe(
                            mergeMap((rsp: ResponseContext) => middleware.post(rsp))
                        );
                    }
                    return middlewarePostObservable.pipe(
                        map((rsp: ResponseContext) => this.responseProcessor.unregister(rsp))
                    );
                })
            );
    }

    /**
     * Update registered service using id and ocl model.
     * @param id id of registered service
     * @param ocl
     */
    public update(id: string, ocl: Ocl, _options?: Configuration): Observable<Response> {
        const requestContextPromise = this.requestFactory.update(id, ocl, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(
                mergeMap((ctx: RequestContext) => middleware.pre(ctx))
            );
        }

        return middlewarePreObservable
            .pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx)))
            .pipe(
                mergeMap((response: ResponseContext) => {
                    let middlewarePostObservable = of(response);
                    for (let middleware of this.configuration.middleware) {
                        middlewarePostObservable = middlewarePostObservable.pipe(
                            mergeMap((rsp: ResponseContext) => middleware.post(rsp))
                        );
                    }
                    return middlewarePostObservable.pipe(
                        map((rsp: ResponseContext) => this.responseProcessor.update(rsp))
                    );
                })
            );
    }
}
