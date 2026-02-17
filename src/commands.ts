// ---------------------------------------------------------------------------
// govc MCP – Command Registry
// ---------------------------------------------------------------------------
// Two data structures:
//   1. GOVC_COMMAND_INDEX  – ALL ~300 commands (name + description) for search
//   2. GOVC_TOOL_DEFS      – ~50 most-used commands with typed flag schemas
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

const str = (description: string, required = false): FlagDef => ({ type: 'string', description, required });
const num = (description: string, required = false): FlagDef => ({ type: 'number', description, required });
const bool = (description: string): FlagDef => ({ type: 'boolean', description });
const strEnum = (description: string, values: string[]): FlagDef => ({ type: 'string', description, enum: values });

// Common flag groups
const VM = { vm: str('Virtual machine [GOVC_VM]') };
const HOST = { host: str('Host system [GOVC_HOST]') };
const DS = { ds: str('Datastore [GOVC_DATASTORE]') };
const CLUSTER = { cluster: str('Cluster [GOVC_CLUSTER]') };
const FOLDER = { folder: str('Inventory folder [GOVC_FOLDER]') };
const POOL = { pool: str('Resource pool [GOVC_RESOURCE_POOL]') };
const _NET = { net: str('Network [GOVC_NETWORK]') };

// ---------------------------------------------------------------------------
// 1. GOVC_COMMAND_INDEX – full catalogue for search
// ---------------------------------------------------------------------------

