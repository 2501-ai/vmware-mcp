# VMware MCP — LLM Tool Guide

You have access to a VMware vSphere environment through MCP tools that wrap the `govc` CLI. This document describes every available tool, how to call them, and recommended workflows.

---

## How Tools Work

Every tool returns a JSON object with this shape:

```json
{
  "success": true,
  "exitCode": 0,
  "data": { ... }
}
```

On failure:

```json
{
  "success": false,
  "exitCode": 1,
  "error": "error message"
}
```

Most tools request JSON output from govc automatically. The parsed result is in `data`. If the command doesn't support JSON, the raw text is in `raw` instead.

---

## Meta Tools (Start Here)

These three tools help you discover and run any govc command.

### `govc_search`

Search across all ~300 govc commands by keyword. **Use this first** when you're unsure which tool to use.

| Parameter | Type   | Required | Description                          |
| --------- | ------ | -------- | ------------------------------------ |
| `query`   | string | ✅       | Search query (e.g. "vm power", "snapshot", "datastore") |
| `limit`   | number |          | Max results (default: 15)            |

### `govc_help`

Get the full help text for any govc command, including all flags and usage examples.

| Parameter | Type   | Required | Description                          |
| --------- | ------ | -------- | ------------------------------------ |
| `command` | string | ✅       | Command name (e.g. "vm.info", "snapshot.create") |

### `govc_run`

Escape hatch — run any govc command directly. Use this for commands that don't have a dedicated typed tool.

| Parameter | Type    | Required | Description                          |
| --------- | ------- | -------- | ------------------------------------ |
| `command` | string  | ✅       | The govc sub-command (e.g. "host.info") |
| `flags`   | object  |          | Flag key-value pairs **without** leading dashes. Example: `{"vm": "my-vm", "r": true}` |
| `args`    | string  |          | Positional arguments as a space-separated string. Supports quoting. |
| `json`    | boolean |          | Request JSON output (default: true). Set false for commands that don't support it. |

---

## Typed Tools Reference

Typed tools have validated parameters and descriptions. Tool names use underscores where the govc command uses dots (e.g. `vm.info` → `vm_info`).

All typed tools accept an optional `_args` string parameter for positional arguments (space-separated, supports quoting).

---

### Navigation

#### `about`
Display vCenter/ESXi info (name, type, version, build).

| Flag | Type    | Description              |
| ---- | ------- | ------------------------ |
| `l`  | boolean | Include service content  |

#### `events`
Display events. Optionally filter by type or follow.

| Flag   | Type    | Description                        |
| ------ | ------- | ---------------------------------- |
| `f`    | boolean | Follow event stream                |
| `n`    | number  | Output the last N events (default: 25) |
| `type` | string  | Include only specified event types  |
| `l`    | boolean | Long listing format                |

`_args`: `[PATH]...`

#### `find`
Find managed objects by type, name, or property. Type aliases: `m`=VirtualMachine, `h`=HostSystem, `s`=Datastore, `c`=ClusterComputeResource.

| Flag       | Type    | Description                       |
| ---------- | ------- | --------------------------------- |
| `type`     | string  | Resource type filter              |
| `name`     | string  | Resource name glob pattern        |
| `l`        | boolean | Long listing format               |
| `i`        | boolean | Print managed object reference    |
| `maxdepth` | number  | Max depth (-1 for unlimited)      |

`_args`: `[ROOT] [KEY VAL]...`

#### `logs`
View VPX and ESX logs.

| Flag   | Type    | Description                       |
| ------ | ------- | --------------------------------- |
| `host` | string  | Host system [GOVC_HOST]           |
| `log`  | string  | Log file key                      |
| `n`    | number  | Output the last N log lines (default: 25) |
| `f`    | boolean | Follow log file changes           |

#### `logs_ls`
List diagnostic log keys.

| Flag   | Type   | Description             |
| ------ | ------ | ----------------------- |
| `host` | string | Host system [GOVC_HOST] |

#### `ls`
List inventory items. PATH defaults to current datacenter.

| Flag | Type    | Description                          |
| ---- | ------- | ------------------------------------ |
| `l`  | boolean | Long listing format                  |
| `t`  | string  | Object type filter (e.g. m, h, s, c) |
| `i`  | boolean | Print managed object reference       |
| `I`  | boolean | Print managed object ID              |

`_args`: `PATH...`

#### `tasks`
Display info for recent tasks.

