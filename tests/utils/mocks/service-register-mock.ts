import { Page } from 'playwright-core';
import { serviceTemplateDetailUrl, serviceTemplatesUrl, serviceTemplateUrl } from './endpoints.ts';

export const mockRegisterSuccessResponse = async (page: Page, timeToWaitForResponse: number) => {
    await page.route(serviceTemplateUrl, async (route) => {
        await new Promise((resolve) => {
            setTimeout(resolve, timeToWaitForResponse);
        });
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                serviceTemplateId: '662618ea-cef4-4220-9fa4-73afb5d5a20b',
                requestId: '7f2dadac-aedb-4266-bf2d-451111ea4cb2',
                requestSubmittedForReview: true,
            }),
        });
    });
};

export const mockServiceTemplateDetailSuccessResponse = async (page: Page, timeToWaitForResponse: number) => {
    await page.route(serviceTemplateDetailUrl, async (route) => {
        await new Promise((resolve) => {
            setTimeout(resolve, timeToWaitForResponse);
        });
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                serviceTemplateId: '662618ea-cef4-4220-9fa4-73afb5d5a20b',
                name: 'terraform-ecs',
                version: '1.0.0',
                csp: 'HuaweiCloud',
                category: 'compute',
                serviceVendor: 'ISV-A',
                regions: [
                    {
                        name: 'cn-southwest-2',
                        site: 'Chinese Mainland',
                        area: 'Asia China',
                    },
                    {
                        name: 'cn-southwest-2',
                        site: 'International',
                        area: 'Asia China',
                    },
                    {
                        name: 'eu-west-0',
                        site: 'International',
                        area: 'Europe Pairs',
                    },
                    {
                        name: 'eu-west-101',
                        site: 'Europe',
                        area: 'Europe Dublin',
                    },
                ],
                description: 'This is an enhanced compute services by ISV-A.',
                icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAACg0lEQVR4nO2dP24TURCHf65IxwFcADVHMSUHAKfCHTeIFIocgXAEXITUVrJNjsABYg6AJaBf9MRYeiAWBTn7dmbyfdLI1vqPZvx7M7OzK+tJAAAAAAAAAAAwATNJx5IuJW2S2KWkpcUWipk53ye1T9FEOa6cv3Wwsjf3ZLdVXCVTwrDPjhLAI+XhSNK2ypIwdOZ0ecxGFzG2kE5nji2k05ljC+l05thCOp05trs43Tu3IRBECNI0Q24knTmxGzJEOpEfThAEQdyVrCkyZCXpu6Q3fxwnQyYSZG2L4SOC+MiQuaS39lhDhtBD2uC9hwxBhjiYyHsm9V9M/YP3CPI7TOoNoYc4A0Gc4V2QFZO6L0HWTOq+BJkzqfsSZAgGQwRpA/fUnYEgzuCeujO8zyFD0NQRpA3eM2TFpO5LkDWTui9B5kzqvgQZgqaOIG1gMHQGggQU5My5Pbj/h0SlixhbSKczxxbS6cyxhXQ6c2whnc4c212cfizpueLRZRXks73npWLRIYgv0gpCyWpIyFWUOTYyxBk09QcqyAtJV5J+2D3y8nyhcaFkDfDuH39JO9V4pBVEB2ZGb/ZV0rnZrjo+VqakFeSQ097rSown1fGnlSilfI1BWkEO6SHf7LPv//Laub1W3jMGCPKfgnxAkPYl68q+f2dlas8zStY0ab2omvfOylTJDJr6hNeyTjnt9TcYLqx8laGQwdCBIFOQ9iyLy+8NCbmKMsdGhjiDHuIMBHEGJcsZIRtf5thCOp05tpBOZ45tv23e1raay8KRpC8Rt81bVldjtw42hNzck+3FKPZagZjZCuqT2kW0rVdlDi9NmE0Su5D0KqIYAAAAAAAAAACKz09haty1w+ee7QAAAABJRU5ErkJggg==',
                deployment: {
                    deployerTool: {
                        kind: 'opentofu',
                        version: '=1.6.0',
                    },
                    inputVariables: [
                        {
                            name: 'admin_passwd',
                            kind: 'variable',
                            dataType: 'string',
                            example: null,
                            description:
                                'The admin password of the compute instance. If the value is empty, will create a random password.',
                            value: null,
                            mandatory: false,
                            valueSchema: {
                                minLength: 8,
                                maxLength: 16,
                                pattern: '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,16}$',
                            },
                            sensitiveScope: 'always',
                            autoFill: null,
                            modificationImpact: {
                                isDataLost: false,
                                isServiceInterrupted: true,
                            },
                        },
                        {
                            name: 'image_name',
                            kind: 'variable',
                            dataType: 'string',
                            example: 'Ubuntu 22.04 server 64bit',
                            description:
                                'The image name of the compute instance. If the value is empty, will use the default value to create compute instance.',
                            value: 'Ubuntu 22.04 server 64bit',
                            mandatory: false,
                            valueSchema: null,
                            sensitiveScope: 'none',
                            autoFill: null,
                            modificationImpact: {
                                isDataLost: false,
                                isServiceInterrupted: true,
                            },
                        },
                        {
                            name: 'vpc_name',
                            kind: 'variable',
                            dataType: 'string',
                            example: 'ecs-vpc-default',
                            description:
                                'The vpc name of the compute instance. If the value is empty, will use the default value to find or create VPC.',
                            value: 'ecs-vpc-default',
                            mandatory: false,
                            valueSchema: null,
                            sensitiveScope: 'none',
                            autoFill: null,
                            modificationImpact: {
                                isDataLost: false,
                                isServiceInterrupted: true,
                            },
                        },
                        {
                            name: 'subnet_name',
                            kind: 'variable',
                            dataType: 'string',
                            example: 'ecs-subnet-default',
                            description:
                                'The sub network name of the compute instance. If the value is empty, will use the default value to find or create subnet.',
                            value: 'ecs-subnet-default',
                            mandatory: false,
                            valueSchema: null,
                            sensitiveScope: 'none',
                            autoFill: null,
                            modificationImpact: {
                                isDataLost: false,
                                isServiceInterrupted: true,
                            },
                        },
                        {
                            name: 'secgroup_name',
                            kind: 'variable',
                            dataType: 'string',
                            example: 'ecs-secgroup-default',
                            description:
                                'The security group name of the compute instance. If the value is empty, will use the default value to find or create security group.',
                            value: 'ecs-secgroup-default',
                            mandatory: false,
                            valueSchema: null,
                            sensitiveScope: 'none',
                            autoFill: null,
                            modificationImpact: {
                                isDataLost: false,
                                isServiceInterrupted: true,
                            },
                        },
                    ],
                    outputVariables: [
                        {
                            name: 'admin_passwd',
                            dataType: 'string',
                            description: 'The admin password of the compute instance.',
                            sensitiveScope: 'always',
                        },
                        {
                            name: 'ecs_host',
                            dataType: 'string',
                            description: 'The host of the compute instance.',
                            sensitiveScope: 'none',
                        },
                        {
                            name: 'ecs_public_ip',
                            dataType: 'string',
                            description: 'The public ip of the compute instance.',
                            sensitiveScope: 'none',
                        },
                    ],
                    credentialType: 'variables',
                    serviceAvailabilityConfig: [
                        {
                            displayName: 'Availability Zone',
                            varName: 'availability_zone',
                            mandatory: false,
                            description:
                                'The availability zone to deploy the service instance. If the value is empty, the service instance will be deployed in a random availability zone.',
                        },
                    ],
                    scriptFiles: {
                        'variables.tf':
                            'variable "region" {\n  type        = string\n  description = "The region to deploy the compute instance."\n}\n\nvariable "availability_zone" {\n  type        = string\n  default     = ""\n  description = "The availability zone to deploy the compute instance."\n}\n\nvariable "flavor_id" {\n  type        = string\n  default     = "s6.large.2"\n  description = "The flavor_id of the compute instance."\n}\n\nvariable "image_name" {\n  type        = string\n  default     = "Ubuntu 22.04 server 64bit"\n  description = "The image name of the compute instance."\n}\n\nvariable "admin_passwd" {\n  type        = string\n  default     = ""\n  description = "The root password of the compute instance."\n}\n\nvariable "vpc_name" {\n  type        = string\n  default     = "ecs-vpc-default"\n  description = "The vpc name of the compute instance."\n}\n\nvariable "subnet_name" {\n  type        = string\n  default     = "ecs-subnet-default"\n  description = "The subnet name of the compute instance."\n}\n\nvariable "secgroup_name" {\n  type        = string\n  default     = "ecs-secgroup-default"\n  description = "The security group name of the compute instance."\n}\n',
                        'provider.tf':
                            'terraform {\n  required_providers {\n    huaweicloud = {\n      source  = "huaweicloud/huaweicloud"\n      version = "~> 1.61.0"\n    }\n  }\n}\n\nprovider "huaweicloud" {\n  region = var.region\n}\n',
                        'main.tf':
                            'data "huaweicloud_availability_zones" "osc-az" {}\n\ndata "huaweicloud_vpcs" "existing" {\n  name = var.vpc_name\n}\n\ndata "huaweicloud_vpc_subnets" "existing" {\n  name = var.subnet_name\n}\n\ndata "huaweicloud_networking_secgroups" "existing" {\n  name = var.secgroup_name\n}\n\nlocals {\n  availability_zone = var.availability_zone == "" ? data.huaweicloud_availability_zones.osc-az.names[0] : var.availability_zone\n  admin_passwd      = var.admin_passwd == "" ? random_password.password.result : var.admin_passwd\n  vpc_id            = length(data.huaweicloud_vpcs.existing.vpcs) > 0 ? data.huaweicloud_vpcs.existing.vpcs[0].id : huaweicloud_vpc.new[0].id\n  subnet_id         = length(data.huaweicloud_vpc_subnets.existing.subnets)> 0 ? data.huaweicloud_vpc_subnets.existing.subnets[0].id : huaweicloud_vpc_subnet.new[0].id\n  secgroup_id       = length(data.huaweicloud_networking_secgroups.existing.security_groups) > 0 ? data.huaweicloud_networking_secgroups.existing.security_groups[0].id : huaweicloud_networking_secgroup.new[0].id\n}\n\nresource "huaweicloud_vpc" "new" {\n  count = length(data.huaweicloud_vpcs.existing.vpcs) == 0 ? 1 : 0\n  name  = var.vpc_name\n  cidr  = "192.168.0.0/16"\n}\n\nresource "huaweicloud_vpc_subnet" "new" {\n  count      = length(data.huaweicloud_vpcs.existing.vpcs) == 0 ? 1 : 0\n  vpc_id     = local.vpc_id\n  name       = var.subnet_name\n  cidr       = "192.168.10.0/24"\n  gateway_ip = "192.168.10.1"\n}\n\nresource "huaweicloud_networking_secgroup" "new" {\n  count       = length(data.huaweicloud_networking_secgroups.existing.security_groups) == 0 ? 1 : 0\n  name        = var.secgroup_name\n  description = "Kafka cluster security group"\n}\n\nresource "huaweicloud_networking_secgroup_rule" "secgroup_rule_0" {\n  count             = length(data.huaweicloud_networking_secgroups.existing.security_groups) == 0 ? 1 : 0\n  direction         = "ingress"\n  ethertype         = "IPv4"\n  protocol          = "tcp"\n  port_range_min    = 22\n  port_range_max    = 22\n  remote_ip_prefix  = "121.37.117.211/32"\n  security_group_id = local.secgroup_id\n}\n\nresource "huaweicloud_networking_secgroup_rule" "secgroup_rule_1" {\n  count             = length(data.huaweicloud_networking_secgroups.existing.security_groups) == 0 ? 1 : 0\n  direction         = "ingress"\n  ethertype         = "IPv4"\n  protocol          = "tcp"\n  port_range_min    = 8080\n  port_range_max    = 8088\n  remote_ip_prefix  = "121.37.117.211/32"\n  security_group_id = local.secgroup_id\n}\n\nresource "huaweicloud_networking_secgroup_rule" "secgroup_rule_2" {\n  count             = length(data.huaweicloud_networking_secgroups.existing.security_groups) == 0 ? 1 : 0\n  direction         = "ingress"\n  ethertype         = "IPv4"\n  protocol          = "tcp"\n  port_range_min    = 9090\n  port_range_max    = 9099\n  remote_ip_prefix  = "121.37.117.211/32"\n  security_group_id = local.secgroup_id\n}\n\nresource "random_id" "new" {\n  byte_length = 4\n}\n\nresource "random_password" "password" {\n  length           = 12\n  upper            = true\n  lower            = true\n  numeric          = true\n  special          = true\n  min_special      = 1\n  override_special = "#%@"\n}\n\ndata "huaweicloud_images_image" "image" {\n  name                  = var.image_name\n  most_recent           = true\n  enterprise_project_id = "0"\n}\n\nresource "huaweicloud_compute_instance" "ecs-tf" {\n  availability_zone  = local.availability_zone\n  name               = "ecs-tf-${random_id.new.hex}"\n  flavor_id          = var.flavor_id\n  security_group_ids = [ local.secgroup_id ]\n  image_id           = data.huaweicloud_images_image.image.id\n  admin_pass         = local.admin_passwd\n  network {\n    uuid = local.subnet_id\n  }\n}\n\nresource "huaweicloud_evs_volume" "volume" {\n  name              = "volume-tf-${random_id.new.hex}"\n  description       = "my volume"\n  volume_type       = "SSD"\n  size              = 40\n  availability_zone = local.availability_zone\n  tags = {\n    foo = "bar"\n    key = "value"\n  }\n}\n\nresource "huaweicloud_compute_volume_attach" "attached" {\n  instance_id = huaweicloud_compute_instance.ecs-tf.id\n  volume_id   = huaweicloud_evs_volume.volume.id\n}\n\nresource "huaweicloud_vpc_eip" "eip-tf" {\n   publicip {\n     type = var.region == "eu-west-101" ? "5_bgp" : "5_sbgp"\n  }\n  bandwidth {\n    name        = "eip-tf-${random_id.new.hex}"\n    size        = 5\n    share_type  = "PER"\n    charge_mode = "traffic"\n  }\n}\n\nresource "huaweicloud_compute_eip_associate" "associated" {\n  public_ip   = huaweicloud_vpc_eip.eip-tf.address\n  instance_id = huaweicloud_compute_instance.ecs-tf.id\n}\n',
                        'outputs.tf':
                            'output "ecs_host" {\n  value = huaweicloud_compute_instance.ecs-tf.access_ip_v4\n}\n\noutput "ecs_public_ip" {\n  value = huaweicloud_vpc_eip.eip-tf.address\n}\n\noutput "admin_passwd" {\n  value = var.admin_passwd == "" ? nonsensitive(local.admin_passwd) : local.admin_passwd\n}\n',
                    },
                    scriptsRepo: null,
                },
                inputVariables: [
                    {
                        name: 'admin_passwd',
                        kind: 'variable',
                        dataType: 'string',
                        example: null,
                        description:
                            'The admin password of the compute instance. If the value is empty, will create a random password.',
                        value: null,
                        mandatory: false,
                        valueSchema: {
                            minLength: 8,
                            maxLength: 16,
                            pattern: '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,16}$',
                        },
                        sensitiveScope: 'always',
                        autoFill: null,
                        modificationImpact: {
                            isDataLost: false,
                            isServiceInterrupted: true,
                        },
                    },
                    {
                        name: 'image_name',
                        kind: 'variable',
                        dataType: 'string',
                        example: 'Ubuntu 22.04 server 64bit',
                        description:
                            'The image name of the compute instance. If the value is empty, will use the default value to create compute instance.',
                        value: 'Ubuntu 22.04 server 64bit',
                        mandatory: false,
                        valueSchema: null,
                        sensitiveScope: 'none',
                        autoFill: null,
                        modificationImpact: {
                            isDataLost: false,
                            isServiceInterrupted: true,
                        },
                    },
                    {
                        name: 'vpc_name',
                        kind: 'variable',
                        dataType: 'string',
                        example: 'ecs-vpc-default',
                        description:
                            'The vpc name of the compute instance. If the value is empty, will use the default value to find or create VPC.',
                        value: 'ecs-vpc-default',
                        mandatory: false,
                        valueSchema: null,
                        sensitiveScope: 'none',
                        autoFill: null,
                        modificationImpact: {
                            isDataLost: false,
                            isServiceInterrupted: true,
                        },
                    },
                    {
                        name: 'subnet_name',
                        kind: 'variable',
                        dataType: 'string',
                        example: 'ecs-subnet-default',
                        description:
                            'The sub network name of the compute instance. If the value is empty, will use the default value to find or create subnet.',
                        value: 'ecs-subnet-default',
                        mandatory: false,
                        valueSchema: null,
                        sensitiveScope: 'none',
                        autoFill: null,
                        modificationImpact: {
                            isDataLost: false,
                            isServiceInterrupted: true,
                        },
                    },
                    {
                        name: 'secgroup_name',
                        kind: 'variable',
                        dataType: 'string',
                        example: 'ecs-secgroup-default',
                        description:
                            'The security group name of the compute instance. If the value is empty, will use the default value to find or create security group.',
                        value: 'ecs-secgroup-default',
                        mandatory: false,
                        valueSchema: null,
                        sensitiveScope: 'none',
                        autoFill: null,
                        modificationImpact: {
                            isDataLost: false,
                            isServiceInterrupted: true,
                        },
                    },
                ],
                outputVariables: [
                    {
                        name: 'admin_passwd',
                        dataType: 'string',
                        description: 'The admin password of the compute instance.',
                        sensitiveScope: 'always',
                    },
                    {
                        name: 'ecs_host',
                        dataType: 'string',
                        description: 'The host of the compute instance.',
                        sensitiveScope: 'none',
                    },
                    {
                        name: 'ecs_public_ip',
                        dataType: 'string',
                        description: 'The public ip of the compute instance.',
                        sensitiveScope: 'none',
                    },
                ],
                flavors: {
                    serviceFlavors: [
                        {
                            name: '1vCPUs-1GB-normal',
                            properties: {
                                flavor_id: 's6.small.1',
                            },
                            priority: 3,
                            features: ['High Availability', 'Maximum performance'],
                            pricing: {
                                fixedPrices: [
                                    {
                                        regionName: 'any',
                                        siteName: 'Chinese Mainland',
                                        price: {
                                            cost: 172,
                                            currency: 'CNY',
                                            period: 'monthly',
                                        },
                                    },
                                    {
                                        regionName: 'any',
                                        siteName: 'International',
                                        price: {
                                            cost: 20,
                                            currency: 'USD',
                                            period: 'monthly',
                                        },
                                    },
                                    {
                                        regionName: 'any',
                                        siteName: 'Europe',
                                        price: {
                                            cost: 20,
                                            currency: 'USD',
                                            period: 'monthly',
                                        },
                                    },
                                ],
                                resourceUsage: {
                                    resources: [
                                        {
                                            count: 1,
                                            deployResourceKind: 'vm',
                                            properties: {
                                                cloud_service_type: 'hws.service.type.ec2',
                                                resource_type: 'hws.resource.type.vm',
                                                resource_spec: 's6.small.1.linux',
                                            },
                                        },
                                        {
                                            count: 1,
                                            deployResourceKind: 'volume',
                                            properties: {
                                                cloud_service_type: 'hws.service.type.ebs',
                                                resource_type: 'hws.resource.type.volume',
                                                resource_spec: 'SSD',
                                                resource_size: '40',
                                                size_measure_id: '17',
                                            },
                                        },
                                        {
                                            count: 1,
                                            deployResourceKind: 'publicIP',
                                            properties: {
                                                cloud_service_type: 'hws.service.type.vpc',
                                                resource_type: 'hws.resource.type.bandwidth',
                                                resource_spec: '19_bgp',
                                                resource_size: '5',
                                                size_measure_id: '15',
                                            },
                                        },
                                    ],
                                    licensePrices: [
                                        {
                                            regionName: 'any',
                                            siteName: 'Chinese Mainland',
                                            price: {
                                                cost: 0.5,
                                                currency: 'CNY',
                                                period: 'hourly',
                                            },
                                        },
                                        {
                                            regionName: 'any',
                                            siteName: 'International',
                                            price: {
                                                cost: 0.0015,
                                                currency: 'USD',
                                                period: 'hourly',
                                            },
                                        },
                                        {
                                            regionName: 'eu-west-101',
                                            siteName: 'Europe',
                                            price: {
                                                cost: 0.0015,
                                                currency: 'USD',
                                                period: 'hourly',
                                            },
                                        },
                                    ],
                                    markUpPrices: [
                                        {
                                            regionName: 'any',
                                            siteName: 'Chinese Mainland',
                                            price: {
                                                cost: 0.5,
                                                currency: 'CNY',
                                                period: 'hourly',
                                            },
                                        },
                                        {
                                            regionName: 'any',
                                            siteName: 'International',
                                            price: {
                                                cost: 0.0015,
                                                currency: 'USD',
                                                period: 'hourly',
                                            },
                                        },
                                        {
                                            regionName: 'any',
                                            siteName: 'Europe',
                                            price: {
                                                cost: 0.0015,
                                                currency: 'USD',
                                                period: 'hourly',
                                            },
                                        },
                                    ],
                                },
                                isPriceOnlyForManagementLayer: false,
                            },
                        },
                        {
                            name: '2vCPUs-4GB-normal',
                            properties: {
                                flavor_id: 's6.large.2',
                            },
                            priority: 2,
                            features: ['High Availability', 'Maximum performance'],
                            pricing: {
                                fixedPrices: [
                                    {
                                        regionName: 'any',
                                        siteName: 'Chinese Mainland',
                                        price: {
                                            cost: 280,
                                            currency: 'CNY',
                                            period: 'monthly',
                                        },
                                    },
                                    {
                                        regionName: 'any',
                                        siteName: 'International',
                                        price: {
                                            cost: 28.5,
                                            currency: 'USD',
                                            period: 'monthly',
                                        },
                                    },
                                    {
                                        regionName: 'any',
                                        siteName: 'Europe',
                                        price: {
                                            cost: 28.5,
                                            currency: 'USD',
                                            period: 'monthly',
                                        },
                                    },
                                ],
                                resourceUsage: {
                                    resources: [
                                        {
                                            count: 1,
                                            deployResourceKind: 'vm',
                                            properties: {
                                                cloud_service_type: 'hws.service.type.ec2',
                                                resource_type: 'hws.resource.type.vm',
                                                resource_spec: 's6.large.2.linux',
                                            },
                                        },
                                        {
                                            count: 1,
                                            deployResourceKind: 'volume',
                                            properties: {
                                                cloud_service_type: 'hws.service.type.ebs',
                                                resource_type: 'hws.resource.type.volume',
                                                resource_spec: 'SSD',
                                                resource_size: '40',
                                                size_measure_id: '17',
                                            },
                                        },
                                        {
                                            count: 1,
                                            deployResourceKind: 'publicIP',
                                            properties: {
                                                cloud_service_type: 'hws.service.type.vpc',
                                                resource_type: 'hws.resource.type.bandwidth',
                                                resource_spec: '19_bgp',
                                                resource_size: '5',
                                                size_measure_id: '15',
                                            },
                                        },
                                    ],
                                    licensePrices: [
                                        {
                                            regionName: 'any',
                                            siteName: 'Chinese Mainland',
                                            price: {
                                                cost: 0.5,
                                                currency: 'CNY',
                                                period: 'hourly',
                                            },
                                        },
                                        {
                                            regionName: 'any',
                                            siteName: 'International',
                                            price: {
                                                cost: 0.0015,
                                                currency: 'USD',
                                                period: 'hourly',
                                            },
                                        },
                                        {
                                            regionName: 'eu-west-101',
                                            siteName: 'Europe',
                                            price: {
                                                cost: 0.0015,
                                                currency: 'USD',
                                                period: 'hourly',
                                            },
                                        },
                                    ],
                                    markUpPrices: [
                                        {
                                            regionName: 'any',
                                            siteName: 'Chinese Mainland',
                                            price: {
                                                cost: 0.5,
                                                currency: 'CNY',
                                                period: 'hourly',
                                            },
                                        },
                                        {
                                            regionName: 'any',
                                            siteName: 'International',
                                            price: {
                                                cost: 0.0015,
                                                currency: 'USD',
                                                period: 'hourly',
                                            },
                                        },
                                        {
                                            regionName: 'any',
                                            siteName: 'Europe',
                                            price: {
                                                cost: 0.0015,
                                                currency: 'USD',
                                                period: 'hourly',
                                            },
                                        },
                                    ],
                                },
                                isPriceOnlyForManagementLayer: false,
                            },
                        },
                        {
                            name: '2vCPUs-8GB-normal',
                            properties: {
                                flavor_id: 's6.large.4',
                            },
                            priority: 1,
                            features: ['High Availability', 'Maximum performance'],
                            pricing: {
                                fixedPrices: [
                                    {
                                        regionName: 'any',
                                        siteName: 'Chinese Mainland',
                                        price: {
                                            cost: 360,
                                            currency: 'CNY',
                                            period: 'monthly',
                                        },
                                    },
                                    {
                                        regionName: 'any',
                                        siteName: 'International',
                                        price: {
                                            cost: 35,
                                            currency: 'USD',
                                            period: 'monthly',
                                        },
                                    },
                                    {
                                        regionName: 'any',
                                        siteName: 'Europe',
                                        price: {
                                            cost: 35,
                                            currency: 'USD',
                                            period: 'monthly',
                                        },
                                    },
                                ],
                                resourceUsage: {
                                    resources: [
                                        {
                                            count: 1,
                                            deployResourceKind: 'vm',
                                            properties: {
                                                cloud_service_type: 'hws.service.type.ec2',
                                                resource_type: 'hws.resource.type.vm',
                                                resource_spec: 's6.large.4.linux',
                                            },
                                        },
                                        {
                                            count: 1,
                                            deployResourceKind: 'volume',
                                            properties: {
                                                cloud_service_type: 'hws.service.type.ebs',
                                                resource_type: 'hws.resource.type.volume',
                                                resource_spec: 'SSD',
                                                resource_size: '40',
                                                size_measure_id: '17',
                                            },
                                        },
                                        {
                                            count: 1,
                                            deployResourceKind: 'publicIP',
                                            properties: {
                                                cloud_service_type: 'hws.service.type.vpc',
                                                resource_type: 'hws.resource.type.bandwidth',
                                                resource_spec: '19_bgp',
                                                resource_size: '5',
                                                size_measure_id: '15',
                                            },
                                        },
                                    ],
                                    licensePrices: [
                                        {
                                            regionName: 'any',
                                            siteName: 'Chinese Mainland',
                                            price: {
                                                cost: 0.5,
                                                currency: 'CNY',
                                                period: 'hourly',
                                            },
                                        },
                                        {
                                            regionName: 'any',
                                            siteName: 'International',
                                            price: {
                                                cost: 0.0015,
                                                currency: 'USD',
                                                period: 'hourly',
                                            },
                                        },
                                        {
                                            regionName: 'eu-west-101',
                                            siteName: 'Europe',
                                            price: {
                                                cost: 0.0015,
                                                currency: 'USD',
                                                period: 'hourly',
                                            },
                                        },
                                    ],
                                    markUpPrices: [
                                        {
                                            regionName: 'any',
                                            siteName: 'Chinese Mainland',
                                            price: {
                                                cost: 0.5,
                                                currency: 'CNY',
                                                period: 'hourly',
                                            },
                                        },
                                        {
                                            regionName: 'any',
                                            siteName: 'International',
                                            price: {
                                                cost: 0.0015,
                                                currency: 'USD',
                                                period: 'hourly',
                                            },
                                        },
                                        {
                                            regionName: 'any',
                                            siteName: 'Europe',
                                            price: {
                                                cost: 0.0015,
                                                currency: 'USD',
                                                period: 'hourly',
                                            },
                                        },
                                    ],
                                },
                                isPriceOnlyForManagementLayer: false,
                            },
                        },
                    ],
                    modificationImpact: {
                        isDataLost: false,
                        isServiceInterrupted: true,
                    },
                    isDowngradeAllowed: true,
                    downgradeAllowed: true,
                },
                billing: {
                    billingModes: ['Fixed', 'Pay per Use'],
                    defaultBillingMode: 'Pay per Use',
                },
                serviceHostingType: 'self',
                createdTime: '2025-03-26 14:30:51 +08:00',
                lastModifiedTime: '2025-03-26 14:30:51 +08:00',
                serviceTemplateRegistrationState: 'in-review',
                isReviewInProgress: true,
                isAvailableInCatalog: false,
                serviceProviderContactDetails: {
                    emails: ['test30@test.com', 'test31@test.com'],
                    phones: ['011-13422222222', '022-13344444444'],
                    chats: ['test1234', 'test1235'],
                    websites: ['https://hw.com', 'https://hwcloud.com'],
                },
                eula: 'This Acceptable Use Policy ("Policy") lists prohibited conduct and content when using the services provided by or on behalf of HUAWEI CLOUD and its affiliates. This Policy is an integral part of the HUAWEI CLOUD User Agreement ("User Agreement"). The examples and restrictions listed below are not exhaustive. We may update this Policy from time to time, and the updated Policy will be posted on the Website. By continuing to use the Services, you agree to abide by the latest version of this Policy. You acknowledge and agree that we may suspend or terminate the Services if you or your users violate this Policy. Terms used in the User Agreement have the same meanings in this Policy.\n\nProhibited Conduct\nWhen accessing or using the Services, or allowing others to access or use the Services, you may not:\n1. Violate any local, national or international laws, regulations and rules;\n2. Infringe or violate the rights of others, including but not limited to privacy rights or intellectual property rights;\n3. Engage in, encourage, assist or allow others to engage in any illegal, unlawful, infringing, harmful or fraudulent behavior, including but not limited to any of the following activities: harming or attempting to harm minors in any way, pornography, illegal gambling, illegal VPN construction, Ponzi schemes, cyber attacks, phishing or damage, privately intercepting any system, program or data, monitoring service data or traffic without permission, engaging in virtual currency "mining" or virtual currency transactions;\n4. Transmit, provide, upload, download, use or reuse, disseminate or distribute any illegal, infringing, offensive, or harmful content or materials, including but not limited to those listed in the "Prohibited Content" below;\n5. Transmit any data, send or upload any material that contains viruses, worms, Trojan horses, time bombs, keyboard loggers, spyware, adware or any other harmful programs or similar computer code designed to adversely affect the operation or security of any computer hardware or software;\n6. Attack, interfere with, disrupt or adversely affect any service, hardware, software, system, website or network, including but not limited to accessing or attacking any service, hardware, software, system, website or network using large amounts of automated means (including robots, crawlers, scripts or similar data gathering or extraction methods);\n7. Access any part of the Service, account or system without authorization, or attempt to do so;\n8. Violate or adversely affect the security or integrity of the Services, hardware, software, systems, websites or networks;\n9. Distribute, disseminate or send unsolicited email, bulk email or other messages, promotions, advertising or solicitations (such as "spam");\n10. Fraudulent offers of goods or services, or any advertising, promotional or other materials containing false, deceptive or misleading statements.\n',
                serviceConfigurationManage: null,
                serviceActions: null,
                links: [
                    {
                        rel: 'openApi',
                        href: 'http://localhost:8080/xpanse/catalog/services/662618ea-cef4-4220-9fa4-73afb5d5a20b/openapi',
                    },
                ],
            }),
        });
    });
};

