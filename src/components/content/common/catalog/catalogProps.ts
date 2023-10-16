import { ServiceTemplateDetailVo } from '../../../../xpanse-api/generated';

export const getServiceMapper = (
    serviceTemplateList: ServiceTemplateDetailVo[]
): Map<string, ServiceTemplateDetailVo[]> => {
    const serviceMapper: Map<string, ServiceTemplateDetailVo[]> = new Map<string, ServiceTemplateDetailVo[]>();
    for (const serviceTemplate of serviceTemplateList) {
        if (serviceTemplate.name) {
            if (!serviceMapper.has(serviceTemplate.name)) {
                serviceMapper.set(
                    serviceTemplate.name,
                    serviceTemplateList.filter((data) => data.name === serviceTemplate.name)
                );
            }
        }
    }

    return serviceMapper;
};

export const getVersionMapper = (
    currentServiceName: string,
    serviceTemplateList: ServiceTemplateDetailVo[]
): Map<string, ServiceTemplateDetailVo[]> => {
    const versionMapper: Map<string, ServiceTemplateDetailVo[]> = new Map<string, ServiceTemplateDetailVo[]>();
    const serviceMapper: Map<string, ServiceTemplateDetailVo[]> = getServiceMapper(serviceTemplateList);
    serviceMapper.forEach((serviceList, serviceName) => {
        if (serviceName === currentServiceName) {
            for (const service of serviceList) {
                if (service.version) {
                    if (!versionMapper.has(service.version)) {
                        versionMapper.set(
                            service.version,
                            serviceList.filter((data) => data.version === service.version)
                        );
                    }
                }
            }
        }
    });
    return versionMapper;
};

export const getCspMapper = (
    currentServiceName: string,
    currentVersionName: string,
    serviceTemplateList: ServiceTemplateDetailVo[]
): Map<string, ServiceTemplateDetailVo[]> => {
    const cspMapper: Map<string, ServiceTemplateDetailVo[]> = new Map<string, ServiceTemplateDetailVo[]>();
    const versionMapper: Map<string, ServiceTemplateDetailVo[]> = getVersionMapper(
        currentServiceName,
        serviceTemplateList
    );
    versionMapper.forEach((versionList, versionName) => {
        if (currentVersionName === versionName) {
            for (const service of versionList) {
                if (!versionMapper.has(service.csp)) {
                    cspMapper.set(
                        service.csp,
                        versionList.filter((data) => data.csp === service.csp)
                    );
                }
            }
        }
    });
    return cspMapper;
};
