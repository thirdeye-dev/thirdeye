## ThirdEye listener

Standalone minimal listener to listen to important transactions.

### Simple mechanism

1. Listener listens to the transactions of a particular contract/wallet.
2. Listener filters out the transactions based of the expression provided.
3. Listener sends the filtered transaction to a webhook

### Important addons:
- Using memcached to store quick needed data.
