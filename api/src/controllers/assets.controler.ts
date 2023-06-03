// Express
import { CosmWasmClient } from 'cosmwasm';
import { Request, Response } from 'express';
import { getCosmWasmClient } from '../services/wasmclient.service';


// import { getPropertyInformation,getPropertiesState, getOwnedUUIDsList } from '../services/realestate.service';
import { getDetails_Offering_TokenData_Owner } from '../services/collections.service';

export const getAllTokenData = async (req: Request, res: Response) => {
    const { contract_address, token_id } = req.params;

    const client = await getCosmWasmClient();
    if(!client) { return res.status(500).json({ message: `Error: could not connect to craft node.` }); }

    const all_data = await getDetails_Offering_TokenData_Owner(client, contract_address, token_id);

    if (all_data) return res.status(200).json(all_data) 
    else return res.status(404).json({ message: `Error. This contract / token id is not found.` });
};

export default {
    getAllTokenData,
};