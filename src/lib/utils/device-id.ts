// Vego accepts a UUID device identifier, including UUIDs whose version is not known to this client.
export const isGatewayDeviceId = (value: string): boolean =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value.trim());
