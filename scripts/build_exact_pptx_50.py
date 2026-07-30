import json

# 50 Authentic Questions STRICTLY & EXCLUSIVELY based on 'Azure basics for T.pptx' (95 Slides)

d1 = [
    {
        "code": "AZ-BASICS-Q001",
        "title": "PPTX Slide 2: Physical vs Logical Architecture",
        "type": "SINGLE_CHOICE",
        "difficulty": "BEGINNER",
        "points": 1.0,
        "explanation": "According to Slide 2 of the Azure Basics presentation, Physical Architecture represents where Azure exists physically (datacenters, land, power), while Logical Architecture represents how Azure resources are organized and managed (districts, maps, addresses).",
        "content": {
            "prompt": "According to Azure architecture fundamentals, which architectural concept describes how Azure resources are organized, grouped, and managed rather than their physical land and hardware locations?",
            "explanation": "According to Slide 2 of the Azure Basics presentation, Physical Architecture represents where Azure exists physically (datacenters, land, power), while Logical Architecture represents how Azure resources are organized and managed (districts, maps, addresses).",
            "options": [
                {"id": "opt-1", "text": "Logical Architecture", "isCorrect": True},
                {"id": "opt-2", "text": "Physical Architecture", "isCorrect": False},
                {"id": "opt-3", "text": "Datacenter Hardware Floor", "isCorrect": False},
                {"id": "opt-4", "text": "Fiber Optic Cabling Layout", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q002",
        "title": "PPTX Slide 3: Azure Physical Datacenters & Access",
        "type": "SINGLE_CHOICE",
        "difficulty": "BEGINNER",
        "points": 1.0,
        "explanation": "As stated in Slide 3, users cannot choose or physically access a specific Azure datacenter directly. Instead, Azure groups datacenters into Regions and Availability Zones.",
        "content": {
            "prompt": "Can an Azure customer select and physically access a specific individual Azure datacenter building to host their application?",
            "explanation": "As stated in Slide 3, users cannot choose or physically access a specific individual Azure datacenter directly. Instead, Azure groups datacenters into Regions and Availability Zones.",
            "options": [
                {"id": "opt-1", "text": "No, customers cannot choose or access a specific datacenter directly; Azure groups them into Regions and Availability Zones.", "isCorrect": True},
                {"id": "opt-2", "text": "Yes, customers can request keycard access to any physical Microsoft datacenter building.", "isCorrect": False},
                {"id": "opt-3", "text": "Yes, but only if they deploy Linux Virtual Machines.", "isCorrect": False},
                {"id": "opt-4", "text": "Only if they purchase a physical server rack from Microsoft.", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q003",
        "title": "PPTX Slides 4-5: Azure Geographies & Data Residency",
        "type": "SINGLE_CHOICE",
        "difficulty": "BEGINNER",
        "points": 1.0,
        "explanation": "Slides 4 and 5 explain that an Azure Geography is a large boundary containing one or more Azure Regions, created to satisfy data residency and legal compliance requirements.",
        "content": {
            "prompt": "What is the primary compliance reason for creating Azure Geographies (such as the India Geography or Europe Geography)?",
            "explanation": "Slides 4 and 5 explain that an Azure Geography is a large boundary containing one or more Azure Regions, created to satisfy data residency and legal compliance requirements.",
            "options": [
                {"id": "opt-1", "text": "Data Residency (ensuring customer data stays within a specific country or geographic legal boundary).", "isCorrect": True},
                {"id": "opt-2", "text": "To increase internet downloading speeds on home Wi-Fi.", "isCorrect": False},
                {"id": "opt-3", "text": "To eliminate the need for Azure Active Directory passwords.", "isCorrect": False},
                {"id": "opt-4", "text": "To grant free cloud credits to all commercial users.", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q004",
        "title": "PPTX Slide 7-11: Azure Region Definition",
        "type": "SINGLE_CHOICE",
        "difficulty": "BEGINNER",
        "points": 1.0,
        "explanation": "Slides 7-11 define an Azure Region as a set of datacenters deployed within a latency-defined perimeter and connected through a dedicated regional low-latency network.",
        "content": {
            "prompt": "What is an Azure Region as defined in the Azure Basics architecture overview?",
            "explanation": "Slides 7-11 define an Azure Region as a set of datacenters deployed within a latency-defined perimeter and connected through a dedicated regional low-latency network.",
            "options": [
                {"id": "opt-1", "text": "A set of datacenters deployed within a latency-defined perimeter, connected through a dedicated low-latency network.", "isCorrect": True},
                {"id": "opt-2", "text": "A single server rack inside an office server room.", "isCorrect": False},
                {"id": "opt-3", "text": "A software folder used to store user passwords.", "isCorrect": False},
                {"id": "opt-4", "text": "A global billing domain for corporate accounts.", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q005",
        "title": "PPTX Slides 12-15: Azure Availability Zones",
        "type": "SINGLE_CHOICE",
        "difficulty": "BEGINNER",
        "points": 1.0,
        "explanation": "Slides 12-15 explain that Availability Zones are physically separate datacenter locations within an Azure region, each equipped with independent power, cooling, and networking.",
        "content": {
            "prompt": "What physical isolation guarantees do Azure Availability Zones provide inside an Azure region?",
            "explanation": "Slides 12-15 explain that Availability Zones are physically separate datacenter locations within an Azure region, each equipped with independent power, cooling, and networking.",
            "options": [
                {"id": "opt-1", "text": "Physically separate datacenters with independent power, cooling, and networking infrastructure.", "isCorrect": True},
                {"id": "opt-2", "text": "Shared power supplies and shared cooling fans inside a single room.", "isCorrect": False},
                {"id": "opt-3", "text": "Logical user groups inside Microsoft Office 365.", "isCorrect": False},
                {"id": "opt-4", "text": "Virtual networks connected over satellite dish connections.", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q006",
        "title": "PPTX Slide 16: Fault Domains (FD) Definition",
        "type": "SINGLE_CHOICE",
        "difficulty": "BEGINNER",
        "points": 1.0,
        "explanation": "Slide 16 defines a Fault Domain (FD) as a physical rack of servers that shares a single common power source and network switch inside a datacenter.",
        "content": {
            "prompt": "In Azure Availability Sets, what is a Fault Domain (FD)?",
            "explanation": "Slide 16 defines a Fault Domain (FD) as a physical rack of servers that shares a single common power source and network switch inside a datacenter.",
            "options": [
                {"id": "opt-1", "text": "A physical server rack sharing a single common power supply and network switch.", "isCorrect": True},
                {"id": "opt-2", "text": "A group of Virtual Machines rebooted at the exact same time during planned OS updates.", "isCorrect": False},
                {"id": "opt-3", "text": "A billing subscription tier for small businesses.", "isCorrect": False},
                {"id": "opt-4", "text": "A regional fiber optic undersea cable.", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q007",
        "title": "PPTX Slide 16: Update Domains (UD) Definition",
        "type": "SINGLE_CHOICE",
        "difficulty": "BEGINNER",
        "points": 1.0,
        "explanation": "Slide 16 defines Update Domains (UD) as logical groups of VMs that can be rebooted sequentially during planned Microsoft host platform maintenance.",
        "content": {
            "prompt": "What is the purpose of Update Domains (UD) in Azure Availability Sets?",
            "explanation": "Slide 16 defines Update Domains (UD) as logical groups of VMs that can be rebooted sequentially during planned Microsoft host platform maintenance.",
            "options": [
                {"id": "opt-1", "text": "To ensure VMs are rebooted sequentially (one UD at a time) during planned host updates so remaining VMs service traffic.", "isCorrect": True},
                {"id": "opt-2", "text": "To reboot all servers in the datacenter simultaneously.", "isCorrect": False},
                {"id": "opt-3", "text": "To store encrypted database password keys.", "isCorrect": False},
                {"id": "opt-4", "text": "To manage physical datacenter security guards.", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q008",
        "title": "PPTX Slide 19-22: Azure Tenant Concept",
        "type": "SINGLE_CHOICE",
        "difficulty": "BEGINNER",
        "points": 1.0,
        "explanation": "Slides 19-22 explain that a Tenant represents a single organization's dedicated identity instance in Microsoft Entra ID (Azure AD), serving as the top identity boundary.",
        "content": {
            "prompt": "According to the Azure logical hierarchy (Tenant -> Management Group -> Subscription -> Resource Group), what is an Azure Tenant?",
            "explanation": "Slides 19-22 explain that a Tenant represents a single organization's dedicated identity instance in Microsoft Entra ID (Azure AD), serving as the top identity boundary.",
            "options": [
                {"id": "opt-1", "text": "A dedicated identity instance of Microsoft Entra ID (Azure AD) representing an organization.", "isCorrect": True},
                {"id": "opt-2", "text": "A physical building rented inside a datacenter park.", "isCorrect": False},
                {"id": "opt-3", "text": "A single virtual hard disk file (.vhd).", "isCorrect": False},
                {"id": "opt-4", "text": "A network security firewall rule.", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q009",
        "title": "PPTX Slide 26-28: Azure Subscription Boundaries",
        "type": "SINGLE_CHOICE",
        "difficulty": "BEGINNER",
        "points": 1.0,
        "explanation": "Slides 26-28 emphasize that an Azure Subscription provides two primary boundaries: Billing Boundary and Access/Management Boundary.",
        "content": {
            "prompt": "An Azure Subscription provides which TWO fundamental boundaries for Azure resources?",
            "explanation": "Slides 26-28 emphasize that an Azure Subscription provides two primary boundaries: Billing Boundary and Access/Management Boundary.",
            "options": [
                {"id": "opt-1", "text": "Billing boundary and Access/Management boundary", "isCorrect": True},
                {"id": "opt-2", "text": "Physical server rack boundary and power cable length", "isCorrect": False},
                {"id": "opt-3", "text": "Monitor resolution and browser window size", "isCorrect": False},
                {"id": "opt-4", "text": "Wi-Fi signal strength and Bluetooth range", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q010",
        "title": "PPTX Slide 30-33: Azure Resource Groups Analogy",
        "type": "SINGLE_CHOICE",
        "difficulty": "BEGINNER",
        "points": 1.0,
        "explanation": "Slides 30-33 compare a Resource Group to a 'folder' that holds related Azure resources so they can be managed, monitored, and deleted together as a single unit.",
        "content": {
            "prompt": "Slide 30 compares a Resource Group to which familiar real-world concept?",
            "explanation": "Slides 30-33 compare a Resource Group to a 'folder' that holds related Azure resources so they can be managed, monitored, and deleted together as a single unit.",
            "options": [
                {"id": "opt-1", "text": "A folder that organizes related items so they can be managed together.", "isCorrect": True},
                {"id": "opt-2", "text": "A physical highway toll booth.", "isCorrect": False},
                {"id": "opt-3", "text": "A satellite dish on a roof.", "isCorrect": False},
                {"id": "opt-4", "text": "A USB flash drive plugged into a desktop.", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q011",
        "title": "PPTX Slide 31-33: Azure Management Groups Inheritance",
        "type": "SINGLE_CHOICE",
        "difficulty": "BEGINNER",
        "points": 1.0,
        "explanation": "Slides 31-33 explain that Management Groups sit above Subscriptions and allow governance conditions (like Azure Policies and RBAC) to inherit down to all child subscriptions.",
        "content": {
            "prompt": "When an Azure Policy is assigned at a Management Group, what happens to the child Subscriptions underneath it?",
            "explanation": "Slides 31-33 explain that Management Groups sit above Subscriptions and allow governance conditions (like Azure Policies and RBAC) to inherit down to all child subscriptions.",
            "options": [
                {"id": "opt-1", "text": "All child Subscriptions automatically inherit the Azure Policy rules.", "isCorrect": True},
                {"id": "opt-2", "text": "Child Subscriptions ignore the policy completely.", "isCorrect": False},
                {"id": "opt-3", "text": "The Azure Policy is deleted automatically after 24 hours.", "isCorrect": False},
                {"id": "opt-4", "text": "Child Subscriptions are moved to a different region.", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q012",
        "title": "PPTX Slide 39-42: Infrastructure as Code & ARM Templates",
        "type": "SINGLE_CHOICE",
        "difficulty": "BEGINNER",
        "points": 1.0,
        "explanation": "Slides 39-42 introduce native ARM templates, which use JSON (JavaScript Object Notation) format to define infrastructure declaratively.",
        "content": {
            "prompt": "What file format is used to author native Azure Resource Manager (ARM) templates as highlighted in Slides 39-42?",
            "explanation": "Slides 39-42 introduce native ARM templates, which use JSON (JavaScript Object Notation) format to define infrastructure declaratively.",
            "options": [
                {"id": "opt-1", "text": "JSON (JavaScript Object Notation)", "isCorrect": True},
                {"id": "opt-2", "text": "HTML", "isCorrect": False},
                {"id": "opt-3", "text": "XML", "isCorrect": False},
                {"id": "opt-4", "text": "MP4", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q013",
        "title": "PPTX Slides 43-48: What is an API in Azure?",
        "type": "SINGLE_CHOICE",
        "difficulty": "BEGINNER",
        "points": 1.0,
        "explanation": "Slides 43-48 explain that an API (Application Programming Interface) acts as a 'messenger'. In Azure, every tool (Portal, CLI, PowerShell, ARM, Bicep, Terraform) calls Azure Resource Manager REST APIs behind the scenes.",
        "content": {
            "prompt": "According to Slides 44-48, what role do Azure Resource Manager (ARM) REST APIs play when you perform actions in Azure?",
            "explanation": "Slides 43-48 explain that an API (Application Programming Interface) acts as a 'messenger'. In Azure, every tool (Portal, CLI, PowerShell, ARM, Bicep, Terraform) calls Azure Resource Manager REST APIs behind the scenes.",
            "options": [
                {"id": "opt-1", "text": "Every tool (Portal, CLI, PowerShell, ARM templates) sends REST API calls to ARM to execute operations behind the scenes.", "isCorrect": True},
                {"id": "opt-2", "text": "REST APIs are only used by mobile phone apps, not Azure tools.", "isCorrect": False},
                {"id": "opt-3", "text": "REST APIs physically connect server cables inside datacenters.", "isCorrect": False},
                {"id": "opt-4", "text": "REST APIs are only active when servers are turned off.", "isCorrect": False}
            ]
        }
    }
]

d2 = [
    {
        "code": "AZ-BASICS-Q014",
        "title": "PPTX Slide 57-62: Azure Portal Interface",
        "type": "SINGLE_CHOICE",
        "difficulty": "BEGINNER",
        "points": 1.0,
        "explanation": "Slide 62 defines the Azure Portal as Microsoft's web-based graphical management interface (GUI) for creating, managing, and monitoring Azure resources.",
        "content": {
            "prompt": "What is the Azure Portal as described in Slide 62 of the Azure Basics presentation?",
            "explanation": "Slide 62 defines the Azure Portal as Microsoft's web-based graphical management interface (GUI) for creating, managing, and monitoring Azure resources.",
            "options": [
                {"id": "opt-1", "text": "Microsoft's web-based graphical management interface (GUI) for managing Azure resources.", "isCorrect": True},
                {"id": "opt-2", "text": "A command-line terminal window only accessible from Linux PCs.", "isCorrect": False},
                {"id": "opt-3", "text": "A physical retail store selling server hardware.", "isCorrect": False},
                {"id": "opt-4", "text": "An automated email notification service.", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q015",
        "title": "PPTX Slide 63-66: Azure PowerShell & Cmdlet Syntax",
        "type": "SINGLE_CHOICE",
        "difficulty": "BEGINNER",
        "points": 1.0,
        "explanation": "Slides 63-66 explain that Azure PowerShell uses a distinct Verb-Noun cmdlet naming convention (e.g. New-AzVM, Get-AzResourceGroup).",
        "content": {
            "prompt": "Which command structure is characteristic of Azure PowerShell cmdlets (such as New-AzVM)?",
            "explanation": "Slides 63-66 explain that Azure PowerShell uses a distinct Verb-Noun cmdlet naming convention (e.g. New-AzVM, Get-AzResourceGroup).",
            "options": [
                {"id": "opt-1", "text": "Verb-Noun syntax (e.g. New-AzVM)", "isCorrect": True},
                {"id": "opt-2", "text": "az <group> <action> syntax", "isCorrect": False},
                {"id": "opt-3", "text": "SQL SELECT query statements", "isCorrect": False},
                {"id": "opt-4", "text": "HTML tag syntax (<vm>new</vm>)", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q016",
        "title": "PPTX Slide 67-71: Azure CLI Syntax & Platforms",
        "type": "SINGLE_CHOICE",
        "difficulty": "BEGINNER",
        "points": 1.0,
        "explanation": "Slides 67-71 highlight that Azure CLI is a cross-platform command-line tool (Windows, macOS, Linux) that follows an 'az <group> <action>' command structure (e.g. az vm create).",
        "content": {
            "prompt": "What command structure is used by the cross-platform Azure CLI tool?",
            "explanation": "Slides 67-71 highlight that Azure CLI is a cross-platform command-line tool (Windows, macOS, Linux) that follows an 'az <group> <action>' command structure (e.g. az vm create).",
            "options": [
                {"id": "opt-1", "text": "az <group> <action> (e.g. az vm create)", "isCorrect": True},
                {"id": "opt-2", "text": "Verb-Noun syntax (e.g. New-AzVM)", "isCorrect": False},
                {"id": "opt-3", "text": "Docker container run syntax", "isCorrect": False},
                {"id": "opt-4", "text": "Git push origin main syntax", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q017",
        "title": "PPTX Slide 75: B-Series VM & Burst CPU Concept",
        "type": "SINGLE_CHOICE",
        "difficulty": "BEGINNER",
        "points": 1.0,
        "explanation": "Slide 75 explains Burst CPU: B-Series VMs run at a baseline CPU level, accumulate CPU credits when idle, and burst up to 100% CPU when traffic spikes.",
        "content": {
            "prompt": "According to Slide 75, what is Burst CPU in Azure B-Series Virtual Machines?",
            "explanation": "Slide 75 explains Burst CPU: B-Series VMs run at a baseline CPU level, accumulate CPU credits when idle, and burst up to 100% CPU when traffic spikes.",
            "options": [
                {"id": "opt-1", "text": "The ability of a VM to run at a baseline CPU, accumulate CPU credits while idle, and burst up to 100% CPU during traffic spikes.", "isCorrect": True},
                {"id": "opt-2", "text": "A hardware failure where CPU chips physically break inside the server.", "isCorrect": False},
                {"id": "opt-3", "text": "Deleting virtual machines automatically after 1 hour.", "isCorrect": False},
                {"id": "opt-4", "text": "Overclocking server RAM water cooling pumps.", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q018",
        "title": "PPTX Slide 76: D-Series VM (General Purpose)",
        "type": "SINGLE_CHOICE",
        "difficulty": "BEGINNER",
        "points": 1.0,
        "explanation": "Slide 76 describes D-Series VMs as General Purpose virtual machines with balanced vCPU and memory, suitable for testing and small-to-medium web application servers.",
        "content": {
            "prompt": "Which Azure VM family series represents General Purpose compute with balanced vCPU and RAM ratio?",
            "explanation": "Slide 76 describes D-Series VMs as General Purpose virtual machines with balanced vCPU and memory, suitable for testing and small-to-medium web application servers.",
            "options": [
                {"id": "opt-1", "text": "D-Series (General Purpose)", "isCorrect": True},
                {"id": "opt-2", "text": "N-Series (GPU-Enabled)", "isCorrect": False},
                {"id": "opt-3", "text": "L-Series (Storage Optimized)", "isCorrect": False},
                {"id": "opt-4", "text": "H-Series (High Performance Compute)", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q019",
        "title": "PPTX Slide 77 & 80: E-Series & M-Series VMs (Memory Optimized)",
        "type": "SINGLE_CHOICE",
        "difficulty": "BEGINNER",
        "points": 1.0,
        "explanation": "Slides 77 and 80 specify that E-Series and M-Series VMs offer high memory-to-CPU ratios ideal for large in-memory databases like SAP HANA and enterprise relational databases.",
        "content": {
            "prompt": "Which Azure VM series (E-Series and M-Series) should be chosen for hosting large in-memory databases like SAP HANA requiring high RAM-to-CPU ratios?",
            "explanation": "Slides 77 and 80 specify that E-Series and M-Series VMs offer high memory-to-CPU ratios ideal for large in-memory databases like SAP HANA and enterprise relational databases.",
            "options": [
                {"id": "opt-1", "text": "E-Series and M-Series (Memory Optimized)", "isCorrect": True},
                {"id": "opt-2", "text": "Fsv2-Series (Compute Optimized)", "isCorrect": False},
                {"id": "opt-3", "text": "B-Series (Burstable)", "isCorrect": False},
                {"id": "opt-4", "text": "A-Series (Basic Entry Level)", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q020",
        "title": "PPTX Slide 78: Fsv2-Series VM (Compute Optimized)",
        "type": "SINGLE_CHOICE",
        "difficulty": "BEGINNER",
        "points": 1.0,
        "explanation": "Slide 78 highlights Fsv2-Series VMs as Compute-Optimized instances featuring high CPU clock speeds for fast execution of batch processing and web analytics.",
        "content": {
            "prompt": "Which Azure VM series is Compute-Optimized with high CPU clock speeds for CPU-intensive batch calculation engines?",
            "explanation": "Slide 78 highlights Fsv2-Series VMs as Compute-Optimized instances featuring high CPU clock speeds for fast execution of batch processing and web analytics.",
            "options": [
                {"id": "opt-1", "text": "Fsv2-Series (Compute Optimized)", "isCorrect": True},
                {"id": "opt-2", "text": "L-Series (Storage Optimized)", "isCorrect": False},
                {"id": "opt-3", "text": "E-Series (Memory Optimized)", "isCorrect": False},
                {"id": "opt-4", "text": "B-Series (Burstable)", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q021",
        "title": "PPTX Slide 81: L-Series VM (Storage Optimized)",
        "type": "SINGLE_CHOICE",
        "difficulty": "BEGINNER",
        "points": 1.0,
        "explanation": "Slide 81 defines L-Series VMs as Storage-Optimized compute instances featuring direct-attached local NVMe storage for high I/O NoSQL databases like Cassandra and MongoDB.",
        "content": {
            "prompt": "Which VM family provides direct-attached local NVMe disk storage designed for high I/O throughput NoSQL databases (e.g. Cassandra, MongoDB)?",
            "explanation": "Slide 81 defines L-Series VMs as Storage-Optimized compute instances featuring direct-attached local NVMe storage for high I/O NoSQL databases like Cassandra and MongoDB.",
            "options": [
                {"id": "opt-1", "text": "L-Series (Storage Optimized)", "isCorrect": True},
                {"id": "opt-2", "text": "D-Series (General Purpose)", "isCorrect": False},
                {"id": "opt-3", "text": "N-Series (GPU-Enabled)", "isCorrect": False},
                {"id": "opt-4", "text": "M-Series (Large RAM)", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q022",
        "title": "PPTX Slides 84-86: H-Series VM (High Performance Computing - HPC)",
        "type": "SINGLE_CHOICE",
        "difficulty": "BEGINNER",
        "points": 1.0,
        "explanation": "Slides 84-86 explain High-Performance Computing (HPC) workloads (weather modeling, molecular simulations) requiring InfiniBand networking, served by H-Series VMs.",
        "content": {
            "prompt": "Which Azure VM series is built for High-Performance Computing (HPC) workloads requiring InfiniBand ultra-low latency interconnects?",
            "explanation": "Slides 84-86 explain High-Performance Computing (HPC) workloads (weather modeling, molecular simulations) requiring InfiniBand networking, served by H-Series VMs.",
            "options": [
                {"id": "opt-1", "text": "H-Series (High Performance Compute)", "isCorrect": True},
                {"id": "opt-2", "text": "B-Series (Burstable)", "isCorrect": False},
                {"id": "opt-3", "text": "A-Series (Entry Level)", "isCorrect": False},
                {"id": "opt-4", "text": "D-Series (General Purpose)", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q023",
        "title": "PPTX Slide 90: Trusted Launch & Integrity Monitoring",
        "type": "SINGLE_CHOICE",
        "difficulty": "BEGINNER",
        "points": 1.0,
        "explanation": "Slide 90 compares Integrity Monitoring in VM Trusted Launch to a 'security guard who checks every time the VM starts' to ensure firmware and bootloader haven't been tampered with.",
        "content": {
            "prompt": "Slide 90 uses what analogy to explain Integrity Monitoring in Azure VM Trusted Launch?",
            "explanation": "Slide 90 compares Integrity Monitoring in VM Trusted Launch to a 'security guard who checks every time the VM starts' to ensure firmware and bootloader haven't been tampered with.",
            "options": [
                {"id": "opt-1", "text": "A security guard who checks boot integrity every time the VM starts.", "isCorrect": True},
                {"id": "opt-2", "text": "A cashier at a grocery store scanner.", "isCorrect": False},
                {"id": "opt-3", "text": "A delivery driver dropping off packages.", "isCorrect": False},
                {"id": "opt-4", "text": "A painter painting server chassis walls.", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q024",
        "title": "PPTX Slide 91-92: Azure Spot Virtual Machines",
        "type": "SINGLE_CHOICE",
        "difficulty": "BEGINNER",
        "points": 1.0,
        "explanation": "Slides 91-92 explain that Azure Spot VMs allow you to take advantage of unused Azure compute capacity at steep discounts (up to 90%), but Microsoft can evict them when capacity is needed.",
        "content": {
            "prompt": "What is the key trade-off when using Azure Spot Virtual Machines?",
            "explanation": "Slides 91-92 explain that Azure Spot VMs allow you to take advantage of unused Azure compute capacity at steep discounts (up to 90%), but Microsoft can evict them when capacity is needed.",
            "options": [
                {"id": "opt-1", "text": "Significant cost savings (up to 90%), but VMs can be evicted/stopped by Azure at any time with short notice when capacity is needed.", "isCorrect": True},
                {"id": "opt-2", "text": "Spot VMs are 100% free forever without any eviction risk.", "isCorrect": False},
                {"id": "opt-3", "text": "Spot VMs only run on weekends.", "isCorrect": False},
                {"id": "opt-4", "text": "Spot VMs do not support installing operating systems.", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q025",
        "title": "PPTX Slide 88-89: VM Child Component Provisioning",
        "type": "SINGLE_CHOICE",
        "difficulty": "BEGINNER",
        "points": 1.0,
        "explanation": "Slides 88-89 illustrate that deploying an Azure VM provisions child resources including a Network Interface (NIC), Managed OS Disk, and IP configuration attached to a VNet subnet.",
        "content": {
            "prompt": "When creating an Azure Virtual Machine, which two mandatory underlying resources are automatically provisioned and attached to it?",
            "explanation": "Slides 88-89 illustrate that deploying an Azure VM provisions child resources including a Network Interface (NIC), Managed OS Disk, and IP configuration attached to a VNet subnet.",
            "options": [
                {"id": "opt-1", "text": "Network Interface (NIC) and Managed OS Disk", "isCorrect": True},
                {"id": "opt-2", "text": "Physical Fiber Cable and Land Deed", "isCorrect": False},
                {"id": "opt-3", "text": "Azure Key Vault and ExpressRoute Circuit", "isCorrect": False},
                {"id": "opt-4", "text": "DNS Registrar and Domain Name", "isCorrect": False}
            ]
        }
    }
]

d3 = [
    {
        "code": "AZ-BASICS-Q026",
        "title": "PPTX Slide 2: City Analogy for Azure Architecture",
        "type": "SINGLE_CHOICE",
        "difficulty": "BEGINNER",
        "points": 1.0,
        "explanation": "Slide 2 compares Physical Architecture to the land/buildings/power and Logical Architecture to the city map showing districts and addresses.",
        "content": {
            "prompt": "In the Slide 2 city analogy, what corresponds to Azure Logical Architecture?",
            "explanation": "Slide 2 compares Physical Architecture to the land/buildings/power and Logical Architecture to the city map showing districts and addresses.",
            "options": [
                {"id": "opt-1", "text": "The city map showing districts, streets, and addresses.", "isCorrect": True},
                {"id": "opt-2", "text": "The physical land and soil beneath buildings.", "isCorrect": False},
                {"id": "opt-3", "text": "The electrical power grid wires.", "isCorrect": False},
                {"id": "opt-4", "text": "The concrete foundations of server rooms.", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q027",
        "title": "PPTX Slide 4: Regions inside Geographies",
        "type": "SINGLE_CHOICE",
        "difficulty": "BEGINNER",
        "points": 1.0,
        "explanation": "Slide 4 emphasizes that Geography is the bigger boundary and Azure Regions (e.g. Central India, South India) are the smaller locations inside that Geography.",
        "content": {
            "prompt": "What is the relationship between an Azure Geography and an Azure Region?",
            "explanation": "Slide 4 emphasizes that Geography is the bigger boundary and Azure Regions (e.g. Central India, South India) are the smaller locations inside that Geography.",
            "options": [
                {"id": "opt-1", "text": "Geography is the larger boundary; multiple Azure Regions exist inside a Geography.", "isCorrect": True},
                {"id": "opt-2", "text": "Region is larger; multiple Geographies exist inside a Region.", "isCorrect": False},
                {"id": "opt-3", "text": "They are identical words with no difference.", "isCorrect": False},
                {"id": "opt-4", "text": "Regions are for databases only, while Geographies are for VMs only.", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q028",
        "title": "PPTX Slide 10-11: Low-Latency Regional Fiber Network",
        "type": "SINGLE_CHOICE",
        "difficulty": "BEGINNER",
        "points": 1.0,
        "explanation": "Slides 10-11 highlight that all datacenters within an Azure Region are connected by a dedicated, high-speed, low-latency fiber optic network.",
        "content": {
            "prompt": "How are individual datacenters within an Azure Region interconnected to ensure rapid data communication?",
            "explanation": "Slides 10-11 highlight that all datacenters within an Azure Region are connected by a dedicated, high-speed, low-latency fiber optic network.",
            "options": [
                {"id": "opt-1", "text": "Through a dedicated, low-latency regional fiber optic network.", "isCorrect": True},
                {"id": "opt-2", "text": "Over dial-up copper phone lines.", "isCorrect": False},
                {"id": "opt-3", "text": "Using public Wi-Fi hotspots.", "isCorrect": False},
                {"id": "opt-4", "text": "Via satellite signals bounced off the moon.", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q029",
        "title": "PPTX Slide 17: Multi-Zone Availability Example",
        "type": "SINGLE_CHOICE",
        "difficulty": "BEGINNER",
        "points": 1.0,
        "explanation": "Slide 17 illustrates that deploying application VMs across multiple Availability Zones protects the application against entire datacenter facility failures.",
        "content": {
            "prompt": "What benefit is gained by deploying web application VM instances across two distinct Availability Zones within the same region?",
            "explanation": "Slide 17 illustrates that deploying application VMs across multiple Availability Zones protects the application against entire datacenter facility failures.",
            "options": [
                {"id": "opt-1", "text": "High Availability (if one datacenter building loses power or connectivity, the other zone continues running).", "isCorrect": True},
                {"id": "opt-2", "text": "Decreased network throughput speed.", "isCorrect": False},
                {"id": "opt-3", "text": "Automatic cancellation of all monthly bills.", "isCorrect": False},
                {"id": "opt-4", "text": "Forced server reboots every 10 minutes.", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q030",
        "title": "PPTX Slide 22: Summary of Entra ID Tenant",
        "type": "SINGLE_CHOICE",
        "difficulty": "BEGINNER",
        "points": 1.0,
        "explanation": "Slide 22 summarizes that a Tenant houses user accounts, security groups, and enterprise applications for authentication.",
        "content": {
            "prompt": "Which Azure asset type is stored and managed at the Tenant level (Microsoft Entra ID)?",
            "explanation": "Slide 22 summarizes that a Tenant houses user accounts, security groups, and enterprise applications for authentication.",
            "options": [
                {"id": "opt-1", "text": "User accounts, security groups, and authentication credentials.", "isCorrect": True},
                {"id": "opt-2", "text": "Raw virtual hard disk (.vhd) files.", "isCorrect": False},
                {"id": "opt-3", "text": "Physical server rack power switches.", "isCorrect": False},
                {"id": "opt-4", "text": "Undersea fiber optic cables.", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q031",
        "title": "PPTX Slide 30: Folder Analogy for Resource Groups",
        "type": "SINGLE_CHOICE",
        "difficulty": "BEGINNER",
        "points": 1.0,
        "explanation": "Slide 30 states: 'Think of it like a folder. You put related files into a folder so you can manage them together.'",
        "content": {
            "prompt": "Why are Azure resources grouped into a Resource Group?",
            "explanation": "Slide 30 states: 'Think of it like a folder. You put related files into a folder so you can manage them together.'",
            "options": [
                {"id": "opt-1", "text": "To organize related resources so their lifecycle, monitoring, and permissions can be managed together.", "isCorrect": True},
                {"id": "opt-2", "text": "Because Azure forces all VMs to share a single CPU chip.", "isCorrect": False},
                {"id": "opt-3", "text": "To encrypt user web browser search histories.", "isCorrect": False},
                {"id": "opt-4", "text": "To prevent users from opening the Azure Portal.", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q032",
        "title": "PPTX Slide 38: Logical Hierarchy Scope Order",
        "type": "SINGLE_CHOICE",
        "difficulty": "BEGINNER",
        "points": 1.0,
        "explanation": "Slide 38 presents the full logical hierarchy from top to bottom: Tenant -> Management Group -> Subscription -> Resource Group -> Resource.",
        "content": {
            "prompt": "What is the correct top-to-bottom sequence of Azure logical management scopes?",
            "explanation": "Slide 38 presents the full logical hierarchy from top to bottom: Tenant -> Management Group -> Subscription -> Resource Group -> Resource.",
            "options": [
                {"id": "opt-1", "text": "Tenant -> Management Group -> Subscription -> Resource Group -> Resource", "isCorrect": True},
                {"id": "opt-2", "text": "Resource -> Resource Group -> Subscription -> Management Group -> Tenant", "isCorrect": False},
                {"id": "opt-3", "text": "Subscription -> Resource Group -> Tenant -> Management Group -> Resource", "isCorrect": False},
                {"id": "opt-4", "text": "Resource Group -> Tenant -> Management Group -> Resource -> Subscription", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q033",
        "title": "PPTX Slide 55: Maximum Depth of Management Groups",
        "type": "SINGLE_CHOICE",
        "difficulty": "BEGINNER",
        "points": 1.0,
        "explanation": "Slide 55 notes that Azure Management Groups can support up to 6 levels of depth in a single organizational tree.",
        "content": {
            "prompt": "Up to how many levels of depth can Azure Management Group hierarchies be structured?",
            "explanation": "Slide 55 notes that Azure Management Groups can support up to 6 levels of depth in a single organizational tree.",
            "options": [
                {"id": "opt-1", "text": "Up to 6 levels of depth", "isCorrect": True},
                {"id": "opt-2", "text": "Up to 1000 levels of depth", "isCorrect": False},
                {"id": "opt-3", "text": "Only 1 single level", "isCorrect": False},
                {"id": "opt-4", "text": "Unlimited levels without restriction", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q034",
        "title": "PPTX Slide 57: Global Search Box in Azure Portal",
        "type": "SINGLE_CHOICE",
        "difficulty": "BEGINNER",
        "points": 1.0,
        "explanation": "Slide 57 compares the Global Search box in the Azure Portal to 'Google's search box for Azure resources', allowing quick navigation to services and documentation.",
        "content": {
            "prompt": "What is the function of the top Search Bar in the Azure Portal GUI (Slide 57)?",
            "explanation": "Slide 57 compares the Global Search box in the Azure Portal to 'Google's search box for Azure resources', allowing quick navigation to services and documentation.",
            "options": [
                {"id": "opt-1", "text": "To quickly search for and navigate to any Azure service, resource, group, or documentation article.", "isCorrect": True},
                {"id": "opt-2", "text": "To stream live television sports games.", "isCorrect": False},
                {"id": "opt-3", "text": "To send text messages to personal cell phones.", "isCorrect": False},
                {"id": "opt-4", "text": "To order physical computer keyboards.", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q035",
        "title": "PPTX Slide 61: Cloud Shell Icon in Azure Portal Header",
        "type": "SINGLE_CHOICE",
        "difficulty": "BEGINNER",
        "points": 1.0,
        "explanation": "Slide 61 highlights the Cloud Shell icon in the top-right header of the Azure Portal, which opens an embedded browser terminal.",
        "content": {
            "prompt": "Which icon in the Azure Portal top navigation bar launches an embedded Cloud Shell terminal window directly in your web browser?",
            "explanation": "Slide 61 highlights the Cloud Shell icon in the top-right header of the Azure Portal, which opens an embedded browser terminal.",
            "options": [
                {"id": "opt-1", "text": "The Cloud Shell (>_) icon in the top navigation bar", "isCorrect": True},
                {"id": "opt-2", "text": "The Notification Bell icon", "isCorrect": False},
                {"id": "opt-3", "text": "The Help & Support question mark (?) icon", "isCorrect": False},
                {"id": "opt-4", "text": "The Settings gear icon", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q036",
        "title": "PPTX Slide 68: Azure CLI Operating System Support",
        "type": "SINGLE_CHOICE",
        "difficulty": "BEGINNER",
        "points": 1.0,
        "explanation": "Slide 68 states that Azure CLI is designed to run natively on Windows, macOS, and Linux.",
        "content": {
            "prompt": "On which operating systems can Azure CLI be installed and executed?",
            "explanation": "Slide 68 states that Azure CLI is designed to run natively on Windows, macOS, and Linux.",
            "options": [
                {"id": "opt-1", "text": "Windows, macOS, and Linux (Cross-Platform)", "isCorrect": True},
                {"id": "opt-2", "text": "Windows Server 2022 only", "isCorrect": False},
                {"id": "opt-3", "text": "Android mobile phones only", "isCorrect": False},
                {"id": "opt-4", "text": "MS-DOS 6.22 only", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q037",
        "title": "PPTX Slide 70: Azure CLI vs Azure PowerShell Comparison",
        "type": "SINGLE_CHOICE",
        "difficulty": "BEGINNER",
        "points": 1.0,
        "explanation": "Slide 70 summarizes: Azure CLI uses az commands and is popular with Linux/DevOps engineers, whereas Azure PowerShell uses Verb-Noun cmdlets and is popular with Windows sysadmins.",
        "content": {
            "prompt": "According to Slide 70, which management tool is particularly favored by Linux and DevOps engineers familiar with bash environments?",
            "explanation": "Slide 70 summarizes: Azure CLI uses az commands and is popular with Linux/DevOps engineers, whereas Azure PowerShell uses Verb-Noun cmdlets and is popular with Windows sysadmins.",
            "options": [
                {"id": "opt-1", "text": "Azure CLI", "isCorrect": True},
                {"id": "opt-2", "text": "Azure PowerShell", "isCorrect": False},
                {"id": "opt-3", "text": "Internet Explorer 11", "isCorrect": False},
                {"id": "opt-4", "text": "Windows Notepad", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q038",
        "title": "PPTX Slide 83: One-Line Summary of VM Series",
        "type": "SINGLE_CHOICE",
        "difficulty": "BEGINNER",
        "points": 1.0,
        "explanation": "Slide 83 provides a one-line summary: Match your workload needs (RAM, CPU, Storage, GPU) to the appropriate Azure VM family series to optimize cost and performance.",
        "content": {
            "prompt": "What is the key takeaway when choosing an Azure Virtual Machine SKU family for your application?",
            "explanation": "Slide 83 provides a one-line summary: Match your workload needs (RAM, CPU, Storage, GPU) to the appropriate Azure VM family series to optimize cost and performance.",
            "options": [
                {"id": "opt-1", "text": "Select the VM series family that matches your specific resource bottleneck (RAM, CPU, NVMe, or GPU) to optimize performance and cost.", "isCorrect": True},
                {"id": "opt-2", "text": "Always select the most expensive VM series regardless of workload.", "isCorrect": False},
                {"id": "opt-3", "text": "All Azure VM series have identical hardware specifications.", "isCorrect": False},
                {"id": "opt-4", "text": "VM series choice is chosen automatically by Microsoft and cannot be changed.", "isCorrect": False}
            ]
        }
    }
]

d4 = [
    {
        "code": "AZ-BASICS-Q039",
        "title": "PPTX Slide 84: High Performance Computing (HPC) Workloads",
        "type": "SINGLE_CHOICE",
        "difficulty": "BEGINNER",
        "points": 1.0,
        "explanation": "Slide 84 defines High Performance Computing (HPC) as using clusters of powerful servers working together to solve complex computational problems like weather forecasting.",
        "content": {
            "prompt": "Which real-world application is an example of High Performance Computing (HPC) as highlighted in Slide 84-85?",
            "explanation": "Slide 84 defines High Performance Computing (HPC) as using clusters of powerful servers working together to solve complex computational problems like weather forecasting.",
            "options": [
                {"id": "opt-1", "text": "Weather modeling, financial risk analysis, and crash simulation calculations.", "isCorrect": True},
                {"id": "opt-2", "text": "Sending basic email messages to colleagues.", "isCorrect": False},
                {"id": "opt-3", "text": "Editing text files in Windows Notepad.", "isCorrect": False},
                {"id": "opt-4", "text": "Browsing simple static websites.", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q040",
        "title": "PPTX Slide 91: Spot VM Savings Percentage",
        "type": "SINGLE_CHOICE",
        "difficulty": "BEGINNER",
        "points": 1.0,
        "explanation": "Slide 91 states that Azure Spot VMs provide up to a 90% discount compared to standard pay-as-you-go pricing.",
        "content": {
            "prompt": "Up to what cost discount can organizations receive by utilizing Azure Spot Virtual Machines over standard Pay-As-You-Go rates?",
            "explanation": "Slide 91 states that Azure Spot VMs provide up to a 90% discount compared to standard pay-as-you-go pricing.",
            "options": [
                {"id": "opt-1", "text": "Up to 90% discount", "isCorrect": True},
                {"id": "opt-2", "text": "Up to 5% discount", "isCorrect": False},
                {"id": "opt-3", "text": "Exactly 100% discount free forever", "isCorrect": False},
                {"id": "opt-4", "text": "No discount at all", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q041",
        "title": "PPTX Slide 92: Spot VM Best Use Cases",
        "type": "SINGLE_CHOICE",
        "difficulty": "BEGINNER",
        "points": 1.0,
        "explanation": "Slide 92 identifies best use cases for Spot VMs: Interruptible workloads, batch processing jobs, and dev/test environments that can tolerate sudden shutdowns.",
        "content": {
            "prompt": "Which workload scenario is ideal for deploying on Azure Spot Virtual Machines?",
            "explanation": "Slide 92 identifies best use cases for Spot VMs: Interruptible workloads, batch processing jobs, and dev/test environments that can tolerate sudden shutdowns.",
            "options": [
                {"id": "opt-1", "text": "Interruptible batch processing jobs and stateless dev/test workloads that can handle sudden server evictions.", "isCorrect": True},
                {"id": "opt-2", "text": "Production banking databases requiring 99.99% continuous availability.", "isCorrect": False},
                {"id": "opt-3", "text": "Emergency healthcare medical call routing systems.", "isCorrect": False},
                {"id": "opt-4", "text": "Primary Active Directory domain controllers.", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q042",
        "title": "PPTX Slide 90: Trusted Launch Boot Security",
        "type": "SINGLE_CHOICE",
        "difficulty": "BEGINNER",
        "points": 1.0,
        "explanation": "Slide 90 explains that Azure Trusted Launch protects against rootkits and bootkits by verifying OS boot loader signatures and firmware integrity.",
        "content": {
            "prompt": "What security threat does Azure VM Trusted Launch protect against during server startup?",
            "explanation": "Slide 90 explains that Azure Trusted Launch protects against rootkits and bootkits by verifying OS boot loader signatures and firmware integrity.",
            "options": [
                {"id": "opt-1", "text": "Bootkits, rootkits, and unauthorized firmware modifications during system boot.", "isCorrect": True},
                {"id": "opt-2", "text": "Phishing emails received in personal webmail.", "isCorrect": False},
                {"id": "opt-3", "text": "Overcharging on credit card invoices.", "isCorrect": False},
                {"id": "opt-4", "text": "Physical theft of monitor screens.", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q043",
        "title": "PPTX Slide 49-53: Sequence of VM Creation behind the scenes",
        "type": "SINGLE_CHOICE",
        "difficulty": "BEGINNER",
        "points": 1.0,
        "explanation": "Slides 49-53 outline the sequence: User initiates request -> REST API sent to ARM -> ARM validates request & credentials -> ARM orchestrates Compute, Network, and Storage providers -> Resources allocated inside datacenter.",
        "content": {
            "prompt": "What is the first step that occurs behind the scenes when a user clicks 'Create' for a Virtual Machine in the Azure Portal?",
            "explanation": "Slides 49-53 outline the sequence: User initiates request -> REST API sent to ARM -> ARM validates request & credentials -> ARM orchestrates Compute, Network, and Storage providers -> Resources allocated inside datacenter.",
            "options": [
                {"id": "opt-1", "text": "An HTTPS REST API request is sent to Azure Resource Manager (ARM).", "isCorrect": True},
                {"id": "opt-2", "text": "A physical datacenter technician manually plugs in a new computer power cable.", "isCorrect": False},
                {"id": "opt-3", "text": "Microsoft sends a paper invoice by mail.", "isCorrect": False},
                {"id": "opt-4", "text": "The local web browser downloads the Linux operating system source code.", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q044",
        "title": "PPTX Slide 64: Azure PowerShell Platform Requirements",
        "type": "SINGLE_CHOICE",
        "difficulty": "BEGINNER",
        "points": 1.0,
        "explanation": "Slide 64 clarifies that Azure PowerShell runs inside PowerShell Core on Windows, macOS, and Linux platforms.",
        "content": {
            "prompt": "Is Azure PowerShell restricted exclusively to Windows operating systems?",
            "explanation": "Slide 64 clarifies that Azure PowerShell runs inside PowerShell Core on Windows, macOS, and Linux platforms.",
            "options": [
                {"id": "opt-1", "text": "No, Azure PowerShell runs cross-platform on Windows, macOS, and Linux via PowerShell Core.", "isCorrect": True},
                {"id": "opt-2", "text": "Yes, Azure PowerShell can only be installed on Windows 10/11.", "isCorrect": False},
                {"id": "opt-3", "text": "Yes, Azure PowerShell requires MS-DOS.", "isCorrect": False},
                {"id": "opt-4", "text": "Azure PowerShell only runs inside Apple iPhones.", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q045",
        "title": "PPTX Slide 21: Tenant vs Subscription Relationship",
        "type": "SINGLE_CHOICE",
        "difficulty": "BEGINNER",
        "points": 1.0,
        "explanation": "Slide 21 illustrates that a single Microsoft Entra ID Tenant can manage and contain multiple Azure Subscriptions.",
        "content": {
            "prompt": "How many Azure Subscriptions can be associated with a single Microsoft Entra ID Tenant?",
            "explanation": "Slide 21 illustrates that a single Microsoft Entra ID Tenant can manage and contain multiple Azure Subscriptions.",
            "options": [
                {"id": "opt-1", "text": "Multiple Subscriptions can belong to a single Tenant.", "isCorrect": True},
                {"id": "opt-2", "text": "Strictly only 1 Subscription per Tenant.", "isCorrect": False},
                {"id": "opt-3", "text": "Zero Subscriptions; Tenants cannot hold Subscriptions.", "isCorrect": False},
                {"id": "opt-4", "text": "Maximum 2 Subscriptions across the entire world.", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q046",
        "title": "PPTX Slide 34-37: Resource Group Lifecycle Scope",
        "type": "SINGLE_CHOICE",
        "difficulty": "BEGINNER",
        "points": 1.0,
        "explanation": "Slides 34-37 emphasize that resources sharing the same lifecycle (deployed, updated, and deleted together) should be placed in the same Resource Group.",
        "content": {
            "prompt": "What recommendation is given in Slides 34-37 for deciding which resources belong in the same Resource Group?",
            "explanation": "Slides 34-37 emphasize that resources sharing the same lifecycle (deployed, updated, and deleted together) should be placed in the same Resource Group.",
            "options": [
                {"id": "opt-1", "text": "Place resources that share the same development lifecycle together in the same Resource Group.", "isCorrect": True},
                {"id": "opt-2", "text": "Put all virtual machines in the world into one single Resource Group.", "isCorrect": False},
                {"id": "opt-3", "text": "Create a new Resource Group every 5 minutes.", "isCorrect": False},
                {"id": "opt-4", "text": "Never use Resource Groups for production resources.", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q047",
        "title": "PPTX Slide 54: Cloud Adoption Journey Steps",
        "type": "SINGLE_CHOICE",
        "difficulty": "BEGINNER",
        "points": 1.0,
        "explanation": "Slide 54 outlines the Cloud Adoption Journey steps, including organizing subscriptions into Management Groups for governance scaling.",
        "content": {
            "prompt": "According to the Azure Cloud Adoption Journey (Slide 54-55), why do growing enterprises organize Subscriptions into Management Groups?",
            "explanation": "Slide 54 outlines the Cloud Adoption Journey steps, including organizing subscriptions into Management Groups for governance scaling.",
            "options": [
                {"id": "opt-1", "text": "To scale governance, policy enforcement, and access controls across multiple subscriptions efficiently.", "isCorrect": True},
                {"id": "opt-2", "text": "To bypass Microsoft Azure billing invoices.", "isCorrect": False},
                {"id": "opt-3", "text": "To automatically convert virtual machines into container apps.", "isCorrect": False},
                {"id": "opt-4", "text": "To change the color theme of the Azure Portal.", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q048",
        "title": "PPTX Slide 87: Simple Explanation of VM Series Choice",
        "type": "SINGLE_CHOICE",
        "difficulty": "BEGINNER",
        "points": 1.0,
        "explanation": "Slide 87 provides a simple summary: Compute Optimized (F) = Fast CPU, Memory Optimized (E/M) = Huge RAM, Storage Optimized (L) = High NVMe Disk IOPS, GPU (N) = AI & Graphics, HPC (H) = InfiniBand Supercomputing.",
        "content": {
            "prompt": "Match the simple summary terms in Slide 87: Which VM series is designed for GPU-accelerated graphics rendering and AI machine learning?",
            "explanation": "Slide 87 provides a simple summary: Compute Optimized (F) = Fast CPU, Memory Optimized (E/M) = Huge RAM, Storage Optimized (L) = High NVMe Disk IOPS, GPU (N) = AI & Graphics, HPC (H) = InfiniBand Supercomputing.",
            "options": [
                {"id": "opt-1", "text": "N-Series (GPU Enabled)", "isCorrect": True},
                {"id": "opt-2", "text": "B-Series (Burstable)", "isCorrect": False},
                {"id": "opt-3", "text": "D-Series (General Purpose)", "isCorrect": False},
                {"id": "opt-4", "text": "Fsv2-Series (Compute)", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q049",
        "title": "PPTX Slide 94: Feature Comparison Table for VM Types",
        "type": "SINGLE_CHOICE",
        "difficulty": "BEGINNER",
        "points": 1.0,
        "explanation": "Slide 94 presents a feature comparison table emphasizing that Spot VMs provide maximum cost reduction for fault-tolerant batch workloads.",
        "content": {
            "prompt": "Based on the Slide 94 VM feature comparison matrix, which VM deployment type yields the lowest cost per hour for non-critical batch processing?",
            "explanation": "Slide 94 presents a feature comparison table emphasizing that Spot VMs provide maximum cost reduction for fault-tolerant batch workloads.",
            "options": [
                {"id": "opt-1", "text": "Azure Spot VMs", "isCorrect": True},
                {"id": "opt-2", "text": "Standard Pay-As-You-Go M-Series VMs", "isCorrect": False},
                {"id": "opt-3", "text": "Dedicated Host Instances", "isCorrect": False},
                {"id": "opt-4", "text": "Ultra Disk Storage Accounts", "isCorrect": False}
            ]
        }
    },
    {
        "code": "AZ-BASICS-Q050",
        "title": "PPTX Slide 95: Final Takeaway Summary",
        "type": "SINGLE_CHOICE",
        "difficulty": "BEGINNER",
        "points": 1.0,
        "explanation": "Slide 95 concludes: Azure provides a comprehensive ecosystem where physical datacenters are structured into Regions and Availability Zones, governed by a logical hierarchy (Tenant -> Management Group -> Subscription -> Resource Group -> Resource), and orchestrated via ARM REST APIs.",
        "content": {
            "prompt": "What is the overarching conclusion of the Azure Basics presentation regarding Azure architecture and management?",
            "explanation": "Slide 95 concludes: Azure provides a comprehensive ecosystem where physical datacenters are structured into Regions and Availability Zones, governed by a logical hierarchy (Tenant -> Management Group -> Subscription -> Resource Group -> Resource), and orchestrated via ARM REST APIs.",
            "options": [
                {"id": "opt-1", "text": "Azure combines physical datacenter infrastructure (Regions, Zones) with a structured logical hierarchy and ARM REST API automation to deliver reliable cloud services.", "isCorrect": True},
                {"id": "opt-2", "text": "Azure consists of a single server room located in Redmond, Washington.", "isCorrect": False},
                {"id": "opt-3", "text": "Cloud computing eliminates all need for network security.", "isCorrect": False},
                {"id": "opt-4", "text": "Virtual Machines cannot be created or deleted after they are deployed.", "isCorrect": False}
            ]
        }
    }
]

with open("scripts/new_exact_pptx_50.json", "w", encoding="utf-8") as f:
    json.dump({"d1": d1, "d2": d2, "d3": d3, "d4": d4}, f, indent=2)

print("Successfully built 50 authentic questions derived EXCLUSIVELY from Azure basics for T.pptx!")
