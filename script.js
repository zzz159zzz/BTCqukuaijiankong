
let TARGET = 900580;
const INTERVAL = 144;

async function getCurrentHeight() {
  const res = await fetch("https://mempool.space/api/blocks/tip/height");
  return parseInt(await res.text(), 10);
}

async function start() {
  const input = parseInt(document.getElementById("target").value, 10);
  if (!isNaN(input)) TARGET = input;

  document.getElementById("status").innerText = "状态：监控中，当前目标 " + TARGET;

  setInterval(async () => {
    try {
      const height = await getCurrentHeight();
      document.getElementById("status").innerText = "当前区块高度：" + height + "，目标：" + TARGET;

      if (height === TARGET) {
        document.getElementById("notifySound").play().catch(() => {});
        alert("📢 已达到目标区块高度：" + height);

        const res = await fetch("https://wxpusher.zjiecode.com/api/send/message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            appToken: "AT_jZEHbpWkOMVJIGA71l2GfIb4tC5Qp6td",
            content: `📢 BTC 区块已达目标高度：${height}`,
            summary: "BTC 区块提醒",
            contentType: 1,
            uids: ["UID_y3B2fzWDNHjlCaMXMOqAQt9LGzvH"]
          })
        });

        const result = await res.json();
        console.log("✅ WxPusher response:", result);

        TARGET += INTERVAL;
        document.getElementById("target").value = TARGET;
      }
    } catch (e) {
      console.error("区块检测失败：", e);
    }
  }, 30000);
}
