import { Page } from 'playwright-core';
import {
    cancelRequestUrl,
    deleteServiceUrl,
    isvServicesUrl,
    middlewareRequestsReviewUrl,
    middlewareRequestsUrl,
    middlewareServiceDetailUrl,
    middlewareServicePoliciesUrl,
    middlewareServiceTemplatesUrl,
    republishServiceUrl,
    serviceTemplateUrl,
    unpublishServiceUrl,
    updateServiceTemplateUrl,
} from './endpoints.ts';

export const mockMiddlewareServiceTemplatesSuccessResponse = async (page: Page, timeToWaitForResponse: number) => {
    await page.route(middlewareServiceTemplatesUrl, async (route) => {
        await new Promise((resolve) => {
            setTimeout(resolve, timeToWaitForResponse);
        });
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([
                {
                    serviceTemplateId: '21597cd5-748e-4f0e-9768-baaa5275b2bd',
                    name: 'kafka-cluster',
                    version: '1.0.0',
                    csp: 'HuaweiCloud',
                    category: 'middleware',
                    serviceVendor: 'ISV-A',
                    regions: [
                        {
                            name: 'cn-southwest-2',
                            site: 'Chinese Mainland',
                            area: 'Asia China',
                        },
                        {
                            name: 'cn-north-4',
                            site: 'Chinese Mainland',
                            area: 'Asia China',
                        },
                    ],
                    description: 'This is an enhanced Kafka cluster services by ISV-A.',
                    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAACRAQMAAAAPc4+9AAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAZQTFRF+/v7Hh8gVD0A0wAAAcVJREFUeJzNlc1twzAMhSX44KNH0CgaTd6gK3kUd4McDVTwq/hjiUyaIkV7qNA2/QCFIh+ppxB+svLNEqqBGTC0ANugBOwmCGDCFOAwIWGDOoqoODtN2BdL6wxD9NMTO9tXPa1PqL5M30W5p8lm5vNcF0t7ahSrVguqNqmMokRW4YQucVjBCBWH1Z2g3WDlW2skoYU+2x8JOtGedBF3k2iXMO0j16iUiI6gxzPdQhnU/s2G9pCO57QY2r6hvjPbKJHq7DRTRXT60avtuTRdbrFJI3mSZhNOqYjVbd99YyK1QKWzEqSWrE0k07U60uPaelflMzaaeu1KBuurHSsn572I1KWy2joX5ZBfWbS/VEt50H5P6aL4JxTuyJ/+QCNPX4PWF3Q8Xe1eF9FsLdD2VaOnaP2hWvs+zI58/7i3vH3nRFtDZpyTUNaZkON5XnBNsp8lrmDMrpvBr+b6pUl+4XbkQdndqnzYGzfuJm1JmIWimIbe6dndd/bk7gVce/cJdo3uIeLJl7+I2xTnPek67mjtDeppE7b03Ov+kSfDe3JweW53njxeGfXkaz28VeYd86+af/H8a7hgJKaebILaFzakLfxyfQLTxVB6K1K9KQAAAABJRU5ErkJggg==',
                    deployment: {
                        deployerTool: {
                            kind: 'terraform',
                            version: '=1.6.0',
                        },
                        inputVariables: [
                            {
                                name: 'admin_passwd',
                                kind: 'variable',
                                dataType: 'string',
                                example: null,
                                description:
                                    'The admin password of all nodes in the Kafka cluster instance. If the value is empty, will create a random password.',
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
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                            },
                            {
                                name: 'vpc_name',
                                kind: 'variable',
                                dataType: 'string',
                                example: 'kafka-vpc-default',
                                description:
                                    'The vpc name of all nodes in the Kafka cluster instance. If the value is empty, will use the default value to find or create VPC.',
                                value: 'kafka-vpc-default',
                                mandatory: false,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                autoFill: null,
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                            },
                            {
                                name: 'subnet_name',
                                kind: 'variable',
                                dataType: 'string',
                                example: 'kafka-subnet-default',
                                description:
                                    'The sub network name of all nodes in the Kafka cluster instance. If the value is empty, will use the default value to find or create subnet.',
                                value: 'kafka-subnet-default',
                                mandatory: false,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                autoFill: null,
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                            },
                            {
                                name: 'secgroup_name',
                                kind: 'variable',
                                dataType: 'string',
                                example: 'kafka-secgroup-default',
                                description:
                                    'The security group name of all nodes in the Kafka cluster instance. If the value is empty, will use the default value to find or create security group.',
                                value: 'kafka-secgroup-default',
                                mandatory: false,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                autoFill: null,
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                            },
                        ],
                        outputVariables: [
                            {
                                name: 'admin_passwd',
                                dataType: 'string',
                                description: 'The admin password of the service instance.',
                                sensitiveScope: 'always',
                            },
                            {
                                name: 'zookeeper_server',
                                dataType: 'string',
                                description: 'The server address of zookeeper.',
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
                                'variable "region" {\n  type        = string\n  description = "The region to deploy the Kafka cluster instance."\n}\n\nvariable "availability_zone" {\n  type        = string\n  default     = ""\n  description = "The availability zone to deploy the Kafka cluster instance."\n}\n\nvariable "flavor_id" {\n  type        = string\n  default     = "s6.large.2"\n  description = "The flavor_id of all nodes in the Kafka cluster instance."\n}\n\nvariable "worker_nodes_count" {\n  type        = string\n  default     = 3\n  description = "The worker nodes count in the Kafka cluster instance."\n}\n\nvariable "admin_passwd" {\n  type        = string\n  default     = ""\n  description = "The root password of all nodes in the Kafka cluster instance."\n}\n\nvariable "vpc_name" {\n  type        = string\n  default     = "kafka-vpc-default"\n  description = "The vpc name of all nodes in the Kafka cluster instance."\n}\n\nvariable "subnet_name" {\n  type        = string\n  default     = "kafka-subnet-default"\n  description = "The subnet name of all nodes in the Kafka cluster instance."\n}\n\nvariable "secgroup_name" {\n  type        = string\n  default     = "kafka-secgroup-default"\n  description = "The security group name of all nodes in the Kafka cluster instance."\n}\n',
                            'provider.tf':
                                'terraform {\n  required_providers {\n    huaweicloud = {\n      source  = "huaweicloud/huaweicloud"\n      version = "~> 1.61.0"\n    }\n  }\n}\n\nprovider "huaweicloud" {\n  region = var.region\n}\n',
                            'main.tf':
                                'data "huaweicloud_availability_zones" "osc-az" {}\n\ndata "huaweicloud_vpcs" "existing" {\n  name = var.vpc_name\n}\n\ndata "huaweicloud_vpc_subnets" "existing" {\n  name = var.subnet_name\n}\n\ndata "huaweicloud_networking_secgroups" "existing" {\n  name = var.secgroup_name\n}\n\nlocals {\n  availability_zone = var.availability_zone == "" ? data.huaweicloud_availability_zones.osc-az.names[0] : var.availability_zone\n  admin_passwd      = var.admin_passwd == "" ? random_password.password.result : var.admin_passwd\n  vpc_id            = length(data.huaweicloud_vpcs.existing.vpcs) > 0 ? data.huaweicloud_vpcs.existing.vpcs[0].id : huaweicloud_vpc.new[0].id\n  subnet_id         = length(data.huaweicloud_vpc_subnets.existing.subnets)> 0 ? data.huaweicloud_vpc_subnets.existing.subnets[0].id : huaweicloud_vpc_subnet.new[0].id\n  secgroup_id       = length(data.huaweicloud_networking_secgroups.existing.security_groups) > 0 ? data.huaweicloud_networking_secgroups.existing.security_groups[0].id : huaweicloud_networking_secgroup.new[0].id\n}\n\nresource "huaweicloud_vpc" "new" {\n  count = length(data.huaweicloud_vpcs.existing.vpcs) == 0 ? 1 : 0\n  name  = var.vpc_name\n  cidr  = "192.168.0.0/16"\n}\n\nresource "huaweicloud_vpc_subnet" "new" {\n  count      = length(data.huaweicloud_vpcs.existing.vpcs) == 0 ? 1 : 0\n  vpc_id     = local.vpc_id\n  name       = var.subnet_name\n  cidr       = "192.168.10.0/24"\n  gateway_ip = "192.168.10.1"\n}\n\nresource "huaweicloud_networking_secgroup" "new" {\n  count       = length(data.huaweicloud_networking_secgroups.existing.security_groups) == 0 ? 1 : 0\n  name        = var.secgroup_name\n  description = "Kafka cluster security group"\n}\n\nresource "huaweicloud_networking_secgroup_rule" "secgroup_rule_0" {\n  count             = length(data.huaweicloud_networking_secgroups.existing.security_groups) == 0 ? 1 : 0\n  direction         = "ingress"\n  ethertype         = "IPv4"\n  protocol          = "tcp"\n  port_range_min    = 22\n  port_range_max    = 22\n  remote_ip_prefix  = "121.37.117.211/32"\n  security_group_id = local.secgroup_id\n}\n\nresource "huaweicloud_networking_secgroup_rule" "secgroup_rule_1" {\n  count             = length(data.huaweicloud_networking_secgroups.existing.security_groups) == 0 ? 1 : 0\n  direction         = "ingress"\n  ethertype         = "IPv4"\n  protocol          = "tcp"\n  port_range_min    = 2181\n  port_range_max    = 2181\n  remote_ip_prefix  = "121.37.117.211/32"\n  security_group_id = local.secgroup_id\n}\n\nresource "huaweicloud_networking_secgroup_rule" "secgroup_rule_2" {\n  count             = length(data.huaweicloud_networking_secgroups.existing.security_groups) == 0 ? 1 : 0\n  direction         = "ingress"\n  ethertype         = "IPv4"\n  protocol          = "tcp"\n  port_range_min    = 9092\n  port_range_max    = 9093\n  remote_ip_prefix  = "121.37.117.211/32"\n  security_group_id = local.secgroup_id\n}\n\nresource "random_id" "new" {\n  byte_length = 4\n}\n\nresource "random_password" "password" {\n  length           = 12\n  upper            = true\n  lower            = true\n  numeric          = true\n  special          = true\n  min_special      = 1\n  override_special = "#%@"\n}\n\nresource "huaweicloud_kps_keypair" "keypair" {\n  name     = "keypair-kafka-${random_id.new.hex}"\n  key_file = "keypair-kafka-${random_id.new.hex}.pem"\n}\n\ndata "huaweicloud_images_image" "image" {\n  name                  = "Kafka-v3.3.2_Ubuntu-20.04"\n  most_recent           = true\n  enterprise_project_id = "0"\n}\n\nresource "huaweicloud_compute_instance" "zookeeper" {\n  availability_zone  = local.availability_zone\n  name               = "kafka-zookeeper-${random_id.new.hex}"\n  flavor_id          = var.flavor_id\n  security_group_ids = [ local.secgroup_id ]\n  image_id           = data.huaweicloud_images_image.image.id\n  key_pair           = huaweicloud_kps_keypair.keypair.name\n  network {\n    uuid = local.subnet_id\n  }\n  user_data = <<EOF\n    #!bin/bash\n    echo root:${local.admin_passwd} | sudo chpasswd\n    sudo systemctl start docker\n    sudo systemctl enable docker\n    sudo docker run -d --name zookeeper-server --privileged=true -p 2181:2181 -e ALLOW_ANONYMOUS_LOGIN=yes bitnami/zookeeper:3.8.1\n  EOF\n}\n\nresource "huaweicloud_compute_instance" "kafka-broker" {\n  count              = var.worker_nodes_count\n  availability_zone  = local.availability_zone\n  name               = "kafka-broker-${random_id.new.hex}-${count.index}"\n  flavor_id          = var.flavor_id\n  security_group_ids = [ local.secgroup_id ]\n  image_id           = data.huaweicloud_images_image.image.id\n  key_pair           = huaweicloud_kps_keypair.keypair.name\n  network {\n    uuid = local.subnet_id\n  }\n  user_data = <<EOF\n    #!bin/bash\n    echo root:${local.admin_passwd} | sudo chpasswd\n    sudo systemctl start docker\n    sudo systemctl enable docker\n    private_ip=$(ifconfig | grep -A1 "eth0" | grep \'inet\' | awk -F \' \' \' {print $2}\'|awk \' {print $1}\')\n    sudo docker run -d --name kafka-server --restart always -p 9092:9092 -p 9093:9093  -e KAFKA_BROKER_ID=${count.index}  -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://$private_ip:9092 -e KAFKA_LISTENERS=PLAINTEXT://0.0.0.0:9092 -e ALLOW_PLAINTEXT_LISTENER=yes -e KAFKA_CFG_ZOOKEEPER_CONNECT=${huaweicloud_compute_instance.zookeeper.access_ip_v4}:2181 bitnami/kafka:3.3.2\n  EOF\n  depends_on = [\n    huaweicloud_compute_instance.zookeeper\n  ]\n}\n\noutput "zookeeper_server" {\n  value = "${huaweicloud_compute_instance.zookeeper.access_ip_v4}:2181"\n}\n\noutput "admin_passwd" {\n  value = var.admin_passwd == "" ? nonsensitive(local.admin_passwd) : local.admin_passwd\n}\n',
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
                                'The admin password of all nodes in the Kafka cluster instance. If the value is empty, will create a random password.',
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
                                isDataLost: true,
                                isServiceInterrupted: true,
                            },
                        },
                        {
                            name: 'vpc_name',
                            kind: 'variable',
                            dataType: 'string',
                            example: 'kafka-vpc-default',
                            description:
                                'The vpc name of all nodes in the Kafka cluster instance. If the value is empty, will use the default value to find or create VPC.',
                            value: 'kafka-vpc-default',
                            mandatory: false,
                            valueSchema: null,
                            sensitiveScope: 'none',
                            autoFill: null,
                            modificationImpact: {
                                isDataLost: true,
                                isServiceInterrupted: true,
                            },
                        },
                        {
                            name: 'subnet_name',
                            kind: 'variable',
                            dataType: 'string',
                            example: 'kafka-subnet-default',
                            description:
                                'The sub network name of all nodes in the Kafka cluster instance. If the value is empty, will use the default value to find or create subnet.',
                            value: 'kafka-subnet-default',
                            mandatory: false,
                            valueSchema: null,
                            sensitiveScope: 'none',
                            autoFill: null,
                            modificationImpact: {
                                isDataLost: true,
                                isServiceInterrupted: true,
                            },
                        },
                        {
                            name: 'secgroup_name',
                            kind: 'variable',
                            dataType: 'string',
                            example: 'kafka-secgroup-default',
                            description:
                                'The security group name of all nodes in the Kafka cluster instance. If the value is empty, will use the default value to find or create security group.',
                            value: 'kafka-secgroup-default',
                            mandatory: false,
                            valueSchema: null,
                            sensitiveScope: 'none',
                            autoFill: null,
                            modificationImpact: {
                                isDataLost: true,
                                isServiceInterrupted: true,
                            },
                        },
                    ],
                    outputVariables: [
                        {
                            name: 'admin_passwd',
                            dataType: 'string',
                            description: 'The admin password of the service instance.',
                            sensitiveScope: 'always',
                        },
                        {
                            name: 'zookeeper_server',
                            dataType: 'string',
                            description: 'The server address of zookeeper.',
                            sensitiveScope: 'none',
                        },
                    ],
                    flavors: {
                        serviceFlavors: [
                            {
                                name: '1-zookeeper-with-3-worker-nodes-normal',
                                properties: {
                                    worker_nodes_count: '3',
                                    flavor_id: 's6.large.2',
                                },
                                priority: 1,
                                features: ['High Availability', 'Maximum performance'],
                                pricing: {
                                    fixedPrices: [
                                        {
                                            regionName: 'any',
                                            siteName: 'Chinese Mainland',
                                            price: {
                                                cost: 730,
                                                currency: 'CNY',
                                                period: 'monthly',
                                            },
                                        },
                                    ],
                                    resourceUsage: {
                                        resources: [
                                            {
                                                count: 4,
                                                deployResourceKind: 'vm',
                                                properties: {
                                                    cloud_service_type: 'hws.service.type.ec2',
                                                    resource_type: 'hws.resource.type.vm',
                                                    resource_spec: 's6.large.2.linux',
                                                },
                                            },
                                            {
                                                count: 4,
                                                deployResourceKind: 'volume',
                                                properties: {
                                                    cloud_service_type: 'hws.service.type.ebs',
                                                    resource_type: 'hws.resource.type.volume',
                                                    resource_spec: 'SSD',
                                                    resource_size: '40',
                                                    size_measure_id: '17',
                                                },
                                            },
                                        ],
                                        licensePrices: [
                                            {
                                                regionName: 'any',
                                                siteName: 'Chinese Mainland',
                                                price: {
                                                    cost: 1.9,
                                                    currency: 'CNY',
                                                    period: 'hourly',
                                                },
                                            },
                                        ],
                                        markUpPrices: [
                                            {
                                                regionName: 'any',
                                                siteName: 'Chinese Mainland',
                                                price: {
                                                    cost: 1.9,
                                                    currency: 'CNY',
                                                    period: 'hourly',
                                                },
                                            },
                                        ],
                                    },
                                    isPriceOnlyForManagementLayer: null,
                                },
                            },
                            {
                                name: '1-zookeeper-with-3-worker-nodes-performance',
                                properties: {
                                    worker_nodes_count: '3',
                                    flavor_id: 's6.large.4',
                                },
                                priority: 2,
                                features: ['High Availability', 'Maximum performance'],
                                pricing: {
                                    fixedPrices: [
                                        {
                                            regionName: 'any',
                                            siteName: 'Chinese Mainland',
                                            price: {
                                                cost: 980,
                                                currency: 'CNY',
                                                period: 'monthly',
                                            },
                                        },
                                    ],
                                    resourceUsage: {
                                        resources: [
                                            {
                                                count: 4,
                                                deployResourceKind: 'vm',
                                                properties: {
                                                    cloud_service_type: 'hws.service.type.ec2',
                                                    resource_type: 'hws.resource.type.vm',
                                                    resource_spec: 's6.large.4.linux',
                                                },
                                            },
                                            {
                                                count: 4,
                                                deployResourceKind: 'volume',
                                                properties: {
                                                    cloud_service_type: 'hws.service.type.ebs',
                                                    resource_type: 'hws.resource.type.volume',
                                                    resource_spec: 'SSD',
                                                    resource_size: '40',
                                                    size_measure_id: '17',
                                                },
                                            },
                                        ],
                                        licensePrices: [
                                            {
                                                regionName: 'any',
                                                siteName: 'Chinese Mainland',
                                                price: {
                                                    cost: 1.9,
                                                    currency: 'CNY',
                                                    period: 'hourly',
                                                },
                                            },
                                        ],
                                        markUpPrices: [
                                            {
                                                regionName: 'any',
                                                siteName: 'Chinese Mainland',
                                                price: {
                                                    cost: 1.9,
                                                    currency: 'CNY',
                                                    period: 'hourly',
                                                },
                                            },
                                        ],
                                    },
                                    isPriceOnlyForManagementLayer: null,
                                },
                            },
                        ],
                        modificationImpact: {
                            isDataLost: true,
                            isServiceInterrupted: true,
                        },
                        isDowngradeAllowed: true,
                        downgradeAllowed: true,
                    },
                    billing: {
                        billingModes: ['Fixed', 'Pay per Use'],
                        defaultBillingMode: null,
                    },
                    serviceHostingType: 'self',
                    createdTime: '2025-04-01 11:10:06 +08:00',
                    lastModifiedTime: '2025-04-01 11:10:06 +08:00',
                    serviceTemplateRegistrationState: 'in-review',
                    isReviewInProgress: true,
                    isAvailableInCatalog: false,
                    serviceProviderContactDetails: {
                        emails: ['test30@test.com', 'test31@test.com'],
                        phones: ['011-13422222222', '022-13344444444'],
                        chats: ['test1234', 'test1235'],
                        websites: ['https://hw.com', 'https://hwcloud.com'],
                    },
                    eula: null,
                    serviceConfigurationManage: {
                        type: 'ansible',
                        agentVersion: null,
                        configManageScripts: [
                            {
                                changeHandler: 'kafka-broker',
                                runOnlyOnce: false,
                                ansibleScriptConfig: {
                                    playbookName: 'middleware/ansible/kafka/kafka-container-manage.yml',
                                    virtualEnv: '',
                                    pythonVersion: '3.10',
                                    isPrepareAnsibleEnvironment: null,
                                    repoUrl: 'https://github.com/eclipse-xpanse/xpanse-samples',
                                    branch: 'main',
                                    requirementsFile: 'requirements.txt',
                                    galaxyFile: '',
                                    ansibleInventoryRequired: false,
                                },
                            },
                            {
                                changeHandler: 'zookeeper',
                                runOnlyOnce: true,
                                ansibleScriptConfig: {
                                    playbookName: 'middleware/ansible/kafka/kafka-container-manage.yml',
                                    virtualEnv: '',
                                    pythonVersion: '3.10',
                                    isPrepareAnsibleEnvironment: null,
                                    repoUrl: 'https://github.com/eclipse-xpanse/xpanse-samples',
                                    branch: 'main',
                                    requirementsFile: 'requirements.txt',
                                    galaxyFile: '',
                                    ansibleInventoryRequired: false,
                                },
                            },
                        ],
                        configurationParameters: [
                            {
                                name: 'kafka_cfg_message_max_bytes',
                                kind: 'variable',
                                dataType: 'number',
                                example: null,
                                description:
                                    'Parameters used to configure the Kafka server or client to set the maximum number of bytes for Kafka messages.',
                                value: null,
                                initialValue: 1048576,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                                isReadOnly: false,
                                managedBy: 'kafka-broker',
                            },
                            {
                                name: 'kafka_cfg_log_dirs',
                                kind: 'variable',
                                dataType: 'string',
                                example: null,
                                description: 'Parameters for the storage location of Kafka log data',
                                value: null,
                                initialValue: '/var/lib/kafka/logs',
                                valueSchema: null,
                                sensitiveScope: 'none',
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                                isReadOnly: false,
                                managedBy: 'kafka-broker',
                            },
                            {
                                name: 'kafka_cfg_num_io_threads',
                                kind: 'variable',
                                dataType: 'number',
                                example: null,
                                description:
                                    'Parameter used to set the number of I/O threads to handle kafka network requests',
                                value: null,
                                initialValue: 8,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                                isReadOnly: false,
                                managedBy: 'kafka-broker',
                            },
                            {
                                name: 'kafka_log_flush_interval_messages',
                                kind: 'variable',
                                dataType: 'number',
                                example: null,
                                description:
                                    "Kafka's log flush strategy, specifies the parameters that trigger a log flush operation after how many messages are written.",
                                value: null,
                                initialValue: 10000,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                                isReadOnly: false,
                                managedBy: 'kafka-broker',
                            },
                            {
                                name: 'kafka_offsets_topic_replication_factor',
                                kind: 'variable',
                                dataType: 'number',
                                example: null,
                                description:
                                    'Replication factor configuration parameters for the dedicated topic (offsets topic) used in the Kafka cluster to consume offset information for the consumer storage group',
                                value: null,
                                initialValue: 3,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                                isReadOnly: false,
                                managedBy: 'kafka-broker',
                            },
                            {
                                name: 'zookeeper_global_outstanding_limit',
                                kind: 'variable',
                                dataType: 'number',
                                example: null,
                                description:
                                    'Clients can submit requests faster than ZooKeeper can process them, especially if there are a lot of clients.',
                                value: null,
                                initialValue: 1000,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                                isReadOnly: false,
                                managedBy: 'zookeeper',
                            },
                            {
                                name: 'zookeeper_snap_count',
                                kind: 'variable',
                                dataType: 'number',
                                example: null,
                                description:
                                    'Limits the number of concurrent connections (at the socket level) that a single client, identified by IP address, may make to a single member of the ZooKeeper ensemble. This is used to prevent certain classes of DoS attacks, including file descriptor exhaustion. The default is 60. Setting this to 0 entirely removes the limit on concurrent connections.',
                                value: null,
                                initialValue: 1000,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                                isReadOnly: false,
                                managedBy: 'zookeeper',
                            },
                        ],
                    },
                    serviceActions: [
                        {
                            name: 'upgrade',
                            type: 'ansible',
                            actionManageScripts: [
                                {
                                    changeHandler: 'kafka-broker',
                                    runOnlyOnce: false,
                                    ansibleScriptConfig: {
                                        playbookName: 'middleware/ansible/kafka/kafka-container-manage.yml',
                                        virtualEnv: '',
                                        pythonVersion: '3.10',
                                        isPrepareAnsibleEnvironment: null,
                                        repoUrl: 'https://github.com/eclipse-xpanse/xpanse-samples',
                                        branch: 'main',
                                        requirementsFile: 'requirements.txt',
                                        galaxyFile: '',
                                        ansibleInventoryRequired: false,
                                    },
                                },
                            ],
                            actionParameters: [
                                {
                                    name: 'inter_broker_protocol_version',
                                    kind: 'variable',
                                    dataType: 'string',
                                    example: null,
                                    description:
                                        'controls the protocol version used for communication between Kafka Brokers to ensure that the old and new versions of Brokers can communicate normally during the rolling upgrade process.',
                                    value: null,
                                    initialValue: 3.2,
                                    valueSchema: null,
                                    sensitiveScope: 'none',
                                    modificationImpact: {
                                        isDataLost: true,
                                        isServiceInterrupted: true,
                                    },
                                    isReadOnly: false,
                                    managedBy: 'kafka-broker',
                                },
                            ],
                        },
                        {
                            name: 'backup',
                            type: 'ansible',
                            actionManageScripts: [
                                {
                                    changeHandler: 'zookeeper',
                                    runOnlyOnce: true,
                                    ansibleScriptConfig: {
                                        playbookName: 'middleware/ansible/kafka/kafka-container-manage.yml',
                                        virtualEnv: '',
                                        pythonVersion: '3.10',
                                        isPrepareAnsibleEnvironment: null,
                                        repoUrl: 'https://github.com/eclipse-xpanse/xpanse-samples',
                                        branch: 'main',
                                        requirementsFile: 'requirements.txt',
                                        galaxyFile: '',
                                        ansibleInventoryRequired: false,
                                    },
                                },
                            ],
                            actionParameters: [
                                {
                                    name: 'kafka_cfg_message_max_bytes',
                                    kind: 'variable',
                                    dataType: 'number',
                                    example: null,
                                    description:
                                        'Parameters used to configure the Kafka server or client to set the maximum number of bytes for Kafka messages.',
                                    value: null,
                                    initialValue: 1048576,
                                    valueSchema: null,
                                    sensitiveScope: 'none',
                                    modificationImpact: {
                                        isDataLost: true,
                                        isServiceInterrupted: true,
                                    },
                                    isReadOnly: false,
                                    managedBy: 'kafka-broker',
                                },
                            ],
                        },
                    ],
                    links: [
                        {
                            rel: 'openApi',
                            href: 'http://localhost:8080/xpanse/catalog/services/21597cd5-748e-4f0e-9768-baaa5275b2bd/openapi',
                        },
                    ],
                },
            ]),
        });
    });
};

