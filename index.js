const { IPinfoWrapper } = require("node-ipinfo");
const playwright = require("playwright");

let si = require("systeminformation"),
    app = require("express")(),
    port = process.env.PORT || 3000;

function removeEmpty(obj) {
    return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
}
const IP = require("ip");
app.get("/", async (req, res) => {
    res.send(`<pre style="white-space: pre-wrap;">${JSON.stringify(await getIp(),undefined,2)}</pre>`);
});

async function getIp() {
    let browser = await playwright["chromium"].launch({
        headless: false,
        channel: "chrome",
    });
    let context = await browser.newContext();
    let page = await context.newPage();
    let respondIp = await page.evaluate(async () => {
        let dataip;
        await fetch("https://ipinfo.io?token=4b8af40cd4f57e").then(async (e) => {
            await e.json().then(async (e) => {
                await fetch(`http://api.positionstack.com/v1/reverse?access_key=e9bc72f138759ef21d8de8227f545f6c&query=${e.loc}&limit=20`)
                    .then(async (e) => await e.json())
                    .then((p) => {
                        dataip = e;
                        dataip.ips = p;
                    });
            });
        });

        return dataip;
    });
    await browser.close();
    return respondIp;
}

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
