import * as SettingsModel from "./settings.model.ts";

// Retrieve the auto extend bidding time settings formatted
export async function getAutoExtendTimeSetting() {
  const result = await SettingsModel.getAutoExtendTimeSetting();
  if (!result) return null;
  return {
    extend_time_minutes: result.extend_time,
    threshold_minutes: result.threshold_time,
  };
}
