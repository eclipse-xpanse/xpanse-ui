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
export const serviceTemplateUrl = 'http://localhost:8080/xpanse/service_templates';
export const serviceTemplateDetailUrl =
    'http://localhost:8080/xpanse/service_templates/662618ea-cef4-4220-9fa4-73afb5d5a20b';
export const serviceTemplatesUrl = 'http://localhost:8080/xpanse/service_templates?categoryName=compute';
export const computeYmlUrl =
    'https://raw.githubusercontent.com/eclipse-xpanse/xpanse-samples/main/compute/HuaweiCloud-Compute-terraform-dev.yml';
export const middlewareYmlUrl =
    'https://raw.githubusercontent.com/eclipse-xpanse/xpanse-samples/main/middleware/HuaweiCloud-Kafka.yml';
export const middlewareServiceTemplatesUrl = 'http://localhost:8080/xpanse/service_templates?categoryName=middleware';
export const middlewareRequestsUrl =
    'http://localhost:8080/xpanse/service_templates/21597cd5-748e-4f0e-9768-baaa5275b2bd/requests';
export const middlewareRequestsReviewUrl =
    'http://localhost:8080/xpanse/service_templates/21597cd5-748e-4f0e-9768-baaa5275b2bd/requests?requestStatus=in-review';
export const middlewareServiceDetailUrl =
    'http://localhost:8080/xpanse/services/isv?categoryName=middleware&cspName=HuaweiCloud&serviceName=kafka-cluster&serviceVersion=1.0.0';
export const middlewareServicePoliciesUrl =
    'http://localhost:8080/xpanse/service/policies?serviceTemplateId=21597cd5-748e-4f0e-9768-baaa5275b2bd';
export const isvServicesUrl = 'http://localhost:8080/xpanse/services/isv';
export const updateServiceTemplateUrl =
    'http://localhost:8080/xpanse/service_templates/21597cd5-748e-4f0e-9768-baaa5275b2bd?isUnpublishUntilApproved=false';
export const unpublishServiceUrl =
    'http://localhost:8080/xpanse/service_templates/unpublish/21597cd5-748e-4f0e-9768-baaa5275b2bd';
export const republishServiceUrl =
    'http://localhost:8080/xpanse/service_templates/republish/21597cd5-748e-4f0e-9768-baaa5275b2bd';
export const cancelRequestUrl =
    'http://localhost:8080/xpanse/service_templates/requests/cancel/ba871537-10b8-4456-a90c-76e4bd8d73b2';
export const deleteServiceUrl = 'http://localhost:8080/xpanse/service_templates/21597cd5-748e-4f0e-9768-baaa5275b2bd';