| Flag | Type    | Description                        |
| ---- | ------- | ---------------------------------- |
| `f`  | boolean | Follow recent task updates         |
| `n`  | number  | Output the last N tasks (default: 25) |
| `l`  | boolean | Use long task description          |
| `r`  | boolean | Include child entities             |

`_args`: `[PATH]`

#### `tree`
List inventory contents in a tree-like format.

| Flag | Type    | Description                                  |
| ---- | ------- | -------------------------------------------- |
| `C`  | boolean | Colorize output                              |
| `l`  | boolean | Follow runtime references (e.g. HostSystem VMs) |
| `p`  | boolean | Print the object type                        |
| `L`  | number  | Max display depth of the inventory tree      |

`_args`: `[PATH]`

---

### Session

#### `session_login`
Persist session token to ~/.govc/sessions.

| Flag        | Type    | Description                    |
| ----------- | ------- | ------------------------------ |
| `l`         | string  | User:password for login        |
| `cookie`    | string  | Set VIM cookie                 |
| `token`     | string  | Use VIM25 token                |
| `cert`      | string  | Certificate file               |
| `key`       | string  | Key file                       |
| `extension` | string  | Extension key                  |
| `ticket`    | string  | Use VIM25 login ticket         |
| `issue`     | boolean | Issue VIM25 login ticket       |
| `renew`     | boolean | Renew VIM25 ticket             |

#### `session_logout`
Invalidates the current session. No flags.

#### `session_ls`
List active sessions.

| Flag | Type    | Description                    |
| ---- | ------- | ------------------------------ |
| `S`  | boolean | List current SOAP session only |
| `r`  | boolean | List cached REST session       |

#### `session_rm`
Remove active session by KEY.

`_args`: `KEY...`

---

### Snapshots

#### `snapshot_create`
Create snapshot of a VM.

| Flag  | Type    | Description                          |
| ----- | ------- | ------------------------------------ |
| `vm`  | string  | Virtual machine [GOVC_VM]            |
| `d`   | string  | Snapshot description                 |
| `m`   | boolean | Include memory state (default: true) |
| `q`   | boolean | Quiesce guest file system            |

`_args`: `NAME` (required — the snapshot name)

#### `snapshot_export`
Export snapshot of a VM.

| Flag | Type   | Description               |
| ---- | ------ | ------------------------- |
| `vm` | string | Virtual machine [GOVC_VM] |

`_args`: `NAME`

#### `snapshot_remove`
Remove snapshot. NAME can be snapshot name, tree path, moid, or `*` for all.

| Flag | Type    | Description                      |
| ---- | ------- | -------------------------------- |
| `vm` | string  | Virtual machine [GOVC_VM]        |
| `c`  | boolean | Consolidate disks (default: true)|
| `r`  | boolean | Remove snapshot children         |

`_args`: `NAME`

#### `snapshot_tree`
List VM snapshots in a tree-like format.

| Flag | Type    | Description                    |
| ---- | ------- | ------------------------------ |
| `vm` | string  | Virtual machine [GOVC_VM]      |
| `C`  | boolean | Print current snapshot name only |
| `D`  | boolean | Print snapshot creation date   |
| `d`  | boolean | Print snapshot description     |
| `i`  | boolean | Print snapshot id              |
| `s`  | boolean | Print snapshot size            |

---

### Task

#### `task_cancel`
Cancel a running or queued task.

`_args`: `TASK...`

---

### VM Lifecycle

#### `vm_create`
Create a new VM. Use `on: false` to create without powering on.

| Flag              | Type    | Description                              |
| ----------------- | ------- | ---------------------------------------- |
| `ds`              | string  | Datastore [GOVC_DATASTORE]               |
| `folder`          | string  | Inventory folder [GOVC_FOLDER]           |
| `host`            | string  | Host system [GOVC_HOST]                  |
| `pool`            | string  | Resource pool [GOVC_RESOURCE_POOL]       |
| `c`               | number  | Number of CPUs                           |
| `m`               | number  | Size in MB of memory                     |
| `g`               | string  | Guest OS ID (e.g. ubuntu64Guest)         |
| `disk`            | string  | Disk path (existing) or size (e.g. 20GB) |
| `iso`             | string  | ISO path                                 |
| `net`             | string  | Network [GOVC_NETWORK]                   |
| `net.adapter`     | string  | Network adapter type (e.g. vmxnet3)      |
| `disk.controller` | string  | Disk controller type (e.g. pvscsi)       |
| `firmware`        | string  | `bios` or `efi`                          |
| `on`              | boolean | Power on VM (default: true)              |
| `annotation`      | string  | VM description                           |
| `cluster`         | string  | Use cluster for DRS placement            |
| `version`         | string  | ESXi hardware version                    |

