self.addEventListener("push", function (event) {
  try {
    const data = event.data?.json();
    console.log("📨 Push Event Received");
    console.log("📦 Raw Notification Data:", event.data);
    console.log("📝 Parsed Notification Data:", data);
    console.log("🔔 Notification Title:", data?.title);
    console.log("📄 Notification Body:", data?.text);
    console.log("🖼️ Notification Icon:", data?.icon);

    const title = data?.title || "Default Title";
    const options = {
      body: data?.text || "Default body text",
      icon: data?.icon || "/AppIcon.svg", // replace or test with a public URL
      data: data, // Include the full data in the notification
    };

    event.waitUntil(
      self.registration.showNotification(title, options)
        .then(() => console.log("✅ Notification displayed successfully"))
        .catch(err => console.error("❌ Error displaying notification:", err))
    );
  } catch (err) {
    console.error("❌ Error in push handler:", err);
    console.error("❌ Error details:", {
      message: err.message,
      stack: err.stack,
      name: err.name
    });
    event.waitUntil(
      self.registration.showNotification("Push Error", {
        body: "Something went wrong handling the push notification.",
      })
    );
  }
});
