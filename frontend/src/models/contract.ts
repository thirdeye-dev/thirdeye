export default class Contract {
  id: number;
  name: string;
  address: string;
  chain: string;
  network: string;

  constructor(
    id: number,
    name: string,
    address: string,
    chain: string,
    network: string
  ) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.chain = chain;
    this.network = network;
  }
}
