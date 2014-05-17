/**
 * Created in SAP Labs Israel.
 * Author: Vadim Tomnikov (i070970)
 * Date: 5/8/14
 * Time: 3:22 PM
 */
var http = require('http');

var roles = [
    {
        "roleId":"141442",
        "roleName":"AFLPM_CREATOR_ERASER_EXECUTE",
        "roleMode":"LOCAL",
        "roleCreator":"SYSTEM",
        "objectName":"AFLPM_CREATOR_ERASER_EXECUTE"
    },
    {
        "roleId":"141445",
        "roleName":"AFL__SYS_AFL_ERPA_EXECUTE",
        "roleMode":"LOCAL",
        "roleCreator":"_SYS_AFL",
        "objectName":"AFL__SYS_AFL_ERPA_EXECUTE"
    },
    {
        "roleId":"141446",
        "roleName":"AFL__SYS_AFL_ERPA_EXECUTE_WITH_GRANT_OPTION",
        "roleMode":"LOCAL",
        "roleCreator":"_SYS_AFL",
        "objectName":"AFL__SYS_AFL_ERPA_EXECUTE_WITH_GRANT_OPTION"
    },
    {
        "roleId":"140928",
        "roleName":"CONTENT_ADMIN",
        "roleMode":"LOCAL",
        "roleCreator":"SYSTEM",
        "objectName":"CONTENT_ADMIN"
    },
    {
        "roleId":"140927",
        "roleName":"MODELING",
        "roleMode":"LOCAL",
        "roleCreator":"SYSTEM",
        "objectName":"MODELING"
    },
    {
        "roleId":"131077",
        "roleName":"MONITORING",
        "roleMode":"LOCAL",
        "roleCreator":"SYS",
        "objectName":"MONITORING"
    },
    {
        "roleId":"131076",
        "roleName":"PUBLIC",
        "roleMode":"LOCAL",
        "roleCreator":"SYS",
        "objectName":"PUBLIC"
    },
    {
        "roleId":"137866",
        "roleName":"SAP_INTERNAL_HANA_SUPPORT",
        "roleMode":"LOCAL",
        "roleCreator":"SYS",
        "objectName":"SAP_INTERNAL_HANA_SUPPORT"
    },
    {
        "roleId":"148408",
        "roleName":"sap.hana.admin.roles::Monitoring",
        "roleMode":"LOCAL",
        "roleCreator":"_SYS_REPO",
        "objectName":"sap.hana.admin.roles::Monitoring"
    },
    {
        "roleId":"146801",
        "roleName":"sap.hana.adminconsole.db::AdminConsole",
        "roleMode":"LOCAL",
        "roleCreator":"_SYS_REPO",
        "objectName":"sap.hana.adminconsole.db::AdminConsole"
    },
    {
        "roleId":"148797",
        "roleName":"sap.hana.dbcc.roles::DBCCAdmin",
        "roleMode":"LOCAL",
        "roleCreator":"_SYS_REPO",
        "objectName":"sap.hana.dbcc.roles::DBCCAdmin"
    },
    {
        "roleId":"148796",
        "roleName":"sap.hana.dbcc.roles::DBCCUser",
        "roleMode":"LOCAL",
        "roleCreator":"_SYS_REPO",
        "objectName":"sap.hana.dbcc.roles::DBCCUser"
    },
    {
        "roleId":"142698",
        "roleName":"sap.hana.ide.core.roles::Consumer",
        "roleMode":"LOCAL",
        "roleCreator":"_SYS_REPO",
        "objectName":"sap.hana.ide.core.roles::Consumer"
    },
    {
        "roleId":"143766",
        "roleName":"sap.hana.uis.db::SITE_DESIGNER",
        "roleMode":"LOCAL",
        "roleCreator":"_SYS_REPO",
        "objectName":"sap.hana.uis.db::SITE_DESIGNER"
    },
    {
        "roleId":"143765",
        "roleName":"sap.hana.uis.db::SITE_USER",
        "roleMode":"LOCAL",
        "roleCreator":"_SYS_REPO",
        "objectName":"sap.hana.uis.db::SITE_USER"
    },
    {
        "roleId":"143779",
        "roleName":"sap.hana.xs.admin.roles::HTTPDestAdministrator",
        "roleMode":"LOCAL",
        "roleCreator":"_SYS_REPO",
        "objectName":"sap.hana.xs.admin.roles::HTTPDestAdministrator"
    },
    {
        "roleId":"143773",
        "roleName":"sap.hana.xs.admin.roles::HTTPDestViewer",
        "roleMode":"LOCAL",
        "roleCreator":"_SYS_REPO",
        "objectName":"sap.hana.xs.admin.roles::HTTPDestViewer"
    },
    {
        "roleId":"143778",
        "roleName":"sap.hana.xs.admin.roles::JobAdministrator",
        "roleMode":"LOCAL",
        "roleCreator":"_SYS_REPO",
        "objectName":"sap.hana.xs.admin.roles::JobAdministrator"
    },
    {
        "roleId":"143772",
        "roleName":"sap.hana.xs.admin.roles::JobViewer",
        "roleMode":"LOCAL",
        "roleCreator":"_SYS_REPO",
        "objectName":"sap.hana.xs.admin.roles::JobViewer"
    },
    {
        "roleId":"143777",
        "roleName":"sap.hana.xs.admin.roles::RuntimeConfAdministrator",
        "roleMode":"LOCAL",
        "roleCreator":"_SYS_REPO",
        "objectName":"sap.hana.xs.admin.roles::RuntimeConfAdministrator"
    },
    {
        "roleId":"143771",
        "roleName":"sap.hana.xs.admin.roles::RuntimeConfViewer",
        "roleMode":"LOCAL",
        "roleCreator":"_SYS_REPO",
        "objectName":"sap.hana.xs.admin.roles::RuntimeConfViewer"
    },
    {
        "roleId":"143776",
        "roleName":"sap.hana.xs.admin.roles::SAMLAdministrator",
        "roleMode":"LOCAL",
        "roleCreator":"_SYS_REPO",
        "objectName":"sap.hana.xs.admin.roles::SAMLAdministrator"
    },
    {
        "roleId":"143770",
        "roleName":"sap.hana.xs.admin.roles::SAMLViewer",
        "roleMode":"LOCAL",
        "roleCreator":"_SYS_REPO",
        "objectName":"sap.hana.xs.admin.roles::SAMLViewer"
    },
    {
        "roleId":"143775",
        "roleName":"sap.hana.xs.admin.roles::SQLCCAdministrator",
        "roleMode":"LOCAL",
        "roleCreator":"_SYS_REPO",
        "objectName":"sap.hana.xs.admin.roles::SQLCCAdministrator"
    },
    {
        "roleId":"143769",
        "roleName":"sap.hana.xs.admin.roles::SQLCCViewer",
        "roleMode":"LOCAL",
        "roleCreator":"_SYS_REPO",
        "objectName":"sap.hana.xs.admin.roles::SQLCCViewer"
    },
    {
        "roleId":"143774",
        "roleName":"sap.hana.xs.admin.roles::TrustStoreAdministrator",
        "roleMode":"LOCAL",
        "roleCreator":"_SYS_REPO",
        "objectName":"sap.hana.xs.admin.roles::TrustStoreAdministrator"
    },
    {
        "roleId":"143768",
        "roleName":"sap.hana.xs.admin.roles::TrustStoreViewer",
        "roleMode":"LOCAL",
        "roleCreator":"_SYS_REPO",
        "objectName":"sap.hana.xs.admin.roles::TrustStoreViewer"
    },
    {
        "roleId":"143767",
        "roleName":"sap.hana.xs.debugger::Debugger",
        "roleMode":"LOCAL",
        "roleCreator":"_SYS_REPO",
        "objectName":"sap.hana.xs.debugger::Debugger"
    },
    {
        "roleId":"143784",
        "roleName":"sap.hana.xs.ide.roles::CatalogDeveloper",
        "roleMode":"LOCAL",
        "roleCreator":"_SYS_REPO",
        "objectName":"sap.hana.xs.ide.roles::CatalogDeveloper"
    },
    {
        "roleId":"143783",
        "roleName":"sap.hana.xs.ide.roles::Developer",
        "roleMode":"LOCAL",
        "roleCreator":"_SYS_REPO",
        "objectName":"sap.hana.xs.ide.roles::Developer"
    },
    {
        "roleId":"143782",
        "roleName":"sap.hana.xs.ide.roles::EditorDeveloper",
        "roleMode":"LOCAL",
        "roleCreator":"_SYS_REPO",
        "objectName":"sap.hana.xs.ide.roles::EditorDeveloper"
    },
    {
        "roleId":"143781",
        "roleName":"sap.hana.xs.ide.roles::SecurityAdmin",
        "roleMode":"LOCAL",
        "roleCreator":"_SYS_REPO",
        "objectName":"sap.hana.xs.ide.roles::SecurityAdmin"
    },
    {
        "roleId":"143780",
        "roleName":"sap.hana.xs.ide.roles::TraceViewer",
        "roleMode":"LOCAL",
        "roleCreator":"_SYS_REPO",
        "objectName":"sap.hana.xs.ide.roles::TraceViewer"
    },
    {
        "roleId":"143929",
        "roleName":"sap.hana.xs.lm.roles::Administrator",
        "roleMode":"LOCAL",
        "roleCreator":"_SYS_REPO",
        "objectName":"sap.hana.xs.lm.roles::Administrator"
    },
    {
        "roleId":"143927",
        "roleName":"sap.hana.xs.lm.roles::Display",
        "roleMode":"LOCAL",
        "roleCreator":"_SYS_REPO",
        "objectName":"sap.hana.xs.lm.roles::Display"
    },
    {
        "roleId":"143928",
        "roleName":"sap.hana.xs.lm.roles::ExecuteTransport",
        "roleMode":"LOCAL",
        "roleCreator":"_SYS_REPO",
        "objectName":"sap.hana.xs.lm.roles::ExecuteTransport"
    },
    {
        "roleId":"143926",
        "roleName":"sap.hana.xs.lm.roles::Transport",
        "roleMode":"LOCAL",
        "roleCreator":"_SYS_REPO",
        "objectName":"sap.hana.xs.lm.roles::Transport"
    },
    {
        "roleId":"143931",
        "roleName":"sap.hana.xs.sqlcc::Administrator",
        "roleMode":"LOCAL",
        "roleCreator":"_SYS_REPO",
        "objectName":"sap.hana.xs.sqlcc::Administrator"
    },
    {
        "roleId":"143930",
        "roleName":"sap.hana.xs.sqlcc::Viewer",
        "roleMode":"LOCAL",
        "roleCreator":"_SYS_REPO",
        "objectName":"sap.hana.xs.sqlcc::Viewer"
    },
    {
        "roleId":"146800",
        "roleName":"tests.adminconsole.db::Admin_Role",
        "roleMode":"LOCAL",
        "roleCreator":"_SYS_REPO",
        "objectName":"tests.adminconsole.db::Admin_Role"
    },
    {
        "roleId":"144325",
        "roleName":"tests.perf.Navigation_Permissions.Roles::Catalog10Role",
        "roleMode":"LOCAL",
        "roleCreator":"_SYS_REPO",
        "objectName":"tests.perf.Navigation_Permissions.Roles::Catalog10Role"
    },
    {
        "roleId":"144324",
        "roleName":"tests.perf.Navigation_Permissions.Roles::Catalog1Role",
        "roleMode":"LOCAL",
        "roleCreator":"_SYS_REPO",
        "objectName":"tests.perf.Navigation_Permissions.Roles::Catalog1Role"
    },
    {
        "roleId":"144323",
        "roleName":"tests.perf.Navigation_Permissions.Roles::Catalog2Role",
        "roleMode":"LOCAL",
        "roleCreator":"_SYS_REPO",
        "objectName":"tests.perf.Navigation_Permissions.Roles::Catalog2Role"
    },
    {
        "roleId":"144322",
        "roleName":"tests.perf.Navigation_Permissions.Roles::Catalog3Role",
        "roleMode":"LOCAL",
        "roleCreator":"_SYS_REPO",
        "objectName":"tests.perf.Navigation_Permissions.Roles::Catalog3Role"
    },
    {
        "roleId":"144321",
        "roleName":"tests.perf.Navigation_Permissions.Roles::Catalog4Role",
        "roleMode":"LOCAL",
        "roleCreator":"_SYS_REPO",
        "objectName":"tests.perf.Navigation_Permissions.Roles::Catalog4Role"
    },
    {
        "roleId":"144320",
        "roleName":"tests.perf.Navigation_Permissions.Roles::Catalog5Role",
        "roleMode":"LOCAL",
        "roleCreator":"_SYS_REPO",
        "objectName":"tests.perf.Navigation_Permissions.Roles::Catalog5Role"
    },
    {
        "roleId":"144319",
        "roleName":"tests.perf.Navigation_Permissions.Roles::Catalog6Role",
        "roleMode":"LOCAL",
        "roleCreator":"_SYS_REPO",
        "objectName":"tests.perf.Navigation_Permissions.Roles::Catalog6Role"
    },
    {
        "roleId":"144318",
        "roleName":"tests.perf.Navigation_Permissions.Roles::Catalog7Role",
        "roleMode":"LOCAL",
        "roleCreator":"_SYS_REPO",
        "objectName":"tests.perf.Navigation_Permissions.Roles::Catalog7Role"
    },
    {
        "roleId":"144317",
        "roleName":"tests.perf.Navigation_Permissions.Roles::Catalog8Role",
        "roleMode":"LOCAL",
        "roleCreator":"_SYS_REPO",
        "objectName":"tests.perf.Navigation_Permissions.Roles::Catalog8Role"
    },
    {
        "roleId":"144316",
        "roleName":"tests.perf.Navigation_Permissions.Roles::Catalog9Role",
        "roleMode":"LOCAL",
        "roleCreator":"_SYS_REPO",
        "objectName":"tests.perf.Navigation_Permissions.Roles::Catalog9Role"
    }
];