export const GOVC_COMMAND_INDEX: GovcCommandEntry[] = [
  // -- Core / Navigation --
  { name: 'about', description: 'Display About info for HOST (name, type, version, build)', category: 'core' },
  { name: 'about.cert', description: 'Display TLS certificate info for HOST', category: 'core' },
  { name: 'env', description: 'Output the environment variables for this client', category: 'core' },
  { name: 'find', description: 'Find managed objects by type, name, or property', category: 'core' },
  { name: 'ls', description: 'List inventory items', category: 'core' },
  { name: 'tree', description: 'List contents of the inventory in a tree-like format', category: 'core' },
  { name: 'version', description: 'Print govc version', category: 'core' },
  { name: 'collect', description: 'Collect managed object properties', category: 'core' },

  // -- VM --
  { name: 'vm.info', description: 'Display info for VM (general, resource, extraconfig)', category: 'vm' },
  { name: 'vm.create', description: 'Create VM', category: 'vm' },
  { name: 'vm.destroy', description: 'Power off and delete VM', category: 'vm' },
  { name: 'vm.clone', description: 'Clone VM or template to NAME', category: 'vm' },
  {
    name: 'vm.power',
    description: 'Invoke VM power operations (on/off/reset/suspend/reboot/shutdown)',
    category: 'vm',
  },
  { name: 'vm.change', description: 'Change VM configuration (CPU, memory, ExtraConfig, etc.)', category: 'vm' },
  { name: 'vm.ip', description: 'List IPs for VM', category: 'vm' },
  { name: 'vm.migrate', description: 'Migrate VM to a specific resource pool, host or datastore', category: 'vm' },
  { name: 'vm.console', description: 'Generate console URL or screen capture for VM', category: 'vm' },
  { name: 'vm.register', description: 'Add an existing VM to the inventory', category: 'vm' },
  { name: 'vm.unregister', description: 'Remove VM from inventory without removing files on disk', category: 'vm' },
  { name: 'vm.upgrade', description: 'Upgrade VMs to latest hardware version', category: 'vm' },
  { name: 'vm.markastemplate', description: 'Mark VM as a virtual machine template', category: 'vm' },
  { name: 'vm.markasvm', description: 'Mark VM template as a virtual machine', category: 'vm' },
  { name: 'vm.customize', description: 'Customize VM (hostname, IP, domain, etc.)', category: 'vm' },
  { name: 'vm.instantclone', description: 'Instant Clone VM', category: 'vm' },
  { name: 'vm.vnc', description: 'Enable or disable VNC for VM', category: 'vm' },
  { name: 'vm.keystrokes', description: 'Send keystrokes to VM', category: 'vm' },
  { name: 'vm.question', description: 'Answer VM question prompt', category: 'vm' },
  { name: 'vm.option.info', description: 'VM config options for CLUSTER', category: 'vm' },
  { name: 'vm.option.ls', description: 'List VM config option keys for CLUSTER', category: 'vm' },
  { name: 'vm.policy.ls', description: 'List VM storage policies', category: 'vm' },
  { name: 'vm.target.info', description: 'VM config target info', category: 'vm' },
  { name: 'vm.target.cap.ls', description: 'List VM config target capabilities', category: 'vm' },
  { name: 'vm.guest.tools', description: 'Manage guest tools in VM (mount/unmount/upgrade)', category: 'vm' },

  // -- VM Disk --
  { name: 'vm.disk.attach', description: 'Attach existing disk to VM', category: 'vm' },
  { name: 'vm.disk.change', description: 'Change VM disk properties (size, mode)', category: 'vm' },
  { name: 'vm.disk.create', description: 'Create disk and attach to VM', category: 'vm' },
  { name: 'vm.disk.promote', description: 'Promote VM disk', category: 'vm' },

  // -- VM Network --
  { name: 'vm.network.add', description: 'Add network adapter to VM', category: 'vm' },
  { name: 'vm.network.change', description: 'Change network DEVICE configuration on VM', category: 'vm' },

  // -- VM RDM --
  { name: 'vm.rdm.attach', description: 'Attach device to VM with RDM', category: 'vm' },
  { name: 'vm.rdm.ls', description: 'List available RDM devices for VM', category: 'vm' },

  // -- VM Dataset --
  { name: 'vm.dataset.create', description: 'Create data set on a VM', category: 'vm' },
  { name: 'vm.dataset.info', description: 'Display data set information', category: 'vm' },
  { name: 'vm.dataset.ls', description: 'List datasets on VM', category: 'vm' },
  { name: 'vm.dataset.rm', description: 'Delete data set from VM', category: 'vm' },
  { name: 'vm.dataset.update', description: 'Update data set on VM', category: 'vm' },
  { name: 'vm.dataset.entry.get', description: 'Read the value of a data set entry', category: 'vm' },
  { name: 'vm.dataset.entry.ls', description: 'List keys of entries in a data set', category: 'vm' },
  { name: 'vm.dataset.entry.rm', description: 'Delete data set entry', category: 'vm' },
  { name: 'vm.dataset.entry.set', description: 'Set the value of a data set entry', category: 'vm' },

  // -- Snapshot --
  { name: 'snapshot.create', description: 'Create snapshot of VM', category: 'snapshot' },
  { name: 'snapshot.remove', description: 'Remove snapshot of VM', category: 'snapshot' },
  { name: 'snapshot.revert', description: 'Revert to snapshot of VM', category: 'snapshot' },
  { name: 'snapshot.tree', description: 'List VM snapshots in a tree-like format', category: 'snapshot' },
  { name: 'snapshot.export', description: 'Export snapshot of VM', category: 'snapshot' },

  // -- Device --
  { name: 'device.boot', description: 'Configure VM boot settings', category: 'device' },
  { name: 'device.cdrom.add', description: 'Add CD-ROM device to VM', category: 'device' },
  { name: 'device.cdrom.eject', description: 'Eject media from CD-ROM device', category: 'device' },
  { name: 'device.cdrom.insert', description: 'Insert media into CD-ROM device', category: 'device' },
  { name: 'device.clock.add', description: 'Add precision clock device to VM', category: 'device' },
  { name: 'device.connect', description: 'Connect device on VM', category: 'device' },
  { name: 'device.disconnect', description: 'Disconnect device on VM', category: 'device' },
  { name: 'device.floppy.add', description: 'Add floppy device to VM', category: 'device' },
  { name: 'device.floppy.eject', description: 'Eject image from floppy device', category: 'device' },
  { name: 'device.floppy.insert', description: 'Insert image into floppy device', category: 'device' },
  { name: 'device.info', description: 'Device info for VM', category: 'device' },
  { name: 'device.ls', description: 'List devices for VM', category: 'device' },
  { name: 'device.model.tree', description: 'Print the device model as a tree', category: 'device' },
  { name: 'device.pci.add', description: 'Add PCI Passthrough device to VM', category: 'device' },
  { name: 'device.pci.ls', description: 'List allowed PCI passthrough devices for VM', category: 'device' },
  { name: 'device.pci.remove', description: 'Remove PCI Passthrough device from VM', category: 'device' },
  { name: 'device.remove', description: 'Remove device from VM', category: 'device' },
  { name: 'device.sata.add', description: 'Add SATA controller to VM', category: 'device' },
  { name: 'device.scsi.add', description: 'Add SCSI controller to VM', category: 'device' },
  { name: 'device.serial.add', description: 'Add serial port to VM', category: 'device' },
  { name: 'device.serial.connect', description: 'Connect service URI to serial port', category: 'device' },
  { name: 'device.serial.disconnect', description: 'Disconnect service URI from serial port', category: 'device' },
  { name: 'device.usb.add', description: 'Add USB device to VM', category: 'device' },

  // -- Host --
  { name: 'host.info', description: 'Display host info', category: 'host' },
  { name: 'host.add', description: 'Add host to datacenter', category: 'host' },
  { name: 'host.remove', description: 'Remove host from vCenter', category: 'host' },
  { name: 'host.disconnect', description: 'Disconnect host from vCenter', category: 'host' },
  { name: 'host.reconnect', description: 'Reconnect host to vCenter', category: 'host' },
  { name: 'host.shutdown', description: 'Shutdown or reboot host', category: 'host' },
  { name: 'host.maintenance.enter', description: 'Put host in maintenance mode', category: 'host' },
  { name: 'host.maintenance.exit', description: 'Take host out of maintenance mode', category: 'host' },
  { name: 'host.esxcli', description: 'Invoke esxcli command on host', category: 'host' },
  { name: 'host.service', description: 'Apply host service ACTION to service ID', category: 'host' },
  { name: 'host.service.ls', description: 'List host services', category: 'host' },
  { name: 'host.storage.info', description: 'Show host storage system information', category: 'host' },
  { name: 'host.storage.mark', description: 'Mark device as local or SSD', category: 'host' },
  { name: 'host.storage.partition', description: 'Show partition table for device', category: 'host' },
  { name: 'host.date.info', description: 'Display date and time info for host', category: 'host' },
  { name: 'host.date.change', description: 'Change date and time for host', category: 'host' },
  { name: 'host.cert.info', description: 'Display SSL certificate info for host', category: 'host' },
  { name: 'host.cert.csr', description: 'Generate CSR for host', category: 'host' },
  { name: 'host.cert.import', description: 'Install SSL certificate on host', category: 'host' },
  { name: 'host.option.ls', description: 'List host options', category: 'host' },
  { name: 'host.option.set', description: 'Set host option', category: 'host' },
  { name: 'host.portgroup.add', description: 'Add portgroup to host', category: 'host' },
  { name: 'host.portgroup.change', description: 'Change host portgroup configuration', category: 'host' },
  { name: 'host.portgroup.info', description: 'Display host portgroup info', category: 'host' },
  { name: 'host.portgroup.remove', description: 'Remove portgroup from host', category: 'host' },
  { name: 'host.vswitch.add', description: 'Add vSwitch to host', category: 'host' },
  { name: 'host.vswitch.info', description: 'Display vSwitch info for host', category: 'host' },
  { name: 'host.vswitch.remove', description: 'Remove vSwitch from host', category: 'host' },
  { name: 'host.vnic.info', description: 'Display virtual nic info', category: 'host' },
  { name: 'host.vnic.change', description: 'Change virtual nic properties', category: 'host' },
  { name: 'host.vnic.hint', description: 'Query virtual nic hints', category: 'host' },
  { name: 'host.vnic.service', description: 'Enable or disable service on virtual nic', category: 'host' },
  { name: 'host.account.create', description: 'Create local account on host', category: 'host' },
  { name: 'host.account.remove', description: 'Remove local account on host', category: 'host' },
  { name: 'host.account.update', description: 'Update local account on host', category: 'host' },
  { name: 'host.autostart.add', description: 'Add VM to host autostart', category: 'host' },
  { name: 'host.autostart.configure', description: 'Configure host autostart', category: 'host' },
  { name: 'host.autostart.info', description: 'Display host autostart info', category: 'host' },
  { name: 'host.autostart.remove', description: 'Remove VM from host autostart', category: 'host' },
  { name: 'host.tpm.info', description: 'TPM summary for host', category: 'host' },
  { name: 'host.tpm.report', description: 'TPM report for host', category: 'host' },

  // -- Cluster --
  { name: 'cluster.add', description: 'Add host to cluster', category: 'cluster' },
  { name: 'cluster.change', description: 'Change cluster configuration (DRS, HA, vSAN)', category: 'cluster' },
  { name: 'cluster.create', description: 'Create cluster in datacenter', category: 'cluster' },
  { name: 'cluster.mv', description: 'Move host to cluster', category: 'cluster' },
  { name: 'cluster.usage', description: 'Cluster resource usage summary', category: 'cluster' },
  { name: 'cluster.stretch', description: 'Convert vSAN cluster into stretched cluster', category: 'cluster' },
  { name: 'cluster.group.create', description: 'Create cluster group (VM or host)', category: 'cluster' },
  { name: 'cluster.group.change', description: 'Set cluster group members', category: 'cluster' },
  { name: 'cluster.group.ls', description: 'List cluster groups and members', category: 'cluster' },
  { name: 'cluster.group.remove', description: 'Remove cluster group', category: 'cluster' },
  {
    name: 'cluster.rule.create',
    description: 'Create cluster rule (affinity, anti-affinity, vm-host)',
    category: 'cluster',
  },
  { name: 'cluster.rule.change', description: 'Change cluster rule', category: 'cluster' },
  { name: 'cluster.rule.info', description: 'Cluster rule detailed info', category: 'cluster' },
  { name: 'cluster.rule.ls', description: 'List cluster rules and members', category: 'cluster' },
  { name: 'cluster.rule.remove', description: 'Remove cluster rule', category: 'cluster' },
  { name: 'cluster.override.change', description: 'Change cluster VM overrides (DRS, HA)', category: 'cluster' },
  { name: 'cluster.override.info', description: 'Cluster VM overrides info', category: 'cluster' },
  { name: 'cluster.override.remove', description: 'Remove cluster VM overrides', category: 'cluster' },
  { name: 'cluster.module.create', description: 'Create cluster module', category: 'cluster' },
  { name: 'cluster.module.ls', description: 'List cluster modules', category: 'cluster' },
  { name: 'cluster.module.rm', description: 'Delete cluster module', category: 'cluster' },
  { name: 'cluster.module.vm.add', description: 'Add VMs to cluster module', category: 'cluster' },
  { name: 'cluster.module.vm.rm', description: 'Remove VMs from cluster module', category: 'cluster' },
  { name: 'cluster.vlcm.enable', description: 'Enable vLCM on cluster (irreversible)', category: 'cluster' },
  { name: 'cluster.vlcm.info', description: 'Display software management status of cluster', category: 'cluster' },
  { name: 'cluster.draft.create', description: 'Create new software draft', category: 'cluster' },
  { name: 'cluster.draft.info', description: 'Display software draft details', category: 'cluster' },
  { name: 'cluster.draft.ls', description: 'List software drafts', category: 'cluster' },
  { name: 'cluster.draft.rm', description: 'Discard software draft', category: 'cluster' },
  { name: 'cluster.draft.commit', description: 'Commit software draft', category: 'cluster' },
  {
    name: 'cluster.draft.baseimage.info',
    description: 'Display base image version of software draft',
    category: 'cluster',
  },
  { name: 'cluster.draft.baseimage.set', description: 'Set ESXi base image on software draft', category: 'cluster' },
  { name: 'cluster.draft.component.add', description: 'Add component to software draft', category: 'cluster' },
  {
    name: 'cluster.draft.component.info',
    description: 'Display component details in software draft',
    category: 'cluster',
  },
  { name: 'cluster.draft.component.ls', description: 'List components in software draft', category: 'cluster' },
  { name: 'cluster.draft.component.rm', description: 'Remove component from software draft', category: 'cluster' },

  // -- Datacenter --
  { name: 'datacenter.create', description: 'Create datacenter', category: 'datacenter' },
  { name: 'datacenter.info', description: 'Display datacenter info', category: 'datacenter' },

  // -- Datastore --
  { name: 'datastore.info', description: 'Display info for datastores', category: 'datastore' },
  { name: 'datastore.ls', description: 'List files on datastore', category: 'datastore' },
  { name: 'datastore.create', description: 'Create datastore on host', category: 'datastore' },
  { name: 'datastore.remove', description: 'Remove datastore from host', category: 'datastore' },
  { name: 'datastore.mkdir', description: 'Create directory on datastore', category: 'datastore' },
  { name: 'datastore.rm', description: 'Remove file from datastore', category: 'datastore' },
  { name: 'datastore.mv', description: 'Move file on datastore', category: 'datastore' },
  { name: 'datastore.cp', description: 'Copy file on datastore', category: 'datastore' },
  { name: 'datastore.upload', description: 'Upload file to datastore', category: 'datastore' },
  { name: 'datastore.download', description: 'Download file from datastore', category: 'datastore' },
  { name: 'datastore.tail', description: 'Output last part of datastore files', category: 'datastore' },
  { name: 'datastore.maintenance.enter', description: 'Put datastore in maintenance mode', category: 'datastore' },
  { name: 'datastore.maintenance.exit', description: 'Take datastore out of maintenance mode', category: 'datastore' },
  { name: 'datastore.cluster.info', description: 'Display datastore cluster info', category: 'datastore' },
  { name: 'datastore.cluster.change', description: 'Change datastore cluster configuration', category: 'datastore' },
  { name: 'datastore.disk.create', description: 'Create VMDK on datastore', category: 'datastore' },
  { name: 'datastore.disk.extend', description: 'Extend VMDK on datastore', category: 'datastore' },
  { name: 'datastore.disk.inflate', description: 'Inflate VMDK on datastore', category: 'datastore' },
  { name: 'datastore.disk.info', description: 'Query VMDK info on datastore', category: 'datastore' },
  { name: 'datastore.disk.shrink', description: 'Shrink VMDK on datastore', category: 'datastore' },
  { name: 'datastore.vsan.dom.ls', description: 'List vSAN DOM objects', category: 'datastore' },
  { name: 'datastore.vsan.dom.rm', description: 'Remove vSAN DOM objects', category: 'datastore' },

  // -- Disk (First Class Disk / CNS) --
  { name: 'disk.attach', description: 'Attach disk ID on VM', category: 'disk' },
  { name: 'disk.create', description: 'Create first class disk', category: 'disk' },
  { name: 'disk.detach', description: 'Detach disk ID from VM', category: 'disk' },
  { name: 'disk.ls', description: 'List first class disk IDs', category: 'disk' },
  { name: 'disk.register', description: 'Register existing disk', category: 'disk' },
  { name: 'disk.rm', description: 'Remove first class disk', category: 'disk' },
  { name: 'disk.metadata.ls', description: 'List metadata for disk', category: 'disk' },
  { name: 'disk.metadata.update', description: 'Update metadata for disk', category: 'disk' },
  { name: 'disk.snapshot.create', description: 'Create snapshot of disk', category: 'disk' },
  { name: 'disk.snapshot.ls', description: 'List snapshots for disk', category: 'disk' },
  { name: 'disk.snapshot.rm', description: 'Remove disk snapshot', category: 'disk' },
  { name: 'disk.tags.attach', description: 'Attach tag to disk', category: 'disk' },
  { name: 'disk.tags.detach', description: 'Detach tag from disk', category: 'disk' },

  // -- Network (DVS) --
  { name: 'dvs.add', description: 'Add hosts to DVS', category: 'network' },
  { name: 'dvs.change', description: 'Change DVS properties (MTU, discovery)', category: 'network' },
  { name: 'dvs.create', description: 'Create DistributedVirtualSwitch', category: 'network' },
  { name: 'dvs.portgroup.add', description: 'Add portgroup to DVS', category: 'network' },
  { name: 'dvs.portgroup.change', description: 'Change DVS portgroup configuration', category: 'network' },
  { name: 'dvs.portgroup.info', description: 'Portgroup info for DVS', category: 'network' },

  // -- Firewall --
  { name: 'firewall.ruleset.find', description: 'Find firewall rulesets matching given rule', category: 'network' },

  // -- Guest Operations --
  { name: 'guest.chmod', description: 'Change file MODE on VM guest', category: 'guest' },
  { name: 'guest.chown', description: 'Change file UID/GID on VM guest', category: 'guest' },
  { name: 'guest.df', description: 'Report file system disk space usage on VM', category: 'guest' },
  { name: 'guest.download', description: 'Copy file from VM guest to local', category: 'guest' },
  { name: 'guest.getenv', description: 'Read environment variables from VM', category: 'guest' },
  { name: 'guest.kill', description: 'Kill process on VM guest', category: 'guest' },
  { name: 'guest.ls', description: 'List files in VM guest', category: 'guest' },
  { name: 'guest.mkdir', description: 'Create directory in VM guest', category: 'guest' },
  { name: 'guest.mktemp', description: 'Create temporary file or directory in VM', category: 'guest' },
  { name: 'guest.mv', description: 'Move/rename files in VM guest', category: 'guest' },
  { name: 'guest.ps', description: 'List processes in VM guest', category: 'guest' },
  { name: 'guest.rm', description: 'Remove file in VM guest', category: 'guest' },
  { name: 'guest.rmdir', description: 'Remove directory in VM guest', category: 'guest' },
  { name: 'guest.run', description: 'Run program in VM and display output', category: 'guest' },
  { name: 'guest.start', description: 'Start program in VM (async)', category: 'guest' },
  { name: 'guest.touch', description: 'Change file times on VM guest', category: 'guest' },
  { name: 'guest.upload', description: 'Copy file from local to VM guest', category: 'guest' },

  // -- Resource Pool --
  { name: 'pool.change', description: 'Change resource pool configuration', category: 'pool' },
  { name: 'pool.create', description: 'Create resource pool', category: 'pool' },
  { name: 'pool.destroy', description: 'Destroy resource pool', category: 'pool' },
  { name: 'pool.info', description: 'Display resource pool info', category: 'pool' },

  // -- Folder --
  { name: 'folder.create', description: 'Create folder', category: 'folder' },
  { name: 'folder.info', description: 'Display folder info', category: 'folder' },
  { name: 'folder.place', description: 'Get placement recommendation for existing VM', category: 'folder' },

  // -- Object --
  { name: 'object.destroy', description: 'Destroy managed objects', category: 'object' },
  { name: 'object.method', description: 'Enable or disable methods for managed objects', category: 'object' },
  { name: 'object.mv', description: 'Move managed entities to folder', category: 'object' },
  { name: 'object.reload', description: 'Reload managed object state', category: 'object' },
  { name: 'object.rename', description: 'Rename managed objects', category: 'object' },
  { name: 'object.save', description: 'Save managed objects (for vcsim)', category: 'object' },

  // -- Permissions --
  { name: 'permissions.ls', description: 'List permissions on managed entities', category: 'permissions' },
  { name: 'permissions.set', description: 'Set permissions on managed entities', category: 'permissions' },
  { name: 'permissions.remove', description: 'Remove permission from managed entities', category: 'permissions' },

  // -- Role --
  { name: 'role.create', description: 'Create authorization role', category: 'permissions' },
  { name: 'role.ls', description: 'List authorization roles', category: 'permissions' },
  { name: 'role.remove', description: 'Remove authorization role', category: 'permissions' },
  { name: 'role.update', description: 'Update authorization role privileges', category: 'permissions' },
  { name: 'role.usage', description: 'List usage for role', category: 'permissions' },

  // -- Tags --
  { name: 'tags.attach', description: 'Attach tag to object', category: 'tags' },
  { name: 'tags.attached.ls', description: 'List attached tags or objects', category: 'tags' },
  { name: 'tags.create', description: 'Create tag', category: 'tags' },
  { name: 'tags.detach', description: 'Detach tag from object', category: 'tags' },
  { name: 'tags.info', description: 'Display tag info', category: 'tags' },
  { name: 'tags.ls', description: 'List tags', category: 'tags' },
  { name: 'tags.rm', description: 'Delete tag', category: 'tags' },
  { name: 'tags.update', description: 'Update tag', category: 'tags' },
  { name: 'tags.category.create', description: 'Create tag category', category: 'tags' },
  { name: 'tags.category.info', description: 'Display tag category info', category: 'tags' },
  { name: 'tags.category.ls', description: 'List tag categories', category: 'tags' },
  { name: 'tags.category.rm', description: 'Delete tag category', category: 'tags' },
  { name: 'tags.category.update', description: 'Update tag category', category: 'tags' },

  // -- Content Library --
  { name: 'library.checkin', description: 'Check in VM to Content Library item', category: 'library' },
  { name: 'library.checkout', description: 'Check out Content Library item to VM', category: 'library' },
  { name: 'library.clone', description: 'Clone VM to Content Library', category: 'library' },
  { name: 'library.cp', description: 'Copy library item to another library', category: 'library' },
  { name: 'library.create', description: 'Create content library', category: 'library' },
  { name: 'library.deploy', description: 'Deploy library OVF template', category: 'library' },
  { name: 'library.evict', description: 'Evict library or item', category: 'library' },
  { name: 'library.export', description: 'Export library items', category: 'library' },
  { name: 'library.import', description: 'Import library items', category: 'library' },
  { name: 'library.info', description: 'Display library information', category: 'library' },
  { name: 'library.ls', description: 'List libraries, items, and files', category: 'library' },
  { name: 'library.policy.ls', description: 'List security policies for content libraries', category: 'library' },
  { name: 'library.publish', description: 'Publish library to subscribers', category: 'library' },
  { name: 'library.rm', description: 'Delete library or item', category: 'library' },
  { name: 'library.sync', description: 'Sync library or item', category: 'library' },
  { name: 'library.update', description: 'Update library or item', category: 'library' },
  { name: 'library.vmtx.info', description: 'Display VMTX template details', category: 'library' },
  { name: 'library.session.ls', description: 'List library item update sessions', category: 'library' },
  { name: 'library.session.rm', description: 'Remove library item update session', category: 'library' },
  { name: 'library.subscriber.create', description: 'Create library subscriber', category: 'library' },
  { name: 'library.subscriber.info', description: 'Library subscriber info', category: 'library' },
  { name: 'library.subscriber.ls', description: 'List library subscriptions', category: 'library' },
  { name: 'library.subscriber.rm', description: 'Delete library subscription', category: 'library' },
  { name: 'library.trust.create', description: 'Add certificate to library trust store', category: 'library' },
  { name: 'library.trust.info', description: 'Display trusted certificate info', category: 'library' },
  { name: 'library.trust.ls', description: 'List trusted certificates', category: 'library' },
  { name: 'library.trust.rm', description: 'Remove trusted certificate', category: 'library' },

  // -- Events / Tasks / Logs --
  { name: 'events', description: 'Display events', category: 'monitoring' },
  { name: 'tasks', description: 'Display info for recent tasks', category: 'monitoring' },
  { name: 'task.cancel', description: 'Cancel task', category: 'monitoring' },
  { name: 'logs', description: 'View VPX and ESX logs', category: 'monitoring' },
  { name: 'logs.ls', description: 'List diagnostic log keys', category: 'monitoring' },
  { name: 'logs.download', description: 'Generate diagnostic bundles', category: 'monitoring' },
  { name: 'alarms', description: 'Show triggered or declared alarms', category: 'monitoring' },
  { name: 'alarm.info', description: 'Alarm definition info', category: 'monitoring' },

  // -- Metrics --
  { name: 'metric.change', description: 'Change counter levels', category: 'metric' },
  { name: 'metric.info', description: 'Metric info', category: 'metric' },
  { name: 'metric.interval.change', description: 'Change historical metric intervals', category: 'metric' },
  { name: 'metric.interval.info', description: 'List historical metric intervals', category: 'metric' },
  { name: 'metric.ls', description: 'List available metrics', category: 'metric' },
  { name: 'metric.reset', description: 'Reset counter to default level', category: 'metric' },
  { name: 'metric.sample', description: 'Sample metric for object', category: 'metric' },

  // -- Session --
  { name: 'session.login', description: 'Session login', category: 'session' },
  { name: 'session.logout', description: 'Session logout', category: 'session' },
  { name: 'session.ls', description: 'List active sessions', category: 'session' },
  { name: 'session.rm', description: 'Remove active session', category: 'session' },

  // -- SSO --
  { name: 'sso.group.create', description: 'Create SSO group', category: 'sso' },
  { name: 'sso.group.ls', description: 'List SSO groups', category: 'sso' },
  { name: 'sso.group.rm', description: 'Remove SSO group', category: 'sso' },
  { name: 'sso.group.update', description: 'Update SSO group', category: 'sso' },
  { name: 'sso.user.create', description: 'Create SSO user', category: 'sso' },
  { name: 'sso.user.id', description: 'Print SSO user and group IDs', category: 'sso' },
  { name: 'sso.user.ls', description: 'List SSO users', category: 'sso' },
  { name: 'sso.user.rm', description: 'Remove SSO user', category: 'sso' },
  { name: 'sso.user.update', description: 'Update SSO user', category: 'sso' },
  { name: 'sso.idp.ls', description: 'List SSO identity provider sources', category: 'sso' },
  { name: 'sso.idp.default.ls', description: 'List SSO default identity provider sources', category: 'sso' },
  { name: 'sso.idp.default.update', description: 'Set SSO default identity provider source', category: 'sso' },
  { name: 'sso.idp.ldap.update', description: 'Update SSO LDAP identity provider', category: 'sso' },
  { name: 'sso.lpp.info', description: 'Get SSO local password policy', category: 'sso' },
  { name: 'sso.lpp.update', description: 'Update SSO local password policy', category: 'sso' },
  { name: 'sso.service.ls', description: 'List SSO platform services', category: 'sso' },

  // -- License --
  { name: 'license.add', description: 'Add license key', category: 'license' },
  { name: 'license.assign', description: 'Assign license to host or cluster', category: 'license' },
  { name: 'license.assigned.ls', description: 'List assigned licenses', category: 'license' },
  { name: 'license.decode', description: 'Decode license key', category: 'license' },
  { name: 'license.label.set', description: 'Set license label', category: 'license' },
  { name: 'license.ls', description: 'List licenses', category: 'license' },
  { name: 'license.remove', description: 'Remove license key', category: 'license' },

  // -- Storage Policy --
  { name: 'storage.policy.create', description: 'Create VM storage policy', category: 'storage' },
  { name: 'storage.policy.info', description: 'VM storage policy info', category: 'storage' },
  { name: 'storage.policy.ls', description: 'List VM storage policies', category: 'storage' },
  { name: 'storage.policy.rm', description: 'Remove storage policy', category: 'storage' },

  // -- Import / Export --
  { name: 'import.ova', description: 'Import OVA', category: 'import' },
  { name: 'import.ovf', description: 'Import OVF', category: 'import' },
  { name: 'import.spec', description: 'Generate OVF/OVA import spec', category: 'import' },
  { name: 'import.vmdk', description: 'Import VMDK to datastore', category: 'import' },
  { name: 'export.ovf', description: 'Export VM as OVF', category: 'import' },

  // -- Extension --
  { name: 'extension.info', description: 'Display extension info', category: 'extension' },
  { name: 'extension.register', description: 'Register extension', category: 'extension' },
  { name: 'extension.setcert', description: 'Set extension certificate', category: 'extension' },
  { name: 'extension.unregister', description: 'Unregister extension', category: 'extension' },

  // -- Custom Fields --
  { name: 'fields.add', description: 'Add custom field type', category: 'fields' },
  { name: 'fields.info', description: 'Display custom field values', category: 'fields' },
  { name: 'fields.ls', description: 'List custom field definitions', category: 'fields' },
  { name: 'fields.rename', description: 'Rename custom field', category: 'fields' },
  { name: 'fields.rm', description: 'Remove custom field', category: 'fields' },
  { name: 'fields.set', description: 'Set custom field values', category: 'fields' },

  // -- Options --
  { name: 'option.ls', description: 'List vCenter options', category: 'option' },
  { name: 'option.set', description: 'Set vCenter option', category: 'option' },

  // -- KMS --
  { name: 'kms.add', description: 'Add KMS cluster', category: 'kms' },
  { name: 'kms.default', description: 'Set default KMS cluster', category: 'kms' },
  { name: 'kms.export', description: 'Export KMS cluster for backup', category: 'kms' },
  { name: 'kms.ls', description: 'Display KMS info', category: 'kms' },
  { name: 'kms.rm', description: 'Remove KMS server or cluster', category: 'kms' },
  { name: 'kms.trust', description: 'Establish trust between KMS and vCenter', category: 'kms' },

  // -- GPU --
  { name: 'gpu.host.info', description: 'Display GPU information for a host', category: 'gpu' },
  { name: 'gpu.host.profile.ls', description: 'List available vGPU profiles on host', category: 'gpu' },
  { name: 'gpu.vm.add', description: 'Add vGPU to VM', category: 'gpu' },
  { name: 'gpu.vm.info', description: 'Display GPU information for a VM', category: 'gpu' },
  { name: 'gpu.vm.remove', description: 'Remove all vGPUs from VM', category: 'gpu' },

  // -- Namespace --
  { name: 'namespace.cluster.disable', description: 'Disable vSphere Namespaces on cluster', category: 'namespace' },
  { name: 'namespace.cluster.enable', description: 'Enable vSphere Namespaces on cluster', category: 'namespace' },
  { name: 'namespace.cluster.ls', description: 'List namespace enabled clusters', category: 'namespace' },
  { name: 'namespace.create', description: 'Create vSphere Namespace on Supervisor', category: 'namespace' },
  { name: 'namespace.info', description: 'Display vSphere Namespace details', category: 'namespace' },
  { name: 'namespace.ls', description: 'List vSphere Namespaces', category: 'namespace' },
  { name: 'namespace.rm', description: 'Delete vSphere Namespace', category: 'namespace' },
  { name: 'namespace.update', description: 'Modify vSphere Namespace', category: 'namespace' },
  { name: 'namespace.registervm', description: 'Register existing VM as VM Service managed', category: 'namespace' },
  { name: 'namespace.logs.download', description: 'Download namespace cluster support bundle', category: 'namespace' },
  { name: 'namespace.vmclass.create', description: 'Create virtual machine class', category: 'namespace' },
  { name: 'namespace.vmclass.info', description: 'Display virtual machine class details', category: 'namespace' },
  { name: 'namespace.vmclass.ls', description: 'List virtual machine classes', category: 'namespace' },
  { name: 'namespace.vmclass.rm', description: 'Delete virtual machine class', category: 'namespace' },
  { name: 'namespace.vmclass.update', description: 'Modify virtual machine class', category: 'namespace' },
  { name: 'namespace.service.activate', description: 'Activate Supervisor Service', category: 'namespace' },
  { name: 'namespace.service.create', description: 'Register Supervisor Service version', category: 'namespace' },
  { name: 'namespace.service.deactivate', description: 'Deactivate Supervisor Service', category: 'namespace' },
  { name: 'namespace.service.info', description: 'Get Supervisor Service info', category: 'namespace' },
  { name: 'namespace.service.ls', description: 'List Supervisor Services', category: 'namespace' },
  { name: 'namespace.service.rm', description: 'Remove Supervisor Service', category: 'namespace' },
  {
    name: 'namespace.service.version.activate',
    description: 'Activate Supervisor Service version',
    category: 'namespace',
  },
  {
    name: 'namespace.service.version.create',
    description: 'Register new Supervisor Service version',
    category: 'namespace',
  },
  {
    name: 'namespace.service.version.deactivate',
    description: 'Deactivate Supervisor Service version',
    category: 'namespace',
  },
  { name: 'namespace.service.version.info', description: 'Get Supervisor Service version info', category: 'namespace' },
  { name: 'namespace.service.version.ls', description: 'List Supervisor Service versions', category: 'namespace' },
  { name: 'namespace.service.version.rm', description: 'Remove Supervisor Service version', category: 'namespace' },

  // -- vApp --
  { name: 'vapp.destroy', description: 'Destroy vApp', category: 'vapp' },
  { name: 'vapp.power', description: 'Power on/off/suspend vApp', category: 'vapp' },

  // -- VCSA --
  { name: 'vcsa.access.consolecli.get', description: 'Get console CLI enabled state', category: 'vcsa' },
  { name: 'vcsa.access.consolecli.set', description: 'Set console CLI enabled state', category: 'vcsa' },
  { name: 'vcsa.access.dcui.get', description: 'Get DCUI enabled state', category: 'vcsa' },
  { name: 'vcsa.access.dcui.set', description: 'Set DCUI enabled state', category: 'vcsa' },
  { name: 'vcsa.access.shell.get', description: 'Get BASH shell enabled state', category: 'vcsa' },
  { name: 'vcsa.access.shell.set', description: 'Set BASH shell enabled state', category: 'vcsa' },
  { name: 'vcsa.access.ssh.get', description: 'Get SSH enabled state', category: 'vcsa' },
  { name: 'vcsa.access.ssh.set', description: 'Set SSH enabled state', category: 'vcsa' },
  { name: 'vcsa.log.forwarding.info', description: 'Retrieve VCSA log forwarding configuration', category: 'vcsa' },
  { name: 'vcsa.net.proxy.info', description: 'Retrieve VCSA networking proxy configuration', category: 'vcsa' },
  { name: 'vcsa.shutdown.cancel', description: 'Cancel pending shutdown action', category: 'vcsa' },
  { name: 'vcsa.shutdown.get', description: 'Get pending shutdown details', category: 'vcsa' },
  { name: 'vcsa.shutdown.poweroff', description: 'Power off the appliance', category: 'vcsa' },
  { name: 'vcsa.shutdown.reboot', description: 'Reboot the appliance', category: 'vcsa' },

  // -- vSAN --
  { name: 'vsan.change', description: 'Change vSAN configuration (unmap, file-service)', category: 'vsan' },
  { name: 'vsan.info', description: 'Display vSAN configuration', category: 'vsan' },

  // -- Volume (CNS) --
  { name: 'volume.extend', description: 'Extend CNS volume', category: 'volume' },
  { name: 'volume.ls', description: 'List CNS volumes', category: 'volume' },
  { name: 'volume.rm', description: 'Remove CNS volume', category: 'volume' },
  { name: 'volume.snapshot.create', description: 'Create snapshot of CNS volume', category: 'volume' },
  { name: 'volume.snapshot.ls', description: 'List CNS volume snapshots', category: 'volume' },
  { name: 'volume.snapshot.rm', description: 'Remove CNS volume snapshot', category: 'volume' },

  // -- vLCM --
  { name: 'vlcm.depot.baseimages.ls', description: 'List available ESXi base images', category: 'vlcm' },
  { name: 'vlcm.depot.offline.create', description: 'Create offline image depot', category: 'vlcm' },
  { name: 'vlcm.depot.offline.info', description: 'Display offline image depot contents', category: 'vlcm' },
  { name: 'vlcm.depot.offline.ls', description: 'List offline image depots', category: 'vlcm' },
  { name: 'vlcm.depot.offline.rm', description: 'Delete offline image depot', category: 'vlcm' },
];

