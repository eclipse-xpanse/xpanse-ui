import { UserAvailableServiceVo } from '../../../../xpanse-api/generated';

export const getServiceMapper = (
    userAvailableServiceList: UserAvailableServiceVo[]
): Map<string, UserAvailableServiceVo[]> => {
    const serviceMapper: Map<string, UserAvailableServiceVo[]> = new Map<string, UserAvailableServiceVo[]>();
    for (const userAvailableService of userAvailableServiceList) {
        if (userAvailableService.name) {
            if (!serviceMapper.has(userAvailableService.name)) {
                serviceMapper.set(
                    userAvailableService.name,
                    userAvailableServiceList.filter((data) => data.name === userAvailableService.name)
                );
            }
        }
    }

    return serviceMapper;
};

export const getVersionMapper = (
    currentServiceName: string,
    userAvailableServiceList: UserAvailableServiceVo[]
): Map<string, UserAvailableServiceVo[]> => {
    const versionMapper: Map<string, UserAvailableServiceVo[]> = new Map<string, UserAvailableServiceVo[]>();
    const serviceMapper: Map<string, UserAvailableServiceVo[]> = getServiceMapper(userAvailableServiceList);
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
    userAvailableServiceList: UserAvailableServiceVo[]
): Map<string, UserAvailableServiceVo[]> => {
    const cspMapper: Map<string, UserAvailableServiceVo[]> = new Map<string, UserAvailableServiceVo[]>();
    const versionMapper: Map<string, UserAvailableServiceVo[]> = getVersionMapper(
        currentServiceName,
        userAvailableServiceList
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
