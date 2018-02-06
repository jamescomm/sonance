

loadtest http://localhost:7357/exchanges/api/v1/exchange/exchange -t 2 -c 5 --rps 10000 -P '{"user_id": "5a682ba43fd2fa19ddfe3ded","amount":{"value":0.5,"currency":"BCH"},"volume":{"value":5,"currency":"INR"},"rate":0.1,"type":"BID"}'
