// ---------------------------------------------------------------------------
// govc MCP – Command Registry
// ---------------------------------------------------------------------------
// Two data structures:
//   1. GOVC_COMMAND_INDEX  – agent-required commands (name + description) for search
//   2. GOVC_TOOL_DEFS      – typed flag schemas for every command agents need
// ---------------------------------------------------------------------------

// ---- Types ----------------------------------------------------------------

export interface FlagDef {
  type: 'string' | 'number' | 'boolean';
  description: string;
  required?: boolean;
  default?: string | number | boolean;
  enum?: string[];
}

export interface GovcToolDef {
  /** govc command name, e.g. "vm.info" */
  command: string;
  description: string;
  flags: Record<string, FlagDef>;
  /** Description of positional args (empty string = none) */
  positionalArgs?: string;
}

export interface GovcCommandEntry {
  name: string;
  description: string;
  category: string;
}

// ---- Helpers (compact flag builders) --------------------------------------

const str = (description: string, required = false): FlagDef => ({
  type: 'string',
  description,
  required,
});
const num = (description: string, required = false): FlagDef => ({
  type: 'number',
  description,
  required,
});
const bool = (description: string): FlagDef => ({
  type: 'boolean',
  description,
});
const strEnum = (description: string, values: string[]): FlagDef => ({
  type: 'string',
  description,
  enum: values,
});

// Common flag groups
const VM = { vm: str('Virtual machine [GOVC_VM]') };
const HOST = { host: str('Host system [GOVC_HOST]') };
const DS = { ds: str('Datastore [GOVC_DATASTORE]') };
const CLUSTER = { cluster: str('Cluster [GOVC_CLUSTER]') };
const FOLDER = { folder: str('Inventory folder [GOVC_FOLDER]') };
const POOL = { pool: str('Resource pool [GOVC_RESOURCE_POOL]') };
const NET = { net: str('Network [GOVC_NETWORK]') };

// ---------------------------------------------------------------------------
// 1. GOVC_COMMAND_INDEX – agent-required commands for search
// ---------------------------------------------------------------------------

