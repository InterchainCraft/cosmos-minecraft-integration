import { collections } from './database.service';

// The options associated with connections
type LinkOptions = {
    // discordId?: string;
    keplrId: string;
    minecraftId: string;
};

/**
 * Get the associated links a user has
 *
 * @param options - the available link params
 */
export const getLink = async (options: LinkOptions) => {
    let document;

    // if (options.discordId) {
    //     // Get link by Discord
    //     const discord = await collections?.connections?.find({ discordId: options.discordId }).tryNext();
    //     if (discord) document = discord;
    // }

    if (options.keplrId) {
        // Get links by Keplr id
        const keplr = await collections?.connections?.find({ keplrId: options.keplrId }).tryNext();
        if (keplr) document = keplr;
    }

    if (options.minecraftId) {
        //  Get links by Minecraft
        const minecraft = await collections?.connections?.find({ minecraftId: options.minecraftId }).tryNext();
        if (minecraft) document = minecraft;
    }

    return document;
};


/**
 * Get the uuid of their MC account based on 
 *
 * @param code - the available code they generated in game
 */
export const getMCUUID = async (minecraftCode: string) => {
    const document = await collections?.webappSyncCodes?.find({ code: minecraftCode }).tryNext();    
    return document;
};


export const deleteMCuuid = async (minecraftUUID: string) => {
    const document = await collections?.webappSyncCodes?.deleteOne({ _id: minecraftUUID });    
    return document;
};

/**
 * Create a link between multiple accounts a user has
 * @param {LinkOptions} options
 * @returns {Promise<InsertOneResult<Document> | undefined>}
 */
export const createLink = async (options: LinkOptions) => {
    // query the connections & find a document if any match
    const prev_document = await collections?.connections?.find({ $or: [
        // { discordId: options.discordId },
        { minecraftId: options.minecraftId },
        // { keplrId: options.keplrId },
    ] }).tryNext();

    // either way a new document is going in, so delete old sync code as its been used.
    deleteMCuuid(options.minecraftId);

    // if it does, we update the document with the new options
    if (prev_document) {
        const result = await collections?.connections?.updateOne({ _id: prev_document._id }, { $set: options });
        // console.log("Updated one: ", result);
        return result;
    }
    
    // console.log("Inserting new document: ", options);    
    return collections?.connections?.insertOne({
        // discordId: options.discordId,
        keplrId: options.keplrId,
        minecraftId: options.minecraftId
    });
};

/**
 * Confirm the existence of a link based on parameters
 * @param {LinkOptions} options
 * @returns {Promise<boolean>}
 */
export const doesLinkExist = async (options: LinkOptions) => {
    const document = await getLink(options);
    return document !== undefined;
};

export default {
    getLink,
    createLink
};
