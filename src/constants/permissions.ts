/**
 * Permission slugs shared with the Admin API.
 *
 * These checks improve the UI, but the API remains responsible for enforcing
 * every permission. New slugs must be rolled out by the backend before the
 * matching UI action is enabled for any role.
 */
export const ADMIN_PERMISSIONS = {
  trips: {
    cancel: "Admin Cancel Trips",
    end: "Admin End Trips",
  },
  users: {
    suspend: "Admin Suspend Users",
    reactivate: "Admin Reactivate Users",
    delete: "Admin Delete Users",
  },
  vehicles: {
    // The first slug is the current command contract; the second preserves a
    // safe UI rollout for tenants still carrying the split-permission name.
    sendCommand: ["Admin Send Vehicle Commands", "Admin Command Vehicles"],
    viewCommands: "Admin Index Vehicle Commands",
  },
  locks: {
    assign: "Admin Assign Locks",
    unassign: "Admin Unassign Locks",
  },
  operationCompanies: {
    editCommission: "Admin Edit Operation Company Commission",
    uploadContract: "Admin Upload Operation Company Contracts",
  },
  paymentRequests: {
    approve: "Admin Approve Payment Requests",
    reject: "Admin Reject Payment Requests",
  },
  vat: {
    export: "Admin Export VAT",
    viewExports: "Admin View VAT Exports",
  },
  reports: {
    generate: "Admin Generate Reports",
    // Downloads are served through the guarded export-details endpoint.
    download: "Admin View Reports",
  },
} as const;
