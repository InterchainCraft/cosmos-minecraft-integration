import { Request, Response } from 'express';
import { getCosmWasmClient } from '../services/wasmclient.service';
import { queryOfferings, queryPaintingOfferings, queryFeatured } from '../services/nftmarketplace.service';

export const getMarketplaceOfferings = async (req: Request, res: Response) => {
    const client = await getCosmWasmClient();
    if(!client) { return res.status(500).json({ message: `Error: could not connect to craft node.` }); }

    const found = await queryOfferings(client, ""); // "" = all

    if (found) return res.status(200).json(found) 
    else return res.status(404).json({ message: 'Offerings not found' });
};

export const getMarketplaceOfferingsFromGivenWallet = async (req: Request, res: Response) => {
    const { craft_address } = req.params;

    const client = await getCosmWasmClient();
    if(!client) { return res.status(500).json({ message: `Error: could not connect to craft node.` }); }

    const found = await queryOfferings(client, "", craft_address); // "" = all
    if (found) return res.status(200).json(found) 
    else return res.status(404).json({ message: `Offerings not found for ${craft_address}` });
};

export const getSingleMarketplaceOffering = async (req: Request, res: Response) => {
    const { offering_id } = req.params;

    const client = await getCosmWasmClient();
    if(!client) { return res.status(500).json({ message: `Error: could not connect to craft node.` }); }

    const found = await queryOfferings(client, ""); // "" = all
    let foundOffering = undefined;
    if(offering_id) {
        // loop through found and find the one with the id
        foundOffering = found.find(offering => offering.offering_id === offering_id);
    }

    if (foundOffering) return res.status(200).json(foundOffering) 
    else return res.status(404).json({ message: `No offering with offering_id ${offering_id} found.` });
};



export const getMarketplaceRealEstateOfferings = async (req: Request, res: Response) => {
    const client = await getCosmWasmClient();
    if(!client) { return res.status(500).json({ message: `Error: could not connect to craft node.` }); }

    const found = await queryOfferings(client, `${process.env.ADDR721_REALESTATE}`); // all from our real estate collection

    if (found) return res.status(200).json(found) 
    else return res.status(404).json({ message: 'Real Estate offerings error' });
};

export const getMarketplacePaintingsOfferings = async (req: Request, res: Response) => {
    const client = await getCosmWasmClient();
    if(!client) { return res.status(500).json({ message: `Error: could not connect to craft node.` }); }

    const paintings_found = await queryPaintingOfferings(client);

    if (paintings_found) return res.status(200).json(paintings_found) 
    else return res.status(404).json({ message: 'Painting offerings error' });
};

export const getMarketplaceFeatured = async (req: Request, res: Response) => {
    // const amount = req.params.num_amount;
    const client = await getCosmWasmClient();
    if(!client) { return res.status(500).json({ message: `Error: could not connect to craft node.` }); }

    const featured = await queryFeatured(client, 3); // gets top 3 images & real estate

    if (featured) return res.status(200).json(featured) 
    else return res.status(404).json({ message: 'Featured endpoint error' });
};

export const getMarketplaceSpecificContractOffering = async (req: Request, res: Response) => {
    const { parent_contract_address } = req.params;
    const client = await getCosmWasmClient();
    if(!client) { return res.status(500).json({ message: `Error: could not connect to craft node.` }); }

    const found = await queryOfferings(client, parent_contract_address);
    if (found) return res.status(200).json(found) 
    else return res.status(404).json({ message: 'Specific contract offerings not found' });
};

export default {
    getMarketplaceOfferings,
    getMarketplaceRealEstateOfferings,    
    getMarketplacePaintingsOfferings,
    getMarketplaceSpecificContractOffering,
    getMarketplaceFeatured,
    getSingleMarketplaceOffering,
    getMarketplaceOfferingsFromGivenWallet,
};