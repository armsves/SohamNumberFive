'use client';
import { Button, LiveFeedback } from '@worldcoin/mini-apps-ui-kit-react';
import { MiniKit, Tokens, tokenToDecimals } from '@worldcoin/minikit-js';
import { useState } from 'react';
import CounterABI from '../../abi/CounterABI.json'
import { useWaitForTransactionReceipt } from '@worldcoin/minikit-react'
import { createPublicClient, http } from 'viem'
import { worldchainSepolia } from 'viem/chains' // or whichever chain you're using

/**
 * This component is used to pay a user
 * The payment command simply does an ERC20 transfer
 * But, it also includes a reference field that you can search for on-chain
 */
export const Pay = () => {
  const [buttonState, setButtonState] = useState<
    'pending' | 'success' | 'failed' | undefined
  >(undefined);

  const [transactionId, setTransactionId] = useState<string>('')

  const client = createPublicClient({
    chain: worldchainSepolia,
    transport: http('https://worldchain-sepolia.g.alchemy.com/public'),
  })

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    client: client,
    appConfig: {
      app_id: 'app_af648d1a39b0883df61f50ec01b3d2ab',
    },
    transactionId: transactionId,
  })

  console.log('isConfirming', isConfirming)
  console.log('isConfirmed', isConfirmed)

  const onClickPay = async () => {
    // Lets use Alex's username to pay!
    const address = (await MiniKit.getUserByUsername('armsves')).walletAddress;
    setButtonState('pending');

    const res = await fetch('/api/initiate-payment', {
      method: 'POST',
    });
    const { id } = await res.json();

    const result = await MiniKit.commandsAsync.pay({
      reference: id,
      to: address ?? '0x0000000000000000000000000000000000000000',
      tokens: [
        {
          symbol: Tokens.USDC,
          token_amount: tokenToDecimals(0.1, Tokens.USDC).toString(),
        },
      ],
      description: 'Test example payment for minikit',
    });

    console.log(result.finalPayload);
    if (result.finalPayload.status === 'success') {
      setButtonState('success');
      // It's important to actually check the transaction result on-chain
      // You should confirm the reference id matches for security
      // Read more here: https://docs.world.org/mini-apps/commands/pay#verifying-the-payment
    } else {
      setButtonState('failed');
      setTimeout(() => {
        setButtonState(undefined);
      }, 3000);
    }
  };

  const onClickIncrement = async () => {
    console.log('Incrementing contract counter');

      try {
        const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
          transaction: [
            {
              address: '0xf6c9f4A8e497677AC5e01DaF90e549605d5FFC5A',
              abi: CounterABI,
              functionName: "inc",
              args: [],
            },
          ],
        });
        console.log("Transaction payload:", finalPayload);

        if (finalPayload.status === "error") {
          console.error("Error Incrementing counter:", finalPayload);
          return;
        }

        console.log("Minting successful:", finalPayload);
        //onSuccess(finalPayload.transaction_id);
        setTransactionId(finalPayload.transaction_id);
      } catch (error) {
        console.error("Error minting tokens:", error);
      } finally {
        //setIsLoading(false);
      }

    }

    return (
      <div className="grid w-full gap-4">
        <p className="text-lg font-semibold">Pay</p>
        <LiveFeedback
          label={{
            failed: 'Payment failed',
            pending: 'Payment pending',
            success: 'Payment successful',
          }}
          state={buttonState}
          className="w-full"
        >
          <Button
            onClick={onClickPay}
            disabled={buttonState === 'pending'}
            size="lg"
            variant="primary"
            className="w-full"
          >
            Pay
          </Button>

          <Button
            onClick={onClickIncrement}
            disabled={buttonState === 'pending'}
            size="lg"
            variant="primary"
            className="w-full"
          >
            Increment contract counter
          </Button>
        </LiveFeedback>
      </div>
    );
  };
