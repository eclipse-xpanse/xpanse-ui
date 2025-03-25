export const healthCheckUrl = 'http://localhost:8080/xpanse/health';
export const serviceDetailsUrl = 'http://localhost:8080/xpanse/services/details';
export const credentialsUrl = 'http://localhost:8080/xpanse/isv/credentials';
export const credentialsCspUrl = 'http://localhost:8080/xpanse/csps/active';
export const credentialsSiteUrl = 'http://localhost:8080/xpanse/csps/HuaweiCloud/sites';
export const credentialsTypeUrl = 'http://localhost:8080/xpanse/credential_types?cspName=HuaweiCloud';
export const credentialsCapabilitiesUrl =
    'http://localhost:8080/xpanse/credentials/capabilities?cspName=HuaweiCloud&type=variables';
export const credentialsDeleteUrl =
    'http://localhost:8080/xpanse/isv/credentials?cspName=HuaweiCloud&siteName=International&type=variables&name=AK_SK';
export const stackCheckUrl = 'http://localhost:8080/xpanse/stack/health';
export const policiesUrl = 'http://localhost:8080/xpanse/policies';
export const policiesUpdateUrl = 'http://localhost:8080/xpanse/policies/12a3dfbe-8ee2-45a3-8216-4ddf0982c90d';
export const policyDeleteUrl = 'http://localhost:8080/xpanse/policies/12a3dfbe-8ee2-45a3-8216-4ddf0982c90d';
export const catalogServicesUrl = 'http://localhost:8080/xpanse/catalog/services?categoryName=compute';
export const selectServiceUrl =
    'http://localhost:8080/xpanse/catalog/services?categoryName=compute&serviceName=terraform-ecs';
export const selectAzsUrl =
    'http://localhost:8080/xpanse/csp/region/azs?cspName=HuaweiCloud&siteName=Chinese%20Mainland&regionName=cn-southwest-2&serviceTemplateId=10c2baff-36a8-4ea9-9041-b51409b0f291';
export const selectPriceUrl =
    'http://localhost:8080/xpanse/pricing/service/10c2baff-36a8-4ea9-9041-b51409b0f291/cn-southwest-2/Chinese%20Mainland/Pay%20per%20Use';
export const deployServiceUrl = 'http://localhost:8080/xpanse/services';
export const deployTaskStatusUrl =
    'http://localhost:8080/xpanse/services/orders/9c830b70-c2d5-4608-9dea-826becd122bb/status';
export const deployDetailsUrl =
    'http://localhost:8080/xpanse/services/details/self_hosted/868326e9-3611-43d6-ad88-c15d514f3f57';
export const myServicesDetailsUrl = 'http://localhost:8080/xpanse/services/details';
export const vmResourceUrl =
    'http://localhost:8080/xpanse/csp/resources/vm?csp=HuaweiCloud&siteName=Chinese%20Mainland&regionName=cn-southwest-2';
export const retryDeployUrl = 'http://localhost:8080/xpanse/services/deploy/retry/868326e9-3611-43d6-ad88-c15d514f3f57';
