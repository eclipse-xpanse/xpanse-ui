import { UserOrderableServiceVo } from '../../../../xpanse-api/generated';

export const getUserOrderableServiceMapper = (
    userOrderableServiceList: UserOrderableServiceVo[]
): Map<string, UserOrderableServiceVo[]> => {
    const serviceMapper: Map<string, UserOrderableServiceVo[]> = new Map<string, UserOrderableServiceVo[]>();
    for (const userOrderableService of userOrderableServiceList) {
        if (userOrderableService.name) {
            if (!serviceMapper.has(userOrderableService.name)) {
                serviceMapper.set(
                    userOrderableService.name,
                    userOrderableServiceList.filter((data) => data.name === userOrderableService.name)
                );
            }
        }
    }

    return serviceMapper;
};

export const getUserOrderableVersionMapper = (
    currentServiceName: string,
    userOrderableServiceList: UserOrderableServiceVo[]
): Map<string, UserOrderableServiceVo[]> => {
    const versionMapper: Map<string, UserOrderableServiceVo[]> = new Map<string, UserOrderableServiceVo[]>();
    const serviceMapper: Map<string, UserOrderableServiceVo[]> =
        getUserOrderableServiceMapper(userOrderableServiceList);
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
