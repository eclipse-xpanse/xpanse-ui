/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { DataNode } from 'antd/es/tree';
import { ServiceTemplateDetailVo } from '../../../../xpanse-api/generated';

export const groupServiceTemplatesByServiceVendor = (
    serviceTemplateList: ServiceTemplateDetailVo[]
): Map<string, ServiceTemplateDetailVo[]> => {
    const serviceMapperByServiceVendor: Map<string, ServiceTemplateDetailVo[]> = new Map<
        string,
        ServiceTemplateDetailVo[]
    >();
    for (const serviceTemplate of serviceTemplateList) {
        if (serviceTemplate.serviceVendor) {
            if (!serviceMapperByServiceVendor.has(serviceTemplate.serviceVendor)) {
                serviceMapperByServiceVendor.set(
                    serviceTemplate.serviceVendor,
                    serviceTemplateList.filter((data) => data.serviceVendor === serviceTemplate.serviceVendor)
                );
            }
        }
    }

    return serviceMapperByServiceVendor;
};

export const groupServicesByCategoryForSpecificServiceVendor = (
    currentServiceVendor: string,
    serviceTemplateList: ServiceTemplateDetailVo[]
): Map<string, ServiceTemplateDetailVo[]> => {
    const categoryMapper: Map<string, ServiceTemplateDetailVo[]> = new Map<string, ServiceTemplateDetailVo[]>();
    const serviceVendorMapper: Map<string, ServiceTemplateDetailVo[]> =
        groupServiceTemplatesByServiceVendor(serviceTemplateList);
    serviceVendorMapper.forEach((serviceList, serviceVendor) => {
        if (serviceVendor === currentServiceVendor) {
            for (const service of serviceList) {
                if (service.category.toString()) {
                    if (!categoryMapper.has(service.category.toString())) {
                        categoryMapper.set(
                            service.category.toString(),
                            serviceList.filter((data) => data.category === service.category)
                        );
                    }
                }
            }
        }
    });
    return categoryMapper;
};

export const groupServicesByNameForSpecificCategory = (
    currentServiceVendor: string,
    currentCategory: string,
    serviceTemplateList: ServiceTemplateDetailVo[]
): Map<string, ServiceTemplateDetailVo[]> => {
    const serviceNameMapper: Map<string, ServiceTemplateDetailVo[]> = new Map<string, ServiceTemplateDetailVo[]>();
    const categoryMapper: Map<string, ServiceTemplateDetailVo[]> = groupServicesByCategoryForSpecificServiceVendor(
        currentServiceVendor,
        serviceTemplateList
    );
    categoryMapper.forEach((serviceList, category) => {
        if (category === currentCategory) {
            for (const service of serviceList) {
                if (service.name) {
                    if (!serviceNameMapper.has(service.name)) {
                        serviceNameMapper.set(
                            service.name,
                            serviceList.filter((data) => data.name === service.name)
                        );
                    }
                }
            }
        }
    });
    return serviceNameMapper;
};

export const groupRegisteredServicesByVersionForSpecificServiceName = (
    currentServiceVendor: string,
    currentCategory: string,
    currentServiceName: string,
    serviceTemplateList: ServiceTemplateDetailVo[]
): Map<string, ServiceTemplateDetailVo[]> => {
    const versionMapper: Map<string, ServiceTemplateDetailVo[]> = new Map<string, ServiceTemplateDetailVo[]>();
    const serviceNameMapper: Map<string, ServiceTemplateDetailVo[]> = groupServicesByNameForSpecificCategory(
        currentServiceVendor,
        currentCategory,
        serviceTemplateList
    );
    serviceNameMapper.forEach((serviceList, serviceName) => {
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

export function getFourthLevelKeysFromAvailableServicesTree(treeData: DataNode[]): React.Key[] {
    const fourthLevelKeys: React.Key[] = [];

    const traverseTree = (nodes: DataNode[], level: number) => {
        for (const node of nodes) {
            if (level === 4) {
                fourthLevelKeys.push(node.key);
            }
            if (node.children && level < 4) {
                traverseTree(node.children, level + 1);
            }
        }
    };

    traverseTree(treeData, 1); // Start traversal from level 1
    return fourthLevelKeys;
}