function getAllRoles() {
    return {
        "roles": roles
    };
}

function getRolesByGrantee(opts) {
    return {
        "roles":[
            {
                "grantee":opts.grantee,
                "granteeType":"USER",
                "roleName":"PUBLIC",
                "grantor":"SYS",
                "isGrantable":"FALSE",
                "objectName":"PUBLIC",
                "objectType":"ROLE",
                "state":"edit",
                "objectId":"PUBLIC-SYS"
            },
            {
                "grantee":opts.grantee,
                "granteeType":"USER",
                "roleName":"sap.hana.uis.db::SITE_USER",
                "grantor":"_SYS_REPO",
                "isGrantable":"FALSE",
                "objectName":"sap.hana.uis.db::SITE_USER",
                "objectType":"ROLE",
                "state":"edit",
                "objectId":"sap.hana.uis.db::SITE_USER-_SYS_REPO"
            }
        ]
    };
}

function getSystemPrivilegesByGrantee(opts) {
    return {
        "privileges":[
            {
                "grantee":opts.grantee,
                "granteeType":"ROLE",
                "objectName":"CREATE SCENARIO",
                "grantor":"SYSTEM",
                "isGrantable":"FALSE",
                "objectType":"SYSTEMPRIVILEGE",
                "state":"edit",
                "objectId":"CREATE SCENARIO-SYSTEM"
            },
            {
                "grantee":opts.grantee,
                "granteeType":"ROLE",
                "objectName":"CREATE STRUCTURED PRIVILEGE",
                "grantor":"SYSTEM",
                "isGrantable":"FALSE",
                "objectType":"SYSTEMPRIVILEGE",
                "state":"edit",
                "objectId":"CREATE STRUCTURED PRIVILEGE-SYSTEM"
            },
            {
                "grantee":opts.grantee,
                "granteeType":"ROLE",
                "objectName":"STRUCTUREDPRIVILEGE ADMIN",
                "grantor":"SYSTEM",
                "isGrantable":"FALSE",
                "objectType":"SYSTEMPRIVILEGE",
                "state":"edit",
                "objectId":"STRUCTUREDPRIVILEGE ADMIN-SYSTEM"
            },
            {
                "grantee":opts.grantee,
                "granteeType":"ROLE",
                "objectName":"REPO.EXPORT",
                "grantor":"SYSTEM",
                "isGrantable":"TRUE",
                "objectType":"SYSTEMPRIVILEGE",
                "state":"edit",
                "objectId":"REPO.EXPORT-SYSTEM"
            },
            {
                "grantee":opts.grantee,
                "granteeType":"ROLE",
                "objectName":"REPO.IMPORT",
                "grantor":"SYSTEM",
                "isGrantable":"TRUE",
                "objectType":"SYSTEMPRIVILEGE",
                "state":"edit",
                "objectId":"REPO.IMPORT-SYSTEM"
            },
            {
                "grantee":opts.grantee,
                "granteeType":"ROLE",
                "objectName":"REPO.MAINTAIN_DELIVERY_UNITS",
                "grantor":"SYSTEM",
                "isGrantable":"TRUE",
                "objectType":"SYSTEMPRIVILEGE",
                "state":"edit",
                "objectId":"REPO.MAINTAIN_DELIVERY_UNITS-SYSTEM"
            },
            {
                "grantee":opts.grantee,
                "granteeType":"ROLE",
                "objectName":"REPO.WORK_IN_FOREIGN_WORKSPACE",
                "grantor":"SYSTEM",
                "isGrantable":"TRUE",
                "objectType":"SYSTEMPRIVILEGE",
                "state":"edit",
                "objectId":"REPO.WORK_IN_FOREIGN_WORKSPACE-SYSTEM"
            }
        ]
    };
}