export const mockMiddlewareServiceRequestsSuccessResponse = async (page: Page, timeToWaitForResponse: number) => {
    await page.route(middlewareRequestsUrl, async (route) => {
        await new Promise((resolve) => {
            setTimeout(resolve, timeToWaitForResponse);
        });
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([
                {
                    serviceTemplateId: '21597cd5-748e-4f0e-9768-baaa5275b2bd',
                    requestId: '529f885d-448b-40f7-8d36-b65234deb4e2',
                    requestType: 'register',
                    requestStatus: 'in-review',
                    reviewComment: null,
                    blockTemplateUntilReviewed: false,
                    createdTime: '2025-04-01 11:10:06 +08:00',
                    lastModifiedTime: '2025-04-01 11:10:06 +08:00',
                    requestSubmittedForReview: true,
                },
            ]),
        });
    });
};

export const mockMiddlewareServiceReviewSuccessResponse = async (page: Page, timeToWaitForResponse: number) => {
    await page.route(middlewareRequestsReviewUrl, async (route) => {
        await new Promise((resolve) => {
            setTimeout(resolve, timeToWaitForResponse);
        });
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([
                {
                    serviceTemplateId: '21597cd5-748e-4f0e-9768-baaa5275b2bd',
                    requestId: '529f885d-448b-40f7-8d36-b65234deb4e2',
                    requestType: 'register',
                    requestStatus: 'in-review',
                    reviewComment: null,
                    blockTemplateUntilReviewed: false,
                    createdTime: '2025-04-01 11:10:06 +08:00',
                    lastModifiedTime: '2025-04-01 11:10:06 +08:00',
                    requestSubmittedForReview: true,
                },
            ]),
        });
    });
};

export const mockMiddlewareServiceDetailSuccessResponse = async (page: Page, timeToWaitForResponse: number) => {
    await page.route(middlewareServiceDetailUrl, async (route) => {
        await new Promise((resolve) => {
            setTimeout(resolve, timeToWaitForResponse);
        });
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([]),
        });
    });
};

export const mockMiddlewareServicePoliciesSuccessResponse = async (page: Page, timeToWaitForResponse: number) => {
    await page.route(middlewareServicePoliciesUrl, async (route) => {
        await new Promise((resolve) => {
            setTimeout(resolve, timeToWaitForResponse);
        });
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([]),
        });
    });
};

export const mockServiceTemplateSuccessResponse = async (page: Page, timeToWaitForResponse: number) => {
    await page.route(serviceTemplateUrl, async (route) => {
        await new Promise((resolve) => {
            setTimeout(resolve, timeToWaitForResponse);
        });
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([
                {
                    serviceTemplateId: '21597cd5-748e-4f0e-9768-baaa5275b2bd',
                    name: 'kafka-cluster',
                    version: '1.0.0',
                    csp: 'HuaweiCloud',
                    category: 'middleware',
                    serviceVendor: 'ISV-A',
                    regions: [
                        {
                            name: 'cn-southwest-2',
                            site: 'Chinese Mainland',
                            area: 'Asia China',
                        },
                        {
                            name: 'cn-north-4',
                            site: 'Chinese Mainland',
                            area: 'Asia China',
                        },
                    ],
                    description: 'This is an enhanced Kafka cluster services by ISV-A.',
                    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAACRAQMAAAAPc4+9AAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAZQTFRF+/v7Hh8gVD0A0wAAAcVJREFUeJzNlc1twzAMhSX44KNH0CgaTd6gK3kUd4McDVTwq/hjiUyaIkV7qNA2/QCFIh+ppxB+svLNEqqBGTC0ANugBOwmCGDCFOAwIWGDOoqoODtN2BdL6wxD9NMTO9tXPa1PqL5M30W5p8lm5vNcF0t7ahSrVguqNqmMokRW4YQucVjBCBWH1Z2g3WDlW2skoYU+2x8JOtGedBF3k2iXMO0j16iUiI6gxzPdQhnU/s2G9pCO57QY2r6hvjPbKJHq7DRTRXT60avtuTRdbrFJI3mSZhNOqYjVbd99YyK1QKWzEqSWrE0k07U60uPaelflMzaaeu1KBuurHSsn572I1KWy2joX5ZBfWbS/VEt50H5P6aL4JxTuyJ/+QCNPX4PWF3Q8Xe1eF9FsLdD2VaOnaP2hWvs+zI58/7i3vH3nRFtDZpyTUNaZkON5XnBNsp8lrmDMrpvBr+b6pUl+4XbkQdndqnzYGzfuJm1JmIWimIbe6dndd/bk7gVce/cJdo3uIeLJl7+I2xTnPek67mjtDeppE7b03Ov+kSfDe3JweW53njxeGfXkaz28VeYd86+af/H8a7hgJKaebILaFzakLfxyfQLTxVB6K1K9KQAAAABJRU5ErkJggg==',
                    deployment: {
                        deployerTool: {
                            kind: 'terraform',
                            version: '=1.6.0',
                        },
                        inputVariables: [
                            {
                                name: 'admin_passwd',
                                kind: 'variable',
                                dataType: 'string',
                                example: null,
                                description:
                                    'The admin password of all nodes in the Kafka cluster instance. If the value is empty, will create a random password.',
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
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                            },
                            {
                                name: 'vpc_name',
                                kind: 'variable',
                                dataType: 'string',
                                example: 'kafka-vpc-default',
                                description:
                                    'The vpc name of all nodes in the Kafka cluster instance. If the value is empty, will use the default value to find or create VPC.',
                                value: 'kafka-vpc-default',
                                mandatory: false,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                autoFill: null,
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                            },
                            {
                                name: 'subnet_name',
                                kind: 'variable',
                                dataType: 'string',
                                example: 'kafka-subnet-default',
                                description:
                                    'The sub network name of all nodes in the Kafka cluster instance. If the value is empty, will use the default value to find or create subnet.',
                                value: 'kafka-subnet-default',
                                mandatory: false,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                autoFill: null,
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                            },
                            {
                                name: 'secgroup_name',
                                kind: 'variable',
                                dataType: 'string',
                                example: 'kafka-secgroup-default',
                                description:
                                    'The security group name of all nodes in the Kafka cluster instance. If the value is empty, will use the default value to find or create security group.',
                                value: 'kafka-secgroup-default',
                                mandatory: false,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                autoFill: null,
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                            },
                        ],
                        outputVariables: [
                            {
                                name: 'admin_passwd',
                                dataType: 'string',
                                description: 'The admin password of the service instance.',
                                sensitiveScope: 'always',
                            },
                            {
                                name: 'zookeeper_server',
                                dataType: 'string',
                                description: 'The server address of zookeeper.',
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
                                'variable "region" {\n  type        = string\n  description = "The region to deploy the Kafka cluster instance."\n}\n\nvariable "availability_zone" {\n  type        = string\n  default     = ""\n  description = "The availability zone to deploy the Kafka cluster instance."\n}\n\nvariable "flavor_id" {\n  type        = string\n  default     = "s6.large.2"\n  description = "The flavor_id of all nodes in the Kafka cluster instance."\n}\n\nvariable "worker_nodes_count" {\n  type        = string\n  default     = 3\n  description = "The worker nodes count in the Kafka cluster instance."\n}\n\nvariable "admin_passwd" {\n  type        = string\n  default     = ""\n  description = "The root password of all nodes in the Kafka cluster instance."\n}\n\nvariable "vpc_name" {\n  type        = string\n  default     = "kafka-vpc-default"\n  description = "The vpc name of all nodes in the Kafka cluster instance."\n}\n\nvariable "subnet_name" {\n  type        = string\n  default     = "kafka-subnet-default"\n  description = "The subnet name of all nodes in the Kafka cluster instance."\n}\n\nvariable "secgroup_name" {\n  type        = string\n  default     = "kafka-secgroup-default"\n  description = "The security group name of all nodes in the Kafka cluster instance."\n}\n',
                            'provider.tf':
                                'terraform {\n  required_providers {\n    huaweicloud = {\n      source  = "huaweicloud/huaweicloud"\n      version = "~> 1.61.0"\n    }\n  }\n}\n\nprovider "huaweicloud" {\n  region = var.region\n}\n',
                            'main.tf':
                                'data "huaweicloud_availability_zones" "osc-az" {}\n\ndata "huaweicloud_vpcs" "existing" {\n  name = var.vpc_name\n}\n\ndata "huaweicloud_vpc_subnets" "existing" {\n  name = var.subnet_name\n}\n\ndata "huaweicloud_networking_secgroups" "existing" {\n  name = var.secgroup_name\n}\n\nlocals {\n  availability_zone = var.availability_zone == "" ? data.huaweicloud_availability_zones.osc-az.names[0] : var.availability_zone\n  admin_passwd      = var.admin_passwd == "" ? random_password.password.result : var.admin_passwd\n  vpc_id            = length(data.huaweicloud_vpcs.existing.vpcs) > 0 ? data.huaweicloud_vpcs.existing.vpcs[0].id : huaweicloud_vpc.new[0].id\n  subnet_id         = length(data.huaweicloud_vpc_subnets.existing.subnets)> 0 ? data.huaweicloud_vpc_subnets.existing.subnets[0].id : huaweicloud_vpc_subnet.new[0].id\n  secgroup_id       = length(data.huaweicloud_networking_secgroups.existing.security_groups) > 0 ? data.huaweicloud_networking_secgroups.existing.security_groups[0].id : huaweicloud_networking_secgroup.new[0].id\n}\n\nresource "huaweicloud_vpc" "new" {\n  count = length(data.huaweicloud_vpcs.existing.vpcs) == 0 ? 1 : 0\n  name  = var.vpc_name\n  cidr  = "192.168.0.0/16"\n}\n\nresource "huaweicloud_vpc_subnet" "new" {\n  count      = length(data.huaweicloud_vpcs.existing.vpcs) == 0 ? 1 : 0\n  vpc_id     = local.vpc_id\n  name       = var.subnet_name\n  cidr       = "192.168.10.0/24"\n  gateway_ip = "192.168.10.1"\n}\n\nresource "huaweicloud_networking_secgroup" "new" {\n  count       = length(data.huaweicloud_networking_secgroups.existing.security_groups) == 0 ? 1 : 0\n  name        = var.secgroup_name\n  description = "Kafka cluster security group"\n}\n\nresource "huaweicloud_networking_secgroup_rule" "secgroup_rule_0" {\n  count             = length(data.huaweicloud_networking_secgroups.existing.security_groups) == 0 ? 1 : 0\n  direction         = "ingress"\n  ethertype         = "IPv4"\n  protocol          = "tcp"\n  port_range_min    = 22\n  port_range_max    = 22\n  remote_ip_prefix  = "121.37.117.211/32"\n  security_group_id = local.secgroup_id\n}\n\nresource "huaweicloud_networking_secgroup_rule" "secgroup_rule_1" {\n  count             = length(data.huaweicloud_networking_secgroups.existing.security_groups) == 0 ? 1 : 0\n  direction         = "ingress"\n  ethertype         = "IPv4"\n  protocol          = "tcp"\n  port_range_min    = 2181\n  port_range_max    = 2181\n  remote_ip_prefix  = "121.37.117.211/32"\n  security_group_id = local.secgroup_id\n}\n\nresource "huaweicloud_networking_secgroup_rule" "secgroup_rule_2" {\n  count             = length(data.huaweicloud_networking_secgroups.existing.security_groups) == 0 ? 1 : 0\n  direction         = "ingress"\n  ethertype         = "IPv4"\n  protocol          = "tcp"\n  port_range_min    = 9092\n  port_range_max    = 9093\n  remote_ip_prefix  = "121.37.117.211/32"\n  security_group_id = local.secgroup_id\n}\n\nresource "random_id" "new" {\n  byte_length = 4\n}\n\nresource "random_password" "password" {\n  length           = 12\n  upper            = true\n  lower            = true\n  numeric          = true\n  special          = true\n  min_special      = 1\n  override_special = "#%@"\n}\n\nresource "huaweicloud_kps_keypair" "keypair" {\n  name     = "keypair-kafka-${random_id.new.hex}"\n  key_file = "keypair-kafka-${random_id.new.hex}.pem"\n}\n\ndata "huaweicloud_images_image" "image" {\n  name                  = "Kafka-v3.3.2_Ubuntu-20.04"\n  most_recent           = true\n  enterprise_project_id = "0"\n}\n\nresource "huaweicloud_compute_instance" "zookeeper" {\n  availability_zone  = local.availability_zone\n  name               = "kafka-zookeeper-${random_id.new.hex}"\n  flavor_id          = var.flavor_id\n  security_group_ids = [ local.secgroup_id ]\n  image_id           = data.huaweicloud_images_image.image.id\n  key_pair           = huaweicloud_kps_keypair.keypair.name\n  network {\n    uuid = local.subnet_id\n  }\n  user_data = <<EOF\n    #!bin/bash\n    echo root:${local.admin_passwd} | sudo chpasswd\n    sudo systemctl start docker\n    sudo systemctl enable docker\n    sudo docker run -d --name zookeeper-server --privileged=true -p 2181:2181 -e ALLOW_ANONYMOUS_LOGIN=yes bitnami/zookeeper:3.8.1\n  EOF\n}\n\nresource "huaweicloud_compute_instance" "kafka-broker" {\n  count              = var.worker_nodes_count\n  availability_zone  = local.availability_zone\n  name               = "kafka-broker-${random_id.new.hex}-${count.index}"\n  flavor_id          = var.flavor_id\n  security_group_ids = [ local.secgroup_id ]\n  image_id           = data.huaweicloud_images_image.image.id\n  key_pair           = huaweicloud_kps_keypair.keypair.name\n  network {\n    uuid = local.subnet_id\n  }\n  user_data = <<EOF\n    #!bin/bash\n    echo root:${local.admin_passwd} | sudo chpasswd\n    sudo systemctl start docker\n    sudo systemctl enable docker\n    private_ip=$(ifconfig | grep -A1 "eth0" | grep \'inet\' | awk -F \' \' \' {print $2}\'|awk \' {print $1}\')\n    sudo docker run -d --name kafka-server --restart always -p 9092:9092 -p 9093:9093  -e KAFKA_BROKER_ID=${count.index}  -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://$private_ip:9092 -e KAFKA_LISTENERS=PLAINTEXT://0.0.0.0:9092 -e ALLOW_PLAINTEXT_LISTENER=yes -e KAFKA_CFG_ZOOKEEPER_CONNECT=${huaweicloud_compute_instance.zookeeper.access_ip_v4}:2181 bitnami/kafka:3.3.2\n  EOF\n  depends_on = [\n    huaweicloud_compute_instance.zookeeper\n  ]\n}\n\noutput "zookeeper_server" {\n  value = "${huaweicloud_compute_instance.zookeeper.access_ip_v4}:2181"\n}\n\noutput "admin_passwd" {\n  value = var.admin_passwd == "" ? nonsensitive(local.admin_passwd) : local.admin_passwd\n}\n',
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
                                'The admin password of all nodes in the Kafka cluster instance. If the value is empty, will create a random password.',
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
                                isDataLost: true,
                                isServiceInterrupted: true,
                            },
                        },
                        {
                            name: 'vpc_name',
                            kind: 'variable',
                            dataType: 'string',
                            example: 'kafka-vpc-default',
                            description:
                                'The vpc name of all nodes in the Kafka cluster instance. If the value is empty, will use the default value to find or create VPC.',
                            value: 'kafka-vpc-default',
                            mandatory: false,
                            valueSchema: null,
                            sensitiveScope: 'none',
                            autoFill: null,
                            modificationImpact: {
                                isDataLost: true,
                                isServiceInterrupted: true,
                            },
                        },
                        {
                            name: 'subnet_name',
                            kind: 'variable',
                            dataType: 'string',
                            example: 'kafka-subnet-default',
                            description:
                                'The sub network name of all nodes in the Kafka cluster instance. If the value is empty, will use the default value to find or create subnet.',
                            value: 'kafka-subnet-default',
                            mandatory: false,
                            valueSchema: null,
                            sensitiveScope: 'none',
                            autoFill: null,
                            modificationImpact: {
                                isDataLost: true,
                                isServiceInterrupted: true,
                            },
                        },
                        {
                            name: 'secgroup_name',
                            kind: 'variable',
                            dataType: 'string',
                            example: 'kafka-secgroup-default',
                            description:
                                'The security group name of all nodes in the Kafka cluster instance. If the value is empty, will use the default value to find or create security group.',
                            value: 'kafka-secgroup-default',
                            mandatory: false,
                            valueSchema: null,
                            sensitiveScope: 'none',
                            autoFill: null,
                            modificationImpact: {
                                isDataLost: true,
                                isServiceInterrupted: true,
                            },
                        },
                    ],
                    outputVariables: [
                        {
                            name: 'admin_passwd',
                            dataType: 'string',
                            description: 'The admin password of the service instance.',
                            sensitiveScope: 'always',
                        },
                        {
                            name: 'zookeeper_server',
                            dataType: 'string',
                            description: 'The server address of zookeeper.',
                            sensitiveScope: 'none',
                        },
                    ],
                    flavors: {
                        serviceFlavors: [
                            {
                                name: '1-zookeeper-with-3-worker-nodes-normal',
                                properties: {
                                    worker_nodes_count: '3',
                                    flavor_id: 's6.large.2',
                                },
                                priority: 1,
                                features: ['High Availability', 'Maximum performance'],
                                pricing: {
                                    fixedPrices: [
                                        {
                                            regionName: 'any',
                                            siteName: 'Chinese Mainland',
                                            price: {
                                                cost: 730,
                                                currency: 'CNY',
                                                period: 'monthly',
                                            },
                                        },
                                    ],
                                    resourceUsage: {
                                        resources: [
                                            {
                                                count: 4,
                                                deployResourceKind: 'vm',
                                                properties: {
                                                    cloud_service_type: 'hws.service.type.ec2',
                                                    resource_type: 'hws.resource.type.vm',
                                                    resource_spec: 's6.large.2.linux',
                                                },
                                            },
                                            {
                                                count: 4,
                                                deployResourceKind: 'volume',
                                                properties: {
                                                    cloud_service_type: 'hws.service.type.ebs',
                                                    resource_type: 'hws.resource.type.volume',
                                                    resource_spec: 'SSD',
                                                    resource_size: '40',
                                                    size_measure_id: '17',
                                                },
                                            },
                                        ],
                                        licensePrices: [
                                            {
                                                regionName: 'any',
                                                siteName: 'Chinese Mainland',
                                                price: {
                                                    cost: 1.9,
                                                    currency: 'CNY',
                                                    period: 'hourly',
                                                },
                                            },
                                        ],
                                        markUpPrices: [
                                            {
                                                regionName: 'any',
                                                siteName: 'Chinese Mainland',
                                                price: {
                                                    cost: 1.9,
                                                    currency: 'CNY',
                                                    period: 'hourly',
                                                },
                                            },
                                        ],
                                    },
                                    isPriceOnlyForManagementLayer: null,
                                },
                            },
                            {
                                name: '1-zookeeper-with-3-worker-nodes-performance',
                                properties: {
                                    worker_nodes_count: '3',
                                    flavor_id: 's6.large.4',
                                },
                                priority: 2,
                                features: ['High Availability', 'Maximum performance'],
                                pricing: {
                                    fixedPrices: [
                                        {
                                            regionName: 'any',
                                            siteName: 'Chinese Mainland',
                                            price: {
                                                cost: 980,
                                                currency: 'CNY',
                                                period: 'monthly',
                                            },
                                        },
                                    ],
                                    resourceUsage: {
                                        resources: [
                                            {
                                                count: 4,
                                                deployResourceKind: 'vm',
                                                properties: {
                                                    cloud_service_type: 'hws.service.type.ec2',
                                                    resource_type: 'hws.resource.type.vm',
                                                    resource_spec: 's6.large.4.linux',
                                                },
                                            },
                                            {
                                                count: 4,
                                                deployResourceKind: 'volume',
                                                properties: {
                                                    cloud_service_type: 'hws.service.type.ebs',
                                                    resource_type: 'hws.resource.type.volume',
                                                    resource_spec: 'SSD',
                                                    resource_size: '40',
                                                    size_measure_id: '17',
                                                },
                                            },
                                        ],
                                        licensePrices: [
                                            {
                                                regionName: 'any',
                                                siteName: 'Chinese Mainland',
                                                price: {
                                                    cost: 1.9,
                                                    currency: 'CNY',
                                                    period: 'hourly',
                                                },
                                            },
                                        ],
                                        markUpPrices: [
                                            {
                                                regionName: 'any',
                                                siteName: 'Chinese Mainland',
                                                price: {
                                                    cost: 1.9,
                                                    currency: 'CNY',
                                                    period: 'hourly',
                                                },
                                            },
                                        ],
                                    },
                                    isPriceOnlyForManagementLayer: null,
                                },
                            },
                        ],
                        modificationImpact: {
                            isDataLost: true,
                            isServiceInterrupted: true,
                        },
                        isDowngradeAllowed: true,
                        downgradeAllowed: true,
                    },
                    billing: {
                        billingModes: ['Fixed', 'Pay per Use'],
                        defaultBillingMode: null,
                    },
                    serviceHostingType: 'self',
                    createdTime: '2025-04-01 11:10:06 +08:00',
                    lastModifiedTime: '2025-04-01 11:10:06 +08:00',
                    serviceTemplateRegistrationState: 'in-review',
                    isReviewInProgress: true,
                    isAvailableInCatalog: false,
                    serviceProviderContactDetails: {
                        emails: ['test30@test.com', 'test31@test.com'],
                        phones: ['011-13422222222', '022-13344444444'],
                        chats: ['test1234', 'test1235'],
                        websites: ['https://hw.com', 'https://hwcloud.com'],
                    },
                    eula: null,
                    serviceConfigurationManage: {
                        type: 'ansible',
                        agentVersion: null,
                        configManageScripts: [
                            {
                                changeHandler: 'kafka-broker',
                                runOnlyOnce: false,
                                ansibleScriptConfig: {
                                    playbookName: 'middleware/ansible/kafka/kafka-container-manage.yml',
                                    virtualEnv: '',
                                    pythonVersion: '3.10',
                                    isPrepareAnsibleEnvironment: null,
                                    repoUrl: 'https://github.com/eclipse-xpanse/xpanse-samples',
                                    branch: 'main',
                                    requirementsFile: 'requirements.txt',
                                    galaxyFile: '',
                                    ansibleInventoryRequired: false,
                                },
                            },
                            {
                                changeHandler: 'zookeeper',
                                runOnlyOnce: true,
                                ansibleScriptConfig: {
                                    playbookName: 'middleware/ansible/kafka/kafka-container-manage.yml',
                                    virtualEnv: '',
                                    pythonVersion: '3.10',
                                    isPrepareAnsibleEnvironment: null,
                                    repoUrl: 'https://github.com/eclipse-xpanse/xpanse-samples',
                                    branch: 'main',
                                    requirementsFile: 'requirements.txt',
                                    galaxyFile: '',
                                    ansibleInventoryRequired: false,
                                },
                            },
                        ],
                        configurationParameters: [
                            {
                                name: 'kafka_cfg_message_max_bytes',
                                kind: 'variable',
                                dataType: 'number',
                                example: null,
                                description:
                                    'Parameters used to configure the Kafka server or client to set the maximum number of bytes for Kafka messages.',
                                value: null,
                                initialValue: 1048576,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                                isReadOnly: false,
                                managedBy: 'kafka-broker',
                            },
                            {
                                name: 'kafka_cfg_log_dirs',
                                kind: 'variable',
                                dataType: 'string',
                                example: null,
                                description: 'Parameters for the storage location of Kafka log data',
                                value: null,
                                initialValue: '/var/lib/kafka/logs',
                                valueSchema: null,
                                sensitiveScope: 'none',
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                                isReadOnly: false,
                                managedBy: 'kafka-broker',
                            },
                            {
                                name: 'kafka_cfg_num_io_threads',
                                kind: 'variable',
                                dataType: 'number',
                                example: null,
                                description:
                                    'Parameter used to set the number of I/O threads to handle kafka network requests',
                                value: null,
                                initialValue: 8,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                                isReadOnly: false,
                                managedBy: 'kafka-broker',
                            },
                            {
                                name: 'kafka_log_flush_interval_messages',
                                kind: 'variable',
                                dataType: 'number',
                                example: null,
                                description:
                                    "Kafka's log flush strategy, specifies the parameters that trigger a log flush operation after how many messages are written.",
                                value: null,
                                initialValue: 10000,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                                isReadOnly: false,
                                managedBy: 'kafka-broker',
                            },
                            {
                                name: 'kafka_offsets_topic_replication_factor',
                                kind: 'variable',
                                dataType: 'number',
                                example: null,
                                description:
                                    'Replication factor configuration parameters for the dedicated topic (offsets topic) used in the Kafka cluster to consume offset information for the consumer storage group',
                                value: null,
                                initialValue: 3,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                                isReadOnly: false,
                                managedBy: 'kafka-broker',
                            },
                            {
                                name: 'zookeeper_global_outstanding_limit',
                                kind: 'variable',
                                dataType: 'number',
                                example: null,
                                description:
                                    'Clients can submit requests faster than ZooKeeper can process them, especially if there are a lot of clients.',
                                value: null,
                                initialValue: 1000,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                                isReadOnly: false,
                                managedBy: 'zookeeper',
                            },
                            {
                                name: 'zookeeper_snap_count',
                                kind: 'variable',
                                dataType: 'number',
                                example: null,
                                description:
                                    'Limits the number of concurrent connections (at the socket level) that a single client, identified by IP address, may make to a single member of the ZooKeeper ensemble. This is used to prevent certain classes of DoS attacks, including file descriptor exhaustion. The default is 60. Setting this to 0 entirely removes the limit on concurrent connections.',
                                value: null,
                                initialValue: 1000,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                                isReadOnly: false,
                                managedBy: 'zookeeper',
                            },
                        ],
                    },
                    serviceActions: [
                        {
                            name: 'upgrade',
                            type: 'ansible',
                            actionManageScripts: [
                                {
                                    changeHandler: 'kafka-broker',
                                    runOnlyOnce: false,
                                    ansibleScriptConfig: {
                                        playbookName: 'middleware/ansible/kafka/kafka-container-manage.yml',
                                        virtualEnv: '',
                                        pythonVersion: '3.10',
                                        isPrepareAnsibleEnvironment: null,
                                        repoUrl: 'https://github.com/eclipse-xpanse/xpanse-samples',
                                        branch: 'main',
                                        requirementsFile: 'requirements.txt',
                                        galaxyFile: '',
                                        ansibleInventoryRequired: false,
                                    },
                                },
                            ],
                            actionParameters: [
                                {
                                    name: 'inter_broker_protocol_version',
                                    kind: 'variable',
                                    dataType: 'string',
                                    example: null,
                                    description:
                                        'controls the protocol version used for communication between Kafka Brokers to ensure that the old and new versions of Brokers can communicate normally during the rolling upgrade process.',
                                    value: null,
                                    initialValue: 3.2,
                                    valueSchema: null,
                                    sensitiveScope: 'none',
                                    modificationImpact: {
                                        isDataLost: true,
                                        isServiceInterrupted: true,
                                    },
                                    isReadOnly: false,
                                    managedBy: 'kafka-broker',
                                },
                            ],
                        },
                        {
                            name: 'backup',
                            type: 'ansible',
                            actionManageScripts: [
                                {
                                    changeHandler: 'zookeeper',
                                    runOnlyOnce: true,
                                    ansibleScriptConfig: {
                                        playbookName: 'middleware/ansible/kafka/kafka-container-manage.yml',
                                        virtualEnv: '',
                                        pythonVersion: '3.10',
                                        isPrepareAnsibleEnvironment: null,
                                        repoUrl: 'https://github.com/eclipse-xpanse/xpanse-samples',
                                        branch: 'main',
                                        requirementsFile: 'requirements.txt',
                                        galaxyFile: '',
                                        ansibleInventoryRequired: false,
                                    },
                                },
                            ],
                            actionParameters: [
                                {
                                    name: 'kafka_cfg_message_max_bytes',
                                    kind: 'variable',
                                    dataType: 'number',
                                    example: null,
                                    description:
                                        'Parameters used to configure the Kafka server or client to set the maximum number of bytes for Kafka messages.',
                                    value: null,
                                    initialValue: 1048576,
                                    valueSchema: null,
                                    sensitiveScope: 'none',
                                    modificationImpact: {
                                        isDataLost: true,
                                        isServiceInterrupted: true,
                                    },
                                    isReadOnly: false,
                                    managedBy: 'kafka-broker',
                                },
                            ],
                        },
                    ],
                    links: [
                        {
                            rel: 'openApi',
                            href: 'http://localhost:8080/xpanse/catalog/services/21597cd5-748e-4f0e-9768-baaa5275b2bd/openapi',
                        },
                    ],
                },
            ]),
        });
    });
};