export const GOVC_COMMAND_INDEX: GovcCommandEntry[] = [
  // -- Core / Navigation --
  {
    name: 'about',
    description: 'Display About info for HOST (name, type, version, build)',
    category: 'core',
  },
  { name: 'events', description: 'Display events', category: 'core' },
  {
    name: 'find',
    description: 'Find managed objects by type, name, or property',
    category: 'core',
  },
  { name: 'logs', description: 'View VPX and ESX logs', category: 'core' },
  {
    name: 'logs.ls',
    description: 'List diagnostic log keys',
    category: 'core',
  },
  { name: 'ls', description: 'List inventory items', category: 'core' },
  {
    name: 'tasks',
    description: 'Display info for recent tasks',
    category: 'core',
  },
  {
    name: 'tree',
    description: 'List contents of the inventory in a tree-like format',
    category: 'core',
  },

  // -- Session --
  {
    name: 'session.login',
    description: 'Session login (persist token to ~/.govc)',
    category: 'session',
  },
  {
    name: 'session.logout',
    description: 'Session logout',
    category: 'session',
  },
  {
    name: 'session.ls',
    description: 'List active sessions',
    category: 'session',
  },
  {
    name: 'session.rm',
    description: 'Remove active session',
    category: 'session',
  },

  // -- Snapshot --
  {
    name: 'snapshot.create',
    description: 'Create snapshot of VM',
    category: 'snapshot',
  },
  {
    name: 'snapshot.export',
    description: 'Export snapshot of VM',
    category: 'snapshot',
  },
  {
    name: 'snapshot.remove',
    description: 'Remove snapshot of VM',
    category: 'snapshot',
  },
  {
    name: 'snapshot.tree',
    description: 'List VM snapshots in a tree-like format',
    category: 'snapshot',
  },

  // -- Task --
  { name: 'task.cancel', description: 'Cancel task', category: 'task' },

  // -- VM --
  {
    name: 'vm.change',
    description: 'Change VM configuration (CPU, memory, ExtraConfig, etc.)',
    category: 'vm',
  },
  {
    name: 'vm.clone',
    description: 'Clone VM or template to NAME',
    category: 'vm',
  },
  { name: 'vm.create', description: 'Create VM', category: 'vm' },
  {
    name: 'vm.customize',
    description: 'Customize VM (hostname, IP, domain, etc.)',
    category: 'vm',
  },
  {
    name: 'vm.destroy',
    description: 'Power off and delete VM',
    category: 'vm',
  },
  {
    name: 'vm.disk.attach',
    description: 'Attach existing disk to VM',
    category: 'vm',
  },
  {
    name: 'vm.disk.change',
    description: 'Change VM disk properties (size, mode)',
    category: 'vm',
  },
  {
    name: 'vm.disk.create',
    description: 'Create disk and attach to VM',
    category: 'vm',
  },
  { name: 'vm.disk.promote', description: 'Promote VM disk', category: 'vm' },
  {
    name: 'vm.guest.tools',
    description: 'Manage guest tools in VM (mount/unmount/upgrade)',
    category: 'vm',
  },
  {
    name: 'vm.info',
    description: 'Display info for VM (general, resource, extraconfig)',
    category: 'vm',
  },
  { name: 'vm.instantclone', description: 'Instant Clone VM', category: 'vm' },
  { name: 'vm.ip', description: 'List IPs for VM', category: 'vm' },
  {
    name: 'vm.migrate',
    description: 'Migrate VM to a specific resource pool, host or datastore',
    category: 'vm',
  },
  {
    name: 'vm.network.add',
    description: 'Add network adapter to VM',
    category: 'vm',
  },
  {
    name: 'vm.network.change',
    description: 'Change network DEVICE configuration on VM',
    category: 'vm',
  },
  {
    name: 'vm.option.info',
    description: 'VM config options for CLUSTER',
    category: 'vm',
  },
  {
    name: 'vm.option.ls',
    description: 'List VM config option keys for CLUSTER',
    category: 'vm',
  },
  {
    name: 'vm.policy.ls',
    description: 'List VM storage policies',
    category: 'vm',
  },
  {
    name: 'vm.power',
    description: 'Invoke VM power operations (on/off/reset/suspend/reboot/shutdown)',
    category: 'vm',
  },
  {
    name: 'vm.question',
    description: 'Answer VM question prompt',
    category: 'vm',
  },
  {
    name: 'vm.register',
    description: 'Add an existing VM to the inventory',
    category: 'vm',
  },
  {
    name: 'vm.target.cap.ls',
    description: 'List VM config target capabilities',
    category: 'vm',
  },
  {
    name: 'vm.target.info',
    description: 'VM config target info',
    category: 'vm',
  },
  {
    name: 'vm.unregister',
    description: 'Remove VM from inventory without removing files on disk',
    category: 'vm',
  },
  {
    name: 'vm.upgrade',
    description: 'Upgrade VMs to latest hardware version',
    category: 'vm',
  },
  {
    name: 'vm.vnc',
    description: 'Enable or disable VNC for VM',
    category: 'vm',
  },

  // -- vSAN --
  {
    name: 'vsan.info',
    description: 'Display vSAN configuration',
    category: 'vsan',
  },

  // -- Datastore --
  {
    name: 'datastore.cluster.change',
    description: 'Change datastore cluster configuration',
    category: 'datastore',
  },
  {
    name: 'datastore.cluster.info',
    description: 'Display datastore cluster info',
    category: 'datastore',
  },
  {
    name: 'datastore.cp',
    description: 'Copy file on datastore',
    category: 'datastore',
  },
  {
    name: 'datastore.disk.info',
    description: 'Query VMDK info on datastore',
    category: 'datastore',
  },
  {
    name: 'datastore.info',
    description: 'Display info for datastores',
    category: 'datastore',
  },
  {
    name: 'datastore.ls',
    description: 'List files on datastore',
    category: 'datastore',
  },
  {
    name: 'datastore.maintenance.enter',
    description: 'Put datastore in maintenance mode',
    category: 'datastore',
  },
  {
    name: 'datastore.maintenance.exit',
    description: 'Take datastore out of maintenance mode',
    category: 'datastore',
  },
  {
    name: 'datastore.mv',
    description: 'Move file on datastore',
    category: 'datastore',
  },
  {
    name: 'datastore.tail',
    description: 'Output last part of datastore files',
    category: 'datastore',
  },
];