function getPrivilegesByGrantee() {
    return {
        "privileges":[
            {
                "objectName":"AFLPM_CREATOR",
                "grantor":"SYSTEM",
                "objectType":"PROCEDURE",
                "schemaName":"SYSTEM",
                "state":"edit",
                "objectId":"AFLPM_CREATOR-SYSTEM"
            },
            {
                "objectName":"AFLPM_ERASER",
                "grantor":"SYSTEM",
                "objectType":"PROCEDURE",
                "schemaName":"SYSTEM",
                "state":"edit",
                "objectId":"AFLPM_ERASER-SYSTEM"
            }
        ]
    };
}

function getDetailedPrivilegesByGrantee (opts) {
    return {
        "detailedPrivileges":[
            {
                "objectName":opts.objectName,
                "privilege":"EXECUTE",
                "grantor":"SYSTEM",
                "objectType":opts.objectType,
                "isGrantable":"TRUE",
                "schemaName":"SYSTEM",
                "state":"edit",
                "objectId":"AFLPM_CREATOR-SYSTEM-EXECUTE"
            }
        ]
    };
}

function getSqlObjects() {
    return {
        "objects": [
            {
                "objectName": "SAPDBCC",
                "schemaName": "SAPDBCC",
                "type": "SCHEMA"
            },
            {
                "objectName": "SAP_HANA_ADMIN",
                "schemaName": "_SYS_REPO",
                "type": "SCHEMA"
            },
            {
                "objectName": "SAP_HANA_DBCC",
                "schemaName": "_SYS_REPO",
                "type": "SCHEMA"
            },
            {
                "objectName": "SAP_XS_LM",
                "schemaName": "_SYS_REPO",
                "type": "SCHEMA"
            },
            {
                "objectName": "sap.hana.admin.dbcc\/APCA_GET",
                "schemaName": "_SYS_BIC",
                "type": "PROCEDURE"
            },
            {
                "objectName": "sap.hana.admin.dbcc\/APCA_GET\/tabletype\/tt_apca_data",
                "schemaName": "_SYS_BIC",
                "type": "TABLE"
            },
            {
                "objectName": "sap.hana.admin.ds\/RESOURCE_INFORMATION_PROC",
                "schemaName": "SAP_HANA_ADMIN",
                "type": "PROCEDURE"
            },
            {
                "objectName": "sap.hana.admin.ds::ALLOCATORS",
                "schemaName": "SAP_HANA_ADMIN",
                "type": "VIEW"
            },
            {
                "objectName": "sap.hana.admin.ds::ALLOCATORS_HISTORY",
                "schemaName": "SAP_HANA_ADMIN",
                "type": "VIEW"
            },
            {
                "objectName": "sap.hana.admin.ds::ALLOCATORS_PIE",
                "schemaName": "SAP_HANA_ADMIN",
                "type": "VIEW"
            },
            {
                "objectName": "sap.hana.admin.ds::ALLOCATOR_HISTORY",
                "schemaName": "SAP_HANA_ADMIN",
                "type": "VIEW"
            },
            {
                "objectName": "sap.hana.admin.ds::COMPONENTS",
                "schemaName": "SAP_HANA_ADMIN",
                "type": "VIEW"
            },
            {
                "objectName": "sap.hana.admin.ds::COMPONENTS_PIE",
                "schemaName": "SAP_HANA_ADMIN",
                "type": "VIEW"
            },
            {
                "objectName": "sap.hana.admin.ds::COMPONENT_ALLOCATOR_HISTORY",
                "schemaName": "SAP_HANA_ADMIN",
                "type": "VIEW"
            },
            {
                "objectName": "sap.hana.admin.ds::COMPONENT_HISTORY",
                "schemaName": "SAP_HANA_ADMIN",
                "type": "VIEW"
            },
            {
                "objectName": "sap.hana.admin.ds::DEMO_ALERTS",
                "schemaName": "SAP_HANA_ADMIN",
                "type": "VIEW"
            },
            {
                "objectName": "sap.hana.admin.ds::DEMO_BLOCKED_TRANSACTIONS",
                "schemaName": "SAP_HANA_ADMIN",
                "type": "VIEW"
            },
            {
                "objectName": "sap.hana.admin.ds::DEMO_CONNECTIONS",
                "schemaName": "SAP_HANA_ADMIN",
                "type": "VIEW"
            },
            {
                "objectName": "sap.hana.admin.ds::DEMO_EXPENSIVE_STATEMENTS",
                "schemaName": "SAP_HANA_ADMIN",
                "type": "VIEW"
            },
            {
                "objectName": "sap.hana.admin.ds::DEMO_SERVICE_THREADS",
                "schemaName": "SAP_HANA_ADMIN",
                "type": "VIEW"
            },
            {
                "objectName": "sap.hana.admin.ds::FEATURES",
                "schemaName": "SAP_HANA_ADMIN",
                "type": "TABLE"
            },
            {
                "objectName": "sap.hana.admin.ds::HOSTS",
                "schemaName": "SAP_HANA_ADMIN",
                "type": "VIEW"
            },
            {
                "objectName": "sap.hana.admin.ds::HOST_INFORMATION",
                "schemaName": "SAP_HANA_ADMIN",
                "type": "VIEW"
            },
            {
                "objectName": "sap.hana.admin.ds::MEMORY_OVERVIEW",
                "schemaName": "SAP_HANA_ADMIN",
                "type": "VIEW"
            },
            {
                "objectName": "sap.hana.admin.ds::RESOURCE_INFORMATION",
                "schemaName": "SAP_HANA_ADMIN",
                "type": "TABLE"
            },
            {
                "objectName": "sap.hana.admin.ds::RESOURCE_INFORMATION_IN",
                "schemaName": "SAP_HANA_ADMIN",
                "type": "TABLE"
            },
            {
                "objectName": "sap.hana.admin.ds::RESOURCE_INFORMATION_OUT",
                "schemaName": "SAP_HANA_ADMIN",
                "type": "TABLE"
            },
            {
                "objectName": "sap.hana.admin.ds::SERVICES",
                "schemaName": "SAP_HANA_ADMIN",
                "type": "VIEW"
            },
            {
                "objectName": "sap.hana.admin.ds::SERVICE_MEMORY",
                "schemaName": "SAP_HANA_ADMIN",
                "type": "VIEW"
            },
            {
                "objectName": "sap.hana.admin.ds::SYS_TIMESTAMP",
                "schemaName": "SAP_HANA_ADMIN",
                "type": "VIEW"
            },
            {
                "objectName": "sap.hana.dbcc.data.seq::AuthMechId",
                "schemaName": "SAP_HANA_DBCC",
                "type": "SEQUENCE"
            },
            {
                "objectName": "sap.hana.dbcc.data.seq::AuthMechParamId",
                "schemaName": "SAP_HANA_DBCC",
                "type": "SEQUENCE"
            },
            {
                "objectName": "sap.hana.dbcc.data.seq::GroupId",
                "schemaName": "SAP_HANA_DBCC",
                "type": "SEQUENCE"
            },
            {
                "objectName": "sap.hana.dbcc.data.seq::LPGroupId",
                "schemaName": "SAP_HANA_DBCC",
                "type": "SEQUENCE"
            },
            {
                "objectName": "sap.hana.dbcc.data.seq::LPTileId",
                "schemaName": "SAP_HANA_DBCC",
                "type": "SEQUENCE"
            },
            {
                "objectName": "sap.hana.dbcc.data.seq::MsgClientId",
                "schemaName": "SAP_HANA_DBCC",
                "type": "SEQUENCE"
            },
            {
                "objectName": "sap.hana.dbcc.data.seq::MsgQueueId",
                "schemaName": "SAP_HANA_DBCC",
                "type": "SEQUENCE"
            },
            {
                "objectName": "sap.hana.dbcc.data.seq::ResAPCAId",
                "schemaName": "SAP_HANA_DBCC",
                "type": "SEQUENCE"
            },
            {
                "objectName": "sap.hana.dbcc.data.seq::ResConfigId",
                "schemaName": "SAP_HANA_DBCC",
                "type": "SEQUENCE"
            },
            {
                "objectName": "sap.hana.dbcc.data.seq::ResourceId",
                "schemaName": "SAP_HANA_DBCC",
                "type": "SEQUENCE"
            },
            {
                "objectName": "sap.hana.dbcc.data.seq::ResourceTypeId",
                "schemaName": "SAP_HANA_DBCC",
                "type": "SEQUENCE"
            },
            {
                "objectName": "sap.hana.dbcc.data.seq::ResourceURLId",
                "schemaName": "SAP_HANA_DBCC",
                "type": "SEQUENCE"
            },
            {
                "objectName": "sap.hana.dbcc.data::APP_AUTH_MECHS",
                "schemaName": "SAP_HANA_DBCC",
                "type": "VIEW"
            },
            {
                "objectName": "sap.hana.dbcc.data::APP_AUTH_MECH_PARAMS",
                "schemaName": "SAP_HANA_DBCC",
                "type": "VIEW"
            },
            {
                "objectName": "sap.hana.dbcc.data::APP_GROUPS",
                "schemaName": "SAP_HANA_DBCC",
                "type": "VIEW"
            },
            {
                "objectName": "sap.hana.dbcc.data::APP_GROUP_RESOURCES",
                "schemaName": "SAP_HANA_DBCC",
                "type": "VIEW"
            },
            {
                "objectName": "sap.hana.dbcc.data::APP_LP_GROUPS",
                "schemaName": "SAP_HANA_DBCC",
                "type": "VIEW"
            },
            {
                "objectName": "sap.hana.dbcc.data::APP_LP_TILES",
                "schemaName": "SAP_HANA_DBCC",
                "type": "VIEW"
            },
            {
                "objectName": "sap.hana.dbcc.data::APP_RESOURCES",
                "schemaName": "SAP_HANA_DBCC",
                "type": "VIEW"
            },
            {
                "objectName": "sap.hana.dbcc.data::APP_RESOURCE_TYPES",
                "schemaName": "SAP_HANA_DBCC",
                "type": "VIEW"
            },
            {
                "objectName": "sap.hana.dbcc.data::AUTH_MECHS",
                "schemaName": "SAP_HANA_DBCC",
                "type": "TABLE"
            },
            {
                "objectName": "sap.hana.dbcc.data::AUTH_MECH_PARAMS",
                "schemaName": "SAP_HANA_DBCC",
                "type": "TABLE"
            },
            {
                "objectName": "sap.hana.dbcc.data::DATASOURCES",
                "schemaName": "SAP_HANA_DBCC",
                "type": "TABLE"
            },
            {
                "objectName": "sap.hana.dbcc.data::GROUPS",
                "schemaName": "SAP_HANA_DBCC",
                "type": "TABLE"
            },
            {
                "objectName": "sap.hana.dbcc.data::LOCALIZED_TEXT",
                "schemaName": "SAP_HANA_DBCC",
                "type": "TABLE"
            },
            {
                "objectName": "sap.hana.dbcc.data::LP_CATALOG_ITEMS",
                "schemaName": "SAP_HANA_DBCC",
                "type": "TABLE"
            },
            {
                "objectName": "sap.hana.dbcc.data::LP_GROUPS",
                "schemaName": "SAP_HANA_DBCC",
                "type": "TABLE"
            },
            {
                "objectName": "sap.hana.dbcc.data::LP_TILES",
                "schemaName": "SAP_HANA_DBCC",
                "type": "TABLE"
            },
            {
                "objectName": "sap.hana.dbcc.data::LP_TILE_GRP_ASSOC",
                "schemaName": "SAP_HANA_DBCC",
                "type": "TABLE"
            },
            {
                "objectName": "sap.hana.dbcc.data::LP_TILE_TYPES",
                "schemaName": "SAP_HANA_DBCC",
                "type": "TABLE"
            },
            {
                "objectName": "sap.hana.dbcc.data::MSG_CLIENT",
                "schemaName": "SAP_HANA_DBCC",
                "type": "TABLE"
            },
            {
                "objectName": "sap.hana.dbcc.data::MSG_CLIENT_MESSAGES",
                "schemaName": "SAP_HANA_DBCC",
                "type": "VIEW"
            },
            {
                "objectName": "sap.hana.dbcc.data::MSG_GENERAL_MESSAGES",
                "schemaName": "SAP_HANA_DBCC",
                "type": "VIEW"
            },
            {
                "objectName": "sap.hana.dbcc.data::MSG_QUEUE",
                "schemaName": "SAP_HANA_DBCC",
                "type": "TABLE"
            },
            {
                "objectName": "sap.hana.dbcc.data::RESOURCES",
                "schemaName": "SAP_HANA_DBCC",
                "type": "TABLE"
            },
            {
                "objectName": "sap.hana.dbcc.data::RESOURCE_TYPES",
                "schemaName": "SAP_HANA_DBCC",
                "type": "TABLE"
            },
            {
                "objectName": "sap.hana.dbcc.data::RESOURCE_URLS",
                "schemaName": "SAP_HANA_DBCC",
                "type": "TABLE"
            },
            {
                "objectName": "sap.hana.dbcc.data::RES_APCA",
                "schemaName": "SAP_HANA_DBCC",
                "type": "TABLE"
            },
            {
                "objectName": "sap.hana.dbcc.data::RES_CONFIG",
                "schemaName": "SAP_HANA_DBCC",
                "type": "TABLE"
            },
            {
                "objectName": "sap.hana.dbcc.data::RES_GRP_ASSOC",
                "schemaName": "SAP_HANA_DBCC",
                "type": "TABLE"
            },
            {
                "objectName": "sap.hana.uis.db.personalization\/ADD_UPDATE_USER_PAGE",
                "schemaName": "UIS",
                "type": "PROCEDURE"
            },
            {
                "objectName": "sap.hana.uis.db.personalization\/ADD_UPDATE_USER_PROPERTY",
                "schemaName": "UIS",
                "type": "PROCEDURE"
            },
            {
                "objectName": "sap.hana.uis.db.personalization\/ADD_UPDATE_USER_SITE",
                "schemaName": "UIS",
                "type": "PROCEDURE"
            },
            {
                "objectName": "sap.hana.uis.db.personalization\/ADD_UPDATE_USER_WIDGET",
                "schemaName": "UIS",
                "type": "PROCEDURE"
            },
            {
                "objectName": "sap.hana.uis.db.personalization\/ADD_UPDATE_USER_WIDGET\/tabletype\/GET_APPSITE_WIDGET_TEMPLATES",
                "schemaName": "UIS",
                "type": "TABLE"
            },
            {
                "objectName": "sap.hana.uis.db.personalization\/CLONE_PAGE_TO_USER_PAGE",
                "schemaName": "UIS",
                "type": "PROCEDURE"
            },
            {
                "objectName": "sap.hana.uis.db.personalization\/DELETE_USER_APPSITE",
                "schemaName": "UIS",
                "type": "PROCEDURE"
            },
            {
                "objectName": "sap.hana.uis.db.personalization\/DELETE_USER_PAGE",
                "schemaName": "UIS",
                "type": "PROCEDURE"
            },
            {
                "objectName": "sap.hana.uis.db.personalization\/DELETE_USER_PROPERTY",
                "schemaName": "UIS",
                "type": "PROCEDURE"
            },
            {
                "objectName": "sap.hana.uis.db.personalization\/DELETE_USER_WIDGET",
                "schemaName": "UIS",
                "type": "PROCEDURE"
            },
            {
                "objectName": "sap.hana.uis.db.personalization\/RECREATE_USER_APPSITE",
                "schemaName": "UIS",
                "type": "PROCEDURE"
            },
            {
                "objectName": "sap.hana.uis.db.personalization::TEMP_USER_PAGES",
                "schemaName": "UIS",
                "type": "TABLE"
            },
            {
                "objectName": "sap.hana.uis.db.personalization::TEMP_USER_PROPERTIES",
                "schemaName": "UIS",
                "type": "TABLE"
            },
            {
                "objectName": "sap.hana.uis.db.personalization::TEMP_USER_WIDGETS",
                "schemaName": "UIS",
                "type": "TABLE"
            },
            {
                "objectName": "sap.hana.uis.db.personalization::TEMP_USER_WIDGET_PROPERTIES",
                "schemaName": "UIS",
                "type": "TABLE"
            },
            {
                "objectName": "sap.hana.uis.db.tabletypes::GET_SITE_TABLE_TYPE",
                "schemaName": "UIS",
                "type": "TABLE"
            },
            {
                "objectName": "sap.hana.uis.db\/GET_APPSITE",
                "schemaName": "UIS",
                "type": "PROCEDURE"
            },
            {
                "objectName": "sap.hana.uis.db\/GET_APPSITE\/tabletype\/GET_APPSITE_TABLE_TYPE",
                "schemaName": "UIS",
                "type": "TABLE"
            },
            {
                "objectName": "sap.hana.uis.db\/GET_APPSITE_V2\/tabletype\/GET_APPSITE_TABLE_TYPE",
                "schemaName": "UIS",
                "type": "TABLE"
            },
            {
                "objectName": "sap.hana.uis.db\/GET_APPSITE_V3",
                "schemaName": "UIS",
                "type": "PROCEDURE"
            },
            {
                "objectName": "sap.hana.uis.db\/GET_APPSITE_V3\/tabletype\/GET_APPSITE_TABLE_TYPE",
                "schemaName": "UIS",
                "type": "TABLE"
            },
            {
                "objectName": "sap.hana.uis.db\/GET_NAVIGATION_TARGET_DATA",
                "schemaName": "_SYS_BIC",
                "type": "VIEW"
            },
            {
                "objectName": "sap.hana.uis.db\/GET_NAVIGATION_TARGET_DATA\/proc",
                "schemaName": "_SYS_BIC",
                "type": "PROCEDURE"
            },
            {
                "objectName": "sap.hana.uis.db\/GET_NAVIGATION_TARGET_DATA\/proc\/tabletype\/VAR_OUT",
                "schemaName": "_SYS_BIC",
                "type": "TABLE"
            },
            {
                "objectName": "sap.hana.uis.db\/GET_NAVIGATION_URL",
                "schemaName": "UIS",
                "type": "PROCEDURE"
            },
            {
                "objectName": "sap.hana.uis.db\/GET_NAVIGATION_URL\/tabletype\/NAV_TARGETS_DATA_TABLE_TYPE",
                "schemaName": "UIS",
                "type": "TABLE"
            },
            {
                "objectName": "sap.hana.uis.db\/GET_WIDGET_DATA",
                "schemaName": "UIS",
                "type": "PROCEDURE"
            },
            {
                "objectName": "sap.hana.uis.db\/GET_WIDGET_DATA\/tabletype\/WIDGET_DATA_TABLE_TYPE",
                "schemaName": "UIS",
                "type": "TABLE"
            },
            {
                "objectName": "sap.hana.uis.db\/GET_WIDGET_DATA\/tabletype\/WIDGET_USER_PROPERTIES_TABLE_TYPE",
                "schemaName": "UIS",
                "type": "TABLE"
            },
            {
                "objectName": "sap.hana.uis.db\/LOG_AUDIT_MESSAGE",
                "schemaName": "UIS",
                "type": "PROCEDURE"
            },
            {
                "objectName": "sap.hana.uis.db\/SET_USER_WIDGET_PROPERTIES",
                "schemaName": "UIS",
                "type": "PROCEDURE"
            },
            {
                "objectName": "sap.hana.uis.db::GET_SITE_V2",
                "schemaName": "UIS",
                "type": "PROCEDURE"
            },
            {
                "objectName": "sap.hana.uis.db::INTENT_ALIAS_MAPPING_V2",
                "schemaName": "UIS",
                "type": "TABLE"
            },
            {
                "objectName": "sap.hana.uis.db::NAVIGATION_TARGET",
                "schemaName": "UIS",
                "type": "TABLE"
            },
            {
                "objectName": "sap.hana.uis.db::NAVIGATION_VIEW",
                "schemaName": "UIS",
                "type": "VIEW"
            },
            {
                "objectName": "sap.hana.uis.db::SEMANTIC_OBJECTS",
                "schemaName": "UIS",
                "type": "TABLE"
            },
            {
                "objectName": "sap.hana.uis.db::SEMANTIC_OBJECT_VIEW",
                "schemaName": "UIS",
                "type": "VIEW"
            },
            {
                "objectName": "sap.hana.uis.db::THEMES",
                "schemaName": "UIS",
                "type": "TABLE"
            },
            {
                "objectName": "sap.hana.uis.db::UIS_APPSITES_DATA_VIEW",
                "schemaName": "UIS",
                "type": "VIEW"
            },
            {
                "objectName": "sap.hana.uis.db::UIS_APPSITES_VIEW",
                "schemaName": "UIS",
                "type": "VIEW"
            },
            {
                "objectName": "sap.hana.uis.db::UIS_CATALOGS",
                "schemaName": "UIS",
                "type": "TABLE"
            },
            {
                "objectName": "sap.hana.uis.db::UIS_CATALOGS_VIEW",
                "schemaName": "UIS",
                "type": "VIEW"
            },
            {
                "objectName": "sap.hana.uis.db::UIS_FIORI_CATALOGS_VIEW",
                "schemaName": "UIS",
                "type": "VIEW"
            },
            {
                "objectName": "sap.hana.uis.db::UIS_PAGES_NAV_VIEW",
                "schemaName": "UIS",
                "type": "VIEW"
            },
            {
                "objectName": "sap.hana.uis.db::UIS_SITES_NAV_VIEW",
                "schemaName": "UIS",
                "type": "VIEW"
            },
            {
                "objectName": "sap.hana.uis.db::UIS_WIDGETS_NAV_VIEW",
                "schemaName": "UIS",
                "type": "VIEW"
            },
            {
                "objectName": "sap.hana.uis.db::UIS_WIDGETS_VIEW",
                "schemaName": "UIS",
                "type": "VIEW"
            },
            {
                "objectName": "sap.hana.uis.db::UIS_WIDGET_TEMPLATES_PROPERTIES_VIEW",
                "schemaName": "UIS",
                "type": "VIEW"
            },
            {
                "objectName": "sap.hana.uis.db::UIS_WIDGET_TEMPLATES_VIEW",
                "schemaName": "UIS",
                "type": "VIEW"
            },
            {
                "objectName": "sap.hana.xs.lm.db::ACTION_LOG",
                "schemaName": "SAP_XS_LM",
                "type": "TABLE"
            },
            {
                "objectName": "sap.hana.xs.lm.db::CONFIGURATION",
                "schemaName": "SAP_XS_LM",
                "type": "TABLE"
            },
            {
                "objectName": "sap.hana.xs.lm.db::CONF_HISTORY",
                "schemaName": "SAP_XS_LM",
                "type": "TABLE"
            },
            {
                "objectName": "sap.hana.xs.lm.db::ID_SEQ",
                "schemaName": "SAP_XS_LM",
                "type": "SEQUENCE"
            },
            {
                "objectName": "sap.hana.xs.lm.db::IMPORTED_DU",
                "schemaName": "SAP_XS_LM",
                "type": "TABLE"
            },
            {
                "objectName": "sap.hana.xs.lm.db::LOG_SYNC",
                "schemaName": "SAP_XS_LM",
                "type": "TABLE"
            },
            {
                "objectName": "sap.hana.xs.lm.db::PROCESS",
                "schemaName": "SAP_XS_LM",
                "type": "TABLE"
            },
            {
                "objectName": "sap.hana.xs.lm.db::SYSTEM",
                "schemaName": "SAP_XS_LM",
                "type": "TABLE"
            },
            {
                "objectName": "sap.hana.xs.lm.db::SYSTEM_STATE",
                "schemaName": "SAP_XS_LM",
                "type": "TABLE"
            },
            {
                "objectName": "sap.hana.xs.lm.db::TRANSPORTED_CHANGE",
                "schemaName": "SAP_XS_LM",
                "type": "TABLE"
            },
            {
                "objectName": "sap.hana.xs.lm.db::TRANSPORT_CONTENT",
                "schemaName": "SAP_XS_LM",
                "type": "TABLE"
            },
            {
                "objectName": "sap.hana.xs.lm.db::TRANSPORT_ROUTE",
                "schemaName": "SAP_XS_LM",
                "type": "TABLE"
            },
            {
                "objectName": "sap.hana.xs.lm.db::TRANSPORT_ROUTE_DU",
                "schemaName": "SAP_XS_LM",
                "type": "TABLE"
            }
        ]
    };
}

