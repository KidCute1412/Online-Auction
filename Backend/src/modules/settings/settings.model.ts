import db from "@/config/database.config.ts";

// Fetch the automatic bidding extension settings
export async function getAutoExtendTimeSetting() {
  const query = await db.raw(`
    select extend_time, threshold_time from extend_bidding_time limit 1
  `);
  return query.rows[0] || null;
}
