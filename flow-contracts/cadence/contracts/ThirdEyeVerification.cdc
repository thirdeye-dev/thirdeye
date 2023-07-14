import NonFungibleToken from "./NonFungibleToken.cdc"
import MetadataViews from "./MetadataViews.cdc"

pub contract ThirdEyeVerification: NonFungibleToken {

    pub var totalSupply: UInt64

    pub event ContractInitialized()
    pub event Withdraw(id: UInt64, from: Address?)
    pub event Deposit(id: UInt64, to: Address?)

    pub let CollectionStoragePath: StoragePath
    pub let CollectionPublicPath: PublicPath
    pub let MinterStoragePath: StoragePath

    pub struct VerificationTokenData{
        pub let id: UInt64
        pub let unique_hash: String
        pub let image_url: String

        init(_id: UInt64, _unique_hash: String, _image_url: String){
            self.id = _id
            self.unique_hash = _unique_hash
            self.image_url = _image_url
        }
    }

    pub resource NFT: NonFungibleToken.INFT, MetadataViews.Resolver {
        pub let id: UInt64
        pub let unique_hash: String
        pub let image_url: String
    
        init(
            id: UInt64,
            unique_hash: String,
            image_url: String,
        ) {
            self.id = id
            self.unique_hash = unique_hash
            self.image_url = image_url
        }
    
        pub fun getViews(): [Type] {
            return [ Type<VerificationTokenData>() ]
        }

        pub fun resolveView(_ view: Type): AnyStruct? {
            switch view {
                case Type<VerificationTokenData>():
                return VerificationTokenData(
                    _id: self.id,
                    _unique_hash: self.unique_hash,
                    _image_url: self.image_url
                )
            }
            return nil
        }
    }

    pub resource interface VerificationTokenCollectionPublic {
        pub fun deposit(token: @NonFungibleToken.NFT)
        pub fun getIDs(): [UInt64]
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT
        pub fun borrowVerificationToken(id: UInt64): &ThirdEyeVerification.NFT? {
            post {
                (result == nil) || (result?.id == id):
                    "Cannot borrow VerificationToken reference: the ID of the returned reference is incorrect"
            }
        }
    }

    pub resource Collection: VerificationTokenCollectionPublic, NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection {
        // dictionary of NFT conforming tokens
        // NFT is a resource type with an `UInt64` ID field
        pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

        init () {
            self.ownedNFTs <- {}
        }

        // withdraw removes an NFT from the collection and moves it to the caller
        pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {
            let token <- self.ownedNFTs.remove(key: withdrawID) ?? panic("missing NFT")

            emit Withdraw(id: token.id, from: self.owner?.address)

            return <-token
        }

        // deposit takes an NFT and adds it to the collections dictionary
        // and adds the ID to the id array
        pub fun deposit(token: @NonFungibleToken.NFT) {
            let token <- token as! @ThirdEyeVerification.NFT

            let id: UInt64 = token.id

            // add the new token to the dictionary which removes the old one
            let oldToken <- self.ownedNFTs[id] <- token

            emit Deposit(id: id, to: self.owner?.address)

            destroy oldToken
        }

        // getIDs returns an array of the IDs that are in the collection
        pub fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        // borrowNFT gets a reference to an NFT in the collection
        // so that the caller can read its metadata and call its methods
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
            return (&self.ownedNFTs[id] as &NonFungibleToken.NFT?)!
        }
 
        pub fun borrowVerificationToken(id: UInt64): &ThirdEyeVerification.NFT? {
            if self.ownedNFTs[id] != nil {
                // Create an authorized reference to allow downcasting
                let ref = (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?)!
                return ref as! &ThirdEyeVerification.NFT
            }

            return nil
        }

        pub fun borrowViewResolver(id: UInt64): &AnyResource{MetadataViews.Resolver} {
            let nft = (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?)!
            let verificationToken = nft as! &ThirdEyeVerification.NFT
            return verificationToken as &AnyResource{MetadataViews.Resolver}
        }

        destroy() {
            destroy self.ownedNFTs
        }
    }

    // public function that anyone can call to create a new empty collection
    pub fun createEmptyCollection(): @NonFungibleToken.Collection {
        return <- create Collection()
    }

     pub fun mintNFT(
            recipient: &{NonFungibleToken.CollectionPublic},
            unique_hash: String,
            image_url: String,
        ) {

            // create a new NFT
            var newNFT <- create NFT(
                id: ThirdEyeVerification.totalSupply,
                unique_hash: unique_hash,
                image_url: image_url
            )

            // deposit it in the recipient's account using their reference
            recipient.deposit(token: <-newNFT)

            ThirdEyeVerification.totalSupply = ThirdEyeVerification.totalSupply + (1 as UInt64)
        }

    init() {
        // Initialize the total supply
        self.totalSupply = 0

        // Set the named paths
        self.CollectionStoragePath = /storage/VerificationTokenCollection
        self.CollectionPublicPath = /public/VerificationTokenCollection
        self.MinterStoragePath = /storage/VerificationTokenMinter

        // Create a Collection resource and save it to storage
        let collection <- create Collection()
        self.account.save(<-collection, to: self.CollectionStoragePath)

        // create a public capability for the collection
        self.account.link<&ThirdEyeVerification.Collection{NonFungibleToken.CollectionPublic, ThirdEyeVerification.VerificationTokenCollectionPublic, MetadataViews.ResolverCollection}>(
            self.CollectionPublicPath,
            target: self.CollectionStoragePath
        )

        emit ContractInitialized()
    }
}