export const mockIsvServicesResponse = async (page: Page, timeToWaitForResponse: number) => {
    await page.route(isvServicesUrl, async (route) => {
        await new Promise((resolve) => {
            setTimeout(resolve, timeToWaitForResponse);
        });
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([]),
        });
    });
};

export const mockUpdateServiceTemplateSuccessResponse = async (page: Page, timeToWaitForResponse: number) => {
    await page.route(updateServiceTemplateUrl, async (route) => {
        await new Promise((resolve) => {
            setTimeout(resolve, timeToWaitForResponse);
        });
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                serviceTemplateId: '21597cd5-748e-4f0e-9768-baaa5275b2bd',
                requestId: '9e8ec9e0-e3d0-4173-89e8-57c7f6ad1ad5',
                requestSubmittedForReview: true,
            }),
        });
    });
};

export const mockUpdateServiceTemplateFailedResponse = async (page: Page, timeToWaitForResponse: number) => {
    await page.route(updateServiceTemplateUrl, async (route) => {
        await new Promise((resolve) => {
            setTimeout(resolve, timeToWaitForResponse);
        });
        await route.fulfill({
            status: 400,
            contentType: 'application/json',
            body: JSON.stringify({
                errorType: 'Service Update Failed',
                details: ['Failed to fetch'],
            }),
        });
    });
};

export const mockUnpublishServiceSuccessResponse = async (page: Page, timeToWaitForResponse: number) => {
    await page.route(unpublishServiceUrl, async (route) => {
        await new Promise((resolve) => {
            setTimeout(resolve, timeToWaitForResponse);
        });
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({}),
        });
    });
};

export const mockUnpublishServiceFailedResponse = async (page: Page, timeToWaitForResponse: number) => {
    await page.route(unpublishServiceUrl, async (route) => {
        await new Promise((resolve) => {
            setTimeout(resolve, timeToWaitForResponse);
        });
        await route.fulfill({
            status: 400,
            contentType: 'application/json',
            body: JSON.stringify({
                errorType: 'Unpublish Request Failed',
                details: ['Service unpublish failed'],
            }),
        });
    });
};

export const mockMiddlewareServiceReviewedSuccessResponse = async (page: Page, timeToWaitForResponse: number) => {
    await page.route(middlewareRequestsReviewUrl, async (route) => {
        await new Promise((resolve) => {
            setTimeout(resolve, timeToWaitForResponse);
        });
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([]),
        });
    });
};

export const mockMiddlewareServiceRequestsReviewedSuccessResponse = async (
    page: Page,
    timeToWaitForResponse: number
) => {
    await page.route(middlewareRequestsUrl, async (route) => {
        await new Promise((resolve) => {
            setTimeout(resolve, timeToWaitForResponse);
        });
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([
                {
                    serviceTemplateId: '21597cd5-748e-4f0e-9768-baaa5275b2bd',
                    requestId: '529f885d-448b-40f7-8d36-b65234deb4e2',
                    requestType: 'register',
                    requestStatus: 'accepted',
                    reviewComment: '11121111',
                    blockTemplateUntilReviewed: false,
                    createdTime: '2025-04-01 11:10:06 +08:00',
                    lastModifiedTime: '2025-04-01 11:22:22 +08:00',
                    requestSubmittedForReview: false,
                },
            ]),
        });
    });
};

export const mockMiddlewareServiceTemplatesReviewedSuccessResponse = async (
    page: Page,
    timeToWaitForResponse: number
) => {
    await page.route(middlewareServiceTemplatesUrl, async (route) => {
        await new Promise((resolve) => {
            setTimeout(resolve, timeToWaitForResponse);
        });
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([
                {
                    serviceTemplateId: '21597cd5-748e-4f0e-9768-baaa5275b2bd',
                    name: 'kafka-cluster',
                    version: '1.0.0',
                    csp: 'HuaweiCloud',
                    category: 'middleware',
                    serviceVendor: 'ISV-A',
                    regions: [
                        {
                            name: 'cn-southwest-2',
                            site: 'Chinese Mainland',
                            area: 'Asia China',
                        },
                        {
                            name: 'cn-north-4',
                            site: 'Chinese Mainland',
                            area: 'Asia China',
                        },
                    ],
                    description: 'This is an enhanced Kafka cluster services by ISV-A.',
                    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAACRAQMAAAAPc4+9AAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAZQTFRF+/v7Hh8gVD0A0wAAAcVJREFUeJzNlc1twzAMhSX44KNH0CgaTd6gK3kUd4McDVTwq/hjiUyaIkV7qNA2/QCFIh+ppxB+svLNEqqBGTC0ANugBOwmCGDCFOAwIWGDOoqoODtN2BdL6wxD9NMTO9tXPa1PqL5M30W5p8lm5vNcF0t7ahSrVguqNqmMokRW4YQucVjBCBWH1Z2g3WDlW2skoYU+2x8JOtGedBF3k2iXMO0j16iUiI6gxzPdQhnU/s2G9pCO57QY2r6hvjPbKJHq7DRTRXT60avtuTRdbrFJI3mSZhNOqYjVbd99YyK1QKWzEqSWrE0k07U60uPaelflMzaaeu1KBuurHSsn572I1KWy2joX5ZBfWbS/VEt50H5P6aL4JxTuyJ/+QCNPX4PWF3Q8Xe1eF9FsLdD2VaOnaP2hWvs+zI58/7i3vH3nRFtDZpyTUNaZkON5XnBNsp8lrmDMrpvBr+b6pUl+4XbkQdndqnzYGzfuJm1JmIWimIbe6dndd/bk7gVce/cJdo3uIeLJl7+I2xTnPek67mjtDeppE7b03Ov+kSfDe3JweW53njxeGfXkaz28VeYd86+af/H8a7hgJKaebILaFzakLfxyfQLTxVB6K1K9KQAAAABJRU5ErkJggg==',
                    deployment: {
                        deployerTool: {
                            kind: 'terraform',
                            version: '=1.6.0',
                        },
                        inputVariables: [
                            {
                                name: 'admin_passwd',
                                kind: 'variable',
                                dataType: 'string',
                                example: null,
                                description:
                                    'The admin password of all nodes in the Kafka cluster instance. If the value is empty, will create a random password.',
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
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                            },
                            {
                                name: 'vpc_name',
                                kind: 'variable',
                                dataType: 'string',
                                example: 'kafka-vpc-default',
                                description:
                                    'The vpc name of all nodes in the Kafka cluster instance. If the value is empty, will use the default value to find or create VPC.',
                                value: 'kafka-vpc-default',
                                mandatory: false,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                autoFill: null,
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                            },
                            {
                                name: 'subnet_name',
                                kind: 'variable',
                                dataType: 'string',
                                example: 'kafka-subnet-default',
                                description:
                                    'The sub network name of all nodes in the Kafka cluster instance. If the value is empty, will use the default value to find or create subnet.',
                                value: 'kafka-subnet-default',
                                mandatory: false,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                autoFill: null,
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                            },
                            {
                                name: 'secgroup_name',
                                kind: 'variable',
                                dataType: 'string',
                                example: 'kafka-secgroup-default',
                                description:
                                    'The security group name of all nodes in the Kafka cluster instance. If the value is empty, will use the default value to find or create security group.',
                                value: 'kafka-secgroup-default',
                                mandatory: false,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                autoFill: null,
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                            },
                        ],
                        outputVariables: [
                            {
                                name: 'admin_passwd',
                                dataType: 'string',
                                description: 'The admin password of the service instance.',
                                sensitiveScope: 'always',
                            },
                            {
                                name: 'zookeeper_server',
                                dataType: 'string',
                                description: 'The server address of zookeeper.',
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
                                'variable "region" {\n  type        = string\n  description = "The region to deploy the Kafka cluster instance."\n}\n\nvariable "availability_zone" {\n  type        = string\n  default     = ""\n  description = "The availability zone to deploy the Kafka cluster instance."\n}\n\nvariable "flavor_id" {\n  type        = string\n  default     = "s6.large.2"\n  description = "The flavor_id of all nodes in the Kafka cluster instance."\n}\n\nvariable "worker_nodes_count" {\n  type        = string\n  default     = 3\n  description = "The worker nodes count in the Kafka cluster instance."\n}\n\nvariable "admin_passwd" {\n  type        = string\n  default     = ""\n  description = "The root password of all nodes in the Kafka cluster instance."\n}\n\nvariable "vpc_name" {\n  type        = string\n  default     = "kafka-vpc-default"\n  description = "The vpc name of all nodes in the Kafka cluster instance."\n}\n\nvariable "subnet_name" {\n  type        = string\n  default     = "kafka-subnet-default"\n  description = "The subnet name of all nodes in the Kafka cluster instance."\n}\n\nvariable "secgroup_name" {\n  type        = string\n  default     = "kafka-secgroup-default"\n  description = "The security group name of all nodes in the Kafka cluster instance."\n}\n',
                            'provider.tf':
                                'terraform {\n  required_providers {\n    huaweicloud = {\n      source  = "huaweicloud/huaweicloud"\n      version = "~> 1.61.0"\n    }\n  }\n}\n\nprovider "huaweicloud" {\n  region = var.region\n}\n',
                            'main.tf':
                                'data "huaweicloud_availability_zones" "osc-az" {}\n\ndata "huaweicloud_vpcs" "existing" {\n  name = var.vpc_name\n}\n\ndata "huaweicloud_vpc_subnets" "existing" {\n  name = var.subnet_name\n}\n\ndata "huaweicloud_networking_secgroups" "existing" {\n  name = var.secgroup_name\n}\n\nlocals {\n  availability_zone = var.availability_zone == "" ? data.huaweicloud_availability_zones.osc-az.names[0] : var.availability_zone\n  admin_passwd      = var.admin_passwd == "" ? random_password.password.result : var.admin_passwd\n  vpc_id            = length(data.huaweicloud_vpcs.existing.vpcs) > 0 ? data.huaweicloud_vpcs.existing.vpcs[0].id : huaweicloud_vpc.new[0].id\n  subnet_id         = length(data.huaweicloud_vpc_subnets.existing.subnets)> 0 ? data.huaweicloud_vpc_subnets.existing.subnets[0].id : huaweicloud_vpc_subnet.new[0].id\n  secgroup_id       = length(data.huaweicloud_networking_secgroups.existing.security_groups) > 0 ? data.huaweicloud_networking_secgroups.existing.security_groups[0].id : huaweicloud_networking_secgroup.new[0].id\n}\n\nresource "huaweicloud_vpc" "new" {\n  count = length(data.huaweicloud_vpcs.existing.vpcs) == 0 ? 1 : 0\n  name  = var.vpc_name\n  cidr  = "192.168.0.0/16"\n}\n\nresource "huaweicloud_vpc_subnet" "new" {\n  count      = length(data.huaweicloud_vpcs.existing.vpcs) == 0 ? 1 : 0\n  vpc_id     = local.vpc_id\n  name       = var.subnet_name\n  cidr       = "192.168.10.0/24"\n  gateway_ip = "192.168.10.1"\n}\n\nresource "huaweicloud_networking_secgroup" "new" {\n  count       = length(data.huaweicloud_networking_secgroups.existing.security_groups) == 0 ? 1 : 0\n  name        = var.secgroup_name\n  description = "Kafka cluster security group"\n}\n\nresource "huaweicloud_networking_secgroup_rule" "secgroup_rule_0" {\n  count             = length(data.huaweicloud_networking_secgroups.existing.security_groups) == 0 ? 1 : 0\n  direction         = "ingress"\n  ethertype         = "IPv4"\n  protocol          = "tcp"\n  port_range_min    = 22\n  port_range_max    = 22\n  remote_ip_prefix  = "121.37.117.211/32"\n  security_group_id = local.secgroup_id\n}\n\nresource "huaweicloud_networking_secgroup_rule" "secgroup_rule_1" {\n  count             = length(data.huaweicloud_networking_secgroups.existing.security_groups) == 0 ? 1 : 0\n  direction         = "ingress"\n  ethertype         = "IPv4"\n  protocol          = "tcp"\n  port_range_min    = 2181\n  port_range_max    = 2181\n  remote_ip_prefix  = "121.37.117.211/32"\n  security_group_id = local.secgroup_id\n}\n\nresource "huaweicloud_networking_secgroup_rule" "secgroup_rule_2" {\n  count             = length(data.huaweicloud_networking_secgroups.existing.security_groups) == 0 ? 1 : 0\n  direction         = "ingress"\n  ethertype         = "IPv4"\n  protocol          = "tcp"\n  port_range_min    = 9092\n  port_range_max    = 9093\n  remote_ip_prefix  = "121.37.117.211/32"\n  security_group_id = local.secgroup_id\n}\n\nresource "random_id" "new" {\n  byte_length = 4\n}\n\nresource "random_password" "password" {\n  length           = 12\n  upper            = true\n  lower            = true\n  numeric          = true\n  special          = true\n  min_special      = 1\n  override_special = "#%@"\n}\n\nresource "huaweicloud_kps_keypair" "keypair" {\n  name     = "keypair-kafka-${random_id.new.hex}"\n  key_file = "keypair-kafka-${random_id.new.hex}.pem"\n}\n\ndata "huaweicloud_images_image" "image" {\n  name                  = "Kafka-v3.3.2_Ubuntu-20.04"\n  most_recent           = true\n  enterprise_project_id = "0"\n}\n\nresource "huaweicloud_compute_instance" "zookeeper" {\n  availability_zone  = local.availability_zone\n  name               = "kafka-zookeeper-${random_id.new.hex}"\n  flavor_id          = var.flavor_id\n  security_group_ids = [ local.secgroup_id ]\n  image_id           = data.huaweicloud_images_image.image.id\n  key_pair           = huaweicloud_kps_keypair.keypair.name\n  network {\n    uuid = local.subnet_id\n  }\n  user_data = <<EOF\n    #!bin/bash\n    echo root:${local.admin_passwd} | sudo chpasswd\n    sudo systemctl start docker\n    sudo systemctl enable docker\n    sudo docker run -d --name zookeeper-server --privileged=true -p 2181:2181 -e ALLOW_ANONYMOUS_LOGIN=yes bitnami/zookeeper:3.8.1\n  EOF\n}\n\nresource "huaweicloud_compute_instance" "kafka-broker" {\n  count              = var.worker_nodes_count\n  availability_zone  = local.availability_zone\n  name               = "kafka-broker-${random_id.new.hex}-${count.index}"\n  flavor_id          = var.flavor_id\n  security_group_ids = [ local.secgroup_id ]\n  image_id           = data.huaweicloud_images_image.image.id\n  key_pair           = huaweicloud_kps_keypair.keypair.name\n  network {\n    uuid = local.subnet_id\n  }\n  user_data = <<EOF\n    #!bin/bash\n    echo root:${local.admin_passwd} | sudo chpasswd\n    sudo systemctl start docker\n    sudo systemctl enable docker\n    private_ip=$(ifconfig | grep -A1 "eth0" | grep \'inet\' | awk -F \' \' \' {print $2}\'|awk \' {print $1}\')\n    sudo docker run -d --name kafka-server --restart always -p 9092:9092 -p 9093:9093  -e KAFKA_BROKER_ID=${count.index}  -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://$private_ip:9092 -e KAFKA_LISTENERS=PLAINTEXT://0.0.0.0:9092 -e ALLOW_PLAINTEXT_LISTENER=yes -e KAFKA_CFG_ZOOKEEPER_CONNECT=${huaweicloud_compute_instance.zookeeper.access_ip_v4}:2181 bitnami/kafka:3.3.2\n  EOF\n  depends_on = [\n    huaweicloud_compute_instance.zookeeper\n  ]\n}\n\noutput "zookeeper_server" {\n  value = "${huaweicloud_compute_instance.zookeeper.access_ip_v4}:2181"\n}\n\noutput "admin_passwd" {\n  value = var.admin_passwd == "" ? nonsensitive(local.admin_passwd) : local.admin_passwd\n}\n',
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
                                'The admin password of all nodes in the Kafka cluster instance. If the value is empty, will create a random password.',
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
                                isDataLost: true,
                                isServiceInterrupted: true,
                            },
                        },
                        {
                            name: 'vpc_name',
                            kind: 'variable',
                            dataType: 'string',
                            example: 'kafka-vpc-default',
                            description:
                                'The vpc name of all nodes in the Kafka cluster instance. If the value is empty, will use the default value to find or create VPC.',
                            value: 'kafka-vpc-default',
                            mandatory: false,
                            valueSchema: null,
                            sensitiveScope: 'none',
                            autoFill: null,
                            modificationImpact: {
                                isDataLost: true,
                                isServiceInterrupted: true,
                            },
                        },
                        {
                            name: 'subnet_name',
                            kind: 'variable',
                            dataType: 'string',
                            example: 'kafka-subnet-default',
                            description:
                                'The sub network name of all nodes in the Kafka cluster instance. If the value is empty, will use the default value to find or create subnet.',
                            value: 'kafka-subnet-default',
                            mandatory: false,
                            valueSchema: null,
                            sensitiveScope: 'none',
                            autoFill: null,
                            modificationImpact: {
                                isDataLost: true,
                                isServiceInterrupted: true,
                            },
                        },
                        {
                            name: 'secgroup_name',
                            kind: 'variable',
                            dataType: 'string',
                            example: 'kafka-secgroup-default',
                            description:
                                'The security group name of all nodes in the Kafka cluster instance. If the value is empty, will use the default value to find or create security group.',
                            value: 'kafka-secgroup-default',
                            mandatory: false,
                            valueSchema: null,
                            sensitiveScope: 'none',
                            autoFill: null,
                            modificationImpact: {
                                isDataLost: true,
                                isServiceInterrupted: true,
                            },
                        },
                    ],
                    outputVariables: [
                        {
                            name: 'admin_passwd',
                            dataType: 'string',
                            description: 'The admin password of the service instance.',
                            sensitiveScope: 'always',
                        },
                        {
                            name: 'zookeeper_server',
                            dataType: 'string',
                            description: 'The server address of zookeeper.',
                            sensitiveScope: 'none',
                        },
                    ],
                    flavors: {
                        serviceFlavors: [
                            {
                                name: '1-zookeeper-with-3-worker-nodes-normal',
                                properties: {
                                    worker_nodes_count: '3',
                                    flavor_id: 's6.large.2',
                                },
                                priority: 1,
                                features: ['High Availability', 'Maximum performance'],
                                pricing: {
                                    fixedPrices: [
                                        {
                                            regionName: 'any',
                                            siteName: 'Chinese Mainland',
                                            price: {
                                                cost: 730,
                                                currency: 'CNY',
                                                period: 'monthly',
                                            },
                                        },
                                    ],
                                    resourceUsage: {
                                        resources: [
                                            {
                                                count: 4,
                                                deployResourceKind: 'vm',
                                                properties: {
                                                    cloud_service_type: 'hws.service.type.ec2',
                                                    resource_type: 'hws.resource.type.vm',
                                                    resource_spec: 's6.large.2.linux',
                                                },
                                            },
                                            {
                                                count: 4,
                                                deployResourceKind: 'volume',
                                                properties: {
                                                    cloud_service_type: 'hws.service.type.ebs',
                                                    resource_type: 'hws.resource.type.volume',
                                                    resource_spec: 'SSD',
                                                    resource_size: '40',
                                                    size_measure_id: '17',
                                                },
                                            },
                                        ],
                                        licensePrices: [
                                            {
                                                regionName: 'any',
                                                siteName: 'Chinese Mainland',
                                                price: {
                                                    cost: 1.9,
                                                    currency: 'CNY',
                                                    period: 'hourly',
                                                },
                                            },
                                        ],
                                        markUpPrices: [
                                            {
                                                regionName: 'any',
                                                siteName: 'Chinese Mainland',
                                                price: {
                                                    cost: 1.9,
                                                    currency: 'CNY',
                                                    period: 'hourly',
                                                },
                                            },
                                        ],
                                    },
                                    isPriceOnlyForManagementLayer: null,
                                },
                            },
                            {
                                name: '1-zookeeper-with-3-worker-nodes-performance',
                                properties: {
                                    worker_nodes_count: '3',
                                    flavor_id: 's6.large.4',
                                },
                                priority: 2,
                                features: ['High Availability', 'Maximum performance'],
                                pricing: {
                                    fixedPrices: [
                                        {
                                            regionName: 'any',
                                            siteName: 'Chinese Mainland',
                                            price: {
                                                cost: 980,
                                                currency: 'CNY',
                                                period: 'monthly',
                                            },
                                        },
                                    ],
                                    resourceUsage: {
                                        resources: [
                                            {
                                                count: 4,
                                                deployResourceKind: 'vm',
                                                properties: {
                                                    cloud_service_type: 'hws.service.type.ec2',
                                                    resource_type: 'hws.resource.type.vm',
                                                    resource_spec: 's6.large.4.linux',
                                                },
                                            },
                                            {
                                                count: 4,
                                                deployResourceKind: 'volume',
                                                properties: {
                                                    cloud_service_type: 'hws.service.type.ebs',
                                                    resource_type: 'hws.resource.type.volume',
                                                    resource_spec: 'SSD',
                                                    resource_size: '40',
                                                    size_measure_id: '17',
                                                },
                                            },
                                        ],
                                        licensePrices: [
                                            {
                                                regionName: 'any',
                                                siteName: 'Chinese Mainland',
                                                price: {
                                                    cost: 1.9,
                                                    currency: 'CNY',
                                                    period: 'hourly',
                                                },
                                            },
                                        ],
                                        markUpPrices: [
                                            {
                                                regionName: 'any',
                                                siteName: 'Chinese Mainland',
                                                price: {
                                                    cost: 1.9,
                                                    currency: 'CNY',
                                                    period: 'hourly',
                                                },
                                            },
                                        ],
                                    },
                                    isPriceOnlyForManagementLayer: null,
                                },
                            },
                        ],
                        modificationImpact: {
                            isDataLost: true,
                            isServiceInterrupted: true,
                        },
                        isDowngradeAllowed: true,
                        downgradeAllowed: true,
                    },
                    billing: {
                        billingModes: ['Fixed', 'Pay per Use'],
                        defaultBillingMode: null,
                    },
                    serviceHostingType: 'self',
                    createdTime: '2025-04-01 11:10:06 +08:00',
                    lastModifiedTime: '2025-04-01 11:22:22 +08:00',
                    serviceTemplateRegistrationState: 'approved',
                    isReviewInProgress: false,
                    isAvailableInCatalog: true,
                    serviceProviderContactDetails: {
                        emails: ['test30@test.com', 'test31@test.com'],
                        phones: ['011-13422222222', '022-13344444444'],
                        chats: ['test1234', 'test1235'],
                        websites: ['https://hw.com', 'https://hwcloud.com'],
                    },
                    eula: null,
                    serviceConfigurationManage: {
                        type: 'ansible',
                        agentVersion: null,
                        configManageScripts: [
                            {
                                changeHandler: 'kafka-broker',
                                runOnlyOnce: false,
                                ansibleScriptConfig: {
                                    playbookName: 'middleware/ansible/kafka/kafka-container-manage.yml',
                                    virtualEnv: '',
                                    pythonVersion: '3.10',
                                    isPrepareAnsibleEnvironment: null,
                                    repoUrl: 'https://github.com/eclipse-xpanse/xpanse-samples',
                                    branch: 'main',
                                    requirementsFile: 'requirements.txt',
                                    galaxyFile: '',
                                    ansibleInventoryRequired: false,
                                },
                            },
                            {
                                changeHandler: 'zookeeper',
                                runOnlyOnce: true,
                                ansibleScriptConfig: {
                                    playbookName: 'middleware/ansible/kafka/kafka-container-manage.yml',
                                    virtualEnv: '',
                                    pythonVersion: '3.10',
                                    isPrepareAnsibleEnvironment: null,
                                    repoUrl: 'https://github.com/eclipse-xpanse/xpanse-samples',
                                    branch: 'main',
                                    requirementsFile: 'requirements.txt',
                                    galaxyFile: '',
                                    ansibleInventoryRequired: false,
                                },
                            },
                        ],
                        configurationParameters: [
                            {
                                name: 'kafka_cfg_message_max_bytes',
                                kind: 'variable',
                                dataType: 'number',
                                example: null,
                                description:
                                    'Parameters used to configure the Kafka server or client to set the maximum number of bytes for Kafka messages.',
                                value: null,
                                initialValue: 1048576,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                                isReadOnly: false,
                                managedBy: 'kafka-broker',
                            },
                            {
                                name: 'kafka_cfg_log_dirs',
                                kind: 'variable',
                                dataType: 'string',
                                example: null,
                                description: 'Parameters for the storage location of Kafka log data',
                                value: null,
                                initialValue: '/var/lib/kafka/logs',
                                valueSchema: null,
                                sensitiveScope: 'none',
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                                isReadOnly: false,
                                managedBy: 'kafka-broker',
                            },
                            {
                                name: 'kafka_cfg_num_io_threads',
                                kind: 'variable',
                                dataType: 'number',
                                example: null,
                                description:
                                    'Parameter used to set the number of I/O threads to handle kafka network requests',
                                value: null,
                                initialValue: 8,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                                isReadOnly: false,
                                managedBy: 'kafka-broker',
                            },
                            {
                                name: 'kafka_log_flush_interval_messages',
                                kind: 'variable',
                                dataType: 'number',
                                example: null,
                                description:
                                    "Kafka's log flush strategy, specifies the parameters that trigger a log flush operation after how many messages are written.",
                                value: null,
                                initialValue: 10000,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                                isReadOnly: false,
                                managedBy: 'kafka-broker',
                            },
                            {
                                name: 'kafka_offsets_topic_replication_factor',
                                kind: 'variable',
                                dataType: 'number',
                                example: null,
                                description:
                                    'Replication factor configuration parameters for the dedicated topic (offsets topic) used in the Kafka cluster to consume offset information for the consumer storage group',
                                value: null,
                                initialValue: 3,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                                isReadOnly: false,
                                managedBy: 'kafka-broker',
                            },
                            {
                                name: 'zookeeper_global_outstanding_limit',
                                kind: 'variable',
                                dataType: 'number',
                                example: null,
                                description:
                                    'Clients can submit requests faster than ZooKeeper can process them, especially if there are a lot of clients.',
                                value: null,
                                initialValue: 1000,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                                isReadOnly: false,
                                managedBy: 'zookeeper',
                            },
                            {
                                name: 'zookeeper_snap_count',
                                kind: 'variable',
                                dataType: 'number',
                                example: null,
                                description:
                                    'Limits the number of concurrent connections (at the socket level) that a single client, identified by IP address, may make to a single member of the ZooKeeper ensemble. This is used to prevent certain classes of DoS attacks, including file descriptor exhaustion. The default is 60. Setting this to 0 entirely removes the limit on concurrent connections.',
                                value: null,
                                initialValue: 1000,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                                isReadOnly: false,
                                managedBy: 'zookeeper',
                            },
                        ],
                    },
                    serviceActions: [
                        {
                            name: 'upgrade',
                            type: 'ansible',
                            actionManageScripts: [
                                {
                                    changeHandler: 'kafka-broker',
                                    runOnlyOnce: false,
                                    ansibleScriptConfig: {
                                        playbookName: 'middleware/ansible/kafka/kafka-container-manage.yml',
                                        virtualEnv: '',
                                        pythonVersion: '3.10',
                                        isPrepareAnsibleEnvironment: null,
                                        repoUrl: 'https://github.com/eclipse-xpanse/xpanse-samples',
                                        branch: 'main',
                                        requirementsFile: 'requirements.txt',
                                        galaxyFile: '',
                                        ansibleInventoryRequired: false,
                                    },
                                },
                            ],
                            actionParameters: [
                                {
                                    name: 'inter_broker_protocol_version',
                                    kind: 'variable',
                                    dataType: 'string',
                                    example: null,
                                    description:
                                        'controls the protocol version used for communication between Kafka Brokers to ensure that the old and new versions of Brokers can communicate normally during the rolling upgrade process.',
                                    value: null,
                                    initialValue: 3.2,
                                    valueSchema: null,
                                    sensitiveScope: 'none',
                                    modificationImpact: {
                                        isDataLost: true,
                                        isServiceInterrupted: true,
                                    },
                                    isReadOnly: false,
                                    managedBy: 'kafka-broker',
                                },
                            ],
                        },
                        {
                            name: 'backup',
                            type: 'ansible',
                            actionManageScripts: [
                                {
                                    changeHandler: 'zookeeper',
                                    runOnlyOnce: true,
                                    ansibleScriptConfig: {
                                        playbookName: 'middleware/ansible/kafka/kafka-container-manage.yml',
                                        virtualEnv: '',
                                        pythonVersion: '3.10',
                                        isPrepareAnsibleEnvironment: null,
                                        repoUrl: 'https://github.com/eclipse-xpanse/xpanse-samples',
                                        branch: 'main',
                                        requirementsFile: 'requirements.txt',
                                        galaxyFile: '',
                                        ansibleInventoryRequired: false,
                                    },
                                },
                            ],
                            actionParameters: [
                                {
                                    name: 'kafka_cfg_message_max_bytes',
                                    kind: 'variable',
                                    dataType: 'number',
                                    example: null,
                                    description:
                                        'Parameters used to configure the Kafka server or client to set the maximum number of bytes for Kafka messages.',
                                    value: null,
                                    initialValue: 1048576,
                                    valueSchema: null,
                                    sensitiveScope: 'none',
                                    modificationImpact: {
                                        isDataLost: true,
                                        isServiceInterrupted: true,
                                    },
                                    isReadOnly: false,
                                    managedBy: 'kafka-broker',
                                },
                            ],
                        },
                    ],
                    links: [
                        {
                            rel: 'openApi',
                            href: 'http://localhost:8080/xpanse/catalog/services/21597cd5-748e-4f0e-9768-baaa5275b2bd/openapi',
                        },
                    ],
                },
            ]),
        });
    });
};

