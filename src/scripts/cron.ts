Deno.cron("sample cron", "*/1 * * * *", () => {
  console.log("cron job executed every 1 minute")
})