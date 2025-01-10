export const coinStat = async (req, res) => {
    try {

        const crypto = req.body.coin;

        const url = `https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&include_market_cap=true&include_24hr_change=true&ids=`+crypto;
        console.log(url);
        const options = { method: 'GET', headers: { accept: 'application/json', 'x-cg-demo-api-key': process.env.COINGECKO_API_KEY } };
        let op;
        await fetch(url, options)
            .then(res => res.json())
            .then(json => op = json)
            .catch(err => console.error(err));


        console.log(op[crypto]);
        res.status(200).json({price:op[crypto].usd, market_cap:op[crypto].usd_market_cap, "24hChange":op[crypto].usd_24h_change});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};