export const mockServiceTemplateReviewedSuccessResponse = async (page: Page, timeToWaitForResponse: number) => {
    await page.route(serviceTemplateUrl, async (route) => {
        await new Promise((resolve) => {
            setTimeout(resolve, timeToWaitForResponse);
        });
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([
                {
                    serviceTemplateId: '21597cd5-748e-4f0e-9768-baaa5275b2bd',
                    name: 'kafka-cluster',
                    version: '1.0.0',
                    csp: 'HuaweiCloud',
                    category: 'middleware',
                    serviceVendor: 'ISV-A',
                    regions: [
                        {
                            name: 'cn-southwest-2',
                            site: 'Chinese Mainland',
                            area: 'Asia China',
                        },
                        {
                            name: 'cn-north-4',
                            site: 'Chinese Mainland',
                            area: 'Asia China',
                        },
                    ],
                    description: 'This is an enhanced Kafka cluster services by ISV-A.',
                    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAACRAQMAAAAPc4+9AAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAZQTFRF+/v7Hh8gVD0A0wAAAcVJREFUeJzNlc1twzAMhSX44KNH0CgaTd6gK3kUd4McDVTwq/hjiUyaIkV7qNA2/QCFIh+ppxB+svLNEqqBGTC0ANugBOwmCGDCFOAwIWGDOoqoODtN2BdL6wxD9NMTO9tXPa1PqL5M30W5p8lm5vNcF0t7ahSrVguqNqmMokRW4YQucVjBCBWH1Z2g3WDlW2skoYU+2x8JOtGedBF3k2iXMO0j16iUiI6gxzPdQhnU/s2G9pCO57QY2r6hvjPbKJHq7DRTRXT60avtuTRdbrFJI3mSZhNOqYjVbd99YyK1QKWzEqSWrE0k07U60uPaelflMzaaeu1KBuurHSsn572I1KWy2joX5ZBfWbS/VEt50H5P6aL4JxTuyJ/+QCNPX4PWF3Q8Xe1eF9FsLdD2VaOnaP2hWvs+zI58/7i3vH3nRFtDZpyTUNaZkON5XnBNsp8lrmDMrpvBr+b6pUl+4XbkQdndqnzYGzfuJm1JmIWimIbe6dndd/bk7gVce/cJdo3uIeLJl7+I2xTnPek67mjtDeppE7b03Ov+kSfDe3JweW53njxeGfXkaz28VeYd86+af/H8a7hgJKaebILaFzakLfxyfQLTxVB6K1K9KQAAAABJRU5ErkJggg==',
                    deployment: {
                        deployerTool: {
                            kind: 'terraform',
                            version: '=1.6.0',
                        },
                        inputVariables: [
                            {
                                name: 'admin_passwd',
                                kind: 'variable',
                                dataType: 'string',
                                example: null,
                                description:
                                    'The admin password of all nodes in the Kafka cluster instance. If the value is empty, will create a random password.',
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
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                            },
                            {
                                name: 'vpc_name',
                                kind: 'variable',
                                dataType: 'string',
                                example: 'kafka-vpc-default',
                                description:
                                    'The vpc name of all nodes in the Kafka cluster instance. If the value is empty, will use the default value to find or create VPC.',
                                value: 'kafka-vpc-default',
                                mandatory: false,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                autoFill: null,
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                            },
                            {
                                name: 'subnet_name',
                                kind: 'variable',
                                dataType: 'string',
                                example: 'kafka-subnet-default',
                                description:
                                    'The sub network name of all nodes in the Kafka cluster instance. If the value is empty, will use the default value to find or create subnet.',
                                value: 'kafka-subnet-default',
                                mandatory: false,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                autoFill: null,
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                            },
                            {
                                name: 'secgroup_name',
                                kind: 'variable',
                                dataType: 'string',
                                example: 'kafka-secgroup-default',
                                description:
                                    'The security group name of all nodes in the Kafka cluster instance. If the value is empty, will use the default value to find or create security group.',
                                value: 'kafka-secgroup-default',
                                mandatory: false,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                autoFill: null,
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                            },
                        ],
                        outputVariables: [
                            {
                                name: 'admin_passwd',
                                dataType: 'string',
                                description: 'The admin password of the service instance.',
                                sensitiveScope: 'always',
                            },
                            {
                                name: 'zookeeper_server',
                                dataType: 'string',
                                description: 'The server address of zookeeper.',
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
                                'variable "region" {\n  type        = string\n  description = "The region to deploy the Kafka cluster instance."\n}\n\nvariable "availability_zone" {\n  type        = string\n  default     = ""\n  description = "The availability zone to deploy the Kafka cluster instance."\n}\n\nvariable "flavor_id" {\n  type        = string\n  default     = "s6.large.2"\n  description = "The flavor_id of all nodes in the Kafka cluster instance."\n}\n\nvariable "worker_nodes_count" {\n  type        = string\n  default     = 3\n  description = "The worker nodes count in the Kafka cluster instance."\n}\n\nvariable "admin_passwd" {\n  type        = string\n  default     = ""\n  description = "The root password of all nodes in the Kafka cluster instance."\n}\n\nvariable "vpc_name" {\n  type        = string\n  default     = "kafka-vpc-default"\n  description = "The vpc name of all nodes in the Kafka cluster instance."\n}\n\nvariable "subnet_name" {\n  type        = string\n  default     = "kafka-subnet-default"\n  description = "The subnet name of all nodes in the Kafka cluster instance."\n}\n\nvariable "secgroup_name" {\n  type        = string\n  default     = "kafka-secgroup-default"\n  description = "The security group name of all nodes in the Kafka cluster instance."\n}\n',
                            'provider.tf':
                                'terraform {\n  required_providers {\n    huaweicloud = {\n      source  = "huaweicloud/huaweicloud"\n      version = "~> 1.61.0"\n    }\n  }\n}\n\nprovider "huaweicloud" {\n  region = var.region\n}\n',
                            'main.tf':
                                'data "huaweicloud_availability_zones" "osc-az" {}\n\ndata "huaweicloud_vpcs" "existing" {\n  name = var.vpc_name\n}\n\ndata "huaweicloud_vpc_subnets" "existing" {\n  name = var.subnet_name\n}\n\ndata "huaweicloud_networking_secgroups" "existing" {\n  name = var.secgroup_name\n}\n\nlocals {\n  availability_zone = var.availability_zone == "" ? data.huaweicloud_availability_zones.osc-az.names[0] : var.availability_zone\n  admin_passwd      = var.admin_passwd == "" ? random_password.password.result : var.admin_passwd\n  vpc_id            = length(data.huaweicloud_vpcs.existing.vpcs) > 0 ? data.huaweicloud_vpcs.existing.vpcs[0].id : huaweicloud_vpc.new[0].id\n  subnet_id         = length(data.huaweicloud_vpc_subnets.existing.subnets)> 0 ? data.huaweicloud_vpc_subnets.existing.subnets[0].id : huaweicloud_vpc_subnet.new[0].id\n  secgroup_id       = length(data.huaweicloud_networking_secgroups.existing.security_groups) > 0 ? data.huaweicloud_networking_secgroups.existing.security_groups[0].id : huaweicloud_networking_secgroup.new[0].id\n}\n\nresource "huaweicloud_vpc" "new" {\n  count = length(data.huaweicloud_vpcs.existing.vpcs) == 0 ? 1 : 0\n  name  = var.vpc_name\n  cidr  = "192.168.0.0/16"\n}\n\nresource "huaweicloud_vpc_subnet" "new" {\n  count      = length(data.huaweicloud_vpcs.existing.vpcs) == 0 ? 1 : 0\n  vpc_id     = local.vpc_id\n  name       = var.subnet_name\n  cidr       = "192.168.10.0/24"\n  gateway_ip = "192.168.10.1"\n}\n\nresource "huaweicloud_networking_secgroup" "new" {\n  count       = length(data.huaweicloud_networking_secgroups.existing.security_groups) == 0 ? 1 : 0\n  name        = var.secgroup_name\n  description = "Kafka cluster security group"\n}\n\nresource "huaweicloud_networking_secgroup_rule" "secgroup_rule_0" {\n  count             = length(data.huaweicloud_networking_secgroups.existing.security_groups) == 0 ? 1 : 0\n  direction         = "ingress"\n  ethertype         = "IPv4"\n  protocol          = "tcp"\n  port_range_min    = 22\n  port_range_max    = 22\n  remote_ip_prefix  = "121.37.117.211/32"\n  security_group_id = local.secgroup_id\n}\n\nresource "huaweicloud_networking_secgroup_rule" "secgroup_rule_1" {\n  count             = length(data.huaweicloud_networking_secgroups.existing.security_groups) == 0 ? 1 : 0\n  direction         = "ingress"\n  ethertype         = "IPv4"\n  protocol          = "tcp"\n  port_range_min    = 2181\n  port_range_max    = 2181\n  remote_ip_prefix  = "121.37.117.211/32"\n  security_group_id = local.secgroup_id\n}\n\nresource "huaweicloud_networking_secgroup_rule" "secgroup_rule_2" {\n  count             = length(data.huaweicloud_networking_secgroups.existing.security_groups) == 0 ? 1 : 0\n  direction         = "ingress"\n  ethertype         = "IPv4"\n  protocol          = "tcp"\n  port_range_min    = 9092\n  port_range_max    = 9093\n  remote_ip_prefix  = "121.37.117.211/32"\n  security_group_id = local.secgroup_id\n}\n\nresource "random_id" "new" {\n  byte_length = 4\n}\n\nresource "random_password" "password" {\n  length           = 12\n  upper            = true\n  lower            = true\n  numeric          = true\n  special          = true\n  min_special      = 1\n  override_special = "#%@"\n}\n\nresource "huaweicloud_kps_keypair" "keypair" {\n  name     = "keypair-kafka-${random_id.new.hex}"\n  key_file = "keypair-kafka-${random_id.new.hex}.pem"\n}\n\ndata "huaweicloud_images_image" "image" {\n  name                  = "Kafka-v3.3.2_Ubuntu-20.04"\n  most_recent           = true\n  enterprise_project_id = "0"\n}\n\nresource "huaweicloud_compute_instance" "zookeeper" {\n  availability_zone  = local.availability_zone\n  name               = "kafka-zookeeper-${random_id.new.hex}"\n  flavor_id          = var.flavor_id\n  security_group_ids = [ local.secgroup_id ]\n  image_id           = data.huaweicloud_images_image.image.id\n  key_pair           = huaweicloud_kps_keypair.keypair.name\n  network {\n    uuid = local.subnet_id\n  }\n  user_data = <<EOF\n    #!bin/bash\n    echo root:${local.admin_passwd} | sudo chpasswd\n    sudo systemctl start docker\n    sudo systemctl enable docker\n    sudo docker run -d --name zookeeper-server --privileged=true -p 2181:2181 -e ALLOW_ANONYMOUS_LOGIN=yes bitnami/zookeeper:3.8.1\n  EOF\n}\n\nresource "huaweicloud_compute_instance" "kafka-broker" {\n  count              = var.worker_nodes_count\n  availability_zone  = local.availability_zone\n  name               = "kafka-broker-${random_id.new.hex}-${count.index}"\n  flavor_id          = var.flavor_id\n  security_group_ids = [ local.secgroup_id ]\n  image_id           = data.huaweicloud_images_image.image.id\n  key_pair           = huaweicloud_kps_keypair.keypair.name\n  network {\n    uuid = local.subnet_id\n  }\n  user_data = <<EOF\n    #!bin/bash\n    echo root:${local.admin_passwd} | sudo chpasswd\n    sudo systemctl start docker\n    sudo systemctl enable docker\n    private_ip=$(ifconfig | grep -A1 "eth0" | grep \'inet\' | awk -F \' \' \' {print $2}\'|awk \' {print $1}\')\n    sudo docker run -d --name kafka-server --restart always -p 9092:9092 -p 9093:9093  -e KAFKA_BROKER_ID=${count.index}  -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://$private_ip:9092 -e KAFKA_LISTENERS=PLAINTEXT://0.0.0.0:9092 -e ALLOW_PLAINTEXT_LISTENER=yes -e KAFKA_CFG_ZOOKEEPER_CONNECT=${huaweicloud_compute_instance.zookeeper.access_ip_v4}:2181 bitnami/kafka:3.3.2\n  EOF\n  depends_on = [\n    huaweicloud_compute_instance.zookeeper\n  ]\n}\n\noutput "zookeeper_server" {\n  value = "${huaweicloud_compute_instance.zookeeper.access_ip_v4}:2181"\n}\n\noutput "admin_passwd" {\n  value = var.admin_passwd == "" ? nonsensitive(local.admin_passwd) : local.admin_passwd\n}\n',
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
                                'The admin password of all nodes in the Kafka cluster instance. If the value is empty, will create a random password.',
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
                                isDataLost: true,
                                isServiceInterrupted: true,
                            },
                        },
                        {
                            name: 'vpc_name',
                            kind: 'variable',
                            dataType: 'string',
                            example: 'kafka-vpc-default',
                            description:
                                'The vpc name of all nodes in the Kafka cluster instance. If the value is empty, will use the default value to find or create VPC.',
                            value: 'kafka-vpc-default',
                            mandatory: false,
                            valueSchema: null,
                            sensitiveScope: 'none',
                            autoFill: null,
                            modificationImpact: {
                                isDataLost: true,
                                isServiceInterrupted: true,
                            },
                        },
                        {
                            name: 'subnet_name',
                            kind: 'variable',
                            dataType: 'string',
                            example: 'kafka-subnet-default',
                            description:
                                'The sub network name of all nodes in the Kafka cluster instance. If the value is empty, will use the default value to find or create subnet.',
                            value: 'kafka-subnet-default',
                            mandatory: false,
                            valueSchema: null,
                            sensitiveScope: 'none',
                            autoFill: null,
                            modificationImpact: {
                                isDataLost: true,
                                isServiceInterrupted: true,
                            },
                        },
                        {
                            name: 'secgroup_name',
                            kind: 'variable',
                            dataType: 'string',
                            example: 'kafka-secgroup-default',
                            description:
                                'The security group name of all nodes in the Kafka cluster instance. If the value is empty, will use the default value to find or create security group.',
                            value: 'kafka-secgroup-default',
                            mandatory: false,
                            valueSchema: null,
                            sensitiveScope: 'none',
                            autoFill: null,
                            modificationImpact: {
                                isDataLost: true,
                                isServiceInterrupted: true,
                            },
                        },
                    ],
                    outputVariables: [
                        {
                            name: 'admin_passwd',
                            dataType: 'string',
                            description: 'The admin password of the service instance.',
                            sensitiveScope: 'always',
                        },
                        {
                            name: 'zookeeper_server',
                            dataType: 'string',
                            description: 'The server address of zookeeper.',
                            sensitiveScope: 'none',
                        },
                    ],
                    flavors: {
                        serviceFlavors: [
                            {
                                name: '1-zookeeper-with-3-worker-nodes-normal',
                                properties: {
                                    worker_nodes_count: '3',
                                    flavor_id: 's6.large.2',
                                },
                                priority: 1,
                                features: ['High Availability', 'Maximum performance'],
                                pricing: {
                                    fixedPrices: [
                                        {
                                            regionName: 'any',
                                            siteName: 'Chinese Mainland',
                                            price: {
                                                cost: 730,
                                                currency: 'CNY',
                                                period: 'monthly',
                                            },
                                        },
                                    ],
                                    resourceUsage: {
                                        resources: [
                                            {
                                                count: 4,
                                                deployResourceKind: 'vm',
                                                properties: {
                                                    cloud_service_type: 'hws.service.type.ec2',
                                                    resource_type: 'hws.resource.type.vm',
                                                    resource_spec: 's6.large.2.linux',
                                                },
                                            },
                                            {
                                                count: 4,
                                                deployResourceKind: 'volume',
                                                properties: {
                                                    cloud_service_type: 'hws.service.type.ebs',
                                                    resource_type: 'hws.resource.type.volume',
                                                    resource_spec: 'SSD',
                                                    resource_size: '40',
                                                    size_measure_id: '17',
                                                },
                                            },
                                        ],
                                        licensePrices: [
                                            {
                                                regionName: 'any',
                                                siteName: 'Chinese Mainland',
                                                price: {
                                                    cost: 1.9,
                                                    currency: 'CNY',
                                                    period: 'hourly',
                                                },
                                            },
                                        ],
                                        markUpPrices: [
                                            {
                                                regionName: 'any',
                                                siteName: 'Chinese Mainland',
                                                price: {
                                                    cost: 1.9,
                                                    currency: 'CNY',
                                                    period: 'hourly',
                                                },
                                            },
                                        ],
                                    },
                                    isPriceOnlyForManagementLayer: null,
                                },
                            },
                            {
                                name: '1-zookeeper-with-3-worker-nodes-performance',
                                properties: {
                                    worker_nodes_count: '3',
                                    flavor_id: 's6.large.4',
                                },
                                priority: 2,
                                features: ['High Availability', 'Maximum performance'],
                                pricing: {
                                    fixedPrices: [
                                        {
                                            regionName: 'any',
                                            siteName: 'Chinese Mainland',
                                            price: {
                                                cost: 980,
                                                currency: 'CNY',
                                                period: 'monthly',
                                            },
                                        },
                                    ],
                                    resourceUsage: {
                                        resources: [
                                            {
                                                count: 4,
                                                deployResourceKind: 'vm',
                                                properties: {
                                                    cloud_service_type: 'hws.service.type.ec2',
                                                    resource_type: 'hws.resource.type.vm',
                                                    resource_spec: 's6.large.4.linux',
                                                },
                                            },
                                            {
                                                count: 4,
                                                deployResourceKind: 'volume',
                                                properties: {
                                                    cloud_service_type: 'hws.service.type.ebs',
                                                    resource_type: 'hws.resource.type.volume',
                                                    resource_spec: 'SSD',
                                                    resource_size: '40',
                                                    size_measure_id: '17',
                                                },
                                            },
                                        ],
                                        licensePrices: [
                                            {
                                                regionName: 'any',
                                                siteName: 'Chinese Mainland',
                                                price: {
                                                    cost: 1.9,
                                                    currency: 'CNY',
                                                    period: 'hourly',
                                                },
                                            },
                                        ],
                                        markUpPrices: [
                                            {
                                                regionName: 'any',
                                                siteName: 'Chinese Mainland',
                                                price: {
                                                    cost: 1.9,
                                                    currency: 'CNY',
                                                    period: 'hourly',
                                                },
                                            },
                                        ],
                                    },
                                    isPriceOnlyForManagementLayer: null,
                                },
                            },
                        ],
                        modificationImpact: {
                            isDataLost: true,
                            isServiceInterrupted: true,
                        },
                        isDowngradeAllowed: true,
                        downgradeAllowed: true,
                    },
                    billing: {
                        billingModes: ['Fixed', 'Pay per Use'],
                        defaultBillingMode: null,
                    },
                    serviceHostingType: 'self',
                    createdTime: '2025-04-01 11:10:06 +08:00',
                    lastModifiedTime: '2025-04-01 11:22:22 +08:00',
                    serviceTemplateRegistrationState: 'approved',
                    isReviewInProgress: false,
                    isAvailableInCatalog: true,
                    serviceProviderContactDetails: {
                        emails: ['test30@test.com', 'test31@test.com'],
                        phones: ['011-13422222222', '022-13344444444'],
                        chats: ['test1234', 'test1235'],
                        websites: ['https://hw.com', 'https://hwcloud.com'],
                    },
                    eula: null,
                    serviceConfigurationManage: {
                        type: 'ansible',
                        agentVersion: null,
                        configManageScripts: [
                            {
                                changeHandler: 'kafka-broker',
                                runOnlyOnce: false,
                                ansibleScriptConfig: {
                                    playbookName: 'middleware/ansible/kafka/kafka-container-manage.yml',
                                    virtualEnv: '',
                                    pythonVersion: '3.10',
                                    isPrepareAnsibleEnvironment: null,
                                    repoUrl: 'https://github.com/eclipse-xpanse/xpanse-samples',
                                    branch: 'main',
                                    requirementsFile: 'requirements.txt',
                                    galaxyFile: '',
                                    ansibleInventoryRequired: false,
                                },
                            },
                            {
                                changeHandler: 'zookeeper',
                                runOnlyOnce: true,
                                ansibleScriptConfig: {
                                    playbookName: 'middleware/ansible/kafka/kafka-container-manage.yml',
                                    virtualEnv: '',
                                    pythonVersion: '3.10',
                                    isPrepareAnsibleEnvironment: null,
                                    repoUrl: 'https://github.com/eclipse-xpanse/xpanse-samples',
                                    branch: 'main',
                                    requirementsFile: 'requirements.txt',
                                    galaxyFile: '',
                                    ansibleInventoryRequired: false,
                                },
                            },
                        ],
                        configurationParameters: [
                            {
                                name: 'kafka_cfg_message_max_bytes',
                                kind: 'variable',
                                dataType: 'number',
                                example: null,
                                description:
                                    'Parameters used to configure the Kafka server or client to set the maximum number of bytes for Kafka messages.',
                                value: null,
                                initialValue: 1048576,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                                isReadOnly: false,
                                managedBy: 'kafka-broker',
                            },
                            {
                                name: 'kafka_cfg_log_dirs',
                                kind: 'variable',
                                dataType: 'string',
                                example: null,
                                description: 'Parameters for the storage location of Kafka log data',
                                value: null,
                                initialValue: '/var/lib/kafka/logs',
                                valueSchema: null,
                                sensitiveScope: 'none',
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                                isReadOnly: false,
                                managedBy: 'kafka-broker',
                            },
                            {
                                name: 'kafka_cfg_num_io_threads',
                                kind: 'variable',
                                dataType: 'number',
                                example: null,
                                description:
                                    'Parameter used to set the number of I/O threads to handle kafka network requests',
                                value: null,
                                initialValue: 8,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                                isReadOnly: false,
                                managedBy: 'kafka-broker',
                            },
                            {
                                name: 'kafka_log_flush_interval_messages',
                                kind: 'variable',
                                dataType: 'number',
                                example: null,
                                description:
                                    "Kafka's log flush strategy, specifies the parameters that trigger a log flush operation after how many messages are written.",
                                value: null,
                                initialValue: 10000,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                                isReadOnly: false,
                                managedBy: 'kafka-broker',
                            },
                            {
                                name: 'kafka_offsets_topic_replication_factor',
                                kind: 'variable',
                                dataType: 'number',
                                example: null,
                                description:
                                    'Replication factor configuration parameters for the dedicated topic (offsets topic) used in the Kafka cluster to consume offset information for the consumer storage group',
                                value: null,
                                initialValue: 3,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                                isReadOnly: false,
                                managedBy: 'kafka-broker',
                            },
                            {
                                name: 'zookeeper_global_outstanding_limit',
                                kind: 'variable',
                                dataType: 'number',
                                example: null,
                                description:
                                    'Clients can submit requests faster than ZooKeeper can process them, especially if there are a lot of clients.',
                                value: null,
                                initialValue: 1000,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                                isReadOnly: false,
                                managedBy: 'zookeeper',
                            },
                            {
                                name: 'zookeeper_snap_count',
                                kind: 'variable',
                                dataType: 'number',
                                example: null,
                                description:
                                    'Limits the number of concurrent connections (at the socket level) that a single client, identified by IP address, may make to a single member of the ZooKeeper ensemble. This is used to prevent certain classes of DoS attacks, including file descriptor exhaustion. The default is 60. Setting this to 0 entirely removes the limit on concurrent connections.',
                                value: null,
                                initialValue: 1000,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                                isReadOnly: false,
                                managedBy: 'zookeeper',
                            },
                        ],
                    },
                    serviceActions: [
                        {
                            name: 'upgrade',
                            type: 'ansible',
                            actionManageScripts: [
                                {
                                    changeHandler: 'kafka-broker',
                                    runOnlyOnce: false,
                                    ansibleScriptConfig: {
                                        playbookName: 'middleware/ansible/kafka/kafka-container-manage.yml',
                                        virtualEnv: '',
                                        pythonVersion: '3.10',
                                        isPrepareAnsibleEnvironment: null,
                                        repoUrl: 'https://github.com/eclipse-xpanse/xpanse-samples',
                                        branch: 'main',
                                        requirementsFile: 'requirements.txt',
                                        galaxyFile: '',
                                        ansibleInventoryRequired: false,
                                    },
                                },
                            ],
                            actionParameters: [
                                {
                                    name: 'inter_broker_protocol_version',
                                    kind: 'variable',
                                    dataType: 'string',
                                    example: null,
                                    description:
                                        'controls the protocol version used for communication between Kafka Brokers to ensure that the old and new versions of Brokers can communicate normally during the rolling upgrade process.',
                                    value: null,
                                    initialValue: 3.2,
                                    valueSchema: null,
                                    sensitiveScope: 'none',
                                    modificationImpact: {
                                        isDataLost: true,
                                        isServiceInterrupted: true,
                                    },
                                    isReadOnly: false,
                                    managedBy: 'kafka-broker',
                                },
                            ],
                        },
                        {
                            name: 'backup',
                            type: 'ansible',
                            actionManageScripts: [
                                {
                                    changeHandler: 'zookeeper',
                                    runOnlyOnce: true,
                                    ansibleScriptConfig: {
                                        playbookName: 'middleware/ansible/kafka/kafka-container-manage.yml',
                                        virtualEnv: '',
                                        pythonVersion: '3.10',
                                        isPrepareAnsibleEnvironment: null,
                                        repoUrl: 'https://github.com/eclipse-xpanse/xpanse-samples',
                                        branch: 'main',
                                        requirementsFile: 'requirements.txt',
                                        galaxyFile: '',
                                        ansibleInventoryRequired: false,
                                    },
                                },
                            ],
                            actionParameters: [
                                {
                                    name: 'kafka_cfg_message_max_bytes',
                                    kind: 'variable',
                                    dataType: 'number',
                                    example: null,
                                    description:
                                        'Parameters used to configure the Kafka server or client to set the maximum number of bytes for Kafka messages.',
                                    value: null,
                                    initialValue: 1048576,
                                    valueSchema: null,
                                    sensitiveScope: 'none',
                                    modificationImpact: {
                                        isDataLost: true,
                                        isServiceInterrupted: true,
                                    },
                                    isReadOnly: false,
                                    managedBy: 'kafka-broker',
                                },
                            ],
                        },
                    ],
                    links: [
                        {
                            rel: 'openApi',
                            href: 'http://localhost:8080/xpanse/catalog/services/21597cd5-748e-4f0e-9768-baaa5275b2bd/openapi',
                        },
                    ],
                },
                {
                    serviceTemplateId: 'ef6f0192-8f95-44e6-886b-9bf7d12e2dbc',
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
                    createdTime: '2025-03-26 16:52:25 +08:00',
                    lastModifiedTime: '2025-03-28 15:48:32 +08:00',
                    serviceTemplateRegistrationState: 'cancelled',
                    isReviewInProgress: false,
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
                            href: 'http://localhost:8080/xpanse/catalog/services/ef6f0192-8f95-44e6-886b-9bf7d12e2dbc/openapi',
                        },
                    ],
                },
            ]),
        });
    });
};

