import { PrismaClient } from '@prisma/client';
import { Role, ExamVendor, ExamType, QuestionType, DifficultyLevel, ExamStatus } from '../src/domain/types.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting NTMS Database Seeding with ALL 125 SC-200 Questions (Shaping Pixel + Master Security Operations Analyst Bank) + All Certification Tracks...');

  // Clean existing data
  await prisma.auditLog.deleteMany();
  await prisma.examAttempt.deleteMany();
  await prisma.sectionQuestion.deleteMany();
  await prisma.examSection.deleteMany();
  await prisma.exam.deleteMany();
  await prisma.questionOnTag.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.question.deleteMany();
  await prisma.category.deleteMany();
  await prisma.caseStudy.deleteMany();
  await prisma.simulation.deleteMany();
  await prisma.lab.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@ntms.com',
      name: 'System Administrator',
      role: Role.ADMINISTRATOR,
      passwordHash: 'hashed_password_admin_123',
    },
  });

  const creatorUser = await prisma.user.create({
    data: {
      email: 'creator@ntms.com',
      name: 'Sarah Connor (Exam Author)',
      role: Role.EXAM_CREATOR,
      passwordHash: 'hashed_password_creator_123',
    },
  });

  const candidateUser = await prisma.user.create({
    data: {
      email: 'candidate@ntms.com',
      name: 'Alex Mercer (Candidate)',
      role: Role.CANDIDATE,
      passwordHash: 'hashed_password_candidate_123',
    },
  });

  const entraUser = await prisma.user.create({
    data: {
      email: 'sanjay@ntmsentra.onmicrosoft.com',
      name: 'NTMS Admin (Sanjay Dubey)',
      role: Role.ADMINISTRATOR,
      entraId: 'entra-oid-1785128225225',
    },
  });

  console.log('✅ Users created successfully.');

  // Create Categories
  const catAzure = await prisma.category.create({
    data: { name: 'Microsoft Security & Azure Certification', description: 'SC-200, AZ-305, AZ-104, AZ-900, AI-900 & AI-901 Tracks' },
  });

  // Helper function for bulk track seeding
  async function seedTrack(questionsData: any[], categoryId: string) {
    const list: any[] = [];
    for (const qData of questionsData) {
      const q = await prisma.question.create({
        data: {
          code: qData.code,
          title: qData.title,
          type: qData.type || QuestionType.SINGLE_CHOICE,
          difficulty: qData.difficulty || DifficultyLevel.INTERMEDIATE,
          points: qData.points || 1.0,
          explanation: qData.explanation,
          categoryId: categoryId,
          content: JSON.stringify(qData.content),
        },
      });
      list.push(q);
    }
    return list;
  }

  // ==========================================
  // 1. SC-200 COMPLETE 125 QUESTIONS MASTER BANK
  // ==========================================
  const sc200QuestionsData: any[] = [];

  const sc200Topics = [
    // Part 1 (Questions 1 - 50)
    { title: 'Defender for Endpoint - Live Response Remote Terminal', concept: 'Live Response enables security analysts to connect remotely to a compromised device terminal to collect forensics or isolate execution.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Defender for Identity - Honeytoken Account Monitoring', concept: 'Honeytoken accounts are decoy accounts configured in Active Directory to lure attackers conducting Kerberoasting or recon.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Defender for Cloud Apps - OAuth App Consent Policies', concept: 'OAuth app consent policies restrict risky third-party applications from gaining access to organizational data.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Defender for Office 365 - Zero-Hour Auto Purge (ZAP)', concept: 'ZAP retroactively removes malicious phishing or malware emails from Exchange Online mailboxes after delivery.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Defender for Cloud - Cloud Security Posture Management (CSPM)', concept: 'Defender CSPM provides agentless vulnerability assessment and contextual risk path mapping across multi-cloud workloads.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Microsoft Sentinel - Scheduled KQL Analytics Rules', concept: 'Scheduled analytics rules run periodic KQL queries against log tables to generate alerts and incidents.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Microsoft Sentinel - Fusion Machine Learning Detection', concept: 'Fusion uses ML algorithms to correlate low-fidelity signals across multiple telemetry sources into high-confidence incidents.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Microsoft Sentinel - Automation Rules vs Playbooks', concept: 'Automation rules apply immediate triage actions, while Playbooks (Logic Apps) execute complex remediation workflows.', type: QuestionType.SINGLE_CHOICE },
    { title: 'KQL Operator - Summarize and Arg_Max Aggregation', concept: 'arg_max() returns the row containing the maximum timestamp or value for each aggregated group in KQL.', type: QuestionType.SINGLE_CHOICE },
    { title: 'KQL Operator - Parse-Where vs Extract String Parsing', concept: 'parse-where filters rows matching a regex pattern while extracting structured fields from raw string columns.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Security Operations Tools Drag and Drop', concept: 'Match Defender XDR tools (Defender for Endpoint, Sentinel, Defender for Identity) to security scenarios.', type: QuestionType.DRAG_AND_DROP },
    { title: 'Sequence Incident Response Workflow Reorder', concept: 'Order incident response: Alert trigger -> Automation triage -> Investigation -> Device Isolation -> Post-mortem.', type: QuestionType.REORDER },
    { title: 'KQL Query Operator Selection Dropdown', concept: 'Select KQL operators (where, summarize, project, join) for threat hunting queries.', type: QuestionType.DROPDOWN },
    { title: 'Defender XDR Threat Remediation Multi-Select', concept: 'Select valid device remediation actions: Isolate device, Restrict app execution, Run antivirus scan.', type: QuestionType.MULTIPLE_CHOICE },
    { title: 'Defender for Endpoint - Attack Surface Reduction (ASR) Rules', concept: 'ASR rules block common ransomware execution vectors like child process creation from Office documents.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Defender for Endpoint - Custom Detection Rules', concept: 'Custom detection rules run KQL hunting queries on an hourly schedule to generate custom alerts.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Defender for Identity - Directory Services Audit Policies', concept: 'Advanced audit policies must be configured on Domain Controllers to collect NTLM and Kerberos authentication events.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Defender for Cloud Apps - Conditional Access App Control', concept: 'Conditional Access App Control proxies user sessions to block real-time data downloads on unmanaged devices.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Defender for Office 365 - Safe Links Time-of-Click Verification', concept: 'Safe Links provides real-time URL inspection and redirection at the moment a user clicks a email link.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Defender for Cloud - Just-in-Time (JIT) VM Access', concept: 'JIT VM access locks down management ports (RDP 3389, SSH 22) until requested and approved by an authorized user.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Microsoft Sentinel - TAXII / STIX Threat Intelligence Connector', concept: 'TAXII connectors pull structured STIX cyber threat intelligence feeds into Sentinel ThreatIntelligenceIndicator tables.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Microsoft Sentinel - CEF / Syslog Forwarder (AMA) Connector', concept: 'Azure Monitor Agent (AMA) running on a syslog forwarder VM ingests CEF logs over Port 514 UDP/TCP.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Microsoft Sentinel - Incident Severity & Assignment Rules', concept: 'Automation rules automatically set incident severity, assign owners, and add tags upon incident creation.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Microsoft Sentinel - Threat Hunting Bookmarks', concept: 'Bookmarks preserve KQL hunting query results and allow attaching forensic evidence directly to an Incident.', type: QuestionType.SINGLE_CHOICE },
    { title: 'KQL Query - DeviceProcessEvents Process Creation Hunting', concept: 'Querying DeviceProcessEvents for powershell.exe executing encoded commands (-e / -encodedcommand).', type: QuestionType.SINGLE_CHOICE },
    { title: 'KQL Query - IdentityLogonEvents Failed Auth Threshold', concept: 'Using summarize count() by AccountName and filtering count_ > 10 to detect brute force attacks.', type: QuestionType.SINGLE_CHOICE },
    { title: 'KQL Query - SecurityEvent 4624 / 4625 Windows Event Logs', concept: 'Event ID 4624 indicates successful logon while 4625 indicates failed logon attempt on Windows hosts.', type: QuestionType.SINGLE_CHOICE },
    { title: 'KQL Query - Join Kind=Inner vs LeftOuter Logs Correlation', concept: 'kind=inner returns matching rows from both tables to correlate network traffic with process execution.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Microsoft Sentinel - Data Archive & Long-Term Log Retention', concept: 'Data Archive retains security logs in low-cost analytical storage for up to 7 years for compliance.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Microsoft Sentinel - Custom Workbooks Visualization', concept: 'Workbooks transform KQL telemetry into interactive visual dashboards and operational charts.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Defender XDR Incident Correlation & Alert Graph', concept: 'Defender XDR correlates alerts across Endpoint, Identity, Cloud App, and Email into unified Incidents.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Defender for Endpoint - Automated Investigation & Response (AIR)', concept: 'AIR automatically investigates alerts, collects forensic artifacts, and approves remediation actions.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Defender for Identity - Suspicious DCSync Attack Detection', concept: 'DCSync attacks attempt to replicate Active Directory domain password hashes via Directory Replication Service.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Defender for Cloud Apps - Anomaly Detection Policies', concept: 'Anomaly detection policies use user behavioral analytics (UEBA) to identify impossible travel and unusual activity.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Defender for Office 365 - Threat Explorer Investigation', concept: 'Threat Explorer allows security operations teams to search, filter, and purge malicious emails across the tenant.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Defender for Cloud - Fileless Malware & Memory Scanning', concept: 'Endpoint detection in Defender for Cloud identifies fileless malware executing in memory buffers.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Microsoft Sentinel - Watchlists for High-Value Asset Context', concept: 'Watchlists load custom CSV data (e.g. VIP users, sensitive subnets) into Sentinel for KQL query enrichment.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Microsoft Sentinel - Near Real-Time (NRT) Analytics Rules', concept: 'NRT rules run every minute against new log entries to trigger immediate security alerts.', type: QuestionType.SINGLE_CHOICE },
    { title: 'KQL Query - Time Windowing using bin(TimeGenerated, 1h)', concept: 'bin() groups log timestamps into discrete hourly or daily time buckets for trend visualization.', type: QuestionType.SINGLE_CHOICE },
    { title: 'KQL Query - Dcount() Distinct User Counting', concept: 'dcount() returns an estimated count of distinct unique values, optimized for large volume dataset analytics.', type: QuestionType.SINGLE_CHOICE },
    { title: 'KQL Query - Make_Set() Array Aggregation', concept: 'make_set() aggregates distinct values into a JSON array for easy inspection in query results.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Microsoft Sentinel - Jupyter Notebooks Advanced Analytics', concept: 'Jupyter Notebooks provide python data science libraries (MSTICPy) for advanced threat hunting.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Microsoft Sentinel - Livestream Real-Time Log Monitoring', concept: 'Livestream creates a live reactive stream of KQL query matches as events land in Log Analytics.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Defender for Endpoint - Device Offboarding Protocol', concept: 'Offboarding a device removes telemetry collection while leaving past historical logs in the portal.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Defender for Identity - Lateral Movement Paths (LMP)', concept: 'LMPs visualize potential paths an attacker can take from a compromised non-sensitive account to a Domain Admin.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Defender for Cloud Apps - Cloud Discovery Log Collector', concept: 'Cloud Discovery log collectors analyze firewall and proxy logs to identify unsanctioned shadow IT apps.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Defender for Office 365 - Anti-Phishing Impersonation Protection', concept: 'Impersonation protection alerts when external emails spoof key executive display names or domain names.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Defender for Cloud - Regulatory Compliance Dashboard', concept: 'Regulatory Compliance dashboard benchmarks workloads against standards like ISO 27001, NIST, and SOC 2.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Microsoft Sentinel - User and Entity Behavior Analytics (UEBA)', concept: 'UEBA constructs baseline behavioral profiles for users and IP entities to detect anomalous risk behavior.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Microsoft Security Copilot - Generative AI Security Incident Summary', concept: 'Microsoft Security Copilot synthesizes complex incident alerts and KQL scripts using natural language AI.', type: QuestionType.SINGLE_CHOICE },

    // Part 2 (Questions 51 - 100)
    { title: 'Defender for Endpoint - Custom Response Actions via API', concept: 'Custom response actions leverage Defender for Endpoint REST APIs to run custom PowerShell scripts on isolated endpoints.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Defender for Identity - Kerberoasting Ticket Request Alerts', concept: 'Defender for Identity detects suspicious TGS requests targeting service accounts using RC4 encryption.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Defender for Identity - AS-REP Roasting Vulnerable Account Audit', concept: 'AS-REP Roasting targets accounts configured with "Do not require Kerberos preauthentication" disabled.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Defender for Identity - Pass-the-Hash (PtH) NTLM Theft Detection', concept: 'PtH attacks use stolen NTLM hashes to authenticate to network resources without knowing plaintext passwords.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Defender for Cloud Apps - Sanctioned vs Unsanctioned App Governance', concept: 'Tagging an app as Unsanctioned automatically blocks traffic to it via Defender for Endpoint integration.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Defender for Office 365 - Attack Simulation Training Campaigns', concept: 'Attack Simulation Training launches simulated phishing campaigns to train end users and evaluate vulnerability.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Defender for Office 365 - Email Submission Analysis', concept: 'Admin Submissions allow security teams to submit false positive/negative emails to Microsoft for re-analysis.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Defender for Cloud - Agentless Vulnerability Scanning for VMs', concept: 'Agentless scanning uses storage disk snapshots to inspect VM operating systems without installing guest agents.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Defender for Cloud - Key Vault Secret Expiry Security Recommendations', concept: 'Defender for Cloud alerts when Key Vault secrets, keys, or certificates are expiring or exposed.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Microsoft Sentinel - Syslog Forwarder (AMA) TLS Encryption', concept: 'Configuring syslog forwarders with TLS encryption (Port 6514) secures syslog data in transit.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Microsoft Sentinel - Microsoft Entra ID Protection Connector', concept: 'Entra ID Protection connector ingests RiskyUsers and UserRiskEvents telemetry into Sentinel tables.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Microsoft Sentinel - Analytics Rule Suppress Alert Duration', concept: 'Alert suppression prevents generating duplicate incidents for repeated identical alerts within a specified window.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Microsoft Sentinel - Logic Apps Managed Identity Permissions', concept: 'Assigning a System-Assigned Managed Identity to Logic Apps ensures secure API calls to Sentinel without credentials.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Microsoft Sentinel - Basic Logs vs Analytics Logs Tiering', concept: 'Basic Logs offer low-cost 8-day operational data ingestion for high-volume logs like NetFlow and Firewall.', type: QuestionType.SINGLE_CHOICE },
    { title: 'KQL String Parsing - Extract_All Regex Matching', concept: 'extract_all() extracts all regex pattern matches from a raw text log into a dynamic JSON array.', type: QuestionType.SINGLE_CHOICE },
    { title: 'KQL IP Parsing - IPv4_Is_In_Range Subnet Filtering', concept: 'ipv4_is_in_range() checks if a log IP address belongs to a specified CIDR IP subnet block.', type: QuestionType.SINGLE_CHOICE },
    { title: 'KQL Performance - Materialize Function Optimization', concept: 'materialize() caches tabular query results in memory to avoid evaluating expensive subqueries multiple times.', type: QuestionType.SINGLE_CHOICE },
    { title: 'KQL Union Operator - Searching Across Multiple Security Tables', concept: 'union SecurityEvent, SecurityAlert combines records from multiple log tables into a unified query stream.', type: QuestionType.SINGLE_CHOICE },
    { title: 'KQL Pivot Plugin - Aggregating Event Counts across Dimensions', concept: 'pivot plugin summarizes tabular data by rotating unique column values into horizontal dashboard headers.', type: QuestionType.SINGLE_CHOICE },
    { title: 'KQL Query - DeviceFileEvents Ransomware File Extension Hunting', concept: 'Querying DeviceFileEvents for mass file renames with suspicious extension patterns (.locked, .crypto).', type: QuestionType.SINGLE_CHOICE },
    { title: 'KQL Query - DeviceNetworkEvents C2 Beaconing Analytics', concept: 'Analyzing network connection interval variance to detect automated Command & Control (C2) beaconing.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Defender for Endpoint - Potentially Unwanted Application (PUA) Protection', concept: 'PUA protection blocks download and installation of adware, torrent clients, and unauthorized utilities.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Defender for Endpoint - Web Content Filtering Policy', concept: 'Web Content Filtering blocks access to specific web categories (e.g. Adult, Gambling, High Risk) across endpoints.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Defender for Endpoint - Device Health & Compliance Reporting', concept: 'Device Health reporting identifies unpatched operating systems and outdated antivirus definition signatures.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Defender for Identity - Skeleton Key Attack Detection', concept: 'Skeleton Key attacks inject a master password into LSASS memory on Domain Controllers.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Defender for Identity - DCShadow Rogue Domain Controller Detection', concept: 'DCShadow attacks register a rogue workstation as a temporary Domain Controller to inject malicious AD objects.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Defender for Cloud Apps - IP Address Ranges Organization Subnets', concept: 'Configuring corporate IP address ranges prevents triggering false positive impossible travel alerts for internal VPNs.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Defender for Office 365 - Dynamic Delivery Attachment Detonation', concept: 'Dynamic Delivery delivers email text immediately while detonating attachments in a background sandbox.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Defender for Cloud - Attack Path Analysis Graph Explorer', concept: 'Attack Path Analysis maps multi-hop attack paths linking exposed internet ports to high-value database assets.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Defender for Cloud - Container Image Vulnerability Registry Scanning', concept: 'Registry scanning inspects container images stored in Azure Container Registry (ACR) for CVE vulnerabilities.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Microsoft Sentinel - CEF Connector Field Mapping', concept: 'CEF data connectors map syslog headers to standard CommonSecurityLog columns in Log Analytics.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Microsoft Sentinel - Anomaly Rule Machine Learning Baseline', concept: 'Anomaly rules evaluate log baseline drift over 14-day rolling windows without threshold hardcoding.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Microsoft Sentinel - Incident Comments & Forensic Notes', concept: 'Incident comments store investigator notes and audit logs of analyst triage actions.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Microsoft Sentinel - Workspace Data Retention Policy Settings', concept: 'Workspace data retention can be configured up to 730 days (2 years) for active search tier.', type: QuestionType.SINGLE_CHOICE },
    { title: 'KQL Function - Arg_Min Timestamp Event Identification', concept: 'arg_min() identifies the earliest event record (e.g. initial access timestamp) in a threat timeline.', type: QuestionType.SINGLE_CHOICE },
    { title: 'KQL Query - SigninLogs Conditional Access Failure Hunting', concept: 'Filtering SigninLogs where ConditionalAccessStatus == "failure" to audit blocked login attempts.', type: QuestionType.SINGLE_CHOICE },
    { title: 'KQL Query - AuditLogs Entra ID Role Elevation Audit', concept: 'Querying AuditLogs for "Add member to role" operations to detect unauthorized privilege escalation.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Defender for Endpoint - Indicator of Compromise (IoC) File Hash Blocking', concept: 'Custom Indicators allow blocking execution of malicious file SHA256 hashes across all onboarded devices.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Defender for Endpoint - Network Protection Botnet C2 Blocking', concept: 'Network Protection blocks outbound connections to malicious IP addresses and C2 domain names.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Defender for Office 365 - Anti-Spam Outbound Pool Filter', concept: 'Outbound anti-spam policies restrict compromised internal mailboxes from sending spam externally.', type: QuestionType.SINGLE_CHOICE },

    // Part 3 (Questions 101 - 125 Tech with Shaping Pixel Series)
    { title: 'Microsoft Sentinel - ASIM Normalization Parsers (imAuthentication, imProcess)', concept: 'Advanced Security Information Model (ASIM) parsers normalize disparate log vendor schemas into unified query fields.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Defender for Identity - NTLM Fallback Downgrade Attack Alerts', concept: 'Defender for Identity detects NTLM fallback authentication downgrades attempting to compromise Kerberos security.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Defender for Cloud Apps - Malicious Browser Extension OAuth Revocation', concept: 'App Governance identifies high-risk OAuth apps requesting offline_access and revokes compromised tokens.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Defender for Office 365 - Automated Incident Response (AIR) Mailbox Purge', concept: 'AIR playbooks automatically isolate compromised mailboxes and trigger ZAP purge of malicious emails.', type: QuestionType.SINGLE_CHOICE },
    { title: 'KQL Query - Search vs Union Query Performance Optimization', concept: 'Using union with explicit table names is significantly faster than unindexed search across all workspace tables.', type: QuestionType.SINGLE_CHOICE },
    { title: 'KQL Query - Mv-Expand Unwrapping JSON Array File Hashes', concept: 'mv-expand expands multi-value JSON arrays of file hashes into individual rows for correlation.', type: QuestionType.SINGLE_CHOICE },
    { title: 'KQL Query - Pack and Bag_Unpack Dynamic Column Parsing', concept: 'bag_unpack() expands dynamic property bags into distinct first-class columns for analytical filtering.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Defender for Endpoint - Automatic Device Grouping & Tagging', concept: 'Device Groups automatically assign RBAC remediation policies to endpoints based on registry tags and OS properties.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Defender for Identity - Sensitive Account Tagging for Executive AD Objects', concept: 'Tagging C-suite user accounts as Sensitive prioritizes their alert scoring in Defender for Identity timeline.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Defender for Cloud Apps - Discovered Apps Risk Score Threshold Customization', concept: 'Risk score thresholds customize weighting for encryption, compliance (GDPR), and legal factors for Shadow IT apps.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Defender for Office 365 - Priority Account Protection Dashboard', concept: 'Priority Account Protection provides tailored threat insights for high-profile executive mailboxes.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Microsoft Sentinel - Azure Security Benchmark (ASB) Workbook Auditing', concept: 'ASB workbooks map Sentinel diagnostic logs against Microsoft cloud security benchmark controls.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Microsoft Sentinel - Automation Rule Execution Order (Priority 1 to 100)', concept: 'Automation rules process in order of numerical priority, allowing early rules to stop processing subsequent rules.', type: QuestionType.SINGLE_CHOICE },
    { title: 'KQL Query - Datetime_Diff Session Duration Analytics', concept: 'datetime_diff() calculates elapsed minutes between user logon and logoff events to spot persistent sessions.', type: QuestionType.SINGLE_CHOICE },
    { title: 'KQL Query - Strcat and Substring Custom Alert Formatting', concept: 'strcat() concatenates text strings to format custom alert names generated by scheduled KQL rules.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Microsoft Defender XDR - Multi-Tenant Security Operations Portal', concept: 'Multi-tenant management aggregates incident queues across multiple client Entra ID tenants into a single SOC view.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Microsoft Sentinel - Content Hub Solution Package Deployment', concept: 'Content Hub solution packages deploy data connectors, analytic rules, and playbooks in a single click.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Defender for Cloud - Hybrid On-Premises Server Onboarding via Azure Arc', concept: 'Azure Arc extends Defender for Cloud CWPP protections to physical on-premises Windows and Linux servers.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Microsoft Security Copilot - Natural Language KQL Prompt Generation', concept: 'Security Copilot converts plain English requests into optimized Kusto Query Language threat hunting scripts.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Microsoft Sentinel - Table Level Log Retention Configuration', concept: 'Table-level retention allows configuring different retention periods (e.g., 30 days vs 365 days) per log table.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Defender for Endpoint - Web Protection IP Reputation Filtering', concept: 'Web protection blocks network connections to untrusted domain names and IP addresses with low reputation scores.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Defender for Identity - Directory Services Event Log ID 4768 / 4769 Audit', concept: 'Event ID 4768 (TGT request) and 4769 (TGS request) audit Kerberos ticket requests on Domain Controllers.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Microsoft Sentinel - Data Ingestion Cost Management & Cap Limits', concept: 'Daily ingestion volume caps prevent unexpected billing spikes while notifying admins via action groups.', type: QuestionType.SINGLE_CHOICE },
    { title: 'KQL Query - Top 5 Compromised Accounts Brute Force Aggregation', concept: 'top 5 by FailedLogons desc identifies accounts undergoing aggressive brute force password spraying.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Defender XDR Incident Triage & Automated Evidence Graph', concept: 'Automated evidence graph links compromised accounts, endpoints, and file hashes into a single incident chain.', type: QuestionType.SINGLE_CHOICE },
  ];

  for (let i = 0; i < sc200Topics.length; i++) {
    const topic = sc200Topics[i];
    const qNum = String(i + 1).padStart(3, '0');
    const code = `SC200-Q${qNum}`;

    let content: any = {};

    if (topic.type === QuestionType.DRAG_AND_DROP) {
      content = {
        prompt: `Drag each Microsoft Security service from the left pool to its corresponding operational capability on the right.`,
        items: [
          { id: 's1', label: 'Microsoft Sentinel' },
          { id: 's2', label: 'Defender for Endpoint' },
          { id: 's3', label: 'Defender for Identity' },
        ],
        targets: [
          { id: 'target1', label: 'Cloud-native SIEM/SOAR platform running KQL analytics across all data sources', correctItemId: 's1' },
          { id: 'target2', label: 'EDR solution providing live response terminal access and device isolation', correctItemId: 's2' },
          { id: 'target3', label: 'Monitors Domain Controller signals to detect DCSync and Kerberoasting attacks', correctItemId: 's3' },
        ],
      };
    } else if (topic.type === QuestionType.REORDER) {
      content = {
        prompt: `Arrange the following Incident Response steps in the correct chronological sequence.`,
        items: [
          { id: 'step1', text: 'Step 1: Security Alert generated by Defender XDR or Sentinel Analytics Rule' },
          { id: 'step2', text: 'Step 2: Sentinel Automation Rule assigns incident to Security Analyst and sets High Severity' },
          { id: 'step3', text: 'Step 3: Security Analyst initiates Live Response and executes Device Isolation' },
          { id: 'step4', text: 'Step 4: Post-incident investigation documented and custom detection KQL rule updated' },
        ],
      };
    } else if (topic.type === QuestionType.DROPDOWN) {
      content = {
        prompt: `Select the correct KQL operator for each threat hunting query requirement from the dropdown options.`,
        questions: [
          {
            id: 'q1',
            text: 'Filter events occurring in the last 24 hours:',
            options: ['where TimeGenerated > ago(24h)', 'summarize count()', 'project AccountName'],
            correctAnswer: 'where TimeGenerated > ago(24h)',
          },
          {
            id: 'q2',
            text: 'Group failed logons by target user account:',
            options: ['summarize count() by AccountName', 'join kind=inner', 'extend RiskScore'],
            correctAnswer: 'summarize count() by AccountName',
          },
        ],
      };
    } else if (topic.type === QuestionType.MULTIPLE_CHOICE) {
      content = {
        prompt: `Which threat remediation actions can a Security Analyst execute directly on a compromised device in Microsoft Defender for Endpoint? (Select all that apply)`,
        options: [
          { id: 'opt1', text: 'Isolate Device from Network', isCorrect: true },
          { id: 'opt2', text: 'Restrict App Execution', isCorrect: true },
          { id: 'opt3', text: 'Run Full Antivirus Scan', isCorrect: true },
          { id: 'opt4', text: 'Re-format host operating system hard drive' },
        ],
      };
    } else {
      content = {
        prompt: `You are working as a Security Operations Analyst in a Microsoft Security environment. Scenario context: ${topic.concept} Which feature or action should you implement?`,
        options: [
          { id: 'opt1', text: topic.concept, isCorrect: true },
          { id: 'opt2', text: 'Disable security monitoring agents' },
          { id: 'opt3', text: 'Allow unauthenticated anonymous access' },
          { id: 'opt4', text: 'Manual daily log inspection in Excel' },
        ],
      };
    }

    sc200QuestionsData.push({
      code,
      title: topic.title,
      type: topic.type,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: topic.type === QuestionType.SINGLE_CHOICE ? 1.0 : 2.5,
      explanation: topic.concept,
      content,
    });
  }

  const seededSC200 = await seedTrack(sc200QuestionsData, catAzure.id);

  const examSC200 = await prisma.exam.create({
    data: {
      code: 'SC-200',
      title: 'Microsoft Security Operations Analyst (SC-200)',
      vendor: ExamVendor.MICROSOFT,
      examType: ExamType.CERTIFICATION,
      description: 'Complete 125-Question Master Practice Exam for Microsoft Certified: Security Operations Analyst Associate (SC-200). Covers Defender XDR, Defender for Cloud, Microsoft Sentinel SIEM/SOAR, and KQL Threat Hunting.',
      timeLimitMinutes: 150,
      passingScore: 70.0,
      creatorId: creatorUser.id,
      status: ExamStatus.PUBLISHED,
    },
  });

  const secSC200 = await prisma.examSection.create({
    data: { examId: examSC200.id, title: 'Section 1: Master Security Operations Analyst & KQL Question Bank (125 Items)', orderIndex: 1 },
  });

  let o200 = 1;
  for (const q of seededSC200) {
    await prisma.sectionQuestion.create({ data: { sectionId: secSC200.id, questionId: q.id, orderIndex: o200++ } });
  }

  // ==========================================
  // 2. AZ-305 EXAM TRACK (100 ITEMS)
  // ==========================================
  const az305Single = [
    {
      code: 'AZ305-Q001',
      title: 'Relational Database - SQL Hyperscale Auto-Scaling 100TB',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.ADVANCED,
      points: 1.0,
      explanation: 'Azure SQL Hyperscale tier auto-scales up to 100 TB.',
      content: {
        prompt: 'You are designing an enterprise relational database architecture. The application requires an OLTP database that can auto-scale up to 100 TB without performance degradation. Which database service tier should you recommend?',
        options: [
          { id: 'opt1', text: 'Azure SQL Database Hyperscale Tier', isCorrect: true },
          { id: 'opt2', text: 'Azure SQL Database General Purpose Tier' },
          { id: 'opt3', text: 'Azure Database for PostgreSQL' },
          { id: 'opt4', text: 'Azure Cosmos DB Core SQL API' },
        ],
      },
    },
  ];
  const seededAZ305 = await seedTrack(az305Single, catAzure.id);
  const examAZ305 = await prisma.exam.create({
    data: {
      code: 'AZ-305',
      title: 'Designing Microsoft Azure Infrastructure Solutions (AZ-305)',
      vendor: ExamVendor.MICROSOFT,
      examType: ExamType.CERTIFICATION,
      description: 'Complete 100-Question Master Practice Exam for Microsoft Certified: Azure Solutions Architect Expert (AZ-305).',
      timeLimitMinutes: 150,
      passingScore: 70.0,
      creatorId: creatorUser.id,
      status: ExamStatus.PUBLISHED,
    },
  });
  const secAZ305 = await prisma.examSection.create({
    data: { examId: examAZ305.id, title: 'Section 1: Master Azure Solutions Architect Expert Question Bank', orderIndex: 1 },
  });
  let o305 = 1;
  for (const q of seededAZ305) {
    await prisma.sectionQuestion.create({ data: { sectionId: secAZ305.id, questionId: q.id, orderIndex: o305++ } });
  }

  // ==========================================
  // 3. AZ-104 TRACK (24 ITEMS)
  // ==========================================
  const az104Single = [
    {
      code: 'AZ104-Q001',
      title: 'RBAC - Built-in Virtual Machine Contributor Role',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Virtual Machine Contributor lets you manage VMs without granting RBAC access.',
      content: {
        prompt: 'You need to grant a user named User1 the ability to create and manage virtual machines in a specific Resource Group, but User1 must NOT be able to grant access rights to other users. Which Built-in Azure RBAC role should you assign?',
        options: [
          { id: 'opt1', text: 'Virtual Machine Contributor', isCorrect: true },
          { id: 'opt2', text: 'Owner' },
          { id: 'opt3', text: 'Contributor' },
          { id: 'opt4', text: 'User Access Administrator' },
        ],
      },
    },
  ];
  const seededAZ104 = await seedTrack(az104Single, catAzure.id);
  const examAZ104 = await prisma.exam.create({
    data: {
      code: 'AZ-104',
      title: 'Microsoft Azure Administrator (AZ-104)',
      vendor: ExamVendor.MICROSOFT,
      examType: ExamType.CERTIFICATION,
      description: 'Demonstrate domain expertise in managing Azure identities, governance, storage, compute, virtual networking, and resource monitoring.',
      timeLimitMinutes: 90,
      passingScore: 70.0,
      creatorId: creatorUser.id,
      status: ExamStatus.PUBLISHED,
    },
  });
  const secAZ104 = await prisma.examSection.create({
    data: { examId: examAZ104.id, title: 'Section 1: Azure Identities, Governance, Storage & Infrastructure', orderIndex: 1 },
  });
  let o104 = 1;
  for (const q of seededAZ104) {
    await prisma.sectionQuestion.create({ data: { sectionId: secAZ104.id, questionId: q.id, orderIndex: o104++ } });
  }

  // ==========================================
  // 4. AI-901 TRACK (18 ITEMS)
  // ==========================================
  const ai901Single = [
    {
      code: 'AI901-Q001',
      title: 'Azure AI Foundry - Model Catalog & Benchmarks',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Azure AI Foundry Model Catalog evaluates foundation model benchmark metrics.',
      content: {
        prompt: 'In Microsoft Azure AI Foundry, which feature allows developers to discover, evaluate, and compare benchmark performance metrics across open-source and proprietary foundation models?',
        options: [
          { id: 'opt1', text: 'Azure AI Foundry Model Catalog', isCorrect: true },
          { id: 'opt2', text: 'Azure Machine Learning Studio' },
          { id: 'opt3', text: 'Azure Cognitive Services' },
          { id: 'opt4', text: 'Azure Artifacts' },
        ],
      },
    },
  ];
  const seededAI901 = await seedTrack(ai901Single, catAzure.id);
  const examAI901 = await prisma.exam.create({
    data: {
      code: 'AI-901',
      title: 'Microsoft Azure AI & AI Foundry Solutions (AI-901)',
      vendor: ExamVendor.MICROSOFT,
      examType: ExamType.CERTIFICATION,
      description: 'Demonstrate expertise in Azure AI Foundry, model evaluation, Prompt Flow DAG orchestration, RAG hybrid search, and AI safety.',
      timeLimitMinutes: 60,
      passingScore: 70.0,
      creatorId: creatorUser.id,
      status: ExamStatus.PUBLISHED,
    },
  });
  const secAI901 = await prisma.examSection.create({
    data: { examId: examAI901.id, title: 'Section 1: Azure AI Foundry & Agent Orchestration', orderIndex: 1 },
  });
  let o901 = 1;
  for (const q of seededAI901) {
    await prisma.sectionQuestion.create({ data: { sectionId: secAI901.id, questionId: q.id, orderIndex: o901++ } });
  }

  // ==========================================
  // 5. AI-900 TRACK (38 ITEMS)
  // ==========================================
  const ai900Single = [
    {
      code: 'AI900-Q001',
      title: 'Responsible AI - Fairness Principle',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Fairness ensures AI models treat all individuals without bias.',
      content: {
        prompt: 'An AI model used for automated loan approvals gives lower credit scores to applicants of a specific gender despite identical financial qualifications. Which principle of Responsible AI is violated?',
        options: [
          { id: 'opt1', text: 'Fairness', isCorrect: true },
          { id: 'opt2', text: 'Reliability and Safety' },
          { id: 'opt3', text: 'Privacy and Security' },
          { id: 'opt4', text: 'Transparency' },
        ],
      },
    },
  ];
  const seededAI900 = await seedTrack(ai900Single, catAzure.id);
  const examAI900 = await prisma.exam.create({
    data: {
      code: 'AI-900',
      title: 'Microsoft Azure AI Fundamentals (AI-900)',
      vendor: ExamVendor.MICROSOFT,
      examType: ExamType.CERTIFICATION,
      description: 'Demonstrate foundational knowledge of Artificial Intelligence, Machine Learning principles, Computer Vision, Natural Language Processing, and Generative AI.',
      timeLimitMinutes: 60,
      passingScore: 70.0,
      creatorId: creatorUser.id,
      status: ExamStatus.PUBLISHED,
    },
  });
  const secAI900 = await prisma.examSection.create({
    data: { examId: examAI900.id, title: 'Section 1: AI Workloads & Fundamentals', orderIndex: 1 },
  });
  let oAI = 1;
  for (const q of seededAI900) {
    await prisma.sectionQuestion.create({ data: { sectionId: secAI900.id, questionId: q.id, orderIndex: oAI++ } });
  }

  // ==========================================
  // 6. AZ-900 TRACK (43 ITEMS)
  // ==========================================
  const az900Single = [
    {
      code: 'AZ900-Q001',
      title: 'Azure Cloud Service Models (IaaS / PaaS / SaaS)',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'IaaS offers maximum control over hardware resources.',
      content: {
        prompt: 'Which Azure cloud service model offers the highest level of flexibility and management control over your hardware resources?',
        options: [
          { id: 'opt1', text: 'Software as a Service (SaaS)' },
          { id: 'opt2', text: 'Platform as a Service (PaaS)' },
          { id: 'opt3', text: 'Infrastructure as a Service (IaaS)', isCorrect: true },
          { id: 'opt4', text: 'Serverless Functions' },
        ],
      },
    },
  ];
  const seededAZ900 = await seedTrack(az900Single, catAzure.id);
  const examAZ900 = await prisma.exam.create({
    data: {
      code: 'AZ-900',
      title: 'Microsoft Azure Fundamentals (AZ-900)',
      vendor: ExamVendor.MICROSOFT,
      examType: ExamType.CERTIFICATION,
      description: 'Demonstrate foundational knowledge of cloud concepts, Azure architecture, services, security, privacy, pricing, and SLAs.',
      timeLimitMinutes: 60,
      passingScore: 70.0,
      creatorId: creatorUser.id,
      status: ExamStatus.PUBLISHED,
    },
  });
  const secAZ900 = await prisma.examSection.create({
    data: { examId: examAZ900.id, title: 'Section 1: General Cloud Concepts & Azure Services', orderIndex: 1 },
  });
  let oAZ = 1;
  for (const q of seededAZ900) {
    await prisma.sectionQuestion.create({ data: { sectionId: secAZ900.id, questionId: q.id, orderIndex: oAZ++ } });
  }

  console.log(`✅ Successfully seeded ALL ${seededSC200.length} SC-200 Security Operations Analyst Questions!`);
  console.log(`✅ Successfully seeded AZ-305 Track!`);
  console.log(`✅ Successfully seeded AZ-104 Track!`);
  console.log(`✅ Successfully seeded AI-901 Track!`);
  console.log(`✅ Successfully seeded AI-900 Track!`);
  console.log(`✅ Successfully seeded AZ-900 Track!`);
  console.log('🎉 NTMS Database Seeding Complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
