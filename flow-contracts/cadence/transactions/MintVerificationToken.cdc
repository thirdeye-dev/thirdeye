import ThirdEyeVerification from "../contracts/ThirdEyeVerification.cdc"
import NonFungibleToken from "../contracts/NonFungibleToken.cdc"
import MetadataViews from "../contracts/MetadataViews.cdc"

transaction(type: String, url: String){
    let recipientCollection: &ThirdEyeVerification.Collection{NonFungibleToken.CollectionPublic}

    prepare(signer: AuthAccount) {
      if signer.borrow<&ThirdEyeVerification.Collection>(from: ThirdEyeVerification.CollectionStoragePath) == nil {
        signer.save(<- ThirdEyeVerification.createEmptyCollection(), to: ThirdEyeVerification.CollectionStoragePath)
        signer.link<&ThirdEyeVerification.Collection{NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection}>(ThirdEyeVerification.CollectionPublicPath, target: ThirdEyeVerification.CollectionStoragePath)
      }

      self.recipientCollection = signer.getCapability(ThirdEyeVerification.CollectionPublicPath)
                                  .borrow<&ThirdEyeVerification.Collection{NonFungibleToken.CollectionPublic}>()!
      }

    execute {
      ThirdEyeVerification.mintNFT(recipient: self.recipientCollection, type: type, url: url)

      log("Successfully Minted Verification Token")
    }
}