export const mockMiddlewareServiceRequestsUnpublishSuccessResponse = async (
    page: Page,
    timeToWaitForResponse: number
) => {
    await page.route(middlewareRequestsUrl, async (route) => {
        await new Promise((resolve) => {
            setTimeout(resolve, timeToWaitForResponse);
        });
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([
                {
                    serviceTemplateId: '21597cd5-748e-4f0e-9768-baaa5275b2bd',
                    requestId: 'a6bae405-4bc7-48ea-8490-03c53aa52723',
                    requestType: 'unpublish',
                    requestStatus: 'accepted',
                    reviewComment: 'auto-approved by CSP',
                    blockTemplateUntilReviewed: false,
                    createdTime: '2025-04-01 14:16:11 +08:00',
                    lastModifiedTime: '2025-04-01 14:16:11 +08:00',
                    requestSubmittedForReview: false,
                },
                {
                    serviceTemplateId: '21597cd5-748e-4f0e-9768-baaa5275b2bd',
                    requestId: '529f885d-448b-40f7-8d36-b65234deb4e2',
                    requestType: 'register',
                    requestStatus: 'accepted',
                    reviewComment: '11121111',
                    blockTemplateUntilReviewed: false,
                    createdTime: '2025-04-01 11:10:06 +08:00',
                    lastModifiedTime: '2025-04-01 11:22:22 +08:00',
                    requestSubmittedForReview: false,
                },
            ]),
        });
    });
};