`_args`: `NAME` (required — the VM name)

#### `vm_clone`
Clone VM or template to a new name.

| Flag            | Type    | Description                          |
| --------------- | ------- | ------------------------------------ |
| `vm`            | string  | Source VM [GOVC_VM]                  |
| `ds`            | string  | Datastore [GOVC_DATASTORE]           |
| `folder`        | string  | Inventory folder [GOVC_FOLDER]       |
| `host`          | string  | Host system [GOVC_HOST]              |
| `pool`          | string  | Resource pool [GOVC_RESOURCE_POOL]   |
| `c`             | number  | Number of CPUs                       |
| `m`             | number  | Size in MB of memory                 |
| `on`            | boolean | Power on VM (default: true)          |
| `link`          | boolean | Create linked clone                  |
| `snapshot`      | string  | Snapshot name to clone from          |
| `template`      | boolean | Create a template                    |
| `cluster`       | string  | Use cluster for DRS placement        |
| `customization` | string  | Customization specification name     |
| `annotation`    | string  | VM description                       |
| `net`           | string  | Network [GOVC_NETWORK]               |

`_args`: `NAME` (required — the new VM name)

#### `vm_instantclone`
Instant Clone a running VM.

| Flag     | Type   | Description                        |
| -------- | ------ | ---------------------------------- |
| `vm`     | string | Source VM [GOVC_VM]                |
| `folder` | string | Inventory folder [GOVC_FOLDER]     |
| `net`    | string | Network [GOVC_NETWORK]             |

`_args`: `NAME` (required — the new VM name)

#### `vm_destroy`
Power off and delete VM. Attached virtual disks are also deleted.

`_args`: `VM...`

#### `vm_register`
Add an existing VM (VMX file) to the inventory.

| Flag       | Type    | Description                        |
| ---------- | ------- | ---------------------------------- |
| `ds`       | string  | Datastore [GOVC_DATASTORE]         |
| `folder`   | string  | Inventory folder [GOVC_FOLDER]     |
| `host`     | string  | Host system [GOVC_HOST]            |
| `pool`     | string  | Resource pool [GOVC_RESOURCE_POOL] |
| `name`     | string  | Display name for the VM            |
| `template` | boolean | Register as a template             |

`_args`: `VMX` (required — path to VMX file)

#### `vm_unregister`
Remove VM from inventory without removing files on disk.

`_args`: `VM...`

#### `vm_upgrade`
Upgrade VMs to latest (or specified) hardware version.

| Flag      | Type   | Description                               |
| --------- | ------ | ----------------------------------------- |
| `vm`      | string | Virtual machine [GOVC_VM]                 |
| `version` | number | Target hardware version (e.g. 19, 20, 21) |

`_args`: `VM...`

---

### VM Configuration

#### `vm_change`
Change VM configuration (CPU, memory, ExtraConfig, etc.).

| Flag                     | Type    | Description                                  |
| ------------------------ | ------- | -------------------------------------------- |
| `vm`                     | string  | Virtual machine [GOVC_VM]                    |
| `c`                      | number  | Number of CPUs                               |
| `m`                      | number  | Size in MB of memory                         |
| `e`                      | string  | ExtraConfig key=value                        |
| `name`                   | string  | Display name                                 |
| `annotation`             | string  | VM description                               |
| `g`                      | string  | Guest OS                                     |
| `latency`                | string  | `low`, `normal`, `medium`, or `high`         |
| `nested-hv-enabled`      | boolean | Enable nested hardware-assisted virtualization |
| `cpu-hot-add-enabled`    | boolean | Enable CPU hot add                           |
| `memory-hot-add-enabled` | boolean | Enable memory hot add                        |

#### `vm_customize`
Apply customization (hostname, IP, domain, DNS).

| Flag         | Type   | Description                        |
| ------------ | ------ | ---------------------------------- |
| `vm`         | string | Virtual machine [GOVC_VM]          |
| `type`       | string | `Linux` or `Windows`               |
| `name`       | string | Host name                          |
| `domain`     | string | Domain name                        |
| `dns-server` | string | DNS server list (comma-separated)  |
| `dns-suffix` | string | DNS suffix list (comma-separated)  |
| `ip`         | string | IP address                         |
| `ip-mask`    | string | Subnet mask                        |
| `ip-gw`      | string | Default gateway                    |
| `mac`        | string | MAC address                        |