function updatePrivilege4Role(opts) {

    if(opts.roleInfo.state === 'new') {
        roles.push({
            "roleId":(''+(new Date()).getTime()).substr(7),
            "roleName":opts.roleInfo.roleName,
            "roleMode":"LOCAL",
            "roleCreator":"SYSTEM",
            "objectName":opts.roleInfo.roleName
        });
    }

    return {
        successCode: 200,
        successMsg: "Updating security data for '" + opts.roleInfo.roleName + "' user succeeded"
    }
}

function getRole(opts) {
    return roles.filter(function(item) {
        return item.roleName === opts.roleName;
    })[0] || {};
}

function deleteRole(opts) {
    var i, l, role;

    for(i=0, l=roles.length; i<l; i++) {
        role = roles[i];
        if(role.roleName === opts.roleName) {
            roles.splice(i, 1);
            break;
        }
    }

    return {
        successCode: 200,
        successMsg: "Deleting role succeeded"
    }
}

function getSystemPrivileges(opts) {
    return {
        "systems": [
            {
                "sysName": "AUDIT ADMIN",
                "objectName": "AUDIT ADMIN",
                "type": "SYSTEMPRIVILEGE"
            },
            {
                "sysName": "AUDIT OPERATOR",
                "objectName": "AUDIT OPERATOR",
                "type": "SYSTEMPRIVILEGE"
            },
            {
                "sysName": "BACKUP ADMIN",
                "objectName": "BACKUP ADMIN",
                "type": "SYSTEMPRIVILEGE"
            },
            {
                "sysName": "BACKUP OPERATOR",
                "objectName": "BACKUP OPERATOR",
                "type": "SYSTEMPRIVILEGE"
            },
            {
                "sysName": "CATALOG READ",
                "objectName": "CATALOG READ",
                "type": "SYSTEMPRIVILEGE"
            },
            {
                "sysName": "CREATE R SCRIPT",
                "objectName": "CREATE R SCRIPT",
                "type": "SYSTEMPRIVILEGE"
            },
            {
                "sysName": "CREATE REMOTE SOURCE",
                "objectName": "CREATE REMOTE SOURCE",
                "type": "SYSTEMPRIVILEGE"
            },
            {
                "sysName": "CREATE SCENARIO",
                "objectName": "CREATE SCENARIO",
                "type": "SYSTEMPRIVILEGE"
            },
            {
                "sysName": "CREATE SCHEMA",
                "objectName": "CREATE SCHEMA",
                "type": "SYSTEMPRIVILEGE"
            },
            {
                "sysName": "CREATE STRUCTURED PRIVILEGE",
                "objectName": "CREATE STRUCTURED PRIVILEGE",
                "type": "SYSTEMPRIVILEGE"
            },
            {
                "sysName": "CREDENTIAL ADMIN",
                "objectName": "CREDENTIAL ADMIN",
                "type": "SYSTEMPRIVILEGE"
            },
            {
                "sysName": "DATA ADMIN",
                "objectName": "DATA ADMIN",
                "type": "SYSTEMPRIVILEGE"
            },
            {
                "sysName": "DEVELOPMENT",
                "objectName": "DEVELOPMENT",
                "type": "SYSTEMPRIVILEGE"
            },
            {
                "sysName": "EXPORT",
                "objectName": "EXPORT",
                "type": "SYSTEMPRIVILEGE"
            },
            {
                "sysName": "IMPORT",
                "objectName": "IMPORT",
                "type": "SYSTEMPRIVILEGE"
            },
            {
                "sysName": "INIFILE ADMIN",
                "objectName": "INIFILE ADMIN",
                "type": "SYSTEMPRIVILEGE"
            },
            {
                "sysName": "LICENSE ADMIN",
                "objectName": "LICENSE ADMIN",
                "type": "SYSTEMPRIVILEGE"
            },
            {
                "sysName": "LOG ADMIN",
                "objectName": "LOG ADMIN",
                "type": "SYSTEMPRIVILEGE"
            },
            {
                "sysName": "MONITOR ADMIN",
                "objectName": "MONITOR ADMIN",
                "type": "SYSTEMPRIVILEGE"
            },
            {
                "sysName": "OPTIMIZER ADMIN",
                "objectName": "OPTIMIZER ADMIN",
                "type": "SYSTEMPRIVILEGE"
            },
            {
                "sysName": "REPO.CONFIGURE",
                "objectName": "REPO.CONFIGURE",
                "type": "SYSTEMPRIVILEGE"
            },
            {
                "sysName": "REPO.EXPORT",
                "objectName": "REPO.EXPORT",
                "type": "SYSTEMPRIVILEGE"
            },
            {
                "sysName": "REPO.IMPORT",
                "objectName": "REPO.IMPORT",
                "type": "SYSTEMPRIVILEGE"
            },
            {
                "sysName": "REPO.MAINTAIN_DELIVERY_UNITS",
                "objectName": "REPO.MAINTAIN_DELIVERY_UNITS",
                "type": "SYSTEMPRIVILEGE"
            },
            {
                "sysName": "REPO.MODIFY_CHANGE",
                "objectName": "REPO.MODIFY_CHANGE",
                "type": "SYSTEMPRIVILEGE"
            },
            {
                "sysName": "REPO.MODIFY_FOREIGN_CONTRIBUTION",
                "objectName": "REPO.MODIFY_FOREIGN_CONTRIBUTION",
                "type": "SYSTEMPRIVILEGE"
            },
            {
                "sysName": "REPO.MODIFY_OWN_CONTRIBUTION",
                "objectName": "REPO.MODIFY_OWN_CONTRIBUTION",
                "type": "SYSTEMPRIVILEGE"
            },
            {
                "sysName": "REPO.WORK_IN_FOREIGN_WORKSPACE",
                "objectName": "REPO.WORK_IN_FOREIGN_WORKSPACE",
                "type": "SYSTEMPRIVILEGE"
            },
            {
                "sysName": "RESOURCE ADMIN",
                "objectName": "RESOURCE ADMIN",
                "type": "SYSTEMPRIVILEGE"
            },
            {
                "sysName": "ROLE ADMIN",
                "objectName": "ROLE ADMIN",
                "type": "SYSTEMPRIVILEGE"
            },
            {
                "sysName": "SAVEPOINT ADMIN",
                "objectName": "SAVEPOINT ADMIN",
                "type": "SYSTEMPRIVILEGE"
            },
            {
                "sysName": "SCENARIO ADMIN",
                "objectName": "SCENARIO ADMIN",
                "type": "SYSTEMPRIVILEGE"
            },
            {
                "sysName": "SERVICE ADMIN",
                "objectName": "SERVICE ADMIN",
                "type": "SYSTEMPRIVILEGE"
            },
            {
                "sysName": "SESSION ADMIN",
                "objectName": "SESSION ADMIN",
                "type": "SYSTEMPRIVILEGE"
            },
            {
                "sysName": "STRUCTUREDPRIVILEGE ADMIN",
                "objectName": "STRUCTUREDPRIVILEGE ADMIN",
                "type": "SYSTEMPRIVILEGE"
            },
            {
                "sysName": "TENANT ADMIN",
                "objectName": "TENANT ADMIN",
                "type": "SYSTEMPRIVILEGE"
            },
            {
                "sysName": "TRACE ADMIN",
                "objectName": "TRACE ADMIN",
                "type": "SYSTEMPRIVILEGE"
            },
            {
                "sysName": "TRUST ADMIN",
                "objectName": "TRUST ADMIN",
                "type": "SYSTEMPRIVILEGE"
            },
            {
                "sysName": "USER ADMIN",
                "objectName": "USER ADMIN",
                "type": "SYSTEMPRIVILEGE"
            },
            {
                "sysName": "VERSION ADMIN",
                "objectName": "VERSION ADMIN",
                "type": "SYSTEMPRIVILEGE"
            }
        ]
    };
}