export const mockMiddlewareServiceTemplatesUnpublishSuccessResponse = async (
    page: Page,
    timeToWaitForResponse: number
) => {
    await page.route(middlewareServiceTemplatesUrl, async (route) => {
        await new Promise((resolve) => {
            setTimeout(resolve, timeToWaitForResponse);
        });
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([
                {
                    serviceTemplateId: '21597cd5-748e-4f0e-9768-baaa5275b2bd',
                    name: 'kafka-cluster',
                    version: '1.0.0',
                    csp: 'HuaweiCloud',
                    category: 'middleware',
                    serviceVendor: 'ISV-A',
                    regions: [
                        {
                            name: 'cn-southwest-2',
                            site: 'Chinese Mainland',
                            area: 'Asia China',
                        },
                        {
                            name: 'cn-north-4',
                            site: 'Chinese Mainland',
                            area: 'Asia China',
                        },
                    ],
                    description: 'This is an enhanced Kafka cluster services by ISV-A.',
                    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAACRAQMAAAAPc4+9AAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAZQTFRF+/v7Hh8gVD0A0wAAAcVJREFUeJzNlc1twzAMhSX44KNH0CgaTd6gK3kUd4McDVTwq/hjiUyaIkV7qNA2/QCFIh+ppxB+svLNEqqBGTC0ANugBOwmCGDCFOAwIWGDOoqoODtN2BdL6wxD9NMTO9tXPa1PqL5M30W5p8lm5vNcF0t7ahSrVguqNqmMokRW4YQucVjBCBWH1Z2g3WDlW2skoYU+2x8JOtGedBF3k2iXMO0j16iUiI6gxzPdQhnU/s2G9pCO57QY2r6hvjPbKJHq7DRTRXT60avtuTRdbrFJI3mSZhNOqYjVbd99YyK1QKWzEqSWrE0k07U60uPaelflMzaaeu1KBuurHSsn572I1KWy2joX5ZBfWbS/VEt50H5P6aL4JxTuyJ/+QCNPX4PWF3Q8Xe1eF9FsLdD2VaOnaP2hWvs+zI58/7i3vH3nRFtDZpyTUNaZkON5XnBNsp8lrmDMrpvBr+b6pUl+4XbkQdndqnzYGzfuJm1JmIWimIbe6dndd/bk7gVce/cJdo3uIeLJl7+I2xTnPek67mjtDeppE7b03Ov+kSfDe3JweW53njxeGfXkaz28VeYd86+af/H8a7hgJKaebILaFzakLfxyfQLTxVB6K1K9KQAAAABJRU5ErkJggg==',
                    deployment: {
                        deployerTool: {
                            kind: 'terraform',
                            version: '=1.6.0',
                        },
                        inputVariables: [
                            {
                                name: 'admin_passwd',
                                kind: 'variable',
                                dataType: 'string',
                                example: null,
                                description:
                                    'The admin password of all nodes in the Kafka cluster instance. If the value is empty, will create a random password.',
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
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                            },
                            {
                                name: 'vpc_name',
                                kind: 'variable',
                                dataType: 'string',
                                example: 'kafka-vpc-default',
                                description:
                                    'The vpc name of all nodes in the Kafka cluster instance. If the value is empty, will use the default value to find or create VPC.',
                                value: 'kafka-vpc-default',
                                mandatory: false,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                autoFill: null,
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                            },
                            {
                                name: 'subnet_name',
                                kind: 'variable',
                                dataType: 'string',
                                example: 'kafka-subnet-default',
                                description:
                                    'The sub network name of all nodes in the Kafka cluster instance. If the value is empty, will use the default value to find or create subnet.',
                                value: 'kafka-subnet-default',
                                mandatory: false,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                autoFill: null,
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                            },
                            {
                                name: 'secgroup_name',
                                kind: 'variable',
                                dataType: 'string',
                                example: 'kafka-secgroup-default',
                                description:
                                    'The security group name of all nodes in the Kafka cluster instance. If the value is empty, will use the default value to find or create security group.',
                                value: 'kafka-secgroup-default',
                                mandatory: false,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                autoFill: null,
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                            },
                        ],
                        outputVariables: [
                            {
                                name: 'admin_passwd',
                                dataType: 'string',
                                description: 'The admin password of the service instance.',
                                sensitiveScope: 'always',
                            },
                            {
                                name: 'zookeeper_server',
                                dataType: 'string',
                                description: 'The server address of zookeeper.',
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
                                'variable "region" {\n  type        = string\n  description = "The region to deploy the Kafka cluster instance."\n}\n\nvariable "availability_zone" {\n  type        = string\n  default     = ""\n  description = "The availability zone to deploy the Kafka cluster instance."\n}\n\nvariable "flavor_id" {\n  type        = string\n  default     = "s6.large.2"\n  description = "The flavor_id of all nodes in the Kafka cluster instance."\n}\n\nvariable "worker_nodes_count" {\n  type        = string\n  default     = 3\n  description = "The worker nodes count in the Kafka cluster instance."\n}\n\nvariable "admin_passwd" {\n  type        = string\n  default     = ""\n  description = "The root password of all nodes in the Kafka cluster instance."\n}\n\nvariable "vpc_name" {\n  type        = string\n  default     = "kafka-vpc-default"\n  description = "The vpc name of all nodes in the Kafka cluster instance."\n}\n\nvariable "subnet_name" {\n  type        = string\n  default     = "kafka-subnet-default"\n  description = "The subnet name of all nodes in the Kafka cluster instance."\n}\n\nvariable "secgroup_name" {\n  type        = string\n  default     = "kafka-secgroup-default"\n  description = "The security group name of all nodes in the Kafka cluster instance."\n}\n',
                            'provider.tf':
                                'terraform {\n  required_providers {\n    huaweicloud = {\n      source  = "huaweicloud/huaweicloud"\n      version = "~> 1.61.0"\n    }\n  }\n}\n\nprovider "huaweicloud" {\n  region = var.region\n}\n',
                            'main.tf':
                                'data "huaweicloud_availability_zones" "osc-az" {}\n\ndata "huaweicloud_vpcs" "existing" {\n  name = var.vpc_name\n}\n\ndata "huaweicloud_vpc_subnets" "existing" {\n  name = var.subnet_name\n}\n\ndata "huaweicloud_networking_secgroups" "existing" {\n  name = var.secgroup_name\n}\n\nlocals {\n  availability_zone = var.availability_zone == "" ? data.huaweicloud_availability_zones.osc-az.names[0] : var.availability_zone\n  admin_passwd      = var.admin_passwd == "" ? random_password.password.result : var.admin_passwd\n  vpc_id            = length(data.huaweicloud_vpcs.existing.vpcs) > 0 ? data.huaweicloud_vpcs.existing.vpcs[0].id : huaweicloud_vpc.new[0].id\n  subnet_id         = length(data.huaweicloud_vpc_subnets.existing.subnets)> 0 ? data.huaweicloud_vpc_subnets.existing.subnets[0].id : huaweicloud_vpc_subnet.new[0].id\n  secgroup_id       = length(data.huaweicloud_networking_secgroups.existing.security_groups) > 0 ? data.huaweicloud_networking_secgroups.existing.security_groups[0].id : huaweicloud_networking_secgroup.new[0].id\n}\n\nresource "huaweicloud_vpc" "new" {\n  count = length(data.huaweicloud_vpcs.existing.vpcs) == 0 ? 1 : 0\n  name  = var.vpc_name\n  cidr  = "192.168.0.0/16"\n}\n\nresource "huaweicloud_vpc_subnet" "new" {\n  count      = length(data.huaweicloud_vpcs.existing.vpcs) == 0 ? 1 : 0\n  vpc_id     = local.vpc_id\n  name       = var.subnet_name\n  cidr       = "192.168.10.0/24"\n  gateway_ip = "192.168.10.1"\n}\n\nresource "huaweicloud_networking_secgroup" "new" {\n  count       = length(data.huaweicloud_networking_secgroups.existing.security_groups) == 0 ? 1 : 0\n  name        = var.secgroup_name\n  description = "Kafka cluster security group"\n}\n\nresource "huaweicloud_networking_secgroup_rule" "secgroup_rule_0" {\n  count             = length(data.huaweicloud_networking_secgroups.existing.security_groups) == 0 ? 1 : 0\n  direction         = "ingress"\n  ethertype         = "IPv4"\n  protocol          = "tcp"\n  port_range_min    = 22\n  port_range_max    = 22\n  remote_ip_prefix  = "121.37.117.211/32"\n  security_group_id = local.secgroup_id\n}\n\nresource "huaweicloud_networking_secgroup_rule" "secgroup_rule_1" {\n  count             = length(data.huaweicloud_networking_secgroups.existing.security_groups) == 0 ? 1 : 0\n  direction         = "ingress"\n  ethertype         = "IPv4"\n  protocol          = "tcp"\n  port_range_min    = 2181\n  port_range_max    = 2181\n  remote_ip_prefix  = "121.37.117.211/32"\n  security_group_id = local.secgroup_id\n}\n\nresource "huaweicloud_networking_secgroup_rule" "secgroup_rule_2" {\n  count             = length(data.huaweicloud_networking_secgroups.existing.security_groups) == 0 ? 1 : 0\n  direction         = "ingress"\n  ethertype         = "IPv4"\n  protocol          = "tcp"\n  port_range_min    = 9092\n  port_range_max    = 9093\n  remote_ip_prefix  = "121.37.117.211/32"\n  security_group_id = local.secgroup_id\n}\n\nresource "random_id" "new" {\n  byte_length = 4\n}\n\nresource "random_password" "password" {\n  length           = 12\n  upper            = true\n  lower            = true\n  numeric          = true\n  special          = true\n  min_special      = 1\n  override_special = "#%@"\n}\n\nresource "huaweicloud_kps_keypair" "keypair" {\n  name     = "keypair-kafka-${random_id.new.hex}"\n  key_file = "keypair-kafka-${random_id.new.hex}.pem"\n}\n\ndata "huaweicloud_images_image" "image" {\n  name                  = "Kafka-v3.3.2_Ubuntu-20.04"\n  most_recent           = true\n  enterprise_project_id = "0"\n}\n\nresource "huaweicloud_compute_instance" "zookeeper" {\n  availability_zone  = local.availability_zone\n  name               = "kafka-zookeeper-${random_id.new.hex}"\n  flavor_id          = var.flavor_id\n  security_group_ids = [ local.secgroup_id ]\n  image_id           = data.huaweicloud_images_image.image.id\n  key_pair           = huaweicloud_kps_keypair.keypair.name\n  network {\n    uuid = local.subnet_id\n  }\n  user_data = <<EOF\n    #!bin/bash\n    echo root:${local.admin_passwd} | sudo chpasswd\n    sudo systemctl start docker\n    sudo systemctl enable docker\n    sudo docker run -d --name zookeeper-server --privileged=true -p 2181:2181 -e ALLOW_ANONYMOUS_LOGIN=yes bitnami/zookeeper:3.8.1\n  EOF\n}\n\nresource "huaweicloud_compute_instance" "kafka-broker" {\n  count              = var.worker_nodes_count\n  availability_zone  = local.availability_zone\n  name               = "kafka-broker-${random_id.new.hex}-${count.index}"\n  flavor_id          = var.flavor_id\n  security_group_ids = [ local.secgroup_id ]\n  image_id           = data.huaweicloud_images_image.image.id\n  key_pair           = huaweicloud_kps_keypair.keypair.name\n  network {\n    uuid = local.subnet_id\n  }\n  user_data = <<EOF\n    #!bin/bash\n    echo root:${local.admin_passwd} | sudo chpasswd\n    sudo systemctl start docker\n    sudo systemctl enable docker\n    private_ip=$(ifconfig | grep -A1 "eth0" | grep \'inet\' | awk -F \' \' \' {print $2}\'|awk \' {print $1}\')\n    sudo docker run -d --name kafka-server --restart always -p 9092:9092 -p 9093:9093  -e KAFKA_BROKER_ID=${count.index}  -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://$private_ip:9092 -e KAFKA_LISTENERS=PLAINTEXT://0.0.0.0:9092 -e ALLOW_PLAINTEXT_LISTENER=yes -e KAFKA_CFG_ZOOKEEPER_CONNECT=${huaweicloud_compute_instance.zookeeper.access_ip_v4}:2181 bitnami/kafka:3.3.2\n  EOF\n  depends_on = [\n    huaweicloud_compute_instance.zookeeper\n  ]\n}\n\noutput "zookeeper_server" {\n  value = "${huaweicloud_compute_instance.zookeeper.access_ip_v4}:2181"\n}\n\noutput "admin_passwd" {\n  value = var.admin_passwd == "" ? nonsensitive(local.admin_passwd) : local.admin_passwd\n}\n',
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
                                'The admin password of all nodes in the Kafka cluster instance. If the value is empty, will create a random password.',
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
                                isDataLost: true,
                                isServiceInterrupted: true,
                            },
                        },
                        {
                            name: 'vpc_name',
                            kind: 'variable',
                            dataType: 'string',
                            example: 'kafka-vpc-default',
                            description:
                                'The vpc name of all nodes in the Kafka cluster instance. If the value is empty, will use the default value to find or create VPC.',
                            value: 'kafka-vpc-default',
                            mandatory: false,
                            valueSchema: null,
                            sensitiveScope: 'none',
                            autoFill: null,
                            modificationImpact: {
                                isDataLost: true,
                                isServiceInterrupted: true,
                            },
                        },
                        {
                            name: 'subnet_name',
                            kind: 'variable',
                            dataType: 'string',
                            example: 'kafka-subnet-default',
                            description:
                                'The sub network name of all nodes in the Kafka cluster instance. If the value is empty, will use the default value to find or create subnet.',
                            value: 'kafka-subnet-default',
                            mandatory: false,
                            valueSchema: null,
                            sensitiveScope: 'none',
                            autoFill: null,
                            modificationImpact: {
                                isDataLost: true,
                                isServiceInterrupted: true,
                            },
                        },
                        {
                            name: 'secgroup_name',
                            kind: 'variable',
                            dataType: 'string',
                            example: 'kafka-secgroup-default',
                            description:
                                'The security group name of all nodes in the Kafka cluster instance. If the value is empty, will use the default value to find or create security group.',
                            value: 'kafka-secgroup-default',
                            mandatory: false,
                            valueSchema: null,
                            sensitiveScope: 'none',
                            autoFill: null,
                            modificationImpact: {
                                isDataLost: true,
                                isServiceInterrupted: true,
                            },
                        },
                    ],
                    outputVariables: [
                        {
                            name: 'admin_passwd',
                            dataType: 'string',
                            description: 'The admin password of the service instance.',
                            sensitiveScope: 'always',
                        },
                        {
                            name: 'zookeeper_server',
                            dataType: 'string',
                            description: 'The server address of zookeeper.',
                            sensitiveScope: 'none',
                        },
                    ],
                    flavors: {
                        serviceFlavors: [
                            {
                                name: '1-zookeeper-with-3-worker-nodes-normal',
                                properties: {
                                    worker_nodes_count: '3',
                                    flavor_id: 's6.large.2',
                                },
                                priority: 1,
                                features: ['High Availability', 'Maximum performance'],
                                pricing: {
                                    fixedPrices: [
                                        {
                                            regionName: 'any',
                                            siteName: 'Chinese Mainland',
                                            price: {
                                                cost: 730,
                                                currency: 'CNY',
                                                period: 'monthly',
                                            },
                                        },
                                    ],
                                    resourceUsage: {
                                        resources: [
                                            {
                                                count: 4,
                                                deployResourceKind: 'vm',
                                                properties: {
                                                    cloud_service_type: 'hws.service.type.ec2',
                                                    resource_type: 'hws.resource.type.vm',
                                                    resource_spec: 's6.large.2.linux',
                                                },
                                            },
                                            {
                                                count: 4,
                                                deployResourceKind: 'volume',
                                                properties: {
                                                    cloud_service_type: 'hws.service.type.ebs',
                                                    resource_type: 'hws.resource.type.volume',
                                                    resource_spec: 'SSD',
                                                    resource_size: '40',
                                                    size_measure_id: '17',
                                                },
                                            },
                                        ],
                                        licensePrices: [
                                            {
                                                regionName: 'any',
                                                siteName: 'Chinese Mainland',
                                                price: {
                                                    cost: 1.9,
                                                    currency: 'CNY',
                                                    period: 'hourly',
                                                },
                                            },
                                        ],
                                        markUpPrices: [
                                            {
                                                regionName: 'any',
                                                siteName: 'Chinese Mainland',
                                                price: {
                                                    cost: 1.9,
                                                    currency: 'CNY',
                                                    period: 'hourly',
                                                },
                                            },
                                        ],
                                    },
                                    isPriceOnlyForManagementLayer: null,
                                },
                            },
                            {
                                name: '1-zookeeper-with-3-worker-nodes-performance',
                                properties: {
                                    worker_nodes_count: '3',
                                    flavor_id: 's6.large.4',
                                },
                                priority: 2,
                                features: ['High Availability', 'Maximum performance'],
                                pricing: {
                                    fixedPrices: [
                                        {
                                            regionName: 'any',
                                            siteName: 'Chinese Mainland',
                                            price: {
                                                cost: 980,
                                                currency: 'CNY',
                                                period: 'monthly',
                                            },
                                        },
                                    ],
                                    resourceUsage: {
                                        resources: [
                                            {
                                                count: 4,
                                                deployResourceKind: 'vm',
                                                properties: {
                                                    cloud_service_type: 'hws.service.type.ec2',
                                                    resource_type: 'hws.resource.type.vm',
                                                    resource_spec: 's6.large.4.linux',
                                                },
                                            },
                                            {
                                                count: 4,
                                                deployResourceKind: 'volume',
                                                properties: {
                                                    cloud_service_type: 'hws.service.type.ebs',
                                                    resource_type: 'hws.resource.type.volume',
                                                    resource_spec: 'SSD',
                                                    resource_size: '40',
                                                    size_measure_id: '17',
                                                },
                                            },
                                        ],
                                        licensePrices: [
                                            {
                                                regionName: 'any',
                                                siteName: 'Chinese Mainland',
                                                price: {
                                                    cost: 1.9,
                                                    currency: 'CNY',
                                                    period: 'hourly',
                                                },
                                            },
                                        ],
                                        markUpPrices: [
                                            {
                                                regionName: 'any',
                                                siteName: 'Chinese Mainland',
                                                price: {
                                                    cost: 1.9,
                                                    currency: 'CNY',
                                                    period: 'hourly',
                                                },
                                            },
                                        ],
                                    },
                                    isPriceOnlyForManagementLayer: null,
                                },
                            },
                        ],
                        modificationImpact: {
                            isDataLost: true,
                            isServiceInterrupted: true,
                        },
                        isDowngradeAllowed: true,
                        downgradeAllowed: true,
                    },
                    billing: {
                        billingModes: ['Fixed', 'Pay per Use'],
                        defaultBillingMode: null,
                    },
                    serviceHostingType: 'self',
                    createdTime: '2025-04-01 11:10:06 +08:00',
                    lastModifiedTime: '2025-04-01 14:16:11 +08:00',
                    serviceTemplateRegistrationState: 'approved',
                    isReviewInProgress: false,
                    isAvailableInCatalog: false,
                    serviceProviderContactDetails: {
                        emails: ['test30@test.com', 'test31@test.com'],
                        phones: ['011-13422222222', '022-13344444444'],
                        chats: ['test1234', 'test1235'],
                        websites: ['https://hw.com', 'https://hwcloud.com'],
                    },
                    eula: null,
                    serviceConfigurationManage: {
                        type: 'ansible',
                        agentVersion: null,
                        configManageScripts: [
                            {
                                changeHandler: 'kafka-broker',
                                runOnlyOnce: false,
                                ansibleScriptConfig: {
                                    playbookName: 'middleware/ansible/kafka/kafka-container-manage.yml',
                                    virtualEnv: '',
                                    pythonVersion: '3.10',
                                    isPrepareAnsibleEnvironment: null,
                                    repoUrl: 'https://github.com/eclipse-xpanse/xpanse-samples',
                                    branch: 'main',
                                    requirementsFile: 'requirements.txt',
                                    galaxyFile: '',
                                    ansibleInventoryRequired: false,
                                },
                            },
                            {
                                changeHandler: 'zookeeper',
                                runOnlyOnce: true,
                                ansibleScriptConfig: {
                                    playbookName: 'middleware/ansible/kafka/kafka-container-manage.yml',
                                    virtualEnv: '',
                                    pythonVersion: '3.10',
                                    isPrepareAnsibleEnvironment: null,
                                    repoUrl: 'https://github.com/eclipse-xpanse/xpanse-samples',
                                    branch: 'main',
                                    requirementsFile: 'requirements.txt',
                                    galaxyFile: '',
                                    ansibleInventoryRequired: false,
                                },
                            },
                        ],
                        configurationParameters: [
                            {
                                name: 'kafka_cfg_message_max_bytes',
                                kind: 'variable',
                                dataType: 'number',
                                example: null,
                                description:
                                    'Parameters used to configure the Kafka server or client to set the maximum number of bytes for Kafka messages.',
                                value: null,
                                initialValue: 1048576,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                                isReadOnly: false,
                                managedBy: 'kafka-broker',
                            },
                            {
                                name: 'kafka_cfg_log_dirs',
                                kind: 'variable',
                                dataType: 'string',
                                example: null,
                                description: 'Parameters for the storage location of Kafka log data',
                                value: null,
                                initialValue: '/var/lib/kafka/logs',
                                valueSchema: null,
                                sensitiveScope: 'none',
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                                isReadOnly: false,
                                managedBy: 'kafka-broker',
                            },
                            {
                                name: 'kafka_cfg_num_io_threads',
                                kind: 'variable',
                                dataType: 'number',
                                example: null,
                                description:
                                    'Parameter used to set the number of I/O threads to handle kafka network requests',
                                value: null,
                                initialValue: 8,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                                isReadOnly: false,
                                managedBy: 'kafka-broker',
                            },
                            {
                                name: 'kafka_log_flush_interval_messages',
                                kind: 'variable',
                                dataType: 'number',
                                example: null,
                                description:
                                    "Kafka's log flush strategy, specifies the parameters that trigger a log flush operation after how many messages are written.",
                                value: null,
                                initialValue: 10000,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                                isReadOnly: false,
                                managedBy: 'kafka-broker',
                            },
                            {
                                name: 'kafka_offsets_topic_replication_factor',
                                kind: 'variable',
                                dataType: 'number',
                                example: null,
                                description:
                                    'Replication factor configuration parameters for the dedicated topic (offsets topic) used in the Kafka cluster to consume offset information for the consumer storage group',
                                value: null,
                                initialValue: 3,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                                isReadOnly: false,
                                managedBy: 'kafka-broker',
                            },
                            {
                                name: 'zookeeper_global_outstanding_limit',
                                kind: 'variable',
                                dataType: 'number',
                                example: null,
                                description:
                                    'Clients can submit requests faster than ZooKeeper can process them, especially if there are a lot of clients.',
                                value: null,
                                initialValue: 1000,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                                isReadOnly: false,
                                managedBy: 'zookeeper',
                            },
                            {
                                name: 'zookeeper_snap_count',
                                kind: 'variable',
                                dataType: 'number',
                                example: null,
                                description:
                                    'Limits the number of concurrent connections (at the socket level) that a single client, identified by IP address, may make to a single member of the ZooKeeper ensemble. This is used to prevent certain classes of DoS attacks, including file descriptor exhaustion. The default is 60. Setting this to 0 entirely removes the limit on concurrent connections.',
                                value: null,
                                initialValue: 1000,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                                isReadOnly: false,
                                managedBy: 'zookeeper',
                            },
                        ],
                    },
                    serviceActions: [
                        {
                            name: 'upgrade',
                            type: 'ansible',
                            actionManageScripts: [
                                {
                                    changeHandler: 'kafka-broker',
                                    runOnlyOnce: false,
                                    ansibleScriptConfig: {
                                        playbookName: 'middleware/ansible/kafka/kafka-container-manage.yml',
                                        virtualEnv: '',
                                        pythonVersion: '3.10',
                                        isPrepareAnsibleEnvironment: null,
                                        repoUrl: 'https://github.com/eclipse-xpanse/xpanse-samples',
                                        branch: 'main',
                                        requirementsFile: 'requirements.txt',
                                        galaxyFile: '',
                                        ansibleInventoryRequired: false,
                                    },
                                },
                            ],
                            actionParameters: [
                                {
                                    name: 'inter_broker_protocol_version',
                                    kind: 'variable',
                                    dataType: 'string',
                                    example: null,
                                    description:
                                        'controls the protocol version used for communication between Kafka Brokers to ensure that the old and new versions of Brokers can communicate normally during the rolling upgrade process.',
                                    value: null,
                                    initialValue: 3.2,
                                    valueSchema: null,
                                    sensitiveScope: 'none',
                                    modificationImpact: {
                                        isDataLost: true,
                                        isServiceInterrupted: true,
                                    },
                                    isReadOnly: false,
                                    managedBy: 'kafka-broker',
                                },
                            ],
                        },
                        {
                            name: 'backup',
                            type: 'ansible',
                            actionManageScripts: [
                                {
                                    changeHandler: 'zookeeper',
                                    runOnlyOnce: true,
                                    ansibleScriptConfig: {
                                        playbookName: 'middleware/ansible/kafka/kafka-container-manage.yml',
                                        virtualEnv: '',
                                        pythonVersion: '3.10',
                                        isPrepareAnsibleEnvironment: null,
                                        repoUrl: 'https://github.com/eclipse-xpanse/xpanse-samples',
                                        branch: 'main',
                                        requirementsFile: 'requirements.txt',
                                        galaxyFile: '',
                                        ansibleInventoryRequired: false,
                                    },
                                },
                            ],
                            actionParameters: [
                                {
                                    name: 'kafka_cfg_message_max_bytes',
                                    kind: 'variable',
                                    dataType: 'number',
                                    example: null,
                                    description:
                                        'Parameters used to configure the Kafka server or client to set the maximum number of bytes for Kafka messages.',
                                    value: null,
                                    initialValue: 1048576,
                                    valueSchema: null,
                                    sensitiveScope: 'none',
                                    modificationImpact: {
                                        isDataLost: true,
                                        isServiceInterrupted: true,
                                    },
                                    isReadOnly: false,
                                    managedBy: 'kafka-broker',
                                },
                            ],
                        },
                    ],
                    links: [
                        {
                            rel: 'openApi',
                            href: 'http://localhost:8080/xpanse/catalog/services/21597cd5-748e-4f0e-9768-baaa5275b2bd/openapi',
                        },
                    ],
                },
            ]),
        });
    });
};