// ---------------------------------------------------------------------------
// 2. GOVC_TOOL_DEFS – explicitly typed MCP tools for common commands
// ---------------------------------------------------------------------------

export const GOVC_TOOL_DEFS: GovcToolDef[] = [
  // ---- Core / Navigation ----
  {
    command: 'about',
    description: 'Display About info for HOST (name, type, version, build number)',
    flags: {
      l: bool('Include service content'),
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
    command: 'tree',
    description: 'List contents of the inventory in a tree-like format',
    flags: {
      C: bool('Colorize output'),
      l: bool('Follow runtime references (e.g. HostSystem VMs)'),
      p: bool('Print the object type'),
      L: num('Max display depth of the inventory tree'),
    },
    positionalArgs: '[PATH]',
  },
  {
    command: 'version',
    description: 'Print govc version',
    flags: {
      l: bool('Print detailed version information'),
    },
  },

  // ---- VM ----
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
      net: str('Network [GOVC_NETWORK]'),
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
    command: 'vm.destroy',
    description: 'Power off and delete VM. Any attached virtual disks are also deleted.',
    flags: {},
    positionalArgs: 'VM...',
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
      net: str('Network [GOVC_NETWORK]'),
    },
    positionalArgs: 'NAME',
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
    command: 'vm.change',
    description: 'Change VM configuration (CPU, memory, ExtraConfig, latency, etc.)',
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
      net: str('Network [GOVC_NETWORK]'),
      priority: str('Task priority (defaultPriority)'),
    },
    positionalArgs: 'VM...',
  },
  {
    command: 'vm.console',
    description: 'Generate console URL or screen capture for VM.',
    flags: {
      ...VM,
      h5: bool('Generate HTML5 UI console link'),
      capture: str('Capture screen shot to file'),
    },
    positionalArgs: 'VM',
  },

  // ---- Snapshot ----
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
    command: 'snapshot.revert',
    description: 'Revert to snapshot of VM. If NAME not provided, revert to current snapshot.',
    flags: {
      ...VM,
      s: bool('Suppress power on'),
    },
    positionalArgs: '[NAME]',
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

  // ---- Device ----
  {
    command: 'device.info',
    description: 'Device info for VM. Optionally filter by device name pattern.',
    flags: VM,
    positionalArgs: '[DEVICE]...',
  },
  {
    command: 'device.ls',
    description: 'List devices for VM.',
    flags: {
      ...VM,
      boot: bool('List devices configured in boot options'),
    },
  },

  // ---- Host ----
  {
    command: 'host.info',
    description: 'Display host info.',
    flags: HOST,
  },
  {
    command: 'host.maintenance.enter',
    description: 'Put host in maintenance mode. No VMs can be powered on during maintenance.',
    flags: {
      ...HOST,
      evacuate: bool('Evacuate powered off VMs'),
      timeout: num('Timeout in seconds'),
    },
    positionalArgs: 'HOST...',
  },
  {
    command: 'host.maintenance.exit',
    description: 'Take host out of maintenance mode.',
    flags: {
      ...HOST,
      timeout: num('Timeout in seconds'),
    },
    positionalArgs: 'HOST...',
  },
  {
    command: 'host.esxcli',
    description: 'Invoke esxcli command on host. Example: govc host.esxcli network ip connection list',
    flags: HOST,
    positionalArgs: 'COMMAND [ARG]...',
  },
  {
    command: 'host.shutdown',
    description: 'Shutdown or reboot host.',
    flags: {
      ...HOST,
      f: bool('Force shutdown when host is not in maintenance mode'),
      r: bool('Reboot host'),
    },
    positionalArgs: 'HOST...',
  },
  {
    command: 'host.service',
    description: 'Apply host service ACTION (start|stop|restart|status|enable|disable) to service ID.',
    flags: HOST,
    positionalArgs: 'ACTION ID',
  },
  {
    command: 'host.service.ls',
    description: 'List host services.',
    flags: HOST,
  },

  // ---- Cluster ----
  {
    command: 'cluster.create',
    description: 'Create cluster in datacenter.',
    flags: {
      ...FOLDER,
    },
    positionalArgs: 'CLUSTER',
  },
  {
    command: 'cluster.change',
    description: 'Change cluster configuration (DRS, HA, vSAN).',
    flags: {
      'drs-enabled': bool('Enable DRS'),
      'drs-mode': strEnum('DRS behavior', ['manual', 'partiallyAutomated', 'fullyAutomated']),
      'drs-vmotion-rate': num('Aggressiveness of vMotions (1-5)'),
      'ha-enabled': bool('Enable HA'),
      'ha-admission-control-enabled': bool('Enable HA admission control'),
      'vsan-enabled': bool('Enable vSAN'),
      'vsan-autoclaim': bool('Autoclaim storage on cluster hosts'),
    },
    positionalArgs: 'CLUSTER...',
  },
  {
    command: 'cluster.add',
    description: 'Add host to cluster.',
    flags: {
      ...CLUSTER,
      hostname: str('Hostname or IP of the host', true),
      username: str('Username of admin account on the host', true),
      password: str('Password of admin account on the host', true),
      thumbprint: str('SHA-1 thumbprint of host SSL certificate'),
      noverify: bool('Accept host thumbprint without verification'),
      license: str('Assign license key'),
      force: bool('Force when host is managed by another VC'),
    },
  },
  {
    command: 'cluster.usage',
    description: 'Cluster resource usage summary (CPU, memory, storage).',
    flags: {
      S: bool('Exclude host local storage'),
    },
    positionalArgs: 'CLUSTER',
  },

  // ---- Datacenter ----
  {
    command: 'datacenter.create',
    description: 'Create datacenter.',
    flags: FOLDER,
    positionalArgs: 'NAME...',
  },
  {
    command: 'datacenter.info',
    description: 'Display datacenter info.',
    flags: {},
    positionalArgs: '[PATH]...',
  },

  // ---- Datastore ----
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
    command: 'datastore.create',
    description: 'Create datastore on host (NFS, VMFS, local).',
    flags: {
      ...HOST,
      type: strEnum('Datastore type', ['NFS', 'NFS41', 'CIFS', 'VMFS', 'local']),
      name: str('Datastore name', true),
      disk: str('Canonical name of disk (VMFS only)'),
      'remote-host': str('Remote hostname (NFS)'),
      'remote-path': str('Remote path (NFS)'),
      path: str('Local directory path (local only)'),
      mode: strEnum('Access mode', ['readOnly', 'readWrite']),
    },
    positionalArgs: 'HOST...',
  },

  // ---- Network ----
  {
    command: 'dvs.create',
    description: 'Create DistributedVirtualSwitch in datacenter.',
    flags: {
      ...FOLDER,
      mtu: num('DVS Max MTU'),
      'discovery-protocol': strEnum('Link Discovery Protocol', ['lldp', 'cdp']),
      'num-uplinks': num('Number of uplinks'),
      'product-version': str('DVS product version'),
    },
    positionalArgs: 'DVS',
  },
  {
    command: 'dvs.portgroup.add',
    description: 'Add portgroup to DVS.',
    flags: {
      dvs: str('DVS path', true),
      type: strEnum('Portgroup type / port binding', ['earlyBinding', 'lateBinding', 'ephemeral']),
      nports: num('Number of ports (default: 128)'),
      vlan: num('VLAN ID'),
    },
    positionalArgs: 'NAME',
  },
  {
    command: 'dvs.portgroup.info',
    description: 'Portgroup info for DVS.',
    flags: {
      pg: str('Distributed Virtual Portgroup'),
      r: bool('Show DVS rules'),
    },
    positionalArgs: 'DVS',
  },

  // ---- Tags ----
  {
    command: 'tags.ls',
    description: 'List tags, optionally filtered by category.',
    flags: {
      c: str('Category name'),
    },
  },
  {
    command: 'tags.create',
    description: 'Create tag. Category (-c) is required.',
    flags: {
      c: str('Category name', true),
      d: str('Description of tag'),
    },
    positionalArgs: 'NAME',
  },
  {
    command: 'tags.attach',
    description: 'Attach tag NAME to object PATH.',
    flags: {
      c: str('Tag category'),
    },
    positionalArgs: 'NAME PATH',
  },
  {
    command: 'tags.detach',
    description: 'Detach tag NAME from object PATH.',
    flags: {
      c: str('Tag category'),
    },
    positionalArgs: 'NAME PATH',
  },
  {
    command: 'tags.category.create',
    description: 'Create tag category.',
    flags: {
      d: str('Description'),
      m: bool('Allow multiple tags per object'),
      t: str('Object types (can specify multiple)'),
    },
    positionalArgs: 'NAME',
  },
  {
    command: 'tags.category.ls',
    description: 'List all tag categories.',
    flags: {},
  },

  // ---- Content Library ----
  {
    command: 'library.ls',
    description: 'List libraries, items, and files.',
    flags: {},
    positionalArgs: '[PATH]',
  },
  {
    command: 'library.info',
    description: 'Display library information.',
    flags: {
      l: bool('Long listing format'),
      L: bool('List datastore path only'),
      U: bool('List pub/sub URL(s) only'),
    },
    positionalArgs: '[PATH]',
  },
  {
    command: 'library.create',
    description: 'Create content library.',
    flags: {
      ...DS,
      pub: bool('Publish library'),
      sub: str('Subscribe to library URL'),
    },
    positionalArgs: 'NAME',
  },
  {
    command: 'library.deploy',
    description: 'Deploy library OVF template.',
    flags: {
      ...DS,
      ...FOLDER,
      ...HOST,
      ...POOL,
      options: str('Options spec file path for VM deployment'),
    },
    positionalArgs: 'TEMPLATE [NAME]',
  },
  {
    command: 'library.rm',
    description: 'Delete library or item.',
    flags: {},
    positionalArgs: 'NAME',
  },
  {
    command: 'library.import',
    description: 'Import items to library (OVA, OVF, ISO, VMDK).',
    flags: {
      n: str('Library item name'),
      t: str('Library item type'),
      pull: bool('Pull library item from HTTP endpoint'),
    },
    positionalArgs: 'LIBRARY ITEM',
  },

  // ---- Guest Operations ----
  {
    command: 'guest.run',
    description: 'Run program in VM and display output. Waits for exit, propagates exit code.',
    flags: {
      ...VM,
      l: str('Guest VM credentials (user:password) [GOVC_GUEST_LOGIN]'),
      C: str('Working directory for the program'),
      e: str('Set environment variables (key=val)'),
      d: str('Input data string ("-" reads from stdin)'),
    },
    positionalArgs: 'PATH [ARG]...',
  },
  {
    command: 'guest.ps',
    description: 'List processes in VM guest.',
    flags: {
      ...VM,
      l: str('Guest VM credentials (user:password) [GOVC_GUEST_LOGIN]'),
      e: bool('Select all processes'),
      p: str('Select by process ID'),
      U: str('Select by process UID'),
    },
  },
  {
    command: 'guest.ls',
    description: 'List files in VM guest.',
    flags: {
      ...VM,
      l: str('Guest VM credentials (user:password) [GOVC_GUEST_LOGIN]'),
    },
    positionalArgs: 'PATH',
  },

  // ---- Resource Pool ----
  {
    command: 'pool.info',
    description: 'Display resource pool info.',
    flags: {
      a: bool('List virtual app resource pools'),
      p: bool('List resource pools (default: true)'),
    },
    positionalArgs: 'POOL...',
  },
  {
    command: 'pool.create',
    description: 'Create resource pool.',
    flags: {
      'cpu.reservation': num('CPU reservation in MHz'),
      'cpu.limit': num('CPU limit in MHz (-1 unlimited)'),
      'cpu.shares': str('CPU shares level or number'),
      'mem.reservation': num('Memory reservation in MB'),
      'mem.limit': num('Memory limit in MB (-1 unlimited)'),
      'mem.shares': str('Memory shares level or number'),
    },
    positionalArgs: 'POOL...',
  },

  // ---- Permissions ----
  {
    command: 'permissions.ls',
    description: 'List permissions defined on managed entities.',
    flags: {
      a: bool('Include inherited permissions (default: true)'),
    },
    positionalArgs: '[PATH]...',
  },
  {
    command: 'permissions.set',
    description: 'Set permissions on managed entities.',
    flags: {
      principal: str('User or group', true),
      role: str('Permission role name (default: Admin)'),
      propagate: bool('Propagate down the hierarchy (default: true)'),
      group: bool('True if principal is a group name'),
    },
    positionalArgs: '[PATH]...',
  },

  // ---- Events / Tasks / Logs ----
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
    command: 'logs',
    description: 'View VPX and ESX logs.',
    flags: {
      ...HOST,
      log: str('Log file key'),
      n: num('Output the last N log lines (default: 25)'),
      f: bool('Follow log file changes'),
    },
  },

  // ---- Metrics ----
  {
    command: 'metric.ls',
    description: 'List available metrics for PATH.',
    flags: {
      l: bool('Long listing format'),
      L: bool('Longer listing (units, instance count, description)'),
      g: str('List a specific group'),
      i: str('Interval ID (real|day|week|month|year)'),
    },
    positionalArgs: 'PATH',
  },
  {
    command: 'metric.sample',
    description: 'Sample metric for object. Interval defaults to 20 (realtime) if supported.',
    flags: {
      n: num('Max number of samples (default: 5)'),
      instance: str('Instance (default: * for all)'),
      i: str('Interval ID (real|day|week|month|year)'),
      t: bool('Include sample times'),
    },
    positionalArgs: 'PATH... NAME...',
  },

  // ---- Import ----
  {
    command: 'import.ova',
    description: 'Import OVA.',
    flags: {
      ...DS,
      ...FOLDER,
      ...HOST,
      ...POOL,
      name: str('Name for new entity'),
      net: str('Network'),
      options: str('Options spec file path'),
    },
    positionalArgs: 'PATH_TO_OVA',
  },

  // ---- Storage Policy ----
  {
    command: 'storage.policy.ls',
    description: 'List VM storage policies.',
    flags: {
      i: bool('List policy ID only'),
    },
    positionalArgs: '[NAME]',
  },

  // ---- Session ----
  {
    command: 'session.ls',
    description: 'List active sessions.',
    flags: {
      S: bool('List current SOAP session only'),
      r: bool('List cached REST session'),
    },
  },

  // ---- vSAN ----
  {
    command: 'vsan.info',
    description: 'Display vSAN configuration.',
    flags: {},
    positionalArgs: 'CLUSTER...',
  },

  // ---- Alarms ----
  {
    command: 'alarms',
    description: 'Show triggered or declared alarms.',
    flags: {
      d: bool('Show declared alarms'),
      l: bool('Long listing output'),
      n: str('Filter by alarm name'),
      ack: bool('Acknowledge alarms'),
    },
    positionalArgs: '[PATH]',
  },
];
