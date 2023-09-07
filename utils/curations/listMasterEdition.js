import { createTokenAccount } from "./createTokenAccount";
import { Metaplex, toBigNumber } from "@metaplex-foundation/js";
import { createCreateStoreInstruction, findVaultOwnerAddress, createSavePrimaryMetadataCreatorsInstruction, findPrimaryMetadataCreatorsAddress, createInitSellingResourceInstruction, findTreasuryOwnerAddress, createCreateMarketInstruction, createChangeMarketInstruction } from "@metaplex-foundation/mpl-fixed-price-sale";
import { BN } from "@project-serum/anchor";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { Transaction, Keypair, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

export const getListMasterEditionTX = async ({
  connection,
  masterEdition,
  editionPrice,
  piecesPerWallet,
  ownerPubkey,
}) => {
  if (editionPrice === undefined) throw new Error("Edition price is required");

  const masterEditionPubkey = new PublicKey(masterEdition.mint)
  const primarySaleHappened = masterEdition.primary_sale_happened
  const editionName = masterEdition.name
  const maxSupply = masterEdition.max_supply - masterEdition.supply
  const creators = masterEdition.creators
  const storeName = `${editionName} Store`
  const storeDescription = `This is the store of ${editionName}.`

  //CREATE STORE 
  const mainTX = new Transaction();
  const signers = []

  const storeKeypair = Keypair.generate()
  const store = storeKeypair.publicKey
  console.log("Edition Store PublicKey", store.toString())


  const storeInstruction = createCreateStoreInstruction(
    { admin: ownerPubkey, store },
    { name: storeName, description: storeDescription }
  )

  mainTX.add(storeInstruction)
  signers.push(storeKeypair)

  //CREATE MARKET
  //Initialize Selling Resource
  const metaplex = Metaplex.make(connection);
  const pdas = metaplex.nfts().pdas();
  const metadata = pdas.metadata({ mint: masterEditionPubkey });
  const edition = pdas.edition({ mint: masterEditionPubkey });
  const editionBump = edition.bump;
  const resourceTokenPubkey = await getAssociatedTokenAddress(masterEditionPubkey, ownerPubkey)

  //init vault
  const [vaultOwner, vaultOwnerBump] = await findVaultOwnerAddress(masterEditionPubkey, store);
  const { tokenAccount: vault, createTokenTx: createVaultTx } = await createTokenAccount({
    payer: ownerPubkey,
    mint: masterEditionPubkey,
    connection,
    owner: vaultOwner,
  });

  mainTX.add(createVaultTx)
  signers.push(vault)

  //init selling resource
  const sellingResource = Keypair.generate();

  const initSellingResourceInstruction = createInitSellingResourceInstruction(
    {
      store: store,
      admin: ownerPubkey,
      sellingResource: sellingResource.publicKey,
      sellingResourceOwner: ownerPubkey,
      metadata,
      masterEdition: edition,
      resourceMint: masterEditionPubkey,
      resourceToken: resourceTokenPubkey,
      vault: vault.publicKey,
      owner: vaultOwner,
    },
    {
      masterEditionBump: editionBump,
      vaultOwnerBump,
      maxSupply,
    },
  );

  mainTX.add(initSellingResourceInstruction)
  signers.push(sellingResource)

  if (!primarySaleHappened) {
    const { savePrimaryMetadataCreatorsInstruction, primaryMetadataCreators } =
      await createSavePrimaryMetadataCreators({
        payer: { publicKey: ownerPubkey },
        metadata: metadata,
        creators: creators.map(c => ({
          ...c,
          address: new PublicKey(c.address),
        })),
      });
    mainTX.add(savePrimaryMetadataCreatorsInstruction);
  }

  //Create Market
  const treasuryMint = new PublicKey("11111111111111111111111111111111") //111... is native sol
  const [treasuryOwner, treasuryOwnerBump] = await findTreasuryOwnerAddress(
    treasuryMint,
    sellingResource.publicKey,
  );


  //ONLY USED FOR NON NATIVE SOL TOKENS
  // const { tokenAccount: treasuryHolder, createTokenTx: createTreasuryHolderTx } = await createTokenAccount({
  //   payer: ownerPubkey,
  //   connection,
  //   mint: treasuryMint,
  //   owner: treasuryOwner,
  // });

  // mainTX.add(createTreasuryHolderTx)
  // signers.push(treasuryHolder)

  //USED TO TOKEN GATE
  const remainingAccounts = [];
  const gatingConfig = null
  // If token gating
  // if (collectionMint) {
  //   remainingAccounts.push({ pubkey: collectionMint!, isWritable: true, isSigner: false });
  // }

  const marketKeyPair = Keypair.generate();
  const market = marketKeyPair.publicKey
  console.log("Edition Market Pubkey", market.toString())

  const startDate = Math.round(Date.now() / 1000) + 5;
  const endDate = null //TODO alow this to be user set?
  const params = {
    name: `${ editionName } Market`,
    description: `This is the market of ${ editionName }.`,
    startDate,
    endDate,
    mutable: true,
    price: Number(editionPrice) * LAMPORTS_PER_SOL,
    piecesInOneWallet: piecesPerWallet ?? maxSupply,
    gatingConfig,
  };

  const createMarketInstruction = createCreateMarketInstruction(
    {
      market: market,
      store: store,
      sellingResourceOwner: ownerPubkey,
      sellingResource: sellingResource.publicKey,
      mint: treasuryMint,
      treasuryHolder: treasuryOwner,//treasuryHolder.publicKey, //use holder for non native sol tokens
      owner: treasuryOwner,
      anchorRemainingAccounts: remainingAccounts,
    },
    {
      treasuryOwnerBump,
      ...params,
    },
  );

  mainTX.add(createMarketInstruction)
  signers.push(marketKeyPair)

  console.log("List Master Edition TX built")

  mainTX.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  mainTX.feePayer = ownerPubkey;
  mainTX.partialSign(...signers)

  console.log("List Master Edition TX partially signed")

  return {
    listMasterEditionTX: mainTX,
    editionMarketAddress: marketKeyPair.publicKey.toString()
  }
}

export const createSavePrimaryMetadataCreators = async ({
  payer,
  metadata,
  creators,
}) => {
  const [primaryMetadataCreators, primaryMetadataCreatorsBump] = await findPrimaryMetadataCreatorsAddress(metadata);

  const savePrimaryMetadataCreatorsInstruction = createSavePrimaryMetadataCreatorsInstruction(
    {
      admin: payer.publicKey,
      metadata,
      primaryMetadataCreators,
    },
    {
      primaryMetadataCreatorsBump,
      creators,
    },
  );

  return { savePrimaryMetadataCreatorsInstruction, primaryMetadataCreators };
};



//NOT COMPLETE
const changeMarket = async () => {
  const marketPubkey = new PublicKey()
  const changeInstruction = createChangeMarketInstruction(
    {
      // market: marketPubkey,
      // owner: wallet.publicKey,
      // clock: SYSVAR_CLOCK_PUBKEY
    },
    {
      // newName: beet.COption < string >;
      // newDescription: beet.COption < string >;
      // mutable: beet.COption < boolean >;
      // newPrice: beet.COption < beet.bignum >;
      // newPiecesInOneWallet: beet.COption < beet.bignum >;
    }
  )
}