export const mockServiceTemplateUnpublishSuccessResponse = async (page: Page, timeToWaitForResponse: number) => {
    await page.route(serviceTemplateUrl, async (route) => {
        await new Promise((resolve) => {
            setTimeout(resolve, timeToWaitForResponse);
        });
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([
                {
                    serviceTemplateId: '21597cd5-748e-4f0e-9768-baaa5275b2bd',
                    name: 'kafka-cluster',
                    version: '1.0.0',
                    csp: 'HuaweiCloud',
                    category: 'middleware',
                    serviceVendor: 'ISV-A',
                    regions: [
                        {
                            name: 'cn-southwest-2',
                            site: 'Chinese Mainland',
                            area: 'Asia China',
                        },
                        {
                            name: 'cn-north-4',
                            site: 'Chinese Mainland',
                            area: 'Asia China',
                        },
                    ],
                    description: 'This is an enhanced Kafka cluster services by ISV-A.',
                    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAACRAQMAAAAPc4+9AAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAZQTFRF+/v7Hh8gVD0A0wAAAcVJREFUeJzNlc1twzAMhSX44KNH0CgaTd6gK3kUd4McDVTwq/hjiUyaIkV7qNA2/QCFIh+ppxB+svLNEqqBGTC0ANugBOwmCGDCFOAwIWGDOoqoODtN2BdL6wxD9NMTO9tXPa1PqL5M30W5p8lm5vNcF0t7ahSrVguqNqmMokRW4YQucVjBCBWH1Z2g3WDlW2skoYU+2x8JOtGedBF3k2iXMO0j16iUiI6gxzPdQhnU/s2G9pCO57QY2r6hvjPbKJHq7DRTRXT60avtuTRdbrFJI3mSZhNOqYjVbd99YyK1QKWzEqSWrE0k07U60uPaelflMzaaeu1KBuurHSsn572I1KWy2joX5ZBfWbS/VEt50H5P6aL4JxTuyJ/+QCNPX4PWF3Q8Xe1eF9FsLdD2VaOnaP2hWvs+zI58/7i3vH3nRFtDZpyTUNaZkON5XnBNsp8lrmDMrpvBr+b6pUl+4XbkQdndqnzYGzfuJm1JmIWimIbe6dndd/bk7gVce/cJdo3uIeLJl7+I2xTnPek67mjtDeppE7b03Ov+kSfDe3JweW53njxeGfXkaz28VeYd86+af/H8a7hgJKaebILaFzakLfxyfQLTxVB6K1K9KQAAAABJRU5ErkJggg==',
                    deployment: {
                        deployerTool: {
                            kind: 'terraform',
                            version: '=1.6.0',
                        },
                        inputVariables: [
                            {
                                name: 'admin_passwd',
                                kind: 'variable',
                                dataType: 'string',
                                example: null,
                                description:
                                    'The admin password of all nodes in the Kafka cluster instance. If the value is empty, will create a random password.',
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
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                            },
                            {
                                name: 'vpc_name',
                                kind: 'variable',
                                dataType: 'string',
                                example: 'kafka-vpc-default',
                                description:
                                    'The vpc name of all nodes in the Kafka cluster instance. If the value is empty, will use the default value to find or create VPC.',
                                value: 'kafka-vpc-default',
                                mandatory: false,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                autoFill: null,
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                            },
                            {
                                name: 'subnet_name',
                                kind: 'variable',
                                dataType: 'string',
                                example: 'kafka-subnet-default',
                                description:
                                    'The sub network name of all nodes in the Kafka cluster instance. If the value is empty, will use the default value to find or create subnet.',
                                value: 'kafka-subnet-default',
                                mandatory: false,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                autoFill: null,
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                            },
                            {
                                name: 'secgroup_name',
                                kind: 'variable',
                                dataType: 'string',
                                example: 'kafka-secgroup-default',
                                description:
                                    'The security group name of all nodes in the Kafka cluster instance. If the value is empty, will use the default value to find or create security group.',
                                value: 'kafka-secgroup-default',
                                mandatory: false,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                autoFill: null,
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                            },
                        ],
                        outputVariables: [
                            {
                                name: 'admin_passwd',
                                dataType: 'string',
                                description: 'The admin password of the service instance.',
                                sensitiveScope: 'always',
                            },
                            {
                                name: 'zookeeper_server',
                                dataType: 'string',
                                description: 'The server address of zookeeper.',
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
                                'variable "region" {\n  type        = string\n  description = "The region to deploy the Kafka cluster instance."\n}\n\nvariable "availability_zone" {\n  type        = string\n  default     = ""\n  description = "The availability zone to deploy the Kafka cluster instance."\n}\n\nvariable "flavor_id" {\n  type        = string\n  default     = "s6.large.2"\n  description = "The flavor_id of all nodes in the Kafka cluster instance."\n}\n\nvariable "worker_nodes_count" {\n  type        = string\n  default     = 3\n  description = "The worker nodes count in the Kafka cluster instance."\n}\n\nvariable "admin_passwd" {\n  type        = string\n  default     = ""\n  description = "The root password of all nodes in the Kafka cluster instance."\n}\n\nvariable "vpc_name" {\n  type        = string\n  default     = "kafka-vpc-default"\n  description = "The vpc name of all nodes in the Kafka cluster instance."\n}\n\nvariable "subnet_name" {\n  type        = string\n  default     = "kafka-subnet-default"\n  description = "The subnet name of all nodes in the Kafka cluster instance."\n}\n\nvariable "secgroup_name" {\n  type        = string\n  default     = "kafka-secgroup-default"\n  description = "The security group name of all nodes in the Kafka cluster instance."\n}\n',
                            'provider.tf':
                                'terraform {\n  required_providers {\n    huaweicloud = {\n      source  = "huaweicloud/huaweicloud"\n      version = "~> 1.61.0"\n    }\n  }\n}\n\nprovider "huaweicloud" {\n  region = var.region\n}\n',
                            'main.tf':
                                'data "huaweicloud_availability_zones" "osc-az" {}\n\ndata "huaweicloud_vpcs" "existing" {\n  name = var.vpc_name\n}\n\ndata "huaweicloud_vpc_subnets" "existing" {\n  name = var.subnet_name\n}\n\ndata "huaweicloud_networking_secgroups" "existing" {\n  name = var.secgroup_name\n}\n\nlocals {\n  availability_zone = var.availability_zone == "" ? data.huaweicloud_availability_zones.osc-az.names[0] : var.availability_zone\n  admin_passwd      = var.admin_passwd == "" ? random_password.password.result : var.admin_passwd\n  vpc_id            = length(data.huaweicloud_vpcs.existing.vpcs) > 0 ? data.huaweicloud_vpcs.existing.vpcs[0].id : huaweicloud_vpc.new[0].id\n  subnet_id         = length(data.huaweicloud_vpc_subnets.existing.subnets)> 0 ? data.huaweicloud_vpc_subnets.existing.subnets[0].id : huaweicloud_vpc_subnet.new[0].id\n  secgroup_id       = length(data.huaweicloud_networking_secgroups.existing.security_groups) > 0 ? data.huaweicloud_networking_secgroups.existing.security_groups[0].id : huaweicloud_networking_secgroup.new[0].id\n}\n\nresource "huaweicloud_vpc" "new" {\n  count = length(data.huaweicloud_vpcs.existing.vpcs) == 0 ? 1 : 0\n  name  = var.vpc_name\n  cidr  = "192.168.0.0/16"\n}\n\nresource "huaweicloud_vpc_subnet" "new" {\n  count      = length(data.huaweicloud_vpcs.existing.vpcs) == 0 ? 1 : 0\n  vpc_id     = local.vpc_id\n  name       = var.subnet_name\n  cidr       = "192.168.10.0/24"\n  gateway_ip = "192.168.10.1"\n}\n\nresource "huaweicloud_networking_secgroup" "new" {\n  count       = length(data.huaweicloud_networking_secgroups.existing.security_groups) == 0 ? 1 : 0\n  name        = var.secgroup_name\n  description = "Kafka cluster security group"\n}\n\nresource "huaweicloud_networking_secgroup_rule" "secgroup_rule_0" {\n  count             = length(data.huaweicloud_networking_secgroups.existing.security_groups) == 0 ? 1 : 0\n  direction         = "ingress"\n  ethertype         = "IPv4"\n  protocol          = "tcp"\n  port_range_min    = 22\n  port_range_max    = 22\n  remote_ip_prefix  = "121.37.117.211/32"\n  security_group_id = local.secgroup_id\n}\n\nresource "huaweicloud_networking_secgroup_rule" "secgroup_rule_1" {\n  count             = length(data.huaweicloud_networking_secgroups.existing.security_groups) == 0 ? 1 : 0\n  direction         = "ingress"\n  ethertype         = "IPv4"\n  protocol          = "tcp"\n  port_range_min    = 2181\n  port_range_max    = 2181\n  remote_ip_prefix  = "121.37.117.211/32"\n  security_group_id = local.secgroup_id\n}\n\nresource "huaweicloud_networking_secgroup_rule" "secgroup_rule_2" {\n  count             = length(data.huaweicloud_networking_secgroups.existing.security_groups) == 0 ? 1 : 0\n  direction         = "ingress"\n  ethertype         = "IPv4"\n  protocol          = "tcp"\n  port_range_min    = 9092\n  port_range_max    = 9093\n  remote_ip_prefix  = "121.37.117.211/32"\n  security_group_id = local.secgroup_id\n}\n\nresource "random_id" "new" {\n  byte_length = 4\n}\n\nresource "random_password" "password" {\n  length           = 12\n  upper            = true\n  lower            = true\n  numeric          = true\n  special          = true\n  min_special      = 1\n  override_special = "#%@"\n}\n\nresource "huaweicloud_kps_keypair" "keypair" {\n  name     = "keypair-kafka-${random_id.new.hex}"\n  key_file = "keypair-kafka-${random_id.new.hex}.pem"\n}\n\ndata "huaweicloud_images_image" "image" {\n  name                  = "Kafka-v3.3.2_Ubuntu-20.04"\n  most_recent           = true\n  enterprise_project_id = "0"\n}\n\nresource "huaweicloud_compute_instance" "zookeeper" {\n  availability_zone  = local.availability_zone\n  name               = "kafka-zookeeper-${random_id.new.hex}"\n  flavor_id          = var.flavor_id\n  security_group_ids = [ local.secgroup_id ]\n  image_id           = data.huaweicloud_images_image.image.id\n  key_pair           = huaweicloud_kps_keypair.keypair.name\n  network {\n    uuid = local.subnet_id\n  }\n  user_data = <<EOF\n    #!bin/bash\n    echo root:${local.admin_passwd} | sudo chpasswd\n    sudo systemctl start docker\n    sudo systemctl enable docker\n    sudo docker run -d --name zookeeper-server --privileged=true -p 2181:2181 -e ALLOW_ANONYMOUS_LOGIN=yes bitnami/zookeeper:3.8.1\n  EOF\n}\n\nresource "huaweicloud_compute_instance" "kafka-broker" {\n  count              = var.worker_nodes_count\n  availability_zone  = local.availability_zone\n  name               = "kafka-broker-${random_id.new.hex}-${count.index}"\n  flavor_id          = var.flavor_id\n  security_group_ids = [ local.secgroup_id ]\n  image_id           = data.huaweicloud_images_image.image.id\n  key_pair           = huaweicloud_kps_keypair.keypair.name\n  network {\n    uuid = local.subnet_id\n  }\n  user_data = <<EOF\n    #!bin/bash\n    echo root:${local.admin_passwd} | sudo chpasswd\n    sudo systemctl start docker\n    sudo systemctl enable docker\n    private_ip=$(ifconfig | grep -A1 "eth0" | grep \'inet\' | awk -F \' \' \' {print $2}\'|awk \' {print $1}\')\n    sudo docker run -d --name kafka-server --restart always -p 9092:9092 -p 9093:9093  -e KAFKA_BROKER_ID=${count.index}  -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://$private_ip:9092 -e KAFKA_LISTENERS=PLAINTEXT://0.0.0.0:9092 -e ALLOW_PLAINTEXT_LISTENER=yes -e KAFKA_CFG_ZOOKEEPER_CONNECT=${huaweicloud_compute_instance.zookeeper.access_ip_v4}:2181 bitnami/kafka:3.3.2\n  EOF\n  depends_on = [\n    huaweicloud_compute_instance.zookeeper\n  ]\n}\n\noutput "zookeeper_server" {\n  value = "${huaweicloud_compute_instance.zookeeper.access_ip_v4}:2181"\n}\n\noutput "admin_passwd" {\n  value = var.admin_passwd == "" ? nonsensitive(local.admin_passwd) : local.admin_passwd\n}\n',
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
                                'The admin password of all nodes in the Kafka cluster instance. If the value is empty, will create a random password.',
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
                                isDataLost: true,
                                isServiceInterrupted: true,
                            },
                        },
                        {
                            name: 'vpc_name',
                            kind: 'variable',
                            dataType: 'string',
                            example: 'kafka-vpc-default',
                            description:
                                'The vpc name of all nodes in the Kafka cluster instance. If the value is empty, will use the default value to find or create VPC.',
                            value: 'kafka-vpc-default',
                            mandatory: false,
                            valueSchema: null,
                            sensitiveScope: 'none',
                            autoFill: null,
                            modificationImpact: {
                                isDataLost: true,
                                isServiceInterrupted: true,
                            },
                        },
                        {
                            name: 'subnet_name',
                            kind: 'variable',
                            dataType: 'string',
                            example: 'kafka-subnet-default',
                            description:
                                'The sub network name of all nodes in the Kafka cluster instance. If the value is empty, will use the default value to find or create subnet.',
                            value: 'kafka-subnet-default',
                            mandatory: false,
                            valueSchema: null,
                            sensitiveScope: 'none',
                            autoFill: null,
                            modificationImpact: {
                                isDataLost: true,
                                isServiceInterrupted: true,
                            },
                        },
                        {
                            name: 'secgroup_name',
                            kind: 'variable',
                            dataType: 'string',
                            example: 'kafka-secgroup-default',
                            description:
                                'The security group name of all nodes in the Kafka cluster instance. If the value is empty, will use the default value to find or create security group.',
                            value: 'kafka-secgroup-default',
                            mandatory: false,
                            valueSchema: null,
                            sensitiveScope: 'none',
                            autoFill: null,
                            modificationImpact: {
                                isDataLost: true,
                                isServiceInterrupted: true,
                            },
                        },
                    ],
                    outputVariables: [
                        {
                            name: 'admin_passwd',
                            dataType: 'string',
                            description: 'The admin password of the service instance.',
                            sensitiveScope: 'always',
                        },
                        {
                            name: 'zookeeper_server',
                            dataType: 'string',
                            description: 'The server address of zookeeper.',
                            sensitiveScope: 'none',
                        },
                    ],
                    flavors: {
                        serviceFlavors: [
                            {
                                name: '1-zookeeper-with-3-worker-nodes-normal',
                                properties: {
                                    worker_nodes_count: '3',
                                    flavor_id: 's6.large.2',
                                },
                                priority: 1,
                                features: ['High Availability', 'Maximum performance'],
                                pricing: {
                                    fixedPrices: [
                                        {
                                            regionName: 'any',
                                            siteName: 'Chinese Mainland',
                                            price: {
                                                cost: 730,
                                                currency: 'CNY',
                                                period: 'monthly',
                                            },
                                        },
                                    ],
                                    resourceUsage: {
                                        resources: [
                                            {
                                                count: 4,
                                                deployResourceKind: 'vm',
                                                properties: {
                                                    cloud_service_type: 'hws.service.type.ec2',
                                                    resource_type: 'hws.resource.type.vm',
                                                    resource_spec: 's6.large.2.linux',
                                                },
                                            },
                                            {
                                                count: 4,
                                                deployResourceKind: 'volume',
                                                properties: {
                                                    cloud_service_type: 'hws.service.type.ebs',
                                                    resource_type: 'hws.resource.type.volume',
                                                    resource_spec: 'SSD',
                                                    resource_size: '40',
                                                    size_measure_id: '17',
                                                },
                                            },
                                        ],
                                        licensePrices: [
                                            {
                                                regionName: 'any',
                                                siteName: 'Chinese Mainland',
                                                price: {
                                                    cost: 1.9,
                                                    currency: 'CNY',
                                                    period: 'hourly',
                                                },
                                            },
                                        ],
                                        markUpPrices: [
                                            {
                                                regionName: 'any',
                                                siteName: 'Chinese Mainland',
                                                price: {
                                                    cost: 1.9,
                                                    currency: 'CNY',
                                                    period: 'hourly',
                                                },
                                            },
                                        ],
                                    },
                                    isPriceOnlyForManagementLayer: null,
                                },
                            },
                            {
                                name: '1-zookeeper-with-3-worker-nodes-performance',
                                properties: {
                                    worker_nodes_count: '3',
                                    flavor_id: 's6.large.4',
                                },
                                priority: 2,
                                features: ['High Availability', 'Maximum performance'],
                                pricing: {
                                    fixedPrices: [
                                        {
                                            regionName: 'any',
                                            siteName: 'Chinese Mainland',
                                            price: {
                                                cost: 980,
                                                currency: 'CNY',
                                                period: 'monthly',
                                            },
                                        },
                                    ],
                                    resourceUsage: {
                                        resources: [
                                            {
                                                count: 4,
                                                deployResourceKind: 'vm',
                                                properties: {
                                                    cloud_service_type: 'hws.service.type.ec2',
                                                    resource_type: 'hws.resource.type.vm',
                                                    resource_spec: 's6.large.4.linux',
                                                },
                                            },
                                            {
                                                count: 4,
                                                deployResourceKind: 'volume',
                                                properties: {
                                                    cloud_service_type: 'hws.service.type.ebs',
                                                    resource_type: 'hws.resource.type.volume',
                                                    resource_spec: 'SSD',
                                                    resource_size: '40',
                                                    size_measure_id: '17',
                                                },
                                            },
                                        ],
                                        licensePrices: [
                                            {
                                                regionName: 'any',
                                                siteName: 'Chinese Mainland',
                                                price: {
                                                    cost: 1.9,
                                                    currency: 'CNY',
                                                    period: 'hourly',
                                                },
                                            },
                                        ],
                                        markUpPrices: [
                                            {
                                                regionName: 'any',
                                                siteName: 'Chinese Mainland',
                                                price: {
                                                    cost: 1.9,
                                                    currency: 'CNY',
                                                    period: 'hourly',
                                                },
                                            },
                                        ],
                                    },
                                    isPriceOnlyForManagementLayer: null,
                                },
                            },
                        ],
                        modificationImpact: {
                            isDataLost: true,
                            isServiceInterrupted: true,
                        },
                        isDowngradeAllowed: true,
                        downgradeAllowed: true,
                    },
                    billing: {
                        billingModes: ['Fixed', 'Pay per Use'],
                        defaultBillingMode: null,
                    },
                    serviceHostingType: 'self',
                    createdTime: '2025-04-01 11:10:06 +08:00',
                    lastModifiedTime: '2025-04-01 14:16:11 +08:00',
                    serviceTemplateRegistrationState: 'approved',
                    isReviewInProgress: false,
                    isAvailableInCatalog: false,
                    serviceProviderContactDetails: {
                        emails: ['test30@test.com', 'test31@test.com'],
                        phones: ['011-13422222222', '022-13344444444'],
                        chats: ['test1234', 'test1235'],
                        websites: ['https://hw.com', 'https://hwcloud.com'],
                    },
                    eula: null,
                    serviceConfigurationManage: {
                        type: 'ansible',
                        agentVersion: null,
                        configManageScripts: [
                            {
                                changeHandler: 'kafka-broker',
                                runOnlyOnce: false,
                                ansibleScriptConfig: {
                                    playbookName: 'middleware/ansible/kafka/kafka-container-manage.yml',
                                    virtualEnv: '',
                                    pythonVersion: '3.10',
                                    isPrepareAnsibleEnvironment: null,
                                    repoUrl: 'https://github.com/eclipse-xpanse/xpanse-samples',
                                    branch: 'main',
                                    requirementsFile: 'requirements.txt',
                                    galaxyFile: '',
                                    ansibleInventoryRequired: false,
                                },
                            },
                            {
                                changeHandler: 'zookeeper',
                                runOnlyOnce: true,
                                ansibleScriptConfig: {
                                    playbookName: 'middleware/ansible/kafka/kafka-container-manage.yml',
                                    virtualEnv: '',
                                    pythonVersion: '3.10',
                                    isPrepareAnsibleEnvironment: null,
                                    repoUrl: 'https://github.com/eclipse-xpanse/xpanse-samples',
                                    branch: 'main',
                                    requirementsFile: 'requirements.txt',
                                    galaxyFile: '',
                                    ansibleInventoryRequired: false,
                                },
                            },
                        ],
                        configurationParameters: [
                            {
                                name: 'kafka_cfg_message_max_bytes',
                                kind: 'variable',
                                dataType: 'number',
                                example: null,
                                description:
                                    'Parameters used to configure the Kafka server or client to set the maximum number of bytes for Kafka messages.',
                                value: null,
                                initialValue: 1048576,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                                isReadOnly: false,
                                managedBy: 'kafka-broker',
                            },
                            {
                                name: 'kafka_cfg_log_dirs',
                                kind: 'variable',
                                dataType: 'string',
                                example: null,
                                description: 'Parameters for the storage location of Kafka log data',
                                value: null,
                                initialValue: '/var/lib/kafka/logs',
                                valueSchema: null,
                                sensitiveScope: 'none',
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                                isReadOnly: false,
                                managedBy: 'kafka-broker',
                            },
                            {
                                name: 'kafka_cfg_num_io_threads',
                                kind: 'variable',
                                dataType: 'number',
                                example: null,
                                description:
                                    'Parameter used to set the number of I/O threads to handle kafka network requests',
                                value: null,
                                initialValue: 8,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                                isReadOnly: false,
                                managedBy: 'kafka-broker',
                            },
                            {
                                name: 'kafka_log_flush_interval_messages',
                                kind: 'variable',
                                dataType: 'number',
                                example: null,
                                description:
                                    "Kafka's log flush strategy, specifies the parameters that trigger a log flush operation after how many messages are written.",
                                value: null,
                                initialValue: 10000,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                                isReadOnly: false,
                                managedBy: 'kafka-broker',
                            },
                            {
                                name: 'kafka_offsets_topic_replication_factor',
                                kind: 'variable',
                                dataType: 'number',
                                example: null,
                                description:
                                    'Replication factor configuration parameters for the dedicated topic (offsets topic) used in the Kafka cluster to consume offset information for the consumer storage group',
                                value: null,
                                initialValue: 3,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                                isReadOnly: false,
                                managedBy: 'kafka-broker',
                            },
                            {
                                name: 'zookeeper_global_outstanding_limit',
                                kind: 'variable',
                                dataType: 'number',
                                example: null,
                                description:
                                    'Clients can submit requests faster than ZooKeeper can process them, especially if there are a lot of clients.',
                                value: null,
                                initialValue: 1000,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                                isReadOnly: false,
                                managedBy: 'zookeeper',
                            },
                            {
                                name: 'zookeeper_snap_count',
                                kind: 'variable',
                                dataType: 'number',
                                example: null,
                                description:
                                    'Limits the number of concurrent connections (at the socket level) that a single client, identified by IP address, may make to a single member of the ZooKeeper ensemble. This is used to prevent certain classes of DoS attacks, including file descriptor exhaustion. The default is 60. Setting this to 0 entirely removes the limit on concurrent connections.',
                                value: null,
                                initialValue: 1000,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                                isReadOnly: false,
                                managedBy: 'zookeeper',
                            },
                        ],
                    },
                    serviceActions: [
                        {
                            name: 'upgrade',
                            type: 'ansible',
                            actionManageScripts: [
                                {
                                    changeHandler: 'kafka-broker',
                                    runOnlyOnce: false,
                                    ansibleScriptConfig: {
                                        playbookName: 'middleware/ansible/kafka/kafka-container-manage.yml',
                                        virtualEnv: '',
                                        pythonVersion: '3.10',
                                        isPrepareAnsibleEnvironment: null,
                                        repoUrl: 'https://github.com/eclipse-xpanse/xpanse-samples',
                                        branch: 'main',
                                        requirementsFile: 'requirements.txt',
                                        galaxyFile: '',
                                        ansibleInventoryRequired: false,
                                    },
                                },
                            ],
                            actionParameters: [
                                {
                                    name: 'inter_broker_protocol_version',
                                    kind: 'variable',
                                    dataType: 'string',
                                    example: null,
                                    description:
                                        'controls the protocol version used for communication between Kafka Brokers to ensure that the old and new versions of Brokers can communicate normally during the rolling upgrade process.',
                                    value: null,
                                    initialValue: 3.2,
                                    valueSchema: null,
                                    sensitiveScope: 'none',
                                    modificationImpact: {
                                        isDataLost: true,
                                        isServiceInterrupted: true,
                                    },
                                    isReadOnly: false,
                                    managedBy: 'kafka-broker',
                                },
                            ],
                        },
                        {
                            name: 'backup',
                            type: 'ansible',
                            actionManageScripts: [
                                {
                                    changeHandler: 'zookeeper',
                                    runOnlyOnce: true,
                                    ansibleScriptConfig: {
                                        playbookName: 'middleware/ansible/kafka/kafka-container-manage.yml',
                                        virtualEnv: '',
                                        pythonVersion: '3.10',
                                        isPrepareAnsibleEnvironment: null,
                                        repoUrl: 'https://github.com/eclipse-xpanse/xpanse-samples',
                                        branch: 'main',
                                        requirementsFile: 'requirements.txt',
                                        galaxyFile: '',
                                        ansibleInventoryRequired: false,
                                    },
                                },
                            ],
                            actionParameters: [
                                {
                                    name: 'kafka_cfg_message_max_bytes',
                                    kind: 'variable',
                                    dataType: 'number',
                                    example: null,
                                    description:
                                        'Parameters used to configure the Kafka server or client to set the maximum number of bytes for Kafka messages.',
                                    value: null,
                                    initialValue: 1048576,
                                    valueSchema: null,
                                    sensitiveScope: 'none',
                                    modificationImpact: {
                                        isDataLost: true,
                                        isServiceInterrupted: true,
                                    },
                                    isReadOnly: false,
                                    managedBy: 'kafka-broker',
                                },
                            ],
                        },
                    ],
                    links: [
                        {
                            rel: 'openApi',
                            href: 'http://localhost:8080/xpanse/catalog/services/21597cd5-748e-4f0e-9768-baaa5275b2bd/openapi',
                        },
                    ],
                },
                {
                    serviceTemplateId: 'ef6f0192-8f95-44e6-886b-9bf7d12e2dbc',
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
                    createdTime: '2025-03-26 16:52:25 +08:00',
                    lastModifiedTime: '2025-03-28 15:48:32 +08:00',
                    serviceTemplateRegistrationState: 'cancelled',
                    isReviewInProgress: false,
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
                            href: 'http://localhost:8080/xpanse/catalog/services/ef6f0192-8f95-44e6-886b-9bf7d12e2dbc/openapi',
                        },
                    ],
                },
            ]),
        });
    });
};

export const mockRepublishServiceSuccessResponse = async (page: Page, timeToWaitForResponse: number) => {
    await page.route(republishServiceUrl, async (route) => {
        await new Promise((resolve) => {
            setTimeout(resolve, timeToWaitForResponse);
        });
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                serviceTemplateId: '21597cd5-748e-4f0e-9768-baaa5275b2bd',
                requestId: 'ba871537-10b8-4456-a90c-76e4bd8d73b2',
                requestSubmittedForReview: true,
            }),
        });
    });
};

export const mockRepublishServiceFailedResponse = async (page: Page, timeToWaitForResponse: number) => {
    await page.route(republishServiceUrl, async (route) => {
        await new Promise((resolve) => {
            setTimeout(resolve, timeToWaitForResponse);
        });
        await route.fulfill({
            status: 400,
            contentType: 'application/json',
            body: JSON.stringify({
                errorType: 'Republish Request Failed',
                details: ['Service republish failed'],
            }),
        });
    });
};

