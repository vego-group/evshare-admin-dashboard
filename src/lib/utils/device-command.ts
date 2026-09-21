import type {
  VehicleDeviceCommand,
  VehicleDeviceCommandResponse,
  VehicleDeviceCommandWire,
} from "@/types/vehicle-operating-pricing";

function commandPayload(response: VehicleDeviceCommandResponse): VehicleDeviceCommandWire {
  return "data" in response ? response.data : response;
}

/** Normalize both the documented camelCase payload and the legacy snake_case envelope. */
export function normalizeVehicleDeviceCommand(
  response: VehicleDeviceCommandResponse,
): VehicleDeviceCommand {
  const command = commandPayload(response);
  const commandId = command.command_id ?? command.commandId;
  const correlationId = command.correlation_id ?? command.correlationId;
  const acceptedAt = command.accepted_at ?? command.acceptedAt;

  if (!commandId || !correlationId || !command.type || !command.status || !acceptedAt) {
    throw new Error("Invalid vehicle command response");
  }

  return {
    command_id: commandId,
    correlation_id: correlationId,
    type: command.type,
    status: command.status,
    physical_action_confirmed:
      command.physical_action_confirmed ?? command.physicalActionConfirmed ?? false,
    is_terminal: command.is_terminal,
    vehicle_id: command.vehicle_id ?? command.vehicleId,
    device_id: command.device_id ?? command.deviceId,
    accepted_at: acceptedAt,
    sent_at: command.sent_at ?? command.sentAt,
    acknowledged_at: command.acknowledged_at ?? command.acknowledgedAt,
    failed_at: command.failed_at ?? command.failedAt,
    timed_out_at: command.timed_out_at ?? command.timedOutAt,
    superseded_at: command.superseded_at ?? command.supersededAt,
    failure_code: command.failure_code ?? command.failureCode,
    failure_message: command.failure_message ?? command.failureMessage,
    attempts: command.attempts,
    max_attempts: command.max_attempts ?? command.maxAttempts,
    next_retry_at: command.next_retry_at ?? command.nextRetryAt,
    superseded_by: command.superseded_by ?? command.supersededBy,
    provider_command_id: command.provider_command_id ?? command.providerCommandId,
    dispatch_latency_ms: command.dispatch_latency_ms ?? command.dispatchLatencyMs,
    ack_latency_ms: command.ack_latency_ms ?? command.ackLatencyMs,
  };
}