function getPackages(opts) {
    return {
        "packageInfos": [
            {
                "tenantID": "",
                "packageName": "sap.hana.adminconsole",
                "srcSystem": "R72",
                "srcTenant": "",
                "description": "",
                "responsible": "SAP",
                "originalLanguage": "en_US",
                "structural": false,
                "deliveryUnit": "ADMIN_CONSOLE",
                "vendor": "sap.com",
                "textCollection": "",
                "textStatus": "",
                "textTerminologyDomain": "",
                "hintsForTranslation": ""
            },
            {
                "tenantID": "",
                "packageName": "sap.hana.adminconsole.apps",
                "srcSystem": "R72",
                "srcTenant": "",
                "description": "",
                "responsible": "SAP",
                "originalLanguage": "en_US",
                "structural": false,
                "deliveryUnit": "ADMIN_CONSOLE",
                "vendor": "sap.com",
                "textCollection": "",
                "textStatus": "",
                "textTerminologyDomain": "",
                "hintsForTranslation": ""
            },
            {
                "tenantID": "",
                "packageName": "sap.hana.adminconsole.content",
                "srcSystem": "R72",
                "srcTenant": "",
                "description": "",
                "responsible": "SAP",
                "originalLanguage": "en_US",
                "structural": false,
                "deliveryUnit": "ADMIN_CONSOLE",
                "vendor": "sap.com",
                "textCollection": "",
                "textStatus": "",
                "textTerminologyDomain": "",
                "hintsForTranslation": ""
            },
            {
                "tenantID": "",
                "packageName": "sap.hana.adminconsole.db",
                "srcSystem": "R72",
                "srcTenant": "",
                "description": "",
                "responsible": "SAP",
                "originalLanguage": "en_US",
                "structural": false,
                "deliveryUnit": "ADMIN_CONSOLE",
                "vendor": "sap.com",
                "textCollection": "",
                "textStatus": "",
                "textTerminologyDomain": "",
                "hintsForTranslation": ""
            },
            {
                "tenantID": "",
                "packageName": "sap.hana.adminconsole.odata",
                "srcSystem": "R72",
                "srcTenant": "",
                "description": "",
                "responsible": "SAP",
                "originalLanguage": "en_US",
                "structural": false,
                "deliveryUnit": "ADMIN_CONSOLE",
                "vendor": "sap.com",
                "textCollection": "",
                "textStatus": "",
                "textTerminologyDomain": "",
                "hintsForTranslation": ""
            },
            {
                "tenantID": "",
                "packageName": "sap.hana.adminconsole.server",
                "srcSystem": "R72",
                "srcTenant": "",
                "description": "",
                "responsible": "SAP",
                "originalLanguage": "en_US",
                "structural": false,
                "deliveryUnit": "ADMIN_CONSOLE",
                "vendor": "sap.com",
                "textCollection": "",
                "textStatus": "",
                "textTerminologyDomain": "",
                "hintsForTranslation": ""
            },
            {
                "tenantID": "",
                "packageName": "sap.hana.adminconsole.server.lib",
                "srcSystem": "R72",
                "srcTenant": "",
                "description": "",
                "responsible": "SAP",
                "originalLanguage": "en_US",
                "structural": false,
                "deliveryUnit": "ADMIN_CONSOLE",
                "vendor": "sap.com",
                "textCollection": "",
                "textStatus": "",
                "textTerminologyDomain": "",
                "hintsForTranslation": ""
            },
            {
                "tenantID": "",
                "packageName": "sap.hana.adminconsole.ushell",
                "srcSystem": "R72",
                "srcTenant": "",
                "description": "",
                "responsible": "SAP",
                "originalLanguage": "en_US",
                "structural": false,
                "deliveryUnit": "ADMIN_CONSOLE",
                "vendor": "sap.com",
                "textCollection": "",
                "textStatus": "",
                "textTerminologyDomain": "",
                "hintsForTranslation": ""
            },
            {
                "tenantID": "",
                "packageName": "sap.hana.adminconsole.ushell.adapters",
                "srcSystem": "R72",
                "srcTenant": "",
                "description": "",
                "responsible": "SAP",
                "originalLanguage": "en_US",
                "structural": false,
                "deliveryUnit": "ADMIN_CONSOLE",
                "vendor": "sap.com",
                "textCollection": "",
                "textStatus": "",
                "textTerminologyDomain": "",
                "hintsForTranslation": ""
            },
            {
                "tenantID": "",
                "packageName": "sap.hana.adminconsole.ushell.bootstrap",
                "srcSystem": "R72",
                "srcTenant": "",
                "description": "",
                "responsible": "SAP",
                "originalLanguage": "en_US",
                "structural": false,
                "deliveryUnit": "ADMIN_CONSOLE",
                "vendor": "sap.com",
                "textCollection": "",
                "textStatus": "",
                "textTerminologyDomain": "",
                "hintsForTranslation": ""
            },
            {
                "tenantID": "",
                "packageName": "sap.hana.adminconsole.ushell.shells",
                "srcSystem": "R72",
                "srcTenant": "",
                "description": "",
                "responsible": "SAP",
                "originalLanguage": "en_US",
                "structural": false,
                "deliveryUnit": "ADMIN_CONSOLE",
                "vendor": "sap.com",
                "textCollection": "",
                "textStatus": "",
                "textTerminologyDomain": "",
                "hintsForTranslation": ""
            }
        ]
    };
}