export const mockMiddlewareServiceTemplatesCancelSuccessResponse = async (
    page: Page,
    timeToWaitForResponse: number
) => {
    await page.route(middlewareServiceTemplatesUrl, async (route) => {
        await new Promise((resolve) => {
            setTimeout(resolve, timeToWaitForResponse);
        });
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([
                {
                    serviceTemplateId: '21597cd5-748e-4f0e-9768-baaa5275b2bd',
                    name: 'kafka-cluster',
                    version: '1.0.0',
                    csp: 'HuaweiCloud',
                    category: 'middleware',
                    serviceVendor: 'ISV-A',
                    regions: [
                        {
                            name: 'cn-southwest-2',
                            site: 'Chinese Mainland',
                            area: 'Asia China',
                        },
                        {
                            name: 'cn-north-4',
                            site: 'Chinese Mainland',
                            area: 'Asia China',
                        },
                    ],
                    description: 'This is an enhanced Kafka cluster services by ISV-A.',
                    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAACRAQMAAAAPc4+9AAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAZQTFRF+/v7Hh8gVD0A0wAAAcVJREFUeJzNlc1twzAMhSX44KNH0CgaTd6gK3kUd4McDVTwq/hjiUyaIkV7qNA2/QCFIh+ppxB+svLNEqqBGTC0ANugBOwmCGDCFOAwIWGDOoqoODtN2BdL6wxD9NMTO9tXPa1PqL5M30W5p8lm5vNcF0t7ahSrVguqNqmMokRW4YQucVjBCBWH1Z2g3WDlW2skoYU+2x8JOtGedBF3k2iXMO0j16iUiI6gxzPdQhnU/s2G9pCO57QY2r6hvjPbKJHq7DRTRXT60avtuTRdbrFJI3mSZhNOqYjVbd99YyK1QKWzEqSWrE0k07U60uPaelflMzaaeu1KBuurHSsn572I1KWy2joX5ZBfWbS/VEt50H5P6aL4JxTuyJ/+QCNPX4PWF3Q8Xe1eF9FsLdD2VaOnaP2hWvs+zI58/7i3vH3nRFtDZpyTUNaZkON5XnBNsp8lrmDMrpvBr+b6pUl+4XbkQdndqnzYGzfuJm1JmIWimIbe6dndd/bk7gVce/cJdo3uIeLJl7+I2xTnPek67mjtDeppE7b03Ov+kSfDe3JweW53njxeGfXkaz28VeYd86+af/H8a7hgJKaebILaFzakLfxyfQLTxVB6K1K9KQAAAABJRU5ErkJggg==',
                    deployment: {
                        deployerTool: {
                            kind: 'terraform',
                            version: '=1.6.0',
                        },
                        inputVariables: [
                            {
                                name: 'admin_passwd',
                                kind: 'variable',
                                dataType: 'string',
                                example: null,
                                description:
                                    'The admin password of all nodes in the Kafka cluster instance. If the value is empty, will create a random password.',
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
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                            },
                            {
                                name: 'vpc_name',
                                kind: 'variable',
                                dataType: 'string',
                                example: 'kafka-vpc-default',
                                description:
                                    'The vpc name of all nodes in the Kafka cluster instance. If the value is empty, will use the default value to find or create VPC.',
                                value: 'kafka-vpc-default',
                                mandatory: false,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                autoFill: null,
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                            },
                            {
                                name: 'subnet_name',
                                kind: 'variable',
                                dataType: 'string',
                                example: 'kafka-subnet-default',
                                description:
                                    'The sub network name of all nodes in the Kafka cluster instance. If the value is empty, will use the default value to find or create subnet.',
                                value: 'kafka-subnet-default',
                                mandatory: false,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                autoFill: null,
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                            },
                            {
                                name: 'secgroup_name',
                                kind: 'variable',
                                dataType: 'string',
                                example: 'kafka-secgroup-default',
                                description:
                                    'The security group name of all nodes in the Kafka cluster instance. If the value is empty, will use the default value to find or create security group.',
                                value: 'kafka-secgroup-default',
                                mandatory: false,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                autoFill: null,
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                            },
                        ],
                        outputVariables: [
                            {
                                name: 'admin_passwd',
                                dataType: 'string',
                                description: 'The admin password of the service instance.',
                                sensitiveScope: 'always',
                            },
                            {
                                name: 'zookeeper_server',
                                dataType: 'string',
                                description: 'The server address of zookeeper.',
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
                                'variable "region" {\n  type        = string\n  description = "The region to deploy the Kafka cluster instance."\n}\n\nvariable "availability_zone" {\n  type        = string\n  default     = ""\n  description = "The availability zone to deploy the Kafka cluster instance."\n}\n\nvariable "flavor_id" {\n  type        = string\n  default     = "s6.large.2"\n  description = "The flavor_id of all nodes in the Kafka cluster instance."\n}\n\nvariable "worker_nodes_count" {\n  type        = string\n  default     = 3\n  description = "The worker nodes count in the Kafka cluster instance."\n}\n\nvariable "admin_passwd" {\n  type        = string\n  default     = ""\n  description = "The root password of all nodes in the Kafka cluster instance."\n}\n\nvariable "vpc_name" {\n  type        = string\n  default     = "kafka-vpc-default"\n  description = "The vpc name of all nodes in the Kafka cluster instance."\n}\n\nvariable "subnet_name" {\n  type        = string\n  default     = "kafka-subnet-default"\n  description = "The subnet name of all nodes in the Kafka cluster instance."\n}\n\nvariable "secgroup_name" {\n  type        = string\n  default     = "kafka-secgroup-default"\n  description = "The security group name of all nodes in the Kafka cluster instance."\n}\n',
                            'provider.tf':
                                'terraform {\n  required_providers {\n    huaweicloud = {\n      source  = "huaweicloud/huaweicloud"\n      version = "~> 1.61.0"\n    }\n  }\n}\n\nprovider "huaweicloud" {\n  region = var.region\n}\n',
                            'main.tf':
                                'data "huaweicloud_availability_zones" "osc-az" {}\n\ndata "huaweicloud_vpcs" "existing" {\n  name = var.vpc_name\n}\n\ndata "huaweicloud_vpc_subnets" "existing" {\n  name = var.subnet_name\n}\n\ndata "huaweicloud_networking_secgroups" "existing" {\n  name = var.secgroup_name\n}\n\nlocals {\n  availability_zone = var.availability_zone == "" ? data.huaweicloud_availability_zones.osc-az.names[0] : var.availability_zone\n  admin_passwd      = var.admin_passwd == "" ? random_password.password.result : var.admin_passwd\n  vpc_id            = length(data.huaweicloud_vpcs.existing.vpcs) > 0 ? data.huaweicloud_vpcs.existing.vpcs[0].id : huaweicloud_vpc.new[0].id\n  subnet_id         = length(data.huaweicloud_vpc_subnets.existing.subnets)> 0 ? data.huaweicloud_vpc_subnets.existing.subnets[0].id : huaweicloud_vpc_subnet.new[0].id\n  secgroup_id       = length(data.huaweicloud_networking_secgroups.existing.security_groups) > 0 ? data.huaweicloud_networking_secgroups.existing.security_groups[0].id : huaweicloud_networking_secgroup.new[0].id\n}\n\nresource "huaweicloud_vpc" "new" {\n  count = length(data.huaweicloud_vpcs.existing.vpcs) == 0 ? 1 : 0\n  name  = var.vpc_name\n  cidr  = "192.168.0.0/16"\n}\n\nresource "huaweicloud_vpc_subnet" "new" {\n  count      = length(data.huaweicloud_vpcs.existing.vpcs) == 0 ? 1 : 0\n  vpc_id     = local.vpc_id\n  name       = var.subnet_name\n  cidr       = "192.168.10.0/24"\n  gateway_ip = "192.168.10.1"\n}\n\nresource "huaweicloud_networking_secgroup" "new" {\n  count       = length(data.huaweicloud_networking_secgroups.existing.security_groups) == 0 ? 1 : 0\n  name        = var.secgroup_name\n  description = "Kafka cluster security group"\n}\n\nresource "huaweicloud_networking_secgroup_rule" "secgroup_rule_0" {\n  count             = length(data.huaweicloud_networking_secgroups.existing.security_groups) == 0 ? 1 : 0\n  direction         = "ingress"\n  ethertype         = "IPv4"\n  protocol          = "tcp"\n  port_range_min    = 22\n  port_range_max    = 22\n  remote_ip_prefix  = "121.37.117.211/32"\n  security_group_id = local.secgroup_id\n}\n\nresource "huaweicloud_networking_secgroup_rule" "secgroup_rule_1" {\n  count             = length(data.huaweicloud_networking_secgroups.existing.security_groups) == 0 ? 1 : 0\n  direction         = "ingress"\n  ethertype         = "IPv4"\n  protocol          = "tcp"\n  port_range_min    = 2181\n  port_range_max    = 2181\n  remote_ip_prefix  = "121.37.117.211/32"\n  security_group_id = local.secgroup_id\n}\n\nresource "huaweicloud_networking_secgroup_rule" "secgroup_rule_2" {\n  count             = length(data.huaweicloud_networking_secgroups.existing.security_groups) == 0 ? 1 : 0\n  direction         = "ingress"\n  ethertype         = "IPv4"\n  protocol          = "tcp"\n  port_range_min    = 9092\n  port_range_max    = 9093\n  remote_ip_prefix  = "121.37.117.211/32"\n  security_group_id = local.secgroup_id\n}\n\nresource "random_id" "new" {\n  byte_length = 4\n}\n\nresource "random_password" "password" {\n  length           = 12\n  upper            = true\n  lower            = true\n  numeric          = true\n  special          = true\n  min_special      = 1\n  override_special = "#%@"\n}\n\nresource "huaweicloud_kps_keypair" "keypair" {\n  name     = "keypair-kafka-${random_id.new.hex}"\n  key_file = "keypair-kafka-${random_id.new.hex}.pem"\n}\n\ndata "huaweicloud_images_image" "image" {\n  name                  = "Kafka-v3.3.2_Ubuntu-20.04"\n  most_recent           = true\n  enterprise_project_id = "0"\n}\n\nresource "huaweicloud_compute_instance" "zookeeper" {\n  availability_zone  = local.availability_zone\n  name               = "kafka-zookeeper-${random_id.new.hex}"\n  flavor_id          = var.flavor_id\n  security_group_ids = [ local.secgroup_id ]\n  image_id           = data.huaweicloud_images_image.image.id\n  key_pair           = huaweicloud_kps_keypair.keypair.name\n  network {\n    uuid = local.subnet_id\n  }\n  user_data = <<EOF\n    #!bin/bash\n    echo root:${local.admin_passwd} | sudo chpasswd\n    sudo systemctl start docker\n    sudo systemctl enable docker\n    sudo docker run -d --name zookeeper-server --privileged=true -p 2181:2181 -e ALLOW_ANONYMOUS_LOGIN=yes bitnami/zookeeper:3.8.1\n  EOF\n}\n\nresource "huaweicloud_compute_instance" "kafka-broker" {\n  count              = var.worker_nodes_count\n  availability_zone  = local.availability_zone\n  name               = "kafka-broker-${random_id.new.hex}-${count.index}"\n  flavor_id          = var.flavor_id\n  security_group_ids = [ local.secgroup_id ]\n  image_id           = data.huaweicloud_images_image.image.id\n  key_pair           = huaweicloud_kps_keypair.keypair.name\n  network {\n    uuid = local.subnet_id\n  }\n  user_data = <<EOF\n    #!bin/bash\n    echo root:${local.admin_passwd} | sudo chpasswd\n    sudo systemctl start docker\n    sudo systemctl enable docker\n    private_ip=$(ifconfig | grep -A1 "eth0" | grep \'inet\' | awk -F \' \' \' {print $2}\'|awk \' {print $1}\')\n    sudo docker run -d --name kafka-server --restart always -p 9092:9092 -p 9093:9093  -e KAFKA_BROKER_ID=${count.index}  -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://$private_ip:9092 -e KAFKA_LISTENERS=PLAINTEXT://0.0.0.0:9092 -e ALLOW_PLAINTEXT_LISTENER=yes -e KAFKA_CFG_ZOOKEEPER_CONNECT=${huaweicloud_compute_instance.zookeeper.access_ip_v4}:2181 bitnami/kafka:3.3.2\n  EOF\n  depends_on = [\n    huaweicloud_compute_instance.zookeeper\n  ]\n}\n\noutput "zookeeper_server" {\n  value = "${huaweicloud_compute_instance.zookeeper.access_ip_v4}:2181"\n}\n\noutput "admin_passwd" {\n  value = var.admin_passwd == "" ? nonsensitive(local.admin_passwd) : local.admin_passwd\n}\n',
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
                                'The admin password of all nodes in the Kafka cluster instance. If the value is empty, will create a random password.',
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
                                isDataLost: true,
                                isServiceInterrupted: true,
                            },
                        },
                        {
                            name: 'vpc_name',
                            kind: 'variable',
                            dataType: 'string',
                            example: 'kafka-vpc-default',
                            description:
                                'The vpc name of all nodes in the Kafka cluster instance. If the value is empty, will use the default value to find or create VPC.',
                            value: 'kafka-vpc-default',
                            mandatory: false,
                            valueSchema: null,
                            sensitiveScope: 'none',
                            autoFill: null,
                            modificationImpact: {
                                isDataLost: true,
                                isServiceInterrupted: true,
                            },
                        },
                        {
                            name: 'subnet_name',
                            kind: 'variable',
                            dataType: 'string',
                            example: 'kafka-subnet-default',
                            description:
                                'The sub network name of all nodes in the Kafka cluster instance. If the value is empty, will use the default value to find or create subnet.',
                            value: 'kafka-subnet-default',
                            mandatory: false,
                            valueSchema: null,
                            sensitiveScope: 'none',
                            autoFill: null,
                            modificationImpact: {
                                isDataLost: true,
                                isServiceInterrupted: true,
                            },
                        },
                        {
                            name: 'secgroup_name',
                            kind: 'variable',
                            dataType: 'string',
                            example: 'kafka-secgroup-default',
                            description:
                                'The security group name of all nodes in the Kafka cluster instance. If the value is empty, will use the default value to find or create security group.',
                            value: 'kafka-secgroup-default',
                            mandatory: false,
                            valueSchema: null,
                            sensitiveScope: 'none',
                            autoFill: null,
                            modificationImpact: {
                                isDataLost: true,
                                isServiceInterrupted: true,
                            },
                        },
                    ],
                    outputVariables: [
                        {
                            name: 'admin_passwd',
                            dataType: 'string',
                            description: 'The admin password of the service instance.',
                            sensitiveScope: 'always',
                        },
                        {
                            name: 'zookeeper_server',
                            dataType: 'string',
                            description: 'The server address of zookeeper.',
                            sensitiveScope: 'none',
                        },
                    ],
                    flavors: {
                        serviceFlavors: [
                            {
                                name: '1-zookeeper-with-3-worker-nodes-normal',
                                properties: {
                                    worker_nodes_count: '3',
                                    flavor_id: 's6.large.2',
                                },
                                priority: 1,
                                features: ['High Availability', 'Maximum performance'],
                                pricing: {
                                    fixedPrices: [
                                        {
                                            regionName: 'any',
                                            siteName: 'Chinese Mainland',
                                            price: {
                                                cost: 730,
                                                currency: 'CNY',
                                                period: 'monthly',
                                            },
                                        },
                                    ],
                                    resourceUsage: {
                                        resources: [
                                            {
                                                count: 4,
                                                deployResourceKind: 'vm',
                                                properties: {
                                                    cloud_service_type: 'hws.service.type.ec2',
                                                    resource_type: 'hws.resource.type.vm',
                                                    resource_spec: 's6.large.2.linux',
                                                },
                                            },
                                            {
                                                count: 4,
                                                deployResourceKind: 'volume',
                                                properties: {
                                                    cloud_service_type: 'hws.service.type.ebs',
                                                    resource_type: 'hws.resource.type.volume',
                                                    resource_spec: 'SSD',
                                                    resource_size: '40',
                                                    size_measure_id: '17',
                                                },
                                            },
                                        ],
                                        licensePrices: [
                                            {
                                                regionName: 'any',
                                                siteName: 'Chinese Mainland',
                                                price: {
                                                    cost: 1.9,
                                                    currency: 'CNY',
                                                    period: 'hourly',
                                                },
                                            },
                                        ],
                                        markUpPrices: [
                                            {
                                                regionName: 'any',
                                                siteName: 'Chinese Mainland',
                                                price: {
                                                    cost: 1.9,
                                                    currency: 'CNY',
                                                    period: 'hourly',
                                                },
                                            },
                                        ],
                                    },
                                    isPriceOnlyForManagementLayer: null,
                                },
                            },
                            {
                                name: '1-zookeeper-with-3-worker-nodes-performance',
                                properties: {
                                    worker_nodes_count: '3',
                                    flavor_id: 's6.large.4',
                                },
                                priority: 2,
                                features: ['High Availability', 'Maximum performance'],
                                pricing: {
                                    fixedPrices: [
                                        {
                                            regionName: 'any',
                                            siteName: 'Chinese Mainland',
                                            price: {
                                                cost: 980,
                                                currency: 'CNY',
                                                period: 'monthly',
                                            },
                                        },
                                    ],
                                    resourceUsage: {
                                        resources: [
                                            {
                                                count: 4,
                                                deployResourceKind: 'vm',
                                                properties: {
                                                    cloud_service_type: 'hws.service.type.ec2',
                                                    resource_type: 'hws.resource.type.vm',
                                                    resource_spec: 's6.large.4.linux',
                                                },
                                            },
                                            {
                                                count: 4,
                                                deployResourceKind: 'volume',
                                                properties: {
                                                    cloud_service_type: 'hws.service.type.ebs',
                                                    resource_type: 'hws.resource.type.volume',
                                                    resource_spec: 'SSD',
                                                    resource_size: '40',
                                                    size_measure_id: '17',
                                                },
                                            },
                                        ],
                                        licensePrices: [
                                            {
                                                regionName: 'any',
                                                siteName: 'Chinese Mainland',
                                                price: {
                                                    cost: 1.9,
                                                    currency: 'CNY',
                                                    period: 'hourly',
                                                },
                                            },
                                        ],
                                        markUpPrices: [
                                            {
                                                regionName: 'any',
                                                siteName: 'Chinese Mainland',
                                                price: {
                                                    cost: 1.9,
                                                    currency: 'CNY',
                                                    period: 'hourly',
                                                },
                                            },
                                        ],
                                    },
                                    isPriceOnlyForManagementLayer: null,
                                },
                            },
                        ],
                        modificationImpact: {
                            isDataLost: true,
                            isServiceInterrupted: true,
                        },
                        isDowngradeAllowed: true,
                        downgradeAllowed: true,
                    },
                    billing: {
                        billingModes: ['Fixed', 'Pay per Use'],
                        defaultBillingMode: null,
                    },
                    serviceHostingType: 'self',
                    createdTime: '2025-04-01 11:10:06 +08:00',
                    lastModifiedTime: '2025-04-01 14:29:45 +08:00',
                    serviceTemplateRegistrationState: 'approved',
                    isReviewInProgress: true,
                    isAvailableInCatalog: false,
                    serviceProviderContactDetails: {
                        emails: ['test30@test.com', 'test31@test.com'],
                        phones: ['011-13422222222', '022-13344444444'],
                        chats: ['test1234', 'test1235'],
                        websites: ['https://hw.com', 'https://hwcloud.com'],
                    },
                    eula: null,
                    serviceConfigurationManage: {
                        type: 'ansible',
                        agentVersion: null,
                        configManageScripts: [
                            {
                                changeHandler: 'kafka-broker',
                                runOnlyOnce: false,
                                ansibleScriptConfig: {
                                    playbookName: 'middleware/ansible/kafka/kafka-container-manage.yml',
                                    virtualEnv: '',
                                    pythonVersion: '3.10',
                                    isPrepareAnsibleEnvironment: null,
                                    repoUrl: 'https://github.com/eclipse-xpanse/xpanse-samples',
                                    branch: 'main',
                                    requirementsFile: 'requirements.txt',
                                    galaxyFile: '',
                                    ansibleInventoryRequired: false,
                                },
                            },
                            {
                                changeHandler: 'zookeeper',
                                runOnlyOnce: true,
                                ansibleScriptConfig: {
                                    playbookName: 'middleware/ansible/kafka/kafka-container-manage.yml',
                                    virtualEnv: '',
                                    pythonVersion: '3.10',
                                    isPrepareAnsibleEnvironment: null,
                                    repoUrl: 'https://github.com/eclipse-xpanse/xpanse-samples',
                                    branch: 'main',
                                    requirementsFile: 'requirements.txt',
                                    galaxyFile: '',
                                    ansibleInventoryRequired: false,
                                },
                            },
                        ],
                        configurationParameters: [
                            {
                                name: 'kafka_cfg_message_max_bytes',
                                kind: 'variable',
                                dataType: 'number',
                                example: null,
                                description:
                                    'Parameters used to configure the Kafka server or client to set the maximum number of bytes for Kafka messages.',
                                value: null,
                                initialValue: 1048576,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                                isReadOnly: false,
                                managedBy: 'kafka-broker',
                            },
                            {
                                name: 'kafka_cfg_log_dirs',
                                kind: 'variable',
                                dataType: 'string',
                                example: null,
                                description: 'Parameters for the storage location of Kafka log data',
                                value: null,
                                initialValue: '/var/lib/kafka/logs',
                                valueSchema: null,
                                sensitiveScope: 'none',
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                                isReadOnly: false,
                                managedBy: 'kafka-broker',
                            },
                            {
                                name: 'kafka_cfg_num_io_threads',
                                kind: 'variable',
                                dataType: 'number',
                                example: null,
                                description:
                                    'Parameter used to set the number of I/O threads to handle kafka network requests',
                                value: null,
                                initialValue: 8,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                                isReadOnly: false,
                                managedBy: 'kafka-broker',
                            },
                            {
                                name: 'kafka_log_flush_interval_messages',
                                kind: 'variable',
                                dataType: 'number',
                                example: null,
                                description:
                                    "Kafka's log flush strategy, specifies the parameters that trigger a log flush operation after how many messages are written.",
                                value: null,
                                initialValue: 10000,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                                isReadOnly: false,
                                managedBy: 'kafka-broker',
                            },
                            {
                                name: 'kafka_offsets_topic_replication_factor',
                                kind: 'variable',
                                dataType: 'number',
                                example: null,
                                description:
                                    'Replication factor configuration parameters for the dedicated topic (offsets topic) used in the Kafka cluster to consume offset information for the consumer storage group',
                                value: null,
                                initialValue: 3,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                                isReadOnly: false,
                                managedBy: 'kafka-broker',
                            },
                            {
                                name: 'zookeeper_global_outstanding_limit',
                                kind: 'variable',
                                dataType: 'number',
                                example: null,
                                description:
                                    'Clients can submit requests faster than ZooKeeper can process them, especially if there are a lot of clients.',
                                value: null,
                                initialValue: 1000,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                                isReadOnly: false,
                                managedBy: 'zookeeper',
                            },
                            {
                                name: 'zookeeper_snap_count',
                                kind: 'variable',
                                dataType: 'number',
                                example: null,
                                description:
                                    'Limits the number of concurrent connections (at the socket level) that a single client, identified by IP address, may make to a single member of the ZooKeeper ensemble. This is used to prevent certain classes of DoS attacks, including file descriptor exhaustion. The default is 60. Setting this to 0 entirely removes the limit on concurrent connections.',
                                value: null,
                                initialValue: 1000,
                                valueSchema: null,
                                sensitiveScope: 'none',
                                modificationImpact: {
                                    isDataLost: true,
                                    isServiceInterrupted: true,
                                },
                                isReadOnly: false,
                                managedBy: 'zookeeper',
                            },
                        ],
                    },
                    serviceActions: [
                        {
                            name: 'upgrade',
                            type: 'ansible',
                            actionManageScripts: [
                                {
                                    changeHandler: 'kafka-broker',
                                    runOnlyOnce: false,
                                    ansibleScriptConfig: {
                                        playbookName: 'middleware/ansible/kafka/kafka-container-manage.yml',
                                        virtualEnv: '',
                                        pythonVersion: '3.10',
                                        isPrepareAnsibleEnvironment: null,
                                        repoUrl: 'https://github.com/eclipse-xpanse/xpanse-samples',
                                        branch: 'main',
                                        requirementsFile: 'requirements.txt',
                                        galaxyFile: '',
                                        ansibleInventoryRequired: false,
                                    },
                                },
                            ],
                            actionParameters: [
                                {
                                    name: 'inter_broker_protocol_version',
                                    kind: 'variable',
                                    dataType: 'string',
                                    example: null,
                                    description:
                                        'controls the protocol version used for communication between Kafka Brokers to ensure that the old and new versions of Brokers can communicate normally during the rolling upgrade process.',
                                    value: null,
                                    initialValue: 3.2,
                                    valueSchema: null,
                                    sensitiveScope: 'none',
                                    modificationImpact: {
                                        isDataLost: true,
                                        isServiceInterrupted: true,
                                    },
                                    isReadOnly: false,
                                    managedBy: 'kafka-broker',
                                },
                            ],
                        },
                        {
                            name: 'backup',
                            type: 'ansible',
                            actionManageScripts: [
                                {
                                    changeHandler: 'zookeeper',
                                    runOnlyOnce: true,
                                    ansibleScriptConfig: {
                                        playbookName: 'middleware/ansible/kafka/kafka-container-manage.yml',
                                        virtualEnv: '',
                                        pythonVersion: '3.10',
                                        isPrepareAnsibleEnvironment: null,
                                        repoUrl: 'https://github.com/eclipse-xpanse/xpanse-samples',
                                        branch: 'main',
                                        requirementsFile: 'requirements.txt',
                                        galaxyFile: '',
                                        ansibleInventoryRequired: false,
                                    },
                                },
                            ],
                            actionParameters: [
                                {
                                    name: 'kafka_cfg_message_max_bytes',
                                    kind: 'variable',
                                    dataType: 'number',
                                    example: null,
                                    description:
                                        'Parameters used to configure the Kafka server or client to set the maximum number of bytes for Kafka messages.',
                                    value: null,
                                    initialValue: 1048576,
                                    valueSchema: null,
                                    sensitiveScope: 'none',
                                    modificationImpact: {
                                        isDataLost: true,
                                        isServiceInterrupted: true,
                                    },
                                    isReadOnly: false,
                                    managedBy: 'kafka-broker',
                                },
                            ],
                        },
                    ],
                    links: [
                        {
                            rel: 'openApi',
                            href: 'http://localhost:8080/xpanse/catalog/services/21597cd5-748e-4f0e-9768-baaa5275b2bd/openapi',
                        },
                    ],
                },
            ]),
        });
    });
};

export const mockMiddlewareServiceRequestsCancelSuccessResponse = async (page: Page, timeToWaitForResponse: number) => {
    await page.route(middlewareRequestsUrl, async (route) => {
        await new Promise((resolve) => {
            setTimeout(resolve, timeToWaitForResponse);
        });
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([
                {
                    serviceTemplateId: '21597cd5-748e-4f0e-9768-baaa5275b2bd',
                    requestId: 'ba871537-10b8-4456-a90c-76e4bd8d73b2',
                    requestType: 'republish',
                    requestStatus: 'in-review',
                    reviewComment: null,
                    blockTemplateUntilReviewed: false,
                    createdTime: '2025-04-01 14:29:45 +08:00',
                    lastModifiedTime: '2025-04-01 14:29:45 +08:00',
                    requestSubmittedForReview: true,
                },
                {
                    serviceTemplateId: '21597cd5-748e-4f0e-9768-baaa5275b2bd',
                    requestId: 'a6bae405-4bc7-48ea-8490-03c53aa52723',
                    requestType: 'unpublish',
                    requestStatus: 'accepted',
                    reviewComment: 'auto-approved by CSP',
                    blockTemplateUntilReviewed: false,
                    createdTime: '2025-04-01 14:16:11 +08:00',
                    lastModifiedTime: '2025-04-01 14:16:11 +08:00',
                    requestSubmittedForReview: false,
                },
                {
                    serviceTemplateId: '21597cd5-748e-4f0e-9768-baaa5275b2bd',
                    requestId: '529f885d-448b-40f7-8d36-b65234deb4e2',
                    requestType: 'register',
                    requestStatus: 'accepted',
                    reviewComment: '11121111',
                    blockTemplateUntilReviewed: false,
                    createdTime: '2025-04-01 11:10:06 +08:00',
                    lastModifiedTime: '2025-04-01 11:22:22 +08:00',
                    requestSubmittedForReview: false,
                },
            ]),
        });
    });
};

export const mockMiddlewareServiceReviewedCancelSuccessResponse = async (page: Page, timeToWaitForResponse: number) => {
    await page.route(middlewareRequestsReviewUrl, async (route) => {
        await new Promise((resolve) => {
            setTimeout(resolve, timeToWaitForResponse);
        });
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([
                {
                    serviceTemplateId: '21597cd5-748e-4f0e-9768-baaa5275b2bd',
                    requestId: 'ba871537-10b8-4456-a90c-76e4bd8d73b2',
                    requestType: 'republish',
                    requestStatus: 'in-review',
                    reviewComment: null,
                    blockTemplateUntilReviewed: false,
                    createdTime: '2025-04-01 14:29:45 +08:00',
                    lastModifiedTime: '2025-04-01 14:29:45 +08:00',
                    requestSubmittedForReview: true,
                },
            ]),
        });
    });
};

export const mockCancelServiceSuccessResponse = async (page: Page, timeToWaitForResponse: number) => {
    await page.route(cancelRequestUrl, async (route) => {
        await new Promise((resolve) => {
            setTimeout(resolve, timeToWaitForResponse);
        });
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({}),
        });
    });
};

export const mockCancelServiceFailedResponse = async (page: Page, timeToWaitForResponse: number) => {
    await page.route(cancelRequestUrl, async (route) => {
        await new Promise((resolve) => {
            setTimeout(resolve, timeToWaitForResponse);
        });
        await route.fulfill({
            status: 400,
            contentType: 'application/json',
            body: JSON.stringify({
                errorType: 'Republish Request Failed',
                details: ['Service republish failed'],
            }),
        });
    });
};

export const mockDeleteServiceSuccessResponse = async (page: Page, timeToWaitForResponse: number) => {
    await page.route(deleteServiceUrl, async (route) => {
        await new Promise((resolve) => {
            setTimeout(resolve, timeToWaitForResponse);
        });
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({}),
        });
    });
};

export const mockDeleteServiceFailedResponse = async (page: Page, timeToWaitForResponse: number) => {
    await page.route(deleteServiceUrl, async (route) => {
        await new Promise((resolve) => {
            setTimeout(resolve, timeToWaitForResponse);
        });
        await route.fulfill({
            status: 400,
            contentType: 'application/json',
            body: JSON.stringify({
                errorType: 'Delete Request Failed',
                details: ['Service delete Failed'],
            }),
        });
    });
};
