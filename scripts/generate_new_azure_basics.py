import re

# We will construct 50 brand new unique non-overlapping questions for Azure Basics (Q1 to Q50)

azure_basics_questions = [
    # --- DOMAIN 1: CLOUD ARCHITECTURE & FOUNDATIONAL CONCEPTS (Q1-Q13) ---
    {
        "code": "AZ-BASICS-Q001",
        "title": "Azure Storage Replication Types (LRS vs ZRS vs GRS)",
        "type": "SINGLE_CHOICE",
        "difficulty": "INTERMEDIATE",
        "points": 1.0,
        "explanation": "Zone-Redundant Storage (ZRS) replicates your data synchronously across three Azure availability zones in the primary region, providing high availability against datacenter outages without requiring cross-region failover.",
        "content": {
            "prompt": "An enterprise requires a storage solution that synchronously replicates data across three separate availability zones within the primary Azure region. Which storage replication strategy should you select?",
            "explanation": "Zone-Redundant Storage (ZRS) replicates your data synchronously across three Azure availability zones in the primary region, providing high availability against datacenter outages without requiring cross-region failover.",
            "options": [
                {"id": "opt-1", "text": "Locally-Redundant Storage (LRS)", "isCorrect": False},
                {"id": "opt-2", "text": "Zone-Redundant Storage (ZRS)", "isCorrect": True},
                {"id": "opt-3", "text": "Geo-Redundant Storage (GRS)", "isCorrect": False},
                {"id": "opt-4", "text": "Read-Access Geo-Redundant Storage (RA-GRS)", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q002",
        "title": "Azure Blob Storage Access Tiers",
        "type": "SINGLE_CHOICE",
        "difficulty": "INTERMEDIATE",
        "points": 1.0,
        "explanation": "The Archive tier offers the lowest storage cost but has higher data retrieval costs and requires several hours of rehydration latency before data can be accessed.",
        "content": {
            "prompt": "Which Azure Blob Storage access tier offers the lowest data storage cost for long-term compliance data that can tolerate several hours of retrieval latency?",
            "explanation": "The Archive tier offers the lowest storage cost but has higher data retrieval costs and requires several hours of rehydration latency before data can be accessed.",
            "options": [
                {"id": "opt-1", "text": "Hot Access Tier", "isCorrect": False},
                {"id": "opt-2", "text": "Cool Access Tier", "isCorrect": False},
                {"id": "opt-3", "text": "Cold Access Tier", "isCorrect": False},
                {"id": "opt-4", "text": "Archive Access Tier", "isCorrect": True}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q003",
        "title": "Azure Bastion RDP/SSH Secure Access",
        "type": "SINGLE_CHOICE",
        "difficulty": "INTERMEDIATE",
        "points": 1.0,
        "explanation": "Azure Bastion provides secure, seamless RDP/SSH connectivity to your virtual machines directly through the Azure portal over TLS/HTTPS (port 443) without exposing public IP addresses on the VMs.",
        "content": {
            "prompt": "You need to enable administrators to securely RDP and SSH into Azure Virtual Machines directly via an HTML5 browser without assigning public IP addresses to the VMs or exposing port 3389/22 to the public internet. Which service should you deploy?",
            "explanation": "Azure Bastion provides secure, seamless RDP/SSH connectivity to your virtual machines directly through the Azure portal over TLS/HTTPS (port 443) without exposing public IP addresses on the VMs.",
            "options": [
                {"id": "opt-1", "text": "Azure Bastion", "isCorrect": True},
                {"id": "opt-2", "text": "Azure VPN Gateway", "isCorrect": False},
                {"id": "opt-3", "text": "Azure ExpressRoute", "isCorrect": False},
                {"id": "opt-4", "text": "Azure Application Gateway", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q004",
        "title": "Network Security Groups (NSG) Rule Evaluation",
        "type": "SINGLE_CHOICE",
        "difficulty": "INTERMEDIATE",
        "points": 1.0,
        "explanation": "NSG rules are processed in priority order from lowest number (100) to highest number (4096). Once a rule matches incoming or outgoing traffic, processing stops.",
        "content": {
            "prompt": "In an Azure Network Security Group (NSG), how are security rules evaluated against network traffic?",
            "explanation": "NSG rules are processed in priority order from lowest number (100) to highest number (4096). Once a rule matches incoming or outgoing traffic, processing stops.",
            "options": [
                {"id": "opt-1", "text": "In numerical order by rule priority, from lowest number (highest priority) to highest number, stopping at the first match.", "isCorrect": True},
                {"id": "opt-2", "text": "In alphabetical order by rule name.", "isCorrect": False},
                {"id": "opt-3", "text": "In reverse order of creation timestamp.", "isCorrect": False},
                {"id": "opt-4", "text": "All rules are evaluated simultaneously and deny rules always override allow rules regardless of priority.", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q005",
        "title": "Azure User Defined Routes (UDR) & Route Tables",
        "type": "SINGLE_CHOICE",
        "difficulty": "INTERMEDIATE",
        "points": 1.0,
        "explanation": "User Defined Routes (UDRs) override Azure's default system routing table to force subnet traffic through a Virtual Network Appliance (NVA) such as a third-party firewall.",
        "content": {
            "prompt": "You need to override Azure default system routes and force all outbound internet traffic from a backend database subnet through a virtual firewall appliance. What Azure component must you create and link to the subnet?",
            "explanation": "User Defined Routes (UDRs) override Azure's default system routing table to force subnet traffic through a Virtual Network Appliance (NVA) such as a third-party firewall.",
            "options": [
                {"id": "opt-1", "text": "Route Table with User Defined Routes (UDR)", "isCorrect": True},
                {"id": "opt-2", "text": "Network Security Group (NSG) Application Security Group link", "isCorrect": False},
                {"id": "opt-3", "text": "Azure NAT Gateway endpoint", "isCorrect": False},
                {"id": "opt-4", "text": "Azure Front Door routing rule", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q006",
        "title": "VPN Gateway vs ExpressRoute Hybrid Connectivity",
        "type": "SINGLE_CHOICE",
        "difficulty": "INTERMEDIATE",
        "points": 1.0,
        "explanation": "ExpressRoute provides a dedicated, private connection to Azure that does not traverse the public internet, offering higher reliability, faster speeds, and lower latency than S2S VPN.",
        "content": {
            "prompt": "An enterprise requires a private, high-speed connection between its on-premises corporate datacenter and Azure that does NOT traverse the public internet. Which connectivity option satisfies this requirement?",
            "explanation": "ExpressRoute provides a dedicated, private connection to Azure that does not traverse the public internet, offering higher reliability, faster speeds, and lower latency than S2S VPN.",
            "options": [
                {"id": "opt-1", "text": "Site-to-Site (S2S) IPSec VPN", "isCorrect": False},
                {"id": "opt-2", "text": "Point-to-Site (P2S) VPN", "isCorrect": False},
                {"id": "opt-3", "text": "Azure ExpressRoute", "isCorrect": True},
                {"id": "opt-4", "text": "Azure Private Link Service", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q007",
        "title": "Azure Key Vault Capabilities",
        "type": "MULTIPLE_CHOICE",
        "difficulty": "INTERMEDIATE",
        "points": 1.0,
        "explanation": "Azure Key Vault manages three primary asset types: Secrets (passwords/API keys), Keys (cryptographic CMK encryption keys), and Certificates (SSL/TLS certs).",
        "content": {
            "prompt": "Which of the following sensitive assets can be securely stored and managed using Azure Key Vault? (Select TWO)",
            "explanation": "Azure Key Vault manages three primary asset types: Secrets (passwords/API keys), Keys (cryptographic CMK encryption keys), and Certificates (SSL/TLS certs).",
            "options": [
                {"id": "opt-1", "text": "Cryptographic Keys used for data encryption at rest (Customer-Managed Keys).", "isCorrect": True},
                {"id": "opt-2", "text": "Application database passwords and API connection secrets.", "isCorrect": True},
                {"id": "opt-3", "text": "Raw Virtual Machine disk VHD image files.", "isCorrect": False},
                {"id": "opt-4", "text": "Uncompiled C# application source code repositories.", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q008",
        "title": "Azure Cost Management & Budgets",
        "type": "SINGLE_CHOICE",
        "difficulty": "INTERMEDIATE",
        "points": 1.0,
        "explanation": "Azure Cost Management Budgets allow you to set spending thresholds and automatically trigger alert notifications via email or Action Groups when spending reaches a specified percentage.",
        "content": {
            "prompt": "How can an Azure subscription administrator prevent unexpected cloud spending by receiving automated notifications when monthly consumption exceeds $5,000?",
            "explanation": "Azure Cost Management Budgets allow you to set spending thresholds and automatically trigger alert notifications via email or Action Groups when spending reaches a specified percentage.",
            "options": [
                {"id": "opt-1", "text": "Configure an Azure Cost Management Budget with threshold alert conditions.", "isCorrect": True},
                {"id": "opt-2", "text": "Apply a ReadOnly Resource Lock to the subscription.", "isCorrect": False},
                {"id": "opt-3", "text": "Create an Azure Policy denying all VM deployments.", "isCorrect": False},
                {"id": "opt-4", "text": "Set up an Azure Advisor recommendation rule.", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q009",
        "title": "Azure Tags & Azure Resource Graph Querying",
        "type": "SINGLE_CHOICE",
        "difficulty": "INTERMEDIATE",
        "points": 1.0,
        "explanation": "Azure Tags consist of key-value pairs assigned to resources. Azure Resource Graph allows querying resources by tag across thousands of subscriptions using KQL.",
        "content": {
            "prompt": "Which Azure governance feature allows organizations to attach custom name-value metadata pairs (such as Environment=Production or CostCenter=1042) to resources for billing organization and search?",
            "explanation": "Azure Tags consist of key-value pairs assigned to resources. Azure Resource Graph allows querying resources by tag across thousands of subscriptions using KQL.",
            "options": [
                {"id": "opt-1", "text": "Azure Resource Tags", "isCorrect": True},
                {"id": "opt-2", "text": "Management Group Rules", "isCorrect": False},
                {"id": "opt-3", "text": "Entra ID Claims", "isCorrect": False},
                {"id": "opt-4", "text": "Network Security Group Labels", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q010",
        "title": "Azure Application Insights Telemetry",
        "type": "SINGLE_CHOICE",
        "difficulty": "INTERMEDIATE", "points": 1.0,
        "explanation": "Application Insights is a feature of Azure Monitor that provides Application Performance Monitoring (APM) to track web app request rates, response times, failure rates, and exceptions.",
        "content": {
            "prompt": "Which service should you implement to perform Application Performance Monitoring (APM) for a web application to diagnose slow HTTP requests, unhandled exceptions, and dependency response times?",
            "explanation": "Application Insights is a feature of Azure Monitor that provides Application Performance Monitoring (APM) to track web app request rates, response times, failure rates, and exceptions.",
            "options": [
                {"id": "opt-1", "text": "Azure Application Insights", "isCorrect": True},
                {"id": "opt-2", "text": "Azure Network Watcher", "isCorrect": False},
                {"id": "opt-3", "text": "Microsoft Defender for Cloud", "isCorrect": False},
                {"id": "opt-4", "text": "Azure Service Health", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q011",
        "title": "Microsoft Defender for Cloud Security Posture",
        "type": "SINGLE_CHOICE",
        "difficulty": "INTERMEDIATE", "points": 1.0,
        "explanation": "Microsoft Defender for Cloud provides Cloud Security Posture Management (CSPM) and calculates a Secure Score to help organizations remediate security vulnerabilities.",
        "content": {
            "prompt": "Which service evaluates your Azure infrastructure against security best practices and generates a unified Secure Score with actionable recommendations to harden resources?",
            "explanation": "Microsoft Defender for Cloud provides Cloud Security Posture Management (CSPM) and calculates a Secure Score to help organizations remediate security vulnerabilities.",
            "options": [
                {"id": "opt-1", "text": "Microsoft Defender for Cloud", "isCorrect": True},
                {"id": "opt-2", "text": "Azure Traffic Manager", "isCorrect": False},
                {"id": "opt-3", "text": "Azure Cost Management", "isCorrect": False},
                {"id": "opt-4", "text": "Azure ExpressRoute Direct", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q012",
        "title": "Azure Advisor Recommendations Categories",
        "type": "MULTIPLE_CHOICE",
        "difficulty": "INTERMEDIATE", "points": 1.0,
        "explanation": "Azure Advisor provides personalized recommendations across 5 pillars: Cost, Security, Reliability (High Availability), Operational Excellence, and Performance.",
        "content": {
            "prompt": "Which key operational pillars are evaluated by Azure Advisor to provide optimization recommendations? (Select TWO)",
            "explanation": "Azure Advisor provides personalized recommendations across 5 pillars: Cost, Security, Reliability (High Availability), Operational Excellence, and Performance.",
            "options": [
                {"id": "opt-1", "text": "Cost Optimization: Identifying underutilized or idle resources to reduce monthly spend.", "isCorrect": True},
                {"id": "opt-2", "text": "Reliability & High Availability: Recommending multi-zone configurations and backup policies.", "isCorrect": True},
                {"id": "opt-3", "text": "Automatic physical replacement of client laptop batteries.", "isCorrect": False},
                {"id": "opt-4", "text": "Guaranteed 100% discount on all third-party software licenses.", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q013",
        "title": "Azure Service Health vs Status Page",
        "type": "SINGLE_CHOICE",
        "difficulty": "INTERMEDIATE", "points": 1.0,
        "explanation": "Azure Service Health provides a personalized view of the health of the specific Azure services and regions your resources are deployed in, including planned maintenance alerts.",
        "content": {
            "prompt": "What is the difference between the public Azure Status page and Azure Service Health?",
            "explanation": "Azure Service Health provides a personalized view of the health of the specific Azure services and regions your resources are deployed in, including planned maintenance alerts.",
            "options": [
                {"id": "opt-1", "text": "Azure Status shows global service availability worldwide, while Azure Service Health provides a personalized dashboard filtered to your specific subscriptions and deployed resources.", "isCorrect": True},
                {"id": "opt-2", "text": "Azure Status requires a paid Enterprise Agreement, while Azure Service Health is only available for free trial accounts.", "isCorrect": False},
                {"id": "opt-3", "text": "Azure Status monitors local client printers, while Azure Service Health monitors Linux VMs.", "isCorrect": False},
                {"id": "opt-4", "text": "There is no difference; both display identical public global RSS feeds.", "isCorrect": False}
            ]
        }
    },

    # --- DOMAIN 2: NETWORKING, STORAGE & PAAS COMPUTE (Q14-Q25) ---
    {
        "code": "AZ-BASICS-Q014",
        "title": "Azure Container Registry (ACR) Features",
        "type": "SINGLE_CHOICE",
        "difficulty": "INTERMEDIATE", "points": 1.0,
        "explanation": "Azure Container Registry (ACR) is a managed, private OCI container registry service based on open-source Docker Registry 2.0 to store and manage private container images.",
        "content": {
            "prompt": "Where should a development team store and manage private OCI/Docker container images securely within their Azure environment?",
            "explanation": "Azure Container Registry (ACR) is a managed, private OCI container registry service based on open-source Docker Registry 2.0 to store and manage private container images.",
            "options": [
                {"id": "opt-1", "text": "Azure Container Registry (ACR)", "isCorrect": True},
                {"id": "opt-2", "text": "Azure Blob Storage public container", "isCorrect": False},
                {"id": "opt-3", "text": "Azure Queue Storage", "isCorrect": False},
                {"id": "opt-4", "text": "Azure Key Vault Secret store", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q015",
        "title": "Azure Kubernetes Service (AKS) Architecture",
        "type": "SINGLE_CHOICE",
        "difficulty": "INTERMEDIATE", "points": 1.0,
        "explanation": "In AKS, Microsoft manages the Kubernetes Control Plane (API server, etcd) at no extra charge, while the customer pays only for the agent worker node VMs that execute container pods.",
        "content": {
            "prompt": "Which statement accurately describes the responsibility split in Azure Kubernetes Service (AKS)?",
            "explanation": "In AKS, Microsoft manages the Kubernetes Control Plane (API server, etcd) at no extra charge, while the customer pays only for the agent worker node VMs that execute container pods.",
            "options": [
                {"id": "opt-1", "text": "Microsoft manages the Kubernetes Control Plane (API server and etcd), while the customer manages and pays for worker node pools.", "isCorrect": True},
                {"id": "opt-2", "text": "The customer must manually patch physical datacenter router firmware for AKS clusters.", "isCorrect": False},
                {"id": "opt-3", "text": "AKS does not support containerized workloads.", "isCorrect": False},
                {"id": "opt-4", "text": "The customer is responsible for maintaining etcd master database hardware.", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q016",
        "title": "Azure Private Endpoints vs Service Endpoints",
        "type": "SINGLE_CHOICE",
        "difficulty": "INTERMEDIATE", "points": 1.0,
        "explanation": "Private Endpoints use a private IP address from your VNet to connect securely to Azure PaaS services via Azure Private Link, eliminating public IP exposure.",
        "content": {
            "prompt": "Which network feature assigns a private IP address from your Virtual Network subnet directly to an Azure PaaS service (such as Azure Storage or SQL Database)?",
            "explanation": "Private Endpoints use a private IP address from your VNet to connect securely to Azure PaaS services via Azure Private Link, eliminating public IP exposure.",
            "options": [
                {"id": "opt-1", "text": "Azure Private Endpoint", "isCorrect": True},
                {"id": "opt-2", "text": "Public IP Address", "isCorrect": False},
                {"id": "opt-3", "text": "ExpressRoute FastPath", "isCorrect": False},
                {"id": "opt-4", "text": "Internet Gateway", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q017",
        "title": "Azure NAT Gateway Outbound Connectivity",
        "type": "SINGLE_CHOICE",
        "difficulty": "INTERMEDIATE", "points": 1.0,
        "explanation": "Azure NAT Gateway provides outbound-only internet connectivity for subnets inside a VNet, ensuring all outbound connections share static public IP addresses while blocking inbound connections.",
        "content": {
            "prompt": "You need to grant virtual machines in a private subnet outbound internet access to download software patches using a static public IP address, while strictly blocking all inbound connections. What service should you use?",
            "explanation": "Azure NAT Gateway provides outbound-only internet connectivity for subnets inside a VNet, ensuring all outbound connections share static public IP addresses while blocking inbound connections.",
            "options": [
                {"id": "opt-1", "text": "Azure NAT Gateway", "isCorrect": True},
                {"id": "opt-2", "text": "Azure Traffic Manager", "isCorrect": False},
                {"id": "opt-3", "text": "Point-to-Site VPN", "isCorrect": False},
                {"id": "opt-4", "text": "Azure Front Door", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q018",
        "title": "Application Gateway vs Azure Load Balancer",
        "type": "SINGLE_CHOICE",
        "difficulty": "INTERMEDIATE", "points": 1.0,
        "explanation": "Application Gateway is a Layer 7 (HTTP/HTTPS) load balancer that supports URL path-based routing and SSL termination, whereas Azure Load Balancer operates at Layer 4 (TCP/UDP).",
        "content": {
            "prompt": "Which Azure load balancing service operates at Layer 7 (Application Layer) and supports URL path-based routing (e.g. routing /images/* to one server pool and /video/* to another)?",
            "explanation": "Application Gateway is a Layer 7 (HTTP/HTTPS) load balancer that supports URL path-based routing and SSL termination, whereas Azure Load Balancer operates at Layer 4 (TCP/UDP).",
            "options": [
                {"id": "opt-1", "text": "Azure Application Gateway", "isCorrect": True},
                {"id": "opt-2", "text": "Azure Basic Load Balancer (Layer 4)", "isCorrect": False},
                {"id": "opt-3", "text": "Azure Traffic Manager (DNS)", "isCorrect": False},
                {"id": "opt-4", "text": "Virtual Network Peering", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q019",
        "title": "Azure Storage SAS Token Types",
        "type": "SINGLE_CHOICE",
        "difficulty": "INTERMEDIATE", "points": 1.0,
        "explanation": "Shared Access Signatures (SAS) grant limited time-bound access to storage resources with specified permissions (read/write) without sharing the account access key.",
        "content": {
            "prompt": "How can you grant a third-party vendor temporary, read-only access to a specific Azure Blob container for 4 hours without revealing your primary Storage Account Access Key?",
            "explanation": "Shared Access Signatures (SAS) grant limited time-bound access to storage resources with specified permissions (read/write) without sharing the account access key.",
            "options": [
                {"id": "opt-1", "text": "Generate a Shared Access Signature (SAS) token with Read permissions and a 4-hour expiration timestamp.", "isCorrect": True},
                {"id": "opt-2", "text": "Send the vendor your primary Storage Account Connection String via email.", "isCorrect": False},
                {"id": "opt-3", "text": "Make the storage account container completely public for 4 hours.", "isCorrect": False},
                {"id": "opt-4", "text": "Create a new Azure Subscription for the vendor.", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q020",
        "title": "App Service Deployment Slots",
        "type": "SINGLE_CHOICE",
        "difficulty": "INTERMEDIATE", "points": 1.0,
        "explanation": "App Service Deployment Slots allow running staging environments with separate URLs. Swapping staging into production ensures zero-downtime deployments.",
        "content": {
            "prompt": "Which feature of Azure App Service enables web application teams to deploy new code into a staging environment and swap it into production with zero downtime?",
            "explanation": "App Service Deployment Slots allow running staging environments with separate URLs. Swapping staging into production ensures zero-downtime deployments.",
            "options": [
                {"id": "opt-1", "text": "Deployment Slots", "isCorrect": True},
                {"id": "opt-2", "text": "Resource Locks", "isCorrect": False},
                {"id": "opt-3", "text": "Scale Sets", "isCorrect": False},
                {"id": "opt-4", "text": "Availability Zones", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q021",
        "title": "Azure SQL Database Elastic Pools",
        "type": "SINGLE_CHOICE",
        "difficulty": "INTERMEDIATE", "points": 1.0,
        "explanation": "Elastic Pools allow multiple Azure SQL databases to share a single set of performance resources (eDTUs or vCores) to manage cost efficiently for unpredictable workloads.",
        "content": {
            "prompt": "A SaaS provider manages 100 individual Azure SQL databases for 100 different customers. Each database has unpredictable usage spikes at different times of day. How can the provider optimize database performance and cost?",
            "explanation": "Elastic Pools allow multiple Azure SQL databases to share a single set of performance resources (eDTUs or vCores) to manage cost efficiently for unpredictable workloads.",
            "options": [
                {"id": "opt-1", "text": "Provision an Azure SQL Elastic Pool to share a common pool of compute/DTU resources among all 100 databases.", "isCorrect": True},
                {"id": "opt-2", "text": "Assign the maximum tier (Business Critical) to every database 24/7.", "isCorrect": False},
                {"id": "opt-3", "text": "Convert all databases into CSV files stored on local USB drives.", "isCorrect": False},
                {"id": "opt-4", "text": "Merge all 100 customer databases into a single unindexed table.", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q022",
        "title": "Azure Dedicated Hosts for Compliance",
        "type": "SINGLE_CHOICE",
        "difficulty": "INTERMEDIATE", "points": 1.0,
        "explanation": "Azure Dedicated Host provides physical servers dedicated to your organization only, satisfying strict physical single-tenant isolation compliance requirements.",
        "content": {
            "prompt": "A financial enterprise requires that physical server hardware hosting its Virtual Machines is completely single-tenant and NOT shared with any other Azure customers. What service satisfies this compliance mandate?",
            "explanation": "Azure Dedicated Host provides physical servers dedicated to your organization only, satisfying strict physical single-tenant isolation compliance requirements.",
            "options": [
                {"id": "opt-1", "text": "Azure Dedicated Host", "isCorrect": True},
                {"id": "opt-2", "text": "Shared General Purpose VM", "isCorrect": False},
                {"id": "opt-3", "text": "App Service Free Tier", "isCorrect": False},
                {"id": "opt-4", "text": "Azure Functions Consumption Plan", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q023",
        "title": "Azure Storage Immutable Storage (WORM)",
        "type": "SINGLE_CHOICE",
        "difficulty": "INTERMEDIATE", "points": 1.0,
        "explanation": "Immutable Blob Storage implements Write Once, Read Many (WORM) policies where data cannot be modified or deleted by any user, including subscription owners, during the retention period.",
        "content": {
            "prompt": "Which Azure Storage feature ensures financial compliance records are stored in a Write Once, Read Many (WORM) state where data cannot be overwritten or deleted by any user for a specified retention interval?",
            "explanation": "Immutable Blob Storage implements Write Once, Read Many (WORM) policies where data cannot be modified or deleted by any user, including subscription owners, during the retention period.",
            "options": [
                {"id": "opt-1", "text": "Azure Immutable Blob Storage with time-based retention policy", "isCorrect": True},
                {"id": "opt-2", "text": "Storage Account Shared Key", "isCorrect": False},
                {"id": "opt-3", "text": "Blob Soft Delete only", "isCorrect": False},
                {"id": "opt-4", "text": "Virtual Network NAT Gateway", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q024",
        "title": "Azure Functions Serverless Triggers",
        "type": "SINGLE_CHOICE",
        "difficulty": "INTERMEDIATE", "points": 1.0,
        "explanation": "Azure Functions is an event-driven serverless compute service that executes code automatically when triggered by events (e.g. Blob upload, Queue message, HTTP request).",
        "content": {
            "prompt": "You need to execute a small Python script to resize images automatically whenever a new image file is uploaded to an Azure Blob Storage container. Which event-driven serverless service should you use?",
            "explanation": "Azure Functions is an event-driven serverless compute service that executes code automatically when triggered by events (e.g. Blob upload, Queue message, HTTP request).",
            "options": [
                {"id": "opt-1", "text": "Azure Functions", "isCorrect": True},
                {"id": "opt-2", "text": "Azure Virtual Machine Scale Sets", "isCorrect": False},
                {"id": "opt-3", "text": "Azure ExpressRoute", "isCorrect": False},
                {"id": "opt-4", "text": "Azure Dedicated Host", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q025",
        "title": "Event Grid vs Event Hubs vs Service Bus",
        "type": "SINGLE_CHOICE",
        "difficulty": "INTERMEDIATE", "points": 1.0,
        "explanation": "Azure Event Hubs is a big data streaming platform capable of ingesting millions of telemetry events per second from IoT devices and logs.",
        "content": {
            "prompt": "An IoT application needs to stream and ingest 2 million telemetry events per second from connected vehicles into Azure for real-time analytics. Which service should you choose?",
            "explanation": "Azure Event Hubs is a big data streaming platform capable of ingesting millions of telemetry events per second from IoT devices and logs.",
            "options": [
                {"id": "opt-1", "text": "Azure Event Hubs", "isCorrect": True},
                {"id": "opt-2", "text": "Azure Service Bus Topics", "isCorrect": False},
                {"id": "opt-3", "text": "Azure Logic Apps", "isCorrect": False},
                {"id": "opt-4", "text": "Azure File Sync", "isCorrect": False}
            ]
        }
    },

    # --- DOMAIN 3: GOVERNANCE, MONITORING & OPERATIONS (Q26-Q37) ---
    {
        "code": "AZ-BASICS-Q026",
        "title": "AzCopy Command-Line Tool Usage",
        "type": "SINGLE_CHOICE",
        "difficulty": "INTERMEDIATE", "points": 1.0,
        "explanation": "AzCopy is a high-performance command-line utility designed for copying data to and from Azure Blob, File, and Table storage with optimized parallel throughput.",
        "content": {
            "prompt": "Which command-line utility provides optimal multi-threaded performance for transferring terabytes of data files into Azure Blob Storage over the network?",
            "explanation": "AzCopy is a high-performance command-line utility designed for copying data to and from Azure Blob, File, and Table storage with optimized parallel throughput.",
            "options": [
                {"id": "opt-1", "text": "AzCopy", "isCorrect": True},
                {"id": "opt-2", "text": "robocopy /mir", "isCorrect": False},
                {"id": "opt-3", "text": "ping -t", "isCorrect": False},
                {"id": "opt-4", "text": "ipconfig /renew", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q027",
        "title": "Azure Migrate Discovery & Assessment",
        "type": "SINGLE_CHOICE",
        "difficulty": "INTERMEDIATE", "points": 1.0,
        "explanation": "Azure Migrate provides a centralized hub to discover, assess, and migrate on-premises VMware, Hyper-V, and physical servers to Azure.",
        "content": {
            "prompt": "An organization plans to migrate 200 physical and VMware servers to Azure. Which service provides an agentless appliance to discover on-premises servers, assess VM readiness, and estimate Azure costs?",
            "explanation": "Azure Migrate provides a centralized hub to discover, assess, and migrate on-premises VMware, Hyper-V, and physical servers to Azure.",
            "options": [
                {"id": "opt-1", "text": "Azure Migrate", "isCorrect": True},
                {"id": "opt-2", "text": "Azure Site Recovery (ASR)", "isCorrect": False},
                {"id": "opt-3", "text": "Azure Traffic Manager", "isCorrect": False},
                {"id": "opt-4", "text": "Azure Application Insights", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q028",
        "title": "Microsoft Sentinel SIEM Connectors",
        "type": "SINGLE_CHOICE",
        "difficulty": "INTERMEDIATE", "points": 1.0,
        "explanation": "Microsoft Sentinel uses built-in Data Connectors (CEF, Syslog, Microsoft 365, AWS) to ingest security logs from multi-cloud and on-premises sources.",
        "content": {
            "prompt": "How does Microsoft Sentinel ingest security events from third-party firewalls, Linux servers, and multi-cloud environments?",
            "explanation": "Microsoft Sentinel uses built-in Data Connectors (CEF, Syslog, Microsoft 365, AWS) to ingest security logs from multi-cloud and on-premises sources.",
            "options": [
                {"id": "opt-1", "text": "Via Data Connectors (such as Syslog, Common Event Format CEF, and API integrations).", "isCorrect": True},
                {"id": "opt-2", "text": "By manually typing logs into Excel spreadsheets daily.", "isCorrect": False},
                {"id": "opt-3", "text": "By printing paper log files and scanning them into PDF files.", "isCorrect": False},
                {"id": "opt-4", "text": "Using Windows Update KB patches only.", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q029",
        "title": "Azure Private DNS Zones Resolution",
        "type": "SINGLE_CHOICE",
        "difficulty": "INTERMEDIATE", "points": 1.0,
        "explanation": "Azure Private DNS Zones provide name resolution for VMs within a VNet and across connected VNets without needing custom DNS server solutions.",
        "content": {
            "prompt": "What component is required to resolve internal custom domain names (such as app.internal.contoso.com) for Virtual Machines inside a Virtual Network without building custom DNS servers?",
            "explanation": "Azure Private DNS Zones provide name resolution for VMs within a VNet and across connected VNets without needing custom DNS server solutions.",
            "options": [
                {"id": "opt-1", "text": "Azure Private DNS Zone linked to the VNet", "isCorrect": True},
                {"id": "opt-2", "text": "Public DNS Registrar record", "isCorrect": False},
                {"id": "opt-3", "text": "Local client hosts file edit on every VM", "isCorrect": False},
                {"id": "opt-4", "text": "Azure ExpressRoute Circuit", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q030",
        "title": "Azure Monitor Action Groups Alerting",
        "type": "SINGLE_CHOICE",
        "difficulty": "INTERMEDIATE", "points": 1.0,
        "explanation": "Azure Monitor Action Groups define the notification preferences and automated actions (Email, SMS, Push, Webhook, Logic App, ITSM) triggered by alerts.",
        "content": {
            "prompt": "When an Azure Monitor alert fires, what component defines the list of receivers and automated actions (such as sending an SMS, triggering a Webhook, or invoking a Logic App)?",
            "explanation": "Azure Monitor Action Groups define the notification preferences and automated actions (Email, SMS, Push, Webhook, Logic App, ITSM) triggered by alerts.",
            "options": [
                {"id": "opt-1", "text": "Action Group", "isCorrect": True},
                {"id": "opt-2", "text": "Management Group", "isCorrect": False},
                {"id": "opt-3", "text": "Resource Group", "isCorrect": False},
                {"id": "opt-4", "text": "Availability Group", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q031",
        "title": "Azure Traffic Manager Routing Methods",
        "type": "SINGLE_CHOICE",
        "difficulty": "INTERMEDIATE", "points": 1.0,
        "explanation": "Azure Traffic Manager is a DNS-based traffic load balancer that uses routing methods such as Performance (lowest latency) to direct client requests to endpoints globally.",
        "content": {
            "prompt": "Which service uses DNS to route incoming user requests to the closest Azure datacenter endpoint based on lowest network latency?",
            "explanation": "Azure Traffic Manager is a DNS-based traffic load balancer that uses routing methods such as Performance (lowest latency) to direct client requests to endpoints globally.",
            "options": [
                {"id": "opt-1", "text": "Azure Traffic Manager with Performance routing method", "isCorrect": True},
                {"id": "opt-2", "text": "Azure Internal Load Balancer", "isCorrect": False},
                {"id": "opt-3", "text": "Azure NAT Gateway", "isCorrect": False},
                {"id": "opt-4", "text": "Azure Network Security Group", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q032",
        "title": "Azure Storage Managed Disks Snapshot vs Image",
        "type": "SINGLE_CHOICE",
        "difficulty": "INTERMEDIATE", "points": 1.0,
        "explanation": "A Snapshot is a read-only point-in-time copy of a single disk. An Image is a generalized capture of both OS and data disks used to deploy new VM instances.",
        "content": {
            "prompt": "What is the difference between an Azure Managed Disk Snapshot and a Managed Image?",
            "explanation": "A Snapshot is a read-only point-in-time copy of a single disk. An Image is a generalized capture of both OS and data disks used to deploy new VM instances.",
            "options": [
                {"id": "opt-1", "text": "A Snapshot is a point-in-time backup copy of a single VHD disk, while an Image is a generalized template used to provision new VMs.", "isCorrect": True},
                {"id": "opt-2", "text": "A Snapshot requires an ExpressRoute connection, while an Image runs in client web browsers.", "isCorrect": False},
                {"id": "opt-3", "text": "Snapshots can only store text files, while Images store MP3 audio.", "isCorrect": False},
                {"id": "opt-4", "text": "There is no difference; both terms are interchangeable.", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q033",
        "title": "Azure Files AD DS SMB Authentication",
        "type": "SINGLE_CHOICE",
        "difficulty": "INTERMEDIATE", "points": 1.0,
        "explanation": "Azure Files supports identity-based authentication over SMB via Active Directory Domain Services (AD DS) or Entra ID Kerberos for hybrid file share access.",
        "content": {
            "prompt": "How can an enterprise migrate on-premises SMB file shares to Azure Files while preserving existing Active Directory (AD DS) user NTFS permission ACLs?",
            "explanation": "Azure Files supports identity-based authentication over SMB via Active Directory Domain Services (AD DS) or Entra ID Kerberos for hybrid file share access.",
            "options": [
                {"id": "opt-1", "text": "Enable Identity-based AD DS authentication for Azure Files SMB shares.", "isCorrect": True},
                {"id": "opt-2", "text": "Convert all file shares into public HTTP websites.", "isCorrect": False},
                {"id": "opt-3", "text": "Disable all user passwords on the local domain.", "isCorrect": False},
                {"id": "opt-4", "text": "Hardcode storage account keys on every user desktop.", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q034",
        "title": "Azure Load Balancer Health Probes",
        "type": "SINGLE_CHOICE",
        "difficulty": "INTERMEDIATE", "points": 1.0,
        "explanation": "Health Probes monitor the status of backend VM instances (via TCP or HTTP/HTTPS responses) to ensure traffic is only routed to healthy nodes.",
        "content": {
            "prompt": "How does Azure Load Balancer detect if a backend Virtual Machine instance has failed and stop sending network traffic to it?",
            "explanation": "Health Probes monitor the status of backend VM instances (via TCP or HTTP/HTTPS responses) to ensure traffic is only routed to healthy nodes.",
            "options": [
                {"id": "opt-1", "text": "By continuously monitoring backend instances using Health Probes (TCP/HTTP/HTTPS).", "isCorrect": True},
                {"id": "opt-2", "text": "By checking client ping responses.", "isCorrect": False},
                {"id": "opt-3", "text": "By asking administrators to manually flag offline VMs in the portal.", "isCorrect": False},
                {"id": "opt-4", "text": "By inspecting Azure billing invoices.", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q035",
        "title": "Azure Container Instances (ACI) Execution",
        "type": "SINGLE_CHOICE",
        "difficulty": "INTERMEDIATE", "points": 1.0,
        "explanation": "Azure Container Instances (ACI) provides the fastest and simplest way to run a single isolated container in Azure without managing virtual machines or cluster orchestrators.",
        "content": {
            "prompt": "Which Azure compute service is best suited for running a single isolated Docker container to completion in seconds without provisioning VMs or managing Kubernetes?",
            "explanation": "Azure Container Instances (ACI) provides the fastest and simplest way to run a single isolated container in Azure without managing virtual machines or cluster orchestrators.",
            "options": [
                {"id": "opt-1", "text": "Azure Container Instances (ACI)", "isCorrect": True},
                {"id": "opt-2", "text": "Azure Kubernetes Service (AKS)", "isCorrect": False},
                {"id": "opt-3", "text": "Azure Virtual Machine Scale Sets", "isCorrect": False},
                {"id": "opt-4", "text": "Azure Dedicated Host", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q036",
        "title": "Azure Firewall Premium Capabilities",
        "type": "SINGLE_CHOICE",
        "difficulty": "INTERMEDIATE", "points": 1.0,
        "explanation": "Azure Firewall Premium features Advanced Threat Protection including TLS Inspection, IDPS (Intrusion Detection and Prevention System), and Web Categories filtering.",
        "content": {
            "prompt": "Which tier of Azure Firewall introduces Intrusion Detection and Prevention System (IDPS) and TLS Inspection to analyze encrypted network traffic for malicious payloads?",
            "explanation": "Azure Firewall Premium features Advanced Threat Protection including TLS Inspection, IDPS (Intrusion Detection and Prevention System), and Web Categories filtering.",
            "options": [
                {"id": "opt-1", "text": "Azure Firewall Premium", "isCorrect": True},
                {"id": "opt-2", "text": "Azure Firewall Standard", "isCorrect": False},
                {"id": "opt-3", "text": "Azure Firewall Basic", "isCorrect": False},
                {"id": "opt-4", "text": "Network Security Group Basic", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q037",
        "title": "Azure Policy Remediation Tasks",
        "type": "SINGLE_CHOICE",
        "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "DeployIfNotExists and Modify Azure Policies use Remediation Tasks to automatically bring existing non-compliant resources into compliance.",
        "content": {
            "prompt": "When an Azure Policy with a DeployIfNotExists effect is assigned, how can an administrator bring pre-existing non-compliant resources into compliance automatically?",
            "explanation": "DeployIfNotExists and Modify Azure Policies use Remediation Tasks to automatically bring existing non-compliant resources into compliance.",
            "options": [
                {"id": "opt-1", "text": "Create and trigger a Policy Remediation Task.", "isCorrect": True},
                {"id": "opt-2", "text": "Manually delete the entire subscription.", "isCorrect": False},
                {"id": "opt-3", "text": "Reboot all local client workstations.", "isCorrect": False},
                {"id": "opt-4", "text": "Apply a ReadOnly Resource Lock.", "isCorrect": False}
            ]
        }
    },

    # --- DOMAIN 4: ADVANCED CLOUD SERVICES & COMPLIANCE (Q38-Q50) ---
    {
        "code": "AZ-BASICS-Q038",
        "title": "Azure Virtual WAN Global Interconnect",
        "type": "SINGLE_CHOICE",
        "difficulty": "INTERMEDIATE", "points": 1.0,
        "explanation": "Azure Virtual WAN brings networking, security, and routing functionalities together to provide a single operational hub-and-spoke interconnect for global branch offices.",
        "content": {
            "prompt": "An enterprise wants to interconnect 50 global branch offices, S2S VPNs, ExpressRoute circuits, and Azure VNets into a single automated networking hub. Which service should they choose?",
            "explanation": "Azure Virtual WAN brings networking, security, and routing functionalities together to provide a single operational hub-and-spoke interconnect for global branch offices.",
            "options": [
                {"id": "opt-1", "text": "Azure Virtual WAN", "isCorrect": True},
                {"id": "opt-2", "text": "Azure Traffic Manager", "isCorrect": False},
                {"id": "opt-3", "text": "Azure DNS Private Resolver", "isCorrect": False},
                {"id": "opt-4", "text": "Azure Content Delivery Network (CDN)", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q039",
        "title": "Azure Front Door WAF Edge Security",
        "type": "SINGLE_CHOICE",
        "difficulty": "INTERMEDIATE", "points": 1.0,
        "explanation": "Azure Front Door integrates Web Application Firewall (WAF) at the global edge to inspect and block SQL injection, cross-site scripting (XSS), and DDoS attacks before reaching web servers.",
        "content": {
            "prompt": "Where are Azure Front Door Web Application Firewall (WAF) rules evaluated to block malicious web attacks (such as SQL injection and XSS)?",
            "explanation": "Azure Front Door integrates Web Application Firewall (WAF) at the global edge to inspect and block SQL injection, cross-site scripting (XSS), and DDoS attacks before reaching web servers.",
            "options": [
                {"id": "opt-1", "text": "At Microsoft global edge PoP locations before traffic reaches your origin backend network.", "isCorrect": True},
                {"id": "opt-2", "text": "Inside the OS of the target Virtual Machine.", "isCorrect": False},
                {"id": "opt-3", "text": "On client web browsers.", "isCorrect": False},
                {"id": "opt-4", "text": "Inside the local SQL database engine.", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q040",
        "title": "Azure Storage SSE 256-bit AES Encryption",
        "type": "SINGLE_CHOICE",
        "difficulty": "INTERMEDIATE", "points": 1.0,
        "explanation": "Azure Storage Service Encryption (SSE) automatically encrypts all data at rest using 256-bit AES encryption before persisting to disk, with zero cost or performance overhead.",
        "content": {
            "prompt": "How does Azure Storage protect data at rest across all storage accounts by default?",
            "explanation": "Azure Storage Service Encryption (SSE) automatically encrypts all data at rest using 256-bit AES encryption before persisting to disk, with zero cost or performance overhead.",
            "options": [
                {"id": "opt-1", "text": "All data written to Azure Storage is automatically encrypted at rest using 256-bit AES encryption.", "isCorrect": True},
                {"id": "opt-2", "text": "Data is stored unencrypted unless a paid third-party tool is purchased.", "isCorrect": False},
                {"id": "opt-3", "text": "Data is encrypted only if the storage account is deleted.", "isCorrect": False},
                {"id": "opt-4", "text": "Encryption is only supported on Linux OS disks.", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q041",
        "title": "Azure Logic Apps Low-Code Integration",
        "type": "SINGLE_CHOICE",
        "difficulty": "INTERMEDIATE", "points": 1.0,
        "explanation": "Azure Logic Apps provides a visual designer to automate workflows and integrate apps, data, services, and systems using over 500 pre-built connectors.",
        "content": {
            "prompt": "Which Azure PaaS service enables developers to build automated workflows visually using a low-code designer with hundreds of pre-built connectors (such as Salesforce, Office 365, and SQL)?",
            "explanation": "Azure Logic Apps provides a visual designer to automate workflows and integrate apps, data, services, and systems using over 500 pre-built connectors.",
            "options": [
                {"id": "opt-1", "text": "Azure Logic Apps", "isCorrect": True},
                {"id": "opt-2", "text": "Azure Virtual Machines", "isCorrect": False},
                {"id": "opt-3", "text": "Azure ExpressRoute", "isCorrect": False},
                {"id": "opt-4", "text": "Azure Bastion", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q042",
        "title": "Azure Confidential Computing Enclaves",
        "type": "SINGLE_CHOICE",
        "difficulty": "INTERMEDIATE", "points": 1.0,
        "explanation": "Azure Confidential Computing protects data in use by performing computations inside hardware-isolated Trusted Execution Environments (TEEs) or enclaves.",
        "content": {
            "prompt": "An organization requires protecting sensitive healthcare data while it is actively being processed in memory (data in use). Which technology achieves memory encryption inside hardware enclaves?",
            "explanation": "Azure Confidential Computing protects data in use by performing computations inside hardware-isolated Trusted Execution Environments (TEEs) or enclaves.",
            "options": [
                {"id": "opt-1", "text": "Azure Confidential Computing with hardware Trusted Execution Environments (TEEs)", "isCorrect": True},
                {"id": "opt-2", "text": "Standard TLS 1.3 transport encryption", "isCorrect": False},
                {"id": "opt-3", "text": "Azure Blob Cool Tier", "isCorrect": False},
                {"id": "opt-4", "text": "Public IP addresses", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q043",
        "title": "Azure Database for PostgreSQL Flexible Server",
        "type": "SINGLE_CHOICE",
        "difficulty": "INTERMEDIATE", "points": 1.0,
        "explanation": "PostgreSQL Flexible Server offers zone-redundant high availability, granular compute scaling, and custom maintenance window controls.",
        "content": {
            "prompt": "Which Azure managed database deployment option for PostgreSQL offers zone-redundant high availability with automatic failover and user-controlled maintenance windows?",
            "explanation": "PostgreSQL Flexible Server offers zone-redundant high availability, granular compute scaling, and custom maintenance window controls.",
            "options": [
                {"id": "opt-1", "text": "Azure Database for PostgreSQL Flexible Server", "isCorrect": True},
                {"id": "opt-2", "text": "Azure SQL Basic Database", "isCorrect": False},
                {"id": "opt-3", "text": "Azure Table Storage", "isCorrect": False},
                {"id": "opt-4", "text": "Azure Cache for Redis Basic", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q044",
        "title": "Azure ExpressRoute FastPath Acceleration",
        "type": "SINGLE_CHOICE",
        "difficulty": "INTERMEDIATE", "points": 1.0,
        "explanation": "ExpressRoute FastPath sends data path packets directly to virtual machines in the VNet, bypassing the virtual network gateway router to improve data transfer performance.",
        "content": {
            "prompt": "How does ExpressRoute FastPath improve data path performance for high-throughput enterprise workloads?",
            "explanation": "ExpressRoute FastPath sends data path packets directly to virtual machines in the VNet, bypassing the virtual network gateway router to improve data transfer performance.",
            "options": [
                {"id": "opt-1", "text": "It bypasses the virtual network gateway router and sends data packets directly to VMs in the VNet.", "isCorrect": True},
                {"id": "opt-2", "text": "It compresses files into ZIP archives automatically.", "isCorrect": False},
                {"id": "opt-3", "text": "It routes traffic through public Wi-Fi hotspots.", "isCorrect": False},
                {"id": "opt-4", "text": "It converts all database queries into static text.", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q045",
        "title": "Azure Resource Graph Query Language (KQL)",
        "type": "SINGLE_CHOICE",
        "difficulty": "INTERMEDIATE", "points": 1.0,
        "explanation": "Azure Resource Graph uses Kusto Query Language (KQL) to query resource properties across thousands of subscriptions in seconds.",
        "content": {
            "prompt": "Which query language is used by Azure Resource Graph and Log Analytics to run high-performance queries across large Azure environments?",
            "explanation": "Azure Resource Graph uses Kusto Query Language (KQL) to query resource properties across thousands of subscriptions in seconds.",
            "options": [
                {"id": "opt-1", "text": "Kusto Query Language (KQL)", "isCorrect": True},
                {"id": "opt-2", "text": "GraphQL", "isCorrect": False},
                {"id": "opt-3", "text": "Transact-SQL (T-SQL)", "isCorrect": False},
                {"id": "opt-4", "text": "PL/SQL", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q046",
        "title": "Azure Automation State Configuration (DSC)",
        "type": "SINGLE_CHOICE",
        "difficulty": "INTERMEDIATE", "points": 1.0,
        "explanation": "Azure Automation State Configuration provides a PowerShell Desired State Configuration (DSC) pull server to maintain consistent OS configuration across Windows and Linux VMs.",
        "content": {
            "prompt": "Which management service provides a PowerShell Desired State Configuration (DSC) pull server to enforce consistent software configurations on Windows and Linux virtual machines?",
            "explanation": "Azure Automation State Configuration provides a PowerShell Desired State Configuration (DSC) pull server to maintain consistent OS configuration across Windows and Linux VMs.",
            "options": [
                {"id": "opt-1", "text": "Azure Automation State Configuration", "isCorrect": True},
                {"id": "opt-2", "text": "Azure ExpressRoute", "isCorrect": False},
                {"id": "opt-3", "text": "Azure Public IP", "isCorrect": False},
                {"id": "opt-4", "text": "Azure Key Vault", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q047",
        "title": "Azure Virtual Desktop Multi-Session Windows 11",
        "type": "SINGLE_CHOICE",
        "difficulty": "INTERMEDIATE", "points": 1.0,
        "explanation": "Azure Virtual Desktop (AVD) exclusive Windows 11/10 Enterprise Multi-session OS allows multiple concurrent users on a single VM to significantly lower licensing and infrastructure costs.",
        "content": {
            "prompt": "Which operating system edition is exclusive to Azure Virtual Desktop (AVD) and enables multiple concurrent interactive user sessions on a single Virtual Machine to optimize costs?",
            "explanation": "Azure Virtual Desktop (AVD) exclusive Windows 11/10 Enterprise Multi-session OS allows multiple concurrent users on a single VM to significantly lower licensing and infrastructure costs.",
            "options": [
                {"id": "opt-1", "text": "Windows 11 / 10 Enterprise Multi-session", "isCorrect": True},
                {"id": "opt-2", "text": "Windows Home Edition", "isCorrect": False},
                {"id": "opt-3", "text": "Windows MS-DOS 6.22", "isCorrect": False},
                {"id": "opt-4", "text": "Ubuntu Desktop 18.04", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q048",
        "title": "Azure Event Grid Reactive Event Routing",
        "type": "SINGLE_CHOICE",
        "difficulty": "INTERMEDIATE", "points": 1.0,
        "explanation": "Azure Event Grid uses a publish-subscribe model to route discrete events (e.g., resource created, blob uploaded) to event handlers instantly with high throughput.",
        "content": {
            "prompt": "Which service acts as a fully managed event routing service using a publish-subscribe model to reactively connect Azure event sources to event handlers (like Azure Functions or Logic Apps)?",
            "explanation": "Azure Event Grid uses a publish-subscribe model to route discrete events (e.g., resource created, blob uploaded) to event handlers instantly with high throughput.",
            "options": [
                {"id": "opt-1", "text": "Azure Event Grid", "isCorrect": True},
                {"id": "opt-2", "text": "Azure ExpressRoute", "isCorrect": False},
                {"id": "opt-3", "text": "Azure Traffic Manager", "isCorrect": False},
                {"id": "opt-4", "text": "Azure VPN Gateway", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q049",
        "title": "Azure DNS Alias Records Apex Resolution",
        "type": "SINGLE_CHOICE",
        "difficulty": "INTERMEDIATE", "points": 1.0,
        "explanation": "Azure DNS Alias Records allow pointing a zone apex domain (e.g., contoso.com) directly to Azure PaaS resources such as Traffic Manager profiles or Front Door endpoints.",
        "content": {
            "prompt": "How can an administrator configure a zone apex root domain (such as contoso.com without 'www') to point directly to an Azure Traffic Manager or Front Door profile?",
            "explanation": "Azure DNS Alias Records allow pointing a zone apex domain (e.g., contoso.com without 'www') to Azure PaaS resources such as Traffic Manager profiles or Front Door endpoints.",
            "options": [
                {"id": "opt-1", "text": "Use an Azure DNS Alias Record", "isCorrect": True},
                {"id": "opt-2", "text": "Create a TXT record with client IP address", "isCorrect": False},
                {"id": "opt-3", "text": "Apply a Resource Lock to the DNS zone", "isCorrect": False},
                {"id": "opt-4", "text": "Use a PTR reverse lookup record", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q050",
        "title": "Azure Storage Private Endpoints vs Service Endpoints",
        "type": "MULTIPLE_CHOICE",
        "difficulty": "INTERMEDIATE", "points": 1.0,
        "explanation": "Service Endpoints secure PaaS endpoints to your VNet over the Azure backbone, while Private Endpoints assign a private IP directly into your subnet via Private Link.",
        "content": {
            "prompt": "Which of the following statements comparing Azure Service Endpoints and Private Endpoints are true? (Select TWO)",
            "explanation": "Service Endpoints secure PaaS endpoints to your VNet over the Azure backbone, while Private Endpoints assign a private IP directly into your subnet via Private Link.",
            "options": [
                {"id": "opt-1", "text": "Service Endpoints keep PaaS public IPs but restrict access to traffic originating from your VNet subnet.", "isCorrect": True},
                {"id": "opt-2", "text": "Private Endpoints project a private IP address directly inside your VNet subnet for private PaaS connectivity.", "isCorrect": True},
                {"id": "opt-3", "text": "Private Endpoints require turning off all firewalls in the world.", "isCorrect": False},
                {"id": "opt-4", "text": "Service Endpoints require physical fiber optic installation on user desks.", "isCorrect": False}
            ]
        }
    }
]

print(f"Constructed {len(azure_basics_questions)} unique questions for Azure Basics (Q1 - Q50).")

# Split into D1 (13), D2 (12), D3 (12), D4 (13)
d1 = azure_basics_questions[0:13]
d2 = azure_basics_questions[13:25]
d3 = azure_basics_questions[25:37]
d4 = azure_basics_questions[37:50]

print(f"Domain 1: {len(d1)} items, Domain 2: {len(d2)} items, Domain 3: {len(d3)} items, Domain 4: {len(d4)} items.")

# Write python script to update backend/prisma/seed.ts
import json
with open("scripts/new_azure_basics_50.json", "w", encoding="utf-8") as f:
    json.dump({"d1": d1, "d2": d2, "d3": d3, "d4": d4}, f, indent=2)

print("Saved new 50 questions to scripts/new_azure_basics_50.json!")
