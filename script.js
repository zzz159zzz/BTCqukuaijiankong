
let lastNotified = null;
let TARGET = 900436;
const INTERVAL = 144;

function startMonitoring() {
  const input = document.getElementById("targetInput").value;
  const newTarget = parseInt(input, 10);
  if (!isNaN(newTarget)) {
    TARGET = newTarget;
    lastNotified = null;
    alert("已设置新目标高度：" + TARGET);
  } else {
    alert("请输入有效的区块高度数字！");
  }
  checkBlock(); // 马上执行一次
}

async function checkBlock() {
  try {
    const heightRes = await fetch("https://mempool.space/api/blocks/tip/height");
    const feeRes = await fetch("https://mempool.space/api/v1/fees/recommended");

    const height = parseInt(await heightRes.text(), 10);
    const feeData = await feeRes.json();
    const minFee = feeData.minimumFee;

    document.getElementById("status").innerText = "当前区块高度：" + height;
    document.getElementById("fee").innerText = "最低 gas 费：" + minFee + " sats/vB";

    if ((lastNotified === null && height >= TARGET) ||
        (lastNotified !== null && height - lastNotified >= INTERVAL)) {
      lastNotified = height;
      document.getElementById("notifySound").play();
      alert("📢 BTC 区块高度已达提醒点：" + height);
    }
  } catch (e) {
    console.error("获取数据失败", e);
  }
}

setInterval(checkBlock, 30000);
checkBlock();