function getApplicationPrivileges() {
    return {
        "apps": [
            {
                "appName": "sap.bi.admin.catalog::WidgetAccess:AdminExtensions",
                "objectName": "sap.bi.admin.catalog::WidgetAccess:AdminExtensions",
                "type": "APPLICATIONPRIVILEGE"
            },
            {
                "appName": "sap.hana.admin.uis::AppSiteAccess:monitoring",
                "objectName": "sap.hana.admin.uis::AppSiteAccess:monitoring",
                "type": "APPLICATIONPRIVILEGE"
            },
            {
                "appName": "sap.hana.admin.uis::WidgetAccess:monitoring",
                "objectName": "sap.hana.admin.uis::WidgetAccess:monitoring",
                "type": "APPLICATIONPRIVILEGE"
            },
            {
                "appName": "sap.hana.adminconsole.content::AppSiteAccess",
                "objectName": "sap.hana.adminconsole.content::AppSiteAccess",
                "type": "APPLICATIONPRIVILEGE"
            },
            {
                "appName": "sap.hana.adminconsole.content::WidgetAccess",
                "objectName": "sap.hana.adminconsole.content::WidgetAccess",
                "type": "APPLICATIONPRIVILEGE"
            },
            {
                "appName": "sap.hana.dbcc::Admin",
                "objectName": "sap.hana.dbcc::Admin",
                "type": "APPLICATIONPRIVILEGE"
            },
            {
                "appName": "sap.hana.dbcc::AppSiteAccess:dbccuis",
                "objectName": "sap.hana.dbcc::AppSiteAccess:dbccuis",
                "type": "APPLICATIONPRIVILEGE"
            },
            {
                "appName": "sap.hana.dbcc::Basic",
                "objectName": "sap.hana.dbcc::Basic",
                "type": "APPLICATIONPRIVILEGE"
            },
            {
                "appName": "sap.hana.dbcc::Monitoring",
                "objectName": "sap.hana.dbcc::Monitoring",
                "type": "APPLICATIONPRIVILEGE"
            },
            {
                "appName": "sap.hana.dbcc::WidgetAccess:catalog",
                "objectName": "sap.hana.dbcc::WidgetAccess:catalog",
                "type": "APPLICATIONPRIVILEGE"
            },
            {
                "appName": "sap.hana.ide.core::Consume",
                "objectName": "sap.hana.ide.core::Consume",
                "type": "APPLICATIONPRIVILEGE"
            },
            {
                "appName": "sap.hana.uis.content.AdminConsole::AppSiteAccess",
                "objectName": "sap.hana.uis.content.AdminConsole::AppSiteAccess",
                "type": "APPLICATIONPRIVILEGE"
            },
            {
                "appName": "sap.hana.uis.content.AdminConsole::WidgetAccess",
                "objectName": "sap.hana.uis.content.AdminConsole::WidgetAccess",
                "type": "APPLICATIONPRIVILEGE"
            },
            {
                "appName": "sap.hana.uis.content.hanahome::AppSiteAccess:HANAHomePage",
                "objectName": "sap.hana.uis.content.hanahome::AppSiteAccess:HANAHomePage",
                "type": "APPLICATIONPRIVILEGE"
            },
            {
                "appName": "sap.hana.uis.content.hanahome::WidgetAccess:HANADocumentationCatalog",
                "objectName": "sap.hana.uis.content.hanahome::WidgetAccess:HANADocumentationCatalog",
                "type": "APPLICATIONPRIVILEGE"
            },
            {
                "appName": "sap.hana.uis.content.hanahome::WidgetAccess:HANAToolsCatalog",
                "objectName": "sap.hana.uis.content.hanahome::WidgetAccess:HANAToolsCatalog",
                "type": "APPLICATIONPRIVILEGE"
            },
            {
                "appName": "sap.hana.uis.privileges::AppSiteAccess:All",
                "objectName": "sap.hana.uis.privileges::AppSiteAccess:All",
                "type": "APPLICATIONPRIVILEGE"
            },
            {
                "appName": "sap.hana.uis.privileges::CatalogAccess:All",
                "objectName": "sap.hana.uis.privileges::CatalogAccess:All",
                "type": "APPLICATIONPRIVILEGE"
            },
            {
                "appName": "sap.hana.uis.privileges::WidgetAccess:All",
                "objectName": "sap.hana.uis.privileges::WidgetAccess:All",
                "type": "APPLICATIONPRIVILEGE"
            },
            {
                "appName": "sap.hana.uiscontent.FioriOnHana::AppSiteAccess",
                "objectName": "sap.hana.uiscontent.FioriOnHana::AppSiteAccess",
                "type": "APPLICATIONPRIVILEGE"
            },
            {
                "appName": "sap.hana.uiscontent.HANALaunch::AppSiteAccess",
                "objectName": "sap.hana.uiscontent.HANALaunch::AppSiteAccess",
                "type": "APPLICATIONPRIVILEGE"
            },
            {
                "appName": "sap.hana.xs.admin::HTTPDestAdmin",
                "objectName": "sap.hana.xs.admin::HTTPDestAdmin",
                "type": "APPLICATIONPRIVILEGE"
            },
            {
                "appName": "sap.hana.xs.admin::HTTPDestView",
                "objectName": "sap.hana.xs.admin::HTTPDestView",
                "type": "APPLICATIONPRIVILEGE"
            },
            {
                "appName": "sap.hana.xs.admin::JobAdmin",
                "objectName": "sap.hana.xs.admin::JobAdmin",
                "type": "APPLICATIONPRIVILEGE"
            },
            {
                "appName": "sap.hana.xs.admin::JobView",
                "objectName": "sap.hana.xs.admin::JobView",
                "type": "APPLICATIONPRIVILEGE"
            },
            {
                "appName": "sap.hana.xs.admin::RuntimeConfAdmin",
                "objectName": "sap.hana.xs.admin::RuntimeConfAdmin",
                "type": "APPLICATIONPRIVILEGE"
            },
            {
                "appName": "sap.hana.xs.admin::RuntimeConfView",
                "objectName": "sap.hana.xs.admin::RuntimeConfView",
                "type": "APPLICATIONPRIVILEGE"
            },
            {
                "appName": "sap.hana.xs.admin::SAMLAdmin",
                "objectName": "sap.hana.xs.admin::SAMLAdmin",
                "type": "APPLICATIONPRIVILEGE"
            },
            {
                "appName": "sap.hana.xs.admin::SAMLView",
                "objectName": "sap.hana.xs.admin::SAMLView",
                "type": "APPLICATIONPRIVILEGE"
            },
            {
                "appName": "sap.hana.xs.admin::SQLCCAdmin",
                "objectName": "sap.hana.xs.admin::SQLCCAdmin",
                "type": "APPLICATIONPRIVILEGE"
            },
            {
                "appName": "sap.hana.xs.admin::SQLCCView",
                "objectName": "sap.hana.xs.admin::SQLCCView",
                "type": "APPLICATIONPRIVILEGE"
            },
            {
                "appName": "sap.hana.xs.admin::TrustStoreAdmin",
                "objectName": "sap.hana.xs.admin::TrustStoreAdmin",
                "type": "APPLICATIONPRIVILEGE"
            },
            {
                "appName": "sap.hana.xs.admin::TrustStoreView",
                "objectName": "sap.hana.xs.admin::TrustStoreView",
                "type": "APPLICATIONPRIVILEGE"
            },
            {
                "appName": "sap.hana.xs.debugger::Debugger",
                "objectName": "sap.hana.xs.debugger::Debugger",
                "type": "APPLICATIONPRIVILEGE"
            },
            {
                "appName": "sap.hana.xs.ide::Catalog",
                "objectName": "sap.hana.xs.ide::Catalog",
                "type": "APPLICATIONPRIVILEGE"
            },
            {
                "appName": "sap.hana.xs.ide::Editor",
                "objectName": "sap.hana.xs.ide::Editor",
                "type": "APPLICATIONPRIVILEGE"
            },
            {
                "appName": "sap.hana.xs.ide::LandingPage",
                "objectName": "sap.hana.xs.ide::LandingPage",
                "type": "APPLICATIONPRIVILEGE"
            },
            {
                "appName": "sap.hana.xs.ide::Security",
                "objectName": "sap.hana.xs.ide::Security",
                "type": "APPLICATIONPRIVILEGE"
            },
            {
                "appName": "sap.hana.xs.ide::Traces",
                "objectName": "sap.hana.xs.ide::Traces",
                "type": "APPLICATIONPRIVILEGE"
            },
            {
                "appName": "sap.hana.xs.lm::Administrator",
                "objectName": "sap.hana.xs.lm::Administrator",
                "type": "APPLICATIONPRIVILEGE"
            },
            {
                "appName": "sap.hana.xs.lm::Configure",
                "objectName": "sap.hana.xs.lm::Configure",
                "type": "APPLICATIONPRIVILEGE"
            },
            {
                "appName": "sap.hana.xs.lm::Display",
                "objectName": "sap.hana.xs.lm::Display",
                "type": "APPLICATIONPRIVILEGE"
            },
            {
                "appName": "sap.hana.xs.lm::ExecuteTransport",
                "objectName": "sap.hana.xs.lm::ExecuteTransport",
                "type": "APPLICATIONPRIVILEGE"
            },
            {
                "appName": "sap.hana.xs.lm::Transport",
                "objectName": "sap.hana.xs.lm::Transport",
                "type": "APPLICATIONPRIVILEGE"
            },
            {
                "appName": "sap.hana.xs.lm::View",
                "objectName": "sap.hana.xs.lm::View",
                "type": "APPLICATIONPRIVILEGE"
            },
            {
                "appName": "sap.hana.xs.sqlcc::Configure",
                "objectName": "sap.hana.xs.sqlcc::Configure",
                "type": "APPLICATIONPRIVILEGE"
            },
            {
                "appName": "sap.hana.xs.sqlcc::View",
                "objectName": "sap.hana.xs.sqlcc::View",
                "type": "APPLICATIONPRIVILEGE"
            }
        ]
    };
}

