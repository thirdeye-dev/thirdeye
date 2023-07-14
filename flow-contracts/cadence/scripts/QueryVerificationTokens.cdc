import ThirdEyeVerification from "../contracts/ThirdEyeVerification.cdc"
import MetadataViews from "../contracts/MetadataViews.cdc"

pub fun main(address: Address): [ThirdEyeVerification.VerificationTokenData] {
  let collection = getAccount(address).getCapability(ThirdEyeVerification.CollectionPublicPath)
                    .borrow<&{MetadataViews.ResolverCollection}>()
                    ?? panic("Could not borrow a reference to the nft collection")

  let ids = collection.getIDs()

  let answer: [ThirdEyeVerification.VerificationTokenData] = []

  for id in ids {
    
    let nft = collection.borrowViewResolver(id: id)
    let view = nft.resolveView(Type<ThirdEyeVerification.VerificationTokenData>())!

    let display = view as! ThirdEyeVerification.VerificationTokenData
    answer.append(display)
  }
    
  return answer
}