// ---------------------------------------------------------------------------
// 2. GOVC_TOOL_DEFS – typed MCP tools for agent-required commands
// ---------------------------------------------------------------------------

export const GOVC_TOOL_DEFS: GovcToolDef[] = [
  // ==========================================================================
  // Core / Navigation
  // ==========================================================================
  {
    command: 'about',
    description: 'Display About info for HOST (name, type, version, build number).',
    flags: {
      l: bool('Include service content'),
    },
  },
  {
    command: 'events',
    description: 'Display events. Optionally filter by type or follow.',
    flags: {
      f: bool('Follow event stream'),
      n: num('Output the last N events (default: 25)'),
      type: str('Include only specified event types'),
      l: bool('Long listing format'),
    },
    positionalArgs: '[PATH]...',
  },
  {
    command: 'find',
    description:
      'Find managed objects by type, name, or property. ROOT defaults to current datacenter. Type aliases: m=VirtualMachine, h=HostSystem, s=Datastore, c=ClusterComputeResource, etc.',
    flags: {
      type: str('Resource type filter'),
      name: str('Resource name glob pattern (default: *)'),
      l: bool('Long listing format'),
      i: bool('Print the managed object reference'),
      maxdepth: num('Max depth (-1 for unlimited)'),
    },
    positionalArgs: '[ROOT] [KEY VAL]...',
  },
  {
    command: 'logs',
    description: 'View VPX and ESX logs.',
    flags: {
      ...HOST,
      log: str('Log file key'),
      n: num('Output the last N log lines (default: 25)'),
      f: bool('Follow log file changes'),
    },
  },
  {
    command: 'logs.ls',
    description: 'List diagnostic log keys.',
    flags: {
      ...HOST,
    },
  },
  {
    command: 'ls',
    description:
      'List inventory items. PATH defaults to current datacenter. Supports type aliases: m=VirtualMachine, h=HostSystem, s=Datastore, c=ClusterComputeResource, etc.',
    flags: {
      l: bool('Long listing format'),
      t: str('Object type filter (e.g. m, h, s, c, d, f, n, p, r, w, g, a)'),
      i: bool('Print the managed object reference'),
      I: bool('Print the managed object ID'),
    },
    positionalArgs: 'PATH...',
  },
  {
    command: 'tasks',
    description: 'Display info for recent tasks.',
    flags: {
      f: bool('Follow recent task updates'),
      n: num('Output the last N tasks (default: 25)'),
      l: bool('Use long task description'),
      r: bool('Include child entities when PATH is specified'),
    },
    positionalArgs: '[PATH]',
  },
  {
    command: 'tree',
    description: 'List contents of the inventory in a tree-like format.',
    flags: {
      C: bool('Colorize output'),
      l: bool('Follow runtime references (e.g. HostSystem VMs)'),
      p: bool('Print the object type'),
      L: num('Max display depth of the inventory tree'),
    },
    positionalArgs: '[PATH]',
  },

  // ==========================================================================
  // Session
  // ==========================================================================
  {
    command: 'session.login',
    description:
      'Session login. Persists session token to ~/.govc/sessions. Use when you need to authenticate once and reuse the session across multiple calls.',
    flags: {
      l: str('User:password for VIM25 login'),
      cookie: str('Set VIM cookie for VIM25 login'),
      token: str('Use VIM25 token for login'),
      cert: str('Certificate file for VIM25 login'),
      key: str('Key file for VIM25 login'),
      extension: str('Extension key for login'),
      ticket: str('Use VIM25 login ticket'),
      issue: bool('Issue VIM25 login ticket'),
      renew: bool('Renew VIM25 ticket'),
    },
  },
  {
    command: 'session.logout',
    description: 'Session logout. Invalidates the current session.',
    flags: {},
  },
  {
    command: 'session.ls',
    description: 'List active sessions.',
    flags: {
      S: bool('List current SOAP session only'),
      r: bool('List cached REST session'),
    },
  },
  {
    command: 'session.rm',
    description: 'Remove active session by KEY.',
    flags: {},
    positionalArgs: 'KEY...',
  },

  // ==========================================================================
  // Snapshot
  // ==========================================================================
  {
    command: 'snapshot.create',
    description: 'Create snapshot of VM with NAME.',
    flags: {
      ...VM,
      d: str('Snapshot description'),
      m: bool('Include memory state (default: true)'),
      q: bool('Quiesce guest file system'),
    },
    positionalArgs: 'NAME',
  },
  {
    command: 'snapshot.export',
    description: 'Export snapshot of VM.',
    flags: {
      ...VM,
    },
    positionalArgs: 'NAME',
  },
  {
    command: 'snapshot.remove',
    description: 'Remove snapshot of VM. NAME can be snapshot name, tree path, moid, or "*" for all.',
    flags: {
      ...VM,
      c: bool('Consolidate disks (default: true)'),
      r: bool('Remove snapshot children'),
    },
    positionalArgs: 'NAME',
  },
  {
    command: 'snapshot.tree',
    description: 'List VM snapshots in a tree-like format.',
    flags: {
      ...VM,
      C: bool('Print current snapshot name only'),
      D: bool('Print snapshot creation date'),
      d: bool('Print snapshot description'),
      i: bool('Print snapshot id'),
      s: bool('Print snapshot size'),
    },
  },

  // ==========================================================================
  // Task
  // ==========================================================================
  {
    command: 'task.cancel',
    description: 'Cancel a running or queued task.',
    flags: {},
    positionalArgs: 'TASK...',
  },

  // ==========================================================================
  // VM
  // ==========================================================================
  {
    command: 'vm.change',
    description: 'Change VM configuration (CPU, memory, ExtraConfig, latency, etc.).',
    flags: {
      ...VM,
      c: num('Number of CPUs'),
      m: num('Size in MB of memory'),
      e: str('ExtraConfig key=value (can specify multiple)'),
      name: str('Display name'),
      annotation: str('VM description'),
      g: str('Guest OS'),
      latency: strEnum('Latency sensitivity', ['low', 'normal', 'medium', 'high']),
      'nested-hv-enabled': bool('Enable nested hardware-assisted virtualization'),
      'cpu-hot-add-enabled': bool('Enable CPU hot add'),
      'memory-hot-add-enabled': bool('Enable memory hot add'),
    },
  },
  {
    command: 'vm.clone',
    description: 'Clone VM or template to NAME.',
    flags: {
      ...VM,
      ...DS,
      ...FOLDER,
      ...HOST,
      ...POOL,
      c: num('Number of CPUs'),
      m: num('Size in MB of memory'),
      on: bool('Power on VM (default: true)'),
      link: bool('Create linked clone'),
      snapshot: str('Snapshot name to clone from'),
      template: bool('Create a template'),
      cluster: str('Use cluster for DRS placement'),
      customization: str('Customization specification name'),
      annotation: str('VM description'),
      ...NET,
    },
    positionalArgs: 'NAME',
  },
  {
    command: 'vm.create',
    description: 'Create VM. Use -on=false to create without powering on.',
    flags: {
      ...DS,
      ...FOLDER,
      ...HOST,
      ...POOL,
      c: num('Number of CPUs'),
      m: num('Size in MB of memory'),
      g: str('Guest OS ID (e.g. ubuntu64Guest, windows9_64Guest)'),
      disk: str('Disk path (existing) or size (new, e.g. 20GB)'),
      iso: str('ISO path'),
      ...NET,
      'net.adapter': str('Network adapter type (e.g. vmxnet3)'),
      'disk.controller': str('Disk controller type (e.g. pvscsi, scsi)'),
      firmware: strEnum('Firmware type', ['bios', 'efi']),
      on: bool('Power on VM (default: true)'),
      annotation: str('VM description'),
      cluster: str('Use cluster for VM placement via DRS'),
      version: str('ESXi hardware version'),
    },
    positionalArgs: 'NAME',
  },
  {
    command: 'vm.customize',
    description: 'Customize VM. Apply a customization specification to set hostname, IP, domain, DNS, etc.',
    flags: {
      ...VM,
      type: strEnum('Specification type', ['Linux', 'Windows']),
      name: str('Host name'),
      domain: str('Domain name'),
      'dns-server': str('DNS server list (comma-separated)'),
      'dns-suffix': str('DNS suffix list (comma-separated)'),
      ip: str('IP address'),
      'ip-mask': str('Subnet mask'),
      'ip-gw': str('Default gateway'),
      mac: str('MAC address'),
    },
    positionalArgs: 'VM...',
  },
  {
    command: 'vm.destroy',
    description: 'Power off and delete VM. Any attached virtual disks are also deleted.',
    flags: {},
    positionalArgs: 'VM...',
  },
  {
    command: 'vm.disk.attach',
    description: 'Attach existing disk to VM.',
    flags: {
      ...VM,
      ...DS,
      disk: str('Disk path name'),
      link: bool('Link attached disk (default: true)'),
      persist: bool('Persist attached disk (default: true)'),
      controller: str('Disk controller type (e.g. scsi, pvscsi, ide)'),
      mode: str('Disk mode (e.g. persistent, independent_persistent)'),
      sharing: str('Sharing (sharingNone, sharingMultiWriter)'),
    },
  },
  {
    command: 'vm.disk.change',
    description: 'Change VM disk properties (size, mode).',
    flags: {
      ...VM,
      disk: str('Disk label or file path'),
      name: str('Disk label'),
      filePath: str('Disk backing file path'),
      size: str('New disk size (e.g. 20GB)'),
      mode: str('Disk mode (e.g. persistent, independent_persistent)'),
      sharing: str('Sharing (sharingNone, sharingMultiWriter)'),
    },
  },
  {
    command: 'vm.disk.create',
    description: 'Create disk and attach to VM.',
    flags: {
      ...VM,
      ...DS,
      name: str('Disk path name', true),
      size: str('Disk size (e.g. 10GB)', true),
      controller: str('Disk controller type (e.g. scsi, pvscsi, ide)'),
      eager: bool('Eagerly scrub new disk'),
      thick: bool('Use thick provisioning'),
      mode: str('Disk mode (e.g. persistent, independent_persistent)'),
      sharing: str('Sharing (sharingNone, sharingMultiWriter)'),
    },
  },
  {
    command: 'vm.disk.promote',
    description: 'Promote VM linked-clone disk(s). Consolidates disks from snapshots for standalone use.',
    flags: {
      ...VM,
      linked: bool('Promote linked clones (default: true)'),
    },
  },
  {
    command: 'vm.guest.tools',
    description: 'Manage guest tools in VM. Actions: mount, unmount, upgrade, options.',
    flags: {
      ...VM,
      options: str('Options for tools upgrade (e.g. /S /v /qn)'),
    },
    positionalArgs: 'ACTION',
  },
  {
    command: 'vm.info',
    description: 'Display info for VM. Use -r for resource summary (CPU, memory, storage, networks).',
    flags: {
      ...VM,
      r: bool('Show resource summary'),
      e: bool('Show ExtraConfig'),
      t: bool('Show ToolsConfigInfo'),
      waitip: bool('Wait for VM to acquire IP address'),
    },
    positionalArgs: 'VM...',
  },
  {
    command: 'vm.instantclone',
    description: 'Instant Clone a running VM to create NAME.',
    flags: {
      ...VM,
      ...FOLDER,
      ...NET,
    },
    positionalArgs: 'NAME',
  },
  {
    command: 'vm.ip',
    description: 'List IPs for VM. By default waits up to 1h for vmware-tools to report.',
    flags: {
      a: bool('Wait for an IP address on all NICs'),
      v4: bool('Only report IPv4 addresses'),
      esxcli: bool('Use esxcli instead of guest tools'),
      n: str('Wait for IP on NIC (by device name or MAC)'),
      wait: str('Wait time (e.g. 5m, 1h)'),
    },
    positionalArgs: 'VM...',
  },
  {
    command: 'vm.migrate',
    description: 'Migrate VM to a specific resource pool, host or datastore.',
    flags: {
      ...VM,
      ...DS,
      ...HOST,
      ...POOL,
      ...NET,
      priority: str('Task priority (defaultPriority)'),
    },
    positionalArgs: 'VM...',
  },
  {
    command: 'vm.network.add',
    description: 'Add network adapter to VM.',
    flags: {
      ...VM,
      ...NET,
      'net.adapter': str('Network adapter type (e.g. vmxnet3, e1000e)'),
    },
  },
  {
    command: 'vm.network.change',
    description: 'Change network DEVICE configuration on VM.',
    flags: {
      ...VM,
      ...NET,
      'net.adapter': str('Network adapter type (e.g. vmxnet3, e1000e)'),
    },
    positionalArgs: 'DEVICE',
  },
  {
    command: 'vm.option.info',
    description: 'VM config options for CLUSTER.',
    flags: {
      ...CLUSTER,
      ...HOST,
      guest: str('Guest OS ID filter'),
    },
  },
  {
    command: 'vm.option.ls',
    description: 'List VM config option keys for CLUSTER.',
    flags: {
      ...CLUSTER,
      ...HOST,
    },
  },
  {
    command: 'vm.policy.ls',
    description: 'List VM storage policies.',
    flags: {
      ...VM,
      i: bool('List policy ID only'),
    },
  },
  {
    command: 'vm.power',
    description: 'Invoke VM power operations. Specify exactly one of the power flags.',
    flags: {
      on: bool('Power on'),
      off: bool('Power off'),
      reset: bool('Power reset'),
      suspend: bool('Power suspend'),
      r: bool('Reboot guest'),
      s: bool('Shutdown guest'),
      force: bool('Force (ignore state error, hard shutdown if tools unavailable)'),
      M: bool('Use Datacenter.PowerOnMultiVM method'),
    },
    positionalArgs: 'NAME...',
  },
  {
    command: 'vm.question',
    description: 'Answer VM question prompt. Without -answer, displays the pending question.',
    flags: {
      ...VM,
      answer: str('Answer to provide'),
    },
  },
  {
    command: 'vm.register',
    description: 'Add an existing VM (VMX file) to the inventory.',
    flags: {
      ...DS,
      ...FOLDER,
      ...HOST,
      ...POOL,
      name: str('Display name for the VM'),
      template: bool('Register as a template'),
    },
    positionalArgs: 'VMX',
  },
  {
    command: 'vm.target.cap.ls',
    description: 'List VM config target capabilities.',
    flags: {
      ...HOST,
      ...CLUSTER,
    },
  },
  {
    command: 'vm.target.info',
    description: 'VM config target info (networks, datastores, resource pools).',
    flags: {
      ...HOST,
      ...CLUSTER,
    },
  },
  {
    command: 'vm.unregister',
    description: 'Remove VM from inventory without removing files on disk.',
    flags: {},
    positionalArgs: 'VM...',
  },
  {
    command: 'vm.upgrade',
    description: 'Upgrade VMs to latest (or specified) hardware version.',
    flags: {
      ...VM,
      version: num('Target hardware version (e.g. 19, 20, 21)'),
    },
    positionalArgs: 'VM...',
  },
  {
    command: 'vm.vnc',
    description: 'Enable or disable VNC for VM.',
    flags: {
      ...VM,
      enable: bool('Enable VNC'),
      disable: bool('Disable VNC'),
      port: num('VNC port (default: -1 for auto)'),
      'port-range': str('VNC port range (e.g. 5900-5999)'),
      password: str('VNC password'),
    },
  },

  // ==========================================================================
  // vSAN
  // ==========================================================================
  {
    command: 'vsan.info',
    description: 'Display vSAN configuration.',
    flags: {},
    positionalArgs: 'CLUSTER...',
  },

  // ==========================================================================
  // Datastore
  // ==========================================================================
  {
    command: 'datastore.cluster.change',
    description: 'Change datastore cluster configuration.',
    flags: {
      'drs-enabled': bool('Enable Storage DRS'),
      'drs-mode': strEnum('Storage DRS automation level', ['manual', 'automated']),
    },
    positionalArgs: 'CLUSTER...',
  },
  {
    command: 'datastore.cluster.info',
    description: 'Display datastore cluster info.',
    flags: {},
    positionalArgs: '[PATH]...',
  },
  {
    command: 'datastore.cp',
    description: 'Copy file on datastore.',
    flags: {
      ...DS,
      f: bool('Force; overwrite destination if it exists'),
      'dc-target': str('Destination datacenter'),
      'ds-target': str('Destination datastore'),
    },
    positionalArgs: 'SRC DST',
  },
  {
    command: 'datastore.disk.info',
    description: 'Query VMDK info on datastore.',
    flags: {
      ...DS,
      p: bool('Include parent disk info'),
      c: bool('Chain: follow parent to top-level disk'),
      d: bool('Include disk details'),
    },
    positionalArgs: 'VMDK...',
  },
  {
    command: 'datastore.info',
    description: 'Display info for datastores.',
    flags: {
      H: bool('Display info for datastores shared between hosts'),
    },
    positionalArgs: '[PATH]...',
  },
  {
    command: 'datastore.ls',
    description: 'List files on datastore.',
    flags: {
      ...DS,
      l: bool('Long listing format'),
      R: bool('List subdirectories recursively'),
      a: bool('Show hidden entries'),
      p: bool('Append / indicator to directories'),
    },
    positionalArgs: '[FILE]...',
  },
  {
    command: 'datastore.maintenance.enter',
    description: 'Put datastore in maintenance mode.',
    flags: {},
    positionalArgs: 'DATASTORE...',
  },
  {
    command: 'datastore.maintenance.exit',
    description: 'Take datastore out of maintenance mode.',
    flags: {},
    positionalArgs: 'DATASTORE...',
  },
  {
    command: 'datastore.mv',
    description: 'Move file on datastore.',
    flags: {
      ...DS,
      f: bool('Force; overwrite destination if it exists'),
      'dc-target': str('Destination datacenter'),
      'ds-target': str('Destination datastore'),
    },
    positionalArgs: 'SRC DST',
  },
  {
    command: 'datastore.tail',
    description: 'Output last part of datastore files.',
    flags: {
      ...DS,
      n: num('Output the last N lines (default: 10)'),
      f: bool('Follow file changes'),
      c: num('Output the last N bytes'),
    },
    positionalArgs: 'PATH',
  },
];