exports.post = function(req, res){
    switch(req.body.absoluteFunctionName) {
        // Roles
        case 'sap.hana.ide.core.base.server.getAllRoles':
            res.json(getAllRoles());
            break;
        // Granted Roles
        case 'sap.hana.ide.core.base.server.getRolesByGrantee':
            res.json(getRolesByGrantee(req.body.inputObject));
            break;
        // System Privileges
        case 'sap.hana.ide.core.base.server.getSystemPrivilegesByGrantee':
            res.json(getSystemPrivilegesByGrantee(req.body.inputObject));
            break;
        // SQL Privileges, Package Privileges, Application Privileges
        case 'sap.hana.ide.core.base.server.getPrivilegesByGrantee':
            res.json(getPrivilegesByGrantee(req.body.inputObject));
            break;
        case 'sap.hana.ide.core.base.server.getDetailedPrivilegesByGrantee':
            res.json(getDetailedPrivilegesByGrantee(req.body.inputObject));
            break;
        case 'sap.hana.ide.core.base.server.getSqlObjects':
            res.json(getSqlObjects(req.body.inputObject));
            break;
        case 'sap.hana.ide.core.base.server.updatePrivilege4Role':
            res.json(updatePrivilege4Role(req.body.inputObject));
            break;
        // Get role (after creating new)
        case 'sap.hana.ide.core.base.server.getRole':
            res.json(getRole(req.body.inputObject));
            break;
        // Delete role
        case 'sap.hana.ide.core.base.server.deleteRole':
            res.json(deleteRole(req.body.inputObject));
            break;
        // System Privileges Search
        case 'sap.hana.ide.core.base.server.getSystemPrivileges':
            res.json(getSystemPrivileges(req.body.inputObject));
            break;
        // Package Privileges Search
        case 'sap.hana.ide.core.base.server.getPackages':
            res.json(getPackages(req.body.inputObject));
            break;
        // Application Privileges Search
        case 'sap.hana.ide.core.base.server.getApplicationPrivileges':
            res.json(getApplicationPrivileges(req.body.inputObject));
            break;
        default:
            res.status(404).end();
    }
};