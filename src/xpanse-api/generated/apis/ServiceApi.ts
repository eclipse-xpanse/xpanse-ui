/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { BaseAPIRequestFactory, RequiredError, COLLECTION_FORMATS } from './baseapi';
import { Configuration } from '../configuration';
import { RequestContext, HttpMethod, ResponseContext, HttpFile } from '../http/http';
import { ObjectSerializer } from '../models/ObjectSerializer';
import { ApiException } from './exception';
import { canConsumeForm, isCodeInRange } from '../util';
import { SecurityAuthentication } from '../auth/auth';

import { CreateRequest } from '../models/CreateRequest';
import { DeployServiceEntity } from '../models/DeployServiceEntity';
import { Response } from '../models/Response';
import { ServiceVo } from '../models/ServiceVo';

/**
 * no description
 */
export class ServiceApiRequestFactory extends BaseAPIRequestFactory {
    /**
     * Start a task to deploy registered service.
     * @param createRequest
     */
    public async deploy(createRequest: CreateRequest, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'createRequest' is not null or undefined
        if (createRequest === null || createRequest === undefined) {
            throw new RequiredError('ServiceApi', 'deploy', 'createRequest');
        }

        // Path Params
        const localVarPath = '/xpanse/service';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam('Accept', 'application/json, */*;q=0.8');

        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType(['application/json']);
        requestContext.setHeaderParam('Content-Type', contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(createRequest, 'CreateRequest', ''),
            contentType
        );
        requestContext.setBody(serializedBody);

        const defaultAuth: SecurityAuthentication | undefined =
            _options?.authMethods?.default || this.configuration?.authMethods?.default;
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Start a task to destroy the deployed service using id.
     * @param id
     */
    public async destroy(id: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'id' is not null or undefined
        if (id === null || id === undefined) {
            throw new RequiredError('ServiceApi', 'destroy', 'id');
        }

        // Path Params
        const localVarPath = '/xpanse/service/{id}'.replace('{' + 'id' + '}', encodeURIComponent(String(id)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.DELETE);
        requestContext.setHeaderParam('Accept', 'application/json, */*;q=0.8');

        const defaultAuth: SecurityAuthentication | undefined =
            _options?.authMethods?.default || this.configuration?.authMethods?.default;
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * @param id
     */
    public async openApi(id: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'id' is not null or undefined
        if (id === null || id === undefined) {
            throw new RequiredError('ServiceApi', 'openApi', 'id');
        }

        // Path Params
        const localVarPath = '/xpanse/service/openapi/{id}'.replace('{' + 'id' + '}', encodeURIComponent(String(id)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam('Accept', 'application/json, */*;q=0.8');

        const defaultAuth: SecurityAuthentication | undefined =
            _options?.authMethods?.default || this.configuration?.authMethods?.default;
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Get deployed service using id.
     * @param id Task id of deploy service
     */
    public async serviceDetail(id: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'id' is not null or undefined
        if (id === null || id === undefined) {
            throw new RequiredError('ServiceApi', 'serviceDetail', 'id');
        }

        // Path Params
        const localVarPath = '/xpanse/service/{id}'.replace('{' + 'id' + '}', encodeURIComponent(String(id)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam('Accept', 'application/json, */*;q=0.8');

        const defaultAuth: SecurityAuthentication | undefined =
            _options?.authMethods?.default || this.configuration?.authMethods?.default;
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * List the deployed services.
     */
    public async services(_options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // Path Params
        const localVarPath = '/xpanse/services';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam('Accept', 'application/json, */*;q=0.8');

        const defaultAuth: SecurityAuthentication | undefined =
            _options?.authMethods?.default || this.configuration?.authMethods?.default;
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }
}

export class ServiceApiResponseProcessor {
    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to deploy
     * @throws ApiException if the response code was not in [200, 299]
     */
    public async deploy(response: ResponseContext): Promise<string> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers['content-type']);
        if (isCodeInRange('404', response.httpStatusCode)) {
            const body: Response = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                'Response',
                'uuid'
            ) as Response;
            throw new ApiException<Response>(response.httpStatusCode, 'Not Found', body, response.headers);
        }
        if (isCodeInRange('400', response.httpStatusCode)) {
            const body: Response = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                'Response',
                'uuid'
            ) as Response;
            throw new ApiException<Response>(response.httpStatusCode, 'Bad Request', body, response.headers);
        }
        if (isCodeInRange('500', response.httpStatusCode)) {
            const body: Response = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                'Response',
                'uuid'
            ) as Response;
            throw new ApiException<Response>(response.httpStatusCode, 'Internal Server Error', body, response.headers);
        }
        if (isCodeInRange('202', response.httpStatusCode)) {
            const body: string = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                'string',
                'uuid'
            ) as string;
            return body;
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: string = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                'string',
                'uuid'
            ) as string;
            return body;
        }

        throw new ApiException<string | Blob | undefined>(
            response.httpStatusCode,
            'Unknown API Status Code!',
            await response.getBodyAsAny(),
            response.headers
        );
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to destroy
     * @throws ApiException if the response code was not in [200, 299]
     */
    public async destroy(response: ResponseContext): Promise<Response> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers['content-type']);
        if (isCodeInRange('404', response.httpStatusCode)) {
            const body: Response = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                'Response',
                ''
            ) as Response;
            throw new ApiException<Response>(response.httpStatusCode, 'Not Found', body, response.headers);
        }
        if (isCodeInRange('400', response.httpStatusCode)) {
            const body: Response = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                'Response',
                ''
            ) as Response;
            throw new ApiException<Response>(response.httpStatusCode, 'Bad Request', body, response.headers);
        }
        if (isCodeInRange('500', response.httpStatusCode)) {
            const body: Response = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                'Response',
                ''
            ) as Response;
            throw new ApiException<Response>(response.httpStatusCode, 'Internal Server Error', body, response.headers);
        }
        if (isCodeInRange('202', response.httpStatusCode)) {
            const body: Response = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                'Response',
                ''
            ) as Response;
            return body;
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: Response = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                'Response',
                ''
            ) as Response;
            return body;
        }

        throw new ApiException<string | Blob | undefined>(
            response.httpStatusCode,
            'Unknown API Status Code!',
            await response.getBodyAsAny(),
            response.headers
        );
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to openApi
     * @throws ApiException if the response code was not in [200, 299]
     */
    public async openApi(response: ResponseContext): Promise<string> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers['content-type']);
        if (isCodeInRange('404', response.httpStatusCode)) {
            const body: Response = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                'Response',
                ''
            ) as Response;
            throw new ApiException<Response>(response.httpStatusCode, 'Not Found', body, response.headers);
        }
        if (isCodeInRange('400', response.httpStatusCode)) {
            const body: Response = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                'Response',
                ''
            ) as Response;
            throw new ApiException<Response>(response.httpStatusCode, 'Bad Request', body, response.headers);
        }
        if (isCodeInRange('500', response.httpStatusCode)) {
            const body: Response = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                'Response',
                ''
            ) as Response;
            throw new ApiException<Response>(response.httpStatusCode, 'Internal Server Error', body, response.headers);
        }
        if (isCodeInRange('200', response.httpStatusCode)) {
            const body: string = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                'string',
                ''
            ) as string;
            return body;
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: string = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                'string',
                ''
            ) as string;
            return body;
        }

        throw new ApiException<string | Blob | undefined>(
            response.httpStatusCode,
            'Unknown API Status Code!',
            await response.getBodyAsAny(),
            response.headers
        );
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to serviceDetail
     * @throws ApiException if the response code was not in [200, 299]
     */
    public async serviceDetail(response: ResponseContext): Promise<DeployServiceEntity> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers['content-type']);
        if (isCodeInRange('404', response.httpStatusCode)) {
            const body: Response = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                'Response',
                ''
            ) as Response;
            throw new ApiException<Response>(response.httpStatusCode, 'Not Found', body, response.headers);
        }
        if (isCodeInRange('400', response.httpStatusCode)) {
            const body: Response = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                'Response',
                ''
            ) as Response;
            throw new ApiException<Response>(response.httpStatusCode, 'Bad Request', body, response.headers);
        }
        if (isCodeInRange('500', response.httpStatusCode)) {
            const body: Response = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                'Response',
                ''
            ) as Response;
            throw new ApiException<Response>(response.httpStatusCode, 'Internal Server Error', body, response.headers);
        }
        if (isCodeInRange('200', response.httpStatusCode)) {
            const body: DeployServiceEntity = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                'DeployServiceEntity',
                ''
            ) as DeployServiceEntity;
            return body;
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: DeployServiceEntity = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                'DeployServiceEntity',
                ''
            ) as DeployServiceEntity;
            return body;
        }

        throw new ApiException<string | Blob | undefined>(
            response.httpStatusCode,
            'Unknown API Status Code!',
            await response.getBodyAsAny(),
            response.headers
        );
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to services
     * @throws ApiException if the response code was not in [200, 299]
     */
    public async services(response: ResponseContext): Promise<Array<ServiceVo>> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers['content-type']);
        if (isCodeInRange('404', response.httpStatusCode)) {
            const body: Response = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                'Response',
                ''
            ) as Response;
            throw new ApiException<Response>(response.httpStatusCode, 'Not Found', body, response.headers);
        }
        if (isCodeInRange('400', response.httpStatusCode)) {
            const body: Response = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                'Response',
                ''
            ) as Response;
            throw new ApiException<Response>(response.httpStatusCode, 'Bad Request', body, response.headers);
        }
        if (isCodeInRange('500', response.httpStatusCode)) {
            const body: Response = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                'Response',
                ''
            ) as Response;
            throw new ApiException<Response>(response.httpStatusCode, 'Internal Server Error', body, response.headers);
        }
        if (isCodeInRange('200', response.httpStatusCode)) {
            const body: Array<ServiceVo> = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                'Array<ServiceVo>',
                ''
            ) as Array<ServiceVo>;
            return body;
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: Array<ServiceVo> = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                'Array<ServiceVo>',
                ''
            ) as Array<ServiceVo>;
            return body;
        }

        throw new ApiException<string | Blob | undefined>(
            response.httpStatusCode,
            'Unknown API Status Code!',
            await response.getBodyAsAny(),
            response.headers
        );
    }
}
