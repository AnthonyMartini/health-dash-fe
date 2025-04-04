self.addEventListener("push", function (event) {
  try {
    const data = event.data?.json();
    console.log("✅ Push Received:", data);

    const title = data?.title || "Default Title";
    const options = {
      body: data?.text || "Default body text",
      icon: data?.icon || "/AppIcon.svg", // replace or test with a public URL
    };

    event.waitUntil(
      self.registration.showNotification(title, options)
    );
  } catch (err) {
    console.error("❌ Error in push handler:", err);
    event.waitUntil(
      self.registration.showNotification("Push Error", {
        body: "Something went wrong handling the push notification.",
      })
    );
  }
});