`_args`: `VM...`

#### `vm_info`
Display info for a VM. Use `-r` for resource summary.

| Flag     | Type    | Description                          |
| -------- | ------- | ------------------------------------ |
| `vm`     | string  | Virtual machine [GOVC_VM]            |
| `r`      | boolean | Show resource summary                |
| `e`      | boolean | Show ExtraConfig                     |
| `t`      | boolean | Show ToolsConfigInfo                 |
| `waitip` | boolean | Wait for VM to acquire IP address    |

`_args`: `VM...`

#### `vm_ip`
List IPs for a VM.

| Flag    | Type    | Description                         |
| ------- | ------- | ----------------------------------- |
| `a`     | boolean | Wait for IP on all NICs             |
| `v4`    | boolean | Only report IPv4 addresses          |
| `esxcli`| boolean | Use esxcli instead of guest tools   |
| `n`     | string  | Wait for IP on NIC (device or MAC)  |
| `wait`  | string  | Wait time (e.g. 5m, 1h)            |

`_args`: `VM...`

#### `vm_power`
Invoke VM power operations. Specify exactly one power flag.

| Flag    | Type    | Description                              |
| ------- | ------- | ---------------------------------------- |
| `on`    | boolean | Power on                                 |
| `off`   | boolean | Power off                                |
| `reset` | boolean | Power reset                              |
| `suspend`| boolean| Power suspend                            |
| `r`     | boolean | Reboot guest                             |
| `s`     | boolean | Shutdown guest                           |
| `force` | boolean | Force (ignore state error, hard shutdown)|
| `M`     | boolean | Use Datacenter.PowerOnMultiVM            |

`_args`: `NAME...`

#### `vm_migrate`
Migrate VM to a specific resource pool, host, or datastore.

| Flag       | Type   | Description                        |
| ---------- | ------ | ---------------------------------- |
| `vm`       | string | Virtual machine [GOVC_VM]          |
| `ds`       | string | Datastore [GOVC_DATASTORE]         |
| `host`     | string | Host system [GOVC_HOST]            |
| `pool`     | string | Resource pool [GOVC_RESOURCE_POOL] |
| `net`      | string | Network [GOVC_NETWORK]             |
| `priority` | string | Task priority                      |

`_args`: `VM...`

#### `vm_vnc`
Enable or disable VNC for VM.

| Flag         | Type    | Description                          |
| ------------ | ------- | ------------------------------------ |
| `vm`         | string  | Virtual machine [GOVC_VM]            |
| `enable`     | boolean | Enable VNC                           |
| `disable`    | boolean | Disable VNC                          |
| `port`       | number  | VNC port (default: -1 for auto)      |
| `port-range` | string  | VNC port range (e.g. 5900-5999)      |
| `password`   | string  | VNC password                         |

#### `vm_question`
Answer VM question prompt. Without `-answer`, displays the pending question.

| Flag     | Type   | Description               |
| -------- | ------ | ------------------------- |
| `vm`     | string | Virtual machine [GOVC_VM] |
| `answer` | string | Answer to provide         |

---

### VM Disks

#### `vm_disk_create`
Create a new disk and attach to VM.

| Flag         | Type    | Description                              |
| ------------ | ------- | ---------------------------------------- |
| `vm`         | string  | Virtual machine [GOVC_VM]                |
| `ds`         | string  | Datastore [GOVC_DATASTORE]               |
| `name`       | string  | Disk path name **(required)**            |
| `size`       | string  | Disk size e.g. 10GB **(required)**       |
| `controller` | string  | Disk controller type (e.g. scsi, pvscsi) |
| `eager`      | boolean | Eagerly scrub new disk                   |
| `thick`      | boolean | Use thick provisioning                   |
| `mode`       | string  | Disk mode (e.g. persistent)              |
| `sharing`    | string  | sharingNone or sharingMultiWriter        |

#### `vm_disk_attach`
Attach an existing disk to VM.

| Flag         | Type    | Description                              |
| ------------ | ------- | ---------------------------------------- |
| `vm`         | string  | Virtual machine [GOVC_VM]                |
| `ds`         | string  | Datastore [GOVC_DATASTORE]               |
| `disk`       | string  | Disk path name                           |
| `link`       | boolean | Link attached disk (default: true)       |
| `persist`    | boolean | Persist attached disk (default: true)    |
| `controller` | string  | Disk controller type                     |
| `mode`       | string  | Disk mode                                |
| `sharing`    | string  | Sharing mode                             |