export const mockServiceTemplatesSuccessResponse = async (page: Page, timeToWaitForResponse: number) => {
    await page.route(serviceTemplatesUrl, async (route) => {
        await new Promise((resolve) => {
            setTimeout(resolve, timeToWaitForResponse);
        });
        await route.fulfill({
            status: 400,
            contentType: 'application/json',
            body: JSON.stringify([
                {
                    serviceTemplateId: '662618ea-cef4-4220-9fa4-73afb5d5a20b',
                    name: 'terraform-ecs',
                    version: '1.0.0',
                    csp: 'HuaweiCloud',
                    category: 'compute',
                    serviceVendor: 'ISV-A',
                    regions: [
                        {
                            name: 'cn-southwest-2',
                            site: 'Chinese Mainland',
                            area: 'Asia China',
                        },
                        {
                            name: 'cn-southwest-2',
                            site: 'International',
                            area: 'Asia China',
                        },
                        {
                            name: 'eu-west-0',
                            site: 'International',
                            area: 'Europe Pairs',
                        },
                        {
                            name: 'eu-west-101',
                            site: 'Europe',
                            area: 'Europe Dublin',
                        },
                    ],
                    description: 'This is an enhanced compute services by ISV-A.',
                    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAACg0lEQVR4nO2dP24TURCHf65IxwFcADVHMSUHAKfCHTeIFIocgXAEXITUVrJNjsABYg6AJaBf9MRYeiAWBTn7dmbyfdLI1vqPZvx7M7OzK+tJAAAAAAAAAAAwATNJx5IuJW2S2KWkpcUWipk53ye1T9FEOa6cv3Wwsjf3ZLdVXCVTwrDPjhLAI+XhSNK2ypIwdOZ0ecxGFzG2kE5nji2k05ljC+l05thCOp05trs43Tu3IRBECNI0Q24knTmxGzJEOpEfThAEQdyVrCkyZCXpu6Q3fxwnQyYSZG2L4SOC+MiQuaS39lhDhtBD2uC9hwxBhjiYyHsm9V9M/YP3CPI7TOoNoYc4A0Gc4V2QFZO6L0HWTOq+BJkzqfsSZAgGQwRpA/fUnYEgzuCeujO8zyFD0NQRpA3eM2TFpO5LkDWTui9B5kzqvgQZgqaOIG1gMHQGggQU5My5Pbj/h0SlixhbSKczxxbS6cyxhXQ6c2whnc4c212cfizpueLRZRXks73npWLRIYgv0gpCyWpIyFWUOTYyxBk09QcqyAtJV5J+2D3y8nyhcaFkDfDuH39JO9V4pBVEB2ZGb/ZV0rnZrjo+VqakFeSQ097rSown1fGnlSilfI1BWkEO6SHf7LPv//Laub1W3jMGCPKfgnxAkPYl68q+f2dlas8zStY0ab2omvfOylTJDJr6hNeyTjnt9TcYLqx8laGQwdCBIFOQ9iyLy+8NCbmKMsdGhjiDHuIMBHEGJcsZIRtf5thCOp05tpBOZ45tv23e1raay8KRpC8Rt81bVldjtw42hNzck+3FKPZagZjZCuqT2kW0rVdlDi9NmE0Su5D0KqIYAAAAAAAAAACKz09haty1w+ee7QAAAABJRU5ErkJggg==',
                    deployment: {
                        deployerTool: {
                            kind: 'opentofu',
                            version: '=1.6.0',
                        },
                        inputVariables: [
                            {
                                name: 'admin_passwd',
                                kind: 'variable',
                                dataType: 'string',
                                example: null,
                                description:
                                    'The admin password of the compute instance. If the value is empty, will create a random password.',
                                value: null,
                                mandatory: false,
                                valueSchema: {
                                    minLength: 8,
                                    maxLength: 16,
                                    pattern: '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,16}$',
                                },
                                sensitiveScope: 'always',
                                autoFill: null,
                                modificationImpact: {
                                    isDataLost: false,
                                    isServiceInterrupted: true,
                                },
                            },
                            {
                                name: 'image_name',
                                kind: 'variable',
                                dataType: 'string',
                                example: 'Ubuntu 22.04 server 64bit',
                                description:
                                    'The image name of the compute instance. If the value is empty, will use the default value to create compute instance.',
                                value: 'Ubuntu 22.04 server 64bit',
                                mandatory: false,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                autoFill: null,
                                modificationImpact: {
                                    isDataLost: false,
                                    isServiceInterrupted: true,
                                },
                            },
                            {
                                name: 'vpc_name',
                                kind: 'variable',
                                dataType: 'string',
                                example: 'ecs-vpc-default',
                                description:
                                    'The vpc name of the compute instance. If the value is empty, will use the default value to find or create VPC.',
                                value: 'ecs-vpc-default',
                                mandatory: false,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                autoFill: null,
                                modificationImpact: {
                                    isDataLost: false,
                                    isServiceInterrupted: true,
                                },
                            },
                            {
                                name: 'subnet_name',
                                kind: 'variable',
                                dataType: 'string',
                                example: 'ecs-subnet-default',
                                description:
                                    'The sub network name of the compute instance. If the value is empty, will use the default value to find or create subnet.',
                                value: 'ecs-subnet-default',
                                mandatory: false,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                autoFill: null,
                                modificationImpact: {
                                    isDataLost: false,
                                    isServiceInterrupted: true,
                                },
                            },
                            {
                                name: 'secgroup_name',
                                kind: 'variable',
                                dataType: 'string',
                                example: 'ecs-secgroup-default',
                                description:
                                    'The security group name of the compute instance. If the value is empty, will use the default value to find or create security group.',
                                value: 'ecs-secgroup-default',
                                mandatory: false,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                autoFill: null,
                                modificationImpact: {
                                    isDataLost: false,
                                    isServiceInterrupted: true,
                                },
                            },
                        ],
                        outputVariables: [
                            {
                                name: 'admin_passwd',
                                dataType: 'string',
                                description: 'The admin password of the compute instance.',
                                sensitiveScope: 'always',
                            },
                            {
                                name: 'ecs_host',
                                dataType: 'string',
                                description: 'The host of the compute instance.',
                                sensitiveScope: 'none',
                            },
                            {
                                name: 'ecs_public_ip',
                                dataType: 'string',
                                description: 'The public ip of the compute instance.',
                                sensitiveScope: 'none',
                            },
                        ],
                        credentialType: 'variables',
                        serviceAvailabilityConfig: [
                            {
                                displayName: 'Availability Zone',
                                varName: 'availability_zone',
                                mandatory: false,
                                description:
                                    'The availability zone to deploy the service instance. If the value is empty, the service instance will be deployed in a random availability zone.',
                            },
                        ],
                        scriptFiles: {
                            'variables.tf':
                                'variable "region" {\n  type        = string\n  description = "The region to deploy the compute instance."\n}\n\nvariable "availability_zone" {\n  type        = string\n  default     = ""\n  description = "The availability zone to deploy the compute instance."\n}\n\nvariable "flavor_id" {\n  type        = string\n  default     = "s6.large.2"\n  description = "The flavor_id of the compute instance."\n}\n\nvariable "image_name" {\n  type        = string\n  default     = "Ubuntu 22.04 server 64bit"\n  description = "The image name of the compute instance."\n}\n\nvariable "admin_passwd" {\n  type        = string\n  default     = ""\n  description = "The root password of the compute instance."\n}\n\nvariable "vpc_name" {\n  type        = string\n  default     = "ecs-vpc-default"\n  description = "The vpc name of the compute instance."\n}\n\nvariable "subnet_name" {\n  type        = string\n  default     = "ecs-subnet-default"\n  description = "The subnet name of the compute instance."\n}\n\nvariable "secgroup_name" {\n  type        = string\n  default     = "ecs-secgroup-default"\n  description = "The security group name of the compute instance."\n}\n',
                            'provider.tf':
                                'terraform {\n  required_providers {\n    huaweicloud = {\n      source  = "huaweicloud/huaweicloud"\n      version = "~> 1.61.0"\n    }\n  }\n}\n\nprovider "huaweicloud" {\n  region = var.region\n}\n',
                            'main.tf':
                                'data "huaweicloud_availability_zones" "osc-az" {}\n\ndata "huaweicloud_vpcs" "existing" {\n  name = var.vpc_name\n}\n\ndata "huaweicloud_vpc_subnets" "existing" {\n  name = var.subnet_name\n}\n\ndata "huaweicloud_networking_secgroups" "existing" {\n  name = var.secgroup_name\n}\n\nlocals {\n  availability_zone = var.availability_zone == "" ? data.huaweicloud_availability_zones.osc-az.names[0] : var.availability_zone\n  admin_passwd      = var.admin_passwd == "" ? random_password.password.result : var.admin_passwd\n  vpc_id            = length(data.huaweicloud_vpcs.existing.vpcs) > 0 ? data.huaweicloud_vpcs.existing.vpcs[0].id : huaweicloud_vpc.new[0].id\n  subnet_id         = length(data.huaweicloud_vpc_subnets.existing.subnets)> 0 ? data.huaweicloud_vpc_subnets.existing.subnets[0].id : huaweicloud_vpc_subnet.new[0].id\n  secgroup_id       = length(data.huaweicloud_networking_secgroups.existing.security_groups) > 0 ? data.huaweicloud_networking_secgroups.existing.security_groups[0].id : huaweicloud_networking_secgroup.new[0].id\n}\n\nresource "huaweicloud_vpc" "new" {\n  count = length(data.huaweicloud_vpcs.existing.vpcs) == 0 ? 1 : 0\n  name  = var.vpc_name\n  cidr  = "192.168.0.0/16"\n}\n\nresource "huaweicloud_vpc_subnet" "new" {\n  count      = length(data.huaweicloud_vpcs.existing.vpcs) == 0 ? 1 : 0\n  vpc_id     = local.vpc_id\n  name       = var.subnet_name\n  cidr       = "192.168.10.0/24"\n  gateway_ip = "192.168.10.1"\n}\n\nresource "huaweicloud_networking_secgroup" "new" {\n  count       = length(data.huaweicloud_networking_secgroups.existing.security_groups) == 0 ? 1 : 0\n  name        = var.secgroup_name\n  description = "Kafka cluster security group"\n}\n\nresource "huaweicloud_networking_secgroup_rule" "secgroup_rule_0" {\n  count             = length(data.huaweicloud_networking_secgroups.existing.security_groups) == 0 ? 1 : 0\n  direction         = "ingress"\n  ethertype         = "IPv4"\n  protocol          = "tcp"\n  port_range_min    = 22\n  port_range_max    = 22\n  remote_ip_prefix  = "121.37.117.211/32"\n  security_group_id = local.secgroup_id\n}\n\nresource "huaweicloud_networking_secgroup_rule" "secgroup_rule_1" {\n  count             = length(data.huaweicloud_networking_secgroups.existing.security_groups) == 0 ? 1 : 0\n  direction         = "ingress"\n  ethertype         = "IPv4"\n  protocol          = "tcp"\n  port_range_min    = 8080\n  port_range_max    = 8088\n  remote_ip_prefix  = "121.37.117.211/32"\n  security_group_id = local.secgroup_id\n}\n\nresource "huaweicloud_networking_secgroup_rule" "secgroup_rule_2" {\n  count             = length(data.huaweicloud_networking_secgroups.existing.security_groups) == 0 ? 1 : 0\n  direction         = "ingress"\n  ethertype         = "IPv4"\n  protocol          = "tcp"\n  port_range_min    = 9090\n  port_range_max    = 9099\n  remote_ip_prefix  = "121.37.117.211/32"\n  security_group_id = local.secgroup_id\n}\n\nresource "random_id" "new" {\n  byte_length = 4\n}\n\nresource "random_password" "password" {\n  length           = 12\n  upper            = true\n  lower            = true\n  numeric          = true\n  special          = true\n  min_special      = 1\n  override_special = "#%@"\n}\n\ndata "huaweicloud_images_image" "image" {\n  name                  = var.image_name\n  most_recent           = true\n  enterprise_project_id = "0"\n}\n\nresource "huaweicloud_compute_instance" "ecs-tf" {\n  availability_zone  = local.availability_zone\n  name               = "ecs-tf-${random_id.new.hex}"\n  flavor_id          = var.flavor_id\n  security_group_ids = [ local.secgroup_id ]\n  image_id           = data.huaweicloud_images_image.image.id\n  admin_pass         = local.admin_passwd\n  network {\n    uuid = local.subnet_id\n  }\n}\n\nresource "huaweicloud_evs_volume" "volume" {\n  name              = "volume-tf-${random_id.new.hex}"\n  description       = "my volume"\n  volume_type       = "SSD"\n  size              = 40\n  availability_zone = local.availability_zone\n  tags = {\n    foo = "bar"\n    key = "value"\n  }\n}\n\nresource "huaweicloud_compute_volume_attach" "attached" {\n  instance_id = huaweicloud_compute_instance.ecs-tf.id\n  volume_id   = huaweicloud_evs_volume.volume.id\n}\n\nresource "huaweicloud_vpc_eip" "eip-tf" {\n   publicip {\n     type = var.region == "eu-west-101" ? "5_bgp" : "5_sbgp"\n  }\n  bandwidth {\n    name        = "eip-tf-${random_id.new.hex}"\n    size        = 5\n    share_type  = "PER"\n    charge_mode = "traffic"\n  }\n}\n\nresource "huaweicloud_compute_eip_associate" "associated" {\n  public_ip   = huaweicloud_vpc_eip.eip-tf.address\n  instance_id = huaweicloud_compute_instance.ecs-tf.id\n}\n',
                            'outputs.tf':
                                'output "ecs_host" {\n  value = huaweicloud_compute_instance.ecs-tf.access_ip_v4\n}\n\noutput "ecs_public_ip" {\n  value = huaweicloud_vpc_eip.eip-tf.address\n}\n\noutput "admin_passwd" {\n  value = var.admin_passwd == "" ? nonsensitive(local.admin_passwd) : local.admin_passwd\n}\n',
                        },
                        scriptsRepo: null,
                    },
                    inputVariables: [
                        {
                            name: 'admin_passwd',
                            kind: 'variable',
                            dataType: 'string',
                            example: null,
                            description:
                                'The admin password of the compute instance. If the value is empty, will create a random password.',
                            value: null,
                            mandatory: false,
                            valueSchema: {
                                minLength: 8,
                                maxLength: 16,
                                pattern: '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,16}$',
                            },
                            sensitiveScope: 'always',
                            autoFill: null,
                            modificationImpact: {
                                isDataLost: false,
                                isServiceInterrupted: true,
                            },
                        },
                        {
                            name: 'image_name',
                            kind: 'variable',
                            dataType: 'string',
                            example: 'Ubuntu 22.04 server 64bit',
                            description:
                                'The image name of the compute instance. If the value is empty, will use the default value to create compute instance.',
                            value: 'Ubuntu 22.04 server 64bit',
                            mandatory: false,
                            valueSchema: null,
                            sensitiveScope: 'none',
                            autoFill: null,
                            modificationImpact: {
                                isDataLost: false,
                                isServiceInterrupted: true,
                            },
                        },
                        {
                            name: 'vpc_name',
                            kind: 'variable',
                            dataType: 'string',
                            example: 'ecs-vpc-default',
                            description:
                                'The vpc name of the compute instance. If the value is empty, will use the default value to find or create VPC.',
                            value: 'ecs-vpc-default',
                            mandatory: false,
                            valueSchema: null,
                            sensitiveScope: 'none',
                            autoFill: null,
                            modificationImpact: {
                                isDataLost: false,
                                isServiceInterrupted: true,
                            },
                        },
                        {
                            name: 'subnet_name',
                            kind: 'variable',
                            dataType: 'string',
                            example: 'ecs-subnet-default',
                            description:
                                'The sub network name of the compute instance. If the value is empty, will use the default value to find or create subnet.',
                            value: 'ecs-subnet-default',
                            mandatory: false,
                            valueSchema: null,
                            sensitiveScope: 'none',
                            autoFill: null,
                            modificationImpact: {
                                isDataLost: false,
                                isServiceInterrupted: true,
                            },
                        },
                        {
                            name: 'secgroup_name',
                            kind: 'variable',
                            dataType: 'string',
                            example: 'ecs-secgroup-default',
                            description:
                                'The security group name of the compute instance. If the value is empty, will use the default value to find or create security group.',
                            value: 'ecs-secgroup-default',
                            mandatory: false,
                            valueSchema: null,
                            sensitiveScope: 'none',
                            autoFill: null,
                            modificationImpact: {
                                isDataLost: false,
                                isServiceInterrupted: true,
                            },
                        },
                    ],
                    outputVariables: [
                        {
                            name: 'admin_passwd',
                            dataType: 'string',
                            description: 'The admin password of the compute instance.',
                            sensitiveScope: 'always',
                        },
                        {
                            name: 'ecs_host',
                            dataType: 'string',
                            description: 'The host of the compute instance.',
                            sensitiveScope: 'none',
                        },
                        {
                            name: 'ecs_public_ip',
                            dataType: 'string',
                            description: 'The public ip of the compute instance.',
                            sensitiveScope: 'none',
                        },
                    ],
                    flavors: {
                        serviceFlavors: [
                            {
                                name: '1vCPUs-1GB-normal',
                                properties: {
                                    flavor_id: 's6.small.1',
                                },
                                priority: 3,
                                features: ['High Availability', 'Maximum performance'],
                                pricing: {
                                    fixedPrices: [
                                        {
                                            regionName: 'any',
                                            siteName: 'Chinese Mainland',
                                            price: {
                                                cost: 172,
                                                currency: 'CNY',
                                                period: 'monthly',
                                            },
                                        },
                                        {
                                            regionName: 'any',
                                            siteName: 'International',
                                            price: {
                                                cost: 20,
                                                currency: 'USD',
                                                period: 'monthly',
                                            },
                                        },
                                        {
                                            regionName: 'any',
                                            siteName: 'Europe',
                                            price: {
                                                cost: 20,
                                                currency: 'USD',
                                                period: 'monthly',
                                            },
                                        },
                                    ],
                                    resourceUsage: {
                                        resources: [
                                            {
                                                count: 1,
                                                deployResourceKind: 'vm',
                                                properties: {
                                                    cloud_service_type: 'hws.service.type.ec2',
                                                    resource_type: 'hws.resource.type.vm',
                                                    resource_spec: 's6.small.1.linux',
                                                },
                                            },
                                            {
                                                count: 1,
                                                deployResourceKind: 'volume',
                                                properties: {
                                                    cloud_service_type: 'hws.service.type.ebs',
                                                    resource_type: 'hws.resource.type.volume',
                                                    resource_spec: 'SSD',
                                                    resource_size: '40',
                                                    size_measure_id: '17',
                                                },
                                            },
                                            {
                                                count: 1,
                                                deployResourceKind: 'publicIP',
                                                properties: {
                                                    cloud_service_type: 'hws.service.type.vpc',
                                                    resource_type: 'hws.resource.type.bandwidth',
                                                    resource_spec: '19_bgp',
                                                    resource_size: '5',
                                                    size_measure_id: '15',
                                                },
                                            },
                                        ],
                                        licensePrices: [
                                            {
                                                regionName: 'any',
                                                siteName: 'Chinese Mainland',
                                                price: {
                                                    cost: 0.5,
                                                    currency: 'CNY',
                                                    period: 'hourly',
                                                },
                                            },
                                            {
                                                regionName: 'any',
                                                siteName: 'International',
                                                price: {
                                                    cost: 0.0015,
                                                    currency: 'USD',
                                                    period: 'hourly',
                                                },
                                            },
                                            {
                                                regionName: 'eu-west-101',
                                                siteName: 'Europe',
                                                price: {
                                                    cost: 0.0015,
                                                    currency: 'USD',
                                                    period: 'hourly',
                                                },
                                            },
                                        ],
                                        markUpPrices: [
                                            {
                                                regionName: 'any',
                                                siteName: 'Chinese Mainland',
                                                price: {
                                                    cost: 0.5,
                                                    currency: 'CNY',
                                                    period: 'hourly',
                                                },
                                            },
                                            {
                                                regionName: 'any',
                                                siteName: 'International',
                                                price: {
                                                    cost: 0.0015,
                                                    currency: 'USD',
                                                    period: 'hourly',
                                                },
                                            },
                                            {
                                                regionName: 'any',
                                                siteName: 'Europe',
                                                price: {
                                                    cost: 0.0015,
                                                    currency: 'USD',
                                                    period: 'hourly',
                                                },
                                            },
                                        ],
                                    },
                                    isPriceOnlyForManagementLayer: false,
                                },
                            },
                            {
                                name: '2vCPUs-4GB-normal',
                                properties: {
                                    flavor_id: 's6.large.2',
                                },
                                priority: 2,
                                features: ['High Availability', 'Maximum performance'],
                                pricing: {
                                    fixedPrices: [
                                        {
                                            regionName: 'any',
                                            siteName: 'Chinese Mainland',
                                            price: {
                                                cost: 280,
                                                currency: 'CNY',
                                                period: 'monthly',
                                            },
                                        },
                                        {
                                            regionName: 'any',
                                            siteName: 'International',
                                            price: {
                                                cost: 28.5,
                                                currency: 'USD',
                                                period: 'monthly',
                                            },
                                        },
                                        {
                                            regionName: 'any',
                                            siteName: 'Europe',
                                            price: {
                                                cost: 28.5,
                                                currency: 'USD',
                                                period: 'monthly',
                                            },
                                        },
                                    ],
                                    resourceUsage: {
                                        resources: [
                                            {
                                                count: 1,
                                                deployResourceKind: 'vm',
                                                properties: {
                                                    cloud_service_type: 'hws.service.type.ec2',
                                                    resource_type: 'hws.resource.type.vm',
                                                    resource_spec: 's6.large.2.linux',
                                                },
                                            },
                                            {
                                                count: 1,
                                                deployResourceKind: 'volume',
                                                properties: {
                                                    cloud_service_type: 'hws.service.type.ebs',
                                                    resource_type: 'hws.resource.type.volume',
                                                    resource_spec: 'SSD',
                                                    resource_size: '40',
                                                    size_measure_id: '17',
                                                },
                                            },
                                            {
                                                count: 1,
                                                deployResourceKind: 'publicIP',
                                                properties: {
                                                    cloud_service_type: 'hws.service.type.vpc',
                                                    resource_type: 'hws.resource.type.bandwidth',
                                                    resource_spec: '19_bgp',
                                                    resource_size: '5',
                                                    size_measure_id: '15',
                                                },
                                            },
                                        ],
                                        licensePrices: [
                                            {
                                                regionName: 'any',
                                                siteName: 'Chinese Mainland',
                                                price: {
                                                    cost: 0.5,
                                                    currency: 'CNY',
                                                    period: 'hourly',
                                                },
                                            },
                                            {
                                                regionName: 'any',
                                                siteName: 'International',
                                                price: {
                                                    cost: 0.0015,
                                                    currency: 'USD',
                                                    period: 'hourly',
                                                },
                                            },
                                            {
                                                regionName: 'eu-west-101',
                                                siteName: 'Europe',
                                                price: {
                                                    cost: 0.0015,
                                                    currency: 'USD',
                                                    period: 'hourly',
                                                },
                                            },
                                        ],
                                        markUpPrices: [
                                            {
                                                regionName: 'any',
                                                siteName: 'Chinese Mainland',
                                                price: {
                                                    cost: 0.5,
                                                    currency: 'CNY',
                                                    period: 'hourly',
                                                },
                                            },
                                            {
                                                regionName: 'any',
                                                siteName: 'International',
                                                price: {
                                                    cost: 0.0015,
                                                    currency: 'USD',
                                                    period: 'hourly',
                                                },
                                            },
                                            {
                                                regionName: 'any',
                                                siteName: 'Europe',
                                                price: {
                                                    cost: 0.0015,
                                                    currency: 'USD',
                                                    period: 'hourly',
                                                },
                                            },
                                        ],
                                    },
                                    isPriceOnlyForManagementLayer: false,
                                },
                            },
                            {
                                name: '2vCPUs-8GB-normal',
                                properties: {
                                    flavor_id: 's6.large.4',
                                },
                                priority: 1,
                                features: ['High Availability', 'Maximum performance'],
                                pricing: {
                                    fixedPrices: [
                                        {
                                            regionName: 'any',
                                            siteName: 'Chinese Mainland',
                                            price: {
                                                cost: 360,
                                                currency: 'CNY',
                                                period: 'monthly',
                                            },
                                        },
                                        {
                                            regionName: 'any',
                                            siteName: 'International',
                                            price: {
                                                cost: 35,
                                                currency: 'USD',
                                                period: 'monthly',
                                            },
                                        },
                                        {
                                            regionName: 'any',
                                            siteName: 'Europe',
                                            price: {
                                                cost: 35,
                                                currency: 'USD',
                                                period: 'monthly',
                                            },
                                        },
                                    ],
                                    resourceUsage: {
                                        resources: [
                                            {
                                                count: 1,
                                                deployResourceKind: 'vm',
                                                properties: {
                                                    cloud_service_type: 'hws.service.type.ec2',
                                                    resource_type: 'hws.resource.type.vm',
                                                    resource_spec: 's6.large.4.linux',
                                                },
                                            },
                                            {
                                                count: 1,
                                                deployResourceKind: 'volume',
                                                properties: {
                                                    cloud_service_type: 'hws.service.type.ebs',
                                                    resource_type: 'hws.resource.type.volume',
                                                    resource_spec: 'SSD',
                                                    resource_size: '40',
                                                    size_measure_id: '17',
                                                },
                                            },
                                            {
                                                count: 1,
                                                deployResourceKind: 'publicIP',
                                                properties: {
                                                    cloud_service_type: 'hws.service.type.vpc',
                                                    resource_type: 'hws.resource.type.bandwidth',
                                                    resource_spec: '19_bgp',
                                                    resource_size: '5',
                                                    size_measure_id: '15',
                                                },
                                            },
                                        ],
                                        licensePrices: [
                                            {
                                                regionName: 'any',
                                                siteName: 'Chinese Mainland',
                                                price: {
                                                    cost: 0.5,
                                                    currency: 'CNY',
                                                    period: 'hourly',
                                                },
                                            },
                                            {
                                                regionName: 'any',
                                                siteName: 'International',
                                                price: {
                                                    cost: 0.0015,
                                                    currency: 'USD',
                                                    period: 'hourly',
                                                },
                                            },
                                            {
                                                regionName: 'eu-west-101',
                                                siteName: 'Europe',
                                                price: {
                                                    cost: 0.0015,
                                                    currency: 'USD',
                                                    period: 'hourly',
                                                },
                                            },
                                        ],
                                        markUpPrices: [
                                            {
                                                regionName: 'any',
                                                siteName: 'Chinese Mainland',
                                                price: {
                                                    cost: 0.5,
                                                    currency: 'CNY',
                                                    period: 'hourly',
                                                },
                                            },
                                            {
                                                regionName: 'any',
                                                siteName: 'International',
                                                price: {
                                                    cost: 0.0015,
                                                    currency: 'USD',
                                                    period: 'hourly',
                                                },
                                            },
                                            {
                                                regionName: 'any',
                                                siteName: 'Europe',
                                                price: {
                                                    cost: 0.0015,
                                                    currency: 'USD',
                                                    period: 'hourly',
                                                },
                                            },
                                        ],
                                    },
                                    isPriceOnlyForManagementLayer: false,
                                },
                            },
                        ],
                        modificationImpact: {
                            isDataLost: false,
                            isServiceInterrupted: true,
                        },
                        isDowngradeAllowed: true,
                        downgradeAllowed: true,
                    },
                    billing: {
                        billingModes: ['Fixed', 'Pay per Use'],
                        defaultBillingMode: 'Pay per Use',
                    },
                    serviceHostingType: 'self',
                    createdTime: '2025-03-26 14:30:51 +08:00',
                    lastModifiedTime: '2025-03-26 14:30:51 +08:00',
                    serviceTemplateRegistrationState: 'in-review',
                    isReviewInProgress: true,
                    isAvailableInCatalog: false,
                    serviceProviderContactDetails: {
                        emails: ['test30@test.com', 'test31@test.com'],
                        phones: ['011-13422222222', '022-13344444444'],
                        chats: ['test1234', 'test1235'],
                        websites: ['https://hw.com', 'https://hwcloud.com'],
                    },
                    eula: 'This Acceptable Use Policy ("Policy") lists prohibited conduct and content when using the services provided by or on behalf of HUAWEI CLOUD and its affiliates. This Policy is an integral part of the HUAWEI CLOUD User Agreement ("User Agreement"). The examples and restrictions listed below are not exhaustive. We may update this Policy from time to time, and the updated Policy will be posted on the Website. By continuing to use the Services, you agree to abide by the latest version of this Policy. You acknowledge and agree that we may suspend or terminate the Services if you or your users violate this Policy. Terms used in the User Agreement have the same meanings in this Policy.\n\nProhibited Conduct\nWhen accessing or using the Services, or allowing others to access or use the Services, you may not:\n1. Violate any local, national or international laws, regulations and rules;\n2. Infringe or violate the rights of others, including but not limited to privacy rights or intellectual property rights;\n3. Engage in, encourage, assist or allow others to engage in any illegal, unlawful, infringing, harmful or fraudulent behavior, including but not limited to any of the following activities: harming or attempting to harm minors in any way, pornography, illegal gambling, illegal VPN construction, Ponzi schemes, cyber attacks, phishing or damage, privately intercepting any system, program or data, monitoring service data or traffic without permission, engaging in virtual currency "mining" or virtual currency transactions;\n4. Transmit, provide, upload, download, use or reuse, disseminate or distribute any illegal, infringing, offensive, or harmful content or materials, including but not limited to those listed in the "Prohibited Content" below;\n5. Transmit any data, send or upload any material that contains viruses, worms, Trojan horses, time bombs, keyboard loggers, spyware, adware or any other harmful programs or similar computer code designed to adversely affect the operation or security of any computer hardware or software;\n6. Attack, interfere with, disrupt or adversely affect any service, hardware, software, system, website or network, including but not limited to accessing or attacking any service, hardware, software, system, website or network using large amounts of automated means (including robots, crawlers, scripts or similar data gathering or extraction methods);\n7. Access any part of the Service, account or system without authorization, or attempt to do so;\n8. Violate or adversely affect the security or integrity of the Services, hardware, software, systems, websites or networks;\n9. Distribute, disseminate or send unsolicited email, bulk email or other messages, promotions, advertising or solicitations (such as "spam");\n10. Fraudulent offers of goods or services, or any advertising, promotional or other materials containing false, deceptive or misleading statements.\n',
                    serviceConfigurationManage: null,
                    serviceActions: null,
                    links: [
                        {
                            rel: 'openApi',
                            href: 'http://localhost:8080/xpanse/catalog/services/662618ea-cef4-4220-9fa4-73afb5d5a20b/openapi',
                        },
                    ],
                },
            ]),
        });
    });
};

export const mockRegisterErrorResponse = async (page: Page, timeToWaitForResponse: number) => {
    await page.route(serviceTemplateUrl, async (route) => {
        await new Promise((resolve) => {
            setTimeout(resolve, timeToWaitForResponse);
        });
        await route.fulfill({
            status: 400,
            contentType: 'application/json',
            body: JSON.stringify({
                errorType: 'Service Template Request Not Allowed',
                details: [
                    'Service template already registered with id 10c2baff-36a8-4ea9-9041-b51409b0f291. The register request is not allowed.',
                ],
            }),
        });
    });
};
