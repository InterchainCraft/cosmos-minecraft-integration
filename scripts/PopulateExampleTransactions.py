# Use redis to populate example transaction data for testing to a wallet
# COPY a key from the redis cache & paste it into unescape json to get the dict

import os
import json
import uuid
import time
# from random import randint
from secrets import randbelow
import redis
from dotenv import load_dotenv

load_dotenv()       

TX_TYPES = [ 'DEFAULT','TRADE', 'LIQUIDITY_POOL', 'COMPANY', 'LAND_CLAIM', 'REAL_ESTATE', "AUTHENTICATION"]

SCHEMA = {
    "amount":"1000000",
    "description":"Authenticating Reecepbcupsvia a 0craft sign time_1655308654917",
    "to_address":"craft10r39fueph9fq7a6lgswu4zdsg8t3gxlqd6lnf0",
    "tax":{
        "amount":1000, # ucraft
        "address":"craft10r39fueph9fq7a6lgswu4zdsg8t3gxlqd6lnf0"
    },
    "denom":"ucraft",
    "tx_type":"DEFAULT",
    "from_address":"craft10r39fueph9fq7a6lgswu4zdsg8t3gxlqd6lnf0",
    "timestamp":0
}

wallets = [
    # "craft1sv434uclts5u7ufrzqsmqvlxhkw04q84yuh0hj",
    # "craft14mt78hz73d9tdwpdvkd59ne9509kxw8y53sjt9",
    # "craft10r39fueph9fq7a6lgswu4zdsg8t3gxlqd6lnf0" # reece
    "craft1sv434uclts5u7ufrzqsmqvlxhkw04q84yuh0hj", # red
]

KEY_FORMAT = "tx_{WALLET}_{UUID}"

 # connect via uri with redis
r = redis.from_url(os.getenv("REDIS_URI"))

for i in range(50):
    for WALLET in wallets:
        # tx_craft14mt78hz73d9tdwpdvkd59ne9509kxw8y53sjt9_a298652c-fbce-47a0-8f7c-bf4deabafba8
        key = KEY_FORMAT.format(WALLET=WALLET, UUID=str(uuid.uuid4()))

        # make a copy of SCHEMA
        epoch = int(time.time())

        # copy schema and update values just for this 1 key
        SCHEMA_COPY = SCHEMA.copy()
        SCHEMA_COPY["tx_type"] = TX_TYPES[randbelow(len(TX_TYPES)-1)]
        SCHEMA_COPY["amount"] = f"{randbelow(10_000_000)}"
        if int(SCHEMA_COPY["amount"]) < 1_000_000:
            SCHEMA_COPY["amount"] = f"1000000"
        SCHEMA_COPY["description"] = f"Here is a test description for type {SCHEMA_COPY['tx_type']} time_{epoch}"
        SCHEMA_COPY["from_address"] = f"{WALLET}"

        # no tax for this one
        n = randbelow(4)
        if n == 1:
            # remove the tax section from the schema copy
            SCHEMA_COPY.pop("tax", None)
            SCHEMA_COPY["description"] = f"Here is a test description for type {SCHEMA_COPY['tx_type']} (NO TAX) time_{epoch}"
        
        SCHEMA_COPY["timestamp"] = epoch

        # just for python to show it as escaped json string. Dont save this to redis
        result = json.dumps(json.dumps(SCHEMA_COPY)) 
        print(result)        
        r.set(key, json.dumps(SCHEMA_COPY))
        print(key)

        # print keys in redis
        # print(r.keys())
        # exit()