#### `vm_disk_change`
Change VM disk properties (size, mode).

| Flag       | Type   | Description                    |
| ---------- | ------ | ------------------------------ |
| `vm`       | string | Virtual machine [GOVC_VM]      |
| `disk`     | string | Disk label or file path        |
| `name`     | string | Disk label                     |
| `filePath` | string | Disk backing file path         |
| `size`     | string | New disk size (e.g. 20GB)      |
| `mode`     | string | Disk mode                      |
| `sharing`  | string | Sharing mode                   |

#### `vm_disk_promote`
Promote VM linked-clone disk(s).

| Flag     | Type    | Description                      |
| -------- | ------- | -------------------------------- |
| `vm`     | string  | Virtual machine [GOVC_VM]        |
| `linked` | boolean | Promote linked clones (default: true) |

---

### VM Networking

#### `vm_network_add`
Add network adapter to VM.

| Flag          | Type   | Description                            |
| ------------- | ------ | -------------------------------------- |
| `vm`          | string | Virtual machine [GOVC_VM]              |
| `net`         | string | Network [GOVC_NETWORK]                 |
| `net.adapter` | string | Network adapter type (e.g. vmxnet3)    |

#### `vm_network_change`
Change network device configuration on VM.

| Flag          | Type   | Description                            |
| ------------- | ------ | -------------------------------------- |
| `vm`          | string | Virtual machine [GOVC_VM]              |
| `net`         | string | Network [GOVC_NETWORK]                 |
| `net.adapter` | string | Network adapter type (e.g. vmxnet3)    |

`_args`: `DEVICE`

---

### VM Options & Policies

#### `vm_option_info`
VM config options for a cluster.

| Flag      | Type   | Description               |
| --------- | ------ | ------------------------- |
| `cluster` | string | Cluster [GOVC_CLUSTER]    |
| `host`    | string | Host system [GOVC_HOST]   |
| `guest`   | string | Guest OS ID filter        |

#### `vm_option_ls`
List VM config option keys for a cluster.

| Flag      | Type   | Description             |
| --------- | ------ | ----------------------- |
| `cluster` | string | Cluster [GOVC_CLUSTER]  |
| `host`    | string | Host system [GOVC_HOST] |

#### `vm_policy_ls`
List VM storage policies.

| Flag | Type    | Description               |
| ---- | ------- | ------------------------- |
| `vm` | string  | Virtual machine [GOVC_VM] |
| `i`  | boolean | List policy ID only       |

#### `vm_target_info`
VM config target info (networks, datastores, resource pools).

| Flag      | Type   | Description             |
| --------- | ------ | ----------------------- |
| `cluster` | string | Cluster [GOVC_CLUSTER]  |
| `host`    | string | Host system [GOVC_HOST] |

#### `vm_target_cap_ls`
List VM config target capabilities.

| Flag      | Type   | Description             |
| --------- | ------ | ----------------------- |
| `cluster` | string | Cluster [GOVC_CLUSTER]  |
| `host`    | string | Host system [GOVC_HOST] |

#### `vm_guest_tools`
Manage guest tools (mount, unmount, upgrade).

| Flag      | Type   | Description                           |
| --------- | ------ | ------------------------------------- |
| `vm`      | string | Virtual machine [GOVC_VM]             |
| `options` | string | Options for tools upgrade (e.g. /S /v /qn) |

`_args`: `ACTION` (mount, unmount, or upgrade)

---

### Datastore

#### `datastore_info`
Display info for datastores.

| Flag | Type    | Description                                |
| ---- | ------- | ------------------------------------------ |
| `H`  | boolean | Info for datastores shared between hosts   |

`_args`: `[PATH]...`

#### `datastore_ls`
List files on a datastore.

| Flag | Type    | Description                    |
| ---- | ------- | ------------------------------ |
| `ds` | string  | Datastore [GOVC_DATASTORE]     |
| `l`  | boolean | Long listing format            |
| `R`  | boolean | List subdirectories recursively|
| `a`  | boolean | Show hidden entries            |
| `p`  | boolean | Append / to directories        |

`_args`: `[FILE]...`

#### `datastore_cp`
Copy file on datastore.

| Flag        | Type    | Description                    |
| ----------- | ------- | ------------------------------ |
| `ds`        | string  | Datastore [GOVC_DATASTORE]     |
| `f`         | boolean | Force; overwrite if exists     |
| `dc-target` | string  | Destination datacenter         |
| `ds-target` | string  | Destination datastore          |

