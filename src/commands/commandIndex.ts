import type { GovcCommandEntry } from './types';

// ---------------------------------------------------------------------------
// GOVC_COMMAND_INDEX – agent-required commands for search
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