`_args`: `SRC DST`

#### `datastore_mv`
Move file on datastore.

| Flag        | Type    | Description                    |
| ----------- | ------- | ------------------------------ |
| `ds`        | string  | Datastore [GOVC_DATASTORE]     |
| `f`         | boolean | Force; overwrite if exists     |
| `dc-target` | string  | Destination datacenter         |
| `ds-target` | string  | Destination datastore          |

`_args`: `SRC DST`

#### `datastore_tail`
Output last part of datastore files.

| Flag | Type    | Description                    |
| ---- | ------- | ------------------------------ |
| `ds` | string  | Datastore [GOVC_DATASTORE]     |
| `n`  | number  | Output the last N lines (default: 10) |
| `f`  | boolean | Follow file changes            |
| `c`  | number  | Output the last N bytes        |

`_args`: `PATH`

#### `datastore_disk_info`
Query VMDK info on datastore.

| Flag | Type    | Description                         |
| ---- | ------- | ----------------------------------- |
| `ds` | string  | Datastore [GOVC_DATASTORE]          |
| `p`  | boolean | Include parent disk info            |
| `c`  | boolean | Chain: follow parent to top-level   |
| `d`  | boolean | Include disk details                |

`_args`: `VMDK...`

#### `datastore_cluster_info`
Display datastore cluster info.

`_args`: `[PATH]...`

#### `datastore_cluster_change`
Change datastore cluster configuration.

| Flag          | Type    | Description                              |
| ------------- | ------- | ---------------------------------------- |
| `drs-enabled` | boolean | Enable Storage DRS                       |
| `drs-mode`    | string  | `manual` or `automated`                  |

`_args`: `CLUSTER...`

#### `datastore_maintenance_enter`
Put datastore in maintenance mode.

`_args`: `DATASTORE...`

#### `datastore_maintenance_exit`
Take datastore out of maintenance mode.

`_args`: `DATASTORE...`

---

### vSAN

#### `vsan_info`
Display vSAN configuration.

`_args`: `CLUSTER...`

---

## Recommended Workflows

### Orientation — Explore the environment

1. `about` — confirm vCenter version and connectivity.
2. `ls` with `_args: "/"` — see top-level datacenter(s).
3. `ls` with `_args: "/<datacenter>/vm"` — list VMs.
4. `ls` with `_args: "/<datacenter>/host"` — list hosts/clusters.
5. `ls` with `_args: "/<datacenter>/datastore"` — list datastores.
6. `tree` with `L: 3` — get a broad inventory overview.

### Get VM details

1. `find` with `type: "m"` and optionally `name: "pattern*"` — locate VMs.
2. `vm_info` with `vm: "vm-name"` and `r: true` — get full resource details.
3. `vm_ip` with `_args: "vm-name"` — get IP addresses.

### Create a VM

1. Check available options: `vm_option_ls` (guest OS IDs), `datastore_info`, `ls` for networks.
2. `vm_create` with desired specs. Set `on: false` if you need to configure before boot.
3. `vm_info` to verify creation.
4. `vm_power` with `on: true` if created powered off.

### Clone a VM

1. `vm_info` on the source VM.
2. `snapshot_create` if you want to clone from a snapshot.
3. `vm_clone` with source `vm` and target `NAME`. Use `link: true` for linked clones.

### Snapshot management

1. `snapshot_tree` — view existing snapshots.
2. `snapshot_create` — create a new snapshot before changes.
3. `snapshot_remove` — clean up old snapshots. Use `_args: "*"` to remove all.

### Discover unknown commands

1. `govc_search` with a keyword — find relevant commands.
2. `govc_help` with the command name — get full usage details.
3. `govc_run` — execute the command with appropriate flags.

---

## Tips

- **Always start with read-only tools** (`about`, `ls`, `find`, `vm_info`, `tree`) to understand the environment before making changes.
- **Use `find`** to locate objects by type and name pattern before operating on them.
- **VM names vs paths**: Most tools accept either a VM name or an inventory path. If names are ambiguous, use the full path (e.g. `/datacenter/vm/folder/my-vm`).
- **Power operations**: `vm_power` requires exactly one power flag. Use `force: true` to override state errors. Use `s` (shutdown) for graceful guest OS shutdown, `off` for hard power-off.
- **Destructive operations** (`vm_destroy`, `snapshot_remove` with `*`) cannot be undone. Confirm intent before using.
- **The `govc_run` escape hatch** covers ~300 govc commands beyond the 55 typed tools. Use `govc_search` to find them.
